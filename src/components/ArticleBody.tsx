import { ExternalLink } from "lucide-react";

import type { Block } from "@/data/blogPosts";
import { headingIdMap } from "@/lib/headingIds";

/**
 * Renders a recovered article's body from typed blocks.
 *
 * Blocks rather than a blob of HTML, deliberately. The source is scraped
 * WordPress markup, and piping that through `dangerouslySetInnerHTML` would
 * carry the old theme's classes, inline styles and tracking attributes onto
 * this site — and hand an injection surface to whatever the scrape happened to
 * pick up. A closed set of six block types cannot express anything but the
 * text, and every one of them is rendered as an element this file chose.
 *
 * Headings carry slug `id`s so a section can be linked to directly. They are
 * derived from the heading text, which is stable across a rebuild in a way that
 * an index (`#section-4`) is not.
 */

export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  // Ids come from `headingIdMap`, built by the same function the contents list
  // reads, so a link in the sidebar cannot point at an anchor the body never
  // rendered. A map keyed by block index rather than a counter: the React
  // compiler rejects mutating a variable during render, and it is right to —
  // the count would be wrong on any re-render that did not start from zero.
  const ids = headingIdMap(blocks);

  return (
    // No top margin here. The gap above belongs to the grid in
    // `[slug]/page.tsx`, so all three columns start on the same line; when it
    // lived here it pushed only the middle one down.
    <div>
      {blocks.map((b, i) => {
        if (b.t === "h2" || b.t === "h3") {
          const id = ids.get(i) ?? `section-${i}`;

          // On the listicles the heading names a site, and the original post
          // linked to it. `rel="noopener"` for the usual reason; no `nofollow`,
          // because these are genuine editorial recommendations rather than
          // paid placements, and marking them otherwise would be a lie about
          // what they are.
          const label = b.href ? (
            <a
              href={b.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline gap-1.5 text-ink underline decoration-gold/40 underline-offset-[6px] transition-colors hover:text-gold hover:decoration-gold"
            >
              {b.v}
              <ExternalLink size={15} aria-hidden="true" className="shrink-0 self-center text-gold/70" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : (
            b.v
          );

          return b.t === "h2" ? (
            <h2 key={i} id={id} className="t-h3 mt-14 scroll-mt-28 text-ink first:mt-0">
              {label}
            </h2>
          ) : (
            <h3 key={i} id={id} className="t-h5 mt-10 scroll-mt-28 text-ink first:mt-0">
              {label}
            </h3>
          );
        }

        if (b.t === "p") {
          return (
            <p key={i} className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
              {b.v}
            </p>
          );
        }

        if (b.t === "list") {
          const Tag = b.ordered ? "ol" : "ul";
          return (
            <Tag
              key={i}
              className={`mt-5 space-y-2.5 pl-5 text-base leading-relaxed text-muted sm:text-lg ${
                b.ordered ? "list-decimal" : "list-disc"
              } marker:text-gold/60`}
            >
              {b.v.map((item, j) => (
                <li key={j} className="pl-1.5">
                  {item}
                </li>
              ))}
            </Tag>
          );
        }

        if (b.t === "table") {
          return (
            // `overflow-x-auto` on the wrapper, same reasoning as the `pre`
            // below: a wide comparison must scroll inside its own box rather
            // than drag the article sideways at phone width. `w-full` with
            // `min-w-[34rem]` on the table keeps it full-bleed on desktop and
            // scrollable rather than crushed on a phone.
            <div key={i} className="mt-6 overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[34rem] border-collapse text-left text-base text-muted sm:text-lg">
                <thead>
                  <tr className="border-b border-border bg-bg-soft">
                    {b.head.map((h, j) => (
                      <th key={j} scope="col" className="px-5 py-3.5 font-semibold text-ink">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((row, r) => (
                    <tr key={r} className="border-b border-border/60 last:border-0">
                      {row.map((cell, j) => (
                        // First column is the row's label, so it reads as a
                        // heading for the row rather than as another value.
                        <td
                          key={j}
                          className={`px-5 py-3.5 align-top leading-relaxed ${j === 0 ? "font-medium text-ink" : ""}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Code. `overflow-x-auto` on the `pre` rather than on the page: a long
        // line here must scroll inside its own box, not drag the whole article
        // sideways on a phone.
        return (
          <pre
            key={i}
            tabIndex={0}
            className="mt-6 overflow-x-auto rounded-xl border border-border bg-bg-soft p-4 text-[0.82rem] leading-relaxed text-ink/90 sm:p-5 sm:text-sm"
          >
            <code className="font-mono">{b.v}</code>
          </pre>
        );
      })}
    </div>
  );
}
