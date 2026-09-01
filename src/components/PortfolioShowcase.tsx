"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import SectionHeading from "./SectionHeading";

type Slide = {
  /** Pill text. Kept short because a collapsed card is ~210px wide and a longer
   *  label runs underneath the open/close button. */
  label: string;
  /** Full discipline name, shown in the status line under the row. */
  full: string;
  /** Shown while collapsed. The full headline wraps to five lines in a 200px
   *  column, which is unreadable; a two or three word version is not. */
  short: string;
  headline: string;
  detail: string;
  client: string;
  href: string;
  image: string;
  alt: string;
  /** Tall phone captures crop badly in a wide box, so they get a framed inset. */
  portrait?: boolean;
};

const slides: Slide[] = [
  {
    label: "Web Design",
    full: "Web Design",
    short: "Design that holds up",
    headline: "Design that survives contact with a campaign",
    detail:
      "Corporate site for a UK and Dubai developer, designed so the pages campaigns point at hold the brand without slowing the funnel down.",
    client: "LEOS Developments",
    href: "/portfolio/leos-developments",
    image: "/portfolio/leos/landing-page/leos-landing-page.avif",
    alt: "LEOS Developments corporate website design",
  },
  {
    label: "Web Apps",
    full: "Web App Development",
    short: "Built to convert",
    headline: "High-converting builds on Next.js",
    detail:
      "Launch landing page engineered around the campaigns that feed it, with the price qualifier high on the page so unqualified traffic filters itself out early.",
    client: "Hadley Heights",
    href: "/portfolio/leos-developments/hadley-heights",
    image: "/portfolio/leos/hadley-heights/landing-page/hadley-heights-landing-page.avif",
    alt: "Hadley Heights lead capture landing page",
  },
  {
    label: "Mobile Apps",
    full: "Mobile App Development",
    short: "Phone first",
    headline: "Phone-first, not a desktop layout squeezed down",
    detail:
      "The hero crops to keep the tower and the development name legible at 366px, and the registration button sits within thumb reach rather than below the fold.",
    client: "Weybridge Gardens 2",
    href: "/portfolio/leos-developments/weybridge-gardens-2",
    image: "/portfolio/leos/weybridge-gardens-2/landing-page/weybridge-mobile.avif",
    alt: "Weybridge Gardens 2 mobile landing page",
    portrait: true,
  },
  {
    label: "Social Media",
    full: "Social Media Marketing",
    short: "Paid and organic",
    headline: "Creative that runs paid and organic",
    detail:
      "Award-winning campaign and brand creative, produced to stay consistent with the website and the ads rather than drifting into its own visual language.",
    client: "LEOS Developments",
    href: "/portfolio/leos-developments",
    image: "/portfolio/leos/social-media/1.avif",
    alt: "Award-winner social creative for LEOS Developments",
  },
];

