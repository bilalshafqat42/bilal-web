import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Contact from "@/components/Contact";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import ClientLogoRow from "@/components/ClientLogoRow";
import { megaMenuGroups, accentClasses, spellCount } from "@/data/pillars";
import { SITE_URL, breadcrumbNode, graph, ref, ID } from "@/lib/schema";

/** Read from the data, never typed as a word. See `spellCount` — the page said
 *  "eight" above nine cards for as long as the ninth category existed. */
const count = spellCount(megaMenuGroups.length);
const Count = count.charAt(0).toUpperCase() + count.slice(1);

export const metadata: Metadata = {
  title: "Services — Marketing, Development & Design | Bilal Shafqat",
  description: `Paid marketing, website and app development, UI/UX and brand design, and CRM automation. ${Count} categories, one senior partner.`,
  alternates: {
    canonical: "/services",
  },
};


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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main id="main" tabIndex={-1} className="flex-1 pb-16 sm:pb-20">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
              Services
            </span>
            <h1 className="t-h1 mt-5 text-ink">
              {Count} services, one senior partner
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted leading-relaxed">
              Paid marketing, website and app development, design and conversion,
              and the CRM and automation that connects them, delivered
              personally from strategy to launch, without handoffs between
              departments.
            </p>
          </div>
        </section>

        <section className="relative mt-16 sm:mt-20">
          <div className="site-container">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {megaMenuGroups.map((pillar) => {
                const accent = accentClasses[pillar.accent];
                return (
                  <Link
                    key={pillar.slug}
                    href={`/services/${pillar.slug}`}
                    className="card-hover group relative flex flex-col rounded-2xl border border-border panel p-8 overflow-hidden"
                  >
                    <div className={`absolute -top-12 -right-12 h-48 w-48 rounded-full blur-3xl ${accent.glow}`} />

                    <div
                      className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent.bg} border border-border`}
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
                          className="rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted"
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
          </div>
        </section>

        {/* Work, clearly separated from the offer above. The eight sections are
            the services; this band is five real projects and says so. It moved
            here from the homepage, where it was a third restatement of the
            same offer. */}
        <PortfolioShowcase />

        {/* Evidence immediately above the CTA in <Contact />. */}
        <div className="site-container mt-20 sm:mt-24">
          <p className="text-center font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
            Trusted by
          </p>
          <ClientLogoRow variant="row" className="mt-6 justify-center" />
        </div>
      </main>
      <Contact />
    </>
  );
}
