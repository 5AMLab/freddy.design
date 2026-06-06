"use client";
import NavbarV2 from "@/components/v2/NavbarV2";
import FooterV2 from "@/components/v2/FooterV2";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavbarV2 />

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          padding: "160px 72px 120px",
        }}
        className="not-found-main"
      >
        {/* Ghost 404 */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -54%)",
            fontFamily: "'Canela', serif",
            fontSize: "clamp(14rem, 30vw, 34rem)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "rgba(201,169,110,0.05)",
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
            whiteSpace: "nowrap",
            letterSpacing: "-0.04em",
          }}
        >
          404
        </div>

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            maxWidth: "560px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div
            style={{
              fontFamily: "'Sohne Breit', sans-serif",
              fontSize: "0.65rem",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#C9A96E",
              marginBottom: "28px",
            }}
          >
            Page Not Found
          </div>

          <h1
            style={{
              fontFamily: "'Canela', serif",
              fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)",
              fontWeight: 300,
              lineHeight: 1.05,
              color: "#F5F0E8",
              letterSpacing: "-0.01em",
              marginBottom: "24px",
            }}
          >
            Looks like this page
            <br />
            <em style={{ color: "#C9A96E" }}>got lost in the brief.</em>
          </h1>

          <p
            style={{
              fontFamily: "'Sohne', sans-serif",
              fontSize: "1rem",
              fontWeight: 300,
              lineHeight: 1.75,
              color: "rgba(245,240,232,0.55)",
              marginBottom: "48px",
            }}
          >
            The page you&apos;re looking for doesn&apos;t exist or has moved.
            <br />
            Head back home and let&apos;s find what you need.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="/"
              style={{
                display: "inline-block",
                fontFamily: "'Sohne', sans-serif",
                fontWeight: 500,
                fontSize: "0.8rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#0D0D0D",
                background: "#C9A96E",
                padding: "18px 44px",
                borderRadius: "2px",
                textDecoration: "none",
                transition: "opacity 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.opacity = "0.85";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
              }}
            >
              Back to Home
            </a>

            <a
              href="#cta"
              onClick={() => { window.location.href = "/#cta"; }}
              style={{
                display: "inline-block",
                fontFamily: "'Sohne', sans-serif",
                fontWeight: 400,
                fontSize: "0.8rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#C9A96E",
                border: "1px solid rgba(201,169,110,0.45)",
                padding: "18px 44px",
                borderRadius: "2px",
                textDecoration: "none",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "#C9A96E";
                el.style.color = "#0D0D0D";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "transparent";
                el.style.color = "#C9A96E";
              }}
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Thin horizontal rule */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "72px",
            right: "72px",
            height: "1px",
            background: "rgba(201,169,110,0.12)",
          }}
          className="not-found-rule"
        />
      </main>

      <FooterV2 />

      <style>{`
        @media (max-width: 768px) {
          .not-found-main {
            padding: 140px 24px 80px !important;
          }
          .not-found-rule {
            left: 24px !important;
            right: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
