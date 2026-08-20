// Service pages (/services/[slug]) — the four disciplines the homepage
// already lists, each given its own route.
//
// This is the highest-value structural change in the SEO spec: before these
// pages, no route on the site targeted a commercial search query. The
// homepage says "Brand & Visual Identity" inside a hover interaction; that
// is not a page anyone can land on from a search for the thing it describes.
//
// Copy status: headline/intro/metadata are written; the BODY of each page is
// Farid's to write and is marked TODO below. The routes, schema, internal
// links and sitemap entries all work without it, so this can ship as
// scaffolding and be filled in without touching code.

import { type Project, projects } from "@/lib/work";

export interface Service {
  slug: string;
  /** Matches the homepage row's `num` so the two stay visibly in sync. */
  num: string;
  /** Short name, used in nav/lists and as the homepage row title. */
  name: string;
  /**
   * H1. Contains the service AND the location — the page's whole job is to
   * be findable for "<service> singapore", and the H1 is the strongest
   * on-page signal for that.
   */
  h1: string;
  /** <title>. The root layout appends " — Studio Kavea". */
  title: string;
  metaDescription: string;
  /** One or two sentences under the H1. Written; safe to ship. */
  intro: string;
  /** The search intent this page exists to answer. Documentation, not output. */
  targetQuery: string;
  /**
   * Case study slugs to link down to. 2–3 each, per the spec — these are the
   * internal links that connect a commercial page to proof of the work.
   * Validated at module load against lib/work.ts.
   */
  caseStudies: string[];
  /** Section headings for the body Farid will write. */
  bodyOutline: string[];
}

export const services: Service[] = [
  {
    slug: "brand-identity",
    num: "01",
    name: "Brand & Visual Identity",
    h1: "Brand Identity Design in Singapore",
    title: "Brand Identity Design Singapore",
    metaDescription:
      "Brand identity design from a two-person Singapore studio — logo, type, colour and the guidelines that hold it together long after handoff.",
    intro:
      "A logo is the smallest part of it. What a brand actually needs is a system — type, colour, layout and the rules that keep every future piece recognisable, whoever makes it.",
    targetQuery: "brand identity design singapore",
    caseStudies: ["cognitiv-ai-brand", "anz-annual-report"],
    bodyOutline: [
      "What you get",
      "How the work runs",
      "Who this is for",
    ],
  },
  {
    slug: "web-design",
    num: "02",
    name: "Web Design & Development",
    h1: "Web Design & Webflow Development in Singapore",
    title: "Webflow Developer Singapore — Web Design",
    metaDescription:
      "Web design and Webflow development in Singapore — fast, on-brand sites you can update yourself once they are live, with no agency retainer to make a text change.",
    intro:
      "Sites that carry the brand across: designed and built in Webflow, quick to load, and straightforward enough that you can run them yourself once they are live.",
    targetQuery: "webflow developer singapore",
    caseStudies: ["cognitiv-ai-brand"],
    bodyOutline: [
      "What you get",
      "Why Webflow",
      "How the work runs",
    ],
  },
  {
    slug: "campaign-editorial",
    num: "03",
    name: "Campaign & Editorial",
    h1: "Campaign & Editorial Design in Singapore",
    title: "Campaign Design Singapore — Editorial & Key Visuals",
    metaDescription:
      "Campaign and editorial design in Singapore — key visuals, out-of-home, editorial spreads and event identity from a two-person studio.",
    intro:
      "Key visuals that carry a campaign, editorial spreads that earn the page turn, event identities that hold a room — the work a brand is actually seen through.",
    targetQuery: "campaign design singapore",
    caseStudies: ["hermes-terre-campaign", "dad-intern-times"],
    bodyOutline: [
      "What you get",
      "Campaign vs editorial",
      "How the work runs",
    ],
  },
  {
    slug: "decks-collateral",
    num: "04",
    name: "Decks & Collateral",
    h1: "Pitch Deck & Presentation Design in Singapore",
    title: "Pitch Deck Design Singapore",
    metaDescription:
      "Pitch deck and presentation design in Singapore — investor decks, reports and print collateral built to carry a raise, not to fight the speaker.",
    intro:
      "Presentation decks that don't fight the speaker, plus the reports, brochures and event collateral around them — print- and pitch-ready, delivered clean.",
    targetQuery: "pitch deck design singapore",
    caseStudies: ["akuos-investor-deck", "anz-annual-report"],
    bodyOutline: [
      "What you get",
      "Investor decks vs sales decks",
      "How the work runs",
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** Resolve a service's linked case studies to real Project records. */
export function serviceCaseStudies(service: Service): Project[] {
  return service.caseStudies
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));
}

// Fails the build if a service points at a case study that does not exist —
// the same guard rail as validateProject. Removing a project (as 1.9 did with
// Maison Freddy) would otherwise leave a silently dead internal link.
services.forEach((s) => {
  const missing = s.caseStudies.filter(
    (slug) => !projects.some((p) => p.slug === slug)
  );
  if (missing.length) {
    throw new Error(
      `Service "${s.slug}" references unknown case ${missing.join(", ")}.`
    );
  }
});
