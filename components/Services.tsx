"use client";
import { useEffect, useRef } from "react";

function ServiceCard({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "dark" | "accent";
}) {
  const bg =
    variant === "dark" ? "#0f0f0f" : variant === "accent" ? "#E8222E" : "white";

  return (
    <div
      className="service-card-item fade-in"
      style={{
        background: bg,
        border: "3px solid #0f0f0f",
        borderRadius: "20px",
        padding: "36px 32px",
        boxShadow: "5px 5px 0 #0f0f0f",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translate(-4px, -4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "9px 9px 0 #0f0f0f";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translate(0, 0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "5px 5px 0 #0f0f0f";
      }}
    >
      {children}
    </div>
  );
}

export default function Services() {
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
        .services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        @media (max-width: 768px) {
          .services-section { padding: 60px 20px !important; }
          .services-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section
        id="services"
        className="services-section"
        ref={ref}
        style={{ padding: "100px 60px", background: "#FFF8EE" }}
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
          What I Do
        </div>
        <h2
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: "clamp(2.2rem, 3.5vw, 3.2rem)",
            lineHeight: 1.1,
            marginBottom: "56px",
            maxWidth: "640px",
          }}
        >
          Design for every brief, every industry.
        </h2>

        <div className="services-grid">
          {/* Card 1: Presentation Decks */}
          <ServiceCard variant="default">
            <div style={{ width: "60px", height: "60px", marginBottom: "18px" }}>
              <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width={60} height={60}>
                <rect x="8" y="10" width="44" height="30" rx="4" fill="#FFD93D" stroke="#0f0f0f" strokeWidth="2.5" />
                <rect x="15" y="17" width="18" height="3.5" rx="1.75" fill="#0f0f0f" />
                <rect x="15" y="24" width="30" height="2.5" rx="1.25" fill="#0f0f0f" opacity="0.35" />
                <rect x="15" y="30" width="24" height="2.5" rx="1.25" fill="#0f0f0f" opacity="0.35" />
                <rect x="36" y="18" width="5" height="14" rx="1.5" fill="#E8222E" />
                <rect x="43" y="23" width="5" height="9" rx="1.5" fill="#E8222E" opacity="0.5" />
                <line x1="30" y1="40" x2="30" y2="50" stroke="#0f0f0f" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="22" y1="50" x2="38" y2="50" stroke="#0f0f0f" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "1.5rem",
                marginBottom: "10px",
                color: "#0f0f0f",
              }}
            >
              Presentation Decks
            </div>
            <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "#555", fontWeight: 600 }}>
              Board reports, pitch decks, marketing reviews — polished and on-brand in 48 hours from your brief, rough notes, or even a voice message.
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: "18px",
                background: "#FFD93D",
                color: "#0f0f0f",
                fontSize: "0.74rem",
                fontWeight: 800,
                padding: "4px 14px",
                borderRadius: "50px",
                border: "2px solid #0f0f0f",
              }}
            >
              Most Popular
            </span>
          </ServiceCard>

          {/* Card 2: Brand & Campaign */}
          <ServiceCard variant="dark">
            <div style={{ width: "60px", height: "60px", marginBottom: "18px" }}>
              <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width={60} height={60}>
                <polygon points="30,6 48,22 30,54 12,22" fill="#E8222E" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                <polygon points="30,6 48,22 30,30 12,22" fill="#ff4d57" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="50" cy="10" r="3" fill="#FFD93D" />
                <line x1="50" y1="6" x2="50" y2="14" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" />
                <line x1="46" y1="10" x2="54" y2="10" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" />
                <circle cx="10" cy="16" r="2" fill="#FFD93D" opacity="0.7" />
              </svg>
            </div>
            <div
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "1.5rem",
                marginBottom: "10px",
                color: "white",
              }}
            >
              Brand & Campaign
            </div>
            <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "#aaa", fontWeight: 600 }}>
              Visual identity, social content, campaign assets, digital banners and posters. Luxury brand standards applied to every touchpoint of your business.
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: "18px",
                background: "#E8222E",
                color: "white",
                fontSize: "0.74rem",
                fontWeight: 800,
                padding: "4px 14px",
                borderRadius: "50px",
                border: "2px solid #E8222E",
              }}
            >
              High Impact
            </span>
          </ServiceCard>

          {/* Card 3: Marketplace & E-commerce */}
          <ServiceCard variant="accent">
            <div style={{ width: "60px", height: "60px", marginBottom: "18px" }}>
              <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width={60} height={60}>
                <rect x="10" y="22" width="40" height="30" rx="4" fill="white" stroke="white" strokeWidth="2" />
                <path d="M20,22 Q20,12 30,12 Q40,12 40,22" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="44" cy="16" r="10" fill="#FFD93D" stroke="white" strokeWidth="2" />
                <polygon points="44,10 45.8,14.5 50.5,14.5 46.8,17.5 48.2,22 44,19.2 39.8,22 41.2,17.5 37.5,14.5 42.2,14.5" fill="#E8222E" />
                <line x1="18" y1="36" x2="42" y2="36" stroke="#E8222E" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                <line x1="18" y1="42" x2="34" y2="42" stroke="#E8222E" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              </svg>
            </div>
            <div
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "1.5rem",
                marginBottom: "10px",
                color: "white",
              }}
            >
              Marketplace & E-commerce
            </div>
            <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
              Hero campaign images, product banners and storefront assets for Shopee, Lazada, Amazon and beyond. Designs built to stop the scroll and drive conversions.
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: "18px",
                background: "white",
                color: "#0f0f0f",
                fontSize: "0.74rem",
                fontWeight: 800,
                padding: "4px 14px",
                borderRadius: "50px",
                border: "2px solid white",
              }}
            >
              New
            </span>
          </ServiceCard>

          {/* Card 4: Print & Collateral */}
          <ServiceCard variant="default">
            <div style={{ width: "60px", height: "60px", marginBottom: "18px" }}>
              <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width={60} height={60}>
                <rect x="12" y="6" width="36" height="48" rx="4" fill="white" stroke="#0f0f0f" strokeWidth="2.5" />
                <rect x="12" y="6" width="36" height="14" rx="4" fill="#E8222E" stroke="#0f0f0f" strokeWidth="2.5" />
                <rect x="19" y="29" width="22" height="2.5" rx="1.25" fill="#0f0f0f" opacity="0.45" />
                <rect x="19" y="35" width="16" height="2.5" rx="1.25" fill="#0f0f0f" opacity="0.3" />
                <rect x="19" y="41" width="20" height="2.5" rx="1.25" fill="#0f0f0f" opacity="0.3" />
                <rect x="19" y="12" width="18" height="3" rx="1.5" fill="white" opacity="0.85" />
              </svg>
            </div>
            <div
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "1.5rem",
                marginBottom: "10px",
                color: "#0f0f0f",
              }}
            >
              Print & Collateral
            </div>
            <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "#555", fontWeight: 600 }}>
              Menus, brochures, event materials, packaging mockups and more. Print-ready files delivered clean and accurate every single time.
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: "18px",
                background: "#FFD93D",
                color: "#0f0f0f",
                fontSize: "0.74rem",
                fontWeight: 800,
                padding: "4px 14px",
                borderRadius: "50px",
                border: "2px solid #0f0f0f",
              }}
            >
              F&B Favourite
            </span>
          </ServiceCard>
        </div>
      </section>
    </>
  );
}
