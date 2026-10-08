import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import SocialLinks from "@/components/SocialLinks";
import { pillars, accentClasses } from "@/data/pillars";
import CtaButton from "@/components/CtaButton";
import SecondaryButton from "@/components/SecondaryButton";
import PageOpener from "@/components/PageOpener";
import WhoIWorkWith from "@/components/WhoIWorkWith";
import { SITE_URL, breadcrumbNode, graph, ref, ID, jsonLdSafe } from "@/lib/schema";
import Eyebrow from "@/components/Eyebrow";

export const metadata: Metadata = {
  title: "About Bilal Shafqat — Freelance Marketer & Developer, Dubai",
  description:
    "Fifteen years across paid marketing, web and app development, design and CRM automation. One senior partner in Dubai, not an agency.",
  alternates: {
    canonical: "/about",
  },
};

const stack = [
  {
    title: "Paid platforms",
    items: ["Google Ads & Performance Max", "Meta (Facebook & Instagram)", "TikTok", "Snapchat", "LinkedIn"],
  },
  {
    title: "Build stack",
    items: [
      "Next.js, React & React Native",
      "MERN (MongoDB, Express, React, Node)",
      "PostgreSQL",
      "WordPress, Squarespace & Wix",
      "Tailwind CSS",
    ],
  },
  {
    title: "CRM & tracking",
    items: ["HubSpot", "Zoho", "Salesforce", "Server-side tracking & Conversions API"],
  },
  {
    title: "Design",
    items: ["UI/UX & product design", "Branding & brand guidelines", "Social & campaign creative", "Video editing"],
  },
];

const principles = [
  {
    title: "You work with me, not an account manager",
    body: "The person you brief is the person who plans the campaign, writes the code, and designs the creative. Nothing gets translated through a middle layer and nothing gets handed down to junior staff.",
  },
  {
    title: "No handoffs between disciplines",
    body: "Most projects lose time and quality at the seams: the agency blames the developer, the developer blames the designer. Because all three disciplines sit with one person here, those seams do not exist.",
  },
  {
    title: "Measured against pipeline, not impressions",
    body: "Tracking gets set up before spend starts, so performance is reported as cost per lead and cost per acquisition rather than clicks, reach, and engagement.",
  },
];


/**
 * Structured data. This page had none until 2026-09-16, which meant Google had
 * no typed description of it at all.
 */
const pageUrl = `${SITE_URL}/about`;

