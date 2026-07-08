import type { Metadata } from "next";
import "@/styles/kloaq.css";
import KloaqNavbar from "@/components/v2/KloaqNavbar";
import HeroStatementV4 from "@/components/v4/HeroStatementV4";
import KloaqCasesMobile from "@/components/v2/KloaqCasesMobile";
import KloaqLogos from "@/components/v2/KloaqLogos";
import KloaqServices from "@/components/v2/KloaqServices";
import KloaqIndustries from "@/components/v2/KloaqIndustries";
import KloaqCTA from "@/components/v2/KloaqCTA";
import KloaqFooter from "@/components/v2/KloaqFooter";
import BriefFlow from "@/components/v2/BriefFlow";

/**
 * REVIEW MOCKUP — statement-led hero (see HeroStatementV4). Unlinked from
 * the site nav and noindexed; the real homepage (app/page.tsx) still runs
 * HeroCloudV3. Everything below the hero is the live homepage verbatim, so
 * the candidate can be judged in full-page context. Promoting this means
 * swapping the hero import in app/page.tsx and deleting this route.
 */
export const metadata: Metadata = {
  title: "freddi.design — hero v4 mockup",
  robots: { index: false, follow: false },
};

export default function HeroV4Review() {
  return (
    <div className="kloaq-root" style={{ minHeight: "100vh", width: "100%" }}>
      <KloaqNavbar />
      <main>
        {/* Desktop: the statement hero. Touch/narrow swaps to the same pinned
            scroll-carousel hero as the homepage (CSS toggle at 820px). */}
        <HeroStatementV4 />
        <KloaqCasesMobile />

        <section className="kloaq-logos-intro-section">
          <div className="kloaq-vlabel">Inside Freddi</div>
          <div className="kloaq-logos-intro">
            <h2>Brands I&apos;ve worked with</h2>
            <p>
              From global names to regional challengers — ten years of work
              across campaign key visuals, editorial, event identity and brand
              guidelines, in-house and through the studio.
            </p>
          </div>
        </section>

        <KloaqLogos />

        <section className="kloaq-about-section kloaq-light-section">
          <div className="kloaq-vlabel">About</div>
          <div>
            <div className="kloaq-about-grid">
              <div>
                <p className="lead">
                  We are freddi.design — your dedicated design partner.
                </p>
                <p>
                  One designer on speed dial, not an agency layer cake. Campaign
                  visuals, editorial, decks and brand guidelines all stem from a
                  single hand, so the work stays coherent and the line stays
                  direct — concept to delivery, no drama.
                </p>
              </div>
              <div>
                <p>
                  Ten years and counting, working with brands that care about the
                  details — from annual reports to fragrance campaigns to the
                  brandbooks that hold it all together.
                </p>
                <p className="kloaq-about-statement">
                  Instead of adding to the <em>noise</em>, we sharpen the signal —
                  the work a brand actually gets known for.
                </p>
              </div>
            </div>
          </div>
        </section>

        <KloaqServices />
        <KloaqIndustries />
        <KloaqCTA />
      </main>
      <KloaqFooter />
      <BriefFlow />
    </div>
  );
}
