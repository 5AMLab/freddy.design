import Image from "next/image";
import Link from "next/link";
import KloaqNavbar from "@/components/v2/KloaqNavbar";
import KloaqFooter from "@/components/v2/KloaqFooter";
import ServiceBody from "@/components/v2/ServiceBody";
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

        {/* Body — same sticky-rail layout as the /work case-study body
            (.work-body): a 240px rail that rides the scroll, paired with a
            fluid right column so the copy uses the full content width
            instead of sitting in a narrow centred strip. The rail lists the
            section headings themselves, since a service page has no
            client/discipline/year meta to show there — ServiceBody is the
            one client island on this page, tracking scroll to highlight
            which section the reader is currently in. */}
        <ServiceBody service={service} />

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
