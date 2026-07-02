"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

/**
 * Page-wide custom cursor for /kloaq: a solid orange dot (no mix-blend-mode)
 * that tracks the mouse across the whole page, not just the Cases section.
 * Solid color instead of the live site's difference-blend trick — this page
 * alternates dark and near-white (.kloaq-light-section) backgrounds, and a
 * blend-mode dot risks washing out against near-white fills there; a flat
 * --orange dot stays visible regardless of what's underneath.
 *
 * Pulses larger over links/buttons (reference: the live site's Cursor.tsx
 * link/view states), and larger still while a Cases row is active — that
 * hand-off is via the `data-cursor-scale` attribute KloaqCases sets on
 * <body>, since the pulse trigger (hover on a project name) lives inside a
 * different component than this cursor.
 *
 * Fine-pointer + motion-allowed only, same gating as the rest of the page's
 * cursor-follow effects (KloaqCases' thumb trail, ServicesV2's preview).
 */
export default function KloaqCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !dotRef.current) return;
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
      if (t.closest(".kloaq-case, .kloaq-service-row, .kloaq-industry-item")) setScale(3);
      else if (t.closest("a, button, [role='button']")) setScale(1.8);
      else setScale(1);
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
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !dotRef.current) return;
    gsap.to(dotRef.current, { scale, duration: 0.2, ease: "power2.out" });
  }, [scale, enabled]);

  if (!enabled) return null;

  return <div ref={dotRef} className="kloaq-page-cursor" aria-hidden />;
}
