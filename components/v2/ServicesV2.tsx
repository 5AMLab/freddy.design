"use client";
import { useEffect, useRef, useState } from "react";

const services = [
  {
    num: "01",
    title: "Presentation Decks",
    desc: "Board reports, pitch decks, marketing reviews — polished and on-brand in 48 hours from your brief, rough notes, or even a voice message.",
    tag: "Most Requested",
  },
  {
    num: "02",
    title: "Brand & Campaign",
    desc: "Visual identity, social content, campaign assets, digital banners and posters. Luxury brand standards applied to every touchpoint.",
    tag: "High Impact",
  },
  {
    num: "03",
    title: "Marketplace & E-commerce",
    desc: "Hero campaign images, product banners and storefront assets for Shopee, Lazada, Amazon and beyond. Built to stop the scroll and drive conversions.",
    tag: "Conversion-Focused",
  },
  {
    num: "04",
    title: "Print & Collateral",
    desc: "Menus, brochures, event materials, packaging mockups and more. Print-ready files delivered clean and accurate every single time.",
    tag: "F&B Favourite",
  },
];

function ServiceRow({ service }: { service: (typeof services)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="v2-fade service-v2-row"
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr auto",
        alignItems: "center",
        gap: "32px",
        padding: "36px 0 36px 0",
        borderBottom: "1px solid rgba(245,240,232,0.06)",
        cursor: "default",
        position: "relative",
        transition: "background 0.4s",
        background: hovered ? "rgba(201,169,110,0.04)" : "transparent",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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

      {/* Number — color only, no size change to avoid reflow */}
      <div
        style={{
          fontFamily: "'Canela', serif",
          fontSize: "1rem",
          fontWeight: 300,
          color: hovered ? "#C9A96E" : "rgba(245,240,232,0.18)",
          paddingTop: "2px",
          transition: "color 0.3s ease",
          letterSpacing: "0.05em",
          textAlign: "right",
        }}
      >
        {service.num}
      </div>

      {/* Title + desc — subtle translate only, no margin animation */}
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
            color: hovered ? "#F5F0E8" : "rgba(245,240,232,0.6)",
            lineHeight: 1.1,
            transition: "color 0.3s ease",
          }}
        >
          {service.title}
        </div>
        {/* grid-template-rows accordion: smooth expand without max-height imprecision */}
        <div
          className="service-v2-desc-wrap"
          style={{
            display: "grid",
            gridTemplateRows: hovered ? "1fr" : "0fr",
            transition: "grid-template-rows 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <p
              className="service-v2-desc"
              style={{
                fontFamily: "'Sohne', sans-serif",
                fontSize: "0.88rem",
                lineHeight: 1.75,
                color: "rgba(245,240,232,0.5)",
                fontWeight: 300,
                maxWidth: "520px",
                marginTop: "10px",
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.3s ease 0.05s",
              }}
            >
              {service.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Tag */}
      <div
        style={{
          fontFamily: "'Sohne', sans-serif",
          fontSize: "0.62rem",
          fontWeight: 500,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: hovered ? "#0D0D0D" : "rgba(201,169,110,0.4)",
          background: hovered ? "#C9A96E" : "transparent",
          border: "1px solid rgba(201,169,110,0.25)",
          padding: "7px 20px 7px 16px",
          borderRadius: "2px",
          whiteSpace: "nowrap",
          alignSelf: "center",
          marginRight: "48px",
          transition: "color 0.3s ease, background 0.3s ease, border-color 0.3s ease",
          borderColor: hovered ? "#C9A96E" : "rgba(201,169,110,0.25)",
        }}
      >
        {service.tag}
      </div>
    </div>
  );
}

export default function ServicesV2() {
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
        id="services"
        ref={ref}
        className="services-v2-section"
        style={{ padding: "120px 72px", background: "#0D0D0D" }}
      >
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

        <div style={{ borderTop: "1px solid rgba(245,240,232,0.06)" }}>
          {services.map((service) => (
            <ServiceRow key={service.num} service={service} />
          ))}
        </div>
      </section>
    </>
  );
}
