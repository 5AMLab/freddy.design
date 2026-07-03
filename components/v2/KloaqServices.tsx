"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";

// "What I Do" — the homepage's and /kloaq's services section. Row layout:
// num+title | corner marks (image lives in a single cursor-trailing preview,
// not per-row) | description + tags. The preview follows the mouse across
// the section, crossfading between images as the active row changes.
//
// Coarse pointers (touch) get an accordion fallback: tapping a row toggles
// it active (same `active` state hover already drives) and reveals a fixed
// inline image beneath its description — the cursor-trailing preview is
// hidden there since there's no cursor to trail.
const services = [
  {
    num: "01",
    title: "Brand & Visual Identity",
    desc: "We craft identities that capture your essence and set the foundation for your audience experiences.",
    tags: ["Branding", "Art Direction", "Visual Systems"],
    img: "/portfolio/brand-guideline-01.jpg",
  },
  {
    num: "02",
    title: "Web Design & Development",
    desc: "We design and build high-performing websites that feel refined, intuitive, and engineered for long-term growth.",
    tags: ["Web Design", "Webflow Dev", "UX/UI"],
    img: "/portfolio/deck-generic-01.jpg",
  },
  {
    num: "03",
    title: "Creative Direction",
    desc: "We guide the visual language of your brand through storytelling, imagery, and cohesive creative vision.",
    tags: ["Storytelling", "Art Direction"],
    img: "/portfolio/ooh-generic-01.jpg",
  },
  {
    num: "04",
    title: "Print & Collateral",
    desc: "Menus, brochures, event materials, packaging mockups and more — print-ready files delivered clean and accurate every time.",
    tags: ["Print", "Packaging"],
    img: "/portfolio/coffee-mockup-01.jpg",
  },
];

function ServiceRow({
  service,
  hovered,
  onHoverChange,
  onToggle,
}: {
  service: (typeof services)[0];
  hovered: boolean;
  onHoverChange: (hovered: boolean) => void;
  onToggle: () => void;
}) {
  const isFine = () => window.matchMedia("(pointer: fine)").matches;

  return (
    <div
      className={`kloaq-service-row${hovered ? " is-active" : ""}`}
      onMouseEnter={() => {
        if (isFine()) onHoverChange(true);
      }}
      onMouseLeave={() => {
        if (isFine()) onHoverChange(false);
      }}
      onClick={() => {
        if (isFine()) return;
        // Delegate to a functional state update in the parent keyed by this
        // row's index — never reads a possibly-stale `hovered` snapshot, so a
        // tap that lands mid-reflow can't toggle the wrong row.
        onToggle();
      }}
    >
      <span className={`kloaq-service-num${hovered ? " is-active" : ""}`}>
        [{service.num}]
      </span>

      <span className="kloaq-service-title">
        {service.title}
        {/* Touch-only affordance: fine pointers reveal the image on hover, but
            touch users have no cue that tapping does anything. This inline arrow
            (hidden on fine pointers via CSS) signals the row is interactive —
            a 45° down-right arrow to view, rotating to up-right once open. */}
        <span className={`kloaq-service-taphint${hovered ? " is-active" : ""}`} aria-hidden="true">
          <svg viewBox="0 0 16 16" className="kloaq-service-taphint-arrow">
            <path
              d="M4 4h8v8M12 4L4 12"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>

      {/* Corner marks only — the image itself lives in the cursor-trailing
          preview at the section level, not fixed in this slot. Marks idle
          in lockstep with a step-pause-step rotation and brighten on hover.
          Drawn as SVGs on an identical 16x16 viewBox (not text glyphs) so
          "+" and "x" share the exact same box and rotate around the same
          center — a font's +/× glyphs differ in metrics and drift off-axis
          when rotated. */}
      <div className="kloaq-service-imgslot">
        <svg
          className={`kloaq-service-mark${hovered ? " is-active" : ""}`}
          viewBox="0 0 16 16"
          aria-hidden
        >
          <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        <svg
          className={`kloaq-service-mark${hovered ? " is-active" : ""}`}
          viewBox="0 0 16 16"
          aria-hidden
        >
          <path
            d="M2.5 2.5l11 11M13.5 2.5l-11 11"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
        <svg
          className={`kloaq-service-mark${hovered ? " is-active" : ""}`}
          viewBox="0 0 16 16"
          aria-hidden
        >
          <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </div>

      <div className="kloaq-service-copy">
        <p className="kloaq-service-desc">{service.desc}</p>
        {service.tags.length > 0 && (
          <div className={`kloaq-service-tags${hovered ? " is-active" : ""}`}>
            {service.tags.map((t) => (
              <span key={t} className="kloaq-service-tag">
                [{t.toUpperCase()}]
              </span>
            ))}
          </div>
        )}
        {/* Touch-only accordion image — desktop's cursor-trailing preview
            has no touch equivalent, so tapping a row reveals its image
            inline here instead. Hidden on fine pointers via CSS. Kept mounted
            (not conditionally rendered) so both the open drop and the close
            collapse run as CSS transitions — unmounting would kill the exit. */}
        <span
          className={`kloaq-service-touch-preview${hovered ? " is-open" : ""}`}
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={service.img} alt="" loading="lazy" />
        </span>
      </div>
    </div>
  );
}

