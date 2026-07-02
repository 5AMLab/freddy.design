// Single source of truth for portfolio work.
// Consumed by the homepage section (components/v2/PortfolioV2.tsx),
// the index page (app/work/page.tsx) and the detail pages
// (app/work/[slug]/page.tsx).
//
// Slots flagged with `placeholder: true` still use generated/stock
// imagery — overwrite the files in public/portfolio with the real
// project photos (keeping the filenames) and drop the flag.

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
  images: string[];
  /** Imagery is still stock/generated — keep off the live site. */
  placeholder?: boolean;
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
      "/portfolio/cognitiv-07.webp",
      "/portfolio/cognitiv-01.webp",
      "/portfolio/cognitiv-02.webp",
      "/portfolio/cognitiv-03.webp",
      "/portfolio/cognitiv-04.webp",
      "/portfolio/cognitiv-05.webp",
      "/portfolio/cognitiv-06.webp",
      "/portfolio/cognitiv-08.webp",
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
      "/portfolio/newspaper-generic-01.jpg",
      "/portfolio/intern-02.jpg",
      "/portfolio/intern-03.jpg",
      "/portfolio/intern-04.jpg",
      "/portfolio/intern-05.jpg",
    ],
    placeholder: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
