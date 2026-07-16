"use client";
import Image from "next/image";
import KloaqNavbar from "@/components/v2/KloaqNavbar";
import KloaqFooter from "@/components/v2/KloaqFooter";
import KloaqCTA from "@/components/v2/KloaqCTA";
import BriefFlow from "@/components/v2/BriefFlow";
import { RETAINER_SLOTS } from "@/lib/site";

// Standalone /about page — the long version of the studio pitch, linked from
// the primary nav (About · Portfolio · Pricing) and the footer "Pages" column.
// Positioning: freddi.design is a two-person studio run as ONE VOICE —
// "one small team, one voice, start to finish". The differentiator is the
// single voice / no account layer, NOT a headcount, so nothing here should
// claim "one person" or count the team.
const PRINCIPLES = [
  {
    num: "01",
    title: "One voice, start to finish",
    desc: "You brief the studio directly and the same two hands stay on it — no relay, no account layer between the idea and the file that ships.",
  },
  {
    num: "02",
    title: "Fast without sloppy",
    desc: "A flat retainer means nothing gets re-scoped from scratch. Most requests turn around in 48 hours, priority in 24.",
  },
  {
    num: "03",
    title: "Systems, not one-offs",
    desc: "Every deck, key visual and guideline doc is built to hold up next to the last one — not just to look good alone.",
  },
  {
    num: "04",
    title: "One flat rate",
    desc: "A single monthly retainer covers the queue — no per-project quotes, no surprise scope, no clock running on every email.",
  },
];

const STATS = [
  { value: "10", label: "Years in the trade" },
  { value: "0", label: "Account managers" },
  { value: "48HR", label: "Typical turnaround" },
];

// The engagement, brief-to-delivery — the four steps of what actually happens
// after you sign. Deliberately about PROCESS (the "How We Work" title), not
// positioning: the Principles section below already carries the differentiators.
const PROCESS = [
  {
    num: "01",
    title: "You brief us",
    desc: "Drop the ask in one message — Slack, email, a Loom, a rough scribble. No forms, no scoping calls, no account manager to brief first.",
  },
  {
    num: "02",
    title: "Same-day reply",
    desc: "You hear back the same working day, usually within hours — with a plan, a question, or the first pass already underway.",
  },
  {
    num: "03",
    title: "Design in the open",
    desc: "You see the work as it takes shape, not a single big reveal at the end. Course-corrections happen early, while they're cheap.",
  },
  {
    num: "04",
    title: "Ship & iterate",
    desc: "Final files delivered in the formats you need. Tweaks and next requests are already covered — the retainer keeps the queue moving.",
  },
];

// Industries — the six verticals the studio works across, rendered here as a
// STATIC expanded list (thumbnail + name + short tag). Deliberately NOT the
// homepage's auto-scrolling marquee (KloaqIndustries): the About page reads
// as considered/still, so this rhymes with the Principles grid instead. Data
// mirrors KloaqIndustries' `industries` array — keep the two in sync if the
// verticals change.
const INDUSTRIES = [
  { name: "Food & Beverage", short: "F&B", img: "/portfolio/maison-01.jpg" },
  { name: "Beauty & Wellness", short: "Beauty", img: "/portfolio/hermes-01.jpg" },
  { name: "Technology", short: "Tech", img: "/portfolio/c-ai-hero-01.jpg" },
  { name: "Finance & Banking", short: "Finance", img: "/portfolio/anz_hero-01.jpg" },
  { name: "Retail & E-Commerce", short: "Retail", img: "/portfolio/ooh-generic-01.jpg" },
  { name: "Hospitality & Real Estate", short: "Hospitality", img: "/portfolio/ooh-generic-02.jpg" },
];

// Logo wall — brands WORKED WITH (in-house / through the studio), NOT direct
// freddi.design clients; the credential line below the row says so honestly
// (same framing as the reworded homepage logo wall). Static credited row, not
// the homepage marquee. Marks mirror KloaqLogos' `logos` array.
const LOGOS = [
  { name: "SK-II", src: "/logos/SK-II.svg" },
  { name: "Digital Realty", src: "/logos/digital realty.svg" },
  { name: "LVMH", src: "/logos/lvmh.svg" },
  { name: "Samsung", src: "/logos/samsung.svg" },
  { name: "ANZ", src: "/logos/anz.svg" },
  { name: "MBS", src: "/logos/mbs.svg" },
  { name: "Epson", src: "/logos/epson.svg" },
  { name: "Lacoste", src: "/logos/lacoste.svg" },
];

