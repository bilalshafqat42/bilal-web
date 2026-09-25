import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import Contact from "@/components/Contact";
import { ServiceProof } from "@/components/ProofLoop";
import Reveal from "@/components/Reveal";
import FaqSection from "@/components/FaqSection";
import {
  megaMenuGroups,
  accentClasses,
  getCategoryBySlug,
  resolveItem,
  slugify,
} from "@/data/pillars";
import { serviceDepth } from "@/data/serviceDepth";
import TrackView from "@/components/TrackView";
import InlineLeadForm from "@/components/InlineLeadForm";
import WhatsAppLink from "@/components/WhatsAppLink";
import CtaButton from "@/components/CtaButton";
import ClientLogoRow from "@/components/ClientLogoRow";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, serviceNode, faqNode, breadcrumbNode } from "@/lib/schema";
import { OG_IMAGES } from "@/lib/ogImage";


type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return megaMenuGroups.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategoryBySlug(slug);
  if (!c) return {};
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: `/services/${c.slug}` },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      type: "website",
      url: `/services/${c.slug}`,
      images: OG_IMAGES,
    },
  };
}

export default async function ServiceCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const accent = accentClasses[category.accent];
  const sections = category.items
    .map((item) => ({ item, resolved: resolveItem(item) }))
    .filter((x) => x.resolved);
  const depth = serviceDepth[category.slug];
  const faqs = [...category.faqs, ...(depth?.faqs ?? [])];
  const others = megaMenuGroups.filter((c) => c.slug !== category.slug);
  const url = `${SITE_URL}/services/${category.slug}`;

  // One graph per page, keyed by @id, rather than three unlinked blocks each
  // restating who the provider is. `provider` now points at #business instead
  // of inlining a second Person node.
  const nodes: object[] = [
    {
      ...serviceNode({
        name: category.title,
        description: category.metaDescription,
        serviceType: category.title,
        url,
      }),
      // Each sub-service is listed so search engines see the page's real scope
      // rather than inferring it from prose alone. Names come from the page's
      // own section headings.
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: category.title,
        itemListElement: sections.map(({ item }) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: item.title },
        })),
      },
    },
    breadcrumbNode(url, [
      { name: "Home", item: SITE_URL },
      { name: "Services", item: `${SITE_URL}/services` },
      { name: category.title, item: url },
    ]),
  ];

  // Only when the page actually renders them. Every question below is on the
  // page in visible text; audited across all eight service pages.
  if (faqs.length) {
    nodes.push(faqNode(url, faqs.map((f) => ({ question: f.question, answer: f.answer }))));
  }

  return (
    <>
      <JsonLd nodes={nodes} />
      <TrackView name={category.title} category="Service" />
      <main id="main" tabIndex={-1} className="flex-1 pb-16 sm:pb-20">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-4xl px-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted">
              <Link href="/" className="hover:text-ink transition-colors">Home</Link>
              <ChevronRight size={13} />
              <Link href="/services" className="hover:text-ink transition-colors">Services</Link>
              <ChevronRight size={13} />
              <span className="text-ink">{category.title}</span>
            </nav>

            <Reveal>
              <div className="mt-8">
                <span className={`inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] ${accent.icon}`}>
                  {category.title}
                </span>
                <h1 className="t-h1 mt-5 text-ink">
                  {category.headline}
                </h1>
                <p className="mt-6 text-lg text-muted leading-relaxed">{category.intro}</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <CtaButton href="/appointment">Book a free consultation</CtaButton>
                  <Link href="/portfolio" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink hover:bg-white/5 transition-colors">
                    See related work
                  </Link>
                </div>

                {/* Evidence directly under the CTA, and a route to the buying
                    question that follows it. */}
                <ClientLogoRow variant="row" className="mt-10 justify-start" />
                <Link
                  href="/pricing#engagement"
                  className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
                >
                  How engagements work <ArrowRight size={15} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative mt-20 sm:mt-24">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">Scope</span>
              <h2 className="t-h2 mt-4 text-ink">
                What this covers
              </h2>
            </Reveal>
            <div className="mt-10 space-y-10">
              {sections.map(({ item, resolved }) => (
                <Reveal key={item.title}>
                  <div id={slugify(item.title)} className="scroll-mt-28 border-t border-border pt-8">
                    <h3 className="t-h4 text-ink">{item.title}</h3>
                    <p className="mt-3 text-muted leading-relaxed">{resolved!.section.body}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {resolved!.section.bullets.map((b) => (
                        <li key={b} className="rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-xs text-muted">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {depth ? (
          <section className="relative mt-20 sm:mt-24">
            <div className="mx-auto max-w-4xl px-6">
              <Reveal>
                <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">Process</span>
                <h2 className="t-h2 mt-4 text-ink">
                  How this works in practice
                </h2>
              </Reveal>
              <div className="mt-10 space-y-12">
                {depth.blocks.map((block) => (
                  <Reveal key={block.heading}>
                    <div className="border-t border-border pt-8">
                      <h3 className="t-h4 text-ink">{block.heading}</h3>
                      <div className="mt-4 space-y-4">
                        {block.paragraphs.map((para) => (
                          <p key={para.slice(0, 40)} className="text-base leading-relaxed text-muted">
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <FaqSection eyebrow="Questions" title="Frequently asked" faqs={faqs} className="mt-20 sm:mt-24" />

        {faqs.length ? (
          <section className="relative mt-12">
            <div className="site-container">
          {/* Every answer above ends a visitor's question. This is the next
              step, offered three ways because people differ on how they
              want to start a conversation. */}
          <Reveal>
            <div className="mt-10 rounded-2xl border border-border panel p-6 sm:p-8">
              <h3 className="t-h4 text-ink">
                Still not sure if this is what you need?
              </h3>
              <p className="mt-2.5 text-base leading-relaxed text-muted">
                Send it here and it comes straight to me. You will get a
                straight answer about whether I am the right fit, including
                when the answer is no.
              </p>

              {/* The form sits on the page rather than behind a link. Someone
                  who has just read this page has already told us what they
                  want; making them restate it elsewhere loses them. */}
              <InlineLeadForm service={category.title} />

              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
                <span className="text-sm text-muted">Prefer another way?</span>
                <Link
                  href="/appointment"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white/5"
                >
                  Book a call <ArrowRight size={14} />
                </Link>
                <WhatsAppLink
                  context={`service-page:${category.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white/5"
                >
                  WhatsApp
                </WhatsAppLink>
              </div>
            </div>
          </Reveal>
            </div>
          </section>
        ) : null}

        <section className="relative mt-20 sm:mt-24">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <h2 className="t-h3 text-ink">Other services</h2>
            </Reveal>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/services/${o.slug}`}
                  className="card-hover flex items-center justify-between gap-3 rounded-2xl border border-border panel px-5 py-4 text-sm font-medium text-ink"
                >
                  {o.title}
                  <ArrowRight size={15} className={accentClasses[o.accent].icon} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Proof loop: the work behind this service. Renders nothing for a
            service with no published work. */}
        <ServiceProof serviceSlug={category.slug} />

        <Contact />
      </main>
    </>
  );
}
