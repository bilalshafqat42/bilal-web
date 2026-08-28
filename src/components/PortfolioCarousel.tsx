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

  // Click-and-drag with a mouse. Trackpad and touch already drag natively; a
  // mouse does not, so pointer events move scrollLeft directly. Nothing else
  // writes that property, so there is no animation library to fight with.
  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = 0;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
      down = true;
      moved = 0;
      startX = e.clientX;
      startLeft = t.scrollLeft;
      t.style.cursor = "grabbing";
      // Snap has to be off mid-drag or the container fights the pointer, and
      // smooth scrolling has to be off too: with it on, every scrollLeft write
      // starts a fresh animation that the next write cancels, so the track
      // never actually follows the pointer.
      t.style.scrollSnapType = "none";
      t.style.scrollBehavior = "auto";
      // Cards are links, and pressing on a link starts the browser's native
      // link drag, which captures the pointer and stops pointermove reaching
      // us. Suppressing the default here (and dragstart below) keeps the
      // pointer events flowing.
      e.preventDefault();
    };
    const onMovePointer = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      t.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      t.style.cursor = "";
      // Settle on the nearest card boundary ourselves. Restoring scrollSnapType
      // alone is not enough here: the track uses scroll-smooth, so the browser
      // animates back to where the drag started instead of the nearest card.
      const card = t.querySelector<HTMLElement>("[data-card]");
      if (card) {
        const gap = parseFloat(getComputedStyle(t).columnGap || "0");
        const stride = card.offsetWidth + gap;
        const nearest = Math.round(t.scrollLeft / stride) * stride;
        t.style.scrollSnapType = "";
        t.style.scrollBehavior = "";
        t.scrollTo({ left: nearest, behavior: "smooth" });
      } else {
        t.style.scrollSnapType = "";
        t.style.scrollBehavior = "";
      }
    };
    // A drag that ends on a card would otherwise also follow its link.
    const onClick = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onDragStart = (e: DragEvent) => e.preventDefault();

    t.addEventListener("pointerdown", onDown);
    t.addEventListener("dragstart", onDragStart);
    window.addEventListener("pointermove", onMovePointer);
    window.addEventListener("pointerup", onUp);
    t.addEventListener("click", onClick, true);
    return () => {
      t.removeEventListener("pointerdown", onDown);
      t.removeEventListener("dragstart", onDragStart);
      window.removeEventListener("pointermove", onMovePointer);
      window.removeEventListener("pointerup", onUp);
      t.removeEventListener("click", onClick, true);
    };
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
      <div className="site-container">
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
        className="no-scrollbar mt-10 flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 scroll-pl-6 lg:pl-[8.3333vw] lg:scroll-pl-[8.3333vw]"
      >
        {cards.map((card) => (
          <a
            key={card.title}
            data-card
            href={card.href}
            // Solved against the 10-column container so the third card shows at
            // half width: one column of margin (8.3333vw) + 2W + 2·gap + 0.5W = 100vw.
            className="group h-[clamp(400px,64vh,580px)] w-[80vw] shrink-0 snap-start sm:w-[60vw] lg:w-[calc(36.6667vw-19.2px)]"
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
