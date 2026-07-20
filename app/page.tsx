import "@/styles/kloaq.css";
import KloaqNavbar from "@/components/v2/KloaqNavbar";
import HeroStatementV4 from "@/components/v4/HeroStatementV4";
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
 * Section sequence: hero → inside freddi (logo wall) → portfolio → what we do
 * → manifesto → footer. Say it, prove who trusts it, show it, explain it, then
 * ask for the meeting.
 */
export default function Home() {
  return (
    <div className="kloaq-root" style={{ minHeight: "100vh", width: "100%" }}>
      <KloaqNavbar />
      <main>
        {/* 1. Hero — the voice-dominant statement hero. The six service nouns
            swap the full-bleed backdrop on hover; they do NOT navigate (the
            portfolio section below is how you get into a case). At rest the
            backdrop is the static grain field, never a client's photo. */}
        <HeroStatementV4 />

        {/* 2. Inside Freddi — intro + the logo wall (KloaqLogos is already a
            seamless auto-scrolling marquee). */}
        <section className="kloaq-logos-intro-section">
          <div className="kloaq-vlabel fade-up">Inside Freddi</div>
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
