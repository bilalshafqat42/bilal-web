import Link from "next/link";
import { Info } from "lucide-react";
import Reveal from "./Reveal";
import Eyebrow from "@/components/Eyebrow";

/**
 * The four engagement models, as one comparison table.
 *
 * Rebuilt 2026-09-29 to the design Bilal sent. It replaces four cards with a
 * "See details" accordion each — a shape that made the reader open four things
 * and hold them in their head to compare, which is the opposite of what someone
 * choosing between options is trying to do. The design's own subtitle names the
 * fix: "No accordions, no 'contact for pricing'."
 *
 * ---------------------------------------------------------------------------
 * **A real `<table>`, not a grid of divs.** This is tabular data: four models
 * against six attributes. A screen reader user on a real table can ask for the
 * value at "Monthly retainer / Time to start" and get it, because `scope="col"`
 * and `scope="row"` tell it what the cell belongs to. In a div grid that
 * relationship does not exist and the whole thing reads as sixty loose phrases.
 *
 * **It scrolls sideways below `lg` rather than restacking.** A five-column
 * table cannot become four readable cards without rendering the content twice,
 * once per layout, and duplicated content is duplicated for a crawler. The
 * alternative CSS-only restack turns the table column-major — every model's
 * "commitment" together, then every model's "best for" — which is grouped by
 * attribute rather than by model, and answers a question nobody asked. A
 * horizontally scrolled comparison table is a pattern people already know.
 * ---------------------------------------------------------------------------
 *
 * **On the prices.** `AED 31,500`, `AED 16,000` and `AED 3,500` are real and
 * already published on /pricing and in the site content. The three-month
 * retainer minimum is real too. Everything still in brackets is not: the
 * ongoing-partner rate, every "time to start", the support and session windows,
 * and the "most chosen" badge — see the note on that below.
 */

type Model = {
  name: string;
  price: string;
  priceNote: string;
  /** The raised, gold-priced column. One only, or it stops meaning anything.
   *
   *  This no longer carries a "[Most chosen]" badge. That is a claim about what
   *  clients pick, and with one published client there is nothing behind it —
   *  it shipped bracketed, which is a placeholder rather than a soft claim. The
   *  column is still raised and still the one with the primary CTA, which makes
   *  the same recommendation without asserting anything. */
  featured?: boolean;
  /** Unverified prices render bracketed, the same guard the proof wall and the
   *  process timings use: the brackets are applied at render time, never typed
   *  into the string, so a figure cannot be promoted to a commitment by editing
   *  a string. */
  priceVerified: boolean;
  cta: { label: string; href: string };
};

const models: Model[] = [
  {
    name: "Project-based",
    price: "AED 31,500",
    priceNote: "starting price",
    priceVerified: true,
    cta: { label: "Get a quote", href: "/contact" },
  },
  {
    name: "Monthly retainer",
    price: "AED 16,000",
    priceNote: "per month",
    featured: true,
    priceVerified: true,
    cta: { label: "Book a free consultation", href: "/appointment" },
  },
  {
    name: "Ongoing partner",
    // No published rate, and none has ever been supplied — the previous version
    // of this file said exactly that. It shipped as "AED [amount]", which reads
    // as a page nobody finished rather than as a price that depends on scope.
    price: "Priced on scope",
    priceNote: "agreed per engagement",
    priceVerified: true,
    cta: { label: "Discuss it", href: "/contact" },
  },
  {
    name: "Consulting",
    price: "AED 3,500",
    priceNote: "per session",
    priceVerified: true,
    cta: { label: "Book a session", href: "/appointment" },
  },
];

/** One entry per row. `cells` is in the same order as `models`, and a cell is
 *  either a string or a list — the "what you get" row is the only list, and
 *  giving it its own type rather than joining with commas keeps it a list for
 *  a screen reader too.
 *
 *  A cell marked `muted` is an exclusion rather than an inclusion: "No
 *  implementation" is what consulting does *not* include, and rendering it at
 *  the same weight as the things it does include reads as a feature. */
type Cell = string | { items: (string | { text: string; muted: true })[] };

