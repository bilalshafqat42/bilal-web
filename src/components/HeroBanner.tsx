import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CtaButton from "@/components/CtaButton";

/**
 * Homepage banner: headline, portrait, proof bar, recent work.
 *
 * Server component. Nothing here is interactive, so it costs no client
 * JavaScript and every word is in the initial HTML.
 *
 * Horizontal padding matches the header's rather than using `.site-container`,
 * which is a centred 83.33% column at desktop. That is deliberate: the design
 * aligns the headline to the wordmark and lets the portrait bleed off the right
 * edge, neither of which a centred column can do. It is the same padding scale,
 * not a new max-width.
 */

const STATS = [
  { value: "15", label: "Years across marketing, design and development" },
  { value: "4", label: "Disciplines, one person, not four suppliers" },
  { value: "UK + UAE", label: "Property developers in the UK and UAE" },
];

const RECENT = [
  { name: "Hadley Heights", href: "/portfolio/leos-developments/hadley-heights" },
  { name: "Weybridge Gardens 2", href: "/portfolio/leos-developments/weybridge-gardens-2" },
  { name: "Cavendish Square", href: "/portfolio/leos-developments/cavendish-square" },
];

export default function HeroBanner() {
  return (
    <section id="home" className="relative overflow-hidden bg-bg">
      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,34%)] lg:items-stretch">
        <div className="relative z-10 px-6 pb-12 pt-12 sm:pt-16 lg:px-10 lg:pb-[3.75rem] lg:pt-[4.75rem]">
          <span className="inline-flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
            Available for new work
          </span>

          <h1 className="mt-8 text-[2.1rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink sm:text-5xl lg:mt-11 lg:text-[4.6rem]">
            One senior partner.
            <br />
            Campaign to code.
          </h1>

          <p className="mt-7 max-w-[30ch] lg:mt-11 text-base leading-relaxed text-muted sm:max-w-[46ch] lg:text-[1.05rem]">
            Fifteen years of paid marketing, web and app development, design and CRM automation. No
            account managers, no handoffs.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8 lg:mt-14">
            <CtaButton href="/contact">Book a free consultation</CtaButton>
            {/* Bordered pill on mobile, plain underlined link at desktop, as
                designed: at phone width two stacked pills read as a pair of
                equal choices, which is the right hierarchy on a small screen. */}
            <Link
              href="/portfolio"
              className="inline-flex justify-center rounded-full border border-border px-8 py-4 text-sm font-semibold text-ink transition-colors hover:bg-white/5 sm:rounded-none sm:border-0 sm:px-0 sm:py-0 sm:underline sm:decoration-1 sm:underline-offset-[6px] sm:hover:bg-transparent sm:hover:opacity-80"
            >
              See the work
            </Link>
          </div>
        </div>

        {/* Portrait.
            On mobile it stays a block in the flow, under the copy, as designed
            — a photograph behind body text at phone width would wreck
            legibility for no gain.

            At desktop it moves out of flow to sit behind the content. Two
            things follow from that and both are deliberate. The grid keeps its
            two columns even though only one is now filled, which is what stops
            the headline running underneath the photograph. And because the
            portrait no longer contributes height, the section is sized purely
            by the text column — which measured identically before, so this
            changes no other content's position. */}
        <div className="relative h-[360px] w-full sm:h-[440px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[46%] lg:overflow-hidden">
          {/* Monochrome, as in the design. `grayscale` plus a little added
              contrast rather than a separate black-and-white asset: one image
              serves this and the about panel, and a filter costs nothing at
              render time.

              Edge masks live in `.hero-portrait` in globals.css, because the
              left-edge fade has to be desktop-only and an inline style cannot
              carry a media query. On a phone this image runs full width, where
              fading its left quarter looks like a fault, not a blend. */}
          <Image
            src="/images/bilal-shirt.avif"
            alt="Bilal Shafqat"
            fill
            sizes="(min-width: 1024px) 34vw, 100vw"
            className="hero-portrait object-cover object-[50%_15%] brightness-[1.04] contrast-[1.12] grayscale lg:origin-top lg:scale-[1.15]"
            priority
          />
        </div>
      </div>

      {/* Proof bar. Dividers are borders on the cells rather than a separate
          element, so they cannot drift out of alignment with the grid. */}
      <dl className="grid grid-cols-2 border-y border-border lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.value}
            className={`border-border px-6 py-7 lg:px-10 lg:py-9 ${
              i % 2 === 0 ? "border-r" : ""
            } ${i < 2 ? "border-b lg:border-b-0" : ""} lg:border-r lg:last:border-r-0`}
          >
            <dt className="text-3xl font-bold tracking-tight text-ink lg:text-4xl">{s.value}</dt>
            <dd className="mt-2 max-w-[24ch] text-sm leading-relaxed text-muted">{s.label}</dd>
          </div>
        ))}

        {/* Placeholder, and shown as one on purpose. The design marks this slot
            with [ 0.0x ] and a dashed rule; no campaign result has been shared
            for publication, so inventing a figure here is not an option. Swap
            the value and the label together once there is a real one. */}
        <div className="border-border px-6 py-7 lg:px-10 lg:py-9">
          <dt className="text-3xl font-bold tracking-tight text-gold lg:text-4xl">
            <span className="border-b border-dashed border-gold/50 pb-1">[ 0.0x ]</span>
          </dt>
          <dd className="mt-2 max-w-[24ch] text-sm leading-relaxed text-muted">
            Your strongest client result goes here
          </dd>
        </div>
      </dl>

      <div className="border-b border-border px-6 py-6 lg:px-10">
        <div className="lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div className="lg:flex lg:items-center lg:gap-6">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
              Recent work
            </span>

            {/* A row of separated links at desktop; a divided list with its own
                affordance per row on mobile, where a slash-separated row would
                give three tap targets a few pixels apart. */}
            <ul className="mt-4 lg:mt-0 lg:flex lg:items-center lg:gap-4">
              {RECENT.map((w, i) => (
                <li key={w.href} className="lg:flex lg:items-center lg:gap-4">
                  {i > 0 ? (
                    <span aria-hidden="true" className="hidden text-muted/50 lg:inline">
                      /
                    </span>
                  ) : null}
                  <Link
                    href={w.href}
                    className="flex items-center justify-between border-b border-border py-3.5 text-sm font-semibold text-ink transition-colors hover:text-gold lg:border-0 lg:py-0"
                  >
                    {w.name}
                    <ArrowUpRight size={15} className="text-muted lg:hidden" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-5 text-sm text-muted lg:mt-0 lg:shrink-0">
            For LEOS Developments, Tomorrow World and Refine
          </p>
        </div>
      </div>
    </section>
  );
}
