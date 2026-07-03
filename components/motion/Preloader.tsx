"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

export const PRELOADER_DONE_EVENT = "fd:preloader-done";

function finish() {
  document.documentElement.dataset.preloaderDone = "1";
  window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
}

// Has the intro already played this browser session? Read synchronously so an
// already-preloaded session (any client navigation after the first paint) never
// even renders the overlay — it can't get stuck waiting on an effect to clear.
// Guarded for SSR (no window/sessionStorage on the server → render it, the
// effect resolves it on the client).
function alreadyPreloaded() {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem("fd-preloaded") === "1";
  } catch {
    return false;
  }
}

// Brief opening sequence (≤1.5s): wordmark reveals, overlay wipes up, then
// hands off to the hero entrance via PRELOADER_DONE_EVENT. Plays once per
// browser session; skipped entirely under reduced motion.
export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const skip =
      !el || prefersReducedMotion() || alreadyPreloaded();
    if (skip) {
      sessionStorage.setItem("fd-preloaded", "1");
      setDone(true);
      finish();
      return;
    }

    const word = el.querySelector(".preloader-word");
    const complete = () => {
      sessionStorage.setItem("fd-preloaded", "1");
      setDone(true);
      finish();
    };
    const tl = gsap.timeline({ onComplete: complete });
    tl.fromTo(
      word,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.7, ease: "expo.out" },
      0.1
    )
      .to(word, { yPercent: -110, duration: 0.5, ease: "expo.in" }, 0.9)
      .to(el, { yPercent: -100, duration: 0.7, ease: "expo.inOut" }, 1.1);

    // Failsafe: if the timeline ever stalls (interrupted tween, tab throttling,
    // a torn-down remount that kills it mid-flight), never trap the user behind
    // a full-screen overlay — force the handoff after the sequence's own budget.
    const failsafe = window.setTimeout(complete, 2600);

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
        background: "#050505",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span className="line-mask">
        <span
          className="preloader-word line"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)",
            fontWeight: 400,
            color: "#f9f9f9",
            letterSpacing: "0.02em",
          }}
        >
          freddy<span style={{ color: "#FC5000" }}>.</span>
        </span>
      </span>
    </div>
  );
}
