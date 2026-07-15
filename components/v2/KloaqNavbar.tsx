"use client";
import "@/styles/kloaq.css";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import Magnetic from "@/components/motion/Magnetic";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";
import { openBrief } from "@/components/v2/BriefFlow";
import { CONTACT_EMAIL } from "@/lib/site";

// Homepage nav (also used on /kloaq). Services and Industries live as
// sections on the homepage itself (KloaqServices / KloaqIndustries) but are
// intentionally left out of the menu. About → /about, Portfolio → /work,
// Pricing → the standalone /pricing route.
const MENU_ITEMS: { label: string; href?: string; anchor?: string }[] = [
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/work" },
  { label: "Pricing", href: "/pricing" },
];

export default function KloaqNavbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  // Pages where the section directly under the nav is the cream light field
  // (no dark hero above it) — flip the nav ink to near-black so links,
  // logo and hamburger stay legible on cream. Scrolled state still swaps
  // the wrapper to dark, at which point cream ink takes over via CSS.
  const onLightBg = pathname === "/pricing";

  // On the homepage, anchors stay bare hashes so Lenis smooth-scrolls them.
  // Off-homepage (e.g. /kloaq), prefix with "/" so they navigate home then jump.
  const resolveHref = (item: { href?: string; anchor?: string }) =>
    item.href ?? (onHome ? item.anchor! : `/${item.anchor}`);

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
    const q = gsap.utils.selector(el);
    if (!mounted.current) {
      mounted.current = true;
      gsap.set([q(".mobile-menu-accent"), q(".mobile-menu-bg")], { yPercent: -100 });
      if (!open) return; // don't play the close animation on first render
    }
    document.body.style.overflow = open ? "hidden" : "";
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
        .fromTo(q(".mobile-menu-accent"), { yPercent: -100 }, { yPercent: 0, duration: 0.5, ease: "expo.inOut" }, 0)
        .fromTo(q(".mobile-menu-bg"), { yPercent: -100 }, { yPercent: 0, duration: 0.55, ease: "expo.inOut" }, 0.08)
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
              key={item.label}
              href={resolveHref(item)}
              className="mobile-menu-link"
              onClick={() => setOpen(false)}
            >
              <span className="mobile-menu-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="line-mask">
                <span className="line">{item.label}</span>
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
        // Three zones — [logo] [links] [CTA] — not a single space-between row:
        // the 1fr side tracks are equal, so the middle track (and the links in
        // it) sits centered on the VIEWPORT regardless of how wide the logo or
        // the CTA are. With space-between, the links' position drifted with the
        // width of whatever sat beside them.
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        background: scrolled ? "rgba(5,5,5,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        // The bar spans the full viewport width and is ~114–144px tall. While
        // transparent (unscrolled) it is invisible, yet as a z-index:100 element
        // with default pointer-events it silently swallowed every click landing
        // in its empty area — which is exactly where the case-study "← All work"
        // link sits (top:120px). Hit-testing now follows visibility: transparent
        // bar lets clicks through to the page beneath; once scrolled the bar is
        // an opaque blurred surface, so it blocks clicks like a solid bar should.
        // Its own controls opt back in via pointerEvents:"auto" (see below).
        pointerEvents: scrolled ? "auto" : "none",
        borderBottom: scrolled ? "1px solid rgba(var(--orange-rgb), 0.20)" : "none",
        transform: hidden && !open ? "translateY(-100%)" : "translateY(0)",
        transition:
          "background 0.4s, border-color 0.4s, backdrop-filter 0.4s, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}
      className="kloaq-nav-wrapper"
      data-nav-theme={onLightBg && !scrolled ? "light-bg" : undefined}
    >

      <a
        href="/"
        style={{
          fontFamily: "'Boldonse', 'Anton', 'Sohne Breit', sans-serif",
          fontSize: "1.5rem",
          fontWeight: 400,
          color: onLightBg && !scrolled ? "var(--black)" : "var(--off-white)",
          textDecoration: "none",
          letterSpacing: "0.02em",
          textTransform: "none",
          // Re-enable hit-testing: the bar sets pointer-events:none.
          pointerEvents: "auto",
        }}
      >
        freddi<span style={{ color: "var(--orange)" }}>.</span>
      </a>

      {/* Zone 2 — the centered link group. The CTA is NOT in here anymore: it
          lives in its own right-hand zone, so these three links center on the
          viewport rather than on "links + button". */}
      <ul
        className="kloaq-nav-links"
        style={{
          gap: "40px",
          listStyle: "none",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* pointer-events is re-enabled per <li>, NOT on the <ul>: the list is a
            wide flex row whose 40px gaps are dead space. Making the <ul>
            clickable would just recreate a smaller invisible click-eater over
            whatever sits beneath it. */}
        {MENU_ITEMS.map((item) => (
          <li key={item.label} style={{ pointerEvents: "auto" }}>
            <a
              href={resolveHref(item)}
              onClick={() => setOpen(false)}
              className="nav-link"
              style={{
                fontFamily: "'Inter Tight', 'Sohne', sans-serif",
                fontWeight: 500,
                fontSize: "1.1rem",
                textDecoration: "none",
                letterSpacing: "0.01em",
                textTransform: "none",
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Zone 3 — the CTA, pinned right. Hidden ≤768px (the hamburger takes
          over), where it would otherwise sit on top of the burger. */}
      <div
        className="kloaq-nav-cta"
        style={{ justifySelf: "end", pointerEvents: "auto" }}
      >
        <Magnetic strength={8}>
        {/* Opens the brief flow directly — was an <a href="#cta"> that scrolled
            to the Manifesto section, where the ONLY thing to do was click
            another button ("Let's work together") to reach this same
            openBrief() call. Two clicks to do what this button's whole job is.
            Now it does what the mobile menu's identical CTA already does.
            .btn.btn-accent — the site's one button shape (kloaq.css), not a
            one-off inline style; this used to be a third divergent shape
            (700 weight, 10px radius, 12/32 padding) with no reason to differ
            from "View All Works" or the Manifesto CTA. */}
        <button
          type="button"
          className="btn btn-accent"
          onClick={() => {
            setOpen(false);
            openBrief();
          }}
        >
          Let&apos;s Talk
        </button>
        </Magnetic>
      </div>

      <div
        className="kloaq-nav-hamburger"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        style={{ display: "none", flexDirection: "column", gap: "6px", cursor: "pointer", position: "relative", width: "22px", height: "16px", pointerEvents: "auto", justifySelf: "end", gridColumn: 3, gridRow: 1 }}
      >
        <span style={{
          width: "22px", height: "1px", background: onLightBg && !scrolled ? "var(--black)" : "var(--off-white)", display: "block",
          position: "absolute", top: open ? "7px" : "0px",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          transition: "top 0.25s, transform 0.25s",
        }} />
        <span style={{
          width: "14px", height: "1px", background: onLightBg && !scrolled ? "var(--black)" : "var(--off-white)", display: "block",
          position: "absolute", top: "7px",
          opacity: open ? 0 : 1,
          transition: "opacity 0.2s",
        }} />
        <span style={{
          width: "22px", height: "1px", background: onLightBg && !scrolled ? "var(--black)" : "var(--off-white)", display: "block",
          position: "absolute", top: open ? "7px" : "14px",
          transform: open ? "rotate(-45deg)" : "rotate(0deg)",
          transition: "top 0.25s, transform 0.25s",
        }} />
      </div>

    </nav>
    </>
  );
}
