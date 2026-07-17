"use client";

import { useEffect, useRef, useState } from "react";
import { imageSrc, getProject } from "@/lib/work";
import { PRELOADER_DONE_EVENT, alreadyPreloaded } from "@/components/motion/Preloader";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

/**
 * V4 hero — the "voice-dominant" statement hero (homepage `/`).
 *
 * Composition (the mode-3 direction): the studio's voice is the biggest thing
 * on the page — a three-line headline, "GREAT DESIGN / ON DEMAND / NO DRAMA"
 * with the middle line in accent orange — set over a full-bleed field
 * of real work. A quiet right-hand [ SERVICES ] column lists the six cases as
 * hoverable nouns; hovering a noun cross-fades the full-bleed BACKGROUND to
 * that project's hero image, so the proof lives behind the promise rather than
 * in a separate centre-stage object.
 *
 * Chosen over the earlier split-column + 3D-object hero: voice leads, the
 * backdrop is the portfolio itself (a stronger flex than an abstract render),
 * and legibility no longer depends on type dodging a floating object — a flat
 * scrim over every photo keeps the headline readable regardless of which
 * project is showing.
 *
 * The nouns DO NOT navigate. They are hover targets that drive the backdrop and
 * nothing else — no href, no click handler, no pointer cursor. The portfolio
 * section further down the page and the nav's Portfolio link are how you get
 * into a case; the hero's job is to state the voice and show the work behind it.
 *
 * At rest (load, and on mouse-leave) the backdrop is the static grain field
 * (BG_DEFAULT), not a project photo — a client's work only ever appears while
 * its own noun is hovered.
 *
 * Responsive: the same component at every width. Above lg (1024px) the headline
 * takes the left ~58% and the noun column sits right; at/below lg it stacks to
 * one left-aligned column (label → headline → services → feet).
 *
 * Pointer vs touch: on fine pointers the backdrop swap is a HOVER affordance
 * (approach-to-reveal). Touch has no cursor and no meaningful hover, so it
 * can't clone that — instead each noun is TAP-TO-TOGGLE: the first tap swaps
 * the backdrop and reveals the client tag (the same .is-active state hover
 * already drives), tapping the same noun again — or tapping outside the list —
 * returns to the grain field. Same payoff (proof photo + client name behind
 * the headline), touch-native trigger.
 */

interface Noun {
  label: string;
  slug: string;
}

// Six real cases, in reading order down the services column. Each noun swaps
// its project's hero image in as the backdrop on hover. Slugs map to lib/work.ts
// (they identify the project whose image to show — they are not links).
// "Design Deck" and "Website" have no dedicated case yet — they borrow the
// nearest existing project's imagery (Akuos deck, Maison Freddy) as a
// backdrop filler until real cases exist for them.
const NOUNS: Noun[] = [
  { label: "Annual Reports", slug: "anz-annual-report" },
  { label: "Brand Identity", slug: "cognitiv-ai-brand" },
  { label: "Campaigns", slug: "hermes-terre-campaign" },
  { label: "Design Deck", slug: "akuos-investor-deck" },
  { label: "Editorial", slug: "dad-intern-times" },
  { label: "Website", slug: "maison-freddy-cold-brew" },
];

// The rest-state backdrop: a static grain field, not a project photo. Preloaded
// in app/layout.tsx (<link rel="preload" as="image">) because it is the first
// thing the hero paints — without that it flashes in after first paint.
const BG_DEFAULT = "/bg/bg-orange-grain.jpg";

// Sentinel for "no noun hovered" — the backdrop falls through to BG_DEFAULT.
const NONE = null;

/** First image of a project, used as the full-bleed hero backdrop. */
const bgSrc = (slug: string): string | undefined => {
  const p = getProject(slug);
  return p ? imageSrc(p.images[0]) : undefined;
};

