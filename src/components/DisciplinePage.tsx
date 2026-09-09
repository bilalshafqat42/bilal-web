import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal, { RevealStagger, RevealItem } from "@/components/Reveal";
import CtaButton from "@/components/CtaButton";
import {
  disciplines,
  getDiscipline,
  disciplineItems,
  hasPortfolioPage,
  disciplineHref,
  disciplineCount,
} from "@/data/disciplines";
import type { Item } from "@/lib/portfolioItems";
import { SITE_URL, breadcrumbNode, faqNode, graph, ref, ID } from "@/lib/schema";

/**
 * One component behind every `/portfolio/{discipline}` page.
 *
 * The routes are explicit folders rather than a `[discipline]` dynamic segment
 * because `/portfolio/[client]` already occupies that slot, and Next.js does
 * not allow two dynamic segments as siblings. Explicit folders also resolve
 * before the dynamic one, so there is no chance of a client slug and a
 * discipline slug fighting over the same URL. `scripts/discipline-check.mjs`
 * asserts the folders and the data stay in step.
 *
 * `notFound()` rather than a rendered empty state when a discipline has no
 * work: an indexed page listing nothing is worse for the site than a 404.
 */

/** The three shapes an artefact comes in. A single grid cannot serve all of
 *  them — a 1:5 page capture in a square cell is a meaningless middle slice,
 *  and a 1:2.17 phone screen in a 16:10 cell is two thin bars of background. */
