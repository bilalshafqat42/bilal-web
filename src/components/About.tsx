import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Reveal from "./Reveal";

const intersection = [
  "Paid marketing & performance advertising",
  "Web, mobile & MERN stack development",
  "Graphic design & social media management",
];

const bestAt = [
  "Running paid Google & social campaigns that convert",
  "Designing and building websites and marketing applications",
  "Shipping mobile apps end-to-end, from design to release",
  "Producing on-brand creative and managing social channels",
];

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-14 items-start">
          <Reveal>
            <div className="relative mx-auto max-w-xs lg:mx-0">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-violet/20 via-transparent to-gold/20 blur-2xl" />
              <div className="relative rounded-[2rem] border border-border glass overflow-hidden">
                <Image
                  src="/images/bilal-about.jpg"
                  alt="Portrait of Bilal Shafqat"
                  width={800}
                  height={784}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
                About Me
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl font-semibold text-ink">
                Strategy and execution, <span className="text-gradient">under one roof.</span>
              </h2>

              <div className="mt-6 space-y-4 text-muted leading-relaxed">
                <p>
                  I run paid marketing campaigns, design and build websites and mobile apps,
                  develop custom applications on the MERN stack, and produce the graphic
                  design and social content that goes around them — as one point of contact.
                </p>
                <p>
                  Instead of briefing an agency, a developer, and a designer separately, you
                  work with one person who understands how the ad, the landing page, the
                  application behind it, and the social content promoting it all fit together.
                </p>
                <p>
                  On the technical side, I build with MongoDB, Express, React, and Node.js —
                  including custom marketing applications, dashboards, and mobile apps — so
                  campaigns aren&apos;t limited by off-the-shelf tools.
                </p>
                <p>
                  Over the years, I&apos;ve worked across real estate, eCommerce, and
                  service-based businesses, with a strong focus on UAE real estate marketing,
                  lead generation, and conversion-focused digital experiences.
                </p>
              </div>

              <div className="mt-8 grid sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-semibold text-ink">Today, I work at the intersection of:</p>
                  <ul className="mt-3 space-y-2.5">
                    {intersection.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">What I&apos;m best at:</p>
                  <ul className="mt-3 space-y-2.5">
                    {bestAt.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-8 text-muted leading-relaxed">
                Whether you need a single project delivered or an ongoing partner across
                marketing, design, and development, my focus stays on clarity, performance,
                and real business impact. Available for project-based work, retainers, and
                consulting engagements.
              </p>

              <a
                href="#contact"
                className="mt-8 btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-shadow"
              >
                Get a Quote <ArrowRight size={16} />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
