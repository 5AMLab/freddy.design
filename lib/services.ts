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
  /**
   * Body copy, one paragraph array per entry in `bodyOutline` (same order,
   * same length). 400–800 words total per spec 3.1.
   */
  body: string[][];
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
    body: [
      [
        "A brand identity project ends with a logo, a type system, a colour palette and a set of layout rules — but what you're actually paying for is the decisions behind them. Anyone can hand you a wordmark. What holds a brand together six months later, across a deck someone else builds and a social post someone else designs, is the system underneath it.",
        "You get the primary mark and its variants, a typeface pairing chosen for both screen and print, a colour system with real usage rules (not just five hex codes), and a guidelines document that says what to do with all of it. Everything is delivered in the file formats your team actually uses — no proprietary lock-in, no coming back to us for a PNG.",
      ],
      [
        "We start with a short discovery conversation — what the brand needs to say, who it's competing against, what's worked and what hasn't. From there it's concepts, one round of direction, then refinement until the system is tight. Most identity projects run four to six weeks depending on scope; we'll give you a real timeline once we know what you need.",
        "You'll see work in progress, not just a big reveal at the end. Two people means fewer handoffs and fewer meetings where nothing gets decided — feedback goes straight to whoever's making the change.",
      ],
      [
        "This is for founders and marketing leads who need a brand that can be picked up and used by other people — an in-house team, a future agency, a freelancer building a landing page. If you need a system that survives contact with people who aren't us, this is the service.",
      ],
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
    body: [
      [
        "A site designed and built to carry the brand it belongs to — not a template with your logo swapped in. That means custom layout, type and motion decisions made for your content specifically, responsive across phone, tablet and desktop, and fast enough that it doesn't undo the first impression the design makes.",
        "You get a live site plus edit access, so changing a headline or swapping a case study doesn't mean opening a ticket with us. We hand over a CMS structure that matches how your team actually publishes — projects, posts, team members, whatever your content is — set up once so it's simple every time after.",
      ],
      [
        "Webflow gets you a production-grade site without a developer on retainer. It's visual enough that your team can make day-to-day edits themselves, but it still outputs clean, fast, semantic code — not the bloat you get from a page-builder plugin stacked on top of a CMS never built for it.",
        "It also means we can move fast without sacrificing polish: no build pipeline, no staging environment drift, no waiting on a dev sprint to fix a typo.",
      ],
      [
        "We design in high fidelity first — real content where possible, not lorem ipsum — so what you approve is close to what ships. Build happens in parallel with the later design rounds, and we test across devices and browsers before handoff. Most sites take four to eight weeks depending on page count and whether there's a CMS involved.",
      ],
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
    body: [
      [
        "Key visuals built to hold up across every format they'll actually run in — out-of-home, social, print, whatever the media plan calls for — plus the editorial layouts and event identity work that sit around a campaign. One direction, applied consistently, instead of a hero image that falls apart the moment it's resized for a bus stop.",
        "Deliverables scale to the brief: a single key visual system, a full editorial spread for a report or magazine, or an event identity covering signage, invites and on-site collateral. We scope this per project since campaign work varies more than the other services.",
      ],
      [
        "A campaign visual has one job — stop someone mid-scroll or mid-commute and carry a single idea, fast, across formats that don't give it much time. Editorial has more room: spreads that reward a slower read, sequencing that builds across pages, type doing more of the work than image alone. Most projects are one or the other, though some — an annual report with a campaign-style cover story — ask for both.",
      ],
      [
        "We work from the media plan or the publication's format first, so the concept is built for where it'll actually appear rather than adapted after the fact. Concepts, one direction, then production across every size and format on the plan. Timelines depend heavily on scope — a single key visual system can run two to three weeks; a full editorial issue or event rollout takes longer.",
      ],
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
    body: [
      [
        "A deck built around the story you're telling, not a set of slides fighting for attention against whoever's presenting. That means a slide system — layout, chart style, type hierarchy — applied consistently across the full deck, so slide 40 still looks like it belongs with slide 1. Delivered editable, in the format your team presents from.",
        "Beyond decks, this covers the print and report collateral that tends to travel alongside them — annual reports, one-pagers, leave-behinds — built on the same visual system so nothing looks bolted on.",
      ],
      [
        "An investor deck has to survive being read without you in the room — it needs to work as a document, not just as slides behind a live pitch, because it will get forwarded. A sales deck is built to be presented, with more room to lean on the speaker and less need to stand alone on a screen. We ask which one we're building before the first draft, because it changes the density and pacing of every slide.",
      ],
      [
        "We start from your content and narrative — we don't write the pitch, but we'll flag where the story doesn't land before it's a design problem. From there: a slide system defined early and locked, then production across the full deck so changes stay consistent instead of drifting slide by slide. Most decks take two to four weeks depending on length and how settled the content is going in.",
      ],
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
