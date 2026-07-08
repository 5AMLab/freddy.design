"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, imageSrc, getProject, type Project } from "@/lib/work";
import { RETAINER_SLOTS } from "@/lib/site";
import { PRELOADER_DONE_EVENT } from "@/components/motion/Preloader";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";
import { startTransition } from "@/lib/pageTransition";

/**
 * V4 hero (review slug /v4) — the "receipts" split-column hero.
 *
 * Layout: two type columns flanking a center stage.
 *   - Left column, left-aligned:  ANNUAL REPORTS / INVESTOR DECKS / BRANDBOOKS
 *   - Right column, right-aligned: CAMPAIGNS / PACKAGING / EDITORIAL
 *   Each line is one whole noun and one hoverable case link (faint hairline
 *   rows at rest, orange ghost + underline on hover). All six cases present.
 *
 * Center stage: a transparent 3D render (public/3drender/hero-object.webp) at
 * rest. Hovering a noun cross-fades the object OUT and that project's image IN
 * within the same fixed center frame — the object and the preview share one
 * stage (chosen over the v3 cursor-trailing thumb). Clicking a noun flies the
 * center image into the case hero via the shared-element transition; the
 * source rect is the center frame itself (a fixed, known box).
 *
 * Top strip: [ RECEIPTS ] label left, retainer slots right. Feet: the two
 * About paragraphs as muted column feet, so the hero carries copy + proof.
 *
 * Desktop-only (like the v3 cloud): .v4-hero is hidden ≤820px, where the
 * shared KloaqCasesMobile carousel hero takes over. The center-stage hover is
 * a pointer interaction; touch never sees it.
 */

interface Noun {
  label: string;
  slug: string;
}

// Column order is the reading order the layout depends on — left col top→
// bottom, then right col top→bottom. Slugs map to lib/work.ts.
const LEFT: Noun[] = [
  { label: "Annual Reports", slug: "anz-annual-report" },
  { label: "Investor Decks", slug: "akuos-investor-deck" },
  { label: "Brandbooks", slug: "cognitiv-ai-brand" },
];
const RIGHT: Noun[] = [
  { label: "Campaigns", slug: "hermes-terre-campaign" },
  { label: "Packaging", slug: "maison-freddy-cold-brew" },
  { label: "Editorial", slug: "dad-intern-times" },
];

const HERO_OBJECT_SRC = "/3drender/hero-object.webp";

