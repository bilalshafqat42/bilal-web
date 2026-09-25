import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { WorkProof } from "@/components/ProofLoop";
import Contact from "@/components/Contact";
import Reveal from "@/components/Reveal";
import FaqSection from "@/components/FaqSection";
import CtaButton from "@/components/CtaButton";
import { clients, getClient } from "@/data/caseStudies";
import { SITE_URL as SITE } from "@/lib/schema";

/**
 * The mobile app case study.
 *
 * Built to Bilal's own full-page mockup: hero with the composite beside it, a
 * fact strip, the constraints the design had to satisfy, the screens one at a
 * time with the decision stated as a claim, what was delivered, outcomes, and
 * sibling navigation.
 *
 * A static `mobile-app` segment inside the dynamic `[client]` folder. Next
 * resolves static siblings before dynamic ones, so it takes precedence over
 * `[project]` without shadowing anything — no project uses that slug.
 *
 * Two content rules, both load-bearing:
 *
 *   Outcomes render only when they carry a value. The mockup had two figures as
 *   `[ — ]` placeholders; shipping those would repeat the `[Client Name]`
 *   problem removed from the homepage. They sit in the data without values and
 *   appear the day real numbers exist.
 *
 *   The scope lists are shorter than an agency's would be, on purpose. Every
 *   item is evidenced by a capture or was stated directly. Padding them with
 *   plausible work nobody can point at is how a case study stops being
 *   credible.
 *
 * All five screens have captures. The enquiry screen was described in prose for
 * one revision because only the composite showed it; `contact.avif` arrived
 * afterwards, so it is now a card like the rest and the dashed placeholder is
 * gone.
 */
/**
 * Questions about this app specifically.
 *
 * Deliberately NOT the two mobile questions already on
 * `/portfolio/mobile-app-development` — "Do you build native or cross-platform"
 * and "Do you handle App Store and Play Store submission" live there, and
 * repeating them would put the same answer on two indexable pages competing
 * with each other.
 *
 * Every answer restates something already on this page or already published in
 * `disciplines.ts`: the fact strip's "React Native / one shared codebase" and
 * "Design & build", the body copy's point about the app carrying the same
 * developments as the website, and the discipline page's own answers on
 * cross-platform economics and store submission.
 *
 * Deliberately NOT here: whether the app is published and downloadable, and any
 * usage or download figure. The page's `outcomes` already sit in the data
 * without values for exactly that reason, and `disciplines.ts` states plainly
 * that a published listing is "the client's to announce".
 */
const faqs = [
  {
    question: "Why one codebase instead of separate iOS and Android apps?",
    answer:
      "Economics. Two native codebases means writing, testing and maintaining every screen twice, which for a business app of this kind buys very little a buyer would notice. React Native gives both stores from one build. Where an app genuinely needs platform-specific native work I say so rather than take the project.",
  },
  {
    question: "Who designed the screens, and who built them?",
    answer:
      "The same person, which is the point. The interface was designed and then built by me, so the reasoning behind a screen and its implementation match instead of one having been handed across to the other and interpreted.",
  },
  {
    question: "Are these real screens or concepts?",
    answer:
      "Real. Every capture on this page is from the built app rather than a mockup, which is why the walkthrough talks about decisions that had to survive contact with real content — long development names, missing photography, and units that change availability.",
  },
  {
    question: "Why does the app repeat what the website already does?",
    answer:
      "It does not repeat it, it continues it. The app carries the same developments, the same photography and the same enquiry routes as the launch pages, so a buyer who first saw a campaign on their laptop finds the same thing on their phone rather than a second, thinner version of it.",
  },
  {
    question: "Can you take an app like this through App Store review?",
    answer:
      "Submission is a step I can run with you, and it is worth planning early because store review is the part of a launch date nobody controls. No published listing is claimed for this app here, because that announcement belongs to the client.",
  },
];

type Props = { params: Promise<{ client: string }> };

