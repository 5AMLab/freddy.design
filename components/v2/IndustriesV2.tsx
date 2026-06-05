"use client";
import { useEffect, useRef, useState } from "react";

const industries = [
  {
    name: "F&B",
    fullName: "Food & Beverage",
    desc: "Menus, seasonal promos, social content, packaging — design that drives appetite and footfall.",
  },
  {
    name: "Beauty",
    fullName: "Beauty & Wellness",
    desc: "Campaign visuals, lookbooks, product launches — luxury aesthetics at every touchpoint.",
  },
  {
    name: "Tech",
    fullName: "Technology",
    desc: "Pitch decks, product marketing, UI assets — for startups scaling fast without a full design team.",
  },
  {
    name: "Finance",
    fullName: "Finance & Banking",
    desc: "Reports, presentations, brand materials — credibility through design that builds trust instantly.",
  },
];

function IndustryCard({ industry, index }: { industry: (typeof industries)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="v2-fade"
      style={{
        padding: "40px 0",
        borderBottom: "1px solid rgba(245,240,232,0.06)",
        cursor: "default",
        transition: "padding-left 0.4s cubic-bezier(0.16,1,0.3,1)",
        paddingLeft: hovered ? "16px" : "0",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: "24px",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "16px",
            marginBottom: "10px",
          }}
        >
          <h3
            style={{
              fontFamily: "'Canela', serif",
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              fontWeight: 400,
              color: hovered ? "#F5F0E8" : "rgba(245,240,232,0.6)",
              transition: "color 0.3s",
              lineHeight: 1,
            }}
          >
            {industry.name}
          </h3>
          <span
            style={{
              fontFamily: "'Canela', serif",
              fontSize: "1rem",
              fontStyle: "italic",
              fontWeight: 300,
              color: "rgba(245,240,232,0.2)",
            }}
          >
            {industry.fullName}
          </span>
        </div>
        <p
          style={{
            fontFamily: "'Sohne', sans-serif",
            fontSize: "0.88rem",
            lineHeight: 1.7,
            color: "rgba(245,240,232,0.6)",
            fontWeight: 300,
            maxWidth: "480px",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 0.3s, transform 0.3s",
          }}
        >
          {industry.desc}
        </p>
      </div>
      <div
        style={{
          fontFamily: "'Canela', serif",
          fontSize: "1.2rem",
          color: hovered ? "#C9A96E" : "rgba(245,240,232,0.1)",
          transition: "color 0.3s, transform 0.3s",
          transform: hovered ? "translateX(0)" : "translateX(-8px)",
        }}
      >
        →
      </div>
    </div>
  );
}

export default function IndustriesV2() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("v2-visible"), i * 100);
          }
        });
      },
      { threshold: 0.05 }
    );
    ref.current?.querySelectorAll(".v2-fade").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>

      <section
        id="industries"
        ref={ref}
        className="industries-v2-section"
        style={{
          padding: "120px 72px",
          background: "#111111",
          borderTop: "1px solid rgba(201,169,110,0.08)",
        }}
      >
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
            }}
          >
            Built for businesses
            <br />
            that move fast.
          </h2>
        </div>

        <div style={{ borderTop: "1px solid rgba(245,240,232,0.06)" }}>
          {industries.map((industry, i) => (
            <IndustryCard key={industry.name} industry={industry} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
