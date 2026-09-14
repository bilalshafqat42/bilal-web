import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import Nav from "@/components/Nav";
import TrackView from "@/components/TrackView";
import { caseStudyDepth } from "@/data/caseStudyDepth";
import Footer from "@/components/Footer";
import { WorkProof } from "@/components/ProofLoop";
import GalleryLightbox from "@/components/GalleryLightbox";
import Reveal from "@/components/Reveal";
import { CaptureFrame, GalleryGrid, FactStrip } from "@/components/CaseStudyParts";
import { clients, getProject } from "@/data/caseStudies";
import CtaButton from "@/components/CtaButton";
import DeviceFrame from "@/components/DeviceFrame";

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
  const og = p.ogImage ?? c.ogImage;
  return {
    title,
    description: p.cardBlurb,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: p.cardBlurb,
      type: "article",
      url,
      // Per-project card where one exists, the client's generic card otherwise.
      // Every project used to share one LEOS image, so a link posted anywhere
      // showed the same unbranded card whichever development it pointed at.
      images: [{ url: og, width: 1200, height: 630, alt: `${p.name} — campaign landing page` }],
    },
    twitter: { card: "summary_large_image", title, description: p.cardBlurb, images: [og] },
  };
}

export default async function ProjectCaseStudy({ params }: Props) {
  const { client, project } = await params;
  const found = getProject(client, project);
  if (!found) notFound();
  const { client: c, project: p } = found;

  const url = `${SITE}/portfolio/${c.slug}/${p.slug}`;
  const depth = caseStudyDepth[p.slug];
  const siblings = c.projects.filter((x) => x.slug !== p.slug);

  // Emitted only when the project carries questions, and built from the exact
  // array the page renders below, so the markup can never describe text a
  // visitor cannot see.
  const faqSchema = p.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: p.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

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
    creator: { "@id": `${SITE}/#person`, "@type": "Person" },
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
      { "@type": "ListItem", position: 2, name: "Portfolio", item: `${SITE}/portfolio` },
      { "@type": "ListItem", position: 3, name: c.name, item: `${SITE}/portfolio/${c.slug}` },
      { "@type": "ListItem", position: 4, name: p.name, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {faqSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}
      <TrackView name={p.name} category="Case study" />
      <Nav />
      <main className="flex-1 pb-16 sm:pb-20">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="site-container relative">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
              <Link href="/" className="hover:text-ink transition-colors">Home</Link>
              <ChevronRight size={13} />
              <Link href="/portfolio" className="hover:text-ink transition-colors">Portfolio</Link>
              <ChevronRight size={13} />
              <Link href={`/portfolio/${c.slug}`} className="hover:text-ink transition-colors">{c.name}</Link>
              <ChevronRight size={13} />
              <span className="text-ink">{p.name}</span>
            </nav>

            {/* Two columns, mirroring the homepage banner: copy left, the work
                itself right. The hero previously ran to `max-w-3xl` and left
                roughly half the width empty on any desktop screen. */}
            <div className="mt-8 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_minmax(0,42%)] lg:gap-14">
              <Reveal>
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
                    Development campaign
                  </span>
                  {p.logo ? (
                    <Image src={p.logo} alt={p.name} width={900} height={1983} priority className="mt-6 h-16 w-auto" />
                  ) : null}
                  <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.06] tracking-tight text-ink">
                    {p.headline}
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg text-muted leading-relaxed">{p.summary}</p>
                </div>
              </Reveal>

              {/* The landing page, cropped to its hero rather than shown whole.
                  The capture is 1600x5568, so anything but a top crop is a
                  meaningless middle slice; the full scroll is further down the
                  page in its own frame. Browser chrome rather than a bare
                  image, so it reads as a live page and matches the frame used
                  in the section below. */}
              {p.landingPage ? (
                <Reveal delay={0.12}>
                  <div className="overflow-hidden rounded-2xl border border-border panel">
                    <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                      <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                      <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                      <span className="ml-3 truncate text-xs text-muted">{p.landingPage.capture.label}</span>
                    </div>
                    <div className="relative aspect-[16/11] w-full">
                      <Image
                        src={p.landingPage.capture.src}
                        alt={p.landingPage.capture.alt}
                        fill
                        sizes="(min-width: 1024px) 40vw, 92vw"
                        priority
                        className="object-cover object-top"
                      />
                    </div>
                  </div>
                </Reveal>
              ) : null}
            </div>

            <Reveal delay={0.1}>
              <div className="mt-10 max-w-4xl">
                <FactStrip facts={p.facts} />
              </div>
            </Reveal>
          </div>
        </section>

        {depth ? (
          <section className="relative mt-20 sm:mt-28">
            <div className="site-container">
              {/* Two columns at the full container width. This block used to be
                  `mx-auto max-w-3xl`, which centred it in a narrow column while
                  every section above and below sat at the container edge — the
                  h2 left edges on this page measured 40, 40, 40, 297, 336 with
                  no rule behind the difference.

                  The heading sticks on desktop so it stays with the prose it
                  labels through a long read, and the prose keeps its own
                  measure rather than stretching to the full width. */}
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-16">
                <Reveal>
                  <div className="lg:sticky lg:top-32">
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                      The approach
                    </span>
                    <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
                      How this was approached
                    </h2>
                  </div>
                </Reveal>

                <div className="space-y-12">
                  {depth.map((block) => (
                    <Reveal key={block.heading}>
                      <div className="border-t border-border pt-8">
                        <h3 className="text-xl font-semibold text-ink sm:text-2xl">{block.heading}</h3>
                        <div className="mt-4 space-y-4">
                          {block.paragraphs.map((para) => (
                            <p key={para.slice(0, 40)} className="max-w-[68ch] text-base leading-relaxed text-muted">
                              {para}
                            </p>
                          ))}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {p.landingPage ? (
          <section className="relative mt-20 sm:mt-28">
            <div className="site-container">
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
                    <div className="mx-auto w-full max-w-[300px] lg:max-w-none">
                      <DeviceFrame
                        capture={p.landingPage.mobileCapture}
                        caption={p.landingPage.mobileCapture.label}
                      />
                    </div>
                  ) : null}
                </div>
              </Reveal>
            </div>
          </section>
        ) : null}

        {p.gallery ? (
          <section className="relative mt-20 sm:mt-28">
            <div className="site-container">
              <Reveal>
                <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
                  {p.gallery.heading}
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-muted leading-relaxed">{p.gallery.body}</p>
              </Reveal>
              {/* Tiles stay server-rendered inside the island, so their
                  captions and alt text are in the initial HTML. Only the
                  overlay needs client state. */}
              <GalleryLightbox gallery={p.gallery}>
                <GalleryGrid gallery={p.gallery} />
              </GalleryLightbox>
            </div>
          </section>
        ) : null}

        <section className="relative mt-20 sm:mt-28">
          <div className="site-container">
            <div className="flex flex-wrap items-center justify-between gap-6 border-t border-border pt-10">
              <Link
                href={`/portfolio/${c.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-gold transition-colors"
              >
                <ArrowLeft size={15} /> All {c.name} work
              </Link>
              {siblings.length > 0 ? (
                <div className="flex flex-wrap items-center gap-4">
                  {siblings.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/portfolio/${c.slug}/${s.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:opacity-80 transition-opacity"
                    >
                      {s.name} <ArrowRight size={15} />
                    </Link>
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
                  <CtaButton href="/appointment" className="mt-9">Book a free consultation</CtaButton>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
        {/* Campaign results. Only entries with a value render, so a launch whose
            numbers have not been released shows nothing rather than a row of
            dashes — the placeholder problem from item 134, in a new place. */}
        {p.results?.some((r) => r.value) ? (
          <section className="site-container pt-16 sm:pt-20">
            <Reveal>
              <div className="border-b border-border pb-5">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                  Results
                </span>
                <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  What the campaign produced
                </h2>
              </div>
              <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
                {p.results
                  .filter((r) => r.value)
                  .map((r) => (
                    <div key={r.label} className="bg-bg px-7 py-8">
                      <dt className="text-3xl font-bold tracking-tight text-ink">{r.value}</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-muted">{r.label}</dd>
                      {r.note ? (
                        <dd className="mt-1.5 text-xs leading-relaxed text-muted/65">{r.note}</dd>
                      ) : null}
                    </div>
                  ))}
              </dl>
            </Reveal>
          </section>
        ) : null}

        {/* Questions, rendered from the same array the FAQPage schema is built
            from. Renders nothing for a project with none, so the other case
            studies are unchanged. */}
        {p.faqs?.length ? (
          <section className="site-container py-16 sm:py-20">
            <Reveal>
              <div className="border-b border-border pb-5">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                  Common questions
                </span>
                <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  About this launch
                </h2>
              </div>
              <dl className="mt-8 max-w-3xl divide-y divide-border border-b border-border">
                {p.faqs.map((f) => (
                  <div key={f.question} className="py-6">
                    <dt className="text-base font-semibold text-ink">{f.question}</dt>
                    {/* Capped in `ch`, not by a container width: at 14px inside a
                        768px column these answers ran to ~116 characters a
                        line, which is well past a comfortable measure however
                        wide the page is. */}
                    <dd className="mt-2.5 max-w-[68ch] text-sm leading-relaxed text-muted">{f.answer}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </section>
        ) : null}

        <WorkProof clientSlug={c.slug} projectSlug={p.slug} />
      </main>
      <Footer />
    </>
  );
}
