"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

const industries = [
  {
    name: "F&B",
    fullName: "Food & Beverage",
    desc: "Menus, seasonal promos, social content, packaging — design that drives appetite and footfall.",
    href: "#portfolio",
    img: "/portfolio/maison-01.jpg",
  },
  {
    name: "Beauty",
    fullName: "Beauty & Wellness",
    desc: "Campaign visuals, lookbooks, product launches — luxury aesthetics at every touchpoint.",
    href: "#portfolio",
    img: "/portfolio/hermes-01.jpg",
  },
  {
    name: "Tech",
    fullName: "Technology",
    desc: "Pitch decks, product marketing, UI assets — for startups scaling fast without a full design team.",
    href: "#portfolio",
    img: "/portfolio/c-ai-hero-01.jpg",
  },
  {
    name: "Finance",
    fullName: "Finance & Banking",
    desc: "Reports, presentations, brand materials — credibility through design that builds trust instantly.",
    href: "#portfolio",
    img: "/portfolio/anz_hero-01.jpg",
  },
  {
    name: "Retail",
    fullName: "Retail & E-Commerce",
    desc: "Product imagery, campaign assets, packaging — design that converts browsers into buyers.",
    href: "#portfolio",
    img: "/portfolio/ooh-generic-01.jpg",
  },
  {
    name: "Hospitality",
    fullName: "Hospitality & Real Estate",
    desc: "Brand identities, venue collateral, property marketing — design that sells an experience.",
    href: "#portfolio",
    img: "/portfolio/ooh-generic-02.jpg",
  },
];

function IndustryCard({
  industry,
  index,
  onEnter,
  onLeave,
}: {
  industry: (typeof industries)[0];
  index: number;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={industry.href}
      className="v2-fade"
      style={{
        padding: "36px 0",
        borderBottom: "1px solid rgba(245,240,232,0.12)",
        cursor: "pointer",
        transition: "padding-left 0.4s cubic-bezier(0.16,1,0.3,1)",
        paddingLeft: hovered ? "16px" : "0",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: "24px",
        textDecoration: "none",
        transitionDelay: `${index * 80}ms`,
      }}
      onMouseEnter={() => {
        setHovered(true);
        onEnter();
      }}
      onMouseLeave={() => {
        setHovered(false);
        onLeave();
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "16px",
            marginBottom: "12px",
            flexWrap: "wrap",
          }}
        >
          <h3
            style={{
              fontFamily: "'Canela', serif",
              fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
              fontWeight: 400,
              color: hovered ? "#F5F0E8" : "rgba(245,240,232,0.85)",
              transition: "color 0.3s",
              lineHeight: 1,
              margin: 0,
            }}
          >
            {industry.fullName}
          </h3>
          <span
            style={{
              fontFamily: "'Canela', serif",
              fontSize: "0.9rem",
              fontStyle: "italic",
              fontWeight: 300,
              color: "rgba(245,240,232,0.35)",
            }}
          >
            {industry.name}
          </span>
        </div>
        <p
          style={{
            fontFamily: "'Sohne', sans-serif",
            fontSize: "0.95rem",
            lineHeight: 1.7,
            color: "rgba(245,240,232,0.75)",
            fontWeight: 400,
            maxWidth: "520px",
            margin: 0,
          }}
        >
          {industry.desc}
        </p>
      </div>
      <div
        className="industry-arrow-col"
        style={{
          fontFamily: "'Canela', serif",
          fontSize: "1.2rem",
          color: hovered ? "#C9A96E" : "rgba(245,240,232,0.25)",
          transition: "color 0.3s, transform 0.3s",
          transform: hovered ? "translateX(4px)" : "translateX(0)",
          flexShrink: 0,
        }}
      >
        →
      </div>
    </a>
  );
}

export default function IndustriesV2() {
  const ref = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [revealEnabled, setRevealEnabled] = useState(false);

  // Cursor-following work preview (mask-scale vocabulary, MOTION.md). Desktop
  // pointer devices only — touch gets the rows as-is.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setRevealEnabled(true);
  }, []);

  useEffect(() => {
    if (!revealEnabled || !ref.current || !revealRef.current) return;
    const section = ref.current;
    const frame = revealRef.current;
    // lagging lerp follow — the frame settles behind the cursor
    const xTo = gsap.quickTo(frame, "x", { duration: 0.55, ease: "power3" });
    const yTo = gsap.quickTo(frame, "y", { duration: 0.55, ease: "power3" });
    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      xTo(e.clientX - rect.left + 32);
      yTo(e.clientY - rect.top - 110);
    };
    section.addEventListener("mousemove", onMove);
    return () => section.removeEventListener("mousemove", onMove);
  }, [revealEnabled]);

  useEffect(() => {
    if (!revealEnabled || !revealRef.current) return;
    gsap.to(revealRef.current, {
      autoAlpha: active !== null ? 1 : 0,
      scale: active !== null ? 1 : 0.94,
      duration: 0.45,
      ease: "expo.out",
      overwrite: "auto",
    });
  }, [active, revealEnabled]);

  return (
    <section
      id="industries"
      ref={ref}
      className="industries-v2-section"
      style={{
        padding: "120px 72px",
        background: "#111111",
        borderTop: "1px solid rgba(201,169,110,0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {revealEnabled && (
        <div
          ref={revealRef}
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "300px",
            height: "220px",
            borderRadius: "2px",
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 3,
            opacity: 0,
            visibility: "hidden",
          }}
        >
          {industries.map((industry, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={industry.name}
              src={industry.img}
              alt=""
              loading="lazy"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: active === i ? 1 : 0,
                transform: active === i ? "scale(1)" : "scale(1.08)",
                transition:
                  "opacity 0.35s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          ))}
        </div>
      )}
      <div className="v2-fade" style={{ marginBottom: "64px" }}>
        <div
          style={{
            fontFamily: "'Sohne Breit', sans-serif",
            fontSize: "0.65rem",
            fontWeight: 400,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#C9A96E",
            marginBottom: "20px",
          }}
        >
          Industries
        </div>
        <h2
          style={{
            fontFamily: "'Canela', serif",
            fontSize: "clamp(2.4rem, 4vw, 3.8rem)",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "#F5F0E8",
            margin: 0,
          }}
        >
          Deep experience
          <br />
          across six verticals.
        </h2>
      </div>

      <div style={{ borderTop: "1px solid rgba(245,240,232,0.12)" }}>
        {industries.map((industry, index) => (
          <IndustryCard
            key={industry.name}
            industry={industry}
            index={index + 1}
            onEnter={() => setActive(index)}
            onLeave={() => setActive(null)}
          />
        ))}
      </div>

      <div className="v2-fade" style={{ marginTop: "48px" }}>
        <a
          href="#portfolio"
          style={{
            fontFamily: "'Sohne', sans-serif",
            fontSize: "0.85rem",
            fontWeight: 400,
            letterSpacing: "0.08em",
            color: "#C9A96E",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            borderBottom: "1px solid rgba(201,169,110,0.3)",
            paddingBottom: "2px",
            transition: "border-color 0.2s, gap 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#C9A96E";
            (e.currentTarget as HTMLAnchorElement).style.gap = "14px";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(201,169,110,0.3)";
            (e.currentTarget as HTMLAnchorElement).style.gap = "8px";
          }}
        >
          See our work across these verticals →
        </a>
      </div>
    </section>
  );
}
