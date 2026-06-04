"use client";
import { useEffect, useRef } from "react";

const steps = [
  {
    num: "Step 01",
    title: "Pick a Plan",
    desc: "Choose a monthly retainer that fits your volume. No long contracts, no surprises, no HR paperwork.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
        <rect x="5" y="5" width="22" height="24" rx="3" fill="none" stroke="#E8222E" strokeWidth="2" />
        <rect x="11" y="3" width="10" height="5" rx="2.5" fill="#E8222E" />
        <line x1="10" y1="14" x2="22" y2="14" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="19" x2="18" y2="19" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <line x1="10" y1="24" x2="20" y2="24" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  },
  {
    num: "Step 02",
    title: "Brief Me Directly",
    desc: "WhatsApp, voice note, rough doc — whatever works. No formal briefing process, no account manager in between.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
        <rect x="3" y="5" width="20" height="16" rx="4" fill="none" stroke="#E8222E" strokeWidth="2" />
        <path d="M6 25 L11 21 H23" stroke="#E8222E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="9" cy="13" r="2" fill="#FFD93D" />
        <circle cx="13" cy="13" r="2" fill="#FFD93D" />
        <circle cx="17" cy="13" r="2" fill="#FFD93D" />
      </svg>
    ),
  },
  {
    num: "Step 03",
    title: "I Get to Work",
    desc: "Standard turnaround is 48 hours. Your brand assets are always ready in a shared folder — no re-briefing needed.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
        <rect x="13" y="3" width="7" height="18" rx="2.5" fill="none" stroke="#E8222E" strokeWidth="2" />
        <polygon points="13,21 20,21 16.5,28" fill="#FFD93D" stroke="#E8222E" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="13" y="3" width="7" height="5" rx="2.5" fill="#E8222E" />
        <line x1="24" y1="8" x2="27" y2="5" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="13" x2="28" y2="13" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="9" x2="7" y2="12" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "Step 04",
    title: "Refine & Deliver",
    desc: "Revisions until you're happy. Files delivered in any format — print-ready or screen-optimised.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
        <circle cx="16" cy="16" r="12" fill="none" stroke="#E8222E" strokeWidth="2" />
        <polyline points="9,16 13,20 23,11" stroke="#FFD93D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
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
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }
        @media (max-width: 768px) {
          .how-section { padding: 60px 20px !important; }
          .steps-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .step-item {
            flex-direction: row !important;
            align-items: flex-start !important;
          }
          .step-icon-box { flex-shrink: 0; }
        }
      `}</style>

      <section
        id="how"
        className="how-section"
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
          How It Works
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
          Simpler than hiring. Faster than an agency.
        </h2>

        <div className="steps-grid">
          {steps.map((step) => (
            <div
              key={step.num}
              className="step-item fade-in"
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div
                className="step-icon-box"
                style={{
                  width: "60px",
                  height: "60px",
                  background: "#1a1a1a",
                  border: "2px solid #2a2a2a",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {step.icon}
              </div>
              <div
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: "0.8rem",
                  color: "#E8222E",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                {step.num}
              </div>
              <div
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: "1.4rem",
                  color: "white",
                }}
              >
                {step.title}
              </div>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#888",
                  lineHeight: 1.7,
                  fontWeight: 600,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
