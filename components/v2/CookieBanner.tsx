"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false); // drives the enter/exit transition

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setVisible(true);
      // let the hero entrance breathe before the banner slides in
      const t = setTimeout(() => setShown(true), 2200);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = (choice: "accepted" | "declined") => {
    localStorage.setItem("cookie_consent", choice);
    setShown(false);
    setTimeout(() => setVisible(false), 500);
  };

  const accept = () => dismiss("accepted");
  const decline = () => dismiss("declined");

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "32px",
      left: "50%",
      transform: shown
        ? "translateX(-50%) translateY(0)"
        : "translateX(-50%) translateY(24px)",
      opacity: shown ? 1 : 0,
      transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s cubic-bezier(0.16,1,0.3,1)",
      zIndex: 999,
      width: "min(680px, calc(100vw - 48px))",
      background: "#161616",
      border: "1px solid rgba(201,169,110,0.2)",
      borderRadius: "4px",
      padding: "28px 32px",
      display: "flex",
      alignItems: "center",
      gap: "32px",
      flexWrap: "wrap",
      boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
    }}>
      {/* Gold accent line */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent, #C9A96E, transparent)",
      }} />

      <div style={{ flex: 1, minWidth: "200px" }}>
        <p style={{
          fontFamily: "'Sohne', sans-serif",
          fontSize: "0.82rem",
          fontWeight: 300,
          lineHeight: 1.7,
          color: "rgba(245,240,232,0.6)",
        }}>
          We use essential cookies to keep this site running. No tracking, no ads.{" "}
          <Link href="/cookies" style={{
            color: "#C9A96E",
            textDecoration: "none",
            borderBottom: "1px solid rgba(201,169,110,0.3)",
          }}>
            Cookie Policy
          </Link>
        </p>
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexShrink: 0 }}>
        <button
          onClick={decline}
          style={{
            fontFamily: "'Sohne', sans-serif",
            fontSize: "0.72rem",
            fontWeight: 400,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(245,240,232,0.3)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "10px 4px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(245,240,232,0.6)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(245,240,232,0.3)")}
        >
          Decline
        </button>
        <button
          onClick={accept}
          style={{
            fontFamily: "'Sohne', sans-serif",
            fontSize: "0.72rem",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#0D0D0D",
            background: "#C9A96E",
            border: "1px solid #C9A96E",
            borderRadius: "2px",
            cursor: "pointer",
            padding: "10px 24px",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
