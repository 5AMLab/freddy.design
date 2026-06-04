"use client";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 60px",
        background: "#0f0f0f",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "3px solid #E8222E",
      }}
      className="nav-wrapper"
    >
      <style>{`
        @media (max-width: 768px) {
          .nav-wrapper { padding: 16px 20px !important; }
          .nav-links-list { display: none; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: #0f0f0f; padding: 20px; gap: 20px !important; border-bottom: 3px solid #E8222E; }
          .nav-links-list.open { display: flex !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>

      {/* Logo */}
      <a
        href="#"
        style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: "1.8rem",
          color: "white",
          textDecoration: "none",
        }}
      >
        freddy<span style={{ color: "#E8222E" }}>.</span>design
      </a>

      {/* Nav Links */}
      <ul
        className={`nav-links nav-links-list${open ? " open" : ""}`}
        style={{
          display: "flex",
          gap: "36px",
          listStyle: "none",
          alignItems: "center",
        }}
      >
        <li>
          <a href="#services" onClick={() => setOpen(false)}>
            Services
          </a>
        </li>
        <li>
          <a href="#how" onClick={() => setOpen(false)}>
            How It Works
          </a>
        </li>
        <li>
          <a href="#pricing" onClick={() => setOpen(false)}>
            Pricing
          </a>
        </li>
        <li>
          <a href="#industries" onClick={() => setOpen(false)}>
            Industries
          </a>
        </li>
        <li>
          <a href="#cta" className="nav-cta" onClick={() => setOpen(false)}>
            Let&apos;s Talk →
          </a>
        </li>
      </ul>

      {/* Hamburger */}
      <div
        className="nav-hamburger"
        onClick={() => setOpen(!open)}
        style={{
          display: "none",
          flexDirection: "column",
          gap: "5px",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            width: "24px",
            height: "2.5px",
            background: "white",
            borderRadius: "2px",
            display: "block",
            transition: "0.3s",
          }}
        />
        <span
          style={{
            width: "24px",
            height: "2.5px",
            background: "white",
            borderRadius: "2px",
            display: "block",
            transition: "0.3s",
          }}
        />
        <span
          style={{
            width: "24px",
            height: "2.5px",
            background: "white",
            borderRadius: "2px",
            display: "block",
            transition: "0.3s",
          }}
        />
      </div>
    </nav>
  );
}
