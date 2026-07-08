// Single source of truth for portfolio work.
// Consumed by the index page (app/work/page.tsx via WorkIndex) and the
// detail pages (app/work/[slug]/page.tsx via WorkDetail).
//
// Slots flagged with `placeholder: true` still use generated/stock
// imagery — overwrite the files in public/portfolio with the real
// project photos (keeping the filenames) and drop the flag.

/**
 * Per-image layout role on the case-study page (WorkDetail). Drives the
 * editorial rhythm — see deriveLayout() there for how a flat `images` array
 * with no hints is auto-paced, and how these override it:
 *   - "full"   full-bleed edge-to-edge band (breaks the page padding), tall
 *   - "wide"   contained full-width band, standard aspect
 *   - "pair"   half-width; two consecutive "pair" images sit side by side
 *   - "offset" contained ~70% width, alternating left/right alignment
 */
export type ImageLayout = "full" | "wide" | "pair" | "offset";

/** An image slot: either a bare src (auto-paced) or a src + explicit layout. */
export type ProjectImage = string | { src: string; layout: ImageLayout };

/**
 * A narrative "beat" — a short slab of process copy interleaved between the
 * image rows on a case-study page, breaking the scroll into problem → move →
 * result rather than an unbroken image run. See WorkDetail for placement.
 */
export interface Beat {
  /** Small orange label, e.g. "The brief" / "The move" / "The result". */
  kicker: string;
  /** One to three sentences. Kept short — this is a caption, not an essay. */
  body: string;
  /**
   * Zero-based index of the image this beat appears AFTER. The beat is
   * injected once that image's row has rendered, so it survives the row
   * grouping (pairs, etc.). `-1` places the beat before the first image.
   */
  after: number;
}

export interface Project {
  /** Stable id used for grid ordering / keys. */
  id: string;
  /** URL slug — /work/[slug]. */
  slug: string;
  title: string;
  client: string;
  category: string;
  /** Delivery year, shown in detail header meta. */
  year: string;
  /** Freddy's role on the project, shown in detail header meta. */
  role: string;
  /** One-line summary used on cards and the index page. */
  summary: string;
  /** 2–3 sentence intro shown at the top of the detail page. */
  intro: string;
  /**
   * Ordered image slots. A bare string is auto-paced by position into the
   * editorial rhythm; wrap any slot as `{ src, layout }` to pin its role
   * explicitly (e.g. force a shelf shot full-bleed). Mixing the two is fine.
   */
  images: ProjectImage[];
  /**
   * Optional narrative beats interleaved between the image rows. Ordered by
   * `after` (the image index each follows). Omit entirely for a project with
   * no process copy — the page just renders the image rhythm as before.
   */
  beats?: Beat[];
  /** Imagery is still stock/generated — keep off the live site. */
  placeholder?: boolean;
}

/** Normalise a slot to its src, regardless of whether it carries a hint. */
export function imageSrc(image: ProjectImage): string {
  return typeof image === "string" ? image : image.src;
}

/** The explicit layout hint on a slot, or undefined if it's auto-paced. */
export function imageLayout(image: ProjectImage): ImageLayout | undefined {
  return typeof image === "string" ? undefined : image.layout;
}

