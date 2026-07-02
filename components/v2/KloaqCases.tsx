"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { projects } from "@/lib/work";
import HeroReel from "@/components/v2/HeroReel";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

/**
 * Kloaq's signature, freddy-skinned: the portfolio as a packed typographic
 * "cloud" rather than a grid or list. Project names are set huge in condensed
 * caps (Anton) and flow as wrapping inline blocks with their category as an
 * inline tag, so they tessellate into a dense field.
 *
 * Hovering a name reveals that project's portfolio image, which fades in and
 * trails the cursor with GSAP easing (quickTo, reference: hover-reveal
 * project list) rather than snapping straight to it. The page-wide cursor
 * dot itself lives in KloaqCursor.tsx (mounted once at the page level, not
 * per-section) and pulses larger over `.kloaq-case` on its own via a
 * `mouseover` listener there — this component only owns the thumb trail.
 * The image sits behind the case names (z-index) so the hovered name's
 * outline/ghost treatment stays legible on top of it, the same treatment
 * "All work" already had at rest.
 *
 * Touch/tablet (pointer: coarse) has no hover or cursor to follow, so cases
 * get a tap-to-reveal fallback there: first tap on an inactive case pins the
 * preview at the tap point instead of navigating; a visible × button on the
 * preview closes it. Tapping the already-active case still navigates through
 * (no need to close first). See the `tap` handler below.
 *
 * Review-page-only display overrides: this study renders shorter labels for
 * a couple of projects than lib/work.ts's `client` field (kept as-is there
 * so the live /work index and detail pages are untouched) — also keeps their
 * mobile row to one line.
 */
