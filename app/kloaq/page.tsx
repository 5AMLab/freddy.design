import type { Metadata } from "next";
import "@/styles/kloaq.css";
import KloaqNavbar from "@/components/v2/KloaqNavbar";
import KloaqCases from "@/components/v2/KloaqCases";
import KloaqLogos from "@/components/v2/KloaqLogos";
import KloaqServices from "@/components/v2/KloaqServices";
import KloaqIndustries from "@/components/v2/KloaqIndustries";
import KloaqCTA from "@/components/v2/KloaqCTA";
import KloaqFooter from "@/components/v2/KloaqFooter";
import BriefFlow from "@/components/v2/BriefFlow";
import KloaqCursor from "@/components/v2/KloaqCursor";

export const metadata: Metadata = {
  title: "Design review — Kloaq-inspired direction",
  robots: { index: false, follow: false },
};

/**
 * Original design study: kloaq.com's loud, brash structure (case cloud,
 * heavy condensed type, rotated labels, pill tags, slash-separated client run)
 * reskinned in freddi.design's dark + Flameburst-orange brand. This design
 * language is now also the homepage (app/page.tsx uses the same components);
 * this route stays as the original reference/staging version, noindexed.
 */
export default function KloaqReview() {
  return (
    <div className="kloaq-root" style={{ minHeight: "100vh", width: "100%" }}>
      <KloaqNavbar />
      <main>
        {/* Cases cloud + showreel doubles as the hero, like Kloaq */}
        <KloaqCases />

        {/* Intro — mirrors the About section's grid (label column + 2-col
            content) so both sections align identically down the page */}
        <section className="kloaq-logos-intro-section">
          <div className="kloaq-vlabel">Inside Freddi</div>
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
                  We are freddi.design — your dedicated design partner.
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

        {/* Industries — replaces the old "What we do" + Clients section.
            Rhymes with What I Do above (same numbering/hover language) via
            a horizontal marquee instead of vertical rows. */}
        <KloaqIndustries />

        <KloaqCTA />
      </main>
      <KloaqFooter />
      <BriefFlow />
      <KloaqCursor />
    </div>
  );
}
