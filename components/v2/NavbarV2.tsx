"use client";
import { useState, useEffect } from "react";

export default function NavbarV2() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    {open && (
      <div
        onClick={() => setOpen(false)}
        style={{ position: "fixed", inset: 0, zIndex: 99 }}
      />
    )}
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: scrolled ? "rgba(13,13,13,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottom: scrolled ? "1px solid rgba(201,169,110,0.15)" : "none",
        transition: "background 0.4s, border-color 0.4s, backdrop-filter 0.4s",
      }}
      className="nav-v2-wrapper"
    >

      <a
        href="/"
        style={{
          fontFamily: "'Canela', serif",
          fontSize: "1.5rem",
          fontWeight: 400,
          color: "#F5F0E8",
          textDecoration: "none",
          letterSpacing: "0.04em",
        }}
      >
        freddy<span style={{ color: "#C9A96E" }}>.</span>design
      </a>

      <ul
        className={`nav-v2-links${open ? " open" : ""}`}
        style={{
          gap: "40px",
          listStyle: "none",
          alignItems: "center",
        }}
      >
        {["Services", "How It Works", "Pricing", "Industries"].map((item) => (
          <li key={item}>
            <a
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "'Sohne', sans-serif",
                fontWeight: 400,
                fontSize: "0.8rem",
                color: "rgba(245,240,232,0.6)",
                textDecoration: "none",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#C9A96E")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,240,232,0.6)")}
            >
              {item}
            </a>
          </li>
        ))}
        <li>
          <a
            href="#cta"
            onClick={() => setOpen(false)}
            style={{
              fontFamily: "'Sohne', sans-serif",
              fontWeight: 600,
              fontSize: "0.82rem",
              color: "#C9A96E",
              textDecoration: "none",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              border: "1px solid rgba(201,169,110,0.55)",
              padding: "12px 28px",
              borderRadius: "2px",
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
            Let&apos;s Talk
          </a>
        </li>
      </ul>

      <div
        className="nav-v2-hamburger"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        style={{ display: "none", flexDirection: "column", gap: "6px", cursor: "pointer", position: "relative", width: "22px", height: "16px" }}
      >
        <span style={{
          width: "22px", height: "1px", background: "#F5F0E8", display: "block",
          position: "absolute", top: open ? "7px" : "0px",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          transition: "top 0.25s, transform 0.25s",
        }} />
        <span style={{
          width: "14px", height: "1px", background: "#F5F0E8", display: "block",
          position: "absolute", top: "7px",
          opacity: open ? 0 : 1,
          transition: "opacity 0.2s",
        }} />
        <span style={{
          width: "22px", height: "1px", background: "#F5F0E8", display: "block",
          position: "absolute", top: open ? "7px" : "14px",
          transform: open ? "rotate(-45deg)" : "rotate(0deg)",
          transition: "top 0.25s, transform 0.25s",
        }} />
      </div>

    </nav>
    </>
  );
}
