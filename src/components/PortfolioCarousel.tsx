"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const cards = [
  {
    title: "Social Media Marketing",
    blurb: "Campaign and brand creative built to run as paid and organic, kept consistent with everything else the brand does.",
    href: "/services/social-media-marketing",
    image: "/portfolio/leos/social-media/1.avif",
    alt: "Award-winner social creative for LEOS Developments over a residential high-rise",
    accent: "text-gold",
  },
  {
    title: "App Development",
    blurb: "High-converting builds on Next.js, engineered around the campaigns that send traffic to them rather than bolted on after.",
    href: "/services/website-app-development",
    image: "/portfolio/leos/hadley-heights/landing-page/hadley-heights-landing-page.avif",
    alt: "Hadley Heights lead capture landing page",
    accent: "text-violet",
  },
  {
    title: "Mobile Development",
    blurb: "Interfaces designed for the phone first, not a desktop layout squeezed down — hero cropped, actions within thumb reach.",
    href: "/services/website-app-development",
    image: "/portfolio/leos/weybridge-gardens-2/landing-page/weybridge-mobile.avif",
    alt: "Weybridge Gardens 2 mobile landing page",
    accent: "text-cyan",
  },
  {
    title: "UI/UX Design",
    blurb: "Interface work judged on how it is actually used, handed off cleanly into development because the same person builds it.",
    href: "/services/ui-ux-design",
    image: "/portfolio/leos/landing-page/leos-landing-page.avif",
    alt: "LEOS Developments corporate website interface",
    accent: "text-cyan",
  },
];

export default function PortfolioCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorOn, setCursorOn] = useState(false);

  useGSAP(
    () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      // Touch devices keep native horizontal swipe, and reduced-motion users get
      // a plain scrollable row. Pinning the page would take control away from
      // both, which is the usual failing of this pattern.
      if (reduce || coarse) return;

      const distance = () => track.scrollWidth - section.clientWidth;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // Scroll distance equals the horizontal travel, so one screen of
          // vertical scroll moves one screen of cards. Any other ratio feels
          // either sticky or runaway.
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: sectionRef }
  );

  // Custom cursor. Position is written straight to the element rather than held
  // in state — re-rendering on every mousemove would be visibly janky.
  const onMove = (e: React.MouseEvent) => {
    const c = cursorRef.current;
    if (!c) return;
    c.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
  };

  return (
    <section
      ref={sectionRef}
      id="work-carousel"
      className="relative overflow-hidden py-24 sm:py-28"
      onMouseMove={onMove}
      onMouseEnter={() => setCursorOn(true)}
      onMouseLeave={() => setCursorOn(false)}
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Selected Work"
          title="What I Actually"
          highlight="Build"
          description="Scroll to move through it. Every piece here is work that shipped, not a concept."
          align="left"
        />
      </div>

      {/* On touch and reduced-motion this stays a plain scrollable row with snap. */}
      <div className="no-scrollbar mt-14 overflow-x-auto lg:overflow-visible">
        <div
          ref={trackRef}
          className="flex w-max gap-6 px-6 will-change-transform lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
        >
          {cards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              // ~45% each means two full cards plus roughly a fifth of the third,
              // which is the peek that signals "there is more this way".
              // Card width is solved, not guessed, so the third card peeks at
              // exactly 20% at any width. Wanted: padding + 2W + 2*gap + 0.2W = 100vw.
              // Below 1280 the container padding is a flat 24px, so W = (100vw-72)/2.2.
              // Above it the max-w-7xl container centres, padding grows as
              // (100vw-1280)/2+24, which reduces to W = (50vw+568)/2.2.
              // A fixed rem width cannot hold the ratio, because that padding moves.
              className="group relative w-[80vw] shrink-0 snap-start sm:w-[60vw] lg:w-[calc((100vw-72px)/2.2)] xl:w-[calc((50vw+568px)/2.2)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-border bg-surface/40">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 610px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className={`mt-6 text-2xl sm:text-3xl font-semibold ${card.accent}`}>
                {card.title}
              </h3>
              <p className="mt-3 max-w-md text-sm text-muted leading-relaxed">{card.blurb}</p>
            </a>
          ))}
        </div>
      </div>

      {/* mix-blend-difference inverts whatever is beneath, so the circle reads on
          both the dark background and a light image without needing to know which. */}
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
