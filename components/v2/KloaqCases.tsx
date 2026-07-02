"use client";

import { useRef, useState } from "react";
import { projects } from "@/lib/work";
import HeroReel from "@/components/v2/HeroReel";

/**
 * Kloaq's signature, freddy-skinned: the portfolio as a packed typographic
 * "cloud" rather than a grid or list. Project names are set huge in condensed
 * caps (Anton) and flow as wrapping inline blocks with their category as an
 * inline tag, so they tessellate into a dense field.
 *
 * Hovering a name reveals that project's portfolio image, which fades in and
 * follows the cursor — Kloaq's real interaction. The hovered name also flips
 * to orange. A ghost outlined "All work" closes the set.
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

  const isCoarse = () => !window.matchMedia("(pointer: fine)").matches;

  // Fine-pointer only — on touch, some browsers fire synthetic mousemove
  // events during a tap/drag (e.g. a finger sliding slightly while pressed),
  // which was re-pinning the thumb mid-touch and made it feel like the
  // preview was "running away" when reaching for the close button.
  const move = (e: React.MouseEvent) => {
    if (isCoarse()) return;
    const el = thumbRef.current;
    if (!el) return;
    el.style.left = `${e.clientX}px`;
    el.style.top = `${e.clientY}px`;
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
      const el = thumbRef.current;
      if (el) {
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
      }
      setActiveCase(id);
    }
  };

  const activeProject = projects.find((p) => p.id === active);

  return (
    <section className="kloaq-cases-section" id="cases" onMouseMove={move}>
      <div className="kloaq-vlabel">Projects</div>

      <div className="kloaq-cases-content">
        <div className="kloaq-cloud">
          {projects.map((p) => (
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
                <span className="kloaq-case-tag">{p.category}</span>
              </span>
            </a>
          ))}

          {/* "All work" flows inline, right after the last project */}
          <a href="/work" className="kloaq-case">
            <span className="kloaq-case-text">
              <span className="kloaq-case-name is-outline">All Work</span>
              <span className="kloaq-case-tag">Overview →</span>
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
