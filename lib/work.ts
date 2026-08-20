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

/**
 * An image slot: either a bare src (auto-paced, no alt) or an object carrying
 * an optional layout hint and — for anything that conveys information — an
 * `alt` description.
 *
 * `alt` describes WHAT IS SHOWN, not the project name. The old auto-generated
 * "Terre d'Hermès Campaign — image 3" told a screen-reader user nothing that
 * the page title had not already said.
 *
 * Omitting `alt` is a DECISION, not a default: a slot with no alt renders
 * alt="" and is announced as decorative. Make that choice per image.
 */
export type ProjectImage =
  | string
  | { src: string; layout?: ImageLayout; alt?: string };

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
 * The alt text for a slot. Returns "" for a slot that declares none —
 * correct for a decorative image, and the reason `alt` is opt-in rather
 * than required: a wrong description is worse than none.
 */
export function imageAlt(image: ProjectImage): string {
  return typeof image === "string" ? "" : image.alt ?? "";
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
      { src: "/portfolio/anz_hero-01.jpg", alt: "Printed copies of the ANZ renminbi report fanned across a blue surface, one open to a navy summary spread of donut charts and icons." },
      { src: "/portfolio/anz-02.jpg", alt: "The report open at its foreword page, a single column of text and a signature on off-white stock." },
      { src: "/portfolio/anz-03.jpg", alt: "A chapter-summary spread: navy left page with pin-marker statistics and a combined bar-and-line chart, facing a white page of body copy." },
      { src: "/portfolio/anz-04.jpg", alt: "A data-heavy spread carrying six charts, from stacked bars to two donut breakdowns of bond issuance." },
      { src: "/portfolio/anz-05.jpg", alt: "The report lying open to show its back and front covers: a stone guardian lion against a Chinese rooftop, overlaid with the renminbi symbol." },
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
      { src: "/portfolio/akuos-00b.avif", alt: "A laptop on a concrete plinth showing the Aurello product slide, smart eyewear against ribbons of coloured light." },
      { src: "/portfolio/akuos-01.jpg", alt: "Three deck slides on a cyan field: a mission and vision statement, a logo slide, and the Aurello product slide with transducer detail call-outs." },
      { src: "/portfolio/akuos-02.jpg", alt: "Four slides angled across cyan, including a go-to-market timeline, a market-opportunity bar chart, and a dark slide showing the companion app on two phones." },
      { src: "/portfolio/akuos-03.jpg", alt: "Slides covering the problem-and-solution framework, market opportunity, competitor analysis, and a diagram of bone-conduction hearing." },
      { src: "/portfolio/akuos-04.jpg", alt: "A laptop at the edge of a grey plinth showing a market-size slide: three nested circles sized 1.15 trillion, 55.5 billion and 16.7 billion." },
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
      { src: "/portfolio/cognitiv-07.jpg", alt: "A purple street-pole sign reading 'Transforming data into human intelligence' above the Cognitiv AI mark." },
      { src: "/portfolio/cognitiv-01.webp", alt: "Brand guideline pages spread on grey: cover, contents, colour palette, logo specification and business-card layouts." },
      { src: "/portfolio/cognitiv-02.webp", alt: "A purple logo-specification sheet showing the wordmark on its construction grid, beside business cards." },
      { src: "/portfolio/cognitiv-03.webp", alt: "A stack of deep-purple business cards on a marble ledge, the top card showing the linked-figures monogram." },
      { src: "/portfolio/cognitiv-04.webp", alt: "A purple lanyard badge for a named consultant, carrying the monogram, wordmark and a QR code." },
      { src: "/portfolio/cognitiv-05.webp", alt: "A purple envelope beside a letterhead printed with a faint pattern of the brand monogram." },
      { src: "/portfolio/cognitiv-06.webp", alt: "A projecting box sign on a tiled facade reading Cognitiv AI, the purple return edge catching light." },
      { src: "/portfolio/cognitiv-08.webp", alt: "A tablet on a concrete block showing the website homepage: a violet corridor of light behind the positioning statement." },
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
      { src: "/portfolio/hermes-01.jpg", alt: "A perfume bottle on weathered wood in low golden light, olive branches above and an orange behind it." },
      { src: "/portfolio/hermes-02.jpg", alt: "A long backlit billboard above an airport travelator, the bottle lit against a sunlit olive grove as two travellers pass." },
      { src: "/portfolio/hermes-03.jpg", alt: "A portrait-format lightbox poster mounted between two escalators in a dark tiled station." },
      { src: "/portfolio/hermes-04.jpg", alt: "A tall illuminated screen in a darkened event space, guests silhouetted in front of it." },
      { src: "/portfolio/hermes-05.jpg", alt: "A wide backlit wall inside a truss-framed stage set, guests standing in silhouette against the golden grove." },
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
      { src: "/portfolio/Intern_Times_0.jpg", alt: "A stack of folded newspapers on grey, the masthead The Intern Times above the headline FALSE ALARM." },
      { src: "/portfolio/Intern_Times_1.jpg", alt: "The front page flat: masthead, the FALSE ALARM headline, and a lead story beside a photograph of a civil defence fire engine." },
      { src: "/portfolio/Intern_Times_2.jpg", alt: "An open spread with a full-page festival poster on the left and a right page mixing a temple procession photograph with two feature articles." },
      { src: "/portfolio/Intern_Times_8.jpg", alt: "Several issues layered on grey: a portrait feature, a piece on the grid system beside a Volvo advertisement, and a folded copy on top." },
      { src: "/portfolio/intern-09.webp", alt: "A single page on a scratched metal surface: two black-and-white portraits above an eighteen-point numbered article in narrow columns." },
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
