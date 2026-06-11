"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

// Custom cursor: gold dot + trailing ring. The ring grows into a "View"
// badge over [data-cursor="view"] targets and swells slightly over links
// and buttons. Fine pointers only; never rendered for touch or reduced
// motion.
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<"default" | "link" | "view">("default");

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !dotRef.current || !ringRef.current) return;
    document.documentElement.classList.add("has-custom-cursor");

    const dotX = gsap.quickTo(dotRef.current, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dotRef.current, "y", { duration: 0.12, ease: "power2.out" });
    const ringX = gsap.quickTo(ringRef.current, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ringRef.current, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('[data-cursor="view"]')) setMode("view");
      else if (t.closest("a, button, [role='button'], [data-cursor='link']")) setMode("link");
      else setMode("default");
    };

    const onLeave = () => gsap.to([dotRef.current, ringRef.current], { opacity: 0, duration: 0.2 });
    const onEnter = () => gsap.to([dotRef.current, ringRef.current], { opacity: 1, duration: 0.2 });

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
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !ringRef.current || !dotRef.current) return;
    const size = mode === "view" ? 72 : mode === "link" ? 48 : 32;
    gsap.to(ringRef.current, {
      width: size,
      height: size,
      backgroundColor: mode === "view" ? "rgba(201,169,110,0.95)" : "rgba(201,169,110,0)",
      borderColor: mode === "view" ? "rgba(201,169,110,0)" : "rgba(201,169,110,0.45)",
      duration: 0.3,
      ease: "power3.out",
    });
    gsap.to(dotRef.current, { opacity: mode === "view" ? 0 : 1, duration: 0.2 });
  }, [mode, enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden>
        <span className="cursor-ring-label" style={{ opacity: mode === "view" ? 1 : 0 }}>
          View
        </span>
      </div>
    </>
  );
}
