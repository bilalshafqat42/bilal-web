import type { Block } from "@/data/blogPosts";

/**
 * Renders a recovered article's body from typed blocks.
 *
 * Blocks rather than a blob of HTML, deliberately. The source is scraped
 * WordPress markup, and piping that through `dangerouslySetInnerHTML` would
 * carry the old theme's classes, inline styles and tracking attributes onto
 * this site — and hand an injection surface to whatever the scrape happened to
 * pick up. A closed set of five block types cannot express anything but the
 * text, and every one of them is rendered as an element this file chose.
 *
 * Headings carry slug `id`s so a section can be linked to directly. They are
 * derived from the heading text, which is stable across a rebuild in a way that
 * an index (`#section-4`) is not.
 */

/** Lowercase, punctuation stripped, spaces to hyphens. Two headings with the
 *  same text would collide, so the caller passes the running index as a
 *  tiebreak rather than this function silently producing a duplicate `id`. */
function headingId(text: string, i: number) {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return base || `section-${i}`;
}

export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  const seen = new Map<string, number>();

  return (
    <div className="mt-12">
      {blocks.map((b, i) => {
        if (b.t === "h2" || b.t === "h3") {
          let id = headingId(b.v, i);
          const n = seen.get(id) ?? 0;
          seen.set(id, n + 1);
          if (n) id = `${id}-${n + 1}`;

          return b.t === "h2" ? (
            <h2 key={i} id={id} className="t-h3 mt-14 scroll-mt-28 text-ink first:mt-0">
              {b.v}
            </h2>
          ) : (
            <h3 key={i} id={id} className="t-h5 mt-10 scroll-mt-28 text-ink first:mt-0">
              {b.v}
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
