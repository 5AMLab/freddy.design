"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import "@/styles/kloaq.css";
import { type Project, imageSrc, listTitle } from "@/lib/work";
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
 *  - touch: no preview. A row is a link — one tap opens the project. The
 *    reveal is a hover affordance and simply doesn't exist on a touch device,
 *    so nothing has to be tapped open or dismissed first.
 *
 * Entrance is SELF-CONTAINED (see the effect below), not the shared
 * MotionProvider .v2-fade batch: that batch is built once at the provider's
 * mount and never sees rows mounted by a later client navigation, which left
 * /work blank when entered via project → "All work". The reveal target is each
 * row's INNER wrapper (.work-index-row-inner) — GSAP leaves inline opacity:1
 * there on completion, which on the row element itself would defeat the :has()
 * sibling-dim.
 */
export default function WorkIndex({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
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

  // Self-contained entrance for this page's header + rows.
  //
  // These used to carry the shared `.v2-fade` class, whose reveal lives in
  // MotionProvider as a single ScrollTrigger.batch built ONCE at that provider's
  // mount over the .v2-fade nodes present then. On a client navigation INTO
  // /work (project → "All work"), these rows mount fresh and are never in that
  // batch, so they stayed stuck at the CSS base state (opacity:0) forever — the
  // text was invisible while the hover thumbnail still worked.
  //
  // Fix: drive the reveal locally and — crucially — make the content
  // VISIBLE BY DEFAULT (the `work-index-fade` class carries no opacity:0). JS
  // sets the hidden start state itself, then animates in. If this effect ever
  // fails to run, the content simply shows without animation, which is the
  // correct failure mode (the old class failed to invisible). Reduced motion:
  // no hidden state is ever set, so it's visible with no tween.
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const fades = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll(".work-index-fade")
    );
    if (!fades.length || prefersReducedMotion()) return;

    // Set the hidden start state from JS (not CSS), then reveal from it. Because
    // the reveal is a `.fromTo`, it lands opacity:1 regardless of how many times
    // React 18 StrictMode re-invokes this effect in dev.
    const tween = gsap.fromTo(
      fades,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        overwrite: true,
      }
    );
    return () => {
      tween.kill();
      gsap.set(fades, { clearProps: "opacity,transform" });
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

  // Touch: no tap-to-reveal. A row is a link and behaves like one — a single
  // tap follows the href straight to the project. The cursor-trailing preview
  // is a POINTER-ONLY affordance, so on a touch device there is nothing to
  // reveal and nothing to dismiss. Matches the homepage hero (HeroStatementV4)
  // so both surfaces share one interaction model. `navigate()` below bails on
  // coarse pointers, so the bare <Link> handles it.

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
    <div className="work-index-page" ref={pageRef}>
      <KloaqNavbar />

      <header className="work-index-header">
        <div className="work-index-header-top work-index-fade">
          <div className="kloaq-vlabel">Projects</div>
          <div className="work-index-count">[{projects.length} PROJECTS]</div>
        </div>
        {/* Small heading / large body, side by side — same 0.62fr/1.38fr
            split as every other section pair on the site (homepage's
            .kloaq-logos-intro, /about's .kloaq-about-page-head, /pricing's
            .kloaq-pricing-head). This used to stack the heading and lead
            paragraph in one column with only a font-size difference between
            them — a different structure from the shared pattern, not just a
            smaller version of it. */}
        <div className="work-index-header-pair work-index-fade">
          <h1>Selected Work</h1>
          <p className="work-index-lead">
            Annual reports, investor decks, brand systems, campaigns and
            packaging — real client work, a few names kept off the record.
          </p>
        </div>
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
            onClick={(e) => navigate(e, project)}
          >
            <span className="work-index-row-inner work-index-fade">
              {/* Number + category tag share one line, above the title —
                  thumbnail pinned right spanning the row. Tidier than the old
                  num/thumb/title/meta stack, which read as disperse on mobile
                  with nothing visually tying the number to its title. */}
              <span className="work-index-meta">
                <span className="work-index-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="work-index-tag">[{project.category.toUpperCase()}]</span>
              </span>
              {/* Short "Client Category" form (e.g. "ANZ Annual Report") for
                  this compact list — the case-study page keeps the full
                  creative headline ("Renminbi Takes Centre Stage") as its
                  hero, a context with room for it. Inter Tight Bold, not the
                  Boldonse display face used elsewhere: at this row height the
                  condensed display face read as visually loud/disperse next
                  to the small tag and number. */}
              <span className="work-index-title">{listTitle(project)}</span>
              {/* Persistent thumbnail — same role as .kloaq-about-industry-thumb
                  on the About page's Industries list. The floating .kloaq-thumb
                  below is a HOVER-ONLY preview (fine pointers, cursor-trailing);
                  on touch there is no hover, so a client browsing on mobile saw
                  the row with no way to tell projects apart before tapping in.
                  This thumb is always visible, on every pointer type, so the
                  row identifies itself at a glance. */}
              {project.images.length > 0 && (
                <span className="work-index-thumb">
                  <Image
                    src={imageSrc(project.images[0])}
                    alt=""
                    fill
                    sizes="(max-width: 820px) 96px, 120px"
                    style={{ objectFit: "cover" }}
                  />
                </span>
              )}
            </span>
          </Link>
        ))}
      </section>

      {/* Single floating preview shared across rows — trails the cursor on
          fine pointers only. No touch-pinned state any more, so the old
          touch-only close button is gone with it: there is nothing a tap can
          open here, hence nothing to dismiss. */}
      <div
        ref={thumbRef}
        className={`kloaq-thumb${active ? " is-visible" : ""}`}
        aria-hidden="true"
      >
        {activeProject && activeProject.images.length > 0 && (
          <span className="kloaq-thumb-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc(activeProject.images[0])} alt="" />
          </span>
        )}
      </div>

      <KloaqFooter />
    </div>
  );
}
