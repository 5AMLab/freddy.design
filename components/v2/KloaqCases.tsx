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
 * get a tap-to-reveal fallback there: first tap on an inactive case previews
 * it (pinned near the tap point, not cursor-following) instead of navigating;
 * tapping the already-active case follows through to the project. See the
 * `tap` handler below.
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

  const move = (e: React.MouseEvent) => {
    const el = thumbRef.current;
    if (!el) return;
    el.style.left = `${e.clientX}px`;
    el.style.top = `${e.clientY}px`;
  };

  const isCoarse = () => !window.matchMedia("(pointer: fine)").matches;

  // Coarse pointers (touch) get a tap-to-reveal instead of hover: first tap
  // pins the preview at the tap point and stops there; tapping the same,
  // already-active case again lets the click through to navigate. Some
  // touch browsers (notably iPad Safari) synthesize a mouseenter right
  // before the click on an <a>, so onMouseEnter below is also gated behind
  // isCoarse() — otherwise that synthetic hover would set `active` before
  // this handler runs, making the "first tap" check below a no-op and
  // sending every tap straight through to navigation.
  const tap = (e: React.MouseEvent, id: string) => {
    if (!isCoarse()) return;
    if (active !== id) {
      e.preventDefault();
      const el = thumbRef.current;
      if (el) {
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
      }
      setActive(id);
    }
  };

  const activeProject = projects.find((p) => p.id === active);

  return (
    <section
      className="kloaq-cases-section"
      id="cases"
      onMouseMove={move}
      onClick={(e) => {
        if (isCoarse() && e.target === e.currentTarget) setActive(null);
      }}
    >
      <div className="kloaq-vlabel">Projects</div>

      <div className="kloaq-cases-content">
        <div className="kloaq-cloud">
          {projects.map((p) => (
            <a
              key={p.id}
              href={`/work/${p.slug}`}
              className={`kloaq-case${active === p.id ? " is-active" : ""}`}
              onMouseEnter={() => {
                if (!isCoarse()) setActive(p.id);
              }}
              onMouseLeave={() => {
                if (!isCoarse()) setActive((cur) => (cur === p.id ? null : cur));
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

      {/* Single floating thumbnail reused across names, follows the cursor */}
      <div
        ref={thumbRef}
        className={`kloaq-thumb${active ? " is-visible" : ""}`}
        aria-hidden="true"
      >
        {activeProject && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={activeProject.images[0]} alt="" />
        )}
      </div>
    </section>
  );
}