export function generateStaticParams() {
  return clients.filter((c) => c.mobileApp).map((c) => ({ client: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { client } = await params;
  const c = getClient(client);
  if (!c?.mobileApp) return {};
  return {
    // Client name is interpolated, so the limit has to hold for the longest
    // one. "LEOS Developments" took the old title to 70 characters.
    title: `${c.name} App — React Native Case Study`,
    description: `A cross-platform iOS and Android app for ${c.name}, built in React Native from a single codebase and walked through screen by screen.`,
    alternates: { canonical: `/portfolio/${c.slug}/mobile-app` },
    // Its own card rather than inheriting the site default. Supplied by Bilal at
    // exactly 1200x630, which is the size every platform crops to.
    //
    // JPEG, not the AVIF original. WhatsApp and Facebook share one link-preview
    // crawler, and its supported formats are JPEG, PNG, GIF and WebP — an AVIF
    // og:image is fetched and then not rendered, so the link shares with no
    // picture at all. Bilal named WhatsApp specifically. The site's two other OG
    // images are already JPEG; this one was the odd case.
    openGraph: {
      title: `${c.name} App — React Native Case Study`,
      description: `A cross-platform iOS and Android app for ${c.name}, built in React Native from a single codebase.`,
      url: `${SITE}/portfolio/${c.slug}/mobile-app`,
      images: [
        {
          url: `${SITE}/portfolio/leos/mobile-app/og-leos-mobile.jpg`,
          width: 1200,
          height: 630,
          alt: `The ${c.name} app sign-in screen shown on an iPhone`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [`${SITE}/portfolio/leos/mobile-app/og-leos-mobile.jpg`],
    },
  };
}

export default async function MobileAppCaseStudy({ params }: Props) {
  const { client } = await params;
  const c = getClient(client);
  if (!c?.mobileApp) notFound();

  const app = c.mobileApp;
  const url = `${SITE}/portfolio/${c.slug}/mobile-app`;
  const total = app.screens.length;
  const outcomes = app.outcomes?.filter((o) => o.value) ?? [];
  const pending = app.outcomes?.filter((o) => !o.value) ?? [];
  const siblings = c.projects.slice(0, 2);

  // This page carried BreadcrumbList and nothing else, while all five other
  // case studies carry CreativeWork — so the one piece of app work on the site
  // was the one Google had no typed description of.
  const work = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#work`,
    name: `${c.name} mobile app — React Native case study`,
    headline: app.heading,
    description: app.body,
    url,
    inLanguage: "en",
    dateModified: new Date().toISOString().split("T")[0],
    genre: "Mobile application case study",
    // `lead` is optional on the type, so the property is omitted rather than
    // asserted — an `image` key pointing at undefined is worse than no key.
    ...(app.lead ? { image: `${SITE}${app.lead.src}` } : {}),
    creator: { "@id": `${SITE}/#person`, "@type": "Person" },
    about: { "@type": "Organization", name: c.name },
    isPartOf: { "@type": "CreativeWork", name: c.name, url: `${SITE}/portfolio/${c.slug}` },
  };

  // Built from the exact array the page renders, so the markup cannot describe
  // an answer a visitor cannot read.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Portfolio", item: `${SITE}/portfolio` },
      { "@type": "ListItem", position: 3, name: c.name, item: `${SITE}/portfolio/${c.slug}` },
      { "@type": "ListItem", position: 4, name: "Mobile app", item: url },
    ],
  };

  const facts = [
    { label: "Platforms", value: "iOS & Android", note: "From one build" },
    { label: "Framework", value: "React Native", note: "One shared codebase" },
    { label: "My role", value: "Design & build", note: "Interface through to delivery" },
    { label: "Screens shown", value: `${total}`, note: "Walked through below" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(work) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <main id="main" tabIndex={-1} className="flex-1">
        {/* Hero: copy left, composite right. */}
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="site-container relative">
            <Link
              href={`/portfolio/${c.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-gold"
            >
              <ArrowLeft size={15} /> {c.name}
            </Link>

            <div className="mt-8 grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-14">
              <Reveal>
                <div>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                    Case study · Property &amp; real estate
                  </span>
                  <h1 className="t-h1 mt-5 text-ink">
                    A cross-platform app, from one codebase.
                  </h1>
                  <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">{app.body}</p>
                  <div className="mt-9 flex flex-wrap items-center gap-6">
                    <CtaButton href="/appointment">Book a free consultation</CtaButton>
                    <Link
                      href="#screens"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline decoration-1 underline-offset-[6px] transition-opacity hover:opacity-80"
                    >
                      See {total} screens, one by one
                    </Link>
                  </div>
                </div>
              </Reveal>

              {app.lead ? (
                <Reveal delay={0.1}>
                  <Image
                    src={app.lead.src}
                    alt={app.lead.alt}
                    width={app.lead.width}
                    height={app.lead.height}
                    sizes="(min-width: 1024px) 620px, 100vw"
                    className="h-auto w-full"
                    priority
                  />
                </Reveal>
              ) : null}
            </div>

            {/* Fact strip. Dividers are cell borders rather than a separate
                element, so they cannot drift out of line with the grid. */}
            <Reveal delay={0.15}>
              <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
                {facts.map((f) => (
                  <div key={f.label} className="bg-bg p-6">
                    <dt className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted/70">
                      {f.label}
                    </dt>
                    <dd className="mt-3 text-lg font-semibold text-ink">{f.value}</dd>
                    <dd className="mt-1 text-xs text-muted">{f.note}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* Constraints: the pull quote states the problem, the numbered points
            are what it forced. */}
        {app.constraints ? (
          <>
            {/* Restructured 2026-09-21 to the shape Bilal asked for: named
                narrative sections — About, The Problem, The Solution — rather
                than one unlabelled pull-quote-and-list block. The content is the
                same; what changed is that each part now says what it is, which
                is also what makes the page legible to a crawler reading the
                outline rather than the layout. */}
            <section className="relative mt-24 sm:mt-32">
              <div className="site-container">
                <Reveal>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                    The brief
                  </span>
                  <h2 className="t-h2 mt-4 text-ink">
                    About the project
                  </h2>
                  {/* `app.body` is already the hero paragraph a screen above.
                      Printing it again here was the same ~200 characters twice
                      on one page (roadmap 213.15). This section keeps its
                      heading — it is the anchor the outline needs — and carries
                      the scope sentence instead, which is the thing the hero
                      does not say. */}
                  <p className="mt-6 max-w-[68ch] text-lg leading-relaxed text-muted">
                    {c.scopeIntro}
                  </p>
                </Reveal>
              </div>
            </section>

            <section className="relative mt-20 sm:mt-24">
              <div className="site-container">
                <Reveal>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                    What made it hard
                  </span>
                  <h2 className="t-h2 mt-4 text-ink">
                    The problem
                  </h2>
                </Reveal>
                <Reveal>
                  <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-muted">
                    Three things constrained this build before a single screen was
                    designed:
                  </p>
                </Reveal>
                <ol className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-3">
                  {app.constraints.points.map((pt, i) => (
                    <Reveal key={pt.title} delay={i * 0.08}>
                      <li className="border-t border-border pt-6">
                        <span className="font-mono text-xs tabular-nums text-gold">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="mt-3 text-lg font-semibold leading-snug text-ink">{pt.title}</p>
                        <p className="mt-3 text-base leading-relaxed text-muted">{pt.body}</p>
                      </li>
                    </Reveal>
                  ))}
                </ol>
              </div>
            </section>

            <section className="relative mt-20 bg-bg-soft/50 py-16 sm:mt-24 sm:py-20">
              <div className="site-container">
                <Reveal>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                    The answer
                  </span>
                  <h2 className="t-h2 mt-4 text-ink">
                    The solution
                  </h2>
                  <p className="mt-6 max-w-[62ch] border-l-2 border-gold/70 pl-6 text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-[1.75rem]">
                    {app.constraints.pull}
                  </p>
                </Reveal>
              </div>
            </section>

          </>
        ) : null}

        {/* Key Challenges. The reference carries this between the solution and
            the approach, and it is the one section this page had no equivalent
            for. Built from each screen's own `tag` — the one-line takeaway
            already written for it — so it states the interface decisions without
            repeating The Problem above, which covers the external constraints. */}
        <section className="relative mt-24 sm:mt-32">
          <div className="site-container">
            <Reveal>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                What had to be solved
              </span>
              <h2 className="t-h2 mt-4 text-ink">
                Key challenges
              </h2>
              <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-muted">
                The app had to be operable in one hand by someone who may never have
                seen the website. That required:
              </p>
            </Reveal>
            <ul className="mt-10 grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2">
              {app.screens.map((s, i) => (
                <Reveal key={s.key} delay={i * 0.05}>
                  <li className="flex items-baseline gap-4 border-b border-border py-4">
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span className="text-base leading-relaxed text-ink">{s.tag}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Screen by screen, rebuilt 2026-09-21.
         *
         * Two things changed at Bilal's request. The `DeviceFrame` phone
         * chrome is gone — the captures are designed screens and he wants them
         * shown as they are, which also removes a decorative bezel, a status
         * bar and a scroll container from every one of them. And the separate
         * framed "every screen" band above this was dropped: it showed the same
         * five images a second time, which is weight for nothing.
         *
         * Layout follows the reference Bilal sent: a wide image band, then the
         * reasoning underneath it, stacked — rather than a phone and a column of
         * text alternating sides down the page.
         */}
        <section id="screens" className="relative mt-24 scroll-mt-28 sm:mt-32">
          <div className="site-container">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
                <div>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                    The work
                  </span>
                  {/* Was "Screen by screen, and why each one is built that
                      way." The "why" moved to Design decisions below, so the
                      heading now says only what this run of images is. */}
                  <h2 className="t-h2 mt-4 max-w-2xl text-ink">
                    The screens
                  </h2>
                </div>
                <div className="text-sm leading-relaxed text-muted/70 sm:text-right">
                  <p>{total} screens</p>
                  <p>React Native, iOS and Android</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* One column width for every screen.
            *
            * Measured against the reference at 1440px: Transpo renders almost
            * every image at a steady **1264px** inside a contained column, with
            * only its hero going full-bleed. This page used three widths —
            * 1440px for the three lifestyle mockups and **318px and 194px** for
            * the two tall captures, which floated in a 1440px band that was 78%
            * and 87% empty. A 7x swing in image width on one page is what made
            * two of five screens read as a loading failure rather than a
            * composition.
            *
            * So: one `max-w-[1200px]` column, and the difference between a
            * landscape mockup and a 1:4.8 screen recording is handled *inside*
            * that column rather than by changing its width.
            */}
          <ol className="mt-16 space-y-16 sm:space-y-20">
            {app.screens.map((s, i) => (
              <li key={s.key} className="site-container">
                <div className="mx-auto w-full max-w-[1200px]">
                  <Reveal>
                    {s.mockup ? (
                      /* A lifestyle mockup is a photograph, so it takes a fixed
                         landscape window and crops to fill it.
                         
                         Letting these render at their own proportions was wrong:
                         two of the three are shot portrait at 1080x1920, so at
                         column width they came out **1200 x 2133** — a single
                         image two full screens tall. One fixed 16:9 window
                         instead, so every mockup on the page is the same height
                         whichever way it was shot. */
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
                        <Image
                          src={s.capture.src}
                          alt={s.capture.alt}
                          fill
                          sizes="(min-width: 1280px) 1200px, 100vw"
                          priority={i === 0}
                          className="object-cover object-center"
                        />
                      </div>
                    ) : (
                      /* A tall screen recording on a panel that fills the column.
                         This is the reference's own answer to the same problem:
                         the capture stays narrow, because it is a phone screen
                         and stretching it would be a lie, but it sits on a
                         deliberate ground rather than in empty space. The panel
                         is warm rather than another near-black, so it reads as a
                         chosen surface instead of the page showing through. */
                      <div className="screen-panel flex justify-center rounded-2xl px-6 py-12 sm:py-16">
                        <Image
                          src={s.capture.src}
                          alt={s.capture.alt}
                          width={s.capture.width}
                          height={s.capture.height}
                          sizes="(min-width: 640px) 360px, 70vw"
                          priority={i === 0}
                          className="h-auto max-h-[820px] w-auto max-w-[70vw] rounded-xl shadow-2xl shadow-black/50 sm:max-w-[380px]"
                        />
                      </div>
                    )}
                  </Reveal>

                  {/* Caption only: number, label, and the decision as one line.
                      The reference attaches nothing at all to its images, and
                      what made this page feel busy was a two-column block under
                      every screen — a headline, a paragraph and a three-row spec
                      table. The paragraphs moved into "Design decisions" below,
                      where they read as a list instead of interrupting the run
                      of images. The `glance` specs are no longer rendered; they
                      remain in `caseStudies.ts` if they are ever wanted back. */}
                  <Reveal>
                    <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span className="font-mono text-xs tabular-nums text-muted/70">
                        {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                        {s.label}
                      </span>
                      <p className="w-full max-w-[52ch] text-base leading-relaxed text-muted">
                        {s.headline}
                      </p>
                    </div>
                  </Reveal>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* The reasoning, as a list rather than threaded between the images.
            This is the reference's shape: runs of images, then a block of short
            statements, and never the two interleaved. */}
        <section className="relative mt-24 sm:mt-32">
          <div className="site-container">
            <Reveal>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                Why each screen is built that way
              </span>
              <h2 className="t-h2 mt-4 text-ink">
                Design decisions
              </h2>
            </Reveal>
            <ol className="mt-12 space-y-10">
              {app.screens.map((s, i) => (
                <Reveal key={s.key} delay={i * 0.05}>
                  <li className="grid grid-cols-1 gap-x-10 gap-y-2 border-t border-border pt-7 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
                    <p className="text-lg font-semibold leading-snug text-ink">{s.headline}</p>
                    <p className="max-w-[68ch] text-base leading-relaxed text-muted">{s.journey}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {app.scope ? (
          <section className="relative mt-24 sm:mt-32">
            <div className="site-container">
              <Reveal>
                <div>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                    How it was built
                  </span>
                  {/* Renamed from "What I handled on this project" on
                      2026-09-21. The reference labels this section Approach, and
                      the content is the same thing: what was actually done, in
                      the order it was done. */}
                  <h2 className="t-h2 mt-4 text-ink">
                    The approach
                  </h2>
                  <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-muted">
                    Design and build were the same job here, done in this order:
                  </p>
                </div>
              </Reveal>
              <div className="mt-12 grid grid-cols-1 gap-10 border-t border-border pt-10 sm:grid-cols-3 sm:gap-8">
                {app.scope.map((group) => (
                  <Reveal key={group.heading}>
                    <div>
                      <h3 className="t-h6 text-ink">{group.heading}</h3>
                      <ul className="mt-5 space-y-3">
                        {group.items.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
                            <Check size={15} className="mt-0.5 shrink-0 text-gold" />
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
        ) : null}

        {outcomes.length > 0 ? (
          <section className="relative mt-24 sm:mt-32">
            <div className="site-container">
              <Reveal>
                <div>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                    Outcome
                  </span>
                  <h2 className="t-h2 mt-4 text-ink">
                    What it changed.
                  </h2>
                </div>
              </Reveal>
              <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {outcomes.map((o) => (
                  <Reveal key={o.label}>
                    <div className="h-full rounded-2xl border border-border panel p-7">
                      <p className="text-4xl font-bold tracking-tight text-gold">{o.value}</p>
                      <p className="mt-3 font-semibold text-ink">{o.label}</p>
                      {o.note ? (
                        <p className="mt-2 text-sm leading-relaxed text-muted">{o.note}</p>
                      ) : null}
                    </div>
                  </Reveal>
                ))}
              </div>
              {pending.length > 0 ? (
                <Reveal>
                  <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted/70">
                    {pending.map((o) => o.label).join(" and ")}{" "}
                    {pending.length > 1 ? "are" : "is"} deliberately absent. One figure a client can
                    verify is worth more than three they cannot, so nothing goes here until the
                    number is real.
                  </p>
                </Reveal>
              ) : null}
            </div>
          </section>
        ) : null}

        {siblings.length > 0 ? (
          <section className="relative mt-24 sm:mt-32">
            <div className="site-container">
              {/* Labelled on 2026-09-21. It was two unheaded cards, which reads
                  as pagination furniture; the reference gives it a heading and
                  it becomes a deliberate next step. */}
              <Reveal>
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                  Keep reading
                </span>
                <h2 className="t-h2 mt-4 text-ink">
                  Next case study
                </h2>
              </Reveal>
              <div className="mt-10 grid grid-cols-1 gap-4 border-t border-border pt-10 sm:grid-cols-2">
                {siblings.map((p, i) => (
                  <Link
                    key={p.slug}
                    href={`/portfolio/${c.slug}/${p.slug}`}
                    className={`card-hover group rounded-2xl border border-border panel p-7 ${
                      i === 1 ? "sm:text-right" : ""
                    }`}
                  >
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted/70">
                      {i === 1 ? "Next" : "Previous"}
                    </span>
                    <span className="mt-3 flex items-center gap-2 text-lg font-semibold text-ink transition-colors group-hover:text-gold sm:justify-start">
                      {i === 1 ? null : <ArrowLeft size={16} className="shrink-0" />}
                      <span className={i === 1 ? "sm:ml-auto" : ""}>{p.name}</span>
                      {i === 1 ? <ArrowRight size={16} className="shrink-0" /> : null}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <FaqSection
          eyebrow="Common questions"
          title="About this app"
          faqs={faqs}
          className="py-16 sm:py-20"
        />

        <WorkProof clientSlug={c.slug} />

        <Contact />
      </main>
    </>
  );
}
