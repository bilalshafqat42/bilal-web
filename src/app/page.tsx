import Nav from "@/components/Nav";
import HeroAlt from "@/components/HeroAlt";
import Services from "@/components/Services";
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
        <HeroAlt />
        <Services />
        <PortfolioShowcase />
        <LogoWall />
        <Process />
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