const rows: { label: string; cells: Cell[] }[] = [
  {
    label: "Commitment",
    cells: ["One scope", "Minimum 3 months", "Agreed days each week", "One session"],
  },
  {
    label: "Best for",
    cells: [
      "A focused project with a clear goal and deadline",
      "Consistent output month after month",
      "A scaling team that needs capacity, not a vendor",
      "A team that needs a second opinion, not hands",
    ],
  },
  {
    label: "What you get",
    cells: [
      { items: ["Fixed scope and price", "Design and build", "Tracking before launch", "Post-launch support"] },
      { items: ["One agreed focus a month", "Marketing, design or dev", "Report against one metric", "Direct access, no PM layer"] },
      { items: ["Inside your tools", "Priority over other work", "Quarterly planning", "Handover docs as standard"] },
      { items: ["Four-hour session", "Campaign or build review", "Written recommendations", { text: "No implementation", muted: true }] },
    ],
  },
  {
    label: "Reporting",
    cells: ["At handover", "Monthly", "Weekly", "Written summary"],
  },
];

const colClass = (m: Model) =>
  m.featured ? "bg-surface/50" : "";

/**
 * `variant` is kept from the previous version because `/pricing` renders this
 * too, under a heading that has already asked the question. Only the eyebrow
 * differs now: the old variants also toggled an audience line and a closing
 * CTA, and the accordion's default-open state, none of which survive a table.
 */
export default function Engagement({
  variant = "homepage",
}: {
  variant?: "homepage" | "detailed";
}) {
  return (
    <section id="engagement" className="relative section-pad">
      <div className="site-container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <Eyebrow>
              <span aria-hidden="true" className="h-px w-6 bg-gold/60" />
              {variant === "detailed" ? "How Engagements Work" : "Pricing & Engagement"}
            </Eyebrow>
            <h2 className="t-h2 mt-5 text-ink">Compare the four models side by side</h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-muted lg:text-right">
            No accordions, no &ldquo;contact for pricing&rdquo;. Everything you need to
            shortlist is on this screen.
          </p>
        </div>

        {/* `tabindex` and a label on the scroller: a region that scrolls must be
            reachable by keyboard, or the columns past the fold are unreachable
            without a mouse. */}
        <Reveal className="mt-14 lg:mt-16">
          <div
            role="region"
            aria-label="Engagement models compared"
            tabIndex={0}
            className="-mx-6 overflow-x-auto px-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:mx-0 sm:px-0"
          >
            <table className="w-full min-w-[56rem] border-collapse text-left">
              <caption className="sr-only">
                The four engagement models compared by commitment, what suits each one,
                what is included, time to start and reporting.
              </caption>

              <thead>
                <tr>
                  <td className="w-[11rem] align-bottom" />
                  {models.map((m) => (
                    <th
                      key={m.name}
                      scope="col"
                      className={`w-1/4 rounded-t-2xl p-5 align-bottom font-normal ${colClass(m)}`}
                    >
                      <span className="flex flex-wrap items-start justify-between gap-2">
                        <span className="t-h4 text-ink">{m.name}</span>
                      </span>
                      <span
                        className={`mt-3 block text-2xl font-bold ${
                          m.featured ? "text-gold" : "text-ink"
                        }`}
                      >
                        {m.priceVerified ? m.price : `AED [amount]`}
                      </span>
                      <span className="mt-1 block text-sm text-muted">{m.priceNote}</span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="align-top">
                    <th
                      scope="row"
                      className="border-t border-border py-5 pr-6 font-mono text-[0.65rem] font-normal uppercase tracking-[0.16em] text-muted/70"
                    >
                      {row.label}
                    </th>
                    {row.cells.map((cell, i) => (
                      <td
                        key={models[i].name}
                        className={`border-t border-border p-5 text-base leading-relaxed text-ink/90 ${colClass(models[i])}`}
                      >
                        {typeof cell === "string" ? (
                          cell
                        ) : (
                          <ul className="space-y-2">
                            {cell.items.map((it) => {
                              const text = typeof it === "string" ? it : it.text;
                              const muted = typeof it !== "string";
                              return (
                                <li key={text} className={muted ? "text-muted/60" : undefined}>
                                  {text}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                <tr>
                  <td className="border-t border-border" />
                  {models.map((m) => (
                    <td
                      key={m.name}
                      className={`border-t border-border p-5 pb-7 rounded-b-2xl ${colClass(m)}`}
                    >
                      <Link
                        href={m.cta.href}
                        className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                          m.featured
                            ? "btn-primary"
                            : "border border-border text-ink hover:border-gold/40"
                        }`}
                      >
                        {m.cta.label}
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>

        <p className="mt-10 flex max-w-[68ch] gap-3 text-sm leading-relaxed text-muted">
          <Info size={16} className="mt-0.5 shrink-0 text-muted/60" aria-hidden="true" />
          Prices exclude ad spend and third-party licences. Every model starts with the
          same free consultation, and you get a written scope before anything is invoiced.
        </p>
      </div>
    </section>
  );
}
