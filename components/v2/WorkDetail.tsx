"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/styles/kloaq.css";
import {
  type Project,
  type ProjectImage,
  type ImageLayout,
  type Beat,
  imageSrc,
  imageLayout,
} from "@/lib/work";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";
import KloaqNavbar from "@/components/v2/KloaqNavbar";
import KloaqFooter from "@/components/v2/KloaqFooter";

/**
 * Turn a flat image list into an editorial rhythm. Each slot resolves to a
 * concrete role: an explicit `{ layout }` hint wins; otherwise the role is
 * derived from position so a bare `images: string[]` still paces itself into
 * hero → pair → wide → offset → … instead of one monotonous column.
 *
 * Auto-pacing rule (per project, index i):
 *   i === 0                    → "full"   (full-bleed hero)
 *   then a repeating 4-beat cycle over the remaining images:
 *     beat 0,1 → "pair"  (the two sit side by side)
 *     beat 2   → "wide"
 *     beat 3   → "offset"
 * A trailing lone "pair" (odd count) is promoted to "wide" so it never
 * renders as a half-width orphan next to empty space.
 */
function deriveLayout(images: ProjectImage[]): ImageLayout[] {
  const roles: ImageLayout[] = images.map((img, i) => {
    const hint = imageLayout(img);
    if (hint) return hint;
    if (i === 0) return "full";
    const beat = (i - 1) % 4;
    if (beat === 0 || beat === 1) return "pair";
    if (beat === 2) return "wide";
    return "offset";
  });

  // Fix up orphan pairs: a "pair" with no adjacent "pair" partner can't form a
  // row, so widen it. Walk the list and pair greedily left-to-right.
  for (let i = 0; i < roles.length; i++) {
    if (roles[i] !== "pair") continue;
    const partnerIsPair = roles[i + 1] === "pair";
    if (partnerIsPair) {
      i++; // consume the partner; this row is complete
    } else {
      roles[i] = "wide"; // lone pair → full-width band
    }
  }
  return roles;
}

/**
 * Group the resolved roles into render rows: consecutive "pair"s become a
 * two-up row; everything else is its own single-item row. Offsets alternate
 * their side (left/right) across the page for asymmetry.
 */
type Row =
  | { kind: "pair"; items: { src: string; index: number }[] }
  | { kind: "full" | "wide" | "offset"; src: string; index: number; side?: "left" | "right" };

function buildRows(images: ProjectImage[]): Row[] {
  const roles = deriveLayout(images);
  const rows: Row[] = [];
  let offsetCount = 0;

  for (let i = 0; i < images.length; i++) {
    const role = roles[i];
    const src = imageSrc(images[i]);
    if (role === "pair" && roles[i + 1] === "pair") {
      rows.push({
        kind: "pair",
        items: [
          { src, index: i },
          { src: imageSrc(images[i + 1]), index: i + 1 },
        ],
      });
      i++; // skip the partner
    } else if (role === "offset") {
      rows.push({ kind: "offset", src, index: i, side: offsetCount % 2 === 0 ? "left" : "right" });
      offsetCount++;
    } else {
      // "full", "wide", or any pair that survived as a single (shouldn't after
      // deriveLayout's fix-up, but render it safely as a wide band).
      rows.push({ kind: role === "pair" ? "wide" : role, src, index: i });
    }
  }
  return rows;
}

/**
 * The last image index a row covers — a pair covers both its items, everything
 * else covers its single index. Used to place beats after the right row.
 */
function rowLastIndex(row: Row): number {
  return row.kind === "pair" ? row.items[row.items.length - 1].index : row.index;
}

/**
 * Interleave narrative beats into the row list. A beat with `after: N` is
 * emitted once the row whose coverage reaches index N has rendered (so a beat
 * pointing at either image of a pair lands after that whole pair, never
 * mid-row). `after: -1` emits before the first row. Beats whose index never
 * matches a row (e.g. out of range) are flushed at the end so copy is never
 * silently dropped.
 */
type Block =
  | { type: "row"; row: Row; key: string }
  | { type: "beat"; beat: Beat; key: string };

function buildBlocks(images: ProjectImage[], beats: Beat[] = []): Block[] {
  const rows = buildRows(images);
  const sorted = [...beats].sort((a, b) => a.after - b.after);
  const blocks: Block[] = [];
  let bi = 0;

  const flushBeatsUpTo = (coveredIndex: number) => {
    while (bi < sorted.length && sorted[bi].after <= coveredIndex) {
      blocks.push({ type: "beat", beat: sorted[bi], key: `beat-${bi}` });
      bi++;
    }
  };

  // Beats anchored before the first image (after: -1).
  flushBeatsUpTo(-1);

  rows.forEach((row, r) => {
    blocks.push({ type: "row", row, key: `row-${r}` });
    flushBeatsUpTo(rowLastIndex(row));
  });

  // Any remaining beats (after-index past the last image) close out the run.
  while (bi < sorted.length) {
    blocks.push({ type: "beat", beat: sorted[bi], key: `beat-${bi}` });
    bi++;
  }
  return blocks;
}

