"use client";
import { useEffect, useRef, useState } from "react";

const industries = [
  {
    name: "F&B",
    desc: "Menus, seasonal promos, social content, packaging — design that drives appetite and footfall.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width={48} height={48}>
        <path d="M17,6 L31,6 L28,22 Q24,29 24,33 L24,40" stroke="#E8222E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M17,6 Q15,15 18,22 Q21,29 24,33" stroke="#E8222E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <line x1="19" y1="40" x2="29" y2="40" stroke="#E8222E" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="21" cy="13" r="2" fill="#FFD93D" />
        <circle cx="26" cy="18" r="1.3" fill="#FFD93D" opacity="0.7" />
        <circle cx="20" cy="19" r="1.3" fill="#FFD93D" opacity="0.5" />
      </svg>
    ),
  },
  {
    name: "Beauty",
    desc: "Campaign visuals, lookbooks, product launches — luxury aesthetics at every touchpoint.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width={48} height={48}>
        <rect x="18" y="22" width="12" height="20" rx="2.5" fill="none" stroke="#E8222E" strokeWidth="2.5" />
        <rect x="18" y="22" width="12" height="7" rx="1.5" fill="#E8222E" />
        <path d="M18,22 Q24,10 30,22" fill="#E8222E" stroke="#E8222E" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="10" y1="13" x2="10" y2="20" stroke="#FFD93D" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="6.5" y1="16.5" x2="13.5" y2="16.5" stroke="#FFD93D" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="38" cy="15" r="2.5" fill="#FFD93D" />
        <circle cx="36" cy="24" r="1.5" fill="#FFD93D" opacity="0.5" />
      </svg>
    ),
  },
  {
    name: "Tech",
    desc: "Pitch decks, product marketing, UI assets — for startups scaling fast without a full design team.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width={48} height={48}>
        <rect x="6" y="9" width="36" height="24" rx="3.5" fill="none" stroke="#E8222E" strokeWidth="2.5" />
        <line x1="24" y1="33" x2="24" y2="40" stroke="#E8222E" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="16" y1="40" x2="32" y2="40" stroke="#E8222E" strokeWidth="2.5" strokeLinecap="round" />
        <polyline points="14,17 10,21 14,25" stroke="#FFD93D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <polyline points="34,17 38,21 34,25" stroke="#FFD93D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <line x1="20" y1="15" x2="28" y2="27" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
  {
    name: "Finance",
    desc: "Reports, presentations, brand materials — credibility through design that builds trust instantly.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width={48} height={48}>
        <line x1="8" y1="40" x2="40" y2="40" stroke="#E8222E" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="10" y="26" width="7" height="14" rx="2" fill="#E8222E" />
        <rect x="20" y="18" width="7" height="22" rx="2" fill="#FFD93D" />
        <rect x="30" y="22" width="7" height="18" rx="2" fill="#E8222E" opacity="0.5" />
        <polyline points="34,12 38,8 42,12" stroke="#FFD93D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <line x1="38" y1="8" x2="38" y2="16" stroke="#FFD93D" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

function IndustryCard({ industry }: { industry: (typeof industries)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="fade-in"
      style={{
        border: `2px solid ${hovered ? "#E8222E" : "#252525"}`,
        borderRadius: "16px",
        padding: "32px 24px",
        background: hovered ? "#161616" : "transparent",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "border-color 0.2s, background 0.2s, transform 0.2s",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ width: "48px", height: "48px", marginBottom: "16px" }}>
        {industry.icon}
      </div>
      <div
        style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: "1.3rem",
          marginBottom: "8px",
          color: "white",
        }}
      >
        {industry.name}
      </div>
      <p
        style={{
          fontSize: "1rem",
          color: "#777",
          lineHeight: 1.6,
          fontWeight: 600,
        }}
      >
        {industry.desc}
      </p>
    </div>
  );
}

export default function Industries() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * 80);
          }
        });
      },
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .industries-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 768px) {
          .industries-section { padding: 60px 20px !important; }
          .industries-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .industries-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <section
        id="industries"
        className="industries-section"
        ref={ref}
        style={{ padding: "100px 60px", background: "#0f0f0f", color: "white" }}
      >
        <div
          style={{
            fontSize: "0.78rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "3px",
            color: "#E8222E",
            marginBottom: "12px",
          }}
        >
          Industries
        </div>
        <h2
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: "clamp(2.2rem, 3.5vw, 3.2rem)",
            lineHeight: 1.1,
            marginBottom: "56px",
            maxWidth: "640px",
            color: "white",
          }}
        >
          Built for businesses that move fast.
        </h2>

        <div className="industries-grid">
          {industries.map((industry) => (
            <IndustryCard key={industry.name} industry={industry} />
          ))}
        </div>
      </section>
    </>
  );
}
