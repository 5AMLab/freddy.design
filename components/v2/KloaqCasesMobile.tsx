"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, imageSrc } from "@/lib/work";
import { getLenis, prefersReducedMotion } from "@/components/motion/MotionProvider";

gsap.registerPlugin(ScrollTrigger);

/**
 * Mobile-only hero — the touch counterpart to KloaqCases's desktop cloud.
 *
 * A full-screen, one-project-at-a-time carousel driven by scroll. The section
 * is pinned for `count - 1` viewport-steps; ScrollTrigger's `snap` locks the
 * release to the nearest step, so exactly one project is centered at rest and
 * the page only continues to the next section after the last project.
 *
 * The transition is SCRUBBED, not switched: as the finger drags, the next
 * project's image wipes up over the current one in real time (clip-path inset
 * driven from ScrollTrigger progress, with the site's mask-scale settle from
 * 1.15 → 1), so the gesture reads as physically pulling the next case up.
 * Snap then completes whichever wipe is past its midpoint. Titles and the
 * giant ghost index swap discretely at the midpoint (React state), riding a
 * rise/sink choreography in CSS.
 *
 * This renders alongside the desktop KloaqCases; CSS (.kloaq-mobile-hero vs
 * the desktop .kloaq-cases-section) shows exactly one of the two at the
 * 820px breakpoint. Both are in the SSR output — the toggle is pure CSS, so
 * there's no hydration flash. The stylesheet pre-clips every image except the
 * first (see .kloaq-mobile-hero-img in kloaq.css) so the SSR paint shows
 * project 01, not the last image in the stack, before GSAP takes over.
 *
 * Reduced-motion / no-JS fallback: without the pin the section is a normal
 * vertical stack of card + title blocks (clip-paths cleared in CSS), so the
 * content is always reachable.
 */

// Same review-page display-name overrides as the desktop cloud, kept in
// sync by hand (both are review-page-only; lib/work.ts stays canonical).
const DISPLAY_NAME: Record<string, string> = {
  "maison-freddy-cold-brew": "Blue Cat",
  "cognitiv-ai-brand": "Cognitiv",
  "hermes-terre-campaign": "Hermes",
};

