// JSON-LD graph builders. Kept in one place so the @id values stay consistent
// — the Person on /about and the Organization on / reference each other by
// @id, and a typo in either silently breaks the link that ties the studio,
// Behance and (later) LinkedIn into a single entity for search and AI crawlers.

import { SITE_URL, STUDIO, CONTACT_EMAIL } from "@/lib/site";
import { type Project, PROJECT_TYPE_LABEL, imageSrc } from "@/lib/work";

export const ORG_ID = `${SITE_URL}/#organization`;
export const FOUNDER_ID = `${SITE_URL}/#founder`;

/** Absolute URL for a site-relative path — schema requires absolute URLs. */
const abs = (path: string) => `${SITE_URL}${path}`;

/**
 * ProfessionalService for the homepage. Doubles as the Organization node
 * (same @id) that every other schema on the site points back to.
 *
 * `sameAs` lists ONLY profiles that resolve. LinkedIn and Instagram are
 * deliberately absent until they exist — schema pointing at a dead URL is
 * worse than omitting the field.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: STUDIO.name,
    url: SITE_URL,
    logo: abs("/studio-logo/kavea-white.svg"),
    email: CONTACT_EMAIL,
    description: "Brand and creative direction studio based in Singapore.",
    areaServed: { "@type": "Country", name: "Singapore" },
    address: { "@type": "PostalAddress", addressCountry: STUDIO.country },
    identifier: {
      "@type": "PropertyValue",
      name: "UEN",
      value: STUDIO.uen,
    },
    founder: { "@id": FOUNDER_ID },
    sameAs: [STUDIO.behance],
  };
}

/**
 * Person for /about, linked to the Organization by @id in both directions.
 *
 * TODO(Farid): confirm the exact name spelling and preferred job title —
 * this is the string search engines will associate with the studio.
 */
export function founderSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: "Farid Balian",
    jobTitle: "Founder & Creative Director",
    worksFor: { "@id": ORG_ID },
    sameAs: [STUDIO.behance],
  };
}

/**
 * CreativeWork + BreadcrumbList for a case study.
 *
 * For non-commissioned work the graph carries NO `client` or `sponsor`
 * property — asserting a client relationship in structured data is exactly
 * the misrepresentation Phase 1 set out to remove, and a machine-readable
 * claim is harder to walk back than a line of copy. Only `creator` is set,
 * and `abstract` states the project type in plain words.
 */
export function caseStudySchema(project: Project) {
  const url = abs(`/work/${project.slug}`);
  const isCommissioned = project.projectType === "commissioned";

  const work: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#work`,
    name: project.title,
    url,
    description: project.summary,
    creator: { "@id": ORG_ID },
    image: abs(imageSrc(project.images[0])),
    genre: project.category,
    abstract: `${PROJECT_TYPE_LABEL[project.projectType]} work by ${STUDIO.name}.`,
  };

  // Only a genuine engagement gets a client. Concept work gets neither this
  // nor `sponsor` — see the note above.
  if (isCommissioned) {
    work.sponsor = { "@type": "Organization", name: project.client };
  }

  return work;
}

/** Breadcrumbs for a case study: Home → Work → this project. */
export function breadcrumbSchema(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Work", item: abs("/work") },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: abs(`/work/${project.slug}`),
      },
    ],
  };
}
