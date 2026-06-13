// Single place to update contact details and availability.
// WhatsApp is deliberately NOT exposed to anonymous visitors — the direct
// line is a retainer perk (it's listed as a plan feature in pricing), and
// publishing the number invites scrapers and spam. Pre-sale contact is email.

export const CONTACT_EMAIL = "hello@freddi.design"; // TODO: replace with the real inbox

// Edit the counts by hand as slots fill — shown in the hero, the CTA and the
// brief flow. The month is always the current one so the scarcity line can
// never go stale; reset `open` when a new month starts.
export const RETAINER_SLOTS = {
  open: 2,
  total: 3,
  month: new Date().toLocaleString("en-SG", { month: "long" }),
};