export default function HeroStatementV4() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(NONE);
  // Synchronous mirror of `active`, read by onMouseLeave: React state lags a
  // render behind, so a fast pointer crossing two nouns could otherwise reset
  // the backdrop the SECOND noun just set.
  const activeRef = useRef<string | null>(NONE);

  const isCoarse = () => !window.matchMedia("(pointer: fine)").matches;

  const setActiveCase = (slug: string | null) => {
    activeRef.current = slug;
    setActive(slug);
  };

  // Touch: tap a noun to toggle it active (swap backdrop + reveal tag), tap it
  // again to release. Tapping outside the noun list also releases — handled by
  // a document-level listener rather than onBlur, since these are <div>s (not
  // focusable) and a tap doesn't blur anything.
  useEffect(() => {
    if (!isCoarse()) return;
    const onDocPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest(".v4-services")) setActiveCase(NONE);
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, []);

  // Entrance: the headline lines rise + fade in a stagger as the preloader
  // wipes up; the chrome and services settle after. Only when the preloader is
  // actually running this session (first paint) — on repeat visits the hero
  // renders at rest, so nothing here ever hides content post-paint.
  //
  // Gated on sessionStorage (via alreadyPreloaded()), NOT
  // document.documentElement.dataset.preloaderDone — that DOM attribute isn't
  // persisted across a navigation. Nav links here are bare <a href>, so every
  // route change is a full document reload and the attribute resets even
  // though the preloader already played this session. That let this effect
  // treat every "back to /" as a first paint: it hid the headline/services
  // (autoAlpha: 0) and waited on PRELOADER_DONE_EVENT, which never fires
  // outside Preloader's own first mount — so the 6s failsafe timeout was
  // often what finally revealed the hero. sessionStorage survives full
  // reloads, which is the whole reason Preloader itself uses it.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    if (alreadyPreloaded()) return;

    let killed = false;
    let cleanup: (() => void) | undefined;

    // GSAP is loaded lazily so the hero's first paint isn't blocked on it.
    import("gsap").then(({ default: gsap }) => {
      if (killed || !sectionRef.current) return;
      const sec = sectionRef.current;
      const lines = sec.querySelectorAll(".v4-voice-line");
      const chrome = sec.querySelectorAll(
        ".v4-body > .kloaq-vlabel, .v4-services"
      );
      // Safe to hide here: the preloader overlay covers the page right now.
      gsap.set(lines, { autoAlpha: 0, yPercent: 40 });
      gsap.set(chrome, { autoAlpha: 0, y: 14 });

      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        const tl = gsap.timeline();
        // clearProps: the CSS accent colour + hover states need inline
        // opacity/transform gone once the entrance settles.
        tl.to(lines, {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          clearProps: "opacity,visibility,transform",
        });
        tl.to(
          chrome,
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out", clearProps: "all" },
          "-=0.7"
        );
      };

      window.addEventListener(PRELOADER_DONE_EVENT, play, { once: true });
      const failsafe = window.setTimeout(play, 6000);
      cleanup = () => {
        window.removeEventListener(PRELOADER_DONE_EVENT, play);
        window.clearTimeout(failsafe);
      };
    });

    return () => {
      killed = true;
      cleanup?.();
    };
  }, []);

  // A noun is a hover target, not a link: a <div>, no href, nothing to
  // navigate. Fine pointers get hover (approach-to-reveal); coarse pointers
  // get tap-to-toggle. Both drive the same `active` state and the same
  // .is-active CSS — there is no separate touch styling to maintain.
  const renderNoun = (noun: Noun) => {
    const project = getProject(noun.slug);
    if (!project) return null;
    const isActive = active === noun.slug;
    return (
      <div
        key={noun.slug}
        className={`v4-noun${isActive ? " is-active" : ""}`}
        onMouseEnter={() => {
          if (!isCoarse()) setActiveCase(noun.slug);
        }}
        onMouseLeave={() => {
          // Back to the grain field, guarding against a fast crossing where a
          // later noun already claimed `active`.
          if (!isCoarse() && activeRef.current === noun.slug) {
            setActiveCase(NONE);
          }
        }}
        onClick={() => {
          if (!isCoarse()) return; // fine pointers already got this on hover
          // Toggle: tapping the already-active noun releases it; tapping a
          // different one switches straight to it.
          setActiveCase(activeRef.current === noun.slug ? NONE : noun.slug);
        }}
      >
        <span className="v4-noun-label">{noun.label}</span>
        {/* Client attribution — a quiet proof tag revealed on hover/tap. */}
        <span className="v4-noun-client" aria-hidden="true">
          {project.client}
        </span>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="kloaq-cases-section v3-hero v4-hero"
      id="cases"
    >
      {/* Full-bleed backdrop: the grain field always painted at the base, with
          one <img> layer per noun stacked over it and cross-faded in on hover.
          With no noun hovered every project layer is opacity:0, so the grain is
          what shows — at load and on mouse-leave alike. A single scrim over the
          stack keeps the headline legible regardless of which project is
          showing. Decorative — aria-hidden. */}
      <div className="v4-bg-stack" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="v4-bg-default" src={BG_DEFAULT} alt="" />
        {NOUNS.map((noun) => {
          const src = bgSrc(noun.slug);
          if (!src) return null;
          return (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={noun.slug}
              className={`v4-bg${active === noun.slug ? " is-active" : ""}`}
              src={src}
              alt=""
            />
          );
        })}
        <div className="v4-bg-scrim" />
      </div>

      {/* ONE left column: label → headline → services, stacked in reading
          order. The nouns sit UNDER the messaging (not beside it) — the
          headline states the promise, the list names the work. */}
      <div className="v4-body">
        {/* Bare words — .kloaq-vlabel adds the [ brackets ] itself. */}
        <div className="kloaq-vlabel">Creative Studio</div>

        {/* Voice — the biggest thing on the page. Real <h1> for semantics; the
            three lines are the headline, middle line accented. */}
        <h1 className="v4-voice">
          <span className="v4-voice-line">Great design</span>
          <span className="v4-voice-line is-accent">On demand</span>
          <span className="v4-voice-line">No drama</span>
        </h1>

        {/* Services — the six cases as hover targets that swap the backdrop.
            A plain <div>, not a <nav>: nothing in here navigates. */}
        <div className="v4-services">
          <span className="v4-services-label">[ Services ]</span>
          {NOUNS.map(renderNoun)}
          <a href="/work" className="v4-see-all">
            All Projects
            <span className="v4-see-all-arrow" aria-hidden="true">
              <svg viewBox="0 0 16 16">
                <path
                  d="M4 4h8v8M12 4L4 12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>

    </section>
  );
}
