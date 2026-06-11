"use client";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

const BASE_SPEED = 60; // px/s at rest
const VELOCITY_BOOST = 0.12; // extra px/s per px/s of scroll velocity
const MAX_BOOST = 420;

export default function MarqueeV2() {
  const trackRef = useRef<HTMLDivElement>(null);

  // drift (MOTION.md): the marquee creeps at rest and accelerates with
  // scroll velocity, settling back as the page comes to rest.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return;

    let x = 0;
    let lastY = window.scrollY;
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const y = window.scrollY;
      const velocity = dt > 0 ? Math.abs(y - lastY) / dt : 0;
      lastY = y;

      const boost = Math.min(velocity * VELOCITY_BOOST, MAX_BOOST);
      x -= (BASE_SPEED + boost) * dt;

      // Track holds two identical sets separated by the 28px flex gap; the
      // repeat period is one set plus one gap, so wrapping there lands on an
      // identical visual state with no seam.
      const period = (track.scrollWidth + 28) / 2;
      if (period > 14 && -x >= period) x += period;

      track.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const items = [
    "Presentation Decks",
    "Social Content",
    "Restaurant Menus",
    "Brand Campaigns",
    "Marketplace Banners",
    "Event Identity",
    "Poster & Ad Design",
    "Hero Campaign Images",
  ];

  const renderSet = (prefix: string) =>
    items.flatMap((item, i) => [
      <span
        key={`${prefix}-d-${i}`}
        aria-hidden
        style={{ color: "rgba(201,169,110,0.5)", fontSize: "0.5rem", flexShrink: 0 }}
      >
        ◆
      </span>,
      <span
        key={`${prefix}-t-${i}`}
        style={{
          fontFamily: "'Canela', serif",
          fontSize: "0.95rem",
          fontStyle: "italic",
          fontWeight: 300,
          color: "rgba(245,240,232,0.35)",
          whiteSpace: "nowrap",
          letterSpacing: "0.05em",
        }}
      >
        {item}
      </span>,
    ]);

  return (
    <div
      style={{
        background: "#0D0D0D",
        padding: "20px 0",
        overflow: "hidden",
        borderTop: "1px solid rgba(201,169,110,0.15)",
        borderBottom: "1px solid rgba(201,169,110,0.15)",
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "28px",
          width: "max-content",
          willChange: "transform",
        }}
      >
        {[...renderSet("a"), ...renderSet("b")]}
      </div>
    </div>
  );
}
