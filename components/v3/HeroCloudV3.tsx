"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, imageSrc } from "@/lib/work";
import { RETAINER_SLOTS } from "@/lib/site";
import { PRELOADER_DONE_EVENT } from "@/components/motion/Preloader";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";
import { startTransition } from "@/lib/pageTransition";

/**
 * V3 hero — the KloaqCases typographic cloud, recomposed to own the full
 * viewport. Differences from the v2 hero it forks (components/v2/KloaqCases):
 *
 * - No showreel. The cloud spans the full content width and the section is
 *   100svh, laid out as top strip (label + positioning line) / cloud /
 *   bottom strip (scroll cue + availability).
 * - Positioning line: the v2 hero showed client names with no statement of
 *   who this is; the tagline top-right carries that.
 * - Entrance choreography: the preloader used to wipe up onto an already-
 *   settled page. Now the words rise in a stagger handed off from
 *   PRELOADER_DONE_EVENT. Plays only when the preloader actually ran this
 *   session (first paint) — on repeat client navigations the cloud renders
 *   at rest, which also avoids any SSR flash-then-hide.
 * - Scroll-velocity skew on the cloud (ScrollTrigger.getVelocity → skewY,
 *   clamped, easing back to 0 on scroll end).
 * - The trailing thumb picks up a small velocity-driven rotation; its
 *   clip-path wipe reveal lives in kloaq.css (.v3-hero, fine pointers only).
 * - Sibling names dim while one is active — pure CSS (:has) in kloaq.css.
 *
 * Touch behavior (tap-to-reveal, pinned preview, close button) is carried
 * over from v2 unchanged, including the activeRef race fix for fast Android
 * taps and the coarse-pointer gating on synthetic mouse events.
 */
const DISPLAY_NAME: Record<string, string> = {
  "maison-freddy-cold-brew": "Blue Cat",
  "cognitiv-ai-brand": "Cognitiv",
  // È's accent mark overlapped the row above in the cloud's tight
  // line-height — plain E avoids the collision (live /work pages keep the é).
  "hermes-terre-campaign": "Hermes",
};

