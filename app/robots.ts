import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Emitted as a static /robots.txt at build time.
 *
 * AI crawlers are deliberately NOT blocked — no GPTBot, ClaudeBot,
 * PerplexityBot, CCBot, Google-Extended or Applebot-Extended rules. Being
 * cited by an AI assistant is upside for a studio nobody is searching for by
 * name yet. If that judgement ever changes, this is the one file to edit.
 *
 * The legal pages are NOT disallowed here. They carry `noindex, follow`
 * instead (see 2.4) — blocking them in robots.txt would stop crawlers
 * reading the very meta tag that de-indexes them, which is the classic way
 * a page ends up indexed as a bare URL with no snippet.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /api/ is the brief-form endpoint — nothing crawlable, and no
        // reason to spend crawl budget on it. The chunk path is Next
        // internals; blocking the rest of /_next/ would break rendering for
        // crawlers that execute JS.
        disallow: ["/api/", "/_next/static/chunks/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
