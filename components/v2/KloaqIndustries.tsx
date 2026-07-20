"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";
import Magnetic from "@/components/motion/Magnetic";
import { openBrief } from "@/components/v2/BriefFlow";

// MANIFESTO — the homepage's closing block, and three former sections in one:
//
//   1. the manifesto statement (the studio's "one small team" copy, which used
//      to be a flat two-column About block inlined in app/page.tsx),
//   2. the industries marquee (this component's original job), and
//   3. the primary CTA button (the same button KloaqCTA renders, minus that
//      section's watermark treatment).
//
// They read as one argument — here's how we work, here's who we work with,
// let's talk — rather than three separate fields saying it in sequence. The
// large "LET'S TALK" background watermark is deliberately NOT carried over: the
// reference has this block sitting quiet, with the button as its only accent.
//
// KloaqCTA itself still exists and is still rendered by /pricing, /about,
// /kloaq and /v4 — it is only the HOMEPAGE that no longer has it as a separate
// section, because this block absorbed its job.
//
// The marquee itself is unchanged: same [01]-style numbering, same muted->cream
// hover, same orange accent + tag reveal, same floating preview image that
// swaps per hovered item.
const industries = [
  {
    name: "Food & Beverage",
    short: "F&B",
    img: "/portfolio/maison-01.jpg",
  },
  {
    name: "Beauty & Wellness",
    short: "Beauty",
    img: "/portfolio/hermes-01.jpg",
  },
  {
    name: "Technology",
    short: "Tech",
    img: "/portfolio/c-ai-hero-01.jpg",
  },
  {
    name: "Finance & Banking",
    short: "Finance",
    img: "/portfolio/anz_hero-01.jpg",
  },
  {
    name: "Retail & E-Commerce",
    short: "Retail",
    img: "/portfolio/ooh-generic-01.jpg",
  },
  {
    name: "Hospitality & Real Estate",
    short: "Hospitality",
    img: "/portfolio/ooh-generic-02.jpg",
  },
];

function MarqueeItem({
  industry,
  index,
  hovered,
  onHoverChange,
}: {
  industry: (typeof industries)[0];
  index: number;
  hovered: boolean;
  onHoverChange: (hovered: boolean) => void;
}) {
  return (
    <div
      className="kloaq-industry-item"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <span className={`kloaq-industry-num${hovered ? " is-active" : ""}`}>
        [{String(index + 1).padStart(2, "0")}]
      </span>
      <span className={`kloaq-industry-name${hovered ? " is-active" : ""}`}>
        {industry.name}
      </span>
      <span className={`kloaq-industry-tag${hovered ? " is-active" : ""}`}>
        {industry.short}
      </span>
    </div>
  );
}

/**
 * `manifesto` — the homepage's merged block: manifesto statement + marquee +
 * primary CTA, owning id="cta". The default ("industries") is the original
 * standalone section — heading, marquee, closing link, no CTA — which /kloaq
 * and /v4 still use, and which must NOT claim id="cta" there because those
 * pages render a real KloaqCTA section of their own further down.
 */
