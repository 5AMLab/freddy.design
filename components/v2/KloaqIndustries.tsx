"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

// Industries for the /kloaq review page, replacing the old "What we do" +
// Clients section. Rhymes with KloaqServices ("What I Do") rather than
// repeating it: same [01]-style numbering, same muted->cream hover, same
// orange accent + tag reveal + closing link — but staged as a horizontal
// auto-scrolling marquee instead of vertical rows, with a floating preview
// image (not cursor-trailing) that swaps per hovered item.
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

export default function KloaqIndustries() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.style.animationPlayState =
      paused || prefersReducedMotion() ? "paused" : "running";
  }, [paused]);

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
            setPaused(h);
            setActive(h ? i : null);
          }}
        />
      ))}
    </div>
  );

  // Preview image lives at the section level (not inside the marquee row)
  // so it can float up beside the heading rather than being pinned to the
  // ticker's own top edge — same hover-driven crossfade, just a taller
  // travel range so it reads as "the section's image" rather than "the
  // marquee's image."
  const preview = (
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
    <section id="industries" className="kloaq-industries-section">
      <div className="kloaq-vlabel">Industries</div>

      <div className="kloaq-industries-head">
        <h2 className="kloaq-whatido-heading kloaq-industries-heading">
          Deep experience,
          <br />
          six verticals.
        </h2>
        {preview}
      </div>

      <div className="kloaq-industries-marquee-wrap">
        <div ref={trackRef} className="kloaq-industries-track">
          {sequence("a")}
          {sequence("b")}
        </div>
      </div>

      {/* No portfolio grid on this page (the case cloud up top is the hero) —
          the old /#portfolio anchor never existed, so link the work index. */}
      <a href="/work" className="kloaq-whatido-link">
        See our work across these verticals →
      </a>
    </section>
  );
}
