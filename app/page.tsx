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
 * Homepage — the Kloaq design language is the site default: Boldonse +
 * Inter Tight typography, Flameburst-orange accent, 14px image rectangles.
 */
export default function Home() {
  return (
    <div className="kloaq-root" style={{ minHeight: "100vh", width: "100%" }}>
      <KloaqNavbar />
      <main>
        {/* Hero: the statement-led "receipts" split hero (HeroStatementV4).
            It is now fully responsive on its own — the split columns stack into
            a single centered column below lg (1024px) and hold their content
            (label, retainer line, all six service nouns, the object, the About
            feet) all the way down to 375px. No separate mobile-carousel hero:
            one component, one message, every breakpoint. */}
        <HeroStatementV4 />

        {/* What I Do — numbered service rows. Moved up directly under the hero:
            the hero states WHAT I make (the six service nouns), so the natural
            next beat is WHAT I DO (those services in full) before the proof
            block. Also breaks up the old back-to-back cream About+Services pair
            — the fields now alternate ink→cream→ink→ink→cream→ink cleanly. */}
        <KloaqServices />

        {/* Intro — mirrors the About section's grid so both align down the page */}
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

        {/* Logo wall */}
        <KloaqLogos />

        {/* About — flat two-column text + accented closing statement. The two
            middle paragraphs used to repeat the hero feet ("One designer on
            speed dial…" / "Ten years and counting…") verbatim; reworded here so
            About adds new substance (how the work runs, what stays consistent)
            instead of echoing the hero. */}
        <section className="kloaq-about-section kloaq-light-section">
          <div className="kloaq-vlabel">About</div>
          <div>
            <div className="kloaq-about-grid">
              <div>
                <p className="lead">
                  We are freddi.design — your dedicated design partner.
                </p>
                <p>
                  You brief one person and that person stays with it — no account
                  layer, no handoffs between teams, no telephone game between the
                  idea and the file that ships. The thinking and the making are
                  the same hand, so nothing gets lost in translation.
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

        {/* Industries — horizontal marquee */}
        <KloaqIndustries />

        <KloaqCTA />
      </main>
      <KloaqFooter />
      <BriefFlow />
    </div>
  );
}
