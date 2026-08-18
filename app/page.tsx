import "@/styles/kloaq.css";
import KloaqNavbar from "@/components/v2/KloaqNavbar";
import HeroInlineV6 from "@/components/v4/HeroInlineV6";
import KloaqLogos from "@/components/v2/KloaqLogos";
import KloaqPortfolio from "@/components/v2/KloaqPortfolio";
import KloaqServices from "@/components/v2/KloaqServices";
import KloaqIndustries from "@/components/v2/KloaqIndustries";
import KloaqFooter from "@/components/v2/KloaqFooter";
import BriefFlow from "@/components/v2/BriefFlow";

/**
 * Homepage — the Kloaq design language is the site default: Boldonse +
 * Inter Tight typography, orange accent, 14px image rectangles.
 *
 * NOTE ON TYPE: the hero is the one exception to the Boldonse display rule.
 * HeroInlineV6's headline is Inter Tight, because Boldonse is too wide to
 * hold a full sentence at hero scale with two cards set inline in it. The
 * seam is visible scrolling from the hero into the first h2 below. That is a
 * known, deliberate trade — see the component docblock — not an oversight.
 *
 * Section sequence: hero → inside kavea (logo wall) → portfolio → what we do
 * → manifesto → footer. Say it, prove who trusts it, show it, explain it, then
 * ask for the meeting.
 */
export default function Home() {
  return (
    <div className="kloaq-root" style={{ minHeight: "100vh", width: "100%" }}>
      <KloaqNavbar />
      <main>
        {/* 1. Hero — the inline-card hero. The work sits INSIDE the
            headline's text flow as two image cards rather than behind it:
            "Discover Us" is static, "See Projects" cycles a cross-project
            reel, and hovering either stretches it and pushes the following
            words along. Ambient video behind, no scrim (the footage is dark
            enough — measured). See HeroInlineV6 for the full rationale. */}
        <HeroInlineV6 />

        {/* 2. Inside Kavea — intro + the logo wall (KloaqLogos is already a
            seamless auto-scrolling marquee). */}
        <section className="kloaq-logos-intro-section">
          <div className="kloaq-vlabel fade-up">Inside Kavea</div>
          <div className="kloaq-logos-intro">
            {/* .line-mask is display:block, so it owns the line break the
                <br /> used to make. */}
            <h2 className="reveal-line">
              <span className="line-mask">
                <span className="line">Brands we&apos;ve</span>
              </span>
              <span className="line-mask">
                <span className="line kloaq-heading-accent">worked with</span>
              </span>
            </h2>
            <p className="fade-up">
              From global names to regional challengers — ten years of work
              across campaign key visuals, editorial, event identity and brand
              guidelines, in-house and through the studio.
            </p>
          </div>
        </section>
        <KloaqLogos />

        {/* 3. Portfolio — four selected cases, hover to reveal the title. */}
        <KloaqPortfolio />

        {/* 4. What We Do — numbered service rows, cursor-trailing preview on
            hover, tap-accordion on touch. Closes into /pricing. */}
        <KloaqServices />

        {/* 5. Manifesto — the studio statement, the industries marquee and the
            primary CTA in one section (KloaqIndustries owns all three now; the
            standalone KloaqCTA section and the flat About block that used to
            sit here are both folded into it). About lives at /about. */}
        <KloaqIndustries variant="manifesto" />
      </main>
      <KloaqFooter />
      <BriefFlow />
    </div>
  );
}
