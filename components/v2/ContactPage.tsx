"use client";
import KloaqNavbar from "@/components/v2/KloaqNavbar";
import KloaqFooter from "@/components/v2/KloaqFooter";
import BriefFlow, { openBrief } from "@/components/v2/BriefFlow";
import { CONTACT_EMAIL, STUDIO, RETAINER_SLOTS } from "@/lib/site";

/**
 * /contact — the real route the footer's "Contact" link needed (spec 1.6
 * shipped a mailto: as an interim; this replaces it).
 *
 * Deliberately does NOT build a second form. The site already has a working
 * brief flow wired to Resend (BriefFlow + /api/brief); a competing contact
 * form would be a second inbox to watch and a second thing to keep working.
 * This page carries the NAP-consistent details a local search needs — legal
 * name, UEN, country, email — and routes into that existing flow.
 */
export default function ContactPage() {
  return (
    <div className="contact-page">
      <KloaqNavbar />

      <main>
        <header className="contact-header">
          <div className="contact-eyebrow">Contact</div>
          <h1 className="contact-h1">Start a conversation.</h1>
          <p className="contact-intro">
            Tell us what you are working on — the brief, the deadline, the
            thing that is not quite working. We will come back with a scope, a
            timeline and a price, usually within a day.
          </p>

          <div className="contact-actions">
            <button
              type="button"
              className="contact-cta"
              onClick={() => openBrief()}
            >
              Start a brief
            </button>
            <a href={`mailto:${CONTACT_EMAIL}`} className="contact-cta contact-cta-quiet">
              {CONTACT_EMAIL}
            </a>
          </div>
        </header>

        {/* NAP block — name, UEN and country in crawlable text, matching the
            Organization schema exactly. A local search needs the site and the
            business entity to agree; this is where they do. */}
        <section className="contact-details">
          <dl className="contact-dl">
            <div className="contact-row">
              <dt>Studio</dt>
              <dd>{STUDIO.name}</dd>
            </div>
            <div className="contact-row">
              <dt>Location</dt>
              <dd>Singapore</dd>
            </div>
            <div className="contact-row">
              <dt>UEN</dt>
              <dd>{STUDIO.uen}</dd>
            </div>
            <div className="contact-row">
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </dd>
            </div>
            <div className="contact-row">
              <dt>Availability</dt>
              <dd>
                {RETAINER_SLOTS.open} of {RETAINER_SLOTS.total} retainer slots
                open for {RETAINER_SLOTS.month}
              </dd>
            </div>
          </dl>

          {/* WhatsApp is deliberately absent — see lib/site.ts: the direct
              line is a retainer perk, and publishing the number invites
              scrapers. Pre-sale contact is email. */}
        </section>
      </main>

      <KloaqFooter />
      <BriefFlow />
    </div>
  );
}
