import "@/styles/kloaq.css";
import KloaqNavbar from "@/components/v2/KloaqNavbar";
import KloaqCases from "@/components/v2/KloaqCases";
import KloaqCasesMobile from "@/components/v2/KloaqCasesMobile";
import KloaqLogos from "@/components/v2/KloaqLogos";
import KloaqServices from "@/components/v2/KloaqServices";
import KloaqIndustries from "@/components/v2/KloaqIndustries";
import KloaqCTA from "@/components/v2/KloaqCTA";
import KloaqFooter from "@/components/v2/KloaqFooter";
import BriefFlow from "@/components/v2/BriefFlow";
import CookieBanner from "@/components/v2/CookieBanner";

/**
 * Homepage — the Kloaq design language is the site default: Boldonse +
 * Inter Tight typography, Flameburst-orange accent, 14px image rectangles.
 */
export default function Home() {
  return (
    <div className="kloaq-root" style={{ minHeight: "100vh", width: "100%" }}>
      <KloaqNavbar />
      <main>
        {/* Cases cloud + showreel doubles as the hero. Desktop gets the
            packed typographic cloud; touch/narrow gets the pinned one-project-
            at-a-time scroll carousel. Exactly one is shown via CSS at the
            820px breakpoint (.kloaq-cases-section / .kloaq-mobile-hero). */}
        <KloaqCases />
        <KloaqCasesMobile />

        {/* Intro — mirrors the About section's grid so both align down the page */}
        <section className="kloaq-logos-intro-section">
          <div className="kloaq-vlabel">Inside Freddy</div>
          <div className="kloaq-logos-intro">
            <h2>Brands that trust the process</h2>
            <p>
              From global names to regional challengers, the same principle holds
              across every project — clear thinking, tight execution, and design
              that earns its place on the brief.
            </p>
          </div>
        </section>

        {/* Logo wall */}
        <KloaqLogos />

        {/* About — flat two-column text + accented closing statement */}
        <section className="kloaq-about-section kloaq-light-section">
          <div className="kloaq-vlabel">About</div>
          <div>
            <div className="kloaq-about-grid">
              <div>
                <p className="lead">
                  We are freddy.design — your dedicated design partner.
                </p>
                <p>
                  One designer on speed dial, not an agency layer cake. Identity,
                  editorial, packaging and decks all stem from a single hand, so
                  the work stays coherent and the line stays direct — concept to
                  delivery, no drama.
                </p>
              </div>
              <div>
                <p>
                  Six years and counting, working with brands that care about the
                  details — from annual reports to fragrance campaigns to the
                  brandbooks that hold it all together.
                </p>
                <p className="kloaq-about-statement">
                  Instead of adding to the <em>noise</em>, we make the things a
                  brand is remembered by.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What I Do — numbered service rows */}
        <KloaqServices />

        {/* Industries — horizontal marquee */}
        <KloaqIndustries />

        <KloaqCTA />
      </main>
      <KloaqFooter />
      <BriefFlow />
      <CookieBanner />
    </div>
  );
}
