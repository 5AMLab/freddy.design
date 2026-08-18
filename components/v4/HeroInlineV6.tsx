"use client";

import { useEffect, useRef, useState } from "react";
import { imageSrc, getProject } from "@/lib/work";
import { PRELOADER_DONE_EVENT, alreadyPreloaded } from "@/components/motion/Preloader";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

/**
 * V6 hero — the "inline card" statement hero (review route `/v6`).
 *
 * The idea this builds: the work sits INSIDE the headline's text flow rather
 * than behind it (v4, full-bleed under a scrim) or beside it (v5, bounded
 * panel in its own column). Two image cards are inline runs in the sentence,
 * so type and work occupy the same line and read as one composition.
 *
 * Why this beats both earlier attempts: nothing overlaps, so nothing needs a
 * scrim. v4 put client work full-bleed behind the h1 and lost — the assets are
 * design work, they carry their own typography, and a 40% wash lowers
 * luminance without stopping STRUCTURE from competing. Here the images are
 * punctuation within the sentence; the collision can't happen because the type
 * and the art never share pixels.
 *
 * TYPEFACE FORK (deliberate, and site-wide in consequence): this headline is
 * INTER TIGHT, not Boldonse. Boldonse is extremely wide — the display face
 * every other h2 on the site uses — and this composition needs a headline that
 * can hold a full sentence at large size with room for two inline cards. In
 * Boldonse this copy would run five or six lines and the cards would have
 * nowhere to sit. So the hero headline no longer matches the section headings
 * below it. That is the trade this direction requires; it is not an oversight.
 *
 * Cards are FIXED: one card, one destination, one image. They do not cycle.
 * A card that swapped images inside a line of type would reflow the line on
 * every swap unless every asset were locked to one ratio — fixed sidesteps
 * that entirely, and keeps the cards reading as navigation rather than as a
 * rotating showcase.
 */

/**
 * The "See Projects" reel — a CROSS-PROJECT compilation, not one project's
 * contact sheet. The card links to /work (the whole portfolio), so showing a
 * single client's images misrepresented what is behind the link; this cycles
 * one or two frames from each real project so the card previews the range.
 *
 * Frames are chosen on MEASURED contrast, not by eye. The label sits directly
 * on the photo with no plate and no text-shadow, so a bright frame would
 * swallow it. Every image here clears 4.5:1 against cream (#F5F1EA) in the
 * centre band the label occupies — measured per file:
 *
 *   akuos-00b.avif   lum  40   12.8:1
 *   hermes-04.jpg    lum  47   11.6:1
 *   akuos-01.jpg     lum  55   10.3:1
 *   anz-05.jpg       lum  67    8.6:1
 *   cognitiv-03.webp lum  70    8.2:1
 *   hermes-02.jpg    lum  77    7.3:1
 *
 * Excluded for failing that bar: every remaining ANZ frame (anz-02 at 212 lum
 * is 1.3:1), akuos-02/03, cognitiv-01/04/05/06/07, hermes-05 (4.98, passes but
 * left out to keep one frame per project pair). If you swap a frame in here,
 * measure it first — there is no scrim to catch a bright one.
 *
 * Ordered to alternate clients rather than group them, so consecutive swaps
 * read as different work rather than as one project's slideshow.
 */
const PROJECT_REEL: string[] = [
  "/portfolio/hermes-04.jpg",
  "/portfolio/akuos-00b.avif",
  "/portfolio/cognitiv-03.webp",
  "/portfolio/anz-05.jpg",
  "/portfolio/hermes-02.jpg",
  "/portfolio/akuos-01.jpg",
];

/**
 * Frames for one card. A card with an explicit `reel` cycles that list; a card
 * without one is STATIC and shows its project's first image only.
 */
const cardImages = (segment: Extract<Segment, { kind: "card" }>): string[] => {
  if (segment.reel) return segment.reel;
  const p = getProject(segment.slug);
  return p ? [imageSrc(p.images[0])] : [];
};

/**
 * Autoplay cadence for the card reels. Deliberately slow: the cards are
 * punctuation inside a sentence someone is still reading, so a swap every few
 * seconds reads as ambient life, while anything faster turns the headline into
 * a flickering banner and actively fights legibility.
 */
const REEL_MS = 3600;


