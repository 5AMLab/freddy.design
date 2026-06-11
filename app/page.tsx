import NavbarV2 from "@/components/v2/NavbarV2";
import HeroV2 from "@/components/v2/HeroV2";
import CookieBanner from "@/components/v2/CookieBanner";
import MarqueeV2 from "@/components/v2/MarqueeV2";
import LogosV2 from "@/components/v2/LogosV2";
import ServicesV2 from "@/components/v2/ServicesV2";
import PortfolioV2 from "@/components/v2/PortfolioV2";
import HowItWorksV2 from "@/components/v2/HowItWorksV2";
import PricingV2 from "@/components/v2/PricingV2";
import IndustriesV2 from "@/components/v2/IndustriesV2";
import CTAV2 from "@/components/v2/CTAV2";
import FooterV2 from "@/components/v2/FooterV2";
import BriefFlow from "@/components/v2/BriefFlow";

export default function Home() {
  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", width: "100%" }}>
      <NavbarV2 />
      <main>
        <HeroV2 />
        <MarqueeV2 />
        <LogosV2 />
        <ServicesV2 />
        <PortfolioV2 />
        <HowItWorksV2 />
        <PricingV2 />
        <IndustriesV2 />
        <CTAV2 />
      </main>
      <FooterV2 />
      <BriefFlow />
      <CookieBanner />
    </div>
  );
}
