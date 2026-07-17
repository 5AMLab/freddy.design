"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Samples the actual rendered pixels directly behind the fixed nav and
 * returns whether that strip currently reads as light or dark — so the nav
 * can flip its own ink colour to stay legible over whatever's under it
 * (a light Pricing-style field, a bright patch of a case-study photo, etc.)
 * instead of the old per-page hardcoded guess (`pathname === "/pricing"`).
 *
 * How: on scroll (rAF-throttled), walk up from the CENTRE POINT of the nav's
 * own horizontal strip via `elementsFromPoint`, find the topmost <img> there
 * (both `next/image` and the hero's raw <img> layers render as real <img>
 * elements), and draw the small on-screen slice of that image which sits
 * behind the nav onto an offscreen canvas. Reading its pixels and averaging
 * luminance is a REAL measurement of what's painted, not a heuristic — it
 * works on a busy photo where no single "is this page light or dark" flag
 * could be right for every scroll position.
 *
 * Falls back to the element's computed `background-color` when there's no
 * image there (a plain CSS-coloured section, e.g. .kloaq-light-section) —
 * canvas sampling only applies to bitmap content.
 *
 * Every source image on this site is same-origin (served through Next's own
 * `/_next/image` optimiser, no remote loader configured — see
 * next.config.mjs), so `getImageData` never hits a canvas security/taint
 * error. If that ever changes (a remote image host gets added), sampling
 * that image will throw and this hook quietly falls back to the
 * background-color path instead of crashing the nav.
 *
 * Only runs while `active` (the caller passes `!scrolled`) — once the nav
 * becomes its own opaque dark bar there is nothing to sample against, cream
 * ink always reads fine on it.
 */
export function useNavBgSample(active: boolean): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    if (typeof window === "undefined") return;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // A short horizontal strip at the vertical centre of the (unscrolled,
    // transparent) nav — tall enough to catch real image content, short
    // enough to stay cheap to sample every scroll frame.
    const SAMPLE_Y = 40;
    const SAMPLE_H = 8;
    const SAMPLE_W = 8;

    const luminance = (r: number, g: number, b: number) =>
      // Perceived brightness (ITU-R BT.601) — matches how the eye actually
      // weights channels, not a flat RGB average.
      0.299 * r + 0.587 * g + 0.114 * b;

    const sample = () => {
      tickingRef.current = false;
      const x = window.innerWidth / 2;
      const y = SAMPLE_Y;

      // Topmost real image element under the sample point, if any.
      const stack =
        typeof document.elementsFromPoint === "function"
          ? document.elementsFromPoint(x, y)
          : [];
      const img = stack.find(
        (el): el is HTMLImageElement =>
          el.tagName === "IMG" && (el as HTMLImageElement).complete
      );

      if (img && img.naturalWidth > 0) {
        try {
          const rect = img.getBoundingClientRect();
          // Map the viewport sample rect onto the image's OWN natural pixel
          // space, accounting for object-fit: cover scaling+cropping (every
          // photo on this site uses cover) so the sampled pixels are the
          // ones actually visible on screen, not a naive stretch.
          const scale = Math.max(
            rect.width / img.naturalWidth,
            rect.height / img.naturalHeight
          );
          const renderedW = img.naturalWidth * scale;
          const renderedH = img.naturalHeight * scale;
          const offsetX = (renderedW - rect.width) / 2;
          const offsetY = (renderedH - rect.height) / 2;

          const srcX = (x - rect.left + offsetX) / scale;
          const srcY = (y - SAMPLE_H / 2 - rect.top + offsetY) / scale;
          const srcW = SAMPLE_W / scale;
          const srcH = SAMPLE_H / scale;

          canvas.width = SAMPLE_W;
          canvas.height = SAMPLE_H;
          ctx.drawImage(
            img,
            srcX,
            srcY,
            srcW,
            srcH,
            0,
            0,
            SAMPLE_W,
            SAMPLE_H
          );
          const { data } = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H);
          let total = 0;
          let count = 0;
          for (let i = 0; i < data.length; i += 4) {
            // Skip fully transparent pixels (e.g. a PNG's empty margin) —
            // they'd otherwise pull the average toward whatever colour
            // canvas treats "nothing" as.
            if (data[i + 3] === 0) continue;
            total += luminance(data[i], data[i + 1], data[i + 2]);
            count++;
          }
          if (count > 0) {
            setTheme(total / count > 150 ? "light" : "dark");
            return;
          }
        } catch {
          // Same-origin by construction (see the doc comment above), but if
          // a future remote image ever taints the canvas, fall through to
          // the background-colour path below rather than throwing.
        }
      }

      // No sampleable image here — read the plain CSS background instead.
      // The element AT the point is very often something with no background
      // of its own (a heading, a <p>, a <span> — text nodes paint no fill),
      // which reads as transparent (rgba(0,0,0,0)) and would wrongly score
      // as "dark" (luminance 0) even sitting on a light section. Walk up the
      // ancestor chain until an element with an actual opaque-ish fill is
      // found, the same way the browser itself composites a transparent
      // element over whatever is beneath it.
      let el = document.elementFromPoint(x, y) as Element | null;
      while (el) {
        const bg = getComputedStyle(el).backgroundColor;
        const m = bg.match(/[\d.]+/g);
        if (m && m.length >= 3) {
          const [r, g, b, a = 1] = m.map(Number);
          if (a > 0.5) {
            setTheme(luminance(r, g, b) > 150 ? "light" : "dark");
            return;
          }
        }
        el = el.parentElement;
      }
      setTheme("dark");
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      rafRef.current = requestAnimationFrame(sample);
    };

    // An immediate sample can land before the page has actually settled
    // (elementFromPoint returning <main> instead of the section painted on
    // top of it, on a route that has no entrance animation of its own to
    // explain the delay) — a couple of rAF ticks isn't enough to clear
    // whatever this race is, but a short timeout reliably is. The
    // (harmless) synchronous call first covers the common case instantly;
    // the timeout corrects it on the rarer mistimed first paint.
    sample();
    const initialTimer = window.setTimeout(sample, 150);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(initialTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  return theme;
}
