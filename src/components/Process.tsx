"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SectionHeading from "./SectionHeading";

// Images are drawn from real project work rather than stock. They are the
// weakest part of this section and the easiest to improve: swap the `image`
// and `alt` on any step and nothing else has to change.
const steps = [
  {
    step: "01",
    title: "Understand the Brief",
    subtitle: "Research & Discovery",
    description:
      "I start by understanding the business, audience, and goals before proposing a marketing, design, or development approach.",
    bullets: [
      "Business goals & success metrics",
      "Target audience & user needs",
      "Market positioning & competitors",
      "Existing tools, data, and constraints",
    ],
    image: "/portfolio/leos/social-media/3.avif",
    alt: "Campaign creative developed for LEOS Developments after the discovery stage",
  },
  {
    step: "02",
    title: "Plan & Design",
    subtitle: "Structure & Interface",
    description:
      "Based on the brief, I plan the campaign, application, or design system and map out how each piece fits together.",
    bullets: [
      "Campaign or funnel strategy",
      "UX wireframes & UI design",
      "Technical architecture (for apps)",
      "Content & creative direction",
    ],
    image: "/portfolio/leos/landing-page/leos-landing-page.avif",
    alt: "LEOS Developments corporate website interface design",
  },
  {
    step: "03",
    title: "Build & Launch",
    subtitle: "Development & Delivery",
    description:
      "Execution is hands-on, building, testing, and shipping the campaign, website, or application.",
    bullets: [
      "Paid campaign setup & launch",
      "Development, QA & deployment",
      "Design production & asset delivery",
      "Tracking & analytics setup",
    ],
    image: "/portfolio/leos/hadley-heights/landing-page/hadley-heights-landing-page.avif",
    alt: "Hadley Heights landing page built and shipped for launch",
  },
  {
    step: "04",
    title: "Optimize & Scale",
    subtitle: "Measurement & Iteration",
    description:
      "Once live, I focus on measuring performance and improving it, whether that's ad spend, conversion rate, or app usage.",
    bullets: [
      "Performance monitoring & reporting",
      "Ongoing testing and iteration",
      "Automation & workflow improvements",
      "Handover or ongoing support",
    ],
    image: "/portfolio/leos/hadley-heights/social-media/2.avif",
    alt: "Ongoing campaign creative produced for Hadley Heights",
  },
];

export default function Process() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // A step becomes active as it passes the middle of the viewport. The tall
  // negative margins collapse the root to a thin band across the centre, so
  // exactly one step qualifies at a time and the image has a single source of
  // truth to follow.
  useEffect(() => {
    const nodes = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!nodes.length || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = nodes.indexOf(entry.target as HTMLDivElement);
          if (i !== -1) setActive(i);
        }
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section id="process" className="relative bg-bg-soft/40 py-24 sm:py-32">
      <div className="site-container">
        <SectionHeading
          eyebrow="How I Work"
          title="A Structured Path From"
          highlight="Brief To Shipped Work"
          description="Whether it's a paid campaign, a website, or a custom application, every project follows the same clear process — from brief to launch to optimization."
        />

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-2 lg:gap-16">
          {/* Steps. This column is the tall one, which is what gives the image
              beside it something to stick against. */}
          <div>
            {steps.map((s, i) => {
              const on = i === active;
              return (
                <div
                  key={s.step}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  className="flex gap-5 sm:gap-7"
                >
                  <span
                    className={`w-7 shrink-0 pt-1 text-right font-display text-sm tabular-nums transition-colors duration-500 ${
                      on ? "text-ink" : "text-muted/50"
                    }`}
                  >
                    {s.step}
                  </span>

                  {/* The rail is one border per step rather than a single line
                      behind them, so the lit segment always matches the active
                      step exactly however tall that step happens to be. */}
                  <div
                    className={`w-px shrink-0 transition-colors duration-500 ${
                      on ? "bg-gold" : "bg-border"
                    }`}
                  />

                  <div
                    className={`pb-14 pl-1 transition-opacity duration-500 last:pb-0 ${
                      on ? "opacity-100" : "opacity-45"
                    }`}
                  >
                    <h3
                      className={`text-3xl font-semibold leading-tight transition-colors duration-500 sm:text-4xl ${
                        on ? "text-ink" : "text-muted"
                      }`}
                    >
                      {s.title}
                    </h3>
                    <p className="mt-2 text-lg text-muted">{s.subtitle}</p>

                    {/* On mobile there is no room for a sticky column, so each
                        step carries its own image inline instead. */}
                    <div className="relative mt-6 aspect-[16/11] overflow-hidden rounded-2xl border border-border lg:hidden">
                      <Image
                        src={s.image}
                        alt={s.alt}
                        fill
                        sizes="92vw"
                        className="object-cover object-top"
                      />
                    </div>

                    <p className="mt-6 text-base leading-relaxed text-muted">{s.description}</p>
                    <ul className="mt-5 space-y-2">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex gap-2.5 text-sm text-muted">
                          <span className="text-gold">—</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky rather than pinned. position: sticky needs no scroll
              listener, cannot desynchronise from the scroll position, and never
              takes the page scroll hostage the way a pinned trigger does. */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-bg">
                {steps.map((s, i) => (
                  <Image
                    key={s.step}
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="46vw"
                    priority={i === 0}
                    className={`object-cover object-top transition-opacity duration-700 ${
                      i === active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>

              {/* Progress bar doubles as a position indicator, so the visitor
                  can see how much of the process is left. */}
              <div className="mt-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-border">
                  <div
                    className="h-px bg-gold transition-all duration-500"
                    style={{ width: `${((active + 1) / steps.length) * 100}%` }}
                  />
                </div>
                <span className="font-display text-sm tabular-nums text-muted">
                  {steps[active].step} / {steps[steps.length - 1].step}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
