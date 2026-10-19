import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeDisciplines } from "@/data/pillars";
import CtaButton from "@/components/ui/CtaButton";
import Eyebrow from "@/components/ui/Eyebrow";
import LedgerEntrance from "@/components/home/LedgerEntrance";

/**
 * The three disciplines, as a ledger of rows rather than a card deck.
 *
 * Replaces the previous hover-to-reveal version, which showed one pillar at a
 * time in a card and hid the other three behind a hover. That cost more than it
 * looked: three quarters of the section was invisible on arrival, the reveal
 * did not exist at all on touch, and the whole thing needed `useState` plus
 * framer-motion to run. A visitor deciding whether one person can cover all
 * three disciplines needs to see all three at once — that is the entire argument
 * the section is making.
 *
 * Server component by design. Every row is present in the HTML, so it costs no
 * client JavaScript, needs no hydration, and is fully readable to a crawler.
 *
 * Reuses `.site-container` and `.btn-primary` rather than introducing a new
 * max-width or button style, and the existing `pillars` data rather than a
 * parallel content file.
 *
 * Deliberately not using `SectionHeading`: it wraps its output in `Reveal`,
 * which is a client component, and its centred single-line layout does not fit
 * a left-aligned headline sitting beside an intro paragraph. The heading markup
 * is inline here rather than in a new shared component, since nothing else on
 * the site needs this shape.
 *
 * ---------------------------------------------------------------------------
 * Revised 2026-10-18, from two of Bilal's notes.
 *
 * **The entrance.** On desktop this section is uncovered by the about band
 * lifting off it, and it used to be uncovered already scrolled: its label sat
 * level with the header on the first visible frame. `.ledger-section` adds a
 * lead-in above the heading only in that layout, and `LedgerEntrance` holds the
 * heading and rows back until the band has actually gone, so the section
 * arrives as a new chapter rather than being found half-read.
 *
 * **The rows.** Each row is one link to its category page, stretched over the
 * row with `after:absolute after:inset-0`, and each chip is its own link raised
 * above that overlay with `z-10`. Siblings, never nested, so there is no
 * `<a>` inside an `<a>`. Hover, keyboard focus and a touch press all give the
 * same treatment: gold sweeps in and everything in the row turns black. The
 * styling is in `globals.css` under `.ledger-row`, because it needs
 * `@media (hover: hover)`, `:has(:focus-visible)` and a reduced-motion branch
 * together, which reads better as one block than as forty utility classes.
 */
export default function CapabilityLedger() {
  return (
    <section id="services" aria-labelledby="services-heading" className="ledger-section relative">
      <div className="site-container">
        <LedgerEntrance>
          {/* The chapter marker: the same flat gold eyebrow as every other
              section, with a hairline running off it. On a phone the about
              band and this section share the same dark ground, so without the
              line the services heading read as more of the about text. */}
          <div className="reveal-item flex items-center gap-4">
            <Eyebrow as="p" rule>
              Services
            </Eyebrow>
            <span aria-hidden="true" className="h-px flex-1 bg-border" />
          </div>

          <div className="reveal-item mt-7 grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-16">
            <h2 id="services-heading" className="t-h2 text-ink">
              Three disciplines.{" "}
              <br />
              One{" "}
              <span className="bg-gradient-to-r from-[#f8dd8f] via-gold to-gold-2 bg-clip-text text-transparent">
                point of contact.
              </span>
            </h2>

            {/* The rule sits on the paragraph rather than between the columns, so
                it stays attached to the text when the grid collapses to one
                column instead of becoming a stray horizontal line. */}
            <p className="border-l-2 border-gold/70 pl-5 text-base leading-relaxed text-muted lg:mt-2">
              Most businesses stitch this together from an agency, a developer and a freelancer, then
              spend their week translating between them.{" "}
              <strong className="font-semibold text-ink">
                I do all three, so the strategy and the build never disagree.
              </strong>
            </p>
          </div>
        </LedgerEntrance>

        <LedgerEntrance className="mt-14">
          <ul className="border-t border-border">
            {homeDisciplines.map((pillar, i) => (
              <li key={pillar.label} className="reveal-item border-b border-border">
                {/* `.ledger-row` is the positioned box the row link stretches
                    over, and the thing that lifts and turns gold. It is not
                    the `li`, because the `li` carries the reveal transform and
                    the two would fight over `transform`. */}
                <div className="ledger-row">
                  <span aria-hidden="true" className="ledger-row__fill" />

                  <div className="relative grid grid-cols-1 items-start gap-x-8 gap-y-4 px-3 py-9 sm:px-5 lg:grid-cols-[auto_minmax(0,0.7fr)_minmax(0,1.3fr)_auto] lg:gap-x-10">
                    <span className="ledger-row__num font-mono text-xs lg:pt-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <h3 className="ledger-row__title t-h4">
                      <Link href={pillar.href} className="ledger-row__link">
                        {pillar.label}
                        <span className="sr-only"> services</span>
                      </Link>
                    </h3>

                    <div>
                      <p className="ledger-row__text text-base leading-relaxed">{pillar.summary}</p>
                      <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${pillar.label} services`}>
                        {pillar.tags.map((tag) => (
                          <li key={tag.href + tag.label}>
                            <Link href={tag.href} className="ledger-chip font-mono text-xs">
                              {tag.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Decorative: the row is already a link via the title, so
                        exposing this too would add a duplicate link per row. */}
                    <span aria-hidden="true" className="ledger-row__arrow hidden lg:mt-1 lg:flex">
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </LedgerEntrance>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
          <CtaButton href="/appointment">Book a free consultation</CtaButton>
          <Link
            href="/portfolio"
            className="tap-target inline-flex items-center gap-2 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
          >
            See work across these services <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
