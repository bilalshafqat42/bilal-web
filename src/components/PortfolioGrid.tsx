"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

type Card = {
  label: string;
  headline: string;
  client: string;
  deliverable: string;
  href: string;
  image: string;
  alt: string;
  /** Tall phone captures are framed rather than cropped, see below. */
  portrait?: boolean;
};

// Each card links to the case study that proves it, not to the service page
// that sells it. Someone clicking a piece of work wants to see the work.
const cards: Card[] = [
  {
    label: "Social Media Marketing",
    headline: "Campaign and brand creative that runs paid and organic without drifting off-brand.",
    client: "LEOS Developments",
    deliverable: "Brand and campaign creative",
    href: "/portfolio/leos-developments",
    image: "/portfolio/leos/social-media/1.avif",
    alt: "Award-winner social creative for LEOS Developments over a residential high-rise",
  },
  {
    label: "App Development",
    headline: "High-converting Next.js builds, engineered around the campaigns that feed them.",
    client: "Hadley Heights",
    deliverable: "Launch landing page",
    href: "/portfolio/leos-developments/hadley-heights",
    image: "/portfolio/leos/hadley-heights/landing-page/hadley-heights-landing-page.avif",
    alt: "Hadley Heights lead capture landing page",
  },
  {
    label: "Mobile Development",
    headline: "Phone-first interfaces, not desktop layouts squeezed down to fit.",
    client: "Weybridge Gardens 2",
    deliverable: "Mobile landing page",
    href: "/portfolio/leos-developments/weybridge-gardens-2",
    image: "/portfolio/leos/weybridge-gardens-2/landing-page/weybridge-mobile.avif",
    alt: "Weybridge Gardens 2 mobile landing page",
    // A 367x5317 capture cropped to a landscape box shows only a top strip that
    // reads as a desktop page, contradicting the headline above it.
    portrait: true,
  },
  {
    label: "UI/UX Design",
    headline: "Interface work judged on how it is used, handed straight into development.",
    client: "LEOS Developments",
    deliverable: "Corporate website",
    href: "/portfolio/leos-developments",
    image: "/portfolio/leos/landing-page/leos-landing-page.avif",
    alt: "LEOS Developments corporate website interface",
  },
];

export default function PortfolioGrid() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorOn, setCursorOn] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    const c = cursorRef.current;
    if (c) c.style.transform = `translate(${e.clientX - 56}px, ${e.clientY - 56}px)`;
  };

  return (
    <section
      id="work-carousel"
      className="relative overflow-hidden py-20 sm:py-24"
      onMouseMove={onMove}
      onMouseEnter={() => setCursorOn(true)}
      onMouseLeave={() => setCursorOn(false)}
    >
      <div className="site-container">
        <SectionHeading
          eyebrow="Selected Work"
          title="What I Actually"
          highlight="Build"
          description="Every piece here is work that shipped, not a concept."
        />

        {/* items-stretch plus h-full on the card is what makes the four equal
            height: the grid row sizes to the tallest, and each card fills it
            rather than sitting at its own content height. */}
        <div className="mt-16 grid items-stretch gap-6 sm:grid-cols-2 lg:gap-8">
          {cards.map((card) => (
            <Reveal key={card.label + card.client} className="h-full">
              <Link href={card.href} className="group flex h-full flex-col">
                <article className="card-hover flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/30 transition-colors group-hover:border-gold/35">
                  <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-bg">
                    {card.portrait ? (
                      <div className="flex h-full items-center justify-center p-5">
                        <div className="relative h-full w-[30%] overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/60">
                          <Image
                            src={card.image}
                            alt={card.alt}
                            fill
                            sizes="170px"
                            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.05]"
                          />
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 41vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                    )}
                    {/* These are full-page captures cropped to a landscape box,
                        so the crop lands mid-section and often on a white band.
                        A scrim in the card's own colour turns that hard cut into
                        a fade, which reads as intentional rather than clipped. */}
                    {!card.portrait ? (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bg to-transparent" />
                    ) : null}
                    <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-white/90 backdrop-blur-sm">
                      {card.label}
                    </span>
                  </div>

                  {/* flex-1 on the body and mt-auto on the footer row keep the
                      "View case study" line on the same baseline in every card,
                      however many lines the headline runs to. */}
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h3 className="text-xl font-semibold leading-snug text-ink sm:text-2xl">
                      {card.headline}
                    </h3>
                    <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                      <div className="min-w-0">
                        <p className="truncate text-base font-medium text-ink/90">{card.client}</p>
                        <p className="mt-0.5 truncate text-sm text-muted">{card.deliverable}</p>
                      </div>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors group-hover:border-gold/40 group-hover:bg-gold/10 group-hover:text-gold">
                        <ArrowUpRight size={17} />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 text-center">
          <div>
            <Link
              href="/portfolio"
              className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-4 text-base font-semibold transition-shadow"
            >
              View the full portfolio
              <ArrowRight size={17} />
            </Link>
            <p className="mt-4 text-base text-muted">
              Design, development and marketing work, by client and by project.
            </p>
          </div>
        </Reveal>
      </div>

      <div
        ref={cursorRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-40 hidden h-28 w-28 items-center justify-center rounded-full border border-white/70 text-center text-xs font-semibold uppercase tracking-wide text-white mix-blend-difference transition-opacity duration-200 lg:flex ${
          cursorOn ? "opacity-100" : "opacity-0"
        }`}
      >
        View
        <br />
        work
      </div>
    </section>
  );
}
