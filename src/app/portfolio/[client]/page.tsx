import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import ClientWordmark from "@/components/portfolio/ClientWordmark";
import PageOpener from "@/components/layout/PageOpener";
import { OG_IMAGES, OG_IMAGE_URL } from "@/lib/ogImage";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import TrackView from "@/components/seo/TrackView";
import { WorkProof } from "@/components/portfolio/ProofLoop";
import GalleryLightbox from "@/components/portfolio/GalleryLightbox";
import Reveal from "@/components/ui/Reveal";
import { CaptureFrame, GalleryGrid, FactStrip } from "@/components/portfolio/CaseStudyParts";
import { getClient, routableClients, SHOW_DRAFTS } from "@/data/caseStudies";
import { clientContentDate } from "@/data/contentDates";
import CtaButton from "@/components/ui/CtaButton";
import DeviceFrame from "@/components/portfolio/DeviceFrame";
import { jsonLdSafe } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";
import Eyebrow from "@/components/ui/Eyebrow";
import SecondaryButton from "@/components/ui/SecondaryButton";

const SITE = SITE_URL;

type Props = { params: Promise<{ client: string }> };

// Only the slugs generated below exist; anything else, drafts included in a
// production build, is a 404 rather than rendered on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return routableClients().map((c) => ({ client: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { client } = await params;
  const c = getClient(client);
  if (!c) return {};
  return {
    title: c.title,
    description: c.description,
    // A draft is reachable under `next dev` only (404 in production builds,
    // see SHOW_DRAFTS), so Bilal can review the layout. It must not be
    // indexed: the copy is placeholder, and the company is an employer whose
    // permission is still outstanding. `follow` stays on so the nav links on
    // the page are still crawled normally.
    ...(c.draft ? { robots: { index: false, follow: true } } : {}),
    alternates: { canonical: `/portfolio/${c.slug}` },
    openGraph: {
      title: c.title,
      description: c.description,
      type: "article",
      url: `/portfolio/${c.slug}`,
      images: c.ogImage
        ? [{ url: c.ogImage, width: 1200, height: 630, alt: c.ogImageAlt ?? `${c.name} campaign creative` }]
        : OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description: c.description,
      images: c.ogImage ? [c.ogImage] : [OG_IMAGE_URL],
    },
  };
}