export default function PortfolioShowcase() {
  // -1 means nothing is expanded, so all cards sit at equal width.
  const [active, setActive] = useState(-1);

  const step = (dir: 1 | -1) => {
    setActive((current) => {
      if (current === -1) return dir === 1 ? 0 : slides.length - 1;
      return (current + dir + slides.length) % slides.length;
    });
  };

  return (
    <section id="showcase" className="relative py-20 sm:py-24">
      <div className="site-container">
        <SectionHeading
          eyebrow="Selected Work"
          title="What I Actually"
          highlight="Build"
          description="Hover a card to open it, or use the arrows. Every piece links to the case study behind it."
        />

        {/* Desktop: one flex row where the open card takes the space the others
            give up. flex-grow is a plain number, so it interpolates cleanly in
            CSS with no risk of a non-animatable keyword at either end. */}
        <div className="mt-14 hidden gap-3 lg:flex lg:h-[clamp(420px,58vh,600px)]">
          {slides.map((s, i) => {
            const open = i === active;
            return (
              <article
                key={s.label}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                style={{
                  flexGrow: open ? 2.5 : 1,
                  flexBasis: 0,
                  transition: "flex-grow 650ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                className="group relative min-w-0 overflow-hidden rounded-2xl border border-border bg-bg"
              >
                {s.portrait ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-surface/40 p-6">
                    <div className="relative h-full w-[42%] max-w-[190px] overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/60">
                      <Image src={s.image} alt={s.alt} fill sizes="220px" className="object-cover object-top" />
                    </div>
                  </div>
                ) : (
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 1024px) 90vw, 55vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                )}

                {/* Scrim is stronger when open, because the open card carries a
                    paragraph and a button rather than just a headline. */}
                <div
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                    open
                      ? "bg-gradient-to-t from-black/90 via-black/55 to-black/20"
                      : "bg-gradient-to-t from-black/95 via-black/60 to-black/20"
                  }`}
                />

                <span className="absolute left-4 top-4 max-w-[calc(100%-4.25rem)] truncate rounded-full border border-white/15 bg-black/55 px-3.5 py-2 text-xs font-medium text-white/90 backdrop-blur-sm">
                  {s.label}
                </span>

                {/* Real button, so the card can be opened without a pointer. */}
                <button
                  type="button"
                  onClick={() => setActive(open ? -1 : i)}
                  aria-expanded={open}
                  aria-label={open ? `Close ${s.full}` : `Open ${s.full}`}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-bg transition-transform duration-300 hover:scale-105"
                >
                  {open ? <X size={16} /> : <Plus size={16} />}
                </button>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  {/* Collapsed cards are narrow, so the headline is held to a
                      readable measure rather than wrapping one word per line. */}
                  <h3
                    className={`font-semibold leading-tight text-white transition-all duration-500 ${
                      open ? "max-w-lg text-2xl sm:text-3xl" : "text-lg"
                    }`}
                  >
                    {open ? s.headline : s.short}
                  </h3>

                  {/* Grid-rows trick: animating max-height from 0 needs a known
                      end value, which this content does not have. A 0fr to 1fr
                      grid row animates to the content's own height instead. */}
                  <div
                    className="grid transition-all duration-500"
                    style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
                        {s.detail}
                      </p>
                      <p className="mt-3 text-sm text-white/55">{s.client}</p>
                      <a
                        href={s.href}
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-bg transition-transform hover:scale-[1.03]"
                      >
                        Learn more <ArrowRight size={15} />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Rule and controls, matching the reference. The arrows move which card
            is open, which is what makes them useful on a row that already fits
            on screen. */}
        <div className="mt-8 hidden items-center gap-6 border-t border-border pt-6 lg:flex">
          <p className="flex-1 text-sm text-muted">
            {active === -1 ? "Four disciplines, one supplier." : slides[active].full}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => step(-1)}
              aria-label="Previous discipline"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-gold/40 hover:bg-white/5"
            >
              <ArrowLeft size={17} />
            </button>
            <button
              onClick={() => step(1)}
              aria-label="Next discipline"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-gold/40 hover:bg-white/5"
            >
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        {/* Below lg there is no room to expand anything sideways, so the cards
            become a swipeable row with the detail always shown. */}
        <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:hidden">
          {slides.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="relative h-[420px] w-[82vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-bg sm:w-[60vw]"
            >
              {s.portrait ? (
                <div className="absolute inset-0 flex items-center justify-center bg-surface/40 p-6">
                  <div className="relative h-full w-[38%] overflow-hidden rounded-xl border border-white/10">
                    <Image src={s.image} alt={s.alt} fill sizes="160px" className="object-cover object-top" />
                  </div>
                </div>
              ) : (
                <Image src={s.image} alt={s.alt} fill sizes="82vw" className="object-cover object-top" />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm">
                {s.label}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="text-xl font-semibold leading-tight text-white">{s.headline}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/70">{s.detail}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                  Learn more <ArrowRight size={14} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
