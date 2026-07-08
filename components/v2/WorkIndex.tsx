"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import "@/styles/kloaq.css";
import { type Project, imageSrc } from "@/lib/work";
import { prefersReducedMotion } from "@/components/motion/MotionProvider";
import { startTransition } from "@/lib/pageTransition";
import KloaqNavbar from "@/components/v2/KloaqNavbar";
import KloaqFooter from "@/components/v2/KloaqFooter";

/**
 * /work index — the hero's typographic cloud "unpacked" into an ordered
 * archive list. Each project is a full-width hairline row (index number,
 * title in display caps, client + bracketed category tag); the portfolio
 * image is not laid out in a grid but revealed on demand, exactly like the
 * homepage cloud:
 *
 *  - fine pointers: a cursor-trailing preview (.kloaq-thumb, GSAP quickTo)
 *    fades in while a row is hovered; the hovered title flips to the
 *    orange-outline ghost treatment and sibling rows dim (CSS :has).
 *  - touch: first tap pins the preview at the tap point, a × button (or a
 *    second tap, which navigates) dismisses it — the same interaction
 *    KloaqCases/HeroCloudV3 established, including the activeRef race fix
 *    for fast Android taps and the coarse-gating on synthetic mouse events.
 *
 * Entrance uses the site-wide .v2-fade vocabulary (MotionProvider), applied
 * to each row's INNER wrapper — GSAP leaves inline opacity:1 behind on
 * .v2-fade targets, which would permanently defeat the :has() sibling-dim
 * if it sat on the row element itself.
 */
export default function WorkIndex({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const thumbRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  // Synchronous mirror of `active` — see KloaqCases on the Android
  // double-tap race this prevents.
  const activeRef = useRef<string | null>(null);

  // GSAP quickTo setters for the thumb trail, built once on mount (fine
  // pointer + motion allowed only) and read from the handlers via this ref.
  const thumbToRef = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);

  const isCoarse = () => !window.matchMedia("(pointer: fine)").matches;

  useEffect(() => {
    if (isCoarse() || prefersReducedMotion()) return;
    const thumb = thumbRef.current;
    if (!thumb) return;
    // Starting scale set through GSAP, not CSS — quickTo(x)/quickTo(y)
    // claims the transform property, so a CSS scale would be frozen at its
    // rest value (see the .kloaq-thumb comment in kloaq.css).
    gsap.set(thumb, { scale: 0.92 });
    thumbToRef.current = {
      x: gsap.quickTo(thumb, "x", { duration: 0.5, ease: "power3.out" }),
      y: gsap.quickTo(thumb, "y", { duration: 0.5, ease: "power3.out" }),
    };
  }, []);

  // Fine-pointer only — touch browsers fire synthetic mousemoves mid-tap,
  // which would drag the pinned preview around (see KloaqCases).
  const move = (e: React.MouseEvent) => {
    if (isCoarse()) return;
    thumbToRef.current?.x(e.clientX);
    thumbToRef.current?.y(e.clientY);
  };

  const setActiveCase = (id: string | null) => {
    activeRef.current = id;
    setActive(id);
  };

  // Touch tap-to-reveal: first tap on an inactive row pins the preview at
  // the tap point instead of navigating; tapping the active row navigates
  // through. Same handler as the homepage cloud.
  const tap = (e: React.MouseEvent, id: string) => {
    if (!isCoarse()) return;
    if (activeRef.current !== id) {
      e.preventDefault();
      // No quickTo setters on touch — pin via left/top, offset by half the
      // frame so the preview centers under the tap point.
      const el = thumbRef.current;
      if (el) {
        const { width, height } = el.getBoundingClientRect();
        el.style.left = `${e.clientX - width / 2}px`;
        el.style.top = `${e.clientY - height / 2}px`;
      }
      setActiveCase(id);
    }
  };

  // Desktop click → shared-element flight, identical to HeroCloudV3's: the
  // hovered row's trailing preview thumb is the grab point, so its rect + the
  // project image fly into the case hero (SharedElementOverlay, mounted in the
  // root layout, survives the route change). router.push instead of letting
  // <Link> navigate, so the transition starts before the nav. Bails to normal
  // navigation on touch, reduced motion, modified/non-left clicks, or if the
  // preview thumb isn't visible to fly from.
  const navigate = (e: React.MouseEvent, project: Project) => {
    if (isCoarse()) return;
    if (prefersReducedMotion()) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    const frame = thumbRef.current?.querySelector<HTMLElement>(".kloaq-thumb-frame");
    if (!frame) return;

    const r = frame.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;

    e.preventDefault();
    startTransition({
      src: imageSrc(project.images[0]),
      from: { top: r.top, left: r.left, width: r.width, height: r.height },
      slug: project.slug,
    });
    setActiveCase(null);
    router.push(`/work/${project.slug}`);
  };

  // Grow the thumb 0.92 → 1 while a row is hovered. Plain gsap.to (not
  // quickTo) — see KloaqCases on why quickTo can't animate scale here.
  useEffect(() => {
    if (isCoarse() || prefersReducedMotion()) return;
    const thumb = thumbRef.current;
    if (!thumb) return;
    gsap.to(thumb, { scale: active ? 1 : 0.92, duration: 0.45, ease: "power3.out" });
  }, [active]);

  const activeProject = projects.find((p) => p.id === active);

  return (
    <div className="work-index-page">
      <KloaqNavbar />

      <header className="work-index-header">
        <div className="work-index-header-top v2-fade">
          <div className="kloaq-vlabel">Projects</div>
          <div className="work-index-count">[{projects.length} PROJECTS]</div>
        </div>
        <h1 className="v2-fade">Selected Work</h1>
        <p className="work-index-lead v2-fade">
          Annual reports, investor decks, brand systems, campaigns and
          packaging — a cross-section of recent projects. Client names
          anonymised where confidentiality applies.
        </p>
      </header>

      <section className="work-index-list" onMouseMove={move}>
        {projects.map((project, i) => (
          <Link
            key={project.id}
            href={`/work/${project.slug}`}
            className={`work-index-row${active === project.id ? " is-active" : ""}`}
            onMouseEnter={() => {
              if (!isCoarse()) setActiveCase(project.id);
            }}
            onMouseLeave={() => {
              if (!isCoarse() && activeRef.current === project.id) setActiveCase(null);
            }}
            onClick={(e) => {
              tap(e, project.id);
              if (!e.defaultPrevented) navigate(e, project);
            }}
          >
            <span className="work-index-row-inner v2-fade">
              <span className="work-index-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="work-index-title">{project.title}</span>
              <span className="work-index-meta">
                <span className="work-index-client">{project.client}</span>
                <span className="work-index-tag">[{project.category.toUpperCase()}]</span>
              </span>
            </span>
          </Link>
        ))}
      </section>

      {/* Single floating preview shared across rows — trails the cursor on
          desktop, pins at the tap point on touch. Reuses the homepage
          cloud's .kloaq-thumb classes wholesale (incl. the touch-only close
          button) so both pages share one preview language. */}
      <div
        ref={thumbRef}
        className={`kloaq-thumb${active ? " is-visible" : ""}`}
        aria-hidden="true"
      >
        {activeProject && activeProject.images.length > 0 && (
          <>
            <span className="kloaq-thumb-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc(activeProject.images[0])} alt="" />
            </span>
            <button
              type="button"
              className="kloaq-thumb-close"
              aria-label="Close preview"
              onClick={() => setActiveCase(null)}
            >
              ×
            </button>
          </>
        )}
      </div>

      <KloaqFooter />
    </div>
  );
}
