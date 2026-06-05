"use client";
import { useEffect, useRef } from "react";

export default function HeroV2() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("v2-visible"), i * 120);
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
        ref={ref}
        className="hero-v2-section"
        style={{
          minHeight: "100vh",
          background: "#0D0D0D",
          padding: "160px 72px 100px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grain texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("/noise.svg")`,
            pointerEvents: "none",
            opacity: 0.6,
          }}
        />

        <div
          className="hero-v2-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "end",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Left: Main copy */}
          <div>
            <div className="v2-fade hero-v2-label" style={{ marginBottom: "32px" }}>
              Your Dedicated Design Partner
            </div>

            <h1 className="v2-fade hero-v2-h1" style={{ marginBottom: "36px" }}>
              Great design.
              <br />
              <em>On demand.</em>
              <br />
              No drama.
            </h1>

            <p
              className="v2-fade"
              style={{
                fontFamily: "'Sohne', sans-serif",
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "rgba(245,240,232,0.55)",
                maxWidth: "440px",
                marginBottom: "48px",
                fontWeight: 300,
              }}
            >
              Skip the overhead of a full-time hire. A dedicated designer on speed dial —
              fast turnarounds, direct line, always on brand.
            </p>

            <div
              className="v2-fade"
              style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}
            >
              <a
                href="#pricing"
                style={{
                  fontFamily: "'Sohne', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#0D0D0D",
                  textDecoration: "none",
                  background: "#C9A96E",
                  padding: "16px 36px",
                  borderRadius: "2px",
                  transition: "opacity 0.2s, transform 0.2s",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.opacity = "0.85";
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.opacity = "1";
                  el.style.transform = "translateY(0)";
                }}
              >
                View Retainer Plans
              </a>
              <a
                href="#services"
                style={{
                  fontFamily: "'Sohne', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(245,240,232,0.5)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#C9A96E")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,240,232,0.5)")}
              >
                Explore Services
                <span style={{ fontSize: "1rem" }}>↓</span>
              </a>
            </div>
          </div>

          {/* Right: Stats / credibility block */}
          <div
            className="v2-fade"
            style={{
              borderLeft: "1px solid rgba(201,169,110,0.2)",
              paddingLeft: "60px",
              display: "flex",
              flexDirection: "column",
              gap: "40px",
            }}
          >
            {/* Status */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#4ade80",
                  display: "inline-block",
                  boxShadow: "0 0 8px rgba(74,222,128,0.6)",
                }}
              />
              <span
                style={{
                  fontFamily: "'Sohne', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 400,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(245,240,232,0.4)",
                }}
              >
                Available for new clients
              </span>
            </div>

            {/* Stats */}
            <div className="hero-v2-stat-row" style={{ display: "flex", gap: "48px" }}>
              {[
                { val: "48hr", label: "Turnaround" },
                { val: "6+", label: "Years experience" },
                { val: "∞", label: "Revisions" },
              ].map(({ val, label }) => (
                <div key={label}>
                  <div
                    style={{
                      fontFamily: "'Canela', serif",
                      fontSize: "2.8rem",
                      fontWeight: 300,
                      color: "#F5F0E8",
                      lineHeight: 1,
                      marginBottom: "6px",
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Sohne', sans-serif",
                      fontSize: "0.68rem",
                      fontWeight: 400,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(245,240,232,0.5)",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Intro quote */}
            <div
              style={{
                borderTop: "1px solid rgba(201,169,110,0.12)",
                paddingTop: "32px",
              }}
            >
              <p
                style={{
                  fontFamily: "'Canela', serif",
                  fontSize: "1.25rem",
                  fontStyle: "italic",
                  fontWeight: 300,
                  lineHeight: 1.65,
                  color: "rgba(245,240,232,0.65)",
                  marginBottom: "16px",
                }}
              >
                &ldquo;Think of me as your in-house designer — minus the salary,
                CPF, and annual leave headaches.&rdquo;
              </p>
              <div
                style={{
                  fontFamily: "'Sohne', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#C9A96E",
                }}
              >
                — Freddy, Founder
              </div>
            </div>
          </div>
        </div>

        {/* Bottom scroll indicator */}
        <div
          className="v2-fade hero-v2-scroll-indicator"
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "rgba(201,169,110,0.4)",
            }}
          />
          <span
            style={{
              fontFamily: "'Sohne', sans-serif",
              fontSize: "0.66rem",
              fontWeight: 400,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(245,240,232,0.3)",
            }}
          >
            Scroll
          </span>
        </div>
      </section>
    </>
  );
}
