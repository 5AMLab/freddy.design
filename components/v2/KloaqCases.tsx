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
              className="kloaq-case"
              onMouseEnter={() => setActive(p.id)}
              onMouseLeave={() => setActive((cur) => (cur === p.id ? null : cur))}
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
