"use client";
import "@/styles/kloaq.css";
import KloaqNavbar from "@/components/v2/KloaqNavbar";
import KloaqFooter from "@/components/v2/KloaqFooter";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ background: "#050505", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <KloaqNavbar />

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
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(12rem, 26vw, 30rem)",
            fontWeight: 400,
            color: "rgba(252,80,0,0.06)",
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
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.65rem",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#FC5000",
              marginBottom: "28px",
            }}
          >
            Page Not Found
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontSize: "clamp(2rem, 4.2vw, 4rem)",
              fontWeight: 400,
              lineHeight: 1.2,
              textTransform: "uppercase",
              color: "#f9f9f9",
              letterSpacing: "0.005em",
              marginBottom: "24px",
            }}
          >
            Looks like this page
            <br />
            <span style={{ color: "#FC5000" }}>got lost in the brief.</span>
          </h1>

          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "1rem",
              fontWeight: 300,
              lineHeight: 1.75,
              color: "rgba(249,249,249,0.55)",
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
                fontFamily: "var(--font-body), sans-serif",
                fontWeight: 500,
                fontSize: "0.8rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#f9f9f9",
                background: "#FC5000",
                padding: "18px 44px",
                borderRadius: "8px",
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
                fontFamily: "var(--font-body), sans-serif",
                fontWeight: 400,
                fontSize: "0.8rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#FC5000",
                border: "1px solid rgba(252,80,0,0.45)",
                padding: "18px 44px",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "#FC5000";
                el.style.color = "#050505";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "transparent";
                el.style.color = "#FC5000";
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
            background: "rgba(252,80,0,0.12)",
          }}
          className="not-found-rule"
        />
      </main>

      <KloaqFooter />

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
