import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import PageOpener from "@/components/layout/PageOpener";
import { ArrowRight } from "lucide-react";
import Contact from "@/components/sections/Contact";
import PortfolioShowcase from "@/components/portfolio/PortfolioShowcase";
import ClientLogoRow from "@/components/portfolio/ClientLogoRow";
import { megaMenuGroups, accentClasses, spellCount, menuGroups, subPagesOf } from "@/data/pillars";
import { SITE_URL, breadcrumbNode, graph, ref, ID, jsonLdSafe } from "@/lib/schema";
import Eyebrow from "@/components/ui/Eyebrow";

/** Read from the data, never typed as a word. See `spellCount` — the page said
 *  "eight" above nine cards for as long as the ninth category existed. */
// Counts the menu's pages, the ones shown as cards below. The four CMS platform
// pages (2026-10-16) are listed under their hub rather than as cards of their
// own, so counting them would put a number above the grid that the grid does
// not show, which is the fault this constant was created to end.
const cards = menuGroups();
const count = spellCount(cards.length);
const Count = count.charAt(0).toUpperCase() + count.slice(1);

export const metadata: Metadata = pageMetadata({
  title: "Services: Marketing, Development & Design | Bilal Shafqat",
  description: `Paid marketing, website and app development, UI/UX and brand design, and CRM automation. ${Count} categories, one senior partner.`,
  path: "/services",
});


/**
 * Structured data. This page had none until 2026-09-16, which meant Google had
 * no typed description of it at all.
 */
const pageUrl = `${SITE_URL}/services`;

const schema = graph([
  {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#page`,
    url: pageUrl,
    name: "Services",
    description: `${Count} service categories across paid marketing, development, design and CRM automation, delivered by one person rather than an agency team.`,
    inLanguage: "en",
    isPartOf: ref(ID.website, "WebSite"),
    about: ref(ID.business, "ProfessionalService"),
    // Built from the same list the mega menu and the sitemap read, so a new
    // category cannot appear in one place and be missing from another.
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: megaMenuGroups.length,
      itemListElement: megaMenuGroups.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: g.title,
        url: `${SITE_URL}/services/${g.slug}`,
      })),
    },
  },
  breadcrumbNode(pageUrl, [
    { name: "Home", item: SITE_URL },
    { name: "Services", item: pageUrl },
  ]),
]);

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSafe(schema) }} />
      <main id="main" tabIndex={-1} className="flex-1 pb-16 sm:pb-20">
        <PageOpener
          crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
          eyebrow="Services"
          title={<>{Count} services, one senior partner</>}
          standfirst="Paid marketing, website and app development, design and conversion, and the CRM and automation that connects them, delivered personally from strategy to launch, without handoffs between departments."
        />

        <section className="relative section-tight">
          <div className="site-container">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {cards.map((pillar) => {
                const accent = accentClasses[pillar.accent];
                return (
                  <Link
                    key={pillar.slug}
                    href={`/services/${pillar.slug}`}
                    className="card-hover group relative flex flex-col r-card surface-1 p-8 overflow-hidden"
                  >
                    <div className={`absolute -top-12 -right-12 h-48 w-48 rounded-full blur-3xl ${accent.glow}`} />

                    <div
                      className={`relative flex h-14 w-14 items-center justify-center r-card bg-gradient-to-br ${accent.bg} border border-border`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${accent.dot}`} />
                    </div>

                    <h2 className="t-h3 relative mt-6 text-ink">
                      {pillar.title}
                    </h2>
                    <p className="relative mt-3 text-sm text-muted leading-relaxed">{pillar.metaDescription}</p>

                    <ul className="relative mt-5 flex flex-wrap gap-2">
                      {pillar.items.map((c) => (
                        <li
                          key={c.title}
                          className="rounded-full surface-2 px-3 py-1.5 text-xs text-muted"
                        >
                          {c.title}
                        </li>
                      ))}
                    </ul>

                    <span
                      className={`relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${accent.icon} group-hover:opacity-80`}
                    >
                      See what&apos;s included <ArrowRight size={15} />
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Pages that sit under a card rather than beside it: the four CMS
                platforms under CMS Development, and since 2026-10-16 the CRM
                integration pages, the four app pages and Figma. Derived from
                `parent`, so a platform page added to the data appears here
                without this file changing. A separate block because a card is
                one link and cannot hold four more inside it. */}
            {cards
              .filter((g) => subPagesOf(g.slug).length)
              .map((g) => (
                <div key={g.slug} className="mt-10 r-card surface-1 p-6 sm:p-8">
                  <h2 className="t-h4 text-ink">{g.subPagesHeading ?? `${g.title} by platform`}</h2>
                  <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {subPagesOf(g.slug).map((sub) => (
                      <li key={sub.slug}>
                        <Link
                          href={`/services/${sub.slug}`}
                          className="card-hover flex items-center justify-between gap-3 r-card surface-2 px-5 py-4 text-sm font-medium text-ink"
                        >
                          {sub.title}
                          <ArrowRight size={15} className={accentClasses[sub.accent].icon} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </section>

        {/* Work, clearly separated from the offer above. The eight sections are
            the services; this band is five real projects and says so. It moved
            here from the homepage, where it was a third restatement of the
            same offer. */}
        <PortfolioShowcase />

        {/* Evidence immediately above the CTA in <Contact />. */}
        <div className="site-container section">
          <Eyebrow as="p" tone="muted" className="text-center">
            Trusted by
          </Eyebrow>
          <ClientLogoRow variant="row" className="mt-6 justify-center" />
        </div>
      </main>
      <Contact />
    </>
  );
}
