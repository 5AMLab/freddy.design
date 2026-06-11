// Single place to update contact details and availability.
// WhatsApp is deliberately NOT exposed to anonymous visitors — the direct
// line is a retainer perk (it's listed as a plan feature in pricing), and
// publishing the number invites scrapers and spam. Pre-sale contact is email.

export const CONTACT_EMAIL = "hello@freddi.design"; // TODO: replace with the real inbox

// Edit these by hand as slots fill — shown in the CTA and the brief flow.
export const RETAINER_SLOTS = {
  open: 2,
  total: 3,
  month: "June",
};
