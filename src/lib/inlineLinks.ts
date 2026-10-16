/**
 * Inline links inside service copy, written as `[label](/path)`.
 *
 * Added 2026-10-16 with the CMS pages. Their argument depends on sending a
 * reader to the right neighbour mid-sentence ("if the build is the question,
 * see WordPress development"), and the service copy was plain strings with no
 * way to do that. A tiny subset of Markdown rather than JSX in the data, so the
 * data files stay plain text and every other reader of them keeps working.
 *
 * Internal paths only. Anything else is left as literal text, which makes a
 * mistake visible on the page rather than silently linking off-site.
 */

export type Segment = { text: string; href?: string };

// `\/(?![\/\\])`: a path must not start "//" or "/\", which browsers read as
// another site ("//evil.com"). Caught in the 2026-10-16 code review.
const LINK = /\[([^\]]+)\]\((\/(?![\/\\])[^)\s]*)\)/g;

export function parseInlineLinks(source: string): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  for (const m of source.matchAll(LINK)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ text: source.slice(last, at) });
    out.push({ text: m[1], href: m[2] });
    last = at + m[0].length;
  }
  if (last < source.length) out.push({ text: source.slice(last) });
  return out;
}

/** The same copy with the links reduced to their labels, for the text corpora
 *  (llms-full.txt, the on-site search) where a raw `(/path)` is noise. */
export function plainText(source: string): string {
  return source.replace(LINK, "$1");
}