export const projects: Project[] = [
  {
    id: "01",
    slug: "anz-annual-report",
    title: "Renminbi Takes Centre Stage",
    client: "ANZ",
    category: "Annual Report",
    year: "2023",
    role: "Editorial design, layout, data visualisation",
    summary: "A flagship annual report positioning the renminbi as the story of the year.",
    intro:
      "ANZ needed its annual report to do more than account for the year — it needed a point of view. We built the edition around a single editorial thread, the rise of the renminbi, and let typography and data visualisation carry the argument across the document.",
    images: [
      "/portfolio/anz_hero-01.jpg",
      "/portfolio/anz-02.jpg",
      "/portfolio/anz-03.jpg",
      "/portfolio/anz-04.jpg",
      "/portfolio/anz-05.jpg",
    ],
    beats: [
      {
        kicker: "The brief",
        body: "An annual report that reads as obligation, not argument — dense with numbers but silent on what they mean. ANZ wanted a document with a thesis.",
        after: 0,
      },
      {
        kicker: "The move",
        body: "We anchored the whole edition to one story — the rise of the renminbi — and let a tight typographic system and purpose-built data visualisation carry it page to page.",
        after: 2,
      },
      {
        kicker: "The result",
        body: "A report that argues instead of accounts. One editorial thread, held from cover to close, that gives the year a point of view.",
        after: 3,
      },
    ],
  },
  {
    id: "02",
    slug: "akuos-investor-deck",
    title: "Aurello Investor Deck",
    client: "Akuos",
    category: "Pitch Deck",
    year: "2024",
    role: "Narrative design, deck system, slide design",
    summary: "An investor deck built to carry a raise — clear narrative, confident pacing.",
    intro:
      "Akuos came in with a dense story and a tight fundraising window. We rebuilt the deck around a clean narrative spine and a reusable slide system, so every slide earns its place and the numbers land where they should.",
    images: [
      "/portfolio/akuos-00b.avif",
      "/portfolio/akuos-01.jpg",
      "/portfolio/akuos-02.jpg",
      "/portfolio/akuos-03.jpg",
      "/portfolio/akuos-04.jpg",
    ],
    beats: [
      {
        kicker: "The brief",
        body: "A dense story, a tight raise, and a deck trying to say everything at once. Akuos needed investors to follow the logic, not fight it.",
        after: 0,
      },
      {
        kicker: "The move",
        body: "We rebuilt the deck around a single narrative spine and a reusable slide system — one place for the problem, the product, the market, the ask — so every slide earns its keep.",
        after: 2,
      },
      {
        kicker: "The result",
        body: "A deck that carries a raise: clear pacing, confident numbers, and a story an investor can repeat after one read.",
        after: 3,
      },
    ],
  },
  {
    id: "03",
    slug: "cognitiv-ai-brand",
    title: "Brand Identity & Guidelines",
    client: "Cognitiv AI",
    category: "Brandbook",
    year: "2024",
    role: "Brand identity, logo system, guidelines",
    summary: "A full identity system and brandbook for an AI company finding its voice.",
    intro:
      "Cognitiv AI needed an identity that read as credible and human, not another generic tech brand. We developed the full system — logo, type, colour, motion principles — and documented it in a brandbook the team could actually run with.",
    images: [
      "/portfolio/cognitiv-07.jpg",
      "/portfolio/cognitiv-01.webp",
      "/portfolio/cognitiv-02.webp",
      "/portfolio/cognitiv-03.webp",
      "/portfolio/cognitiv-04.webp",
      "/portfolio/cognitiv-05.webp",
      "/portfolio/cognitiv-06.webp",
      "/portfolio/cognitiv-08.webp",
    ],
    beats: [
      {
        kicker: "The brief",
        body: "Every AI startup reaches for the same gradient-and-glow shorthand. Cognitiv wanted to read as credible and human — a company, not a category.",
        after: 0,
      },
      {
        kicker: "The move",
        body: "We built the full system from first principles — logo, type, colour, and motion — each choice earning its place against a plain test: does this feel human or does it feel generated?",
        after: 4,
      },
      {
        kicker: "The result",
        body: "An identity documented in a brandbook the team can actually run with — enough rules to stay coherent, enough room to keep moving.",
        after: 6,
      },
    ],
  },
  {
    id: "04",
    slug: "hermes-terre-campaign",
    title: "Terre d'Hermès Campaign",
    client: "Hermès",
    category: "OOH & Campaign",
    year: "2023",
    role: "Art direction, campaign layout, OOH",
    summary: "Out-of-home and campaign work for a Terre d'Hermès fragrance push.",
    intro:
      "A fragrance as established as Terre d'Hermès leaves little room for noise. The brief was restraint — campaign and out-of-home work that holds the house codes while still stopping someone on the street.",
    images: [
      "/portfolio/hermes-01.jpg",
      "/portfolio/hermes-02.jpg",
      "/portfolio/hermes-03.jpg",
      "/portfolio/hermes-04.jpg",
      "/portfolio/hermes-05.jpg",
    ],
    beats: [
      {
        kicker: "The brief",
        body: "A house as established as Hermès leaves no room for noise. The work had to hold decades of codes and still stop someone mid-street.",
        after: 0,
      },
      {
        kicker: "The move",
        body: "Restraint as the strategy. We let the fragrance, the material and a single confident crop do the talking — art direction that trusts the silence.",
        after: 2,
      },
      {
        kicker: "The result",
        body: "Campaign and out-of-home work that reads unmistakably as the house, and still earns a second look at fifty paces.",
        after: 3,
      },
    ],
  },
  {
    id: "05",
    slug: "maison-freddy-cold-brew",
    title: "Ethiopia Guji Cold Brew",
    client: "Maison Freddy",
    category: "Packaging",
    year: "2024",
    role: "Packaging design, label system, art direction",
    summary: "Packaging for a single-origin Ethiopia Guji cold brew.",
    intro:
      "A single-origin cold brew deserves packaging that signals provenance without shouting. We designed the label system around the Ethiopia Guji origin story — considered, tactile, and built to sit well on a shelf.",
    images: [
      "/portfolio/coffee-mockup-01.jpg",
      "/portfolio/maison-02.jpg",
      "/portfolio/maison-03.jpg",
      "/portfolio/maison-04.jpg",
      "/portfolio/maison-05.jpg",
    ],
    beats: [
      {
        kicker: "The brief",
        body: "A single-origin coffee competing on a crowded shelf, where most packaging either shouts or disappears. This one needed to signal provenance without raising its voice.",
        after: 0,
      },
      {
        kicker: "The move",
        body: "We built the label system around the Ethiopia Guji origin story — a considered, tactile palette and typography that rewards a closer look rather than demanding one.",
        after: 2,
      },
      {
        kicker: "The result",
        body: "Packaging that earns its place on the shelf: quiet, confident, and unmistakably about where the coffee comes from.",
        after: 3,
      },
    ],
    placeholder: true,
  },
  {
    id: "06",
    slug: "dad-intern-times",
    title: "The Intern Times",
    client: "D&AD",
    category: "Editorial Design",
    year: "2022",
    role: "Editorial design, art direction, layout",
    summary: "A newspaper concept for a D&AD brief on internship culture.",
    intro:
      "Responding to a D&AD brief on internship culture, The Intern Times reframes the conversation as a newspaper — editorial design as the medium and the message. The format gave us room to be sharp about a subject that usually stays polite.",
    images: [
      "/portfolio/Intern_Times_0.jpg",
      "/portfolio/Intern_Times_1.jpg",
      "/portfolio/Intern_Times_2.jpg",
      "/portfolio/Intern_Times_8.jpg",
      "/portfolio/intern-09.webp",
    ],
    beats: [
      {
        kicker: "The brief",
        body: "A D&AD brief on internship culture — a subject usually handled in polite, forgettable language. The challenge was to say something that stuck.",
        after: 0,
      },
      {
        kicker: "The move",
        body: "We made the format the argument. The Intern Times stages the whole conversation as a newspaper, letting editorial design set the tone as much as the words.",
        after: 2,
      },
      {
        kicker: "The result",
        body: "A concept sharp enough to be remembered — editorial design as both the medium and the message.",
        after: 3,
      },
    ],
    placeholder: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
