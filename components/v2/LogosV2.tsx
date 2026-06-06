"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

const logos = [
  { name: "SK-II", src: "/logos/SK-II.svg" },
  { name: "Digital Realty", src: "/logos/digital realty.svg" },
  { name: "LVMH", src: "/logos/lvmh.svg" },
  { name: "Samsung", src: "/logos/samsung.svg" },
  { name: "ANZ", src: "/logos/anz.svg" },
  { name: "MBS", src: "/logos/mbs.svg" },
  { name: "Epson", src: "/logos/epson.svg" },
  { name: "Lacoste", src: "/logos/lacoste.svg" },
];

function LogoItem({ name, src }: { name: string; src: string }) {
  return (
    <div className="logo-item">
      <Image src={src} alt={name} width={0} height={28} style={{ width: "auto", height: "28px" }} />
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
          color: "rgba(245,240,232,0.45)",
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
          justifyContent: "center",
          gap: "32px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {logos.map((logo) => (
          <LogoItem key={logo.name} name={logo.name} src={logo.src} />
        ))}
      </div>
    </section>
  );
}
