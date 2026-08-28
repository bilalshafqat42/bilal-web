"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";

const cards = [
  {
    title: "Social Media Marketing",
    blurb: "Campaign and brand creative built to run as paid and organic, kept consistent with everything else the brand does.",
    href: "/services/social-media-marketing",
    image: "/portfolio/leos/social-media/1.avif",
    alt: "Award-winner social creative for LEOS Developments over a residential high-rise",
    accent: "bg-gold",
    label: "Creative",
  },
  {
    title: "App Development",
    blurb: "High-converting builds on Next.js, engineered around the campaigns that send traffic to them rather than bolted on after.",
    href: "/services/website-app-development",
    image: "/portfolio/leos/hadley-heights/landing-page/hadley-heights-landing-page.avif",
    alt: "Hadley Heights lead capture landing page",
    accent: "bg-violet",
    label: "Build",
  },
  {
    title: "Mobile Development",
    blurb: "Interfaces designed for the phone first, not a desktop layout squeezed down — hero cropped, actions within thumb reach.",
    href: "/services/website-app-development",
    image: "/portfolio/leos/weybridge-gardens-2/landing-page/weybridge-mobile.avif",
    alt: "Weybridge Gardens 2 mobile landing page",
    accent: "bg-cyan",
    label: "Build",
  },
  {
    title: "UI/UX Design",
    blurb: "Interface work judged on how it is actually used, handed off cleanly into development because the same person builds it.",
    href: "/services/ui-ux-design",
    image: "/portfolio/leos/landing-page/leos-landing-page.avif",
    alt: "LEOS Developments corporate website interface",
    accent: "bg-cyan",
    label: "Design",
  },
];

export default function PortfolioCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorOn, setCursorOn] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Native horizontal scroll with snap, rather than a pinned GSAP scrub.
  // Scroll-snap is what makes it advance exactly one column, and it gives
  // trackpad, touch, drag and keyboard navigation for free — none of which a
  // pinned scrub supports. It also stops the section hijacking page scroll.
  const step = useCallback((dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0");
    track.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: "smooth" });
  }, []);

  const syncEdges = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    setAtStart(t.scrollLeft < 8);
    setAtEnd(t.scrollLeft + t.clientWidth >= t.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    syncEdges();
    t.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      t.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  }, [syncEdges]);

  const onMove = (e: React.MouseEvent) => {
    const c = cursorRef.current;
    if (!c) return;
    c.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
  };

  return (
    <section
      id="work-carousel"
      className="relative overflow-hidden py-20 sm:py-24"
      onMouseMove={onMove}
      onMouseEnter={() => setCursorOn(true)}
      onMouseLeave={() => setCursorOn(false)}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Selected Work"
            title="What I Actually"
            highlight="Build"
            description="Every piece here is work that shipped, not a concept."
            align="left"
          />

          {/* Manual controls. Hidden from screen readers' tab order is wrong here —
              they are the only non-drag way to advance, so they stay focusable. */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => step(-1)}
              disabled={atStart}
              aria-label="Previous"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-gold/40 hover:bg-white/5 disabled:opacity-30 disabled:hover:border-border disabled:hover:bg-transparent"
            >
              <ArrowLeft size={17} />
            </button>
            <button
              onClick={() => step(1)}
              disabled={atEnd}
              aria-label="Next"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-gold/40 hover:bg-white/5 disabled:opacity-30 disabled:hover:border-border disabled:hover:bg-transparent"
            >
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        // scroll-padding matters as much as padding here: without it, snap-start
        // aligns the first card to the container edge and scrolls the left inset
        // away, which pushed the third card's peek from 20% to 38%.
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 scroll-pl-6 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:scroll-pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
      >
        {cards.map((card) => (
          <a
            key={card.title}
            data-card
            href={card.href}
            // Widths solved so the third card peeks at 20% at any viewport width:
            // padding + 2W + 2·gap + 0.2W = 100vw.
            className="group h-[clamp(400px,64vh,580px)] w-[80vw] shrink-0 snap-start sm:w-[60vw] lg:w-[calc((100vw-72px)/2.2)] xl:w-[calc((50vw+568px)/2.2)]"
          >
            <article className="card-hover flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border glass">
              {/* 70/30 split. basis + shrink-0 rather than percentage heights, so
                  the ratio holds even when the blurb wraps to a third line. */}
              <div className="relative shrink-0 basis-[70%] overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 610px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-white/90 backdrop-blur-sm">
                  <span className={`h-1.5 w-1.5 rounded-full ${card.accent}`} />
                  {card.label}
                </span>
              </div>

              <div className="flex basis-[30%] flex-col justify-center px-6 py-4">
                <h3 className="text-xl sm:text-2xl font-semibold leading-tight text-ink">
                  {card.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted leading-relaxed">{card.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                  Explore
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </article>
          </a>
        ))}
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
