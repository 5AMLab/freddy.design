"use client";
import { useEffect, useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);

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
        .hero-section {
          min-height: 92vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 60px;
          padding: 80px 60px;
          background: #FFF8EE;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .hero-section {
            grid-template-columns: 1fr;
            min-height: auto;
            padding: 48px 20px 56px;
            text-align: center;
            gap: 40px;
          }
          .hero-sub { max-width: 100% !important; }
          .hero-actions { flex-direction: column; align-items: center; }
          .btn-primary-hero { width: 260px; text-align: center; }
          .floating-tag { display: none !important; }
          .hero-card { width: 100% !important; max-width: 340px !important; }
        }
      `}</style>

      <section className="hero-section" ref={ref}>
        <div className="dots-bg" />

        {/* Hero Text */}
        <div className="fade-in" style={{ position: "relative", zIndex: 2 }}>
          <div
            className="animate-wiggle"
            style={{
              display: "inline-block",
              background: "#FFD93D",
              color: "#0f0f0f",
              fontWeight: 800,
              fontSize: "0.78rem",
              padding: "6px 16px",
              borderRadius: "50px",
              border: "2px solid #0f0f0f",
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            🕷 Your friendly neighbourhood designer
          </div>

          <h1
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: "clamp(3rem, 5vw, 5.2rem)",
              lineHeight: 1.05,
              color: "#0f0f0f",
              marginBottom: "16px",
            }}
          >
            Great design.
            <br />
            <span
              className="hero-highlight"
              style={{ color: "#E8222E", position: "relative", display: "inline-block" }}
            >
              On demand.
            </span>
            <br />
            No drama.
          </h1>

          <p
            className="hero-sub"
            style={{
              fontSize: "1.15rem",
              lineHeight: 1.7,
              color: "#555",
              maxWidth: "480px",
              margin: "20px 0 40px",
              fontWeight: 600,
            }}
          >
            Skip the overhead of a full-time hire. Get a dedicated designer on
            speed dial — fast turnarounds, direct line, always on brand.
          </p>

          <div
            className="hero-actions"
            style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}
          >
            <a
              href="#pricing"
              className="btn-primary-hero"
              style={{
                background: "#0f0f0f",
                color: "white",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 800,
                fontSize: "1rem",
                padding: "16px 36px",
                borderRadius: "50px",
                border: "3px solid #0f0f0f",
                textDecoration: "none",
                display: "inline-block",
                transition: "background 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#E8222E";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E8222E";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#0f0f0f";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#0f0f0f";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
            >
              See Retainer Plans
            </a>
            <a
              href="#services"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 800,
                fontSize: "1rem",
                color: "#0f0f0f",
                textDecoration: "none",
                borderBottom: "2px solid #0f0f0f",
                paddingBottom: "2px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#E8222E";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E8222E";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#0f0f0f";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#0f0f0f";
              }}
            >
              View Services ↓
            </a>
          </div>
        </div>

        {/* Hero Visual */}
        <div
          className="fade-in"
          style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2 }}
        >
          {/* Floating tags */}
          <div
            className="floating-tag animate-float-rotate-1"
            style={{
              position: "absolute",
              background: "#FFD93D",
              border: "2px solid #0f0f0f",
              borderRadius: "12px",
              padding: "8px 14px",
              fontSize: "0.75rem",
              fontWeight: 800,
              whiteSpace: "nowrap",
              boxShadow: "3px 3px 0 #0f0f0f",
              top: "-20px",
              right: "-30px",
            }}
          >
            ⚡ 48hr turnaround
          </div>
          <div
            className="floating-tag animate-float-rotate-2"
            style={{
              position: "absolute",
              background: "#c7f9cc",
              border: "2px solid #0f0f0f",
              borderRadius: "12px",
              padding: "8px 14px",
              fontSize: "0.75rem",
              fontWeight: 800,
              whiteSpace: "nowrap",
              boxShadow: "3px 3px 0 #0f0f0f",
              bottom: "20px",
              left: "-50px",
            }}
          >
            ✓ Luxury brand exp.
          </div>
          <div
            className="floating-tag animate-float-rotate-3"
            style={{
              position: "absolute",
              background: "#ffd6e0",
              border: "2px solid #0f0f0f",
              borderRadius: "12px",
              padding: "8px 14px",
              fontSize: "0.75rem",
              fontWeight: 800,
              whiteSpace: "nowrap",
              boxShadow: "3px 3px 0 #0f0f0f",
              top: "50px",
              left: "-60px",
            }}
          >
            🎨 Adobe CC + AI tools
          </div>

          {/* Hero Card */}
          <div
            className="hero-card animate-float"
            style={{
              background: "white",
              border: "3px solid #0f0f0f",
              borderRadius: "24px",
              padding: "40px 32px",
              width: "340px",
              boxShadow: "8px 8px 0 #0f0f0f",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "#E8222E",
                borderRadius: "50%",
                border: "3px solid #0f0f0f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: "4px 4px 0 #0f0f0f",
              }}
            >
              <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" width={44} height={44}>
                <rect x="18" y="6" width="10" height="24" rx="2" fill="white" stroke="white" strokeWidth="1.5" />
                <polygon points="18,30 28,30 23,38" fill="#FFD93D" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                <rect x="18" y="6" width="10" height="5" rx="2" fill="#FFD93D" stroke="white" strokeWidth="1.5" />
                <line x1="23" y1="11" x2="23" y2="30" stroke="#E8222E" strokeWidth="1.5" />
                <circle cx="10" cy="10" r="2" fill="#FFD93D" />
                <circle cx="34" cy="14" r="1.5" fill="#FFD93D" />
                <circle cx="8" cy="28" r="1.5" fill="white" opacity="0.6" />
              </svg>
            </div>

            <h3
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "1.4rem",
                textAlign: "center",
                marginBottom: "8px",
              }}
            >
              Hey, I&apos;m Freddy.
            </h3>
            <p
              style={{
                fontSize: "0.95rem",
                textAlign: "center",
                color: "#666",
                fontWeight: 600,
                lineHeight: 1.6,
              }}
            >
              Think of me as your in-house designer — minus the salary, CPF, and
              annual leave headaches.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <span
                style={{
                  background: "#FFD93D",
                  border: "2px solid #0f0f0f",
                  borderRadius: "10px",
                  padding: "5px 12px",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  boxShadow: "2px 2px 0 #0f0f0f",
                }}
              >
                ⚡ 48hr turnaround
              </span>
              <span
                style={{
                  background: "#c7f9cc",
                  border: "2px solid #0f0f0f",
                  borderRadius: "10px",
                  padding: "5px 12px",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  boxShadow: "2px 2px 0 #0f0f0f",
                }}
              >
                ✓ Luxury brand exp.
              </span>
              <span
                style={{
                  background: "#ffd6e0",
                  border: "2px solid #0f0f0f",
                  borderRadius: "10px",
                  padding: "5px 12px",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  boxShadow: "2px 2px 0 #0f0f0f",
                }}
              >
                🎨 Adobe CC + AI
              </span>
            </div>

            <div className="status-dot" style={{ marginTop: "16px" }}>
              Available for new clients
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
