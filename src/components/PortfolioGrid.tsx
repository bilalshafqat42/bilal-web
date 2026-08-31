"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

// Four disciplines rather than four clients. The label names the discipline and
// the headline says what the work actually does, which is the pairing that
// makes a grid like this readable at a glance.
const cards = [
  {
    label: "Social Media Marketing",
    headline: "Campaign and brand creative that runs paid and organic without drifting off-brand.",
    href: "/services/social-media-marketing",
    image: "/portfolio/leos/social-media/1.avif",
    alt: "Award-winner social creative for LEOS Developments over a residential high-rise",
  },
  {
    label: "App Development",
    headline: "High-converting Next.js builds, engineered around the campaigns that feed them.",
    href: "/services/website-app-development",
    image: "/portfolio/leos/hadley-heights/landing-page/hadley-heights-landing-page.avif",
    alt: "Hadley Heights lead capture landing page",
  },
  {
    label: "Mobile Development",
    headline: "Phone-first interfaces, not desktop layouts squeezed down to fit.",
    href: "/services/website-app-development",
    image: "/portfolio/leos/weybridge-gardens-2/landing-page/weybridge-mobile.avif",
    alt: "Weybridge Gardens 2 mobile landing page",
    // A 367x5317 capture cropped to 4:3 shows only the top strip, which reads
    // as any desktop page and quietly contradicts the phone-first claim.
    // Framed in portrait it reads as what it is.
    portrait: true,
  },
  {
    label: "UI/UX Design",
    headline: "Interface work judged on how it is used, handed straight into development.",
    href: "/services/ui-ux-design",
    image: "/portfolio/leos/landing-page/leos-landing-page.avif",
    alt: "LEOS Developments corporate website interface",
  },
];

export default function PortfolioGrid() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorOn, setCursorOn] = useState(false);

  // Cursor follows in a rAF-free direct write: it is a transform on a fixed
  // element, so there is no layout cost and no need to throttle.
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

        {/* Two per row on desktop, one on mobile. The right-hand column is
            dropped down so the eye moves diagonally instead of scanning two
            flat rows, which is what stops a four-item grid looking like a
            spreadsheet. */}
        <div className="mt-16 grid gap-x-8 gap-y-14 lg:grid-cols-2 lg:gap-x-12">
          {cards.map((card, i) => (
            <Reveal key={card.label} className={i % 2 === 1 ? "lg:mt-24" : ""}>
              <a href={card.href} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface/40">
                  {card.portrait ? (
                    <div className="flex h-full items-center justify-center p-6">
                      <div className="relative h-full w-[34%] overflow-hidden rounded-[1.25rem] border border-white/10 shadow-2xl shadow-black/50">
                        <Image
                          src={card.image}
                          alt={card.alt}
                          fill
                          sizes="180px"
                          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      sizes="(max-width: 1024px) 92vw, 42vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  )}
                </div>
                <p className="mt-6 text-base text-muted">{card.label}</p>
                <h3 className="mt-2 max-w-xl text-2xl font-semibold leading-snug text-ink transition-colors sm:text-[1.75rem] group-hover:text-gold">
                  {card.headline}
                </h3>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 text-center">
          <div>
            <a
              href="/portfolio"
              className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-4 text-base font-semibold transition-shadow"
            >
              View the full portfolio
              <ArrowRight size={17} />
            </a>
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
        Read
        <br />
        more
      </div>
    </section>
  );
}
