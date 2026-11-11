import Link from "next/link";
import { Info } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import { engagementModels as models, engagementRows as rows, type Model } from "@/data/home";

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
 * **Below `lg` it is four stacked cards instead, rendered from the same data.**
 * It used to scroll sideways there, on the reasoning that cards mean rendering
 * the content twice. In practice a phone showed about 1.3 of the four columns
 * and nobody scrolled to the rest, so the comparison never happened (design
 * audit, 2026-10-27). The cost of the duplicate is accepted: only one of the
 * two is ever displayed, and `display: none` keeps the hidden one out of the
 * accessibility tree. Every value appears in both, from the same arrays, so
 * they cannot drift.
 * ---------------------------------------------------------------------------
 *
 * **On the prices.** Figures were removed on 2026-11-11 at Bilal's request:
 * published minimums were putting smaller businesses off before they got in
 * touch. Each model now says how it is priced, not what it costs. The
 * three-month retainer minimum is real. Everything still in brackets is not: the
 * ongoing-partner rate, every "time to start", the support and session windows,
 * and the "most chosen" badge — see the note on that below.
 */

/** One entry per row. `cells` is in the same order as `models`, and a cell is
 *  either a string or a list — the "what you get" row is the only list, and
 *  giving it its own type rather than joining with commas keeps it a list for
 *  a screen reader too.
 *
 *  A cell marked `muted` is an exclusion rather than an inclusion: "No
 *  implementation" is what consulting does *not* include, and rendering it at
 *  the same weight as the things it does include reads as a feature. */

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
            Every model starts with a free call. You get a fixed price in writing,
            sized to your goals and your budget, before any work starts.
          </p>
        </div>

        {/* Phones and tablets: one card per model, each reading top to bottom
            in the table's own row order. */}
        <Reveal className="mt-14 lg:hidden">
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {models.map((m, i) => (
              <li
                key={m.name}
                className={`flex flex-col r-card border p-6 ${
                  m.featured ? "border-gold/40 bg-surface/50" : "border-border"
                }`}
              >
                <h3 className="t-h4 text-ink">{m.name}</h3>
                <p className={`mt-3 text-2xl font-bold ${m.featured ? "text-gold" : "text-ink"}`}>
                  {m.priceVerified ? m.price : `AED [amount]`}
                </p>
                <p className="mt-1 text-sm text-muted">{m.priceNote}</p>

                <dl className="mt-5 flex-1 space-y-4">
                  {rows.map((row) => {
                    const cell = row.cells[i];
                    return (
                      <div key={row.label} className="border-t border-border pt-4">
                        <dt className="font-mono text-xs uppercase tracking-[0.16em] text-faint">
                          {row.label}
                        </dt>
                        <dd className="mt-2 text-base leading-relaxed text-ink/90">
                          {typeof cell === "string" ? (
                            cell
                          ) : (
                            <ul className="space-y-1.5">
                              {cell.items.map((it) => {
                                const text = typeof it === "string" ? it : it.text;
                                const muted = typeof it !== "string";
                                return (
                                  <li key={text} className={muted ? "text-faint" : undefined}>
                                    {text}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </dd>
                      </div>
                    );
                  })}
                </dl>

                <Link
                  href={m.cta.href}
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                    m.featured
                      ? "btn-primary"
                      : "border border-border text-ink hover:border-gold/40"
                  }`}
                >
                  {m.cta.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Desktop: the comparison table, unchanged. `tabindex` and a label on
            the scroller: a region that scrolls must be reachable by keyboard,
            or the columns past the fold are unreachable without a mouse. */}
        <Reveal className="mt-16 hidden lg:block">
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
                      className="border-t border-border py-5 pr-6 font-mono text-[0.65rem] font-normal uppercase tracking-[0.16em] text-faint"
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
                                <li key={text} className={muted ? "text-faint" : undefined}>
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
          <Info size={16} className="mt-0.5 shrink-0 text-faint" aria-hidden="true" />
          Quotes exclude ad spend and third-party licences. Every model starts with the
          same free consultation, and you get a written scope and price before anything is invoiced.
        </p>
      </div>
    </section>
  );
}
