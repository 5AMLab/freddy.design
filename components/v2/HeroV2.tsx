"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";
import { PRELOADER_DONE_EVENT } from "@/components/motion/Preloader";
import Magnetic from "@/components/motion/Magnetic";
import HeroDistortion from "@/components/motion/HeroDistortion";
import { openBrief } from "@/components/v2/BriefFlow";
import { RETAINER_SLOTS } from "@/lib/site";
import HeroReel from "@/components/v2/HeroReel";

gsap.registerPlugin(ScrollTrigger);

export default function HeroV2() {
  const ref = useRef<HTMLElement>(null);

  // Entrance choreography (MOTION.md): label → headline lines → body → CTA
  // → credibility column → scroll indicator. Plays once, after the preloader
  // hands off.
  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;
    const q = gsap.utils.selector(ref.current);
    let tl: gsap.core.Timeline | undefined;

    const begin = () => {
      tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(q(".hero-el-label"), { opacity: 1, y: 0, duration: 0.9 }, 0.1)
        .fromTo(
          q(".hero-v2-h1 .line"),
          // y: 0 clears the CSS translateY(110%) fallback, which GSAP would
          // otherwise keep as a resolved px base offset under yPercent
          { yPercent: 110, y: 0 },
          { yPercent: 0, duration: 1.1, stagger: 0.12 },
          0.2
        )
        .to(q(".hero-el-body"), { opacity: 1, y: 0, duration: 0.9 }, 0.7)
        .to(q(".hero-el-cta"), { opacity: 1, y: 0, duration: 0.9 }, 0.85)
        .to(q(".hero-el-aside"), { opacity: 1, y: 0, duration: 0.9 }, 1.0)
        .to(q(".hero-el-scroll"), { opacity: 1, y: 0, duration: 0.9 }, 1.2);
    };

    if (document.documentElement.dataset.preloaderDone) begin();
    else window.addEventListener(PRELOADER_DONE_EVENT, begin, { once: true });

    // drift (MOTION.md): on scroll-out the copy rises slightly faster than
    // the page, the credibility column slightly slower
    const drift = gsap.context(() => {
      gsap.to(q(".hero-v2-grid > div:first-child"), {
        y: -64,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(q(".hero-v2-grid > div:last-child"), {
        y: -28,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, ref);

    return () => {
      window.removeEventListener(PRELOADER_DONE_EVENT, begin);
      tl?.kill();
      drift.revert();
    };
  }, []);

  return (
    <>
      <section
        ref={ref}
        className="hero-v2-section"
        style={{
          minHeight: "100vh",
          background: "#0D0D0D",
          padding: "160px 72px 100px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="hero-v2-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "end",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Left: Main copy */}
          <div>
            <div className="hero-el hero-el-label hero-v2-label" style={{ marginBottom: "32px" }}>
              Your Dedicated Design Partner
            </div>

            <h1 className="hero-v2-h1" style={{ marginBottom: "36px" }}>
              <span className="line-mask">
                <span className="line">Great design.</span>
              </span>
              <span className="line-mask">
                <span className="line">
                  <em>On demand.</em>
                </span>
              </span>
              <span className="line-mask">
                <span className="line">No drama.</span>
              </span>
            </h1>

            <p
              className="hero-el hero-el-body"
              style={{
                fontFamily: "'Sohne', sans-serif",
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "rgba(245,240,232,0.70)",
                maxWidth: "440px",
                marginBottom: "48px",
                fontWeight: 400,
              }}
            >
              Skip the overhead of a full-time hire. A dedicated designer on speed dial —
              fast turnarounds, direct line, always on brand.
            </p>

            <div
              className="hero-el hero-el-cta"
              style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}
            >
              <Magnetic>
              <button
                onClick={openBrief}
                style={{
                  fontFamily: "'Sohne', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#0D0D0D",
                  background: "#C9A96E",
                  border: "none",
                  cursor: "pointer",
                  padding: "16px 36px",
                  borderRadius: "2px",
                  transition: "opacity 0.2s, transform 0.2s",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.opacity = "0.85";
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.opacity = "1";
                  el.style.transform = "translateY(0)";
                }}
              >
                Brief Me in 20 Seconds
              </button>
              </Magnetic>
              <a
                href="#pricing"
                style={{
                  fontFamily: "'Sohne', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(245,240,232,0.6)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(201,169,110,0.3)",
                  paddingBottom: "3px",
                  transition: "color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "#C9A96E";
                  el.style.borderColor = "#C9A96E";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "rgba(245,240,232,0.6)";
                  el.style.borderColor = "rgba(201,169,110,0.3)";
                }}
              >
                See Retainer Plans
              </a>
            </div>
          </div>

          {/* Right: Stats / credibility block */}
          <div
            className="hero-el hero-el-aside"
            style={{
              borderLeft: "1px solid rgba(201,169,110,0.2)",
              paddingLeft: "60px",
              display: "flex",
              flexDirection: "column",
              gap: "40px",
            }}
          >
            {/* Showreel */}
            <HeroReel />

            {/* Status */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#4ade80",
                  display: "inline-block",
                  boxShadow: "0 0 8px rgba(74,222,128,0.6)",
                }}
              />
              <span
                style={{
                  fontFamily: "'Sohne', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 400,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(245,240,232,0.4)",
                }}
              >
                <span style={{ color: "#C9A96E" }}>
                  {RETAINER_SLOTS.open} of {RETAINER_SLOTS.total} retainer slots
                </span>{" "}
                left for {RETAINER_SLOTS.month}
              </span>
            </div>

            {/* Stats */}
            <div className="hero-v2-stat-row" style={{ display: "flex", gap: "48px" }}>
              {[
                { val: "48hr", label: "Turnaround" },
                { val: "6+", label: "Years experience" },
                { val: "∞", label: "Revisions" },
              ].map(({ val, label }) => (
                <div key={label}>
                  <div
                    style={{
                      fontFamily: "'Canela', serif",
                      fontSize: "2.8rem",
                      fontWeight: 300,
                      color: "#F5F0E8",
                      lineHeight: 1,
                      marginBottom: "6px",
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Sohne', sans-serif",
                      fontSize: "0.68rem",
                      fontWeight: 400,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(245,240,232,0.5)",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Intro quote */}
            <div
              style={{
                borderTop: "1px solid rgba(201,169,110,0.12)",
                paddingTop: "32px",
              }}
            >
              <p
                style={{
                  fontFamily: "'Canela', serif",
                  fontSize: "1.25rem",
                  fontStyle: "italic",
                  fontWeight: 300,
                  lineHeight: 1.65,
                  color: "rgba(245,240,232,0.65)",
                  marginBottom: "16px",
                }}
              >
                &ldquo;Think of me as your in-house designer — minus the salary,
                CPF, and annual leave headaches.&rdquo;
              </p>
              <div
                style={{
                  fontFamily: "'Sohne', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#C9A96E",
                }}
              >
                — Freddy, Founder
              </div>
            </div>
          </div>
        </div>

        <HeroDistortion heroRef={ref} />

        {/* Bottom scroll indicator */}
        <div
          className="hero-el hero-el-scroll hero-v2-scroll-indicator"
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "rgba(201,169,110,0.4)",
            }}
          />
          <span
            style={{
              fontFamily: "'Sohne', sans-serif",
              fontSize: "0.66rem",
              fontWeight: 400,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(245,240,232,0.3)",
            }}
          >
            Scroll
          </span>
        </div>
      </section>
    </>
  );
}
