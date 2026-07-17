"use client";
import "@/styles/kloaq.css";
import KloaqNavbar from "@/components/v2/KloaqNavbar";
import KloaqFooter from "@/components/v2/KloaqFooter";
import BriefFlow, { openBrief } from "@/components/v2/BriefFlow";
import Magnetic from "@/components/motion/Magnetic";
import { RETAINER_SLOTS } from "@/lib/site";

// Standalone /pricing page — the retainer plans, rebuilt in the current Kloaq
// design language (Boldonse + Inter Tight, Flameburst-orange accent, cream
// light-section field, 14px image radius). This recovers the retainer content
// that shipped as an inline #pricing homepage section in the old
// Canela/Söhne/gold design (components/v2/PricingV2.tsx, deleted in the Kloaq
// rollout commit 1c87a96) — same prices, hours and features, restyled. Now a
// dedicated route rather than a homepage band so the nav "Pricing" item and
// the "Start a project"/"See pricing" links resolve to a real page instead of
// a dead anchor.
const plans = [
  {
    name: "Starter",
    tagline: "Keep the brand moving",
    hours: "10 hrs / month",
    price: "$1,200",
    period: "SGD per month",
    features: [
      "48hr turnaround",
      "1 active request at a time",
      "Direct WhatsApp",
      "Production & adaptation",
    ],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Standard",
    tagline: "Your outsourced design team",
    hours: "20 hrs / month",
    price: "$2,000",
    period: "SGD per month",
    features: [
      "48hr turnaround",
      "2 requests in parallel",
      "WhatsApp + monthly planning call",
      "All service types",
      "5hrs rollover · Top-up $120/hr",
    ],
    cta: "Get started",
    featured: true,
  },
  {
    name: "Priority",
    tagline: "Built around how you work",
    hours: "Scoped to your needs",
    price: "Custom",
    period: "",
    features: [
      "24hr, same-day for small tasks",
      "Unlimited queue",
      "WhatsApp + weekly check-in",
      "All service types + art direction & brand guardianship",
      "Quarterly brand audit · Pause anytime",
    ],
    cta: "Let's discuss →",
    featured: false,
  },
];

export default function KloaqPricing() {
  return (
    <div className="kloaq-root" style={{ minHeight: "100vh", width: "100%" }}>
      <KloaqNavbar />
      <main>
        {/* Header + plan grid on one cream light-section field, matching the
            About/CTA sections' full-bleed cream breakout. */}
        <section className="kloaq-pricing-section kloaq-light-section">
          <div className="kloaq-vlabel">Retainer Plans</div>

          <div className="kloaq-pricing-head">
            <h1 className="kloaq-whatido-heading kloaq-pricing-heading">
              Predictable costs,
              <br />
              zero overhead.
            </h1>
            <p className="kloaq-pricing-intro">
              One small team on speed dial for a flat monthly rate. Pick the hours
              you need — everything else stays the same: direct line, shared
              asset folder, every service type included.
            </p>
          </div>

          <div className="kloaq-pricing-grid">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`kloaq-plan${plan.featured ? " is-featured" : ""}`}
              >
                {plan.featured && (
                  <span className="kloaq-plan-badge">Most popular</span>
                )}

                <div className="kloaq-plan-hours">{plan.hours}</div>
                <div className="kloaq-plan-name">{plan.name}</div>
                <div className="kloaq-plan-tagline">&ldquo;{plan.tagline}&rdquo;</div>

                <div className="kloaq-plan-price">{plan.price}</div>
                {plan.period && (
                  <div className="kloaq-plan-period">{plan.period}</div>
                )}

                <ul className="kloaq-plan-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <span className="kloaq-plan-dot" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Magnetic strength={6}>
                  <button
                    type="button"
                    className={`btn kloaq-plan-cta${plan.featured ? " btn-accent" : ""}`}
                    onClick={openBrief}
                  >
                    {plan.cta}
                  </button>
                </Magnetic>
              </div>
            ))}
          </div>

          <p className="kloaq-pricing-note">
            A design hour covers any task — deck slides, social assets, print
            files, brand work. Hours are tracked per deliverable and shared
            transparently. Unused hours do not roll over.
          </p>

          <p className="kloaq-pricing-slots">
            {RETAINER_SLOTS.open} of {RETAINER_SLOTS.total} retainer slots open
            for {RETAINER_SLOTS.month}.
          </p>
        </section>
      </main>
      <KloaqFooter />
      <BriefFlow />
    </div>
  );
}
