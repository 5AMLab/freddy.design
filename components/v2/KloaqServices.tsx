"use client";
import { services as serviceRoutes } from "@/lib/services";

// "What We Do" — the homepage's and /kloaq's services section. Row layout:
// num+title | corner marks (static decoration) | description + tags + a
// "Learn more" button to the service's own page. No hover/click preview —
// every row is fully static, the button is the only interactive element.
const services = [
  {
    num: "01",
    // Route for this discipline — see lib/services.ts (slugs must match).
    slug: "brand-identity",
    title: "Brand & Visual Identity",
    desc: "The logo, the type, the colour, the rules that hold it together — a coherent identity and the brand guidelines that keep it that way long after handoff.",
    tags: ["Branding", "Art Direction", "Guidelines"],
  },
  {
    num: "02",
    // Route for this discipline — see lib/services.ts (slugs must match).
    slug: "web-design",
    title: "Web Design & Development",
    desc: "Sites that carry the brand across — designed and built in Webflow, quick to load, easy to update, nothing you can't run yourself once it's live.",
    tags: ["Web Design", "Webflow Dev", "UX/UI"],
  },
  {
    num: "03",
    // Route for this discipline — see lib/services.ts (slugs must match).
    slug: "campaign-editorial",
    title: "Campaign & Editorial",
    desc: "Key visuals that carry a campaign, editorial spreads that earn the page turn, event identities that hold a room — the work a brand is actually seen through.",
    tags: ["Key Visuals", "Editorial", "Event Identity"],
  },
  {
    num: "04",
    // Route for this discipline — see lib/services.ts (slugs must match).
    slug: "decks-collateral",
    title: "Decks & Collateral",
    desc: "Presentation decks that don't fight the speaker, reports, brochures and event collateral — print- and pitch-ready files, delivered clean and on time.",
    tags: ["Decks", "Print", "Reports"],
  },
];

// The homepage rows and the service PAGES are two lists that must agree: a
// slug typo here produces a homepage link to a 404. Checked at module load
// rather than trusted — cheap, and it fails loudly in dev instead of quietly
// in production.
if (process.env.NODE_ENV !== "production") {
  const known = new Set(serviceRoutes.map((s) => s.slug));
  const bad = services.filter((s) => !known.has(s.slug));
  if (bad.length) {
    throw new Error(
      `KloaqServices: unknown service slug(s) ${bad
        .map((s) => s.slug)
        .join(", ")} — must match lib/services.ts`
    );
  }
}

function ServiceRow({ service }: { service: (typeof services)[0] }) {
  return (
    <div className="kloaq-service-row fade-up">
      <span className="kloaq-service-num">[{service.num}]</span>

      <span className="kloaq-service-title">{service.title}</span>

      {/* Decorative +/× corner marks — static, no hover/active state. */}
      <div className="kloaq-service-imgslot">
        <svg className="kloaq-service-mark" viewBox="0 0 16 16" aria-hidden>
          <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        <svg className="kloaq-service-mark" viewBox="0 0 16 16" aria-hidden>
          <path
            d="M2.5 2.5l11 11M13.5 2.5l-11 11"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
        <svg className="kloaq-service-mark" viewBox="0 0 16 16" aria-hidden>
          <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </div>

      <div className="kloaq-service-copy">
        <p className="kloaq-service-desc">{service.desc}</p>
        {service.tags.length > 0 && (
          <div className="kloaq-service-tags">
            {service.tags.map((t) => (
              <span key={t} className="kloaq-service-tag">
                [{t.toUpperCase()}]
              </span>
            ))}
          </div>
        )}
        {/* The internal link that makes /services/* reachable by a crawler
            (spec 3.1) and the row's only interactive element. */}
        <a href={`/services/${service.slug}`} className="kloaq-service-more">
          Learn more
        </a>
      </div>
    </div>
  );
}

export default function KloaqServices() {
  return (
    <section id="services" className="kloaq-whatido-section kloaq-light-section">
      <div className="kloaq-vlabel fade-up">What We Do</div>

      <div>
        <h2 className="kloaq-whatido-heading reveal-line">
          <span className="line-mask">
            <span className="line">Design for every brief,</span>
          </span>
          <span className="line-mask">
            <span className="line kloaq-heading-accent">every industry.</span>
          </span>
        </h2>

        <div className="kloaq-whatido-list">
          {services.map((service) => (
            <ServiceRow key={service.num} service={service} />
          ))}
        </div>

        {/* Pricing now lives on the standalone /pricing route (KloaqPricing). */}
        <a href="/pricing" className="kloaq-whatido-link fade-up">
          See pricing &amp; plans →
        </a>
      </div>
    </section>
  );
}