/**
 * The headline, as an ordered run of text and cards. Kept as data (not JSX
 * prose) so the copy and the card positions can be reordered without
 * re-deriving the layout — the renderer just walks this list.
 *
 * Copy note: "Brands built to be remembered — in a world built to forget"
 * turns on a real antithesis (built/built, remembered/forget) rather than a
 * claim plus modifiers, which is what the earlier candidates were. Swap the
 * strings here to retune; the renderer just walks this list, so copy and card
 * placement can change without touching layout.
 */
type Segment =
  | { kind: "text"; value: string }
  | {
      kind: "card";
      label: string;
      href: string;
      slug: string;
      /**
       * Frames to cycle. Omit for a STATIC card — it then shows `slug`'s first
       * image and starts no timer at all.
       */
      reel?: string[];
      /** Removed from the sentence below 560px — see the Discover Us entry. */
      hideOnMobile?: boolean;
    };

const SEGMENTS: Segment[] = [
  // NOTE: the headline no longer opens with "Studio Kavea" — the studio name
  // was appearing three times in one viewport (wordmark, eyebrow, headline).
  // It now lives in the eyebrow above (see the .v6-label in the markup), which
  // is where a standing identity belongs, and the headline is free to be only
  // the claim. Dropping it also bought back ~380px on the first line, which is
  // what lets the See Projects card push "in a" on hover without forcing a
  // wrap.
  {
    kind: "card",
    label: "Discover Us",
    href: "/about",
    // Static: this is one destination with one face, and a second moving
    // card beside the reel would make the sentence restless.
    slug: "cognitiv-ai-brand",
    // Dropped entirely below 560px. On a phone the cards degrade to inline
    // text links, and this one sits at the very START of the sentence — so
    // the headline opened "Discover Us Brands built to be remembered", which
    // reads as a stray label rather than a sentence. The nav still carries
    // About, so nothing is lost; See Projects stays because it falls mid
    // sentence where a link reads naturally.
    hideOnMobile: true,
  },
  // The line is an antithesis — "built to be remembered" against "built to
  // forget" — so the cards are placed to respect its two clauses rather than
  // to break them: Discover Us leads the first, See Projects sits on the pivot
  // where the sentence turns. The em dash stays attached to the text run
  // before it so the punctuation can never start a line on its own.
  { kind: "text", value: "Brands built to be remembered —" },
  {
    kind: "card",
    label: "See Projects",
    href: "/work",
    // The portfolio card cycles the cross-project compilation above.
    slug: "hermes-terre-campaign",
    reel: PROJECT_REEL,
  },
  { kind: "text", value: "in a world built to forget." },
];

/**
 * One inline card: a cross-fading reel of a project's images with the label
 * overlaid, sized to sit inside the headline's line box.
 *
 * Its own component (not inline JSX in the hero) so each card owns an
 * INDEPENDENT timer. A single shared interval driving both would swap them on
 * the same tick, which reads as one slideshow spanning the sentence rather
 * than two projects living separately.
 */
function InlineCard({ segment }: { segment: Extract<Segment, { kind: "card" }> }) {
  const images = cardImages(segment);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // A static card (no `reel`) resolves to one image and starts no timer.
    if (images.length < 2) return;
    // MOTION.md: no entrances under reduced motion. An unattended, looping
    // cross-fade is exactly the kind of ambient movement that setting exists
    // to stop, so the card holds on its first frame instead.
    if (prefersReducedMotion()) return;

    const interval = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, REEL_MS);

    return () => window.clearInterval(interval);
  }, [images.length]);

  return (
    <a className="v6-card" href={segment.href}>
      <span className="v6-card-inner">
        <span className="v6-card-media" aria-hidden="true">
          {/* Every frame is rendered and stacked; only opacity changes, so a
              swap never re-decodes an image or reflows the card. A static card
              renders exactly one of these. */}
          {images.map((src, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={src}
              className={`v6-card-frame${i === index ? " is-active" : ""}`}
              src={src}
              alt=""
              /* First frame of each card is what paints on load; the rest can
                 wait until the reel reaches them. */
              loading={i === 0 ? "eager" : "lazy"}
            />
          ))}
        </span>
        {/* INSIDE the stretching frame, so the label's `left: 50%` resolves
            against the frame's current width and it re-centres as the card
            opens on hover. This is only safe because the frame animates its
            real WIDTH — back when it used scaleX, anything nested here was
            stretched along with it and needed a counter-scale to undo. */}
        <span className="v6-card-label">{segment.label}</span>
      </span>
    </a>
  );
}

