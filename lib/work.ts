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

/**
 * How a project came to exist. Drives the [TYPE] row in the case-study meta
 * block and, for anything that is not `commissioned`, a visible disclaimer
 * above the fold — so self-initiated concept work is never mistaken for a
 * client engagement. Deliberately has NO default: an unclassified project
 * fails the build (see validateProject) rather than silently reading as
 * commissioned, which is how that ambiguity arose in the first place.
 */
export type ProjectType = "commissioned" | "self-initiated" | "awards-brief";

/** Human-readable label for the [TYPE] meta row. */
export const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  commissioned: "Commissioned",
  "self-initiated": "Self-initiated",
  "awards-brief": "Awards brief",
};

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
  /**
   * How the project came about. REQUIRED — no default, by design.
   * Anything other than "commissioned" must also carry a `disclaimer`.
   */
  projectType: ProjectType;
  /**
   * Shown as a visible notice above the fold on non-commissioned projects.
   * Required whenever projectType !== "commissioned" (enforced by
   * validateProject, which runs at module load below).
   */
  disclaimer?: string;
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

/**
 * Short "Client Category" form for compact list rows (/work index) — e.g.
 * "ANZ Annual Report" instead of the case study's own creative headline
 * ("Renminbi Takes Centre Stage"). The creative title still owns the
 * case-study hero and the page <title> (WorkDetail, app/work/[slug]/page.tsx)
 * — that's a different context with room for it. Derived, not a separate
 * data field, so it can't drift from client/category as those change.
 */
export function listTitle(project: Pick<Project, "client" | "category">): string {
  return `${project.client} ${project.category}`;
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
    projectType: "commissioned",
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
    projectType: "commissioned",
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
    projectType: "commissioned",
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
    // ────────────────────────────────────────────────────────────────────
    // TODO(Farid) — COPY REWRITE REQUIRED before launch (spec 1.3).
    // Structure and framing are done: client, year, beat kickers and the
    // disclaimer below now read as self-initiated. The prose does NOT — it
    // still uses client-delivery voice and needs Farid's words, not mine:
    //   · `summary`  — "Out-of-home and campaign work for a ... push" reads
    //                  as a delivered engagement. Also used as the meta
    //                  description, so it needs replacing there too.
    //   · `intro`    — "The brief was restraint" implies a commissioner.
    //   · beats[0..2] bodies — past-tense delivery ("We let the fragrance
    //                  do the talking") should become exercise framing.
    // Everything else on this entry is launch-ready.
    // ────────────────────────────────────────────────────────────────────

    id: "04",
    slug: "hermes-terre-campaign",
    title: "Terre d'Hermès Campaign",
    client: "Hermès (concept)",
    category: "OOH & Campaign",
    year: "2024 — self-initiated",
    role: "Art direction, campaign layout, OOH",
    projectType: "self-initiated",
    disclaimer:
      "Self-initiated concept work. Studio Kavea has no affiliation with, and was not commissioned by, Hermès. Terre d'Hermès and Hermès are trademarks of Hermès International. Imagery was produced with generative AI tools as an art direction exercise.",
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
        kicker: "The premise",
        body: "A house as established as Hermès leaves no room for noise. The work had to hold decades of codes and still stop someone mid-street.",
        after: 0,
      },
      {
        kicker: "The approach",
        body: "Restraint as the strategy. We let the fragrance, the material and a single confident crop do the talking — art direction that trusts the silence.",
        after: 2,
      },
      {
        kicker: "The outcome",
        body: "Campaign and out-of-home work that reads unmistakably as the house, and still earns a second look at fifty paces.",
        after: 3,
      },
    ],
  },
  {
    id: "05",
    slug: "dad-intern-times",
    title: "The Intern Times",
    client: "D&AD",
    category: "Editorial Design",
    year: "2022",
    role: "Editorial design, art direction, layout",
    projectType: "awards-brief",
    disclaimer:
      "Self-initiated work made in response to a D&AD awards brief. Not commissioned by, and not affiliated with, D&AD or any client named in the brief.",
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

/**
 * Fails the build on an unclassified or under-documented project.
 *
 * `projectType` being required already makes TypeScript reject a project that
 * omits it; this covers the half the type system can't express — that a
 * non-commissioned project MUST carry a disclaimer. Invoked at module load
 * (below), so `next build` fails loudly rather than shipping a concept piece
 * that reads as client work.
 */
export function validateProject(p: Project): void {
  if (p.projectType !== "commissioned" && !p.disclaimer) {
    throw new Error(
      `Project "${p.slug}" is ${p.projectType} and requires a disclaimer.`
    );
  }
}

// Runs at import time — every consumer of this module triggers it.
projects.forEach(validateProject);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
