"use client";
import { useState } from "react";
import Link from "next/link";
import KloaqFooterWordmark from "@/components/v2/KloaqFooterWordmark";

// Footer for the /kloaq review page. Speaks the same language as the rest
// of the study — Boldonse wordmark, Inter Tight UI, Flameburst orange — and
// "reveals" on scroll: the CTA section above it goes position:sticky, so the
// footer (fixed in normal flow, sitting on top in source order) slides up
// over it like a curtain rising rather than just scrolling into view.
const PAGE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Contact", href: "#cta" },
];

const RECENT_WORK = [
  { label: "Hermès", href: "/work/hermes-terre-campaign" },
  { label: "Cognitiv", href: "/work/cognitiv-ai-brand" },
  { label: "Akuos", href: "/work/akuos" },
];

const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "Behance", href: "#" },
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
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

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

          <div className="kloaq-footer-newsletter">
            <div className="kloaq-vlabel">Newsletter</div>
            <p>
              Stay updated on our latest insights, new projects, and the
              next steps of our design journey together.
            </p>
            {submitted ? (
              <div className="kloaq-footer-newsletter-success">
                You&apos;re on the list.
              </div>
            ) : (
              <form className="kloaq-footer-newsletter-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                />
                <button type="submit" aria-label="Subscribe">
                  →
                </button>
              </form>
            )}

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

      <KloaqFooterWordmark />
    </footer>
  );
}
