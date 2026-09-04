import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pillars } from "@/data/pillars";
import CtaButton from "@/components/CtaButton";

/**
 * The four disciplines, as a ledger of rows rather than a card deck.
 *
 * Replaces the previous hover-to-reveal version, which showed one pillar at a
 * time in a card and hid the other three behind a hover. That cost more than it
 * looked: three quarters of the section was invisible on arrival, the reveal
 * did not exist at all on touch, and the whole thing needed `useState` plus
 * framer-motion to run. A visitor deciding whether one person can cover all
 * four disciplines needs to see all four at once — that is the entire argument
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
 */
export default function CapabilityLedger() {
  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="site-container">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Capabilities
        </span>

        <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-16">
          <h2 className="text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            Four disciplines.
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
              I do all four, so the strategy and the build never disagree.
            </strong>
          </p>
        </div>

        <ul className="mt-14 border-t border-border">
          {pillars.map((pillar, i) => (
            <li
              key={pillar.slug}
              // `group` and `relative` carry the stretched link below: the whole
              // row is clickable, while the accessible name stays just the
              // title rather than the title plus summary plus three tags.
              className="group relative border-b border-border transition-colors hover:bg-surface/40"
            >
              <div className="grid grid-cols-1 items-start gap-x-8 gap-y-4 px-2 py-9 sm:px-4 lg:grid-cols-[auto_minmax(0,0.7fr)_minmax(0,1.3fr)_auto] lg:gap-x-10">
                <span className="font-mono text-xs text-muted/70 lg:pt-2">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="text-2xl font-semibold leading-snug tracking-tight text-ink">
                  <Link
                    href={pillar.ledgerHref ?? `/services/${pillar.slug}`}
                    className="outline-none after:absolute after:inset-0 focus-visible:underline focus-visible:decoration-gold focus-visible:underline-offset-4"
                  >
                    {pillar.label}
                  </Link>
                </h3>

                <div>
                  <p className="text-base leading-relaxed text-muted">{pillar.ledgerSummary}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {pillar.ledgerTags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md border border-border bg-surface/60 px-3 py-1.5 font-mono text-xs text-muted"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Decorative: the row is already a link via the title above, so
                    exposing this too would ship four duplicate links per row. */}
                <span
                  aria-hidden="true"
                  className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors group-hover:border-gold/50 group-hover:text-gold lg:flex lg:mt-1"
                >
                  <ArrowRight size={15} />
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
          <CtaButton href="/contact">Book a free consultation</CtaButton>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
          >
            See work across these services <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
