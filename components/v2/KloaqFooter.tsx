"use client";
import Link from "next/link";
import KloaqFooterWordmark from "@/components/v2/KloaqFooterWordmark";
import BackToTop from "@/components/v2/BackToTop";

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
  // Was href="#cta" (dead on five routes), then an interim mailto. Now the
  // real /contact route from spec 3.2.
  { label: "Contact", href: "/contact" },
];

const SERVICES = [
  { label: "Brand Identity", href: "/services/brand-identity" },
  { label: "Web Design", href: "/services/web-design" },
  { label: "Editorial", href: "/services/campaign-editorial" },
  { label: "Collateral", href: "/services/decks-collateral" },
];

// Ordered deliberately, ANZ first (spec 3.4). This block is sitewide, so
// whatever leads it collects the most internal links on the site — that was
// Hermès, pointing the strongest internal signal at the one self-initiated
// concept piece. Commissioned work leads now.
const RECENT_WORK = [
  { label: "ANZ", href: "/work/anz-annual-report" },
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

          <FooterColumn title="Services" className="kloaq-footer-col-services">
            <ul>
              {SERVICES.map((l) => (
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
        </div>
      </div>

      <div className="kloaq-footer-mark-row">
        <KloaqFooterWordmark />
        <BackToTop />
      </div>

      <div className="kloaq-footer-bottom">
        <ul className="kloaq-footer-legal">
          {LEGAL_LINKS.map(({ label, href }) => (
            <li key={label}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
