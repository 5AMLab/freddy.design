"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "@/styles/kloaq.css";
import { type Project } from "@/lib/work";
import KloaqNavbar from "@/components/v2/KloaqNavbar";
import KloaqFooter from "@/components/v2/KloaqFooter";

function IndexCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);
  const hasImage = project.images.length > 0;

  return (
    <Link
      href={`/work/${project.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor={hasImage ? "view" : undefined}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "3/2",
          backgroundColor: "#141414",
          borderRadius: "14px", // rounded-image — Kloaq canonical image radius
          border: "1px solid",
          borderColor: hovered ? "rgba(252,80,0,0.3)" : "rgba(249,249,249,0.06)",
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.35s",
        }}
      >
        {hasImage && (
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
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
              loading="lazy"
            />
          </div>
        )}
      </div>

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
              fontFamily: "var(--font-display), sans-serif",
              fontSize: "1.05rem",
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "0.005em",
              color: "#f9f9f9", // full cream at rest — matches .kloaq-case-name
              marginBottom: "4px",
              lineHeight: 1.25,
            }}
          >
            {project.title}
          </div>
          <div
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.72rem",
              fontWeight: 400,
              color: "rgba(249,249,249,0.55)",
              letterSpacing: "0.04em",
            }}
          >
            {project.client}
          </div>
        </div>
        {/* Category tag — the homepage's bracketed-orange tag language
            (matches .kloaq-service-tag: [TEXT], orange, uppercase, 600).
            No pill/border — brightens on hover instead of flipping to a block. */}
        <div
          style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: hovered ? "#FC5000" : "rgba(252,80,0,0.7)",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "color 0.3s",
          }}
        >
          [{project.category.toUpperCase()}]
        </div>
      </div>
    </Link>
  );
}

export default function WorkIndex({ projects }: { projects: Project[] }) {
  return (
    <div style={{ background: "#050505", minHeight: "100vh" }}>
      <KloaqNavbar />

      {/* Header — mirrors the homepage section language: shared .kloaq-vlabel
          orange label, Boldonse display heading, cream lead paragraph, 80px rail. */}
      <div
        style={{ padding: "160px 80px 80px", borderBottom: "1px solid rgba(249,249,249,0.06)" }}
        className="legal-header"
      >
        <div className="kloaq-vlabel">Projects</div>
        <h1
          style={{
            fontFamily: "var(--font-display), sans-serif", fontSize: "clamp(2rem, 3.6vw, 3.2rem)",
            fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.005em",
            lineHeight: 1.45, color: "#f9f9f9", marginBottom: "24px",
          }}
        >
          Selected work
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body), sans-serif", fontSize: "1.2rem", fontWeight: 400,
            color: "rgba(249,249,249,0.7)", lineHeight: 1.7, maxWidth: "600px",
          }}
        >
          Annual reports, investor decks, brand systems, campaigns and packaging —
          a cross-section of recent projects. Client names anonymised where
          confidentiality applies.
        </p>
      </div>

      {/* Grid */}
      <div style={{ padding: "80px" }} className="work-index-grid-wrap">
        <div
          className="work-index-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "32px",
          }}
        >
          {projects.map((project) => (
            <IndexCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      <KloaqFooter />
    </div>
  );
}
