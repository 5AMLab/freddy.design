"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const projects = [
  {
    id: "01",
    title: "Renminbi Takes Centre Stage",
    client: "ANZ",
    category: "Annual Report",
    images: [
      "/portfolio/anz_hero-01.jpg",
      "/portfolio/anz-02.jpg",
      "/portfolio/anz-03.jpg",
      "/portfolio/anz-04.jpg",
      "/portfolio/anz-05.jpg",
    ],
  },
  // Slots 02–05 below are generated placeholders — overwrite the file in
  // public/portfolio with the real project photo, keeping the filename.
  {
    id: "02",
    title: "Aurello Investor Deck",
    client: "Akuos",
    category: "Pitch Deck",
    images: [
      "/portfolio/akuos-00.jpg",
      "/portfolio/akuos-01.jpg",
      "/portfolio/akuos-02.jpg",
      "/portfolio/akuos-03.jpg",
      "/portfolio/akuos-04.jpg",
    ],
  },
  {
    id: "03",
    title: "Brand Identity & Guidelines",
    client: "Cognitiv AI",
    category: "Brandbook",
    images: [
      "/portfolio/brand-guideline-01.jpg",
      "/portfolio/cognitiv-02.jpg",
      "/portfolio/cognitiv-03.jpg",
      "/portfolio/cognitiv-04.jpg",
      "/portfolio/cognitiv-05.jpg",
    ],
  },
  {
    id: "04",
    title: "Terre d'Hermès Campaign",
    client: "Hermès",
    category: "OOH & Campaign",
    images: [
      "/portfolio/ooh-generic-02.jpg",
      "/portfolio/hermes-02.jpg",
      "/portfolio/hermes-03.jpg",
      "/portfolio/hermes-04.jpg",
      "/portfolio/hermes-05.jpg",
    ],
  },
  {
    id: "05",
    title: "Ethiopia Guji Cold Brew",
    client: "Maison Freddy",
    category: "Packaging",
    images: [
      "/portfolio/coffee-mockup-01.jpg",
      "/portfolio/maison-02.jpg",
      "/portfolio/maison-03.jpg",
      "/portfolio/maison-04.jpg",
      "/portfolio/maison-05.jpg",
    ],
  },
  {
    id: "06",
    title: "The Intern Times",
    client: "D&AD",
    category: "Editorial Design",
    images: [
      "/portfolio/newspaper-generic-01.jpg",
      "/portfolio/intern-02.jpg",
      "/portfolio/intern-03.jpg",
      "/portfolio/intern-04.jpg",
      "/portfolio/intern-05.jpg",
    ],
  },
];