export default function HeroCloudV3() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  // Synchronous mirror of `active` for the tap handler — see v2's comment on
  // the Android double-tap race.
  const activeRef = useRef<string | null>(null);

  const thumbToRef = useRef<{
    x: gsap.QuickToFunc;
    y: gsap.QuickToFunc;
    rot: gsap.QuickToFunc;
  } | null>(null);
  const lastXRef = useRef<number | null>(null);
  const rotResetRef = useRef<number | null>(null);

  const isCoarse = () => !window.matchMedia("(pointer: fine)").matches;

  // Entrance: words rise in a stagger as the preloader wipes up. Only when
  // the preloader is actually running this session — if it already finished
  // (client-side nav back to this page), the cloud must render at rest, so
  // nothing here ever hides content post-paint.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    if (document.documentElement.dataset.preloaderDone === "1") return;

    const words = section.querySelectorAll(".kloaq-case");
    const chrome = section.querySelectorAll(
      ".v3-hero-top, .v3-hero-voice, .v3-hero-foot"
    );
    // Safe to hide here: the preloader overlay is covering the page right now.
    gsap.set(words, { autoAlpha: 0, yPercent: 55 });
    gsap.set(chrome, { autoAlpha: 0, y: 14 });

    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      const tl = gsap.timeline();
      // clearProps at the end: the CSS sibling-dim (:has) and touch-active
      // transforms need inline opacity/transform gone once the entrance
      // settles, or GSAP's inline styles would override them forever.
      tl.to(words, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.07,
        clearProps: "opacity,visibility,transform",
      }).to(
        chrome,
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out", clearProps: "all" },
        "-=0.75"
      );
    };

    window.addEventListener(PRELOADER_DONE_EVENT, play, { once: true });
    // Failsafe mirrors the preloader's own: never leave the hero hidden.
    const failsafe = window.setTimeout(play, 6000);
    return () => {
      window.removeEventListener(PRELOADER_DONE_EVENT, play);
      window.clearTimeout(failsafe);
    };
  }, []);

  // Scroll-velocity skew on the cloud. Lenis already pipes into
  // ScrollTrigger.update (MotionProvider), so getVelocity reflects the
  // smoothed scroll. quickTo re-targets every tick; scrollEnd eases it home.
  useEffect(() => {
    const cloud = cloudRef.current;
    if (!cloud || prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.set(cloud, { transformOrigin: "center center", force3D: true });
    const skewTo = gsap.quickTo(cloud, "skewY", {
      duration: 0.5,
      ease: "power3.out",
    });
    const clamp = gsap.utils.clamp(-3.5, 3.5);

    // The trigger below fires on EVERY scroll update, page-wide — without
    // this gate it kept writing transforms to the (huge) cloud element long
    // after the hero scrolled out of view, dirtying style/layout every frame
    // for the whole rest of the page. Only skew while the hero is on screen.
    let onScreen = true;
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    io.observe(cloud);

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        if (!onScreen) return;
        skewTo(clamp(self.getVelocity() / -350));
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

  // Thumb trail setters — fine pointer + motion allowed only, same as v2,
  // plus a rotation channel fed by horizontal cursor velocity in move().
  useEffect(() => {
    if (isCoarse() || prefersReducedMotion()) return;
    const thumb = thumbRef.current;
    if (!thumb) return;

    gsap.set(thumb, { scale: 0.92 });
    thumbToRef.current = {
      x: gsap.quickTo(thumb, "x", { duration: 0.5, ease: "power3.out" }),
      y: gsap.quickTo(thumb, "y", { duration: 0.5, ease: "power3.out" }),
      rot: gsap.quickTo(thumb, "rotation", { duration: 0.6, ease: "power3.out" }),
    };
  }, []);

  const move = (e: React.MouseEvent) => {
    if (isCoarse()) return;
    const to = thumbToRef.current;
    if (!to) return;
    to.x(e.clientX);
    to.y(e.clientY);

    // Velocity tilt: lean into the horizontal travel direction, then relax
    // upright shortly after the cursor stops.
    const lastX = lastXRef.current;
    if (lastX !== null) {
      to.rot(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.45));
    }
    lastXRef.current = e.clientX;
    if (rotResetRef.current !== null) window.clearTimeout(rotResetRef.current);
    rotResetRef.current = window.setTimeout(() => to.rot(0), 90);
  };

  const setActiveCase = (id: string | null) => {
    activeRef.current = id;
    setActive(id);
  };

  // Coarse-pointer tap-to-reveal, unchanged from v2 (see its comments for
  // the iPad synthetic-mouseenter and Android double-tap details).
  const tap = (e: React.MouseEvent, id: string) => {
    if (!isCoarse()) return;
    if (activeRef.current !== id) {
      e.preventDefault();
      const el = thumbRef.current;
      if (el) {
        const { width, height } = el.getBoundingClientRect();
        el.style.left = `${e.clientX - width / 2}px`;
        el.style.top = `${e.clientY - height / 2}px`;
      }
      setActiveCase(id);
    }
  };

  // Desktop click → shared-element flight. The trailing preview thumb is
  // already visible over the hovered word (hover set `active`), so its rect is
  // the natural "grab point": we hand that rect + the project image to the
  // page-level overlay, then navigate client-side (router.push, not the <a>'s
  // full load) so the overlay survives the route change and can fly the image
  // into the case hero. Falls through to the plain <a> on touch, reduced
  // motion, modified clicks (new-tab), or if the thumb rect isn't available.
  const navigate = (e: React.MouseEvent, slug: string, project: (typeof projects)[number]) => {
    if (isCoarse()) return; // touch uses tap-to-reveal; let the <a> handle it
    if (prefersReducedMotion()) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    const frame = thumbRef.current?.querySelector<HTMLElement>(".kloaq-thumb-frame");
    if (!frame) return; // no visible preview to fly from → normal navigation

    const r = frame.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;

    e.preventDefault();
    startTransition({
      src: imageSrc(project.images[0]),
      from: { top: r.top, left: r.left, width: r.width, height: r.height },
      slug,
    });
    // Hide the trailing thumb immediately so it doesn't sit under the flying
    // clone during the route change.
    setActiveCase(null);
    router.push(`/work/${slug}`);
  };

  // Grow the thumb to full size while a case is active — plain gsap.to, not
  // quickTo (see v2's comment on quickTo's resetTo prerequisite).
  useEffect(() => {
    if (isCoarse() || prefersReducedMotion()) return;
    const thumb = thumbRef.current;
    if (!thumb) return;
    gsap.to(thumb, { scale: active ? 1 : 0.92, duration: 0.45, ease: "power3.out" });
  }, [active]);

  const activeProject = projects.find((p) => p.id === active);

  return (
    <section
      ref={sectionRef}
      className="kloaq-cases-section v3-hero"
      id="cases"
      onMouseMove={move}
    >
      <div className="v3-hero-top">
        <div className="kloaq-vlabel">Selected work</div>
        {/* Interaction affordance: the cloud's hover-to-preview is invisible
            until you accidentally find it, so name it. Fine pointers only —
            .v3-hero is hidden ≤820px, where the touch carousel hero takes
            over, so this never shows on touch. */}
        <span className="v3-hero-cue" aria-hidden="true">
          Hover a name to preview
        </span>
      </div>

      <div className="kloaq-cases-content">
        {/* Orientation line, in the site's own display voice (Boldonse, same
            face as the cloud + About statement) — tells a first-timer who this
            is without a pitch or CTA. Lifted from the About closing statement
            so the page speaks with one voice. */}
        <p className="v3-hero-voice">
          Ten years making the things a brand is <em>remembered by</em>.
        </p>
        <div ref={cloudRef} className="kloaq-cloud">
          {projects.map((p, i) => (
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
              onClick={(e) => {
                tap(e, p.id);
                if (!e.defaultPrevented) navigate(e, p.slug, p);
              }}
            >
              <span className="kloaq-case-thumb" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageSrc(p.images[0])} alt="" loading="lazy" />
              </span>
              <span className="kloaq-case-text">
                <span className="kloaq-case-name">{DISPLAY_NAME[p.slug] ?? p.client}</span>
                <span className="kloaq-case-meta">
                  <span className="kloaq-case-index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="kloaq-case-tag">{p.category}</span>
                </span>
              </span>
            </a>
          ))}

          <a href="/work" className="kloaq-case">
            <span className="kloaq-case-text">
              <span className="kloaq-case-name is-outline">All Work</span>
              <span className="kloaq-case-meta">
                <span className="kloaq-case-tag">Overview →</span>
              </span>
            </span>
          </a>
        </div>
      </div>

      <div className="v3-hero-foot">
        <span className="v3-hero-scrollcue">Scroll</span>
        <span className="v3-hero-slots">
          {RETAINER_SLOTS.open} of {RETAINER_SLOTS.total} retainer slots open
          for {RETAINER_SLOTS.month}
        </span>
      </div>

      {/* Cursor-trailing preview / touch-pinned preview — same element and
          logic as v2; v3 CSS adds a clip-path wipe on fine pointers. */}
      <div
        ref={thumbRef}
        className={`kloaq-thumb${active ? " is-visible" : ""}`}
        aria-hidden="true"
      >
        {activeProject && (
          <>
            <span className="kloaq-thumb-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc(activeProject.images[0])} alt="" />
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
