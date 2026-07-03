"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Motion tokens — see MOTION.md
export const EASE_OUT_LUXE = "expo.out";
export const DUR_REVEAL = 1.1;
export const DUR_FADE = 0.9;
export const STAGGER_ITEM = 0.1;

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// The live Lenis instance, for components that must drive scroll through it.
// Programmatic scrolls (ScrollTrigger snap tweens, window.scrollTo) fight
// Lenis's own animated value and can spiral — anything that moves the scroll
// position must go through lenis.scrollTo instead. Null while unmounted or
// under prefers-reduced-motion (no Lenis runs at all then).
let activeLenis: Lenis | null = null;
export function getLenis() {
  return activeLenis;
}

export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      document.documentElement.classList.add("reduced-motion");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    activeLenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // fade-up vocabulary: batched, staggered, plays once
    const fades = gsap.utils.toArray<HTMLElement>(".v2-fade");
    gsap.set(fades, { opacity: 0, y: 24 });
    ScrollTrigger.batch(fades, {
      start: "top 88%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: DUR_FADE,
          ease: EASE_OUT_LUXE,
          stagger: STAGGER_ITEM,
          overwrite: true,
        }),
    });

    // line reveal vocabulary: section headlines rise from behind a mask
    const lines = gsap.utils.toArray<HTMLElement>(".reveal-line .line");
    lines.forEach((line) => {
      gsap.from(line, {
        yPercent: 110,
        duration: DUR_REVEAL,
        ease: EASE_OUT_LUXE,
        scrollTrigger: { trigger: line, start: "top 88%", once: true },
      });
    });

    // mask-scale vocabulary: media settles from 1.12 inside its clipped frame
    const media = gsap.utils.toArray<HTMLElement>(".mask-scale-media");
    media.forEach((el) => {
      gsap.from(el, {
        scale: 1.12,
        duration: 1.4,
        ease: EASE_OUT_LUXE,
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
    });

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      activeLenis = null;
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return <>{children}</>;
}
