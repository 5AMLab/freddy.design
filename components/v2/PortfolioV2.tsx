"use client";
import { useEffect, useRef, useState } from "react";

const projects = [
  {
    id: "01",
    title: "Renminbi Takes Centre Stage",
    client: "ANZ",
    category: "Annual Report",
    image: "/portfolio/anz_hero-01.jpg",
  },
  {
    id: "02",
    title: "Aurello Investor Deck",
    client: "Akuos",
    category: "Pitch Deck",
    image: "/portfolio/akuos-hero-01.jpg",
  },
  {
    id: "03",
    title: "Brand Identity & Guidelines",
    client: "Cognitiv AI",
    category: "Brandbook",
    image: "/portfolio/c-ai-hero-01.jpg",
  },
  {
    id: "04",
    title: "Coming Soon",
    client: "—",
    category: "TBA",
    image: "",
  },
  {
    id: "05",
    title: "Coming Soon",
    client: "—",
    category: "TBA",
    image: "",
  },
  {
    id: "06",
    title: "Coming Soon",
    client: "—",
    category: "TBA",
    image: "",
  },
];


function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  const [hovered, setHovered] = useState(false);
  const hasImage = !!project.image;

  return (
    <div
      className="v2-fade"
      style={{}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div
        style={{
          width: "100%",
          aspectRatio: "3/2",
          height: "auto",
          backgroundImage: hasImage ? `url('${project.image}')` : "none",
          backgroundColor: hasImage ? "transparent" : "#141414",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "2px",
          border: "1px solid",
          borderColor: hovered ? "rgba(201,169,110,0.3)" : "rgba(245,240,232,0.06)",
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.35s",
        }}
      >
        {/* Hover overlay on image */}
        {hasImage && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(13,13,13,0.35)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.35s",
            }}
          />
        )}

        {/* Coming soon label */}
        {!hasImage && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'Sohne', sans-serif",
                fontSize: "0.62rem",
                fontWeight: 400,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(201,169,110,0.2)",
              }}
            >
              Coming Soon
            </span>
          </div>
        )}
      </div>

      {/* Meta */}
      <div
        style={{
          paddingTop: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          transform: hovered ? "translateY(-7px)" : "translateY(0px)",
          transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Canela', serif",
              fontSize: "1.4rem",
              fontWeight: 400,
              color: hovered ? "#F5F0E8" : "rgba(245,240,232,0.7)",
              marginBottom: "4px",
              lineHeight: 1.2,
              transition: "color 0.3s",
            }}
          >
            {project.title}
          </div>
          <div
            style={{
              fontFamily: "'Sohne', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 300,
              color: "rgba(245,240,232,0.3)",
              letterSpacing: "0.04em",
            }}
          >
            {project.client}
          </div>
        </div>
        <div
          style={{
            fontFamily: "'Sohne', sans-serif",
            fontSize: "0.6rem",
            fontWeight: 500,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: hovered ? "#0D0D0D" : "rgba(201,169,110,0.4)",
            background: hovered ? "#C9A96E" : "transparent",
            border: "1px solid",
            borderColor: hovered ? "#C9A96E" : "rgba(201,169,110,0.2)",
            padding: "5px 10px",
            borderRadius: "2px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "color 0.3s, background 0.3s, border-color 0.3s",
          }}
        >
          {project.category}
        </div>
      </div>
    </div>
  );
}

export default function PortfolioV2() {
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
    <section
      id="portfolio"
      ref={ref}
      className="portfolio-v2-section"
      style={{
        background: "#111111",
        borderTop: "1px solid rgba(201,169,110,0.08)",
      }}
    >
      {/* Section header */}
      <div
        className="v2-fade"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "80px",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <div>
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
            The Work
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
            Work that earns its place.
          </h2>
        </div>
      </div>

      {/* Staggered two-column grid */}
      <div
        className="portfolio-v2-grid"
        style={{
          display: "grid",
          gap: "32px",
        }}
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Bottom row: CTA + confidentiality note */}
      <div
        className="v2-fade"
        style={{
          marginTop: "72px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <div
          style={{
            fontFamily: "'Sohne', sans-serif",
            fontSize: "0.7rem",
            fontWeight: 300,
            color: "rgba(245,240,232,0.35)",
            letterSpacing: "0.06em",
          }}
        >
          Client names anonymised where confidentiality applies. Full portfolio available on request.
        </div>

        <a
          href="#cta"
          style={{
            fontFamily: "'Sohne', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(245,240,232,0.4)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            paddingBottom: "2px",
            borderBottom: "1px solid rgba(245,240,232,0.15)",
            transition: "color 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.color = "#C9A96E";
            el.style.borderColor = "rgba(201,169,110,0.4)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.color = "rgba(245,240,232,0.4)";
            el.style.borderColor = "rgba(245,240,232,0.15)";
          }}
        >
          Start a project →
        </a>
      </div>
    </section>
  );
}
