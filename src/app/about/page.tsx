import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SocialLinks from "@/components/SocialLinks";
import { pillars, accentClasses } from "@/data/pillars";

export const metadata: Metadata = {
  title: "About Bilal Shafqat — Digital Marketer & Developer, Dubai",
  description:
    "15 years across paid marketing, web and app development, design, and CRM automation. Based in Dubai, working directly with founders, real estate developers, and in-house teams as one senior partner.",
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

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pb-16 sm:pb-20">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="site-container relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
                  About
                </span>
                <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
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
                  <Link
                    href="/contact"
                    className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-shadow"
                  >
                    Book a free consultation <ArrowRight size={16} />
                  </Link>
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

            <Reveal delay={0.15}>
              <div className="relative">
                <div className="blob pointer-events-none absolute -top-10 left-1/4 h-64 w-64 rounded-full bg-gold/35" />
                <div
                  role="img"
                  aria-label="Portrait of Bilal Shafqat"
                  className="relative aspect-[4/5] w-full rounded-[2rem] border border-border glass-strong"
                  style={{
                    backgroundImage: "url(/images/bilal-shafqat-coat.avif)",
                    backgroundSize: "130%",
                    backgroundPosition: "center 20%",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative mt-24 sm:mt-32">
          <div className="site-container">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
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
                      href={`/services/${pillar.slug}`}
                      className="card-hover group flex h-full flex-col rounded-2xl border border-border panel p-7"
                    >
                      <span
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${accent.bg}`}
                      >
                        <Icon size={20} className={accent.icon} />
                      </span>
                      <h3 className="mt-5 text-xl font-semibold text-ink">{pillar.label}</h3>
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
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
                How working with me is different
              </h2>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {principles.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-border panel p-7">
                    <h3 className="text-lg font-semibold text-ink leading-snug">{p.title}</h3>
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
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
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

        <section className="relative mt-24 sm:mt-32">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] border border-border glass-strong px-8 py-14 text-center sm:px-16">
                <div
                  className="blob pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/50"
                  style={{ animationDelay: "-4s" }}
                />
                <div className="relative">
                  <h2 className="text-3xl sm:text-4xl font-semibold leading-tight text-ink">
                    Based in Dubai, <span className="text-gradient">working with you directly.</span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-muted leading-relaxed">
                    Tell me what you&apos;re trying to achieve and I&apos;ll come back
                    with next steps, not a generic proposal deck.
                  </p>
                  <Link
                    href="/contact"
                    className="btn-primary mt-9 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-shadow"
                  >
                    Book a free consultation <ArrowRight size={16} />
                  </Link>
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
