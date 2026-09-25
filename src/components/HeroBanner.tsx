import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CtaButton from "@/components/CtaButton";
import PortraitReveal from "@/components/PortraitReveal";

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

/** Three, not four.
 *
 *  A fourth cell read "[ 0.0x ] — Your strongest client result goes here",
 *  rendered as a visible placeholder with a dashed rule. That was defensible
 *  while it was a design marker; it is not something to ship above the fold on
 *  a live site, where it reads as an unfinished page rather than as a slot
 *  awaiting a number.
 *
 *  Removed rather than filled: no campaign result has been shared for
 *  publication, and inventing one is not an option. To restore it, add a fourth
 *  entry here and change the grid below back to `lg:grid-cols-4`. */
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
    <section id="home" className="relative overflow-hidden bg-white">
      {/* White ground, dark block.
       *
       * The section is white so the 20% the inset hero does not cover reads as
       * gutters rather than as the page showing through. The dark fill moved
       * onto the 80% wrapper below, which also keeps it full-bleed under `lg`,
       * where that wrapper is 100% wide and the white never shows. */}
      {/* 80% of the viewport at desktop, centred, at Bilal's instruction.
       *
       * The whole hero moves together — headline, portrait, proof bar and the
       * recent-work row — so the section reads as one inset block rather than
       * a full-bleed band with an inset headline inside it.
       *
       * The portrait keeps its bleed: it is `lg:absolute lg:right-0` against
       * the grid below, and the grid is now this wrapper's child, so "right"
       * means the right edge of the 80% column instead of the viewport. That is
       * the intended behaviour here — a portrait bleeding past an inset hero
       * into open background would read as an overflow bug, not a bleed.
       *
       * Full width below `lg`, where 80% of a phone is just a narrow column.
       *
       * **The `lg:px-14` on the blocks inside is not optional.** Insetting the
       * hero without it let text run flush to the dark block's edge — "For LEOS
       * Developments, Tomorrow World and Refine" sat hard against the right
       * side and read as clipped. The wrapper carries no padding of its own, so
       * each block inside supplies its own, and the portrait stays outside that
       * because it is meant to reach the block edge. */}
      {/* Width comes from `--hero-w`, which `HomeParallax` drives from scroll
           position — 80% while the hero sits down the page, widening to 100% as
           it reaches the header. Defaults to 100%, so the server-rendered page
           and anyone without JavaScript get the full-bleed hero rather than an
           inset one that never widens. */}
      {/* 20px corners, as asked, and `overflow-hidden` with them — the portrait
          is absolutely positioned to the right edge of this block, so without
          the clip it would square the two right-hand corners off again.
          
          **The radius is tied to `--hero-fill` rather than being a constant,
          and that is a fix rather than a flourish.** 20px while the block is
          the inset card, easing to 0 as it reaches full bleed. Held at a
          constant 20px it looked correct at rest and wrong once open: an
          edge-to-edge block with rounded corners cuts four wedges out of
          itself, and the white parallax wrapper showed through the bottom two
          as notches sitting on the dark section below. Measured at 1440x900
          before this: two white wedges roughly 20px square at the block's
          bottom corners.
          
          `lg:` only, because below `lg` the hero is always full bleed and the
          same wedges would appear down the sides. */}
      {/* **`min-h-svh` in both states, and the height no longer animates.**
      
          It used to be `calc(var(--hero-fill) * 100svh)`, so the block grew
          from 834px to 900px as it opened — and that made the **document** 66px
          taller mid-animation, measured at 10726px closed against 10792px open.
          Anything scrolling the window toward a target was therefore aiming at
          a target that moved underneath it, which is where the little
          overshoot-and-correct wobble at the end of the open came from.
          
          Fixing it costs almost nothing visually: the inset block is now 66px
          taller at rest, which is the same block filling the window's height
          with white margins down its sides rather than all four. Only the width
          and the corner radius animate now, and neither of those changes the
          height of anything below. */}
      <div className="overflow-hidden bg-bg lg:mx-auto lg:flex lg:min-h-svh lg:flex-col lg:rounded-[calc((1-var(--hero-fill,1))*20px)] lg:w-[var(--hero-w,100%)]">
      {/* `lg:flex-1` so the height the block gains on snap lands here, on the
          headline and the portrait, rather than stretching the proof bar. */}
      <div className="relative grid grid-cols-1 lg:flex-1 lg:grid-cols-[1fr_minmax(0,34%)] lg:items-stretch">
        <div className="relative z-10 px-6 pb-12 pt-12 sm:pt-16 lg:flex lg:flex-col lg:justify-center lg:px-14 lg:pb-[3.75rem] lg:pt-[4.75rem]">
          <span className="inline-flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
            Available for new work
          </span>

          {/* Plain text, no reveal.
           *
           * This carried a `clip-path` typewriter effect whose `steps()` counts
           * were hard-coded per line in `globals.css`, with a standing warning
           * that rewording the headline meant editing them by hand. Removed at
           * Bilal's instruction once the opener above took on the animated
           * moment — two typed headlines in the first two screens was one too
           * many, and this is the line that should simply be read.
           *
           * The `.type-line*` and `.type-caret` rules went with it. Do not
           * confuse those with `.type-caret-block`, which the opener still
           * uses. */}
          {/* `t-display`, not `t-h1`: the first screen gets the one editorial
              size that sits above the scale. Used here and by the opener
              statement, and nowhere else — a page that uses it twice has
              stopped having a hierarchy. */}
          <h1 className="t-display mt-8 text-ink lg:mt-11">
            One senior partner.
            <br />
            Campaign to code.
          </h1>

          <p className="mt-7 max-w-[30ch] lg:mt-11 text-base leading-relaxed text-muted sm:max-w-[46ch] lg:text-[1.05rem]">
            Fifteen years of paid marketing, web and app development, design and CRM automation. No
            account managers, no handoffs.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8 lg:mt-14">
            <CtaButton href="/appointment">Book a free consultation</CtaButton>
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
          {/* Monochrome at rest; colour wiped in under the cursor, with a soft
              parallax drift. The edge masks that used to sit on this `<img>`
              moved onto `PortraitReveal`'s wrapper — see the note in that file
              for why they cannot stack with the reveal mask. */}
          <PortraitReveal
            src="/images/bilal-shirt.avif"
            alt="Bilal Shafqat"
            // 46vw, not 34vw. The column is `lg:w-[46%]` and the image is then
            // scaled 1.035, so a 34vw variant was being stretched across it —
            // a soft portrait in the first thing anyone sees (roadmap 213.18).
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover object-[50%_15%] brightness-[1.04] contrast-[1.12] lg:origin-top lg:scale-[1.035]"
            priority
          />
        </div>
      </div>

      {/* Proof bar. Dividers are borders on the cells rather than a separate
          element, so they cannot drift out of alignment with the grid. */}
      <dl className="grid grid-cols-2 border-y border-border lg:grid-cols-3">
        {STATS.map((s, i) => (
          <div
            key={s.value}
            // Dividers are borders on the cells, so they cannot drift out of
            // alignment with the grid. Two columns on mobile, three at desktop:
            // the odd cell sits alone on the second mobile row and takes no
            // right border there.
            // The last cell reserves the same gutter as the project strip: the
            // enquiry button is fixed to the bottom-right, and at 1280x800 the
            // shorter viewport put it directly over this cell's label.
            className={`border-border px-6 py-7 lg:px-8 lg:py-9 lg:first:pl-14 lg:last:pr-14 ${
              i % 2 === 0 ? "border-r lg:border-r" : "lg:border-r"
            } ${i < STATS.length - 1 ? "border-b lg:border-b-0" : ""} lg:last:border-r-0`}
          >
            <dt className="text-3xl font-bold tracking-tight text-ink lg:text-4xl">{s.value}</dt>
            <dd className="mt-2 max-w-[24ch] text-sm leading-relaxed text-muted">{s.label}</dd>
          </div>
        ))}

      </dl>

      <div className="border-b border-border px-6 py-6 lg:px-14">
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
      </div>
    </section>
  );
}
