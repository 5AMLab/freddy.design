"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

const services = [
  {
    num: "01",
    title: "Presentation Decks",
    desc: "Board reports, pitch decks, marketing reviews — polished and on-brand in 48 hours from your brief, rough notes, or even a voice message.",
    tag: "Most Requested",
    img: "/portfolio/deck-generic-01.jpg",
  },
  {
    num: "02",
    title: "Brand & Campaign",
    desc: "Visual identity, social content, campaign assets, digital banners and posters. Luxury brand standards applied to every touchpoint.",
    tag: "High Impact",
    img: "/portfolio/brand-guideline-01.jpg",
  },
  {
    num: "03",
    title: "Marketplace & E-commerce",
    desc: "Hero campaign images, product banners and storefront assets for Shopee, Lazada, Amazon and beyond. Built to stop the scroll and drive conversions.",
    tag: "Conversion-Focused",
    img: "/portfolio/ooh-generic-01.jpg",
  },
  {
    num: "04",
    title: "Print & Collateral",
    desc: "Menus, brochures, event materials, packaging mockups and more. Print-ready files delivered clean and accurate every single time.",
    tag: "F&B Favourite",
    img: "/portfolio/coffee-mockup-01.jpg",
  },
];

function ServiceRow({
  service,
  onHoverChange,
}: {
  service: (typeof services)[0];
  onHoverChange: (hovered: boolean) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="v2-fade service-v2-row"
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr auto",
        alignItems: "start",
        gap: "32px",
        padding: "36px 0",
        borderBottom: "1px solid rgba(245,240,232,0.12)",
        cursor: "default",
        position: "relative",
        transition: "background 0.4s",
        background: hovered ? "rgba(201,169,110,0.04)" : "transparent",
      }}
      onMouseEnter={() => {
        setHovered(true);
        onHoverChange(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        onHoverChange(false);
      }}
    >
      {/* Gold left sweep line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: hovered ? "3px" : "0px",
          background: "#C9A96E",
          transition: "width 0.2s cubic-bezier(0.16,1,0.3,1)",
          borderRadius: "0 2px 2px 0",
        }}
      />

      <div
        style={{
          fontFamily: "'Canela', serif",
          fontSize: "1rem",
          fontWeight: 300,
          color: hovered ? "#C9A96E" : "rgba(245,240,232,0.25)",
          paddingTop: "6px",
          transition: "color 0.3s ease",
          letterSpacing: "0.05em",
          textAlign: "right",
        }}
      >
        {service.num}
      </div>

      <div
        style={{
          transform: hovered ? "translateX(4px)" : "translateX(0px)",
          transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div
          style={{
            fontFamily: "'Canela', serif",
            fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
            fontWeight: 400,
            color: hovered ? "#F5F0E8" : "rgba(245,240,232,0.85)",
            lineHeight: 1.1,
            transition: "color 0.3s ease",
            marginBottom: "12px",
          }}
        >
          {service.title}
        </div>
        <p
          style={{
            fontFamily: "'Sohne', sans-serif",
            fontSize: "0.95rem",
            lineHeight: 1.75,
            color: "rgba(245,240,232,0.70)",
            fontWeight: 400,
            maxWidth: "520px",
          }}
        >
          {service.desc}
        </p>
      </div>

      {/* Tag */}
      <div
        className="service-v2-tag"
        style={{
          fontFamily: "'Sohne', sans-serif",
          fontSize: "0.62rem",
          fontWeight: 500,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: hovered ? "#0D0D0D" : "rgba(201,169,110,0.7)",
          background: hovered ? "#C9A96E" : "transparent",
          border: "1px solid rgba(201,169,110,0.35)",
          padding: "7px 20px 7px 16px",
          borderRadius: "2px",
          whiteSpace: "nowrap",
          alignSelf: "start",
          marginTop: "8px",
          marginRight: "48px",
          transition: "color 0.3s ease, background 0.3s ease, border-color 0.3s ease",
          borderColor: hovered ? "#C9A96E" : "rgba(201,169,110,0.35)",
        }}
      >
        {service.tag}
      </div>
    </div>
  );
}

export default function ServicesV2() {
  const ref = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  // Floating work preview trails the cursor across the service rows,
  // crossfading per row. Fine pointers only.
  useEffect(() => {
    const section = ref.current;
    const el = previewRef.current;
    if (!section || !el || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" });
    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      xTo(e.clientX - r.left + 32);
      yTo(e.clientY - r.top - 100);
    };
    section.addEventListener("mousemove", onMove, { passive: true });
    return () => section.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const el = previewRef.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    gsap.to(el, {
      opacity: active !== null ? 1 : 0,
      scale: active !== null ? 1 : 0.92,
      duration: 0.35,
      ease: "power3.out",
    });
  }, [active]);

  return (
    <section
      id="services"
      ref={ref}
      className="services-v2-section"
      style={{ padding: "120px 72px", background: "#0D0D0D", position: "relative" }}
    >
      {/* Cursor-trailing work preview */}
      <div
        ref={previewRef}
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "300px",
          aspectRatio: "3/2",
          overflow: "hidden",
          borderRadius: "2px",
          pointerEvents: "none",
          zIndex: 5,
          opacity: 0,
        }}
      >
        {services.map((s, i) => (
          <Image
            key={s.num}
            src={s.img}
            alt=""
            fill
            sizes="300px"
            style={{
              objectFit: "cover",
              opacity: active === i ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        ))}
      </div>
      <div className="v2-fade" style={{ marginBottom: "72px" }}>
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
          What I Do
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
          Design for every brief,
          <br />
          every industry.
        </h2>
      </div>

      <div style={{ borderTop: "1px solid rgba(245,240,232,0.12)" }}>
        {services.map((service, i) => (
          <ServiceRow
            key={service.num}
            service={service}
            onHoverChange={(h) => setActive(h ? i : null)}
          />
        ))}
      </div>

      <div className="v2-fade" style={{ marginTop: "48px" }}>
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
          See pricing & plans →
        </a>
      </div>
    </section>
  );
}
