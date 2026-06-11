"use client";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Magnetic from "@/components/motion/Magnetic";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";
import { openBrief } from "@/components/v2/BriefFlow";
import { CONTACT_EMAIL } from "@/lib/site";

const MENU_ITEMS = ["Services", "Portfolio", "How It Works", "Pricing", "Industries"];

export default function NavbarV2() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  // Full-page mobile menu: gold accent wipes down first, the dark panel
  // chases it, then the links reveal line-by-line (MOTION.md). Close runs
  // the same choreography upward.
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    if (!mounted.current) {
      mounted.current = true;
      if (!open) return; // don't play the close animation on first render
    }
    document.body.style.overflow = open ? "hidden" : "";

    const q = gsap.utils.selector(el);
    if (prefersReducedMotion()) {
      gsap.set(el, { visibility: open ? "visible" : "hidden", pointerEvents: open ? "auto" : "none" });
      gsap.set([q(".mobile-menu-accent"), q(".mobile-menu-bg")], { yPercent: open ? 0 : -100 });
      gsap.set(q(".mobile-menu-link .line"), { yPercent: 0 });
      gsap.set(q(".mobile-menu-foot"), { opacity: 1 });
      return;
    }

    const tl = gsap.timeline();
    if (open) {
      tl.set(el, { visibility: "visible", pointerEvents: "auto" })
        // y: 0 clears the CSS translateY(-100%) fallback, which GSAP would
        // otherwise keep as a resolved px base offset under yPercent
        .fromTo(q(".mobile-menu-accent"), { yPercent: -100, y: 0 }, { yPercent: 0, duration: 0.5, ease: "expo.inOut" }, 0)
        .fromTo(q(".mobile-menu-bg"), { yPercent: -100, y: 0 }, { yPercent: 0, duration: 0.55, ease: "expo.inOut" }, 0.08)
        .fromTo(
          q(".mobile-menu-link .line"),
          { yPercent: 110 },
          { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.07 },
          0.42
        )
        .fromTo(
          q(".mobile-menu-foot"),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" },
          0.75
        );
    } else {
      tl.to(q(".mobile-menu-link .line"), { yPercent: -110, duration: 0.3, ease: "expo.in", stagger: 0.04 }, 0)
        .to(q(".mobile-menu-foot"), { opacity: 0, duration: 0.25 }, 0)
        .to(q(".mobile-menu-bg"), { yPercent: -100, duration: 0.5, ease: "expo.inOut" }, 0.22)
        .to(q(".mobile-menu-accent"), { yPercent: -100, duration: 0.5, ease: "expo.inOut" }, 0.3)
        .set(el, { visibility: "hidden", pointerEvents: "none" });
    }
    return () => {
      tl.kill();
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // hide when scrolling down past the hero, reveal on any upward scroll
      setHidden(y > 200 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    {/* Full-page mobile menu (hidden ≥769px via CSS) */}
    <div ref={menuRef} className="mobile-menu" aria-hidden={!open}>
      <div className="mobile-menu-accent" aria-hidden />
      <div className="mobile-menu-bg" aria-hidden />
      <div className="mobile-menu-content">
        <nav aria-label="Mobile">
          {MENU_ITEMS.map((item, i) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="mobile-menu-link"
              onClick={() => setOpen(false)}
            >
              <span className="mobile-menu-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="line-mask">
                <span className="line">{item}</span>
              </span>
            </a>
          ))}
        </nav>

        <div className="mobile-menu-foot">
          <div className="mobile-menu-status">
            <span className="mobile-menu-dot" />
            Available for new clients
          </div>
          <button
            className="mobile-menu-cta"
            onClick={() => {
              setOpen(false);
              openBrief();
            }}
          >
            Brief Me in 20 Seconds
          </button>
          <a className="mobile-menu-mail" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </div>
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
        transform: hidden && !open ? "translateY(-100%)" : "translateY(0)",
        transition:
          "background 0.4s, border-color 0.4s, backdrop-filter 0.4s, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
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
        {["Services", "Portfolio", "How It Works", "Pricing", "Industries"].map((item) => (
          <li key={item}>
            <a
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setOpen(false)}
              className="nav-link"
              style={{
                fontFamily: "'Sohne', sans-serif",
                fontWeight: 400,
                fontSize: "0.8rem",
                textDecoration: "none",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {item}
            </a>
          </li>
        ))}
        <li>
          <Magnetic strength={8}>
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
          </Magnetic>
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