const schema = graph([
  {
    "@type": "ProfilePage",
    "@id": `${pageUrl}#page`,
    url: pageUrl,
    name: "About Bilal Shafqat",
    description:
      "Fifteen years across paid marketing, web and app development, design and CRM automation, working as one senior partner rather than an agency.",
    inLanguage: "en",
    isPartOf: ref(ID.website, "WebSite"),
    // `mainEntity`, not a second Person node. The Person is defined once on the
    // homepage at #person; restating name, job title and address here is what
    // produced twenty-odd unlinked duplicates of the same entity before.
    mainEntity: ref(ID.person, "Person"),
    about: ref(ID.business, "ProfessionalService"),
  },
  breadcrumbNode(pageUrl, [
    { name: "Home", item: SITE_URL },
    { name: "About", item: pageUrl },
  ]),
]);

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSafe(schema) }} />
      <main id="main" tabIndex={-1} className="flex-1 pb-16 sm:pb-20">
        <PageOpener
          crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
          eyebrow="About"
          /* The name leads, because this is the page Google should return for
             "bilal shafqat" and the `h1` carried no name at all — only the title
             tag and the paragraph below did (roadmap 276). */
          title={
            <>
              Bilal Shafqat. 15 years of marketing, design and development, in{" "}
              <span className="underline decoration-gold decoration-4 underline-offset-4">
                one senior partner
              </span>
            </>
          }
          standfirst={
            <>
              I&apos;m Bilal Shafqat, a Dubai-based freelance digital marketer,
              developer, and designer. Companies usually hire an agency for
              marketing, a developer for the website, and a freelancer for
              design, then spend their own time managing the handoffs between
              them. I do all of it myself, which means one brief, one point of
              contact, and one person accountable for the result.
            </>
          }
          actions={
            <div className="w-full">
              <div className="flex flex-wrap items-center gap-4">
                <CtaButton href="/appointment">Book a free consultation</CtaButton>
                <SecondaryButton href="/portfolio">View my work</SecondaryButton>
              </div>
              <SocialLinks className="mt-8" />
            </div>
          }
          /* Portrait, matching the homepage banner exactly: same photograph,
             same crop, same monochrome treatment, bleeding off the right edge
             rather than sitting in a bordered card. Mobile keeps it as a block
             in the flow under the copy, as the homepage does — a photograph
             behind body text at phone width wrecks legibility for no gain.
             `.hero-portrait` carries the edge masks. */
          bleed={
            <div className="relative h-[360px] w-full sm:h-[440px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[46%] lg:overflow-hidden">
              <Image
                src="/images/bilal-shirt.avif"
                alt="Bilal Shafqat"
                fill
                // 46vw, not 34vw. The column is `lg:w-[46%]` and the image is
                // then scaled 1.035, so a 34vw variant was being stretched
                // across it — a soft portrait in the first thing anyone sees.
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="hero-portrait object-cover object-[50%_15%] brightness-[1.04] contrast-[1.12] grayscale lg:origin-top lg:scale-[1.035]"
                priority
              />
            </div>
          }
        />

        <section className="relative mt-24 sm:mt-32">
          <div className="site-container">
            <Reveal>
              <Eyebrow>The work</Eyebrow>
              <h2 className="t-h2 mt-4 text-ink">
                What I actually do
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-muted leading-relaxed">
                Three disciplines that connect to each other, rather than three
                services sold separately.
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {pillars.map((pillar, i) => {
                const accent = accentClasses[pillar.accent];
                const Icon = pillar.icon;
                return (
                  <Reveal key={pillar.slug} delay={i * 0.08}>
                    <Link
                      // `ledgerHref` where the pillar has one, same as the
                      // homepage ledger. `design-content-conversion` was retired
                      // and 308s to the services hub, so linking the raw slug
                      // sent every visitor from this page through a redirect.
                      href={pillar.ledgerHref ?? `/services/${pillar.slug}`}
                      className="card-hover group flex h-full flex-col rounded-2xl border border-border panel p-7"
                    >
                      <span
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${accent.bg}`}
                      >
                        <Icon size={20} className={accent.icon} />
                      </span>
                      <h3 className="t-h4 mt-5 text-ink">{pillar.label}</h3>
                      <p className="mt-3 text-sm text-muted leading-relaxed">
                        {pillar.shortDescription}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                        Explore this pillar{" "}
                        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative mt-24 sm:mt-32">
          <div className="site-container">
            <div className="max-w-3xl">
              <Reveal>
                <Eyebrow>The short version</Eyebrow>
                <h2 className="t-h2 mt-4 text-ink">How one person ended up doing four jobs</h2>
                <p className="mt-6 text-base leading-relaxed text-muted">
                  Not by plan. I started on the build side, writing code and designing
                  interfaces, and kept being handed campaigns that pointed at pages
                  somebody else had made. The pages were usually fine. What was broken
                  was the seam: the ad promised one thing, the page said another, and the
                  enquiry landed somewhere nobody was watching.
                </p>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  Fixing that meant learning the other half. Fifteen years later the two
                  halves are one job, and the thing clients actually buy is the absence of
                  a handover. Most marketers cannot build the thing they are marketing and
                  most developers have never run a campaign, so the gap between them is
                  where budgets quietly go.
                </p>
              </Reveal>

              <Reveal>
                <h2 className="t-h2 mt-14 text-ink">What I am not</h2>
                <p className="mt-6 text-base leading-relaxed text-muted">
                  Not an agency, and not a freelancer with a network of subcontractors
                  behind a single invoice. One person, which has a real cost: there is a
                  ceiling on capacity and no cover if I am unavailable. For a programme
                  running across six channels every week, an agency is the better answer
                  and I will say so.
                </p>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  Not the lowest price either. The published figures are on the pricing
                  page rather than behind a conversation, and they rule some projects out.
                  That is deliberate: a budget that cannot cover the work properly produces
                  a result nobody is happy with, and finding that out at the quote stage is
                  cheaper for both of us than finding it out in month three.
                </p>
              </Reveal>

              <Reveal>
                <h2 className="t-h2 mt-14 text-ink">How a first conversation goes</h2>
                <p className="mt-6 text-base leading-relaxed text-muted">
                  Thirty minutes, free, and it is not a pitch. You describe the business
                  and the number you want to move, I ask questions, and you leave with a
                  recommended approach and a price range. Often the recommendation is
                  smaller than what you came in asking for, because the thing in the way is
                  rarely the thing people think it is.
                </p>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  Sometimes the honest answer is that you do not need me. You do not need
                  an app if a fast mobile site does the same job. You do not need a rebuild
                  if the site works and the tracking is the problem. Telling you that costs
                  me a project and buys the only thing worth having in a market this small,
                  which is somebody who recommends you afterwards.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="relative mt-24 sm:mt-32">
          <div className="site-container">
            <Reveal>
              <Eyebrow>How I work</Eyebrow>
              <h2 className="t-h2 mt-4 text-ink">
                How working with me is different
              </h2>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {principles.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-border panel p-7">
                    <h3 className="t-h5 text-ink">{p.title}</h3>
                    <p className="mt-3 text-sm text-muted leading-relaxed">{p.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mt-24 sm:mt-32">
          <div className="site-container">
            <Reveal>
              <Eyebrow>Stack</Eyebrow>
              <h2 className="t-h2 mt-4 text-ink">
                Platforms and tools I work in
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-muted leading-relaxed">
                Named specifically, so you can tell straight away whether I
                cover what you already run on.
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stack.map((group, i) => (
                <Reveal key={group.title} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-border panel p-6">
                    <h3 className="text-sm font-semibold tracking-wide text-gold uppercase">
                      {group.title}
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-muted">
                          <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-gold" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Moved here from the homepage. This is the page where "who I work
            with" is the reader's actual question. */}
        <WhoIWorkWith />

        <section className="relative mt-24 sm:mt-32">
          <div className="site-container">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] border border-border glass-strong px-8 py-14 text-center sm:px-16">
                <div
                  className="blob pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/50"
                  style={{ animationDelay: "-4s" }}
                />
                <div className="relative">
                  <Eyebrow>Next step</Eyebrow>
                  <h2 className="t-h2 mt-4 text-ink">
                    Based in Dubai, <span className="text-gradient">working with you directly.</span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-muted leading-relaxed">
                    Tell me what you&apos;re trying to achieve and I&apos;ll come back
                    with next steps, not a generic proposal deck.
                  </p>
                  <CtaButton href="/appointment" className="mt-9">Book a free consultation</CtaButton>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
