import type { Metadata } from "next";
import "@/styles/kloaq.css";
import KloaqNavbar from "@/components/v2/KloaqNavbar";
import HeroPanelV5 from "@/components/v4/HeroPanelV5";
import KloaqLogos from "@/components/v2/KloaqLogos";
import KloaqPortfolio from "@/components/v2/KloaqPortfolio";
import KloaqServices from "@/components/v2/KloaqServices";
import KloaqIndustries from "@/components/v2/KloaqIndustries";
import KloaqFooter from "@/components/v2/KloaqFooter";
import BriefFlow from "@/components/v2/BriefFlow";

/**
 * REVIEW MOCKUP — the bounded-panel hero (see HeroPanelV5).
 *
 * Unlinked from the site nav and noindexed. The live homepage (app/page.tsx)
 * is untouched and still runs HeroStatementV4, so the two can be compared
 * side by side: `/` for the full-bleed-backdrop hero, `/v5` for this one.
 *
 * Everything below the hero is app/page.tsx verbatim, so the candidate is
 * judged in real page context rather than in isolation. Promoting it means
 * swapping the hero import in app/page.tsx and deleting this route.
 */
export const metadata: Metadata = {
  title: "Studio Kavea — hero v5 mockup",
  robots: { index: false, follow: false },
};

export default function HeroV5Review() {
  return (
    <div className="kloaq-root" style={{ minHeight: "100vh", width: "100%" }}>
      <KloaqNavbar />
      <main>
        <HeroPanelV5 />

        <section className="kloaq-logos-intro-section">
          <div className="kloaq-vlabel fade-up">Inside Kavea</div>
          <div className="kloaq-logos-intro">
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

        <KloaqPortfolio />
        <KloaqServices />
        <KloaqIndustries variant="manifesto" />
      </main>
      <KloaqFooter />
      <BriefFlow />
    </div>
  );
}