export default function HeroStatementV4() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  // Synchronous mirror for the tap handler — see v2/v3's note on the Android
  // double-tap race.
  const activeRef = useRef<string | null>(null);

  const isCoarse = () => !window.matchMedia("(pointer: fine)").matches;

  const setActiveCase = (slug: string | null) => {
    activeRef.current = slug;
    setActive(slug);
  };

  // Entrance: nouns rise + fade in a column-ordered stagger as the preloader
  // wipes up; the object and chrome settle after. Only when the preloader is
  // actually running this session (first paint) — on repeat client-nav the
  // hero renders at rest, so nothing here ever hides content post-paint.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    if (document.documentElement.dataset.preloaderDone === "1") return;

    const nouns = section.querySelectorAll(".v4-noun");
    const chrome = section.querySelectorAll(
      ".v3-hero-top, .v3-hero-foot, .v4-foot"
    );
    // Wrapper fades via autoAlpha (opacity+visibility — no transform, so its
    // centering transform is untouched); the inner img carries the scale-in.
    const stage = section.querySelector(".v4-stage-object");
    const stageImg = section.querySelector(".v4-stage-object img");
    // Safe to hide here: the preloader overlay covers the page right now.
    gsap.set(nouns, { autoAlpha: 0, yPercent: 40 });
    gsap.set(chrome, { autoAlpha: 0, y: 14 });
    if (stage) gsap.set(stage, { autoAlpha: 0 });
    if (stageImg) gsap.set(stageImg, { scale: 0.9 });

    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      const tl = gsap.timeline();
      // clearProps: the CSS sibling-dim + hover transforms need inline
      // opacity/transform gone once the entrance settles.
      tl.to(nouns, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        clearProps: "opacity,visibility,transform",
      });
      if (stage) {
        // clearProps opacity/visibility: the object's dim-on-preview is a CSS
        // :has() rule (opacity: 0.12) — an inline opacity left by this tween
        // would outrank it and the object would never fade behind a preview.
        tl.to(
          stage,
          {
            autoAlpha: 1,
            duration: 1.1,
            ease: "expo.out",
            clearProps: "opacity,visibility",
          },
          "-=1"
        );
      }
      if (stageImg) {
        tl.to(
          stageImg,
          { scale: 1, duration: 1.1, ease: "expo.out", clearProps: "transform" },
          "<"
        );
      }
      tl.to(
        chrome,
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out", clearProps: "all" },
        "-=0.8"
      );
    };

    window.addEventListener(PRELOADER_DONE_EVENT, play, { once: true });
    const failsafe = window.setTimeout(play, 6000);
    return () => {
      window.removeEventListener(PRELOADER_DONE_EVENT, play);
      window.clearTimeout(failsafe);
    };
  }, []);

  // Idle float on the center object — a slow drift so the stage isn't dead at
  // rest. Animates the inner <img>, NOT .v4-stage-object: the wrapper owns the
  // translate(-50%,-50%) centering transform (the object is wider than its
  // track and centered on the line), so GSAP must not touch the wrapper's
  // transform. The img is a clean transform target.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const img = sectionRef.current?.querySelector(".v4-stage-object img");
    if (!img) return;
    const tween = gsap.to(img, {
      y: 14,
      rotation: 1.5,
      duration: 4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, []);

  // Scroll-velocity skew on the whole center stage, same device as the v3
  // cloud — gated by an IntersectionObserver so it never writes transforms
  // once the hero is off-screen (the site's Safari-jank lesson).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);

    let onScreen = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(stage);

    gsap.set(stage, { transformOrigin: "center center", force3D: true });
    const skewTo = gsap.quickTo(stage, "skewY", { duration: 0.5, ease: "power3.out" });
    const clamp = gsap.utils.clamp(-3, 3);
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        if (onScreen) skewTo(clamp(self.getVelocity() / -400));
      },
    });
    const settle = () => skewTo(0);
    ScrollTrigger.addEventListener("scrollEnd", settle);
    return () => {
      ScrollTrigger.removeEventListener("scrollEnd", settle);
      st.kill();
      io.disconnect();
    };
  }, []);

  // Coarse-pointer tap-to-reveal: first tap on a noun pins its preview into
  // the center stage; a second tap on the same noun navigates. Mirrors the v3
  // pattern, retargeted from the cursor thumb to the fixed center frame.
  const tap = (e: React.MouseEvent, slug: string) => {
    if (!isCoarse()) return;
    if (activeRef.current !== slug) {
      e.preventDefault();
      setActiveCase(slug);
    }
  };

  // Desktop click → shared-element flight from the center frame. The preview
  // image already fills the center stage (hover set `active`), so its rect is
  // the grab point. Falls through to the plain <a> on touch, reduced motion,
  // modified clicks (new-tab), or if the frame rect isn't available.
  const navigate = (e: React.MouseEvent, project: Project) => {
    if (isCoarse()) return;
    if (prefersReducedMotion()) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    const frame = stageRef.current?.querySelector<HTMLElement>(".v4-stage-preview");
    if (!frame) return;
    const r = frame.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;

    e.preventDefault();
    startTransition({
      src: imageSrc(project.images[0]),
      from: { top: r.top, left: r.left, width: r.width, height: r.height },
      slug: project.slug,
    });
    setActiveCase(null);
    router.push(`/work/${project.slug}`);
  };

  const activeProject = active ? getProject(active) : undefined;

  const renderNoun = (noun: Noun) => {
    const project = getProject(noun.slug);
    if (!project) return null;
    const isActive = active === noun.slug;
    return (
      <a
        key={noun.slug}
        href={`/work/${noun.slug}`}
        className={`v4-noun${isActive ? " is-active" : ""}`}
        onMouseEnter={() => {
          if (!isCoarse()) setActiveCase(noun.slug);
        }}
        onMouseLeave={() => {
          if (!isCoarse() && activeRef.current === noun.slug) setActiveCase(null);
        }}
        onClick={(e) => {
          tap(e, noun.slug);
          if (!e.defaultPrevented) navigate(e, project);
        }}
      >
        <span className="v4-noun-label">{noun.label}</span>
        {/* Client attribution — a quiet proof tag revealed on hover only. */}
        <span className="v4-noun-client" aria-hidden="true">
          {project.client}
        </span>
      </a>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="kloaq-cases-section v3-hero v4-hero"
      id="cases"
    >
      <div className="v3-hero-top">
        <div className="kloaq-vlabel">[ Receipts ]</div>
        <span className="v3-hero-slots">
          [ {RETAINER_SLOTS.open} of {RETAINER_SLOTS.total} retainer slots open
          for {RETAINER_SLOTS.month} ]
        </span>
      </div>

      <div className="v4-grid">
        {/* Left type column — left-aligned nouns, scrim behind for legibility
            wherever the object's highlights pass under the text. */}
        <div className="v4-col v4-col-left">
          {LEFT.map(renderNoun)}
        </div>

        {/* Center stage: object at rest, cross-fades to the active preview. */}
        <div ref={stageRef} className="v4-stage">
          <div className="v4-stage-object" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_OBJECT_SRC} alt="" />
          </div>
          <div
            className={`v4-stage-preview${activeProject ? " is-visible" : ""}`}
            aria-hidden="true"
          >
            {activeProject && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={imageSrc(activeProject.images[0])} alt="" />
            )}
          </div>
        </div>

        {/* Right type column — right-aligned nouns. */}
        <div className="v4-col v4-col-right">
          {RIGHT.map(renderNoun)}
        </div>
      </div>

      {/* Feet: the two About paragraphs, muted, as column feet under each
          type column. Lifted verbatim from the homepage About section. */}
      <div className="v4-foot">
        <p className="v4-foot-copy">
          One designer on speed dial, not an agency layer cake. Campaign
          visuals, editorial, decks and brand guidelines all stem from a single
          hand, so the work stays coherent and the line stays direct — concept
          to delivery, no drama.
        </p>
        <p className="v4-foot-copy">
          Ten years and counting, working with brands that care about the
          details — from annual reports to fragrance campaigns to the
          brandbooks that hold it all together.
        </p>
      </div>
    </section>
  );
}
