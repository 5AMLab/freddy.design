"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

const REEL_SRC = "/portfolio/hero-reel.mp4";

// Hero showreel. A clipped, muted, looping preview lives in the hero's right
// column (mask-scale on entry, MOTION.md); clicking it opens a full-screen
// lightbox with sound. Type stays the opener — the reel is the payoff.
export default function HeroReel() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const previewRef = useRef<HTMLVideoElement>(null);
  const fullRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const openReel = useCallback(() => setOpen(true), []);
  const closeReel = useCallback(() => setOpen(false), []);

  // portal target only exists in the browser
  useEffect(() => setMounted(true), []);

  // esc to close + scroll lock + hand off playback from preview to full player
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeReel();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (fullRef.current) {
      // resume from where the muted preview is for a seamless cut
      if (previewRef.current) {
        fullRef.current.currentTime = previewRef.current.currentTime;
      }
      fullRef.current.muted = false;
      fullRef.current.play().catch(() => {
        // autoplay-with-sound can be blocked; fall back to muted playback
        if (fullRef.current) {
          fullRef.current.muted = true;
          fullRef.current.play().catch(() => {});
        }
      });
    }

    if (!prefersReducedMotion() && overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      fullRef.current?.pause();
    };
  }, [open, closeReel]);

  return (
    <>
      {/* Preview card */}
      <button
        type="button"
        onClick={openReel}
        aria-label="Play showreel"
        className="hero-reel-card"
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          aspectRatio: "16 / 9",
          padding: 0,
          border: "1px solid rgba(201,169,110,0.25)",
          borderRadius: "2px",
          overflow: "hidden",
          cursor: "pointer",
          background: "#0D0D0D",
        }}
      >
        <video
          ref={previewRef}
          src={REEL_SRC}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* legibility scrim + play affordance */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(13,13,13,0.55), rgba(13,13,13,0) 55%)",
            pointerEvents: "none",
          }}
        />
        <span
          className="hero-reel-cue"
          style={{
            position: "absolute",
            left: "16px",
            bottom: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "rgba(245,240,232,0.92)",
            }}
          >
            <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden>
              <path d="M0 0L10 6L0 12Z" fill="#0D0D0D" />
            </svg>
          </span>
          <span
            style={{
              fontFamily: "'Sohne', sans-serif",
              fontSize: "0.66rem",
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#F5F0E8",
            }}
          >
            Watch the reel
          </span>
        </span>
      </button>

      {/* Full-screen lightbox — portalled to <body> so it escapes the hero's
          transformed ancestor (GSAP entrance), which would otherwise contain
          the position:fixed overlay inside the right column. */}
      {open &&
        mounted &&
        createPortal(
          <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Showreel"
            onClick={closeReel}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1500,
            background: "rgba(13,13,13,0.96)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(20px, 5vw, 64px)",
          }}
        >
          <button
            type="button"
            onClick={closeReel}
            aria-label="Close"
            style={{
              position: "absolute",
              top: "clamp(20px, 4vw, 40px)",
              right: "clamp(20px, 4vw, 40px)",
              background: "none",
              border: "1px solid rgba(201,169,110,0.35)",
              borderRadius: "2px",
              color: "rgba(245,240,232,0.7)",
              fontFamily: "'Sohne', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "10px 18px",
              cursor: "pointer",
              zIndex: 1,
            }}
          >
            Close · Esc
          </button>
          <video
            ref={fullRef}
            src={REEL_SRC}
            controls
            loop
            playsInline
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              borderRadius: "2px",
              boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
            }}
          />
          </div>,
          document.body
        )}
    </>
  );
}