const DISPLAY_NAME: Record<string, string> = {
  "maison-freddy-cold-brew": "Blue Cat",
  "cognitiv-ai-brand": "Cognitiv",
  // È's accent mark overlapped Cognitiv's row above it in the cloud's tight
  // line-height — plain E avoids the collision (live /work pages keep the é).
  "hermes-terre-campaign": "Hermes",
};
export default function KloaqCases() {
  const thumbRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  // Mirrors `active` so the tap handler always reads the latest value
  // synchronously — reading `active` from the closure caused a race on
  // Android, where two fast taps could both see the pre-update value and
  // both treat themselves as "first tap," letting the second one's default
  // click-through reach the <a> and navigate before setActive's re-render
  // ever landed.
  const activeRef = useRef<string | null>(null);

  // GSAP quickTo setters for the thumb trail, built once on mount (fine
  // pointer + motion allowed only — see the effect below) and read from the
  // mousemove/tap handlers via this ref so those handlers don't need to
  // recreate them on every render.
  const thumbToRef = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);

  const isCoarse = () => !window.matchMedia("(pointer: fine)").matches;

  // One-time setup: builds the quickTo setters used by move()/tap() below.
  // .kloaq-thumb has no centering transform (see kloaq.css) — it anchors its
  // top-left corner to the raw x/y point, reference-image style. Skipped
  // entirely for touch or reduced-motion, so those visitors never pay for
  // GSAP's per-frame ticker.
  useEffect(() => {
    if (isCoarse() || prefersReducedMotion()) return;
    const thumb = thumbRef.current;
    if (!thumb) return;

    // Starting scale now lives here instead of CSS (see .kloaq-thumb in
    // kloaq.css) — quickTo(x)/quickTo(y) below claims the transform
    // property, so scale has to be set through GSAP from the start too or
    // the first hover-in would jump from GSAP's default scale(1) instead of
    // growing from 0.92.
    gsap.set(thumb, { scale: 0.92 });

    thumbToRef.current = {
      x: gsap.quickTo(thumb, "x", { duration: 0.5, ease: "power3.out" }),
      y: gsap.quickTo(thumb, "y", { duration: 0.5, ease: "power3.out" }),
    };
  }, []);

  // Fine-pointer only — on touch, some browsers fire synthetic mousemove
  // events during a tap/drag (e.g. a finger sliding slightly while pressed),
  // which was re-pinning the thumb mid-touch and made it feel like the
  // preview was "running away" when reaching for the close button.
  const move = (e: React.MouseEvent) => {
    if (isCoarse()) return;
    thumbToRef.current?.x(e.clientX);
    thumbToRef.current?.y(e.clientY);
  };

  const setActiveCase = (id: string | null) => {
    activeRef.current = id;
    setActive(id);
  };

  // Coarse pointers (touch) get a tap-to-reveal instead of hover: first tap
  // pins the preview at the tap point and stops there; a close (×) button on
  // the preview itself dismisses it — tapping the same case again also
  // navigates through, so the preview isn't a dead end. Some touch browsers
  // (notably iPad Safari) synthesize a mouseenter right before the click on
  // an <a>, so onMouseEnter below is also gated behind isCoarse() —
  // otherwise that synthetic hover would set `active` before this handler
  // runs, making the "first tap" check below a no-op and sending every tap
  // straight through to navigation.
  const tap = (e: React.MouseEvent, id: string) => {
    if (!isCoarse()) return;
    if (activeRef.current !== id) {
      e.preventDefault();
      // No quickTo setters on touch (the setup effect above bails out for
      // coarse pointers), so the pinned position is set directly via
      // left/top instead. .kloaq-thumb has no centering transform (its
      // frame's top-left corner anchors to the x/y point, matching the
      // cursor dot on desktop) — offset by half the frame's own size here
      // so the touch-pinned preview centers under the tap point instead of
      // opening mostly off-screen near an edge.
      const el = thumbRef.current;
      if (el) {
        const { width, height } = el.getBoundingClientRect();
        el.style.left = `${e.clientX - width / 2}px`;
        el.style.top = `${e.clientY - height / 2}px`;
      }
      setActiveCase(id);
    }
  };

  // Grows the thumb from its resting 0.92 to full size while a case is
  // hovered. Plain gsap.to() — NOT quickTo. quickTo's resetTo() (what each
  // call after the first uses internally) requires the target property to
  // already belong to an existing PropTween on some tween for that element;
  // scale was only ever set via gsap.set() (not a real tween), so the first
  // .scale() call failed with GSAP's own "scale not eligible for reset"
  // warning and silently no-opped instead of animating — same end result as
  // the original bug (stuck at 0.92), just from a different cause. A normal
  // gsap.to() has no such prerequisite, and GSAP correctly merges it with
  // the x/y quickTo tween into one combined transform on the same element
  // without either overwriting the other — the two systems share the
  // underlying CSSPlugin transform cache regardless of which API created
  // each tween.
  useEffect(() => {
    if (isCoarse() || prefersReducedMotion()) return;
    const thumb = thumbRef.current;
    if (!thumb) return;
    gsap.to(thumb, { scale: active ? 1 : 0.92, duration: 0.45, ease: "power3.out" });
  }, [active]);

  const activeProject = projects.find((p) => p.id === active);

  return (
    <section
      className="kloaq-cases-section"
      id="cases"
      onMouseMove={move}
    >
      <div className="kloaq-vlabel">Projects</div>

      <div className="kloaq-cases-content">
        <div className="kloaq-cloud">
          {projects.map((p, i) => (
            <a
              key={p.id}
              href={`/work/${p.slug}`}
              className={`kloaq-case${active === p.id ? " is-active" : ""}`}
              onMouseEnter={() => {
                if (!isCoarse()) setActiveCase(p.id);
              }}
              onMouseLeave={() => {
                if (!isCoarse() && activeRef.current === p.id) setActiveCase(null);
              }}
              onClick={(e) => tap(e, p.id)}
            >
              {/* Mobile-only inline thumbnail — desktop gets the cursor-
                  following preview instead, so this is hidden above 820px.
                  Stretched (via CSS align-self on .kloaq-case-thumb) to match
                  the height of .kloaq-case-text next to it. */}
              <span className="kloaq-case-thumb" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0]} alt="" loading="lazy" />
              </span>
              <span className="kloaq-case-text">
                <span className="kloaq-case-name">{DISPLAY_NAME[p.slug] ?? p.client}</span>
                {/* Meta line under the name (mobile-only — .kloaq-case-meta is
                    display:contents on desktop so index/tag flow inline in the
                    packed cloud as before). Index is zero-padded (01, 02, …). */}
                <span className="kloaq-case-meta">
                  <span className="kloaq-case-index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="kloaq-case-tag">{p.category}</span>
                </span>
              </span>
            </a>
          ))}

          {/* "All work" flows inline, right after the last project. No index
              (it's the overview link, not a numbered project) — just the tag
              in the meta line, matching the rows above. */}
          <a href="/work" className="kloaq-case">
            <span className="kloaq-case-text">
              <span className="kloaq-case-name is-outline">All Work</span>
              <span className="kloaq-case-meta">
                <span className="kloaq-case-tag">Overview →</span>
              </span>
            </span>
          </a>
        </div>

        {/* Showreel sits right after the cloud, right-aligned and sized down
            so it accents the cloud rather than competing with it */}
        <div className="kloaq-reel-frame">
          <HeroReel />
        </div>
      </div>

      {/* Single floating thumbnail reused across names, follows the cursor
          on desktop or pins at the tap point on touch. The close button is
          touch-only (CSS-gated) — desktop dismisses via mouseleave same as
          before, so the button only needs pointer-events restored for
          coarse pointers, not fine ones. */}
      <div
        ref={thumbRef}
        className={`kloaq-thumb${active ? " is-visible" : ""}`}
        aria-hidden="true"
      >
        {activeProject && (
          <>
            {/* Clips/rounds the image only — kept separate from .kloaq-thumb
                itself so the close button below can sit outside the frame
                without being clipped by the image's overflow: hidden. */}
            <span className="kloaq-thumb-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeProject.images[0]} alt="" />
            </span>
            <button
              type="button"
              className="kloaq-thumb-close"
              aria-label="Close preview"
              onClick={() => setActiveCase(null)}
            >
              ×
            </button>
          </>
        )}
      </div>
    </section>
  );
}
