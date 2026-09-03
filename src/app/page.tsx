import Nav from "@/components/Nav";
import HeroBanner from "@/components/HeroBanner";
import CapabilityLedger from "@/components/CapabilityLedger";
import PortfolioGrid from "@/components/PortfolioGrid";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import AskAssistant from "@/components/AskAssistant";
import LogoWall from "@/components/LogoWall";
import Process from "@/components/Process";
import WhoIWorkWith from "@/components/WhoIWorkWith";
import Engagement from "@/components/Engagement";
import Results from "@/components/Results";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <HeroBanner />
        <CapabilityLedger />
        <PortfolioGrid />
        <LogoWall />
        <Process />
        <PortfolioShowcase />
        <WhoIWorkWith />
        <Engagement />
        <Results />
        <AskAssistant />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
