"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { openBrief } from "@/components/v2/BriefFlow";
import { projects, getProject } from "@/lib/work";

// Bottom tab bar, mobile only (hidden ≥769px via CSS — see kloaq.css).
// Skipped on the homepage: the hero there is the primary nav surface
// ([ SERVICES ] column), a persistent bottom bar would compete with it.
// Reuses the SAME scroll-direction rule as KloaqNavbar (hide on scroll-down,
// reveal on scroll-up) but keeps its own hidden/scrolled state — the two
// bars must not read each other's state, or fast scroll direction changes
// could fight and desync them.
export default function KloaqMobileTabbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const doc = document.documentElement;
      const atBottom = y + window.innerHeight >= doc.scrollHeight - 4;
      // Same 40px dead-zone as the top bar, PLUS always-visible at the very
      // bottom — a footer CTA sitting right where this bar would hide itself
      // is the one place "hide on scroll-down" actively works against the
      // user, so pin it open there regardless of direction.
      setHidden(y > 40 && y > lastY.current && !atBottom);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (onHome) return null;

  // Case-study pages get Prev/Next in place of the plain "All Work" slot;
  // every other page (About, Pricing, /work index, legal, /kloaq, 404) gets
  // Home / All Work / Talk — three items, centered, no dead slot.
  const slugMatch = pathname?.match(/^\/work\/([^/]+)$/);
  const current = slugMatch ? getProject(slugMatch[1]) : undefined;
  const index = current ? projects.findIndex((p) => p.slug === current.slug) : -1;
  const prev = index >= 0 ? projects[(index - 1 + projects.length) % projects.length] : undefined;
  const next = index >= 0 ? projects[(index + 1) % projects.length] : undefined;

  return (
    <nav
      aria-label="Mobile"
      className="kloaq-tabbar"
      style={{
        transform: hidden ? "translateY(100%)" : "translateY(0)",
        opacity: hidden ? 0 : 1,
        transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease",
      }}
    >
      <a href="/" className="kloaq-tabbar-item">
        Home
      </a>

      {current ? (
        <>
          <a href={`/work/${prev!.slug}`} className="kloaq-tabbar-item">
            Prev
          </a>
          <a href={`/work/${next!.slug}`} className="kloaq-tabbar-item">
            Next
          </a>
        </>
      ) : (
        <a href="/work" className="kloaq-tabbar-item">
          All Work
        </a>
      )}

      <button type="button" className="kloaq-tabbar-item kloaq-tabbar-cta" onClick={() => openBrief()}>
        Talk
      </button>
    </nav>
  );
}
