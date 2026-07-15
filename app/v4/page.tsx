import type { Metadata } from "next";
import "@/styles/kloaq.css";
import KloaqNavbar from "@/components/v2/KloaqNavbar";
import HeroStatementV4 from "@/components/v4/HeroStatementV4";
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
        {/* The statement hero, now responsive on its own down to 375px (the
            split columns stack below lg). No separate mobile carousel. */}
        <HeroStatementV4 />

        {/* What I Do moved directly under the hero (mirrors app/page.tsx) —
            hero states what I make, this is what I do; also splits the old
            back-to-back cream About+Services pair. */}
        <KloaqServices />

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

        {/* About middle paragraphs reworded so they no longer repeat the hero
            feet verbatim (mirrors app/page.tsx). */}
        <section className="kloaq-about-section kloaq-light-section">
          <div className="kloaq-vlabel">About</div>
          <div>
            <div className="kloaq-about-grid">
              <div>
                <p className="lead">
                  We are freddi.design — your dedicated design partner.
                </p>
                <p>
                  You brief one small team and that team stays with it — no account
                  layer, no handoffs between departments, no telephone game between
                  the idea and the file that ships. The thinking and the making are
                  the same two hands, so nothing gets lost in translation.
                </p>
              </div>
              <div>
                <p>
                  That&apos;s how the work stays coherent across a whole brand —
                  the identity, the campaign, the deck and the guidelines all
                  speak in one voice because they come from one place. Fast when
                  it needs to be, considered where it counts.
                </p>
                <p className="kloaq-about-statement">
                  Instead of adding to the <em>noise</em>, we sharpen the signal —
                  the work a brand actually gets known for.
                </p>
              </div>
            </div>
          </div>
        </section>

        <KloaqIndustries />
        <KloaqCTA />
      </main>
      <KloaqFooter />
      <BriefFlow />
    </div>
  );
}
