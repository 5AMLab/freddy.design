"use client";
import Link from "next/link";

export default function FooterV2() {
  return (
    <>

      <footer
        style={{
          background: "#0A0A0A",
          borderTop: "1px solid rgba(245,240,232,0.06)",
        }}
      >
        <div
          className="footer-v2-inner"
          style={{
            padding: "40px 72px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontFamily: "'Canela', serif",
              fontSize: "1.3rem",
              fontWeight: 400,
              color: "rgba(245,240,232,0.6)",
              letterSpacing: "0.04em",
            }}
          >
            freddy<span style={{ color: "#C9A96E" }}>.</span>design
          </div>

          <p
            style={{
              fontFamily: "'Sohne', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 300,
              letterSpacing: "0.1em",
              color: "rgba(245,240,232,0.2)",
              textTransform: "uppercase",
            }}
          >
            © 2025 freddy.design · Singapore
          </p>

          <ul style={{ display: "flex", gap: "28px", listStyle: "none", flexWrap: "wrap" }}>
            {["Instagram", "LinkedIn", "WhatsApp"].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  style={{
                    fontFamily: "'Sohne', sans-serif",
                    fontSize: "0.72rem",
                    fontWeight: 400,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(245,240,232,0.25)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "#C9A96E")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,240,232,0.25)")
                  }
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          <ul style={{ display: "flex", gap: "20px", listStyle: "none", flexWrap: "wrap" }}>
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Cookies", href: "/cookies" },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  style={{
                    fontFamily: "'Sohne', sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 400,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(245,240,232,0.15)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,240,232,0.4)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,240,232,0.15)")
                  }
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  );
}
