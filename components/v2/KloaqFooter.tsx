"use client";
import Link from "next/link";
import KloaqFooterWordmark from "@/components/v2/KloaqFooterWordmark";
import BackToTop from "@/components/v2/BackToTop";
import { CONTACT_EMAIL } from "@/lib/site";

// Footer for the /kloaq review page. Speaks the same language as the rest
// of the study — Boldonse wordmark, Inter Tight UI, Flameburst orange — and
// "reveals" on scroll: the CTA section above it goes position:sticky, so the
// footer (fixed in normal flow, sitting on top in source order) slides up
// over it like a curtain rising rather than just scrolling into view.
const PAGE_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "#cta" },
];

const RECENT_WORK = [
  { label: "Hermès", href: "/work/hermes-terre-campaign" },
  { label: "Cognitiv", href: "/work/cognitiv-ai-brand" },
  { label: "Akuos", href: "/work/akuos-investor-deck" },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "Behance", href: "https://www.behance.net/faridbalian" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

function FooterColumn({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`kloaq-footer-col${className ? ` ${className}` : ""}`}>
      <div className="kloaq-footer-col-title">{title}</div>
      {children}
    </div>
  );
}

export default function KloaqFooter() {
  return (
    <footer className="kloaq-footer">
      <div className="kloaq-footer-inner">
        <div className="kloaq-footer-links">
          <FooterColumn title="Pages" className="kloaq-footer-col-pages">
            <ul>
              {PAGE_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Recent Works" className="kloaq-footer-col-recent">
            <ul>
              {RECENT_WORK.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Socials" className="kloaq-footer-col-socials">
            <ul>
              {SOCIALS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noreferrer">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Newsletter — heading, copy, email field, legal row.
              There is no mailing-list backend on this site. Rather than a form
              that silently swallows the address (which is what the PREVIOUS
              newsletter form here did — it only flipped local state and never
              sent anywhere), submitting opens a pre-addressed mail to the
              studio with the typed address in the body. It's honest: the
              subscribe actually reaches a human. Swap the onSubmit for a real
              POST the day a list provider exists. */}
          <div className="kloaq-footer-newsletter">
            <div className="kloaq-vlabel">Newsletter</div>
            <p>
              Stay updated on our latest insights, new projects, and the next
              steps of our design journey together.
            </p>

            <form
              className="kloaq-footer-subscribe"
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem(
                  "email"
                ) as HTMLInputElement | null;
                const value = input?.value.trim();
                if (!value) return;
                window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  "Newsletter signup"
                )}&body=${encodeURIComponent(`Please add me to the list: ${value}`)}`;
              }}
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Your Email"
                aria-label="Your email address"
                className="kloaq-footer-subscribe-input"
              />
              <button
                type="submit"
                className="kloaq-footer-subscribe-btn"
                aria-label="Subscribe"
              >
                →
              </button>
            </form>

            <div className="kloaq-footer-bottom">
              <ul className="kloaq-footer-legal">
                {LEGAL_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="kloaq-footer-mark-row">
        <KloaqFooterWordmark />
        <BackToTop />
      </div>
    </footer>
  );
}
