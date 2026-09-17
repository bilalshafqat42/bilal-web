import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { WorkProof } from "@/components/ProofLoop";
import Contact from "@/components/Contact";
import Reveal from "@/components/Reveal";
import DeviceFrame from "@/components/DeviceFrame";
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
    openGraph: {
      title: `${c.name} App — React Native Case Study`,
      description: `A cross-platform iOS and Android app for ${c.name}, built in React Native from a single codebase.`,
      url: `${SITE}/portfolio/${c.slug}/mobile-app`,
      images: [
        {
          url: `${SITE}/portfolio/leos/mobile-app/og-leos-mobile.avif`,
          width: 1200,
          height: 630,
          alt: `The ${c.name} app sign-in screen shown on an iPhone`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [`${SITE}/portfolio/leos/mobile-app/og-leos-mobile.avif`],
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
      <Nav />
      <main className="flex-1">
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
                  <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
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
          <section className="relative mt-24 sm:mt-32">
            <div className="site-container">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
                <Reveal>
                  <p className="border-l-2 border-gold/70 pl-6 text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-[1.75rem]">
                    {app.constraints.pull}
                  </p>
                </Reveal>
                <Reveal delay={0.1}>
                  <ol className="space-y-8">
                    {app.constraints.points.map((pt, i) => (
                      <li key={pt.title} className="grid grid-cols-[auto_1fr] gap-5">
                        <span className="font-mono text-xs text-gold">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="font-semibold text-ink">{pt.title}</p>
                          <p className="mt-2 text-base leading-relaxed text-muted">{pt.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </Reveal>
              </div>
            </div>
          </section>
        ) : null}

        {/* Screen by screen. Alternating sides so the eye is not tracking one
            column all the way down a long page. */}
        <section id="screens" className="relative mt-24 scroll-mt-28 sm:mt-32">
          <div className="site-container">
            {/* Header, with the count and capture note set right and small — it is
                reference information, not a second heading. */}
            <Reveal>
              <div className="mx-auto flex max-w-[1160px] flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
                <div>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                    The work
                  </span>
                  <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
                    Screen by screen, and why each one is built that way.
                  </h2>
                </div>
                <div className="text-sm leading-relaxed text-muted/70 sm:text-right">
                  <p>{total} screens</p>
                  <p>Captured from the iOS build</p>
                </div>
              </div>
            </Reveal>

            <ol className="mx-auto mt-10 max-w-[1160px] space-y-5">
              {app.screens.map((s, i) => {
                // Phone and spec panel swap sides on alternate rows; the copy stays in
                // the middle. Reading five identical rows down a long page is what makes
                // a case study feel like a spreadsheet.
                const phoneRight = i % 2 === 1;
                return (
                  <li key={s.key}>
                    <Reveal>
                      <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-border bg-surface/25 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,272px)_minmax(0,1fr)_minmax(0,272px)]">
                        {/* Phone panel. Tilted and allowed to run past the panel edge,
                            so it reads as a device photographed on a surface rather
                            than an image pasted into a box. `overflow-hidden` on the
                            card does the cropping. */}
                        <div
                          className={`relative flex items-center justify-center px-8 py-10 xl:items-start xl:pb-0 xl:pt-12 ${
                            phoneRight ? "xl:order-3" : "xl:order-1"
                          }`}
                        >
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0"
                            style={{
                              background:
                                "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(242,201,76,0.07), transparent 72%)",
                            }}
                          />
                          {/* A lifestyle mockup already contains a phone, so it
                              is shown as-is. Wrapping it in DeviceFrame would
                              render a phone inside a phone, and the tilt that
                              suits a bare frame fights a photographed one. */}
                          {s.mockup ? (
                            <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-border">
                              <Image
                                src={s.capture.src}
                                alt={s.capture.alt}
                                width={s.capture.width}
                                height={s.capture.height}
                                sizes="(min-width:1280px) 420px, 90vw"
                                priority={i === 0}
                                className="h-auto w-full"
                              />
                            </div>
                          ) : (
                            <div
                              className={`relative w-[196px] xl:mb-[-36px] xl:w-[204px] ${
                                phoneRight ? "rotate-[7deg]" : "rotate-[-7deg]"
                              }`}
                            >
                              <DeviceFrame capture={s.capture} eager={i === 0} />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col justify-center px-8 pb-10 pt-2 xl:order-2 xl:py-12">
                          <span className="font-mono text-xs text-muted/70">
                            <span className="mr-2 inline-block h-px w-6 align-middle bg-gold/50" />
                            {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                            <span className="mx-2 text-muted/40">·</span>
                            <span className="text-gold">{s.label}</span>
                          </span>
                          <h3 className="mt-4 max-w-[30rem] text-2xl font-semibold leading-snug tracking-tight text-ink">
                            {s.headline}
                          </h3>
                          <p className="mt-4 max-w-[32rem] text-base leading-relaxed text-muted">{s.journey}</p>
                          <span className="mt-7 inline-flex self-start rounded-full border border-gold/25 bg-gold/[0.06] px-4 py-1.5 text-xs text-gold/90">
                            {s.tag}
                          </span>
                        </div>

                        {/* At a glance. Every value here is readable off the capture
                            beside it, which is the only thing that makes a spec panel
                            worth printing. */}
                        <div
                          className={`flex flex-col justify-center border-t border-border px-8 py-10 md:col-span-2 xl:col-span-1 xl:border-l xl:border-t-0 xl:py-12 ${
                            phoneRight ? "xl:order-1 xl:border-l-0 xl:border-r" : "xl:order-3"
                          }`}
                        >
                          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted/60">
                            At a glance
                          </p>
                          <dl className="mt-6 space-y-5 md:grid md:grid-cols-3 md:gap-8 md:space-y-0 xl:block xl:space-y-5">
                            {s.glance.map((g) => (
                              <div key={g.label} className="border-b border-border/70 pb-4 last:border-b-0 last:pb-0 md:border-b-0 md:pb-0 xl:border-b xl:pb-4 xl:last:border-b-0 xl:last:pb-0">
                                <dt className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted/60">
                                  {g.label}
                                </dt>
                                <dd className="mt-1.5 text-sm text-ink">{g.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {app.scope ? (
          <section className="relative mt-24 sm:mt-32">
            <div className="site-container">
              <Reveal>
                <div>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                    Scope
                  </span>
                  <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
                    What I handled on this project.
                  </h2>
                </div>
              </Reveal>
              <div className="mt-12 grid grid-cols-1 gap-10 border-t border-border pt-10 sm:grid-cols-3 sm:gap-8">
                {app.scope.map((group) => (
                  <Reveal key={group.heading}>
                    <div>
                      <h3 className="font-semibold text-ink">{group.heading}</h3>
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
                  <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
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
              <div className="grid grid-cols-1 gap-4 border-t border-border pt-10 sm:grid-cols-2">
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
      <Footer />
    </>
  );
}
