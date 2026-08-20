import type { MetadataRoute } from "next";
import { projects } from "@/lib/work";
import { SITE_URL } from "@/lib/site";

/**
 * Generated from the project data, so a new case study appears here the
 * moment it lands in lib/work.ts — and a removed one disappears (the Maison
 * Freddy removal in 1.9 relied on exactly that).
 *
 * Legal pages are excluded: they carry `noindex` (2.4), and listing a page
 * you are asking not to index is a contradictory signal.
 *
 * /services/* are deliberately NOT listed yet. The routes exist and work,
 * but their body copy is still a placeholder (see ServiceDetail.tsx) — asking
 * Google to index a page that says "[ Copy to come ]" spends the crawl budget
 * of a brand-new site on a thin page and invites exactly the quality problem
 * these pages are meant to solve. Uncomment the block below once Farid's copy
 * is in; nothing else needs to change.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = [
    { url: SITE_URL, priority: 1.0, changeFrequency: "monthly" as const },
    { url: `${SITE_URL}/work`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${SITE_URL}/about`, priority: 0.8, changeFrequency: "yearly" as const },
    { url: `${SITE_URL}/pricing`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${SITE_URL}/contact`, priority: 0.7, changeFrequency: "yearly" as const },
  ];

  // Uncomment once the service pages carry real copy (see the note above):
  // const serviceRoutes = services.map((s) => ({
  //   url: `${SITE_URL}/services/${s.slug}`,
  //   priority: 0.8,
  //   changeFrequency: "monthly" as const,
  // }));

  const projectRoutes = projects.map((p) => ({
    url: `${SITE_URL}/work/${p.slug}`,
    priority: 0.7,
    changeFrequency: "yearly" as const,
  }));

  return [...staticRoutes, ...projectRoutes].map((r) => ({ ...r, lastModified }));
}
