import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import CaseStudies from "@/components/CaseStudies";
import About from "@/components/About";
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
        <Hero />
        <Services />
        <CaseStudies />
        <About />
        <Process />
        <WhoIWorkWith />
        <Engagement />
        <Results />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
