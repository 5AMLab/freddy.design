"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { imageSrc, getProject } from "@/lib/work";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";
import Magnetic from "@/components/motion/Magnetic";

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
  const sectionRef = useRef<HTMLElement>(null);
  // Coarse pointers get the title/tags at rest. Resolved after mount (not in
  // render) so the server and the first client pass agree — matchMedia doesn't
  // exist on the server, and branching on it during render would hydration-
  // mismatch. Fine-pointer (hover) is the default until proven otherwise.
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(!window.matchMedia("(pointer: fine)").matches);
  }, []);

  // Residual parallax: each tile's media drifts inside its clipped frame while
  // the tile crosses the viewport (same recipe as WorkDetail's full-bleed
  // bands). The media is over-tall + top-anchored (.kloaq-portfolio-media,
  // 114% height) so yPercent -10 of the media (≈11.4% of the frame) never
  // exposes an unpainted edge. The entrance scale (MotionProvider's
  // mask-scale, 1.12→1) targets this same wrapper; GSAP composes the two
  // transforms, and the hover zoom lives on the <img> inside, so none of the
  // three fight.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const tweens = gsap.utils
      .toArray<HTMLElement>(".kloaq-portfolio-media", section)
      .map((el) =>
        gsap.fromTo(
          el,
          { yPercent: 0 },
          {
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest(".kloaq-portfolio-frame"),
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        )
      );
    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, []);

  return (
    <section id="portfolio" ref={sectionRef} className="kloaq-portfolio-section">
      <div className="kloaq-portfolio-head">
        <div>
          {/* Bare words — .kloaq-vlabel adds the [ brackets ] itself. */}
          <div className="kloaq-vlabel fade-up">Best of 2026</div>
          <h2 className="kloaq-whatido-heading kloaq-portfolio-heading reveal-line">
            <span className="line-mask">
              <span className="line">Ten years,</span>
            </span>
            <span className="line-mask">
              <span className="line kloaq-heading-accent">one standard.</span>
            </span>
          </h2>
        </div>
        <span className="kloaq-portfolio-side fade-up">Selected Works</span>
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
                {/* Media wrapper: the mask-scale entrance + parallax target.
                    Scrim/tags/title stay OUTSIDE it so only the image drifts. */}
                <span className="kloaq-portfolio-media mask-scale-media">
                  <Image
                    className="kloaq-portfolio-img"
                    src={imageSrc(project.images[0])}
                    alt={`${project.client} — ${project.title}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </span>
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

      <div className="kloaq-portfolio-action fade-up">
        <Magnetic>
          <a href="/work" className="kloaq-portfolio-btn">
            {/* Text-roll hover: the label slides up and out while its ::after
                duplicate (data-text) slides in from below. */}
            <span className="kloaq-btn-roll" data-text="View All Works">
              <span>View All Works</span>
            </span>
          </a>
        </Magnetic>
      </div>
    </section>
  );
}
