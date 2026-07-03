"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/work";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

gsap.registerPlugin(ScrollTrigger);

/**
 * Mobile-only hero — the touch counterpart to KloaqCases's desktop cloud.
 *
 * Instead of a packed typographic field (which reads as broken and needs a
 * cursor to reveal images), touch visitors get a full-screen, one-project-
 * at-a-time carousel driven by scroll: each swipe advances to the next
 * project, its title centered, with the project image filling the frame
 * behind it. The page only releases to the next section once the last
 * project is reached — that boundary falls out of pinning the section for a
 * fixed scroll distance (one viewport-height of scroll per project) and
 * letting the pin end after the final step.
 *
 * "Snap per swipe": ScrollTrigger's `snap` locks the scroll position to the
 * nearest project step on release, so exactly one title is centered at rest
 * and a flick can't leave you stranded mid-transition.
 *
 * This renders alongside the desktop KloaqCases; CSS (.kloaq-mobile-hero vs
 * the desktop .kloaq-cases-section) shows exactly one of the two at the
 * 820px breakpoint, so neither markup tree affects the other. Both are in
 * the SSR output — the toggle is pure CSS, so there's no hydration flash.
 *
 * Reduced-motion / no-JS fallback: without the pin the section is just a
 * vertical stack of full-bleed project cards that scroll normally (see the
 * reduced-motion note in the effect), so the content is always reachable.
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
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  // Mirror so the ScrollTrigger onUpdate callback (a stable closure created
  // once) always compares against the latest committed index instead of the
  // 0 it captured on mount — otherwise every step past the first re-runs the
  // crossfade because the stale closure never sees index advance.
  const indexRef = useRef(0);

  const count = projects.length;

  useEffect(() => {
    // Reduced motion (or the desktop breakpoint, where this whole subtree is
    // display:none) skips pinning entirely — the cards fall back to a normal
    // vertical scroll, no hijack. matchMedia guards the pin to the same
    // touch/narrow range the CSS shows this component at, so a desktop
    // viewport never builds a ScrollTrigger for a hidden element.
    if (prefersReducedMotion()) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(max-width: 820px)", () => {
        // Slide the track horizontally? No — titles cross-fade in place while
        // the image behind swaps, so there's no moving layout to animate.
        // The ScrollTrigger exists purely to (a) pin the section for `count`
        // viewport-steps of scroll, (b) snap to each step, and (c) report
        // progress so we can commit the active index.
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          // One extra viewport-height of scroll per project step after the
          // first: `count - 1` transitions, each taking 100vh of scroll.
          end: () => `+=${window.innerHeight * (count - 1)}`,
          pin: true,
          pinSpacing: true,
          // Snap to each of the `count` evenly-spaced steps on release.
          snap: count > 1 ? 1 / (count - 1) : 0,
          onUpdate: (self) => {
            const next = Math.round(self.progress * (count - 1));
            if (next !== indexRef.current) {
              indexRef.current = next;
              setIndex(next);
            }
          },
        });

        return () => st.kill();
      });
    }, section);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [count]);

  return (
    <section className="kloaq-mobile-hero" ref={sectionRef} aria-label="Selected projects">
      <div className="kloaq-vlabel">Projects</div>

      <div className="kloaq-mobile-hero-viewport">
        <div className="kloaq-mobile-hero-track" ref={trackRef}>
          {/* Image layer — one <img> per project, stacked; only the active
              one is opaque. Behind the title (z-index in CSS) and dimmed so
              the type stays legible over any photo. */}
          <div className="kloaq-mobile-hero-media" aria-hidden="true">
            {projects.map((p, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.id}
                src={p.images[0]}
                alt=""
                className={`kloaq-mobile-hero-img${i === index ? " is-active" : ""}`}
                loading={i === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>

          {/* Title layer — the active project's name + meta, cross-fading. */}
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
                <span className="kloaq-mobile-hero-index">
                  {String(i + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </span>
                <span className="kloaq-mobile-hero-name">
                  {DISPLAY_NAME[p.slug] ?? p.client}
                </span>
                <span className="kloaq-mobile-hero-tag">{p.category}</span>
              </a>
            ))}
          </div>

          {/* Progress dots — one per project, tracking the active step. */}
          <div className="kloaq-mobile-hero-dots" aria-hidden="true">
            {projects.map((p, i) => (
              <span
                key={p.id}
                className={`kloaq-mobile-hero-dot${i === index ? " is-active" : ""}`}
              />
            ))}
          </div>

          {/* Scroll affordance — fades out once past the first project. */}
          <div
            className={`kloaq-mobile-hero-hint${index === 0 ? "" : " is-hidden"}`}
            aria-hidden="true"
          >
            Scroll
          </div>
        </div>
      </div>
    </section>
  );
}