export default function HeroInlineV6() {
  const sectionRef = useRef<HTMLElement>(null);

  // Reduced motion: CSS hides the video, but a hidden <video> still downloads
  // and decodes frames. Pause it and drop the source so the preference costs
  // nothing in bandwidth or CPU rather than just being invisible.
  useEffect(() => {
    if (!prefersReducedMotion()) return;
    const video = sectionRef.current?.querySelector("video");
    if (!video) return;
    video.pause();
    video.removeAttribute("src");
    video.load();
  }, []);

  // Entrance: the headline reveals word-run by word-run as the preloader wipes
  // up, cards settling after. Gated on sessionStorage (NOT the dataset
  // attribute) because nav links are bare <a href> — every route change is a
  // full document reload, which resets the attribute even though the preloader
  // already played this session.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    if (alreadyPreloaded()) return;

    let killed = false;
    let cleanup: (() => void) | undefined;

    import("gsap").then(({ default: gsap }) => {
      if (killed || !sectionRef.current) return;
      const sec = sectionRef.current;
      const label = sec.querySelectorAll(".v6-label");
      const runs = sec.querySelectorAll(".v6-run");
      const cards = sec.querySelectorAll(".v6-card");
      // Safe to hide: the preloader overlay covers the page right now.
      gsap.set(label, { autoAlpha: 0, y: 14 });
      gsap.set(runs, { autoAlpha: 0, y: 24 });
      gsap.set(cards, { autoAlpha: 0, y: 24 });

      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        // ease-out-luxe + stagger-line, per MOTION.md's tokens.
        const tl = gsap.timeline();
        tl.to(label, { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out" });
        tl.to(
          runs,
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.12,
            clearProps: "opacity,visibility,transform",
          },
          "-=0.6"
        );
        tl.to(
          cards,
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.1,
            clearProps: "opacity,visibility,transform",
          },
          "-=0.95"
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

  return (
    <section ref={sectionRef} className="v6-hero" id="hero">
      {/* Ambient background video. Decorative only — it carries no information
          the copy does not, so it is aria-hidden and has no captions track.
          muted + playsInline are what make autoplay legal on iOS and in
          Chrome; without muted the browser blocks playback outright.
          poster paints the first frame's colour immediately so the hero never
          flashes the bare ink background while the file loads. */}
      <div className="v6-bg" aria-hidden="true">
        <video
          className="v6-bg-video"
          src="/video/abstract-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        {/* Empty by design — the footage is dark enough to carry the headline
            unaided (measured: 4.83:1 at its brightest pixel). Kept as a hook
            so a scrim can be reinstated in one place if the video is swapped
            for something lighter. See .v6-bg-scrim in kloaq.css. */}
        <div className="v6-bg-scrim" />
      </div>

      <div className="v6-inner">
        {/* Bare words — .kloaq-vlabel adds the [ brackets ] itself.
            Carries the studio NAME now, not the category: the headline used to
            open with "Studio Kavea" and the eyebrow said "Creative Studio",
            which put the name twice in the same block (three times counting
            the wordmark). The name is the standing identity, so it belongs
            here; the headline says the thing worth saying. */}
        <div className="kloaq-vlabel v6-label">Studio Kavea</div>

        {/* The headline is ONE <h1> whose inline flow contains the cards. The
            cards are real anchors inside the sentence, so they are reachable
            in the tab order at the point they are read. */}
        <h1 className="v6-voice">
          {SEGMENTS.map((seg, i) =>
            seg.kind === "text" ? (
              /* The space AFTER each run is explicit. JSX collapses the
                 whitespace between sibling elements, so without it the
                 sentence renders as "KaveaDiscover Us" once the cards degrade to
                 inline text links at ≤560px. On wider screens the card's own
                 margin supplies the gap, but this costs nothing there. */
              <span className="v6-run" key={i}>
                {seg.value}{" "}
              </span>
            ) : (
              /* The wrapper owns the separating space so BOTH can be
                 dropped together: hiding only the anchor on mobile would
                 leave its trailing space behind as a stray double gap at the
                 start of the sentence. It also keeps the space outside the
                 <a>, where an underline would otherwise extend across it. */
              <span
                key={i}
                className={`v6-card-slot${seg.hideOnMobile ? " is-mobile-hidden" : ""}`}
              >
                <InlineCard segment={seg} />{" "}
              </span>
            )
          )}
        </h1>
      </div>
    </section>
  );
}
