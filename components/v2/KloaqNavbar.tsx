"use client";
import "@/styles/kloaq.css";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import Magnetic from "@/components/motion/Magnetic";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";
import { openBrief } from "@/components/v2/BriefFlow";
import { useNavBgSample } from "@/components/v2/useNavBgSample";
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

  // On the homepage, anchors stay bare hashes so Lenis smooth-scrolls them.
  // Off-homepage (e.g. /kloaq), prefix with "/" so they navigate home then jump.
  const resolveHref = (item: { href?: string; anchor?: string }) =>
    item.href ?? (onHome ? item.anchor! : `/${item.anchor}`);

  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  // Past this threshold the logo fades out (see the wordmark's
  // opacity/pointerEvents below) and the CTA switches to its own floating
  // pill treatment (background/shadow, no bar behind it — see kloaq-nav-cta
  // below). The bar itself never gets a background either way.
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  // Live sample of what's actually rendered behind the (always-transparent)
  // nav — replaces the old per-page hardcoded guess (`pathname ===
  // "/pricing"`), which only covered one flat-coloured section and couldn't
  // handle a case-study hero photo whose brightness varies by scroll
  // position. The bar never becomes an opaque plate, so this runs at every
  // scroll position — the nav links can still be visible (not yet past the
  // `hidden` scroll-direction threshold) over arbitrary page content while
  // scrolled.
  const bgTheme = useNavBgSample(true);
  const onLightBg = bgTheme === "light";

  // Full-page mobile menu: gold accent slides in from the right first, the
  // dark panel chases it, then the links wipe in left-behind-a-mask
  // (same right-to-left axis as the panels, not a vertical rise) — a single
  // consistent direction rather than panels-one-way/text-another. Close runs
  // the same choreography back out to the right. Compressed to roughly half
  // the previous durations/stagger for a snappier feel (MOTION.md).
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    if (!mounted.current) {
      mounted.current = true;
      gsap.set([q(".mobile-menu-accent"), q(".mobile-menu-bg")], { xPercent: 100 });
      if (!open) return; // don't play the close animation on first render
    }
    document.body.style.overflow = open ? "hidden" : "";
    if (prefersReducedMotion()) {
      gsap.set(el, { visibility: open ? "visible" : "hidden", pointerEvents: open ? "auto" : "none" });
      gsap.set([q(".mobile-menu-accent"), q(".mobile-menu-bg")], { xPercent: open ? 0 : 100 });
      gsap.set(q(".mobile-menu-link .line"), { xPercent: 0 });
      gsap.set(q(".mobile-menu-foot"), { opacity: 1 });
      return;
    }

    const tl = gsap.timeline();
    if (open) {
      tl.set(el, { visibility: "visible", pointerEvents: "auto" })
        .fromTo(q(".mobile-menu-accent"), { xPercent: 100 }, { xPercent: 0, duration: 0.25, ease: "expo.inOut" }, 0)
        .fromTo(q(".mobile-menu-bg"), { xPercent: 100 }, { xPercent: 0, duration: 0.28, ease: "expo.inOut" }, 0.04)
        .fromTo(
          q(".mobile-menu-link .line"),
          { xPercent: 110 },
          { xPercent: 0, duration: 0.4, ease: "expo.out", stagger: 0.035 },
          0.2
        )
        .fromTo(
          q(".mobile-menu-foot"),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.3, ease: "expo.out" },
          0.38
        );
    } else {
      tl.to(q(".mobile-menu-link .line"), { xPercent: -110, duration: 0.18, ease: "expo.in", stagger: 0.02 }, 0)
        .to(q(".mobile-menu-foot"), { opacity: 0, duration: 0.15 }, 0)
        .to(q(".mobile-menu-bg"), { xPercent: 100, duration: 0.26, ease: "expo.inOut" }, 0.12)
        .to(q(".mobile-menu-accent"), { xPercent: 100, duration: 0.26, ease: "expo.inOut" }, 0.16)
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
            Let&apos;s Talk
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
        // Always transparent, no blur, no border — the bar never becomes its
        // own opaque surface. An opaque plate here would frame an almost-empty
        // strip once scrolled (logo + links both faded, see below), reading as
        // a lone floating button in a bar rather than a real nav — so instead
        // the CTA gets its own floating-pill treatment (shadow, self-contained)
        // once scrolled, independent of any bar chrome. See kloaq-nav-cta below.
        background: "transparent",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        // The bar spans the full viewport width and is ~100–120px tall and is
        // always transparent, yet as a z-index:100 element with default
        // pointer-events it would silently swallow every click landing in its
        // empty area — which is exactly where the case-study "← All work"
        // link sits (top:120px). The bar itself never captures clicks; its
        // own controls opt back in via pointerEvents:"auto" individually.
        pointerEvents: "none",
        // The bar itself no longer slides away on scroll-down — only the
        // centered link list (Zone 2, below) does. Logo and CTA fade/stay per
        // their own rules (see below); nothing about the bar's own background
        // changes with scroll any more.
      }}
      className="kloaq-nav-wrapper"
      data-nav-theme={onLightBg ? "light-bg" : undefined}
    >

      {/* Fades out once scrolled — a wordmark pinned atop the now-opaque bar
          read as a distracting fixed watermark rather than a nav element.
          Same opacity/pointer-events gate as the centered links (below), so
          logo and links appear/disappear together at the scroll threshold;
          only the CTA (Zone 3) stays visible at every scroll position. */}
      <a
        href="/"
        style={{
          fontFamily: "'Boldonse', 'Anton', 'Sohne Breit', sans-serif",
          fontSize: "1.5rem",
          fontWeight: 400,
          color: onLightBg ? "var(--black)" : "var(--off-white)",
          textDecoration: "none",
          letterSpacing: "0.02em",
          textTransform: "none",
          opacity: scrolled ? 0 : 1,
          transition: "opacity 0.35s ease",
          // Re-enable hit-testing: the bar sets pointer-events:none. Once
          // faded out, opt back OUT so a scrolled-but-still-fading logo can't
          // steal clicks meant for whatever's now underneath it.
          pointerEvents: scrolled ? "none" : "auto",
        }}
      >
        freddi<span style={{ color: "var(--orange)" }}>.</span>
      </a>

      {/* Zone 2 — the centered link group. The CTA is NOT in here anymore: it
          lives in its own right-hand zone, so these three links center on the
          viewport rather than on "links + button". This is now the ONLY part
          of the bar that hides on scroll-down — logo and CTA (below) stay
          pinned at all times, so the wordmark and "Let's Talk" are always
          reachable regardless of scroll direction. */}
      <ul
        className="kloaq-nav-links"
        style={{
          gap: "40px",
          listStyle: "none",
          alignItems: "center",
          justifyContent: "center",
          opacity: hidden && !open ? 0 : 1,
          transform: hidden && !open ? "translateY(-12px)" : "translateY(0)",
          transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
          pointerEvents: hidden && !open ? "none" : undefined,
        }}
      >
        {/* pointer-events is set per <li>, NOT on the <ul>: the list is a wide
            flex row whose 40px gaps are dead space. Making the <ul> clickable
            would just recreate a smaller invisible click-eater over whatever
            sits beneath it. Each <li> tracks the same hidden/open gate as the
            <ul>'s own opacity, so a faded-out link can't still be tabbed to
            or clicked through. */}
        {MENU_ITEMS.map((item) => (
          <li key={item.label} style={{ pointerEvents: hidden && !open ? "none" : "auto" }}>
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
            from "View All Works" or the Manifesto CTA. kloaq-nav-cta-btn is an
            ADDITIONAL class, scoped to just this button, that swaps its type
            to Boldonse (matching the mobile menu's identical CTA) without
            touching .btn/.btn-accent's shared Inter Tight everywhere else. */}
        <button
          type="button"
          className="btn btn-accent kloaq-nav-cta-btn"
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
          width: "22px", height: "1px", background: onLightBg ? "var(--black)" : "var(--off-white)", display: "block",
          position: "absolute", top: open ? "7px" : "0px",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          transition: "top 0.25s, transform 0.25s",
        }} />
        <span style={{
          width: "14px", height: "1px", background: onLightBg ? "var(--black)" : "var(--off-white)", display: "block",
          position: "absolute", top: "7px",
          opacity: open ? 0 : 1,
          transition: "opacity 0.2s",
        }} />
        <span style={{
          width: "22px", height: "1px", background: onLightBg ? "var(--black)" : "var(--off-white)", display: "block",
          position: "absolute", top: open ? "7px" : "14px",
          transform: open ? "rotate(-45deg)" : "rotate(0deg)",
          transition: "top 0.25s, transform 0.25s",
        }} />
      </div>

    </nav>
    </>
  );
}