export default async function ClientCaseStudy({ params }: Props) {
  const { client } = await params;
  const c = getClient(client);
  if (!c || (c.draft && !SHOW_DRAFTS)) notFound();
  // Picked by key rather than position, so reordering `screens` in the data
  // cannot silently swap which screen sits beside the website capture.
  const appHomeScreen = c.mobileApp?.screens.find((s) => s.key === "home");

  // A project with a `kind` is something other than an off-plan launch, which
  // changes what the projects section can honestly be called. See the comment
  // on the heading below.
  // The featured project renders in its own section and is removed from the
  // grid, so it cannot appear twice on one page.
  const featuredProject = c.featured
    ? c.projects.find((p) => p.slug === c.featured!.projectSlug)
    : undefined;
  const gridProjects = featuredProject
    ? c.projects.filter((p) => p.slug !== featuredProject.slug)
    : c.projects;

  // With the one non-campaign project lifted out, the grid is launches again
  // and can go back to saying so.
  const hasNonCampaign = gridProjects.some((p) => p.kind);

  const url = `${SITE}/portfolio/${c.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${c.name}: ${c.headline}`,
    headline: c.title,
    description: c.description,
    url,
    inLanguage: "en",
    // When the case study data last changed, not the build date. `new Date()`
    // told search engines every case study changed on every deploy.
    dateModified: clientContentDate(client),
    // Was "Real estate marketing case study" for every client, which became
    // untrue with Texdale (2026-10-24).
    genre:
      c.industry === "Real Estate & Property"
        ? "Real estate marketing case study"
        : "Digital marketing case study",
    image: c.ogImage ? `${SITE}${c.ogImage}` : OG_IMAGE_URL,
    creator: { "@id": `${SITE}/#person`, "@type": "Person" },
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
      { "@type": "ListItem", position: 2, name: "Portfolio", item: `${SITE}/portfolio` },
      { "@type": "ListItem", position: 3, name: c.name, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSafe(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSafe(breadcrumb) }} />
      <TrackView name={c.name} category="Client" />
      <main id="main" tabIndex={-1} className="flex-1 pb-16 sm:pb-20">
        <PageOpener
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Portfolio", href: "/portfolio" },
            { label: c.name },
          ]}
          above={
            c.logo ? (
              <Image
                src={c.logo}
                alt={c.name}
                width={c.logoWidth ?? 2000}
                height={c.logoHeight ?? 551}
                preload
                // White marks are silhouetted for the light band; a coloured
                // mark (Texdale's four-colour bar) ships a dark file instead
                // and is shown as it is. See `.client-mark` in globals.css.
                className={`h-10 w-auto ${c.logo.endsWith("-white.svg") ? "client-mark" : ""}`}
              />
            ) : (
              <ClientWordmark name={c.name} />
            )
          }
          title={c.headline}
          standfirst={c.intro}
          actions={
            <Reveal delay={0.1}>
              <div className="max-w-3xl">
                <FactStrip facts={c.facts} />
              </div>
            </Reveal>
          }
        />

        <section className="relative section">
          <div className="site-container">
            <Reveal>
              <Eyebrow>The brief</Eyebrow>
              <h2 className="t-h2 mt-4 text-ink">
                Scope of work
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-muted leading-relaxed">{c.scopeIntro}</p>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {c.scope.map((s) => (
                <Reveal key={s.heading}>
                  <div className="h-full r-card surface-1 p-7">
                    <h3 className="t-h5 text-ink">{s.heading}</h3>
                    <p className="mt-3 text-sm text-muted leading-relaxed">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* The featured project, above the website and everything else.
            Order on this page is deliberate: the tool the sales floor runs on,
            then the site it points at, then the app, then the creative. That is
            closest-to-the-sale first, which is the order a developer reading
            this cares about. */}
        {featuredProject && c.featured ? (
          <section className="relative section">
            <div className="site-container">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
                <Reveal>
                  <Link href={`/portfolio/${c.slug}/${featuredProject.slug}`} className="block">
                    <Image
                      src={featuredProject.cardImage}
                      alt={featuredProject.cardImageAlt ?? featuredProject.name}
                      width={1600}
                      height={1000}
                      sizes="(min-width: 1024px) 48vw, 92vw"
                      className="w-full"
                    />
                  </Link>
                </Reveal>
                <Reveal>
                  <div>
                    <Eyebrow>{c.featured.eyebrow}</Eyebrow>
                    <h2 className="t-h2 mt-4 text-ink">{c.featured.heading}</h2>
                    <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted">
                      {c.featured.body}
                    </p>
                    <Link
                      href={`/portfolio/${c.slug}/${featuredProject.slug}`}
                      className="tap-target mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
                    >
                      See how it was built
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        ) : null}

        {c.website ? (
          <section className="relative section">
            <div className="site-container">
              <Reveal>
                <Eyebrow>Website</Eyebrow>
                <h2 className="t-h2 mt-4 text-ink">
                  {c.website.heading}
                </h2>
                <p className="mt-4 max-w-2xl text-lg text-muted leading-relaxed">{c.website.body}</p>
              </Reveal>

              {/* Web and mobile side by side, 70/30. The pairing is the point: the
                  copy claims the app carries the same developments as the site, and
                  showing both at once is the evidence rather than the assertion.
              
                  A phone rather than the fanned composite in the right column — the
                  composite is a wide landscape image and would render about 340px
                  across, where none of its five screens would be legible. A single
                  portrait frame is the right shape for a 30% column.
              
                  Falls back to full width when a client has no app, and stacks below
                  lg where a 30% column would be roughly 110px. */}
              <Reveal delay={0.1}>
                <div
                  className={`mt-10 grid grid-cols-1 items-start gap-8 ${
                    appHomeScreen || c.website.mobileCapture ? "lg:grid-cols-[70fr_30fr] lg:gap-10" : ""
                  }`}
                >
                  <CaptureFrame capture={c.website.capture} />
                  {appHomeScreen ? (
                    <div>
                      <DeviceFrame capture={appHomeScreen.capture} caption="The app, same developments" />
                      {/* The pairing makes the consistency point; the full app case study
                          is a page of its own, so this is the route to it rather than
                          more of it inline. */}
                      <Link
                        href={`/portfolio/${c.slug}/mobile-app`}
                        className="tap-target mt-5 inline-flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
                      >
                        Read the app case study <ArrowRight size={15} />
                      </Link>
                    </div>
                  ) : c.website.mobileCapture ? (
                    // No app to pair with, so the right column shows the same
                    // page on a phone: the half of a website build that a
                    // desktop capture never shows.
                    <DeviceFrame capture={c.website.mobileCapture} caption="The same page on a phone" />
                  ) : null}
                </div>
              </Reveal>
            </div>
          </section>
        ) : null}

        {c.mobileApp ? (
          <section className="relative section">
            <div className="site-container">
              {/* 70/30. The composite carries this section, so it takes the width
                  and the copy sits beside it rather than stacked above — which also
                  puts the heading level with the phones instead of a screen away.
                  Collapses to one column below lg, where a 30% text column would be
                  about 110px wide. */}
              <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[70fr_30fr] lg:gap-12">
                {c.mobileApp.lead ? (
                  <Reveal>
                    <Image
                      src={c.mobileApp.lead.src}
                      alt={c.mobileApp.lead.alt}
                      width={c.mobileApp.lead.width}
                      height={c.mobileApp.lead.height}
                      sizes="(min-width: 1024px) 760px, 100vw"
                      className="h-auto w-full"
                    />
                  </Reveal>
                ) : null}

                <Reveal delay={0.1}>
                  <div>
                    <Eyebrow>Mobile app</Eyebrow>
                    <h2 className="t-h2 mt-4 text-ink">
                      {c.mobileApp.heading}
                    </h2>
                    <p className="mt-4 text-lg text-muted leading-relaxed">{c.mobileApp.body}</p>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        ) : null}

        {/* An app shown as a design and prototype (Texdale Field). Its own
            block rather than `mobileApp`, which is for a built app with a page
            of its own. The status line sits directly under the intro so nobody
            reads the mockups as a store listing. `id` is what the discipline
            pages link to. */}
        {c.appDesign ? (
          <section id="mobile-app" className="relative section scroll-mt-28">
            <div className="site-container">
              <Reveal>
                <Eyebrow>Mobile app</Eyebrow>
                <h2 className="t-h2 mt-4 text-ink">{c.appDesign.heading}</h2>
                <p className="mt-4 max-w-2xl text-lg text-muted leading-relaxed">{c.appDesign.body}</p>
                <p className="mt-5 max-w-2xl border-l-2 border-gold/60 pl-5 text-sm leading-relaxed text-muted">
                  <span className="font-semibold text-ink">Status: </span>
                  {c.appDesign.status}
                </p>
              </Reveal>
              <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                {c.appDesign.features.map((f) => (
                  <li key={f.title} className="border-t border-border pt-4">
                    <h3 className="t-h5 text-ink">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
                  </li>
                ))}
              </ul>
              <GalleryLightbox gallery={c.appDesign}>
                <GalleryGrid gallery={c.appDesign} />
              </GalleryLightbox>
            </div>
          </section>
        ) : null}

        {c.brandSocial ? (
          <section className="relative section">
            <div className="site-container">
              <Reveal>
                <Eyebrow>Brand and social</Eyebrow>
                <h2 className="t-h2 mt-4 text-ink">
                  {c.brandSocial.heading}
                </h2>
                <p className="mt-4 max-w-2xl text-lg text-muted leading-relaxed">{c.brandSocial.body}</p>
              </Reveal>
              {/* Same treatment as the campaign carousel: these tiles render
                  at ~283px and the creative carries copy that cannot be read at
                  that size. */}
              <GalleryLightbox gallery={c.brandSocial}>
                <GalleryGrid gallery={c.brandSocial} />
              </GalleryLightbox>
            </div>
          </section>
        ) : null}

        {c.socialDesigns ? (
          <section id="campaign-creative" className="relative section scroll-mt-28">
            <div className="site-container">
              <Reveal>
                <Eyebrow>Campaign creative</Eyebrow>
                <h2 className="t-h2 mt-4 text-ink">
                  {c.socialDesigns.heading}
                </h2>
                <p className="mt-4 max-w-2xl text-lg text-muted leading-relaxed">{c.socialDesigns.body}</p>
              </Reveal>
              {/* Same treatment as the campaign carousel: these tiles render
                  at ~283px and the creative carries copy that cannot be read at
                  that size. */}
              <GalleryLightbox gallery={c.socialDesigns}>
                <GalleryGrid gallery={c.socialDesigns} />
              </GalleryLightbox>
            </div>
          </section>
        ) : null}

        {gridProjects.length > 0 ? (
          <section id="projects" className="relative mt-20 scroll-mt-28 border-t border-border pt-20 sm:mt-28 sm:pt-24">
            <div className="site-container">
              <Reveal>
                {/* "Development campaigns" was right while every project here
                    was an off-plan launch. The LEOS sales application is an
                    internal tool, so on that page the heading and the standfirst
                    both described five of six cards. A project carrying `kind`
                    is by definition not a launch, so one `some()` keeps the
                    wording true without a second template or a per-client
                    override. */}
                <Eyebrow>{hasNonCampaign ? "The work" : "Campaigns"}</Eyebrow>
                <h2 className="t-h2 mt-4 text-ink">
                  {hasNonCampaign
                    ? "Campaigns and tools"
                    : gridProjects.length === 1
                      ? "Development campaign"
                      : "Development campaigns"}
                </h2>
                <p className="mt-4 max-w-2xl text-lg text-muted leading-relaxed">
                  Each launch ran the same way: a landing page built to capture
                  qualified leads, and the campaign creative that fed it.
                  {hasNonCampaign
                    ? " Alongside them, the internal tools the sales team works with day to day."
                    : ""}
                </p>
                {/* Contextual link to the vertical page. This is the most
                    relevant page on the site to send a property developer to,
                    and the vertical needs inbound links from somewhere other
                    than the footer to be worth crawling. */}
                <Link
                  href="/real-estate-marketing"
                  className="tap-target mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
                >
                  How an off-plan launch is run, start to finish
                  <ArrowRight size={15} />
                </Link>
              </Reveal>

              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gridProjects.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 0.08}>
                    <Link
                      href={`/portfolio/${c.slug}/${p.slug}`}
                      className="card-hover group flex h-full flex-col overflow-hidden r-card surface-1"
                    >
                      {/* `object-contain` for a designed cover, `object-cover`
                          for a capture.
                          
                          The card well is 4:3. A campaign capture is a crop of a
                          much taller page, so cropping it further costs nothing.
                          A designed cover is composed to its own edges: the
                          sales application cover is 16:10 with a tablet sitting
                          at the right-hand edge, and `object-cover` cut the
                          tablet in half. Letterboxing inside the same 4:3 well
                          keeps every card the same height. */}
                      <Image
                        src={p.cardImage}
                        alt={p.cardImageAlt ?? `${p.name} campaign creative`}
                        width={1400}
                        height={1400}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={`aspect-[4/3] w-full ${
                          p.cardImageFit === "contain"
                            ? "bg-bg-soft/60 object-contain"
                            : `object-cover ${p.cardImagePosition === "top" ? "object-top" : ""}`
                        }`}
                      />
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="t-h4 text-ink">{p.name}</h3>
                        <p className="mt-2.5 flex-1 text-sm text-muted leading-relaxed">{p.cardBlurb}</p>
                        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                          {p.kind ? `View the ${p.kind}` : "View the campaign"}{" "}
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

        {c.depth ? (
          <section className="relative section">
            <div className="site-container">
              {c.depth.map((block, i) => (
                <Reveal key={block.heading}>
                  <div className={i > 0 ? "mt-12" : ""}>
                    <h2 className="t-h3 text-ink">{block.heading}</h2>
                    {block.paragraphs.map((para) => (
                      <p key={para.slice(0, 40)} className="mt-5 text-base leading-relaxed text-muted">
                        {para}
                      </p>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}

        <WorkProof clientSlug={c.slug} />
        <section className="relative section">
          <div className="site-container">
            <Reveal>
              <div className="relative overflow-hidden r-panel surface-3 px-8 py-14 text-center sm:px-16">
                <div
                  className="blob pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/50"
                  style={{ animationDelay: "-4s" }}
                />
                <div className="relative">
                  <Eyebrow>Next step</Eyebrow>
                  <h2 className="t-h2 mt-4 text-ink">
                    {c.ctaLead ?? "Launching a development?"}{" "}
                    <span className="text-gradient">Let&apos;s talk.</span>
                  </h2>
                  <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                    <CtaButton href="/appointment">Book a free consultation</CtaButton>
                    <SecondaryButton href="/portfolio">See all work</SecondaryButton>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