type Project = (typeof projects)[0];

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [active, setActive] = useState(0);
  const total = project.images.length;

  const prev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setActive((i) => (i + 1) % total), [total]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  // lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(10,10,10,0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(16px, 4vw, 48px)",
        gap: "20px",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute",
          top: "24px",
          right: "28px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(245,240,232,0.45)",
          fontSize: "1.4rem",
          lineHeight: 1,
          padding: "4px",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#F5F0E8")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(245,240,232,0.45)")}
      >
        ✕
      </button>

      {/* Meta — top-left */}
      <div
        style={{
          position: "absolute",
          top: "24px",
          left: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontFamily: "'Canela', serif",
            fontSize: "clamp(1rem, 2vw, 1.3rem)",
            fontWeight: 400,
            color: "#F5F0E8",
            lineHeight: 1.2,
          }}
        >
          {project.title}
        </div>
        <div
          style={{
            fontFamily: "'Sohne', sans-serif",
            fontSize: "0.6rem",
            fontWeight: 500,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#C9A96E",
          }}
        >
          {project.category}
        </div>
      </div>

      {/* Main image + arrows */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "860px",
          aspectRatio: "3/2",
          borderRadius: "2px",
          overflow: "hidden",
          background: "#141414",
          flexShrink: 0,
        }}
      >
        <Image
          key={active}
          src={project.images[active]}
          alt={`${project.title} — image ${active + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 860px"
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />

        {/* Prev arrow */}
        {total > 1 && (
          <button
            onClick={prev}
            aria-label="Previous image"
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(13,13,13,0.55)",
              border: "1px solid rgba(245,240,232,0.1)",
              borderRadius: "2px",
              color: "rgba(245,240,232,0.7)",
              width: "38px",
              height: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "rgba(201,169,110,0.15)";
              b.style.color = "#C9A96E";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "rgba(13,13,13,0.55)";
              b.style.color = "rgba(245,240,232,0.7)";
            }}
          >
            ←
          </button>
        )}

        {/* Next arrow */}
        {total > 1 && (
          <button
            onClick={next}
            aria-label="Next image"
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(13,13,13,0.55)",
              border: "1px solid rgba(245,240,232,0.1)",
              borderRadius: "2px",
              color: "rgba(245,240,232,0.7)",
              width: "38px",
              height: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "rgba(201,169,110,0.15)";
              b.style.color = "#C9A96E";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "rgba(13,13,13,0.55)";
              b.style.color = "rgba(245,240,232,0.7)";
            }}
          >
            →
          </button>
        )}
      </div>

      {/* Filmstrip */}
      {total > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            flexWrap: "nowrap",
            overflowX: "auto",
            maxWidth: "860px",
            width: "100%",
            paddingBottom: "2px",
          }}
        >
          {project.images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              style={{
                flexShrink: 0,
                width: "80px",
                aspectRatio: "3/2",
                borderRadius: "2px",
                overflow: "hidden",
                border: "1px solid",
                borderColor: i === active ? "#C9A96E" : "rgba(245,240,232,0.1)",
                background: "#141414",
                cursor: "pointer",
                padding: 0,
                position: "relative",
                transition: "border-color 0.2s",
                opacity: i === active ? 1 : 0.5,
              }}
            >
              <Image
                src={src}
                alt={`Thumbnail ${i + 1}`}
                fill
                sizes="80px"
                style={{ objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Counter */}
      {total > 1 && (
        <div
          style={{
            fontFamily: "'Sohne', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.14em",
            color: "rgba(245,240,232,0.3)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {active + 1} / {total}
        </div>
      )}
    </div>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  featured,
  onOpen,
}: {
  project: Project;
  featured: boolean;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const hasImage = project.images.length > 0;

  return (
    <div
      className={`v2-fade portfolio-card${featured ? " portfolio-card-featured" : ""}`}
      onClick={hasImage ? onOpen : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor={hasImage ? "view" : undefined}
      style={{ cursor: hasImage ? "pointer" : "default" }}
    >
      {/* Image */}
      <div
        className="portfolio-card-media"
        style={{
          width: "100%",
          backgroundColor: "#141414",
          borderRadius: "2px",
          border: "1px solid",
          borderColor: hovered ? "rgba(201,169,110,0.3)" : "rgba(245,240,232,0.06)",
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.35s",
        }}
      >
        {hasImage && (
          // mask-scale (MOTION.md): outer layer is GSAP-scaled on scroll
          // entry, inner layer carries the CSS hover zoom — separate
          // elements so the two transforms never fight
          <div className="mask-scale-media" style={{ position: "absolute", inset: 0 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: hovered ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <Image
                src={project.images[0]}
                alt={`${project.title} — ${project.client}`}
                fill
                sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                style={{ objectFit: "cover", objectPosition: "center" }}
                loading="lazy"
              />
            </div>
          </div>
        )}

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
              fontSize: featured ? "1.75rem" : "1.4rem",
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
              fontWeight: 400,
              color: "rgba(245,240,232,0.55)",
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

// ─── Section ──────────────────────────────────────────────────────────────────

export default function PortfolioV2() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <>
      {open && <Lightbox project={open} onClose={() => setOpen(null)} />}

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

        {/* Editorial grid: each desktop row pairs a featured card (2 cols,
            fixed 3/2 crop) with a standard card stretched to match its
            height. The featured slot alternates sides row by row —
            positions 0, 3, 4, 7, … — so the rhythm holds as projects
            are added. */}
        <div
          className="portfolio-v2-grid"
          style={{
            display: "grid",
            gap: "32px",
          }}
        >
          {projects.map((project, i) => {
            const pair = Math.floor(i / 2);
            const featured = i === pair * 2 + (pair % 2);
            return (
              <ProjectCard
                key={project.id}
                project={project}
                featured={featured}
                onOpen={() => setOpen(project)}
              />
            );
          })}
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
              fontWeight: 400,
              color: "rgba(245,240,232,0.50)",
              letterSpacing: "0.06em",
            }}
          >
            Client names anonymised where confidentiality applies. Full portfolio available on request.
          </div>

          <a
            href="#cta"
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
              paddingBottom: "2px",
              borderBottom: "1px solid rgba(201,169,110,0.3)",
              transition: "border-color 0.2s, gap 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "#C9A96E";
              el.style.gap = "14px";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "rgba(201,169,110,0.3)";
              el.style.gap = "8px";
            }}
          >
            Start a project →
          </a>
        </div>
      </section>
    </>
  );
}
