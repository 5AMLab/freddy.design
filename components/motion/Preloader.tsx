"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

export const PRELOADER_DONE_EVENT = "fd:preloader-done";

function finish() {
  document.documentElement.dataset.preloaderDone = "1";
  window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
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
      !el || prefersReducedMotion() || sessionStorage.getItem("fd-preloaded");
    if (skip) {
      setDone(true);
      finish();
      return;
    }

    const word = el.querySelector(".preloader-word");
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("fd-preloaded", "1");
        setDone(true);
        finish();
      },
    });
    tl.fromTo(
      word,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.7, ease: "expo.out" },
      0.1
    )
      .to(word, { yPercent: -110, duration: 0.5, ease: "expo.in" }, 0.9)
      .to(el, { yPercent: -100, duration: 0.7, ease: "expo.inOut" }, 1.1);

    return () => {
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
        background: "#0D0D0D",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span className="line-mask">
        <span
          className="preloader-word line"
          style={{
            fontFamily: "'Canela', serif",
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            fontWeight: 300,
            color: "#F5F0E8",
            letterSpacing: "0.04em",
          }}
        >
          freddy<span style={{ color: "#C9A96E" }}>.</span>design
        </span>
      </span>
    </div>
  );
}
