"use client";
import { useEffect, useRef, useState } from "react";
import { type Service } from "@/lib/services";

/**
 * The service page's body: sticky rail + copy sections (see .work-body in
 * kloaq.css for the shared grid). Client component ONLY for the scrollspy —
 * with 3 long sections and no visual break between them in the copy column,
 * a rail that just lists quiet labels gives a reader no way to tell which
 * section they're in. This tracks the section nearest the top of the
 * viewport and highlights its rail label, same is-active idiom as
 * WorkIndex/KloaqCases. Rail labels are also click-to-jump.
 */
export default function ServiceBody({ service }: { service: Service }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const sections = sectionRefs.current.filter(
      (el): el is HTMLDivElement => el !== null
    );
    if (sections.length === 0) return;

    // A section counts as "current" once it crosses a line a third of the
    // way down the viewport — reads as active before it's actually at the
    // very top, which matches how a reader experiences "I'm in this part now".
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = sections.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) setActiveIndex(index);
          }
        }
      },
      { rootMargin: "-33% 0px -66% 0px" }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="service-body work-body">
      <aside className="service-rail work-rail">
        <div className="service-rail-sticky work-rail-sticky">
          {service.bodyOutline.map((heading, i) => (
            <a
              href={`#${sectionId(heading)}`}
              className={`service-rail-link${i === activeIndex ? " is-active" : ""}`}
              key={heading}
            >
              {heading}
            </a>
          ))}
        </div>
      </aside>

      <div className="service-sections">
        {service.bodyOutline.map((heading, i) => (
          <div
            className="service-section"
            id={sectionId(heading)}
            key={heading}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
          >
            <h2 className="service-h2 service-h2-inline">{heading}</h2>
            {service.body[i].map((paragraph, j) => (
              <p className="service-paragraph" key={j}>
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function sectionId(heading: string) {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
