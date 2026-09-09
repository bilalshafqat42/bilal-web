import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import Reveal from "@/components/Reveal";
import DeviceFrame from "@/components/DeviceFrame";
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
type Props = { params: Promise<{ client: string }> };

export function generateStaticParams() {
  return clients.filter((c) => c.mobileApp).map((c) => ({ client: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { client } = await params;
  const c = getClient(client);
  if (!c?.mobileApp) return {};
  return {
    title: `${c.name} Mobile App — React Native Case Study | Bilal Shafqat`,
    description: `A cross-platform iOS and Android app for ${c.name}, built in React Native from a single codebase: sign-in with a guest route, the developments list, and the same enquiry paths as the website.`,
    alternates: { canonical: `/portfolio/${c.slug}/mobile-app` },
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

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Work", item: `${SITE}/portfolio` },
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
                  <h1 className="mt-5 text-4xl font-bold leading-[1.04] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
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
              <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
                <div>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                    The work
                  </span>
                  <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
                    Screen by screen, and why each one is built that way.
                  </h2>
                </div>
                <div className="text-sm leading-relaxed text-muted/70 sm:text-right">
                  <p>{total} screens</p>
                  <p>Captured from the iOS build</p>
                </div>
              </div>
            </Reveal>

            <ol className="mt-10 space-y-5">
              {app.screens.map((s, i) => {
                // Phone and spec panel swap sides on alternate rows; the copy stays in
                // the middle. Reading five identical rows down a long page is what makes
                // a case study feel like a spreadsheet.
                const phoneRight = i % 2 === 1;
                return (
                  <li key={s.key}>
                    <Reveal>
                      <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-border bg-surface/25 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)_minmax(0,210px)]">
                        {/* Phone panel. Tilted and allowed to run past the panel edge,
                            so it reads as a device photographed on a surface rather
                            than an image pasted into a box. `overflow-hidden` on the
                            card does the cropping. */}
                        <div
                          className={`relative flex min-h-[340px] items-center justify-center px-8 py-10 ${
                            phoneRight ? "lg:order-3" : "lg:order-1"
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
                          <div className="relative w-[210px] rotate-[-7deg] lg:mb-[-56px] lg:w-[240px]">
                            <DeviceFrame capture={s.capture} eager={i === 0} />
                          </div>
                        </div>

                        <div className="px-8 pb-10 pt-2 lg:order-2 lg:py-12">
                          <span className="font-mono text-xs text-muted/70">
                            <span className="mr-2 inline-block h-px w-6 align-middle bg-gold/50" />
                            {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                            <span className="mx-2 text-muted/40">·</span>
                            <span className="text-gold">{s.label}</span>
                          </span>
                          <h3 className="mt-4 max-w-sm text-2xl font-semibold leading-snug tracking-tight text-ink">
                            {s.headline}
                          </h3>
                          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">{s.journey}</p>
                          <span className="mt-7 inline-flex rounded-full border border-gold/25 bg-gold/[0.06] px-4 py-1.5 text-xs text-gold/90">
                            {s.tag}
                          </span>
                        </div>

                        {/* At a glance. Every value here is readable off the capture
                            beside it, which is the only thing that makes a spec panel
                            worth printing. */}
                        <div
                          className={`border-t border-border px-8 py-10 lg:border-l lg:border-t-0 lg:py-12 ${
                            phoneRight ? "lg:order-1 lg:border-l-0 lg:border-r" : "lg:order-3"
                          }`}
                        >
                          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted/60">
                            At a glance
                          </p>
                          <dl className="mt-6 space-y-5">
                            {s.glance.map((g) => (
                              <div key={g.label} className="border-b border-border/70 pb-4 last:border-b-0 last:pb-0">
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
                  <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
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
                  <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
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

        <Contact />
      </main>
      <Footer />
    </>
  );
}
