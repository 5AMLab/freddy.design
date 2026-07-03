"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

export const PRELOADER_DONE_EVENT = "fd:preloader-done";

// Manifesto phrases that each assemble word-by-word, hold, then clear before the
// next one enters. Keep each line short (~3–5 words) — every word gets its own
// masked reveal and the full rotation has to land inside the intro's budget.
const MANIFESTO = [
  ["We", "build", "brand", "worlds."],
  ["Design", "with", "intent."],
  ["Stories", "that", "move."],
];

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

// Opening sequence (~4s): a set of manifesto lines each assemble word-by-word,
// hold, and clear in turn, then the freddy. wordmark drops in before the overlay
// wipes up — handing off to the hero entrance via PRELOADER_DONE_EVENT. Plays
// once per browser session; skipped entirely under reduced motion.
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

    const phrases = el.querySelectorAll<HTMLElement>(".preloader-phrase");
    const wordmark = el.querySelector(".preloader-word");
    const complete = () => {
      sessionStorage.setItem("fd-preloaded", "1");
      setDone(true);
      finish();
    };

    // Start every phrase hidden and its words below their masks. autoAlpha keeps
    // inactive phrases fully out of sight (visibility:hidden) so the stacked
    // phrases can never overlap or flash at rest before their turn.
    gsap.set(phrases, { autoAlpha: 0 });
    const allWords = el.querySelectorAll<HTMLElement>(".preloader-phrase .line");
    gsap.set(allWords, { yPercent: 110 });

    const tl = gsap.timeline({ onComplete: complete });

    // Each phrase: reveal the phrase, its words snap up from their masks in
    // sequence, hold, then clear out upward and the phrase is hidden again
    // before the next one begins — so only one is ever visible at a time.
    phrases.forEach((phrase, i) => {
      const words = phrase.querySelectorAll<HTMLElement>(".line");

      tl.set(phrase, { autoAlpha: 1 }, i === 0 ? 0.15 : ">")
        .fromTo(
          words,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.55, ease: "expo.out", stagger: 0.07 },
          "<"
        )
        .to(
          words,
          { yPercent: -110, duration: 0.4, ease: "expo.in", stagger: 0.03 },
          ">+0.45"
        )
        .set(phrase, { autoAlpha: 0 });
    });

    // Wordmark drops in to resolve the sequence, holds, then the overlay wipes up.
    tl.fromTo(
      wordmark,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.6, ease: "expo.out" },
      "-=0.15"
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
        background: "#050505",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.4em",
      }}
    >
      {/* All phrases share the same centered slot (stacked absolutely) so each
          rotation replaces the last in place rather than shifting layout. */}
      <span
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "1.2em",
        }}
      >
        {MANIFESTO.map((phrase, pi) => (
          <span
            className="preloader-phrase"
            key={pi}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexWrap: "nowrap",
              justifyContent: "center",
              gap: "0.3em",
              fontFamily: "var(--font-display), sans-serif",
              fontSize: "clamp(1.4rem, 4vw, 2.8rem)",
              fontWeight: 400,
              color: "#f9f9f9",
              letterSpacing: "0.01em",
              lineHeight: 1.05,
              padding: "0 1.2rem",
              textAlign: "center",
              whiteSpace: "nowrap",
              visibility: "hidden",
            }}
          >
            {phrase.map((word, wi) => (
              <span className="line-mask" key={wi}>
                {/* Start hidden below the mask so the stacked phrases never
                    flash at rest before GSAP takes over. */}
                <span className="line" style={{ transform: "translateY(110%)" }}>
                  {word}
                </span>
              </span>
            ))}
          </span>
        ))}
      </span>

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
