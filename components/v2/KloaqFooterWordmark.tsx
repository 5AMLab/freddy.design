"use client";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

// Animated gradient "sunrise" sweep across the footer's ghost wordmark,
// adapted from a reference per-character gradient-sweep script. Each letter
// gets its own <span>, and a rAF loop staggers a looping angle sweep
// (180deg -> 0deg -> 180deg, ease-in-out both ways) through a linear-gradient
// painted as the text fill via background-clip: text. Colors swapped from
// the reference's orange/amber/white to freddy's actual palette (Flameburst
// orange -> gold -> cream, same three stops KloaqCTA and the case cloud use).
const WORD = "freddy";
// Frame units below assume a 60fps tick (see the deltaTime accumulator in
// the effect) so the sweep runs at the same speed regardless of display
// refresh rate — the original reference incremented one unit per rAF
// callback, which made the sweep roughly twice as fast on 120Hz+ displays.
// Values are also 3x the reference's to slow the sweep down further per
// user feedback that it read as too fast at the reference's original pace.
const STAGGER = 30;
const ENTER = 180;
const HOLD = 150;
const EXIT = 165;
const PAUSE = 132;

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Cycle progress: 0 (start) -> 1 (target) -> 0, following enter/hold/exit/pause.
function cycleProgress(frame: number, offset: number) {
  if (frame < offset) return 0;
  const total = ENTER + HOLD + EXIT + PAUSE;
  const t = (frame - offset) % total;
  if (t < ENTER) return easeInOut(t / ENTER);
  if (t < ENTER + HOLD) return 1;
  if (t < ENTER + HOLD + EXIT) return 1 - easeInOut((t - ENTER - HOLD) / EXIT);
  return 0;
}

export default function KloaqFooterWordmark() {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let frame = 0;
    let raf: number;
    let lastTime: number | null = null;

    const tick = (time: number) => {
      // Accumulate frame count from real elapsed time (pinned to a 60fps
      // step) instead of +1 per rAF callback, so the sweep's speed is the
      // same on a 60Hz display and a 120Hz+ one.
      if (lastTime !== null) {
        frame += (time - lastTime) / (1000 / 60);
      }
      lastTime = time;

      charRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = cycleProgress(frame, i * STAGGER);
        const angle = lerp(180, 0, p).toFixed(1);
        // backgroundImage, not the `background` shorthand — the shorthand
        // resets background-clip to its initial value (border-box) on every
        // write, which silently breaks the text-clip mask each frame.
        el.style.backgroundImage = `linear-gradient(${angle}deg, var(--orange) 0%, var(--gold) 42%, var(--cream) 100%)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="kloaq-footer-watermark" aria-hidden="true">
      {WORD.split("").map((ch, i) => (
        <span
          key={i}
          ref={(el) => {
            charRefs.current[i] = el;
          }}
          className="kloaq-footer-watermark-char"
        >
          {ch}
        </span>
      ))}
    </div>
  );
}
