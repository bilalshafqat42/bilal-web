"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import CtaButton from "@/components/CtaButton";

type Card = {
  label: string;
  headline: string;
  client: string;
  deliverable: string;
  href: string;
  image: string;
  alt: string;
  /** Tall phone captures are framed rather than cropped, see below.
   *
   *  Unused since 2026-09-21, when the one card that set it — a Weybridge
   *  Gardens 2 mobile web capture filed under Mobile Development — was replaced
   *  by the LEOS app mockup, which is landscape. Kept because the next tall
   *  capture added here will need it again, and the alternative is a 367x5317
   *  image cropped to a landscape box showing only a top strip. */
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
    // Relabelled from "App Development" on 2026-09-21. The card shows a launch
    // landing page and its own headline says "Next.js builds" — it was web
    // development filed under app development, while the real app sat in no slot
    // at all.
    label: "Web Development",
    headline: "High-converting Next.js builds, engineered around the campaigns that feed them.",
    client: "Hadley Heights",
    deliverable: "Launch landing page",
    href: "/portfolio/leos-developments/hadley-heights",
    image: "/portfolio/leos/hadley-heights/landing-page/hadley-heights-landing-page.avif",
    alt: "Hadley Heights lead capture landing page",
  },
  {
    // Was the Weybridge Gardens 2 *mobile landing page* — a responsive website,
    // filed under Mobile Development. The site has a real cross-platform app and
    // this slot was pointing at a web page instead of at it.
    label: "Mobile Development",
    headline: "One codebase, two app stores, the same inventory as the website.",
    client: "LEOS Developments",
    deliverable: "Cross-platform mobile app",
    href: "/portfolio/leos-developments/mobile-app",
    image: "/portfolio/leos/mobile-app/leos-mobile-featured.avif",
    alt: "The LEOS app open on the Hadley Heights development, shown on an iPhone",
    // Landscape mockup, so it takes the standard crop rather than the phone
    // framing the tall capture needed.
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
        {/* Three across from `lg`, at Bilal's instruction — it was two at every
            size from 640px up.
            
            **There are four cards, so the second row holds one.** Three columns
            and four items cannot fill two rows; the fourth sits alone at a
            third of the width with two thirds of the row empty beside it.
            `items-stretch` stops it growing to fill that space, which would be
            worse, but the gap is inherent to the count rather than to the CSS.
            Either a fifth and sixth card or two columns fixes it, and that is a
            content decision rather than a layout one. */}
        <div className="mt-16 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
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
                            sizes="(max-width: 1024px) 170px, 130px"
                            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.05]"
                          />
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        // Recalculated for three columns. The container is
                        // full-bleed with 40px gutters and a 32px gap, so a
                        // card is roughly (100vw - 80 - 64) / 3 at desktop.
                        // Left at 41vw it would fetch the two-column width and
                        // waste about a third of every card's bytes.
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
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
                    <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-white/90">
                      {card.label}
                    </span>
                  </div>

                  {/* flex-1 on the body and mt-auto on the footer row keep the
                      "View case study" line on the same baseline in every card,
                      however many lines the headline runs to. */}
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h3 className="t-h4 text-ink">
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
            <CtaButton href="/portfolio">View the full portfolio</CtaButton>
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
