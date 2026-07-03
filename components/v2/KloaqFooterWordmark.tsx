"use client";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

// Animated "sunset" wash across the footer's ghost wordmark. Rather than
// rotating a gradient's *angle* back and forth (which reads as a mechanical
// wobble, not light), this mimics an actual sunset two ways at once:
//
//   1. Descent — the whole vertical gradient sinks downward over the cycle,
//      like the sun dropping toward the horizon, by animating the clipped
//      background's vertical position rather than its angle.
//   2. Palette shift — the three colour stops themselves cross-fade through a
//      sunset arc: a high, bright late-afternoon sky (cream up top, warm gold
//      low) deepening into dusk (embered orange sinking under a cooling gold),
//      then easing back. The colour change is what actually sells "sunset";
//      the descent gives it direction.
//
// A real sunset shifts the whole sky as one — it doesn't rake letter-by-letter
// through wildly different colours (that per-character disunity was what read as
// "unnatural" before). So the stagger here is deliberately tiny: the word moves
// through the day→dusk arc almost in unison, one continuous sky, with just a
// few frames of left-to-right lag so it feels alive rather than mechanical.
const WORD = "freddy";

// Frame units assume a 60fps tick (see the deltaTime accumulator in the
// effect) so the sweep runs at one speed regardless of display refresh rate.
// A sunset is slow and lingers at the horizon: a gentle descent (ENTER), a
// long glow held low (HOLD), an ease back up (EXIT), then a rest (PAUSE).
const STAGGER = 6;
const ENTER = 260;
const HOLD = 220;
const EXIT = 240;
const PAUSE = 120;

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// A sunset colour as three RGB stops (top, mid, bottom of the vertical band).
type Stop = [number, number, number];
type Sky = { top: Stop; mid: Stop; bottom: Stop };

// Palette endpoints, tuned to freddy's tokens:
//   DAY  — bright: cream sky up high, gold horizon, warm at the base.
//   DUSK — the sun has dropped: cream cooled to gold, gold to orange, and a
//          deep ember pooling at the bottom where the sun sits on the horizon.
const CREAM: Stop = [249, 249, 249];
const GOLD: Stop = [201, 169, 110];
const ORANGE: Stop = [252, 80, 0];
const EMBER: Stop = [138, 38, 0];

const DAY: Sky = { top: CREAM, mid: GOLD, bottom: ORANGE };
const DUSK: Sky = { top: GOLD, mid: ORANGE, bottom: EMBER };

const lerpStop = (a: Stop, b: Stop, t: number): Stop => [
  Math.round(lerp(a[0], b[0], t)),
  Math.round(lerp(a[1], b[1], t)),
  Math.round(lerp(a[2], b[2], t)),
];

const rgb = ([r, g, b]: Stop) => `rgb(${r},${g},${b})`;

// Cycle progress 0 -> 1 -> 0, following the eased enter/hold/exit/pause phases.
// 0 = full daylight (sun high), 1 = deep dusk (sun on the horizon).
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

        // Colour arc: cross-fade the three stops from DAY toward DUSK.
        const top = lerpStop(DAY.top, DUSK.top, p);
        const mid = lerpStop(DAY.mid, DUSK.mid, p);
        const bottom = lerpStop(DAY.bottom, DUSK.bottom, p);

        // Descent: the clipped band is 300% tall (see the CSS comment) and
        // centred at 50% at rest. Sliding the vertical position downward as
        // dusk falls sinks the warm horizon toward the base of each glyph —
        // the sun dropping. 50% (centred) -> 78% (band pushed down) reads as
        // descent without ever exposing the band's unpainted edges over the
        // ink. Vertical only: no angle change, so no wobble.
        const posY = lerp(50, 78, p).toFixed(1);

        // backgroundImage, not the `background` shorthand — the shorthand
        // resets background-clip to border-box on every write, silently
        // breaking the text-clip mask each frame. Keep the fixed vertical
        // (180deg) axis; only colours and vertical position animate.
        el.style.backgroundImage = `linear-gradient(180deg, ${rgb(top)} 0%, ${rgb(mid)} 45%, ${rgb(bottom)} 100%)`;
        el.style.backgroundPosition = `0% ${posY}%`;
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
