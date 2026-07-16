"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

export const PRELOADER_DONE_EVENT = "fd:preloader-done";

// A single inspiring line that reveals, holds, then resolves into the wordmark.
const MESSAGE = "We build brand worlds.";

function finish() {
  document.documentElement.dataset.preloaderDone = "1";
  window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
}

// Has the intro already played this browser session? Read synchronously so an
// already-preloaded session (any client navigation after the first paint) never
// even renders the overlay — it can't get stuck waiting on an effect to clear.
// Guarded for SSR (no window/sessionStorage on the server → render it, the
// effect resolves it on the client).
//
// Exported so other first-paint-only entrances (e.g. HeroStatementV4) can gate
// on the SAME signal. Those used to check `document.documentElement.dataset.
// preloaderDone` instead — a plain DOM attribute, not persisted anywhere. On
// this site nav links are bare <a href> (no next/link), so every route change
// is a full document reload: the attribute resets even though the preloader
// itself correctly skipped its replay via sessionStorage. Net effect: the
// hero's entrance animation (headline fade+rise, 1s) replayed on every
// navigation back to "/" instead of once per browser session — read as "the
// hero takes a long time to load" after visiting another page and returning.
export function alreadyPreloaded() {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem("fd-preloaded") === "1";
  } catch {
    return false;
  }
}

// Opening sequence: one inspiring line reveals, holds, and clears, then the
// freddy. wordmark resolves before the overlay wipes up — handing off to the
// hero entrance via PRELOADER_DONE_EVENT. Plays once per browser session;
// skipped entirely under reduced motion.
export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const skip = !el || prefersReducedMotion() || alreadyPreloaded();
    if (skip) {
      sessionStorage.setItem("fd-preloaded", "1");
      setDone(true);
      finish();
      return;
    }

    const message = el.querySelector(".preloader-message .line");
    const wordmark = el.querySelector(".preloader-word");
    const complete = () => {
      sessionStorage.setItem("fd-preloaded", "1");
      setDone(true);
      finish();
    };

    // Hide both lines below their masks up front (130% clears a tight
    // line-height), then reveal the stack — so nothing flashes at rest in the
    // gap between React's paint and GSAP's first frame.
    gsap.set(message, { yPercent: 130 });
    gsap.set(wordmark, { yPercent: 110 });
    gsap.set(el.querySelector(".preloader-stack"), { autoAlpha: 1 });

    const tl = gsap.timeline({ onComplete: complete });

    // Message reveals, holds ~0.9s so it reads, then clears.
    tl.to(message, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.2)
      .to(message, { yPercent: -130, duration: 0.45, ease: "expo.in" }, ">+0.9")
      // Wordmark resolves the line only after the message has fully cleared, so
      // the two never share the screen. Holds, then the overlay wipes up.
      .fromTo(
        wordmark,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.6, ease: "expo.out" },
        ">+0.25"
      )
      .to(wordmark, { yPercent: -110, duration: 0.45, ease: "expo.in" }, "+=0.35")
      .to(el, { yPercent: -100, duration: 0.7, ease: "expo.inOut" }, "-=0.15");

    // Failsafe: if the timeline ever stalls (interrupted tween, tab throttling,
    // a torn-down remount that kills it mid-flight), never trap the user behind
    // a full-screen overlay — force the handoff after the sequence's own budget.
    const failsafe = window.setTimeout(complete, 6000);

    return () => {
      window.clearTimeout(failsafe);
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "var(--black)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.4em",
      }}
    >
      {/* The whole content stack starts visibility:hidden and is only revealed
          once GSAP has set the initial off-screen state — so no text ever
          flashes at rest in the gap between React's paint and the first frame. */}
      <span
        className="preloader-stack"
        style={{
          visibility: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4em",
        }}
      >
        <span
          className="preloader-message line-mask"
          style={{ padding: "0.12em 1.2rem" }}
        >
          <span
            className="line"
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontSize: "clamp(1.4rem, 4vw, 2.8rem)",
              fontWeight: 400,
              color: "var(--off-white)",
              letterSpacing: "0.01em",
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              transform: "translateY(130%)",
            }}
          >
            {MESSAGE}
          </span>
        </span>

        <span className="line-mask" style={{ padding: "0.12em 0" }}>
          <span
            className="preloader-word line"
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)",
              fontWeight: 400,
              color: "var(--off-white)",
              letterSpacing: "0.02em",
              lineHeight: 1.3,
            }}
          >
            freddi<span style={{ color: "var(--orange)" }}>.</span>
          </span>
        </span>
      </span>
    </div>
  );
}