export default function KloaqIndustries({
  variant = "industries",
}: {
  variant?: "industries" | "manifesto";
}) {
  const isManifesto = variant === "manifesto";
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  // Read every frame by the rAF drive below — a ref, not state, so hovering
  // a row never re-renders the whole marquee.
  const pausedRef = useRef(false);

  // Scroll-velocity marquee: JS takes over from the CSS keyframe loop (which
  // stays in the stylesheet as the no-JS fallback) and advances the track at
  // the same base drift PLUS the scroll delta, so scrolling makes the marquee
  // hurry and letting go eases it back to its idle pace — the same physics the
  // logo wall already has. Hover eases the drift to zero instead of hard-
  // pausing playState. The loop only runs while the track is near the viewport
  // (IntersectionObserver), and all layout reads are cached (ResizeObserver)
  // so the per-frame work is float math + one transform write.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return;

    track.style.animation = "none";

    let half = track.scrollWidth / 2;
    const ro = new ResizeObserver(() => {
      half = track.scrollWidth / 2;
    });
    ro.observe(track);

    let offset = 0;
    let speed = 0; // current px/s, eased toward the base drift
    let lastY = window.scrollY;
    let lastT = 0;
    let rafId = 0;
    let running = false;

    const tick = (now: number) => {
      const dt = Math.min((now - lastT) / 1000, 0.1); // clamp tab-away jumps
      lastT = now;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;

      if (half > 0) {
        // Base drift matches the old CSS loop (half width per 34s); hover
        // eases it — and the scroll boost — down to a stop.
        const target = pausedRef.current ? 0 : half / 34;
        speed += (target - speed) * Math.min(1, dt * 8);
        const boost = pausedRef.current ? 0 : Math.abs(dy) * 0.35;
        offset = (((offset + speed * dt + boost) % half) + half) % half;
        track.style.transform = `translateX(${-offset}px)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          lastT = performance.now();
          lastY = window.scrollY;
          rafId = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(rafId);
        }
      },
      { rootMargin: "100px 0px" }
    );
    io.observe(track);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      track.style.animation = "";
      track.style.transform = "";
    };
  }, []);

  // Two identical sequences back to back, translated by -50% on loop — the
  // standard seamless-marquee trick.
  const sequence = (key: string) => (
    <div className="kloaq-industry-seq" key={key}>
      {industries.map((industry, i) => (
        <MarqueeItem
          key={`${key}-${industry.short}`}
          industry={industry}
          index={i}
          hovered={active === i}
          onHoverChange={(h) => {
            pausedRef.current = h;
            setActive(h ? i : null);
          }}
        />
      ))}
    </div>
  );

  // Floating hover-preview image beside the heading. The MANIFESTO variant
  // (homepage) has none — it was the source of a tall dead zone in that block
  // (a 180px image slot padding the head row out even while invisible at rest),
  // and the manifesto is a statement, not an image gallery. The plain
  // `industries` variant (/kloaq, /v4) keeps it.
  const preview = isManifesto ? null : (
    <div
      aria-hidden
      className="kloaq-industries-preview"
      style={{ opacity: active !== null ? 1 : 0 }}
    >
      {industries.map((ind, i) => (
        <Image
          key={ind.short}
          src={ind.img}
          alt=""
          fill
          sizes="270px"
          style={{
            objectFit: "cover",
            opacity: active === i ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      ))}
    </div>
  );

  return (
    /* On the homepage (manifesto) this section IS the CTA target — the nav's
       "Let's Talk" (href="#cta") and the footer's "Contact" land here. On
       /kloaq and /v4 it must NOT claim that id: those pages still render a real
       KloaqCTA section further down, which owns it. */
    <section
      id={isManifesto ? "cta" : "industries"}
      /* The manifesto is a LIGHT field — light-gray background, dark type — the
         inverse of the dark sections around it. .kloaq-light-section does the
         whole inversion by re-pointing --cream/--muted/--hairline to their
         ink-on-light equivalents, so every rule already written against those
         tokens (the heading, the statement, the marquee rows, the hairlines)
         repaints correctly with no per-rule overrides. Orange stays orange. */
      className={`kloaq-industries-section${
        isManifesto ? " kloaq-manifesto-section kloaq-light-section" : ""
      }`}
    >
      {/* Bare words — .kloaq-vlabel adds the [ brackets ] itself. */}
      <div className="kloaq-vlabel fade-up">
        {isManifesto ? "Manifesto" : "Industries"}
      </div>

      <div
        className={`kloaq-industries-head${
          isManifesto ? " kloaq-manifesto-head" : ""
        }`}
      >
        {isManifesto ? (
          <div className="kloaq-manifesto-copy">
            <h2 className="kloaq-whatido-heading kloaq-industries-heading reveal-line">
              <span className="line-mask">
                <span className="line">Your dedicated</span>
              </span>
              <span className="line-mask">
                <span className="line kloaq-heading-accent">
                  design partner.
                </span>
              </span>
            </h2>
            <p className="kloaq-manifesto-statement fade-up">
              You brief one small team and that team stays with it — no account
              layer, no handoffs between departments, no telephone game between
              the idea and the file that ships. The thinking and the making are
              the same two hands, so nothing gets lost in translation.
            </p>
          </div>
        ) : (
          <h2 className="kloaq-whatido-heading kloaq-industries-heading reveal-line">
            <span className="line-mask">
              <span className="line">Deep experience,</span>
            </span>
            <span className="line-mask">
              <span className="line">six verticals.</span>
            </span>
          </h2>
        )}
        {preview}
      </div>

      <div className="kloaq-industries-marquee-wrap fade-up">
        <div ref={trackRef} className="kloaq-industries-track">
          {sequence("a")}
          {sequence("b")}
        </div>
      </div>

      {isManifesto ? (
        /* The homepage's primary CTA — the same button KloaqCTA renders, with
           the same Magnetic wrapper + openBrief() handler as the nav and the
           mobile menu, so every CTA on the site opens the one brief flow. */
        <div className="kloaq-manifesto-action fade-up">
          <Magnetic>
            <button className="kloaq-cta-btn" onClick={openBrief}>
              <span className="kloaq-btn-roll" data-text="Let's work together">
                <span>Let&apos;s work together</span>
              </span>
            </button>
          </Magnetic>
        </div>
      ) : (
        <a href="/work" className="kloaq-whatido-link fade-up">
          See our work across these verticals →
        </a>
      )}
    </section>
  );
}
