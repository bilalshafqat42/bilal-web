import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import SocialLinks from "@/components/SocialLinks";
import { pillars, accentClasses } from "@/data/pillars";
import CtaButton from "@/components/CtaButton";
import WhoIWorkWith from "@/components/WhoIWorkWith";
import { SITE_URL, breadcrumbNode, graph, ref, ID } from "@/lib/schema";

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
    body: "Most projects lose time and quality at the seams: the agency blames the developer, the developer blames the designer. Because all four disciplines sit with one person here, those seams do not exist.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main id="main" tabIndex={-1} className="flex-1 pb-16 sm:pb-20">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="site-container relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <div>
                <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                  About
                </span>
                <h1 className="t-h1 mt-5 text-ink">
                  15 years of marketing, design, and development experience, in{" "}
                  <span className="underline decoration-gold decoration-4 underline-offset-4">
                    one senior partner
                  </span>
                </h1>
                <p className="mt-6 max-w-2xl text-lg text-muted leading-relaxed">
                  I&apos;m Bilal Shafqat, a Dubai-based freelance digital marketer,
                  developer, and designer. Companies usually hire an agency for
                  marketing, a developer for the website, and a freelancer for
                  design, then spend their own time managing the handoffs between
                  them. I do all of it myself, which means one brief, one point of
                  contact, and one person accountable for the result.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <CtaButton href="/appointment">Book a free consultation</CtaButton>
                  <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink hover:bg-white/5 transition-colors"
                  >
                    View my work
                  </Link>
                </div>
                <SocialLinks className="mt-8" />
              </div>
            </Reveal>

          </div>

          {/* Portrait, matching the homepage banner exactly: same photograph,
              same crop, same monochrome treatment, bleeding off the right edge
              rather than sitting in a bordered card.

              It is a sibling of `.site-container` rather than a cell inside it,
              because `site-container` is a centred 83.33% column — `right-0`
              against that stops at the gutter, not at the viewport edge, and
              the bleed is the whole point.

              Mobile keeps it as a block in the flow under the copy, as the
              homepage does. A photograph behind body text at phone width wrecks
              legibility for no gain.

              `.hero-portrait` carries the edge masks. The left fade in it is
              desktop-only, which is why it lives in globals.css and not in an
              inline style. */}
          <div className="relative h-[360px] w-full sm:h-[440px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[46%] lg:overflow-hidden">
            <Image
              src="/images/bilal-shirt.avif"
              alt="Bilal Shafqat"
              fill
              // 46vw, not 34vw. The column is `lg:w-[46%]` and the image is then
            // scaled 1.035, so a 34vw variant was being stretched across it —
            // a soft portrait in the first thing anyone sees (roadmap 213.18).
            sizes="(min-width: 1024px) 46vw, 100vw"
              className="hero-portrait object-cover object-[50%_15%] brightness-[1.04] contrast-[1.12] grayscale lg:origin-top lg:scale-[1.035]"
              priority
            />
          </div>
        </section>

        <section className="relative mt-24 sm:mt-32">
          <div className="site-container">
            <Reveal>
              <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">The work</span>
              <h2 className="t-h2 mt-4 text-ink">
                What I actually do
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-muted leading-relaxed">
                Four pillars that connect to each other, rather than four
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
            <Reveal>
              <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">How I work</span>
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
              <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">Stack</span>
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
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] border border-border glass-strong px-8 py-14 text-center sm:px-16">
                <div
                  className="blob pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/50"
                  style={{ animationDelay: "-4s" }}
                />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">Next step</span>
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