export default function KloaqCasesMobile() {
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  // Mirror so the ScrollTrigger onUpdate callback (a stable closure created
  // once) always compares against the latest committed index instead of the
  // 0 it captured on mount.
  const indexRef = useRef(0);

  const count = projects.length;

  useEffect(() => {
    // Reduced motion skips pinning entirely — the cards fall back to a normal
    // vertical scroll, no hijack. matchMedia guards the pin to the same
    // narrow range the CSS shows this component at, so a desktop viewport
    // never builds a ScrollTrigger for a hidden element.
    if (prefersReducedMotion()) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(max-width: 820px)", () => {
        const imgs = gsap.utils.toArray<HTMLElement>(
          ".kloaq-mobile-hero-img",
          section
        );

        // Baseline: first image open, the rest clipped shut below the frame
        // and pre-zoomed for the mask-scale settle. (Mirrors the stylesheet
        // defaults, but as inline values GSAP can scrub from.)
        gsap.set(imgs[0], { clipPath: "inset(0% 0 0 0)", scale: 1 });
        imgs.slice(1).forEach((img) =>
          gsap.set(img, { clipPath: "inset(100% 0 0 0)", scale: 1.15 })
        );

        // Snap-per-swipe, done through Lenis rather than ScrollTrigger's own
        // `snap`. ST's snap tweens the native scroll position directly, which
        // fights Lenis's per-frame animated value — the two feedback into
        // each other and the scroll can run away entirely. Routing the snap
        // through lenis.scrollTo makes Lenis the single writer: it owns the
        // easing, and a new swipe mid-snap interrupts it natively.
        let idleTimer: ReturnType<typeof setTimeout> | undefined;
        const snapToStep = (self: ScrollTrigger) => {
          const stepPx = (self.end - self.start) / (count - 1);
          const target = self.start + Math.round(self.progress * (count - 1)) * stepPx;
          if (Math.abs(self.scroll() - target) < 2) return; // already seated
          const lenis = getLenis();
          if (lenis) {
            lenis.scrollTo(target, { duration: 0.7, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
          } else {
            window.scrollTo({ top: target, behavior: "smooth" });
          }
        };

        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          // One viewport-height of scroll per transition: `count - 1` steps.
          end: () => `+=${window.innerHeight * (count - 1)}`,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
            // Re-arm the idle snap on every scroll tick — it fires ~150ms
            // after the last movement (finger lifted, Lenis momentum done)
            // and seats the nearest step. The snap's own scroll re-arms the
            // timer too, but lands exactly on target, so the "already
            // seated" guard stops the loop.
            clearTimeout(idleTimer);
            if (self.progress > 0 && self.progress < 1) {
              idleTimer = setTimeout(() => snapToStep(self), 150);
            }
            // Continuous position along the deck: 0 → count-1.
            const p = self.progress * (count - 1);

            // Scrub every wipe from the one progress value. Image i's wipe
            // runs over p ∈ [i-1, i]: clip inset 100% → 0% (reveals bottom-
            // up, i.e. the next case is pulled up over the current one) while
            // the image settles from 1.15 → 1. Six gsap.set calls per tick is
            // well inside frame budget.
            for (let i = 1; i < count; i++) {
              const f = Math.min(1, Math.max(0, p - (i - 1)));
              gsap.set(imgs[i], {
                clipPath: `inset(${(1 - f) * 100}% 0 0 0)`,
                scale: 1.15 - 0.15 * f,
              });
            }

            // Titles / ghost index / dots swap discretely at the midpoint.
            const next = Math.round(p);
            if (next !== indexRef.current) {
              indexRef.current = next;
              setIndex(next);
            }
          },
        });

        return () => {
          clearTimeout(idleTimer);
          st.kill();
        };
      });
    }, section);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [count]);

  return (
    <section className="kloaq-mobile-hero" ref={sectionRef} aria-label="Selected projects">
      <div className="kloaq-vlabel">Projects</div>

      <div className="kloaq-mobile-hero-viewport">
        <div className="kloaq-mobile-hero-track">
          {/* Giant ghost index — outlined Boldonse numeral peeking out from
              behind the card's top edge, swapping with the active project.
              This IS the position indicator (the dots and the small in-title
              counter were both dropped as redundant/misleading — horizontal
              dots read as "swipe sideways"). Just the bare numeral: a deck-
              length suffix was tried and dropped, it cluttered the mark. */}
          <div className="kloaq-mobile-hero-ghost" aria-hidden="true" key={index}>
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Image layer — stacked in deck order inside the rounded card.
              Each image above the first is clipped shut (inset from the top)
              and wipes open as scroll progress crosses its step — GSAP owns
              the inline clip-path/scale, the stylesheet only sets the
              pre-hydration baseline. */}
          <div className="kloaq-mobile-hero-media" aria-hidden="true">
            {projects.map((p, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.id}
                src={imageSrc(p.images[0])}
                alt=""
                className="kloaq-mobile-hero-img"
                loading={i === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>

          {/* Title layer — the active project's name + meta. Incoming rises
              into place, outgoing sinks (CSS transform choreography on
              .is-active). Set at cloud scale so the name breaks out of the
              card's edges — type leads, image follows, like the desktop. */}
          <div className="kloaq-mobile-hero-titles">
            {projects.map((p, i) => (
              <a
                key={p.id}
                href={`/work/${p.slug}`}
                className={`kloaq-mobile-hero-title${i === index ? " is-active" : ""}`}
                // Only the active card is interactive — the stacked inactive
                // ones sit behind it and must not steal the tap.
                tabIndex={i === index ? 0 : -1}
                aria-hidden={i === index ? undefined : true}
              >
                <span className="kloaq-mobile-hero-name">
                  {DISPLAY_NAME[p.slug] ?? p.client}
                </span>
                {/* Category as a pill on a blurred ink scrim — the bare muted
                    text was illegible over bright photos. */}
                <span className="kloaq-mobile-hero-tag">{p.category}</span>
              </a>
            ))}
          </div>

          {/* Scroll affordance — a downward cue (the vertical gesture isn't
              the touch instinct for a carousel, so the arrow does real work
              here). Fades out once past the first project. */}
          <div
            className={`kloaq-mobile-hero-hint${index === 0 ? "" : " is-hidden"}`}
            aria-hidden="true"
          >
            Scroll <span className="kloaq-mobile-hero-hint-arrow">↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
