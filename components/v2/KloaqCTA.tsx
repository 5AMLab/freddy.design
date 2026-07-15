"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";
import Magnetic from "@/components/motion/Magnetic";
import { openBrief } from "@/components/v2/BriefFlow";

gsap.registerPlugin(ScrollTrigger);

// CTA for the homepage and /kloaq. Flameburst orange accent throughout, and
// headline/watermark use Boldonse (the same display face as the word cloud)
// so the page stays on its two-typeface system (Boldonse + Inter Tight).
// Resolves to the brand accent token (globals.css :root --orange). Never
// hardcode the hex — see the palette block there.
const ORANGE = "var(--orange)";

export default function KloaqCTA() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".kloaq-cta-watermark",
        { x: 120 },
        {
          x: -60,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cta"
      ref={ref}
      className="cta-v2-section kloaq-cta-section kloaq-light-section"
      style={{ background: "var(--off-white)", position: "relative" }}
    >
      {/* Background large type */}
      <div
        className="kloaq-cta-watermark"
        style={{
          position: "absolute",
          bottom: "-20px",
          right: "-20px",
          fontFamily: "'Boldonse', 'Anton', sans-serif",
          fontSize: "clamp(6rem, 15vw, 16rem)",
          fontWeight: 400,
          textTransform: "uppercase",
          color: "rgba(5,5,5,0.06)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        Let&apos;s talk
      </div>

      <div
        className="cta-v2-inner kloaq-cta-inner"
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        <div className="kloaq-cta-copy">
          <div className="kloaq-vlabel" style={{ marginBottom: "24px" }}>
            Start a Conversation
          </div>
          <h2
            style={{
              fontFamily: "'Boldonse', 'Anton', sans-serif",
              fontSize: "clamp(1.8rem, 3.2vw, 3rem)",
              fontWeight: 400,
              textTransform: "uppercase",
              lineHeight: 1.4,
              color: "var(--black)",
              marginBottom: "20px",
            }}
          >
            Ready to have a designer
            <br />
            <em style={{ color: ORANGE, fontStyle: "normal" }}>on speed dial?</em>
          </h2>
          <p
            style={{
              fontFamily: "'Inter Tight', 'Sohne', sans-serif",
              fontSize: "1.35rem",
              fontWeight: 400,
              lineHeight: 1.6,
              color: "var(--black)",
              maxWidth: "440px",
            }}
          >
            No contracts. No overhead. Just great design, whenever you need it.
          </p>
        </div>

        <div className="kloaq-cta-action">
          {/* .kloaq-cta-btn is the site's one shared button shape (kloaq.css,
              aliased to .btn.btn-accent) — this used to override it entirely
              with its own inline style (700 weight, 0.82rem all-caps, 10px
              radius), the fourth divergent button shape on the site. */}
          <Magnetic>
          <button className="kloaq-cta-btn" onClick={openBrief}>
            Brief Me in 20 Seconds
          </button>
          </Magnetic>
          {/* The "N of M retainer slots open" scarcity line was removed here:
              it already appears in the hero strip and the footer Availability
              block, and a third instance directly under the primary CTA button
              read as boilerplate rather than a live constraint. The button is
              the one clear action; nothing competes with it now. */}
        </div>
      </div>
    </section>
  );
}
