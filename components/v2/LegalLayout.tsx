"use client";
import Link from "next/link";

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
    <div style={{ background: "#0D0D0D", minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "24px 72px", position: "fixed", top: 0, left: 0, right: 0,
        background: "rgba(13,13,13,0.96)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(201,169,110,0.1)", zIndex: 100,
      }} className="nav-v2-wrapper">
        <Link href="/" style={{
          fontFamily: "'Canela', serif", fontSize: "1.5rem", fontWeight: 400,
          color: "#F5F0E8", textDecoration: "none", letterSpacing: "0.04em",
        }}>
          freddy<span style={{ color: "#C9A96E" }}>.</span>design
        </Link>
        <Link href="/" style={{
          fontFamily: "'Sohne', sans-serif", fontSize: "0.75rem", fontWeight: 400,
          letterSpacing: "0.12em", textTransform: "uppercase",
          color: "rgba(245,240,232,0.4)", textDecoration: "none",
          transition: "color 0.2s",
        }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#C9A96E")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,240,232,0.4)")}
        >
          ← Back
        </Link>
      </nav>

      {/* Header */}
      <div style={{ padding: "160px 72px 80px", borderBottom: "1px solid rgba(245,240,232,0.06)" }}
        className="legal-header">
        <div style={{
          fontFamily: "'Sohne Breit', sans-serif", fontSize: "0.65rem", fontWeight: 400,
          letterSpacing: "0.22em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "20px",
        }}>
          Legal
        </div>
        <h1 style={{
          fontFamily: "'Canela', serif", fontSize: "clamp(2.8rem, 5vw, 5rem)",
          fontWeight: 300, lineHeight: 1.05, color: "#F5F0E8", marginBottom: "20px",
        }}>
          {title}
        </h1>
        <p style={{
          fontFamily: "'Sohne', sans-serif", fontSize: "1rem", fontWeight: 300,
          color: "rgba(245,240,232,0.4)", lineHeight: 1.7, maxWidth: "520px",
          marginBottom: "32px",
        }}>
          {subtitle}
        </p>
        <div style={{
          fontFamily: "'Sohne', sans-serif", fontSize: "0.72rem", fontWeight: 400,
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: "rgba(245,240,232,0.2)",
        }}>
          Last updated: {lastUpdated}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "80px 72px 120px", maxWidth: "760px" }} className="legal-content">
        {sections.map((section, i) => (
          <div key={i} style={{ marginBottom: "56px" }}>
            <h2 style={{
              fontFamily: "'Canela', serif", fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
              fontWeight: 300, color: "#F5F0E8", marginBottom: "16px", lineHeight: 1.2,
            }}>
              {section.heading}
            </h2>
            {Array.isArray(section.body) ? (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {section.body.map((item, j) => (
                  <li key={j} style={{
                    fontFamily: "'Sohne', sans-serif", fontSize: "0.95rem", fontWeight: 300,
                    lineHeight: 1.8, color: "rgba(245,240,232,0.5)",
                    paddingLeft: "20px", position: "relative", marginBottom: "8px",
                  }}>
                    <span style={{
                      position: "absolute", left: 0, color: "#C9A96E", fontSize: "0.7rem", top: "6px",
                    }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{
                fontFamily: "'Sohne', sans-serif", fontSize: "0.95rem", fontWeight: 300,
                lineHeight: 1.8, color: "rgba(245,240,232,0.5)",
              }}>
                {section.body}
              </p>
            )}
          </div>
        ))}

        {/* Contact */}
        <div style={{
          borderTop: "1px solid rgba(245,240,232,0.06)", paddingTop: "48px", marginTop: "24px",
        }}>
          <p style={{
            fontFamily: "'Sohne', sans-serif", fontSize: "0.88rem", fontWeight: 300,
            lineHeight: 1.8, color: "rgba(245,240,232,0.4)",
          }}>
            Questions about this policy? Reach out at{" "}
            <a href="mailto:hello@freddy.design" style={{ color: "#C9A96E", textDecoration: "none" }}>
              hello@freddy.design
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: "#0A0A0A", borderTop: "1px solid rgba(245,240,232,0.06)",
        padding: "32px 72px", display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: "16px",
      }} className="legal-footer">
        <div style={{
          fontFamily: "'Canela', serif", fontSize: "1.1rem", fontWeight: 400,
          color: "rgba(245,240,232,0.4)", letterSpacing: "0.04em",
        }}>
          freddy<span style={{ color: "#C9A96E" }}>.</span>design
        </div>
        <p style={{
          fontFamily: "'Sohne', sans-serif", fontSize: "0.7rem", fontWeight: 300,
          letterSpacing: "0.1em", color: "rgba(245,240,232,0.15)", textTransform: "uppercase",
        }}>
          © 2025 freddy.design · Singapore
        </p>
        <ul style={{ display: "flex", gap: "24px", listStyle: "none" }}>
          {[
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "Cookies", href: "/cookies" },
          ].map(({ label, href }) => (
            <li key={label}>
              <Link href={href} style={{
                fontFamily: "'Sohne', sans-serif", fontSize: "0.7rem", fontWeight: 400,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "rgba(245,240,232,0.2)", textDecoration: "none",
              }}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
