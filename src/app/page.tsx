import type { Metadata } from "next";
import StructuredData from "@/components/seo/StructuredData";
import { HOME_DESCRIPTION, HOME_TITLE, pageMetadata } from "@/lib/site";
import HeroBanner from "@/components/home/HeroBanner";
import DisciplineStatement from "@/components/home/DisciplineStatement";
import HomeParallax from "@/components/home/HomeParallax";
import AboutSplit from "@/components/home/AboutSplit";
import CapabilityLedger from "@/components/home/CapabilityLedger";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import Results from "@/components/home/Results";
import ProcessCompact from "@/components/home/ProcessCompact";
import Engagement from "@/components/sections/Engagement";
import HomeFaq from "@/components/home/HomeFaq";
import Contact from "@/components/sections/Contact";

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
/**
 * Title and description are the layout's, restated so the share card can carry
 * an `og:url`. It is set here and not in the layout because Next inherits a
 * parent's `openGraph` whole: an `og:url` of "/" in the layout would be claimed
 * by every page that does not declare its own card.
 *
 * `alternates` is dropped so the layout's, with the RSS link, still applies.
 */
const { alternates: _alternates, ...homeMetadata } = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
});
void _alternates;

export const metadata: Metadata = homeMetadata;

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
        <HomeFaq />
        <Contact />
      </main>
    </>
  );
}
