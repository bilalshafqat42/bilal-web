import Nav from "@/components/Nav";
import StructuredData from "@/components/StructuredData";
import HeroBanner from "@/components/HeroBanner";
import CapabilityLedger from "@/components/CapabilityLedger";
import PortfolioGrid from "@/components/PortfolioGrid";
import Results from "@/components/Results";
import ProcessCompact from "@/components/ProcessCompact";
import Engagement from "@/components/Engagement";
import AskAssistant from "@/components/AskAssistant";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/**
 * Homepage: eight sections, down from eleven.
 *
 * The page previously made the same offer three times — a services band, a
 * partnerships section and a logo wall all restated it — and carried the full
 * pinned process on top of that. Nothing was deleted; the removed sections were
 * re-homed:
 *
 *   PortfolioShowcase  -> /services, as a "Recent work" band
 *   WhoIWorkWith       -> /about, under "Who I work with"
 *   LogoWall           -> /portfolio, as that page's intro
 *   Process (full)     -> /process, with ProcessCompact left here
 *
 * Proof was three separate sections and is now one: `Results` carries the logo
 * row, the testimonials when there are real ones, and the outcome cards.
 *
 * A server component. Several of the sections below are client components in
 * their own right, which is deliberate — the boundary stays at the leaf, never
 * on this file.
 */
export default function Home() {
  return (
    <>
      <StructuredData />
      <Nav />
      <main className="flex-1">
        <HeroBanner />
        <CapabilityLedger />
        <PortfolioGrid />
        <Results />
        <ProcessCompact />
        <Engagement />
        <AskAssistant />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
