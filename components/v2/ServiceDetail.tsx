import Image from "next/image";
import Link from "next/link";
import KloaqNavbar from "@/components/v2/KloaqNavbar";
import KloaqFooter from "@/components/v2/KloaqFooter";
import { type Service } from "@/lib/services";
import {
  type Project,
  imageSrc,
  imageAlt,
  listTitle,
  PROJECT_TYPE_LABEL,
} from "@/lib/work";
import { CONTACT_EMAIL } from "@/lib/site";

/**
 * A service page: H1 + intro, a body Farid writes, 2–3 case studies, a CTA.
 *
 * Deliberately a SERVER component — there is no interaction here, so none of
 * this needs to reach the client bundle. That also means the full text is in
 * the initial HTML, which is the point of the page.
 */
export default function ServiceDetail({
  service,
  cases,
}: {
  service: Service;
  cases: Project[];
}) {
  return (
    <div className="service-page">
      <KloaqNavbar />

      <main>
        <header className="service-header">
          <div className="service-eyebrow">[ {service.num} ] Services</div>
          {/* The H1 carries the service AND the location — this page exists
              to be findable for "<service> singapore". */}
          <h1 className="service-h1">{service.h1}</h1>
          <p className="service-intro">{service.intro}</p>
        </header>

        <section className="service-body">
          {/*
            ⚠ TODO(Farid) — BODY COPY REQUIRED (spec 3.1).
            The spec asks for 400–800 words per service page and is explicit
            that the copy is yours, not mine. The headings below come from
            `bodyOutline` in lib/services.ts — change them there, and write
            the paragraphs to sit under each.

            Everything else on this page is finished: metadata, schema, the
            case-study links and the CTA all work as-is. The page is
            deliberately NOT in the sitemap until this copy lands — see
            app/sitemap.ts.
          */}
          {service.bodyOutline.map((heading) => (
            <div className="service-section" key={heading}>
              <h2 className="service-h2">{heading}</h2>
              <p className="service-placeholder">
                [ Copy to come — see TODO in ServiceDetail.tsx ]
              </p>
            </div>
          ))}
        </section>

        {cases.length > 0 && (
          <section className="service-cases">
            <h2 className="service-h2">Related work</h2>
            <div className="service-case-grid">
              {cases.map((project) => (
                <Link
                  href={`/work/${project.slug}`}
                  className="service-case"
                  key={project.slug}
                >
                  <span className="service-case-frame">
                    <Image
                      src={imageSrc(project.images[0])}
                      alt={imageAlt(project.images[0])}
                      fill
                      sizes="(max-width: 900px) 100vw, 45vw"
                      style={{ objectFit: "cover" }}
                    />
                  </span>
                  <span className="service-case-meta">
                    <span className="service-case-tag">
                      [{project.category.toUpperCase()}]
                    </span>
                    {/* Same qualifier the /work index carries — a concept
                        piece stays labelled wherever it is surfaced. */}
                    {project.projectType !== "commissioned" && (
                      <span className="service-case-tag service-case-tag-type">
                        [{PROJECT_TYPE_LABEL[project.projectType].toUpperCase()}]
                      </span>
                    )}
                  </span>
                  <span className="service-case-title">
                    {listTitle(project)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="service-cta">
          <h2 className="service-cta-title">Start a project</h2>
          <p className="service-cta-body">
            Tell us what you are working on and we will come back with a
            scope, a timeline and a price.
          </p>
          <div className="service-cta-actions">
            <Link href="/contact" className="service-cta-link">
              Get in touch
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="service-cta-link service-cta-link-quiet"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </section>
      </main>

      <KloaqFooter />
    </div>
  );
}
