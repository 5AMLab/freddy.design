"use client";
import { getLenis } from "@/components/motion/MotionProvider";

// "Back to top" control, placed inline in the footer. Drives the scroll through
// the live Lenis instance so it doesn't fight Lenis's animated value (see the
// getLenis note in MotionProvider). Falls back to native scrollTo when Lenis
// isn't running (e.g. prefers-reduced-motion).
export default function BackToTop() {
  const scrollTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Back to top"
      className="back-to-top"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 19V5M12 5l-6 6M12 5l6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
