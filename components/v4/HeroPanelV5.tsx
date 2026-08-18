"use client";

import { useEffect, useRef, useState } from "react";
import { imageSrc, getProject } from "@/lib/work";
import { PRELOADER_DONE_EVENT, alreadyPreloaded } from "@/components/motion/Preloader";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

/**
 * V5 hero — the "bounded panel" statement hero (review route `/v5`).
 *
 * The direction this replaces (HeroStatementV4, still live on `/`) put the
 * work FULL-BLEED behind the headline with a 40% scrim over it. That failed
 * for a structural reason, not a tuning one: the assets are design work, so
 * they contain their own typography. At 1440 the Hermès frame set
 * "TERRE D'HERMÈS" directly behind "NO DRAMA"; at 375 the Cognitiv billboard
 * mockup put a wordmark, body copy and a QR code under every headline line.
 * A scrim only lowers luminance — it cannot stop STRUCTURE from reading as
 * competing content, which is why the old CSS had to keep the wash at 40%
 * and still lost.
 *
 * The fix here is territorial rather than tonal:
 *
 *   - The voice sits on FLAT INK. No photo behind the headline at all, so it
 *     runs at full contrast and needs no scrim.
 *   - The work lives in ONE BOUNDED PANEL with hard edges and the site's 14px
 *     image radius — right column on desktop, a band under the nouns at/below
 *     lg. Because the panel owns its own space, a client's work reads as work
 *     being SHOWN, not as wallpaper, and the photos run undimmed.
 *
 * Kept from v4: voice leads, real proof, hover-to-swap. Changed: the nouns are
 * cut from six to the FOUR projects with real imagery (v4's "Design Deck" and
 * "Website" borrowed another case's photo, so the hover promise was false for
 * a third of the list), and they are set smaller than the headline so the
 * hierarchy the docblock claims is the hierarchy the page actually renders.
 *
 * The nouns DO NOT navigate — same contract as v4. They drive the panel and
 * nothing else. The portfolio section below and the nav's Portfolio link are
 * how you get into a case.
 */

interface Noun {
  label: string;
  slug: string;
}

// Four cases, each with REAL imagery in public/portfolio (no placeholder
// borrowing). Slugs map to lib/work.ts — they identify which project's photo
// the panel shows, they are not links.
const NOUNS: Noun[] = [
  { label: "Annual Reports", slug: "anz-annual-report" },
  { label: "Brand Identity", slug: "cognitiv-ai-brand" },
  { label: "Campaigns", slug: "hermes-terre-campaign" },
  { label: "Pitch Decks", slug: "akuos-investor-deck" },
];

// Autoplay cadence. Four nouns at 2.8s closes the loop in ~11s, so a visitor
// who stays a few seconds sees the mechanic cycle rather than reading it as a
// banner rotator (v4's six-at-4s ran 24s, well past anyone's patience).
const CYCLE_MS = 2800;

// Panel cross-fade duration. MUST stay in sync with the `transition` on
// .v5-panel-img in kloaq.css — the caption timing below is derived from it.
const FADE_MS = 700;

/** First image of a project — the panel art. */
const panelSrc = (slug: string): string | undefined => {
  const p = getProject(slug);
  return p ? imageSrc(p.images[0]) : undefined;
};

