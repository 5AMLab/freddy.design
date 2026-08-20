// Single place to update contact details and availability.
// WhatsApp is deliberately NOT exposed to anonymous visitors — the direct
// line is a retainer perk (it's listed as a plan feature in pricing), and
// publishing the number invites scrapers and spam. Pre-sale contact is email.

export const CONTACT_EMAIL = "hello@kavea.studio"; // TODO: replace with the real inbox

/**
 * Canonical origin, no trailing slash. Single source of truth for robots.ts,
 * sitemap.ts, metadataBase and every absolute URL in the JSON-LD graph —
 * hardcoding the domain in six places is how a staging URL ends up in a
 * published sitemap.
 */
export const SITE_URL = "https://kavea.studio";

/** Legal entity details, used in the Organization schema and legal copy. */
export const STUDIO = {
  name: "Studio Kavea",
  uen: "53529765C",
  country: "SG",
  /** Behance is the only social profile that currently resolves. LinkedIn and
   *  Instagram are deliberately absent from `sameAs` until they exist —
   *  schema pointing at a dead URL is worse than omitting the field. */
  behance: "https://www.behance.net/faridbalian",
};

// Edit the counts by hand as slots fill — shown in the hero, the CTA and the
// brief flow. The month is always the current one so the scarcity line can
// never go stale; reset `open` when a new month starts.
export const RETAINER_SLOTS = {
  open: 2,
  total: 3,
  month: new Date().toLocaleString("en-SG", { month: "long" }),
};
