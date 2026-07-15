"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

/**
 * Site-wide custom cursor: a solid orange dot (no mix-blend-mode) that
 * tracks the mouse everywhere — mounted once in the root layout instead of
 * per-page, so every route shares one cursor language instead of drifting
 * (this used to be two separate components: a hollow ring for the live site
 * and this solid dot for /kloaq — same brand, different hover states/colors
 * depending which page you were on).
 *
 * Solid color instead of a difference-blend trick — pages alternate dark and
 * near-white (.kloaq-light-section) fills, and a blend-mode dot risks
 * washing out against near-white backgrounds; a flat --orange dot stays
 * visible regardless of what's underneath.
 *
 * Four modes, same vocabulary across every page:
 *  - default: resting 14px dot
 *  - link (a, button, [role="button"], [data-cursor="link"]): 1.8x dot
 *  - view ([data-cursor="view"], e.g. portfolio thumbnails, the next-project
 *    link): dot grows into a 64px solid badge with a "View" label — sized via
 *    width/height rather than `scale` so the label stays crisp instead of
 *    stretching with the dot.
 *  - pulse (.kloaq-case, .kloaq-service-row, .kloaq-industry-item — Kloaq's
 *    cloud/row hover targets): 3x dot, no label.
 *
 * Fine-pointer + motion-allowed only; component bails out entirely otherwise
 * so touch/reduced-motion visitors keep the system cursor (see
 * html.has-custom-cursor in globals.css, which hides it and restores
 * `cursor: auto`).
 */
export default function KloaqCursor({ suppressOnKloaq = false }: { suppressOnKloaq?: boolean }) {
  const pathname = usePathname();
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<"default" | "link" | "view" | "pulse">("default");

  // app/kloaq/page.tsx mounts its own instance of this component directly
  // (it's the read-only reference page). The root layout's global instance
  // passes suppressOnKloaq so it bails there instead — otherwise both would
  // mount on /kloaq and double up (two dots tracking the mouse).
  const suppressed = suppressOnKloaq && pathname === "/kloaq";

  useEffect(() => {
    if (suppressed) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
  }, [suppressed]);

  useEffect(() => {
    if (suppressed || !enabled || !dotRef.current) return;
    const dot = dotRef.current;
    document.documentElement.classList.add("has-custom-cursor");

    const dotX = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest(".kloaq-case, .kloaq-service-row, .kloaq-industry-item, .v4-noun")) setMode("pulse");
      else if (t.closest('[data-cursor="view"]')) setMode("view");
      else if (t.closest("a, button, [role='button'], [data-cursor='link']")) setMode("link");
      else setMode("default");
    };

    const onLeave = () => gsap.to(dot, { opacity: 0, duration: 0.2 });
    const onEnter = () => gsap.to(dot, { opacity: 1, duration: 0.2 });

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled, suppressed]);

  useEffect(() => {
    if (!enabled || !dotRef.current) return;
    // "view" grows via width/height (not `scale`) so its "View" label renders
    // at a fixed, crisp font-size instead of stretching with the dot.
    if (mode === "view") {
      gsap.to(dotRef.current, { scale: 1, width: 64, height: 64, duration: 0.3, ease: "power3.out" });
    } else {
      const scale = mode === "pulse" ? 3 : mode === "link" ? 1.8 : 1;
      gsap.to(dotRef.current, { width: 14, height: 14, scale, duration: 0.25, ease: "power3.out" });
    }
  }, [mode, enabled]);

  if (!enabled || suppressed) return null;

  return (
    <div ref={dotRef} className="kloaq-page-cursor" aria-hidden>
      <span className="kloaq-page-cursor-label" style={{ opacity: mode === "view" ? 1 : 0 }}>
        View
      </span>
    </div>
  );
}