export default function HeroPanelV5() {
  const sectionRef = useRef<HTMLElement>(null);
  // Index, not slug: the panel always shows SOMETHING (there is no empty
  // rest state to fall back to the way v4 fell back to its grain field), so
  // "nothing selected" isn't a state this hero has.
  const [activeIndex, setActiveIndex] = useState(0);
  // Synchronous mirror, read by handlers that must not lag a render behind.
  const activeRef = useRef(0);
  const stopAutoplayRef = useRef<() => void>(() => {});
  // The caption is driven by a SEPARATE, delayed index — see below.
  const [captionIndex, setCaptionIndex] = useState(0);

  const isCoarse = () => !window.matchMedia("(pointer: fine)").matches;

  const select = (index: number) => {
    activeRef.current = index;
    setActiveIndex(index);
  };

  /* The panel cross-fades over 0.7s (--v5-fade below), so for that whole
     window the element carrying .is-active and the pixels actually on screen
     disagree. v4 had this same split and read its client tag straight off the
     active class, which meant the tag named a project the visitor could not
     yet see — during autoplay the label and the photo were out of step most
     of the time.

     So the CAPTION runs on its own index that lands at the fade's midpoint:
     the outgoing photo is mostly gone, the incoming one is mostly there, and
     the words change with the image rather than ahead of it. Under reduced
     motion the swap is instant (the transition is disabled in CSS), so the
     caption follows immediately with no delay at all. */
  useEffect(() => {
    if (prefersReducedMotion()) {
      setCaptionIndex(activeIndex);
      return;
    }
    const id = window.setTimeout(() => setCaptionIndex(activeIndex), FADE_MS / 2);
    return () => window.clearTimeout(id);
  }, [activeIndex]);

  // Autoplay: cycles the panel so the hero shows real work before anyone
  // touches it. Killed for good — not paused — the instant the visitor picks
  // a noun themselves, so their choice always wins.
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const id = window.setInterval(() => {
      select((activeRef.current + 1) % NOUNS.length);
    }, CYCLE_MS);
    stopAutoplayRef.current = () => window.clearInterval(id);

    return () => window.clearInterval(id);
  }, []);

  // Entrance: headline lines rise + fade in a stagger as the preloader wipes
  // up, chrome and panel settle after. Gated on sessionStorage (NOT the
  // dataset attribute) because nav links are bare <a href> — every route
  // change is a full document reload, which resets the attribute even though
  // the preloader already played this session. Same gate v4 uses, same reason.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    if (alreadyPreloaded()) return;

    let killed = false;
    let cleanup: (() => void) | undefined;

    import("gsap").then(({ default: gsap }) => {
      if (killed || !sectionRef.current) return;
      const sec = sectionRef.current;
      const lines = sec.querySelectorAll(".v5-voice-line");
      const chrome = sec.querySelectorAll(".v5-copy > .kloaq-vlabel, .v5-services");
      const panel = sec.querySelectorAll(".v5-panel");
      // Safe to hide: the preloader overlay covers the page right now.
      gsap.set(lines, { autoAlpha: 0, yPercent: 40 });
      gsap.set(chrome, { autoAlpha: 0, y: 14 });
      gsap.set(panel, { autoAlpha: 0, y: 24 });

      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        const tl = gsap.timeline();
        tl.to(lines, {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          clearProps: "opacity,visibility,transform",
        });
        tl.to(
          panel,
          { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", clearProps: "all" },
          "-=0.8"
        );
        tl.to(
          chrome,
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out", clearProps: "all" },
          "-=0.75"
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

  // A noun is a hover/tap target, not a link. Fine pointers drive it on hover;
  // coarse pointers tap to select. Unlike v4 there is no toggle-off — the
  // panel has no empty state, so a tap just moves the selection.
  const renderNoun = (noun: Noun, index: number) => {
    const project = getProject(noun.slug);
    if (!project) return null;
    const isActive = activeIndex === index;
    return (
      <div
        key={noun.slug}
        className={`v5-noun${isActive ? " is-active" : ""}`}
        onMouseEnter={() => {
          if (isCoarse()) return;
          stopAutoplayRef.current();
          select(index);
        }}
        onClick={() => {
          if (!isCoarse()) return; // fine pointers already got this on hover
          stopAutoplayRef.current();
          select(index);
        }}
      >
        <span className="v5-noun-label">{noun.label}</span>
      </div>
    );
  };

  // Caption reads the DELAYED index, so it names the photo that is actually
  // on screen rather than the one mid-fade.
  const captionProject = getProject(NOUNS[captionIndex].slug);

  return (
    <section ref={sectionRef} className="v5-hero" id="hero">
      <div className="v5-inner">
        {/* LEFT — voice on flat ink. Nothing behind it, so no scrim. */}
        <div className="v5-copy">
          {/* Bare words — .kloaq-vlabel adds the [ brackets ] itself. */}
          <div className="kloaq-vlabel">Creative Studio</div>

          <h1 className="v5-voice">
            <span className="v5-voice-line">One small team</span>
            <span className="v5-voice-line is-accent">One voice</span>
            <span className="v5-voice-line">Start to finish</span>
          </h1>

          {/* The nouns, set well below headline scale so the voice keeps the
              hierarchy. A plain <div>, not a <nav>: nothing here navigates. */}
          <div className="v5-services">
            <span className="v5-services-label">[ Services ]</span>
            <div className="v5-noun-list">{NOUNS.map(renderNoun)}</div>
            <a href="/work" className="v5-see-all">
              All Projects
              <span className="v5-see-all-arrow" aria-hidden="true">
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

        {/* RIGHT — the bounded panel. One <img> per noun, stacked and
            cross-faded. Hard edges + the site's 14px radius give the work its
            own territory, so it runs UNDIMMED: no scrim anywhere in here. */}
        <div className="v5-panel">
          <div className="v5-panel-frame">
            {NOUNS.map((noun, index) => {
              const src = panelSrc(noun.slug);
              if (!src) return null;
              return (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={noun.slug}
                  className={`v5-panel-img${activeIndex === index ? " is-active" : ""}`}
                  src={src}
                  alt=""
                  aria-hidden="true"
                />
              );
            })}
          </div>
          {/* Caption rides UNDER the panel, not over the photo — the client
              tag never has to fight the image it names. */}
          <div className="v5-panel-caption">
            <span className="v5-panel-client">{captionProject?.client}</span>
            <span className="v5-panel-category">{captionProject?.category}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
