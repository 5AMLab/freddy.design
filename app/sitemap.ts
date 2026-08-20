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
 * /contact is NOT listed yet — it is built in Phase 3.2 and currently 404s.
 * Add it here in the same commit that creates the route, along with the four
 * /services/* pages from 3.1.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = [
    { url: SITE_URL, priority: 1.0, changeFrequency: "monthly" as const },
    { url: `${SITE_URL}/work`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${SITE_URL}/about`, priority: 0.8, changeFrequency: "yearly" as const },
    { url: `${SITE_URL}/pricing`, priority: 0.8, changeFrequency: "monthly" as const },
  ];

  const projectRoutes = projects.map((p) => ({
    url: `${SITE_URL}/work/${p.slug}`,
    priority: 0.7,
    changeFrequency: "yearly" as const,
  }));

  return [...staticRoutes, ...projectRoutes].map((r) => ({ ...r, lastModified }));
}
