"use client";
import KloaqNavbar from "@/components/v2/KloaqNavbar";
import KloaqFooter from "@/components/v2/KloaqFooter";

interface Section {
  heading: string;
  body: string | string[];
}

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
}

export default function LegalLayout({ title, subtitle, lastUpdated, sections }: LegalLayoutProps) {
  return (
    <div style={{ background: "#050505", minHeight: "100vh" }}>
      {/* Nav — same header as the homepage for site-wide consistency */}
      <KloaqNavbar />

      {/* Header */}
      <div style={{ padding: "160px 72px 80px", borderBottom: "1px solid rgba(249,249,249,0.06)" }}
        className="legal-header">
        <div style={{
          fontFamily: "var(--font-body), sans-serif", fontSize: "0.65rem", fontWeight: 600,
          letterSpacing: "0.22em", textTransform: "uppercase", color: "#FC5000", marginBottom: "20px",
        }}>
          Legal
        </div>
        <h1 style={{
          fontFamily: "var(--font-display), sans-serif", fontSize: "clamp(2.2rem, 4vw, 3.6rem)",
          fontWeight: 400, lineHeight: 1.15, textTransform: "uppercase",
          color: "#f9f9f9", marginBottom: "20px",
        }}>
          {title}
        </h1>
        <p style={{
          fontFamily: "var(--font-body), sans-serif", fontSize: "1rem", fontWeight: 400,
          color: "rgba(249,249,249,0.5)", lineHeight: 1.7, maxWidth: "520px",
          marginBottom: "32px",
        }}>
          {subtitle}
        </p>
        <div style={{
          fontFamily: "var(--font-body), sans-serif", fontSize: "0.72rem", fontWeight: 500,
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: "rgba(249,249,249,0.25)",
        }}>
          Last updated: {lastUpdated}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "80px 72px 120px", maxWidth: "760px" }} className="legal-content">
        {sections.map((section, i) => (
          <div key={i} style={{ marginBottom: "56px" }}>
            <h2 style={{
              fontFamily: "var(--font-display), sans-serif", fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
              fontWeight: 400, textTransform: "uppercase", color: "#f9f9f9",
              marginBottom: "16px", lineHeight: 1.3,
            }}>
              {section.heading}
            </h2>
            {Array.isArray(section.body) ? (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {section.body.map((item, j) => (
                  <li key={j} style={{
                    fontFamily: "var(--font-body), sans-serif", fontSize: "0.95rem", fontWeight: 400,
                    lineHeight: 1.8, color: "rgba(249,249,249,0.5)",
                    paddingLeft: "20px", position: "relative", marginBottom: "8px",
                  }}>
                    <span style={{
                      position: "absolute", left: 0, color: "#FC5000", fontSize: "0.7rem", top: "6px",
                    }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{
                fontFamily: "var(--font-body), sans-serif", fontSize: "0.95rem", fontWeight: 400,
                lineHeight: 1.8, color: "rgba(249,249,249,0.5)",
              }}>
                {section.body}
              </p>
            )}
          </div>
        ))}

        {/* Contact */}
        <div style={{
          borderTop: "1px solid rgba(249,249,249,0.06)", paddingTop: "48px", marginTop: "24px",
        }}>
          <p style={{
            fontFamily: "var(--font-body), sans-serif", fontSize: "0.88rem", fontWeight: 400,
            lineHeight: 1.8, color: "rgba(249,249,249,0.4)",
          }}>
            Questions about this policy? Reach out at{" "}
            <a href="mailto:hello@freddy.design" style={{ color: "#FC5000", textDecoration: "none" }}>
              hello@freddy.design
            </a>
          </p>
        </div>
      </div>

      {/* Footer — shared site-wide footer */}
      <KloaqFooter />
    </div>
  );
}
