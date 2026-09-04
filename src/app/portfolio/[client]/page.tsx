import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import Nav from "@/components/Nav";
import TrackView from "@/components/TrackView";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { CaptureFrame, GalleryGrid, FactStrip } from "@/components/CaseStudyParts";
import { clients, getClient } from "@/data/caseStudies";
import CtaButton from "@/components/CtaButton";

const SITE = "https://bilalshafqat.com";

type Props = { params: Promise<{ client: string }> };

export function generateStaticParams() {
  return clients.map((c) => ({ client: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { client } = await params;
  const c = getClient(client);
  if (!c) return {};
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: `/portfolio/${c.slug}` },
    openGraph: {
      title: c.title,
      description: c.description,
      type: "article",
      url: `/portfolio/${c.slug}`,
      images: [{ url: c.ogImage, width: 1200, height: 630, alt: `${c.name} campaign creative` }],
    },
    twitter: { card: "summary_large_image", title: c.title, description: c.description, images: [c.ogImage] },
  };
}

export default async function ClientCaseStudy({ params }: Props) {
  const { client } = await params;
  const c = getClient(client);
  if (!c) notFound();

  const url = `${SITE}/portfolio/${c.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${c.name} — ${c.headline}`,
    headline: c.title,
    description: c.description,
    url,
    inLanguage: "en",
    dateModified: new Date().toISOString().split("T")[0],
    genre: "Real estate marketing case study",
    image: `${SITE}${c.ogImage}`,
    creator: {
      "@type": "Person",
      name: "Bilal Shafqat",
      url: SITE,
      jobTitle: "Digital Marketing, Design & Development Specialist",
    },
    about: { "@type": "Organization", name: c.name, description: c.intro },
    hasPart: c.projects.map((p) => ({
      "@type": "CreativeWork",
      name: p.name,
      url: `${url}/${p.slug}`,
      description: p.cardBlurb,
    })),
    keywords: c.keywords,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Work", item: `${SITE}/portfolio` },
      { "@type": "ListItem", position: 3, name: c.name, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <TrackView name={c.name} category="Client" />
      <Nav />
      <main className="flex-1 pb-16 sm:pb-20">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="site-container relative">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted">
              <Link href="/" className="hover:text-ink transition-colors">Home</Link>
              <ChevronRight size={13} />
              <Link href="/portfolio" className="hover:text-ink transition-colors">Work</Link>
              <ChevronRight size={13} />
              <span className="text-ink">{c.name}</span>
            </nav>

            <Reveal>
              <div className="mt-8 max-w-3xl">
                <Image src={c.logo} alt={c.name} width={2000} height={551} priority className="h-10 w-auto" />
                <h1 className="mt-7 text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
                  {c.headline}
                </h1>
                <p className="mt-6 text-lg text-muted leading-relaxed">{c.intro}</p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 max-w-3xl">
                <FactStrip facts={c.facts} />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative mt-20 sm:mt-28">
          <div className="site-container">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
                Scope of work
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-muted leading-relaxed">{c.scopeIntro}</p>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {c.scope.map((s) => (
                <Reveal key={s.heading}>
                  <div className="h-full rounded-2xl border border-border panel p-7">
                    <h3 className="text-lg font-semibold text-ink">{s.heading}</h3>
                    <p className="mt-3 text-sm text-muted leading-relaxed">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {c.website ? (
          <section className="relative mt-20 sm:mt-28">
            <div className="site-container">
              <Reveal>
                <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
                  {c.website.heading}
                </h2>
                <p className="mt-4 max-w-2xl text-lg text-muted leading-relaxed">{c.website.body}</p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-10">
                  <CaptureFrame capture={c.website.capture} />
                </div>
              </Reveal>
            </div>
          </section>
        ) : null}

        {c.brandSocial ? (
          <section className="relative mt-20 sm:mt-28">
            <div className="site-container">
              <Reveal>
                <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
                  {c.brandSocial.heading}
                </h2>
                <p className="mt-4 max-w-2xl text-lg text-muted leading-relaxed">{c.brandSocial.body}</p>
              </Reveal>
              <GalleryGrid gallery={c.brandSocial} />
            </div>
          </section>
        ) : null}

        {c.projects.length > 0 ? (
          <section id="projects" className="relative mt-20 scroll-mt-28 border-t border-border pt-20 sm:mt-28 sm:pt-24">
            <div className="site-container">
              <Reveal>
                <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
                  {c.projects.length === 1 ? "Development campaign" : "Development campaigns"}
                </h2>
                <p className="mt-4 max-w-2xl text-lg text-muted leading-relaxed">
                  Each launch ran the same way: a landing page built to capture
                  qualified leads, and the campaign creative that fed it.
                </p>
              </Reveal>

              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {c.projects.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 0.08}>
                    <Link
                      href={`/portfolio/${c.slug}/${p.slug}`}
                      className="card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-border panel"
                    >
                      <Image
                        src={p.cardImage}
                        alt={`${p.name} campaign creative`}
                        width={1400}
                        height={1400}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={`aspect-[4/3] w-full object-cover ${
                          p.cardImagePosition === "top" ? "object-top" : ""
                        }`}
                      />
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-xl font-semibold text-ink">{p.name}</h3>
                        <p className="mt-2.5 flex-1 text-sm text-muted leading-relaxed">{p.cardBlurb}</p>
                        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                          View the campaign{" "}
                          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="relative mt-20 sm:mt-28">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] border border-border glass-strong px-8 py-14 text-center sm:px-16">
                <div
                  className="blob pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/50"
                  style={{ animationDelay: "-4s" }}
                />
                <div className="relative">
                  <h2 className="text-3xl sm:text-4xl font-semibold leading-tight text-ink">
                    Launching a development? <span className="text-gradient">Let&apos;s talk.</span>
                  </h2>
                  <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                    <CtaButton href="/contact">Book a free consultation</CtaButton>
                    <Link href="/portfolio" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink hover:bg-white/5 transition-colors">
                      See all work
                    </Link>
                  </div>
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
