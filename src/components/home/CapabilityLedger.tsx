import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeDisciplines } from "@/data/pillars";
import CtaButton from "@/components/ui/CtaButton";
import Eyebrow from "@/components/ui/Eyebrow";

/**
 * The three disciplines, as a ledger of rows rather than a card deck.
 *
 * A visitor deciding whether one person can cover all three disciplines needs
 * to see all three at once, which is the entire argument the section makes.
 *
 * Server component by design. Every row is present in the HTML, so it costs no
 * client JavaScript, needs no hydration, and is fully readable to a crawler.
 *
 * Deliberately not using `SectionHeading`: it wraps its output in `Reveal`,
 * which is a client component, and its centred single-line layout does not fit
 * a left-aligned headline sitting beside an intro paragraph.
 *
 * ---------------------------------------------------------------------------
 * Restyled 2026-10-23, from Bilal's note: a solid black band, no gold row
 * fill, no rounded corners, a long arrow centred in a circle. The reference was
 * a plain services list: hairline rows, a strong top rule, a small coloured
 * number, a large title, the description beside it, an outline circle that
 * fills on hover.
 *
 * **No entrance animation any more.** `LedgerEntrance` used to hold the heading
 * and rows at opacity 0 until the about band above had lifted off, then fade
 * them in. Scrolled at any real speed, that meant arriving at a half-faded
 * heading already passing under the header. On desktop the band lifting off is
 * itself the entrance, so the content now simply sits there, finished, waiting
 * to be uncovered. On a phone it scrolls in like any other section.
 *
 * **The rows.** Each row is one link to its category page, stretched over the
 * row with `::after`, and each chip is its own link raised above that overlay.
 * Siblings, never nested, so there is no `<a>` inside an `<a>`. The hover and
 * focus treatment is in `globals.css` under `.ledger-row`.
 */
export default function CapabilityLedger() {
  return (
    <section id="services" aria-labelledby="services-heading" className="ledger-section relative">
      <div className="site-container">
        {/* The chapter marker, with a hairline running off it. */}
        <div className="flex items-center gap-4">
          <Eyebrow as="p" rule>
            Services
          </Eyebrow>
          <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16">
          <h2 id="services-heading" className="t-h2 text-ink">
            Three disciplines.{" "}
            <br />
            One{" "}
            <span className="bg-gradient-to-r from-[#f8dd8f] via-gold to-gold-2 bg-clip-text text-transparent">
              point of contact.
            </span>
          </h2>

          <p className="border-l-2 border-gold/70 pl-5 text-base leading-relaxed text-muted">
            Most businesses stitch this together from an agency, a developer and a freelancer, then
            spend their week translating between them.{" "}
            <strong className="font-semibold text-ink">
              I do all three, so the strategy and the build never disagree.
            </strong>
          </p>
        </div>

        <ul className="ledger-list mt-12 lg:mt-16">
          {homeDisciplines.map((pillar, i) => (
            <li key={pillar.label} className="ledger-row">
              <div className="ledger-row__grid">
                <span className="ledger-row__num font-mono text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="ledger-row__title">
                  <Link href={pillar.href} className="ledger-row__link">
                    {pillar.label}
                    <span className="sr-only"> services</span>
                  </Link>
                </h3>

                <div className="ledger-row__body">
                  <p className="ledger-row__text">{pillar.summary}</p>
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

                {/* Decorative: the row is already a link via the title. The
                    arrow is drawn symmetric about the centre of its own box
                    (x 1 to 27, y 1 to 11), so flex centring puts it in the
                    exact middle of the circle. */}
                <span aria-hidden="true" className="ledger-row__arrow">
                  <svg viewBox="0 0 28 12" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 6h26M22 1l5 5-5 5" />
                  </svg>
                </span>
              </div>
            </li>
          ))}
        </ul>

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