function ItemGrid({ items }: { items: Item[] }) {
  const wide = items.filter((i) => i.kind === "site-desktop");
  const tall = items.filter((i) => i.kind === "site-mobile" || i.kind === "app-screen");
  const square = items.filter((i) => i.kind === "social");

  return (
    <>
      {wide.length > 0 ? (
        <RevealStagger className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {wide.map((it) => (
            <RevealItem key={it.key}>
              <Link
                href={it.href}
                className="card-hover group block overflow-hidden rounded-2xl border border-border bg-surface/40"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={it.src}
                    alt={it.alt}
                    fill
                    sizes="(min-width: 640px) 45vw, 92vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-start justify-between gap-3 border-t border-border px-5 py-4">
                  <span>
                    <span className="block text-sm font-semibold text-ink">{it.label}</span>
                    <span className="mt-0.5 block text-xs text-muted">{it.meta}</span>
                  </span>
                  <ArrowUpRight
                    size={15}
                    className="mt-0.5 shrink-0 text-muted transition-colors group-hover:text-gold"
                  />
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      ) : null}

      {tall.length > 0 ? (
        <RevealStagger className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {tall.map((it) => (
            <RevealItem key={it.key}>
              <Link
                href={it.href}
                className="card-hover group block overflow-hidden rounded-2xl border border-border bg-surface/40"
              >
                <div className="relative aspect-[1206/2622] overflow-hidden">
                  <Image
                    src={it.src}
                    alt={it.alt}
                    fill
                    sizes="(min-width: 1024px) 18vw, 45vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="border-t border-border px-4 py-3">
                  <span className="block text-xs font-semibold text-ink">{it.label}</span>
                  <span className="mt-0.5 block text-[0.7rem] leading-relaxed text-muted">{it.meta}</span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      ) : null}

      {square.length > 0 ? (
        <RevealStagger className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {square.map((it) => (
            <RevealItem key={it.key}>
              <Link
                href={it.href}
                className="card-hover group block overflow-hidden rounded-2xl border border-border bg-surface/40"
              >
                <Image
                  src={it.src}
                  alt={it.alt}
                  width={it.width}
                  height={it.height}
                  sizes="(min-width: 1024px) 300px, 45vw"
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted">
                  {it.meta}
                </p>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      ) : null}
    </>
  );
}

export function disciplineMetadata(slug: string): Metadata {
  const d = getDiscipline(slug);
  if (!d?.page) return {};
  return {
    title: d.page.metaTitle,
    description: d.page.metaDescription,
    alternates: { canonical: `/portfolio/${d.slug}` },
    openGraph: {
      title: d.page.metaTitle,
      description: d.page.metaDescription,
      type: "website",
      url: `/portfolio/${d.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: d.page.metaTitle,
      description: d.page.metaDescription,
    },
  };
}

export default function DisciplinePage({ slug }: { slug: string }) {
  const d = getDiscipline(slug);
  if (!d?.page || !hasPortfolioPage(d)) notFound();

  const items = disciplineItems(d);
  const url = `${SITE_URL}/portfolio/${d.slug}`;

  // Siblings that have their own page, so a visitor who arrived on the wrong
  // cut of the same work can get to the right one in a click. Every internal
  // link on this page resolves to a page with content — nothing points at an
  // empty discipline.
  const siblings = disciplines.filter((x) => x.slug !== d.slug && hasPortfolioPage(x));

  const schema = graph([
    {
      "@type": "CollectionPage",
      "@id": `${url}#page`,
      url,
      name: d.page.metaTitle,
      description: d.page.metaDescription,
      inLanguage: "en",
      isPartOf: ref(ID.website, "WebSite"),
      about: ref(ID.business, "ProfessionalService"),
      author: ref(ID.person, "Person"),
      // Only the artefacts actually rendered above, and only their real alt
      // text. A count or a caption here that a visitor cannot see on the page
      // is the mismatch that earns a manual action.
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: items.length,
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${it.label} — ${it.meta}`,
          url: `${SITE_URL}${it.href.split("#")[0]}`,
        })),
      },
    },
    breadcrumbNode(url, [
      { name: "Home", item: SITE_URL },
      { name: "Portfolio", item: `${SITE_URL}/portfolio` },
      { name: d.title, item: url },
    ]),
    faqNode(url, d.page.faqs),
  ]);

  return (
    <>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main className="flex-1 pt-28">
        <section className="site-container">
          <Reveal>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted">
              <Link href="/" className="transition-colors hover:text-ink">Home</Link>
              <ChevronRight size={14} className="text-muted/50" />
              <Link href="/portfolio" className="transition-colors hover:text-ink">Portfolio</Link>
              <ChevronRight size={14} className="text-muted/50" />
              <span className="text-ink">{d.title}</span>
            </nav>

            <span className="mt-8 block font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
              {d.title} · {items.length} {items.length === 1 ? "piece" : "pieces"}
            </span>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
              {d.page.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {d.page.intro}
            </p>

            {/* Why this page exists next to its siblings. Several of these cuts
                draw on overlapping captures, and saying so is better than
                letting a reader wonder whether they have looped. */}
            <p className="mt-8 max-w-2xl border-l-2 border-gold/60 pl-5 text-sm leading-relaxed text-muted/85">
              {d.page.lens}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <CtaButton href="/appointment">Book a free consultation</CtaButton>
              <Link
                href={d.serviceHref}
                className="text-sm font-semibold text-ink underline decoration-gold/50 decoration-2 underline-offset-4 transition-colors hover:text-gold"
              >
                What this service includes
              </Link>
            </div>
          </Reveal>
        </section>

        <section id="design" className="site-container scroll-mt-28 pt-16 sm:pt-20">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-4">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">The work</h2>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                {items.length} {items.length === 1 ? "capture" : "captures"}
              </span>
            </div>
          </Reveal>
          <ItemGrid items={items} />
        </section>

        <section className="site-container pt-20 sm:pt-24">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Common questions</h2>
            <dl className="mt-8 max-w-3xl divide-y divide-border border-y border-border">
              {d.page.faqs.map((f) => (
                <div key={f.question} className="py-6">
                  <dt className="text-base font-semibold text-ink">{f.question}</dt>
                  <dd className="mt-2.5 text-sm leading-relaxed text-muted">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </section>

        <section className="site-container py-20 sm:py-24">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Browse another discipline</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={disciplineHref(s)}
                  className="card-hover group rounded-2xl border border-border panel p-6"
                >
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted/70">
                    {disciplineCount(s)} pieces
                  </span>
                  <span className="mt-2.5 flex items-center justify-between gap-3 text-base font-semibold text-ink">
                    {s.title}
                    <ArrowRight size={16} className="shrink-0 text-muted transition-colors group-hover:text-gold" />
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted">{s.blurb}</span>
                </Link>
              ))}
            </div>
            <Link
              href="/portfolio"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
            >
              The full portfolio <ArrowRight size={15} />
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