/** A narrative beat — kicker + short body, with a self-contained fade-up on
 *  scroll-in. Deliberately NOT the shared `.v2-fade`/MotionProvider batch:
 *  on a case page the beats are the only fade targets and the first one often
 *  loads already inside the viewport, which the shared `once` batch doesn't
 *  reveal reliably. This own-effect sets the hidden state and reveals with an
 *  immediate check for already-in-view, so a beat above the fold on load
 *  still shows. Reduced motion: rendered visible, no tween. */
function BeatBlock({ beat }: { beat: Beat }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return; // CSS leaves it visible
    gsap.registerPlugin(ScrollTrigger);

    gsap.set(el, { opacity: 0, y: 24 });
    const anim = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "expo.out",
      scrollTrigger: {
        trigger: el,
        // `top 92%` catches it as it enters from below; if the beat is
        // already within the viewport on load (common for the first beat,
        // just under the hero), ScrollTrigger fires onEnter on init anyway
        // because its start is already passed.
        start: "top 92%",
        once: true,
      },
    });
    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);

  return (
    <div className="work-beat">
      {/* is-anim: opacity:0 at rest so there's no flash before the effect
          runs; JS drives the reveal. Reduced motion overrides it visible. */}
      <div ref={ref} className="work-beat-inner is-anim">
        <div className="work-beat-kicker">{beat.kicker}</div>
        <p className="work-beat-body">{beat.body}</p>
      </div>
    </div>
  );
}

/** A single framed image with the site's mask-scale reveal on entry. The
 *  `.mask-scale-media` inner element is what MotionProvider scales 1.12→1;
 *  it sits inside the clipped rounded frame so the scale never bleeds past
 *  the corners.
 *
 *  `parallax` (full-bleed bands only): the media is over-tall (see
 *  .work-frame-media.is-parallax in kloaq.css — 120% height, top-anchored)
 *  and drifts vertically as the band crosses the viewport, so the image
 *  moves slower than the scroll. Skipped under reduced motion, where the
 *  media just fills the frame normally. */
