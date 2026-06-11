"use client";
import { useRef } from "react";

const steps = [
  {
    num: "01",
    title: "Pick a Plan",
    desc: "Choose a monthly retainer that fits your volume. No long contracts, no surprises, no HR paperwork.",
  },
  {
    num: "02",
    title: "Brief Me Directly",
    desc: "WhatsApp, voice note, rough doc — whatever works. No formal briefing process, no account manager in between.",
  },
  {
    num: "03",
    title: "I Get to Work",
    desc: "Standard turnaround is 48 hours. Your brand assets are always ready in a shared folder — no re-briefing needed.",
  },
  {
    num: "04",
    title: "Refine & Deliver",
    desc: "Revisions until you're happy. Files delivered in any format — print-ready or screen-optimised.",
  },
];

export default function HowItWorksV2() {
  const ref = useRef<HTMLElement>(null);

  return (
    <>

      <section
        id="how-it-works"
        ref={ref}
        className="how-v2-section"
        style={{
          padding: "120px 72px",
          background: "#111111",
          borderTop: "1px solid rgba(201,169,110,0.08)",
        }}
      >
        <div className="v2-fade" style={{ marginBottom: "80px" }}>
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
            The Process
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
            Simpler than hiring.
            <br />
            Faster than an agency.
          </h2>
        </div>

        <div
          className="how-v2-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2px",
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="v2-fade"
              style={{
                padding: "40px 32px",
                background: "rgba(245,240,232,0.02)",
                borderRight: i < 3 ? "1px solid rgba(245,240,232,0.05)" : "none",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "'Sohne', sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(201,169,110,0.5)",
                  marginBottom: "20px",
                }}
              >
                {step.num}
              </div>
              <div
                style={{
                  fontFamily: "'Canela', serif",
                  fontSize: "1.65rem",
                  fontWeight: 400,
                  color: "#F5F0E8",
                  marginBottom: "14px",
                  lineHeight: 1.15,
                }}
              >
                {step.title}
              </div>
              <p
                style={{
                  fontFamily: "'Sohne', sans-serif",
                  fontSize: "0.88rem",
                  lineHeight: 1.75,
                  color: "rgba(245,240,232,0.70)",
                  fontWeight: 400,
                }}
              >
                {step.desc}
              </p>

              {/* Connector arrow between steps */}
              {i < 3 && (
                <div
                  style={{
                    position: "absolute",
                    right: "-14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "28px",
                    height: "1px",
                    background: "rgba(201,169,110,0.25)",
                    zIndex: 2,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="v2-fade" style={{ marginTop: "56px" }}>
          <a
            href="#pricing"
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
            See plans & pricing →
          </a>
        </div>
      </section>
    </>
  );
}