export default function KloaqServices() {
  const ref = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  // Only fine pointers get the cursor-trailing preview. Gating the render (not
  // just hiding via CSS) guarantees it can never flash at the section's
  // top-left on touch — where gsap would otherwise leave it opacity:1 after a
  // tap set `active`, appearing near row 1 no matter which row was tapped.
  const [isFinePointer, setIsFinePointer] = useState(false);
  useEffect(() => {
    setIsFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  // Cursor-trailing preview: the image follows the mouse across the whole
  // section (fine pointers only).
  useEffect(() => {
    const section = ref.current;
    const el = previewRef.current;
    if (!section || !el || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" });
    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      xTo(e.clientX - r.left - 135);
      yTo(e.clientY - r.top - 177);
    };
    section.addEventListener("mousemove", onMove, { passive: true });
    return () => section.removeEventListener("mousemove", onMove);
    // Re-run once the preview mounts: it's gated behind isFinePointer, so on
    // the initial pass previewRef.current is still null and the listener would
    // never attach — leaving the preview stuck at its top-left default.
  }, [isFinePointer]);

  useEffect(() => {
    const el = previewRef.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    gsap.to(el, {
      opacity: active !== null ? 1 : 0,
      scale: active !== null ? 1 : 0.92,
      duration: 0.35,
      ease: "power3.out",
    });
  }, [active]);

  return (
    <section id="services" ref={ref} className="kloaq-whatido-section kloaq-light-section">
      {/* Cursor-trailing work preview — fine pointers only (see isFinePointer). */}
      {isFinePointer && (
      <div ref={previewRef} aria-hidden className="kloaq-whatido-preview">
        {services.map((s, i) => (
          <Image
            key={s.num}
            src={s.img}
            alt=""
            fill
            sizes="270px"
            style={{
              objectFit: "cover",
              opacity: active === i ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        ))}
      </div>
      )}

      <div className="kloaq-vlabel">What I Do</div>

      <div>
        <h2 className="kloaq-whatido-heading">
          Design for every brief,
          <br />
          every industry.
        </h2>

        <div className="kloaq-whatido-list">
          {services.map((service, i) => (
            <ServiceRow
              key={service.num}
              service={service}
              hovered={active === i}
              onHoverChange={(h) => setActive(h ? i : null)}
              onToggle={() => setActive((prev) => (prev === i ? null : i))}
            />
          ))}
        </div>

        {/* No pricing section on /kloaq — link to the live homepage's
            #pricing (matches KloaqNavbar's "Pricing" item, which also
            resolves to /#pricing off-homepage). */}
        <a href="/#pricing" className="kloaq-whatido-link">
          See pricing &amp; plans →
        </a>
      </div>
    </section>
  );
}
