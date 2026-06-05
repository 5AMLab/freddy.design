"use client";
import { useEffect, useRef } from "react";

// Replace these with real client/brand SVG logos when available
const logos = [
  { name: "Marriott", width: 90 },
  { name: "Shopee", width: 72 },
  { name: "Deliveroo", width: 88 },
  { name: "DBS", width: 52 },
  { name: "Tiger Beer", width: 66 },
  { name: "Grab", width: 56 },
  { name: "Lazada", width: 74 },
  { name: "OCBC", width: 60 },
];

function LogoPlaceholder({ name, width }: { name: string; width: number }) {
  return (
    <div
      style={{
        width,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.28,
        filter: "grayscale(1)",
        transition: "opacity 0.3s",
        cursor: "default",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = "0.55")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = "0.28")}
    >
      {/* Wordmark placeholder — replace <span> with <img src="…" alt={name} /> when ready */}
      <span
        style={{
          fontFamily: "'Sohne', sans-serif",
          fontWeight: 600,
          fontSize: "0.78rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#F5F0E8",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </span>
    </div>
  );
}

export default function LogosV2() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("v2-visible");
        });
      },
      { threshold: 0.2 }
    );
    ref.current?.querySelectorAll(".v2-fade").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        padding: "60px 72px",
        background: "#0D0D0D",
        borderTop: "1px solid rgba(245,240,232,0.05)",
        borderBottom: "1px solid rgba(245,240,232,0.05)",
      }}
      className="logos-v2-section"
    >

      <div
        className="v2-fade"
        style={{
          fontFamily: "'Sohne Breit', sans-serif",
          fontSize: "0.62rem",
          fontWeight: 400,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(245,240,232,0.2)",
          textAlign: "center",
          marginBottom: "36px",
        }}
      >
        Trusted by brands across Singapore & the region
      </div>

      <div
        className="logos-v2-row v2-fade"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "48px",
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        {logos.map((logo) => (
          <LogoPlaceholder key={logo.name} name={logo.name} width={logo.width} />
        ))}
      </div>
    </section>
  );
}