export default function KloaqAbout() {
  return (
    <div className="kloaq-root" style={{ minHeight: "100vh", width: "100%" }}>
      <KloaqNavbar />
      <main>
        {/* Header — same head-grid pattern as /pricing (heading left, intro
            right), on the default ink field. */}
        <section className="kloaq-about-page-head-section">
          <div className="kloaq-vlabel">About</div>
          <div className="kloaq-about-page-head">
            <h1 className="kloaq-whatido-heading kloaq-about-page-heading">
              One small team.
              <br />
              One voice.
            </h1>
            <p className="kloaq-pricing-intro">
              freddi.design is a two-person studio — ten years of brand,
              campaign and web work for names from SK-II to ANZ, run the same
              way every time: one small team, one voice, start to finish.
            </p>
          </div>
        </section>

        {/* How We Work — the actual brief-to-shipped-file process as a
            numbered step sequence, on the shared cream light field. This used
            to be positioning copy + a placeholder portrait box, but that both
            duplicated the Principles section below AND never delivered on the
            section's "how we work" title (it explained WHY the studio is
            different, not WHAT happens after you sign). The steps fill that
            gap — nothing else on the site says what the engagement is actually
            like — and the numbered/hairline row rhymes with Principles and the
            Industries list without repeating their content. The lead line
            keeps the studio's one-voice promise as the section's opening
            statement. */}
        <section className="kloaq-about-story-section kloaq-light-section">
          <div className="kloaq-vlabel">How We Work</div>
          <div className="kloaq-about-process-head">
            <h2 className="kloaq-whatido-heading kloaq-about-process-heading">
              From brief to
              <br />
              shipped file.
            </h2>
            <p className="lead kloaq-about-process-lead">
              No account layer. No handoffs. The two people you brief are the
              two people who ship the file.
            </p>
          </div>

          <ol className="kloaq-about-process">
            {PROCESS.map((step) => (
              <li className="kloaq-about-step" key={step.num}>
                <span className="kloaq-about-step-num">[{step.num}]</span>
                <h3 className="kloaq-about-step-title">{step.title}</h3>
                <p className="kloaq-about-step-desc">{step.desc}</p>
              </li>
            ))}
          </ol>

          {/* Credential row — brands worked with, static (not the homepage
              marquee). The caption keeps the honest framing: worked with,
              in-house and through the studio, NOT direct studio clients. */}
          <div className="kloaq-about-logos">
            <div className="kloaq-about-logos-row" role="list" aria-label="Brands worked with">
              {LOGOS.map((logo) => (
                <div className="kloaq-about-logo" role="listitem" key={logo.name}>
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={0}
                    height={30}
                    style={{ width: "auto", height: "30px" }}
                  />
                </div>
              ))}
            </div>
            <p className="kloaq-about-logos-caption">
              Brands worked with over ten years — in-house and through the
              studio. Not a current client roster.
            </p>
          </div>
        </section>

        {/* Principles — static numbered grid, rhymes with the homepage's
            "What I Do" rows (same [01]-style numbering, hairline rules)
            without borrowing its hover/preview interaction. */}
        <section className="kloaq-whatido-section kloaq-principles-section">
          <div className="kloaq-vlabel">Principles</div>
          <h2 className="kloaq-whatido-heading">
            How the work
            <br />
            actually runs.
          </h2>
          <div className="kloaq-principles-grid">
            {PRINCIPLES.map((p) => (
              <div key={p.num} className="kloaq-principle">
                <span className="kloaq-principle-num">[{p.num}]</span>
                <h3 className="kloaq-principle-title">{p.title}</h3>
                <p className="kloaq-principle-desc">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="kloaq-stats-row">
            {STATS.map((s) => (
              <div key={s.label} className="kloaq-stat">
                <div className="kloaq-stat-value">{s.value}</div>
                <div className="kloaq-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <p className="kloaq-pricing-slots">
            {RETAINER_SLOTS.open} of {RETAINER_SLOTS.total} retainer slots
            open for {RETAINER_SLOTS.month}.
          </p>
        </section>

        {/* Industries — static expanded list of the six verticals, on the
            cream light field. Mirrors the Principles grid's numbered/hairline
            look; each row carries a thumbnail so the range reads as real work,
            not a word list. No marquee/hover-preview (that's the homepage). */}
        <section className="kloaq-about-industries-section kloaq-light-section">
          <div className="kloaq-vlabel">Industries</div>
          <h2 className="kloaq-whatido-heading kloaq-about-industries-heading">
            Where the work
            <br />
            has landed.
          </h2>
          <ul className="kloaq-about-industries-list">
            {INDUSTRIES.map((ind, i) => (
              <li className="kloaq-about-industry" key={ind.name}>
                <span className="kloaq-about-industry-num">
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <span className="kloaq-about-industry-name">{ind.name}</span>
                <span className="kloaq-about-industry-tag">{ind.short}</span>
                <div className="kloaq-about-industry-thumb">
                  <Image
                    src={ind.img}
                    alt={ind.name}
                    fill
                    sizes="120px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <KloaqCTA />
      </main>
      <KloaqFooter />
      <BriefFlow />
    </div>
  );
}
