"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Motion tokens — see MOTION.md
export const EASE_OUT_LUXE = "expo.out";

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

    // (The former `.v2-fade` batch was removed: it was a single batch built
    // once at this provider's mount and never saw elements mounted by a later
    // client navigation, so the /work index — the only .v2-fade user — was left
    // blank when entered via project → "All work". WorkIndex now owns its own
    // entrance with visible-by-default markup; see components/v2/WorkIndex.tsx.
    // Don't reintroduce a mount-time batch for content that mounts per-route.)

    // .fade-up used to rise 24px + fade in via ScrollTrigger.batch's onEnter,
    // same as .reveal-line below. Removed for the same reason: the markup is
    // visible by default (no CSS hiding), so onEnter's gsap.from() had to
    // synchronously snap it to hidden and rise it back — a visible flicker
    // whenever the batch's trigger fired soon after mount (section already
    // near/in view at load, or trigger math gone stale once images below it
    // finished decoding and shifted layout). Labels, copy, CTAs and list rows
    // now render in their final position immediately. .fade-up markup is kept
    // on elements (harmless, just no longer animated) rather than stripped
    // from every file that uses it.

    // .reveal-line used to rise from behind its mask on scroll (gsap.from +
    // ScrollTrigger). Removed: on this page, section headlines are what the
    // user scrolls down to read, and a ~0.7-1.1s delay before the title is
    // legible reads as slow rather than polished — worse, images finishing
    // decode after mount could shift trigger positions and fire the reveal
    // at the wrong offset, which read as a flicker. Titles now render in
    // their final position immediately; .line-mask/.line markup is kept
    // (harmless, just no longer animated) rather than ripped out everywhere
    // it's used. The hero's own entrance (HeroInlineV6) is unrelated — it's
    // gated on the preloader finishing, not scroll, so it never had this
    // problem and is untouched.

    // mask-scale vocabulary: media settles from 1.12 inside its clipped frame.
    // clearProps matters here beyond the usual "don't leave inline styles
    // around" reason: in dev, StrictMode mounts this effect, tears it down,
    // then mounts it again. gsap.from() renders its FROM state (scale:1.12)
    // synchronously the instant it's created — before the discarded mount's
    // ScrollTrigger ever gets a chance to run and reverse it — so without
    // clearProps that render is the last thing to touch the element's inline
    // transform. The real (second) mount then creates an identical tween on
    // top of that same stale inline style and the media never visibly moves.
    const media = gsap.utils.toArray<HTMLElement>(".mask-scale-media");
    media.forEach((el) => {
      gsap.from(el, {
        scale: 1.12,
        duration: 1.4,
        ease: EASE_OUT_LUXE,
        clearProps: "transform",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
    });

    ScrollTrigger.refresh();

    // Images (case study thumbnails, hero media) finish decoding after this
    // first refresh and shift section positions further down the page —
    // trigger points computed above go stale, so a reveal can fire at the
    // wrong scroll offset (read as a flicker/jump, worse the further down
    // the page a section sits). Re-refresh once everything has settled.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(raf);
      lenis.destroy();
      activeLenis = null;
      ScrollTrigger.getAll().forEach((st) => st.kill());
      // Undo the synchronous FROM-state render above so a StrictMode-
      // discarded mount never leaves media stuck mid-animation for the real
      // mount to inherit (see the .mask-scale-media comment above).
      gsap.set(media, { clearProps: "all" });
    };
  }, []);

  return <>{children}</>;
}