function WorkImage({
  src,
  alt,
  aspect,
  priority,
  sizes,
  parallax,
}: {
  src: string;
  alt: string;
  aspect: string;
  priority?: boolean;
  sizes: string;
  parallax?: boolean;
}) {
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!parallax || prefersReducedMotion()) return;
    const el = mediaRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    // The media box is 120% of the frame height, anchored to the top (CSS).
    // That leaves 20% of headroom below; drift the media across that range
    // (from -0% down to the full -20% overflow) as the band travels the
    // viewport, so it never reveals an unpainted edge.
    const tween = gsap.fromTo(
      el,
      { yPercent: 0 },
      {
        yPercent: -16,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest(".work-frame"),
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [parallax]);

  return (
    <div className="work-frame" style={{ aspectRatio: aspect }}>
      <div
        ref={mediaRef}
        className={`mask-scale-media work-frame-media${parallax ? " is-parallax" : ""}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority={priority}
          loading={priority ? undefined : "lazy"}
        />
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-body), sans-serif", fontSize: "0.72rem", fontWeight: 600,
          letterSpacing: "0.04em", textTransform: "uppercase",
          color: "var(--orange)", marginBottom: "8px",
        }}
      >
        [{label.toUpperCase()}]
      </div>
      <div
        style={{
          fontFamily: "var(--font-body), sans-serif", fontSize: "0.9rem", fontWeight: 300,
          color: "rgba(249,249,249,0.7)", lineHeight: 1.5,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function WorkDetail({ project, next }: { project: Project; next: Project }) {
  return (
    <div style={{ background: "var(--black)", minHeight: "100vh" }}>
      <KloaqNavbar />

      {/* Hero — the lead image full-bleed at the very top, with the client +
          title overlaid on it. This is where the shared-element flight lands
          (SharedElementOverlay targets .work-hero-frame), so the image being
          the top section makes the transition honest — nothing drops in after
          text. The `← All work` back link sits top-left over the image; the
          title block anchors bottom-left over a scrim for legibility. */}
      <section className="work-hero">
        <div className="work-hero-frame">
          {/* No mask-scale here: the hero's "entrance" is the shared-element
              flight (or an instant paint on direct load). The shared
              mask-scale batch also wouldn't fire reliably for an element
              already at the top on load (same reason beats use a self-
              contained trigger), which would leave the image stuck at
              scale 1.12. */}
          <div className="work-hero-media">
            <Image
              src={imageSrc(project.images[0])}
              alt={`${project.title} — ${project.client}`}
              fill
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
            />
          </div>
          <div className="work-hero-scrim" aria-hidden="true" />
        </div>

        <Link href="/work" className="work-hero-back">
          ← All work
        </Link>

        <div className="work-hero-caption">
          <div className="kloaq-vlabel">{project.client}</div>
          <h1 className="work-hero-title">{project.title}</h1>
        </div>
      </section>

      {/* Intro — the lead paragraph, on its own band under the hero so the
          image reads as the top section and the framing follows it. */}
      <div className="work-intro">
        <p>{project.intro}</p>
      </div>

      {/* Body — sticky meta rail beside the image sequence. The rail rides
          the scroll so Client/Discipline/Year/Role stay on screen through
          long image runs; it collapses above the images on narrow screens
          (see .work-body in kloaq.css). */}
      <div className="work-body">
        <aside className="work-rail">
          <div className="work-rail-sticky">
            <MetaItem label="Client" value={project.client} />
            <MetaItem label="Discipline" value={project.category} />
            <MetaItem label="Year" value={project.year} />
            <MetaItem label="Role" value={project.role} />
          </div>
        </aside>

        {/* Image sequence — an editorial rhythm (hero / two-up / wide /
            offset) derived from position or per-image hints, rather than one
            uniform column, with narrative beats interleaved between rows
            (problem → move → result). Each frame reveals with the site's
            mask-scale motion; the full-bleed hero also parallaxes. */}
        <div className="work-detail-images">
          {buildBlocks(project.images, project.beats).map((block) => {
            if (block.type === "beat") {
              return <BeatBlock key={block.key} beat={block.beat} />;
            }

            const row = block.row;
            // Image index 0 is rendered as the hero section above, not in the
            // body run — skip its row here. `buildBlocks` still SEES it (so the
            // rhythm indices and beats' `after` values stay stable), we just
            // don't paint it a second time. A single image never reaches a
            // pair partner at index 0, so this only ever matches its own row.
            const rowStartIndex = row.kind === "pair" ? row.items[0].index : row.index;
            if (rowStartIndex === 0) return null;

            const altFor = (n: number) => `${project.title} — image ${n + 1}`;

            if (row.kind === "pair") {
              return (
                <div className="work-row work-row-pair" key={block.key}>
                  {row.items.map((item) => (
                    <WorkImage
                      key={item.src}
                      src={item.src}
                      alt={altFor(item.index)}
                      aspect="4/5"
                      sizes="(max-width: 900px) 100vw, 40vw"
                    />
                  ))}
                </div>
              );
            }

            if (row.kind === "full") {
              return (
                <div className="work-row work-row-full" key={block.key}>
                  <WorkImage
                    src={row.src}
                    alt={altFor(row.index)}
                    aspect="16/9"
                    priority={row.index === 0}
                    sizes="100vw"
                    parallax
                  />
                </div>
              );
            }

            if (row.kind === "offset") {
              return (
                <div
                  className={`work-row work-row-offset work-row-offset-${row.side}`}
                  key={block.key}
                >
                  <WorkImage
                    src={row.src}
                    alt={altFor(row.index)}
                    aspect="3/2"
                    sizes="(max-width: 900px) 100vw, 60vw"
                  />
                </div>
              );
            }

            // "wide"
            return (
              <div className="work-row work-row-wide" key={block.key}>
                <WorkImage
                  src={row.src}
                  alt={altFor(row.index)}
                  aspect="3/2"
                  sizes="(max-width: 900px) 100vw, 80vw"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Next-project bridge — echoes the homepage hero's cloud language: the
          next project's name set huge in Boldonse, cream at rest and flipping
          to an orange outline on hover, with its lead image revealing behind
          the type. Turns the case page into a loop rather than a dead end. */}
      <Link
        href={`/work/${next.slug}`}
        data-cursor="view"
        className="work-next"
      >
        <div className="work-next-media" aria-hidden="true">
          <Image
            src={imageSrc(next.images[0])}
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
            loading="lazy"
          />
        </div>
        <div className="work-next-inner">
          <div className="work-next-label">[Next project]</div>
          <h2 className="work-next-title">{next.title}</h2>
          <span className="work-next-client">{next.client} →</span>
        </div>
      </Link>

      <KloaqFooter />
    </div>
  );
}
