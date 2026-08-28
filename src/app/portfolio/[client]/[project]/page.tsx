import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { CaptureFrame, GalleryGrid, FactStrip } from "@/components/CaseStudyParts";
import { clients, getProject } from "@/data/caseStudies";

const SITE = "https://bilalshafqat.com";

type Props = { params: Promise<{ client: string; project: string }> };

export function generateStaticParams() {
  return clients.flatMap((c) => c.projects.map((p) => ({ client: c.slug, project: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { client, project } = await params;
  const found = getProject(client, project);
  if (!found) return {};
  const { client: c, project: p } = found;
  const title = `${p.name} — ${c.name} Campaign Case Study`;
  const url = `/portfolio/${c.slug}/${p.slug}`;
  return {
    title,
    description: p.cardBlurb,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: p.cardBlurb,
      type: "article",
      url,
      images: [{ url: c.ogImage, width: 1200, height: 630, alt: `${p.name} campaign creative` }],
    },
    twitter: { card: "summary_large_image", title, description: p.cardBlurb, images: [c.ogImage] },
  };
}

export default async function ProjectCaseStudy({ params }: Props) {
  const { client, project } = await params;
  const found = getProject(client, project);
  if (!found) notFound();
  const { client: c, project: p } = found;

  const url = `${SITE}/portfolio/${c.slug}/${p.slug}`;
  const siblings = c.projects.filter((x) => x.slug !== p.slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${p.name} — campaign case study`,
    headline: p.headline,
    description: p.summary,
    url,
    inLanguage: "en",
    dateModified: new Date().toISOString().split("T")[0],
    genre: "Real estate marketing case study",
    image: `${SITE}${p.cardImage}`,
    creator: {
      "@type": "Person",
      name: "Bilal Shafqat",
      url: SITE,
      jobTitle: "Digital Marketing, Design & Development Specialist",
    },
    about: { "@type": "Organization", name: c.name },
    isPartOf: { "@type": "CreativeWork", name: c.name, url: `${SITE}/portfolio/${c.slug}` },
    ...(p.place
      ? {
          mentions: [
            {
              "@type": "ApartmentComplex",
              name: p.name,
              description: p.place.description,
              ...(p.place.units ? { numberOfAccommodationUnits: p.place.units } : {}),
              address: {
                "@type": "PostalAddress",
                addressLocality: p.place.locality,
                addressRegion: p.place.region,
                addressCountry: "AE",
              },
            },
          ],
        }
      : {}),
    keywords: p.keywords,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Work", item: `${SITE}/portfolio` },
      { "@type": "ListItem", position: 3, name: c.name, item: `${SITE}/portfolio/${c.slug}` },
      { "@type": "ListItem", position: 4, name: p.name, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Nav />
      <main className="flex-1 pb-16 sm:pb-20">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-7xl px-6">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
              <a href="/" className="hover:text-ink transition-colors">Home</a>
              <ChevronRight size={13} />
              <a href="/portfolio" className="hover:text-ink transition-colors">Work</a>
              <ChevronRight size={13} />
              <a href={`/portfolio/${c.slug}`} className="hover:text-ink transition-colors">{c.name}</a>
              <ChevronRight size={13} />
              <span className="text-ink">{p.name}</span>
            </nav>

            <Reveal>
              <div className="mt-8 max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
                  Development campaign
                </span>
                {p.logo ? (
                  <Image src={p.logo} alt={p.name} width={900} height={1983} priority className="mt-6 h-16 w-auto" />
                ) : null}
                <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.06] tracking-tight text-ink">
                  {p.headline}
                </h1>
                <p className="mt-6 text-lg text-muted leading-relaxed">{p.summary}</p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 max-w-4xl">
                <FactStrip facts={p.facts} />
              </div>
            </Reveal>
          </div>
        </section>

        {p.landingPage ? (
          <section className="relative mt-20 sm:mt-28">
            <div className="mx-auto max-w-7xl px-6">
              <Reveal>
                <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
                  {p.landingPage.heading}
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-muted leading-relaxed">{p.landingPage.body}</p>
              </Reveal>
              <Reveal delay={0.1}>
                <div
                  className={`mt-10 ${
                    p.landingPage.mobileCapture
                      ? "grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] lg:items-start"
                      : ""
                  }`}
                >
                  <CaptureFrame capture={p.landingPage.capture} />
                  {p.landingPage.mobileCapture ? (
                    <div className="mx-auto w-full max-w-[280px] lg:max-w-none">
                      <CaptureFrame capture={p.landingPage.mobileCapture} variant="phone" />
                    </div>
                  ) : null}
                </div>
              </Reveal>
            </div>
          </section>
        ) : null}

        {p.gallery ? (
          <section className="relative mt-20 sm:mt-28">
            <div className="mx-auto max-w-7xl px-6">
              <Reveal>
                <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
                  {p.gallery.heading}
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-muted leading-relaxed">{p.gallery.body}</p>
              </Reveal>
              <GalleryGrid gallery={p.gallery} />
            </div>
          </section>
        ) : null}

        <section className="relative mt-20 sm:mt-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 border-t border-border pt-10">
              <a
                href={`/portfolio/${c.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-gold transition-colors"
              >
                <ArrowLeft size={15} /> All {c.name} work
              </a>
              {siblings.length > 0 ? (
                <div className="flex flex-wrap items-center gap-4">
                  {siblings.map((s) => (
                    <a
                      key={s.slug}
                      href={`/portfolio/${c.slug}/${s.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:opacity-80 transition-opacity"
                    >
                      {s.name} <ArrowRight size={15} />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="relative mt-16 sm:mt-20">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] border border-border glass-strong px-8 py-14 text-center sm:px-16">
                <div
                  className="blob pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/50"
                  style={{ animationDelay: "-4s" }}
                />
                <div className="relative">
                  <h2 className="text-3xl sm:text-4xl font-semibold leading-tight text-ink">
                    Need this for your launch? <span className="text-gradient">Let&apos;s talk.</span>
                  </h2>
                  <a href="/contact" className="btn-primary mt-9 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold">
                    Book a free consultation <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
