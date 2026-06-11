"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

// Magnetic hover: the child drifts up to `strength` px toward the cursor
// while hovered and springs back on leave. Fine pointers only.
export default function Magnetic({
  children,
  strength = 12,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const relX = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const relY = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
}
