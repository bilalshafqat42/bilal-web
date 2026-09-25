import StructuredData from "@/components/StructuredData";
import HeroBanner from "@/components/HeroBanner";
import DisciplineStatement from "@/components/DisciplineStatement";
import HomeParallax from "@/components/HomeParallax";
import AboutSplit from "@/components/AboutSplit";
import CapabilityLedger from "@/components/CapabilityLedger";
import PortfolioGrid from "@/components/PortfolioGrid";
import Results from "@/components/Results";
import ProcessCompact from "@/components/ProcessCompact";
import Engagement from "@/components/Engagement";
import AskAssistant from "@/components/AskAssistant";
import Contact from "@/components/Contact";

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
      <main id="main" tabIndex={-1} className="flex-1">
        {/* The opener and the hero move as a pair: the statement pinned
            behind and drifting down, the hero riding over it and widening from
            80% to full bleed as it reaches the header. See `HomeParallax` —
            including why it is not GSAP. */}
        <HomeParallax
          opener={<DisciplineStatement />}
          hero={<HeroBanner />}
          after={<AboutSplit />}
        />
        {/* Pulled up one window, so it is **already sitting behind** the about
            band rather than arriving after it. The band lifts off it at the end
            of its scroll range and this is what is underneath — see the lift in
            `AboutSplit`. `z-[15]` puts it under that band (z-20) and over the
            hero (z-10); `motion-safe:lg:` because without the lift there is
            nothing to be behind, and the overlap would simply hide it.

            **`bg-bg` is not cosmetic.** `CapabilityLedger` has never painted a
            ground of its own — it did not need one while it sat in normal flow
            over the page background. Pulled up over the pinned hero it was
            transparent, so the hero photograph showed straight through the
            capability list and the two sections rendered on top of each other.
            Bilal sent a screenshot of exactly that. */}
        <div className="relative z-[15] bg-bg motion-safe:lg:-mt-[100svh]">
          <CapabilityLedger />
        </div>
        <PortfolioGrid />
        <Results />
        <ProcessCompact />
        <Engagement />
        <AskAssistant />
        <Contact />
      </main>
    </>
  );
}
