import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import Nav from "@/components/Nav";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
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
import CtaButton from "@/components/CtaButton";
import ClientLogoRow from "@/components/ClientLogoRow";

const SITE_URL = "https://bilalshafqat.com";

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

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: category.title,
    description: category.metaDescription,
    url,
    provider: { "@type": "Person", name: "Bilal Shafqat", url: SITE_URL },
    areaServed: ["United Arab Emirates", "Worldwide"],
    dateModified: new Date().toISOString().split("T")[0],
    // Each sub-service is listed so search engines can see the page's real
    // scope rather than inferring it from prose alone.
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: category.title,
      itemListElement: sections.map(({ item }) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item.title },
      })),
    },
  };

  const faqSchema = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
      { "@type": "ListItem", position: 3, name: category.title, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      {faqSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <TrackView name={category.title} category="Service" />
      <Nav />
      <main className="flex-1 pb-16 sm:pb-20">
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
                <span className={`inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide uppercase ${accent.icon}`}>
                  {category.title}
                </span>
                <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.06] tracking-tight text-ink">
                  {category.headline}
                </h1>
                <p className="mt-6 text-lg text-muted leading-relaxed">{category.intro}</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <CtaButton href="/contact">Book a free consultation</CtaButton>
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
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
                What this covers
              </h2>
            </Reveal>
            <div className="mt-10 space-y-10">
              {sections.map(({ item, resolved }) => (
                <Reveal key={item.title}>
                  <div id={slugify(item.title)} className="scroll-mt-28 border-t border-border pt-8">
                    <h3 className="text-xl sm:text-2xl font-semibold text-ink">{item.title}</h3>
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
                <h2 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-[2.75rem]">
                  How this works in practice
                </h2>
              </Reveal>
              <div className="mt-10 space-y-12">
                {depth.blocks.map((block) => (
                  <Reveal key={block.heading}>
                    <div className="border-t border-border pt-8">
                      <h3 className="text-xl font-semibold text-ink sm:text-2xl">{block.heading}</h3>
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

        {faqs.length ? (
          <section className="relative mt-20 sm:mt-24">
            <div className="mx-auto max-w-4xl px-6">
              <Reveal>
                <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
                  Frequently asked
                </h2>
              </Reveal>
              <div className="mt-10 space-y-5">
                {faqs.map((f) => (
                  <Reveal key={f.question}>
                    <div className="rounded-2xl border border-border panel p-6">
                      <h3 className="font-semibold text-ink">{f.question}</h3>
                      <p className="mt-2.5 text-sm text-muted leading-relaxed">{f.answer}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* Every answer above ends a visitor's question. This is the next
                  step, offered three ways because people differ on how they
                  want to start a conversation. */}
              <Reveal>
                <div className="mt-10 rounded-2xl border border-border panel p-6 sm:p-8">
                  <h3 className="text-lg font-semibold text-ink sm:text-xl">
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
                    <a
                      href="https://wa.me/971529766006"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white/5"
                    >
                      WhatsApp
                    </a>
                    <a
                      href="mailto:bilalshafqat42@gmail.com"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white/5"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        ) : null}

        <section className="relative mt-20 sm:mt-24">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <h2 className="text-2xl font-semibold text-ink">Other services</h2>
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

        <Contact />
      </main>
      <Footer />
    </>
  );
}
