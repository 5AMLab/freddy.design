"use client";
import Image from "next/image";
import Link from "next/link";
import "@/styles/kloaq.css";
import { type Project } from "@/lib/work";
import KloaqNavbar from "@/components/v2/KloaqNavbar";
import KloaqFooter from "@/components/v2/KloaqFooter";

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-body), sans-serif", fontSize: "0.72rem", fontWeight: 600,
          letterSpacing: "0.04em", textTransform: "uppercase",
          color: "var(--orange)", marginBottom: "8px",
        }}
      >
        [{label.toUpperCase()}]
      </div>
      <div
        style={{
          fontFamily: "var(--font-body), sans-serif", fontSize: "0.9rem", fontWeight: 300,
          color: "rgba(249,249,249,0.7)", lineHeight: 1.5,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function WorkDetail({ project, next }: { project: Project; next: Project }) {
  return (
    <div style={{ background: "#050505", minHeight: "100vh" }}>
      <KloaqNavbar />

      {/* Header — same section language as the homepage/index: shared
          .kloaq-vlabel label, Boldonse heading, cream lead paragraph, 80px rail. */}
      <div
        style={{ padding: "160px 80px 64px", borderBottom: "1px solid rgba(249,249,249,0.06)" }}
        className="legal-header"
      >
        <Link
          href="/work"
          style={{
            fontFamily: "var(--font-body), sans-serif", fontSize: "0.72rem", fontWeight: 400,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "rgba(249,249,249,0.4)", textDecoration: "none",
            display: "inline-block", marginBottom: "32px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#FC5000")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(249,249,249,0.4)")}
        >
          ← All work
        </Link>
        <div className="kloaq-vlabel">{project.client}</div>
        <h1
          style={{
            fontFamily: "var(--font-display), sans-serif", fontSize: "clamp(2rem, 3.8vw, 3.4rem)",
            fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.005em",
            lineHeight: 1.45, color: "#f9f9f9", marginBottom: "28px",
            maxWidth: "900px",
          }}
        >
          {project.title}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body), sans-serif", fontSize: "1.2rem", fontWeight: 400,
            color: "rgba(249,249,249,0.7)", lineHeight: 1.75, maxWidth: "660px",
            marginBottom: "48px",
          }}
        >
          {project.intro}
        </p>

        {/* Meta row */}
        <div
          className="work-detail-meta"
          style={{
            display: "flex", flexWrap: "wrap", gap: "48px",
            paddingTop: "8px",
          }}
        >
          <MetaItem label="Client" value={project.client} />
          <MetaItem label="Discipline" value={project.category} />
          <MetaItem label="Year" value={project.year} />
          <MetaItem label="Role" value={project.role} />
        </div>
      </div>

      {/* Image sequence — full-width, generous, in order */}
      <div
        style={{ padding: "80px", display: "flex", flexDirection: "column", gap: "32px" }}
        className="work-detail-images"
      >
        {project.images.map((src, i) => (
          <div
            key={src}
            style={{
              position: "relative",
              width: "100%",
              borderRadius: "14px", // rounded-image — Kloaq canonical image radius
              overflow: "hidden",
              background: "#141414",
              border: "1px solid rgba(249,249,249,0.06)",
              aspectRatio: i === 0 ? "16/10" : "3/2",
            }}
          >
            <Image
              src={src}
              alt={`${project.title} — image ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 1100px"
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority={i === 0}
              loading={i === 0 ? undefined : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Next project */}
      <Link
        href={`/work/${next.slug}`}
        data-cursor="view"
        style={{
          display: "block", textDecoration: "none",
          borderTop: "1px solid rgba(249,249,249,0.06)",
          padding: "64px 80px",
          background: "#0A0A0A",
        }}
        className="work-detail-next"
      >
        <div
          style={{
            fontFamily: "var(--font-body), sans-serif", fontSize: "0.72rem", fontWeight: 600,
            letterSpacing: "0.04em", textTransform: "uppercase",
            color: "var(--orange)", marginBottom: "16px",
          }}
        >
          [NEXT PROJECT]
        </div>
        <div
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            gap: "24px", flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display), sans-serif", fontSize: "clamp(1.6rem, 3.2vw, 2.8rem)",
              fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.005em",
              lineHeight: 1.2, color: "#f9f9f9",
            }}
          >
            {next.title}
          </h2>
          <span
            style={{
              fontFamily: "var(--font-body), sans-serif", fontSize: "0.95rem", fontWeight: 400,
              letterSpacing: "0.08em", color: "#FC5000",
            }}
          >
            {next.client} →
          </span>
        </div>
      </Link>

      <KloaqFooter />
    </div>
  );
}
