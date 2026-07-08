"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  type PendingTransition,
  clearTransition,
  getTransition,
  subscribeTransition,
} from "@/lib/pageTransition";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

/**
 * Page-level shared-element overlay. Mounted once in the root layout so it
 * survives client-side route changes; the hero cloud records a flight via
 * lib/pageTransition, and this paints a fixed clone of the project's image at
 * the source rect and animates it to where the case-study hero lands
 * (full-viewport-width 16/9 band at the top), holding over the navigation
 * seam and then cross-fading out onto the real hero.
 *
 * The destination hero (WorkDetail's full-bleed .work-frame) starts at
 * opacity 0 under a `transitioning` marker on <html>; once this overlay's
 * flight lands it reveals that hero and clears the marker, so the hand-off is
 * seamless with no flash of the real image popping in early. A failsafe
 * timeout always clears everything so a mis-timed navigation can never leave
 * the page frozen under the overlay.
 */
export default function SharedElementOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [active, setActive] = useState<PendingTransition | null>(null);
  const failsafeRef = useRef<number | null>(null);

  // Subscribe once. A flight can be started from the previous route, so also
  // read any already-pending transition on mount.
  useEffect(() => {
    setActive(getTransition());
    return subscribeTransition(setActive);
  }, []);

  // Run the flight whenever a transition becomes active.
  useEffect(() => {
    if (!active) return;
    const overlay = overlayRef.current;
    const img = imgRef.current;
    if (!overlay || !img) return;

    // Reduced motion: no flight — just let the destination hero show and bail.
    if (prefersReducedMotion()) {
      revealDestinationHero();
      clearTransition();
      return;
    }

    document.documentElement.classList.add("is-transitioning");

    const clearAll = () => {
      document.documentElement.classList.remove("is-transitioning");
      revealDestinationHero();
      clearTransition();
    };

    // Failsafe: never trap the page under the overlay.
    failsafeRef.current = window.setTimeout(clearAll, 1600);

    // Start: clone sits exactly over the source thumb.
    gsap.set(overlay, { autoAlpha: 1 });
    gsap.set(img, {
      position: "fixed",
      top: active.from.top,
      left: active.from.left,
      width: active.from.width,
      height: active.from.height,
      borderRadius: 14,
    });

    // Target: a full-viewport-width 16/9 band anchored at the very top —
    // where the case-study full-bleed hero renders. Computed at flight time so
    // it tracks the actual viewport, not a baked constant.
    const vw = window.innerWidth;
    const targetHeight = Math.round((vw * 9) / 16);

    const tl = gsap.timeline({
      onComplete: () => {
        if (failsafeRef.current) window.clearTimeout(failsafeRef.current);
        // Reveal the real hero underneath, then fade the clone off it.
        revealDestinationHero();
        gsap.to(overlay, {
          autoAlpha: 0,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            document.documentElement.classList.remove("is-transitioning");
            clearTransition();
          },
        });
      },
    });

    tl.to(img, {
      top: 0,
      left: 0,
      width: vw,
      height: targetHeight,
      borderRadius: 0,
      duration: 0.62,
      ease: "power3.inOut",
    });

    return () => {
      tl.kill();
      if (failsafeRef.current) window.clearTimeout(failsafeRef.current);
    };
    // active is the only trigger; the refs are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={overlayRef}
      className="shared-el-overlay"
      aria-hidden="true"
      style={{ opacity: 0, visibility: "hidden" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imgRef} src={active.src} alt="" />
    </div>
  );
}

/**
 * Reveal the destination case hero, which WorkDetail rendered at opacity 0
 * while `is-transitioning` is set (so the real image never pops in before the
 * flight lands). Tolerant if the hero isn't found — the overlay just fades
 * onto whatever is there.
 */
function revealDestinationHero() {
  const hero = document.querySelector<HTMLElement>(".work-hero-frame");
  if (hero) hero.style.opacity = "1";
}
