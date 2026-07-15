"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { imageSrc, getProject } from "@/lib/work";

// "Selected Works" — the homepage's portfolio block: four cases in a 2×2 grid
// (one column below lg), each tile a link into its case page.
//
// Hover (fine pointers): the image scales up inside its overflow-hidden frame
// while a scrim fades in over it and the project title rises into place. Per
// MOTION.md only transform/opacity animate — the dim is an overlay fading
// 0→1, NOT a filter/brightness animation, and the zoom is a transform on the
// image, not a width/height change.
//
// Touch (coarse pointers): there is no hover, so nothing may hide behind one.
// The title and tags are painted at rest instead (see .is-touch below) and the
// tile is just a link. Same rule the hero and the services rows already follow.
const SLUGS = [
  "anz-annual-report",
  "hermes-terre-campaign",
  "cognitiv-ai-brand",
  "akuos-investor-deck",
];

// The category tags shown at rest on each tile. Kept here rather than derived
// from Project.category because a tile shows the WORK TYPES (two short tags,
// as in the reference), while `category` is a single longer label meant for the
// case page's meta.
const TAGS: Record<string, string[]> = {
  "anz-annual-report": ["Editorial", "Data Viz"],
  "hermes-terre-campaign": ["Key Visuals", "Creative Direction"],
  "cognitiv-ai-brand": ["Brand Identity"],
  "akuos-investor-deck": ["Key Visuals", "Pitch Deck"],
};

export default function KloaqPortfolio() {
  // Coarse pointers get the title/tags at rest. Resolved after mount (not in
  // render) so the server and the first client pass agree — matchMedia doesn't
  // exist on the server, and branching on it during render would hydration-
  // mismatch. Fine-pointer (hover) is the default until proven otherwise.
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(!window.matchMedia("(pointer: fine)").matches);
  }, []);

  return (
    <section id="portfolio" className="kloaq-portfolio-section">
      <div className="kloaq-portfolio-head">
        <div>
          {/* Bare words — .kloaq-vlabel adds the [ brackets ] itself. */}
          <div className="kloaq-vlabel">Best of 2026</div>
          <h2 className="kloaq-whatido-heading kloaq-portfolio-heading">
            Ten years,
            <br />
            <span className="kloaq-heading-accent">one standard.</span>
          </h2>
        </div>
        <span className="kloaq-portfolio-side">Selected Works</span>
      </div>

      <div className={`kloaq-portfolio-grid${isTouch ? " is-touch" : ""}`}>
        {SLUGS.map((slug) => {
          const project = getProject(slug);
          if (!project) return null;
          const tags = TAGS[slug] ?? [];
          return (
            <a
              key={slug}
              href={`/work/${slug}`}
              className="kloaq-portfolio-tile"
              data-cursor="view"
            >
              {/* The frame clips the zoom — the image scales inside it. */}
              <span className="kloaq-portfolio-frame">
                <Image
                  className="kloaq-portfolio-img"
                  src={imageSrc(project.images[0])}
                  alt={`${project.client} — ${project.title}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
                {/* Dim: an overlay fading in, not a filter animation. */}
                <span className="kloaq-portfolio-scrim" aria-hidden="true" />

                <span className="kloaq-portfolio-tags" aria-hidden="true">
                  {tags.map((t) => (
                    <span key={t} className="kloaq-portfolio-tag">
                      {t.toUpperCase()}
                    </span>
                  ))}
                </span>

                <span className="kloaq-portfolio-title">
                  <span className="kloaq-portfolio-client">
                    {project.client}
                  </span>
                  {project.title}
                </span>
              </span>
            </a>
          );
        })}
      </div>

      <div className="kloaq-portfolio-action">
        <a href="/work" className="kloaq-portfolio-btn">
          View All Works
        </a>
      </div>
    </section>
  );
}
