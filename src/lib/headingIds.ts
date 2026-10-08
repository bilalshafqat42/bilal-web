import type { Block } from "@/data/blogPosts";

/**
 * The heading `id`s an article renders, derived once.
 *
 * **Shared deliberately.** `ArticleBody` generates these ids and `ArticleToc`
 * links to them. Two copies of this logic would drift the first time a heading
 * gained a colon, and the failure is silent: the contents list still renders,
 * every link still looks fine, and every one of them scrolls nowhere. The
 * duplicated SEO scorer had exactly this shape and reported `/pricing` at 84
 * where the real one said 80 (roadmap 379).
 *
 * Ids come from the heading text rather than its index, because text is stable
 * across a rebuild and `#section-4` is not: insert a paragraph and every
 * anchor anyone has ever shared points at the wrong place.
 */

/** Lowercase, punctuation stripped, spaces to hyphens. */
function slug(text: string, i: number) {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return base || `section-${i}`;
}

export type TocEntry = { id: string; text: string; level: 2 | 3; /** Index in the block array, so a renderer can look the id up by position rather than counting as it goes. */ block: number };

/**
 * Every heading in an article, with the id it will render with.
 *
 * Two headings with the same text would collide, so the second gets a `-2`
 * suffix. The caller must walk the blocks in the same order `ArticleBody` does,
 * which is why both call this one function rather than counting themselves.
 */
export function headingsOf(blocks: Block[]): TocEntry[] {
  const seen = new Map<string, number>();
  const out: TocEntry[] = [];
  blocks.forEach((b, i) => {
    if (b.t !== "h2" && b.t !== "h3") return;
    let id = slug(b.v, i);
    const n = seen.get(id) ?? 0;
    seen.set(id, n + 1);
    if (n) id = `${id}-${n + 1}`;
    out.push({ id, text: b.v, level: b.t === "h2" ? 2 : 3, block: i });
  });
  return out;
}

/**
 * The entries worth putting in a contents list.
 *
 * **`h2` only.** The React articles run to 26 headings; listing all of them
 * produces a second article down the side of the first, which is the thing a
 * contents list exists to avoid. The `h3`s are detail inside a section, and
 * somebody who has jumped to the right section can see them.
 *
 * Returns nothing below four entries. A contents list for three sections is
 * furniture: it costs a column and tells a reader what one glance already did.
 */
export function tocOf(blocks: Block[]): TocEntry[] {
  const h2s = headingsOf(blocks).filter((h) => h.level === 2);
  return h2s.length >= 4 ? h2s : [];
}

/** Block index to heading id, for the renderer. */
export function headingIdMap(blocks: Block[]): Map<number, string> {
  return new Map(headingsOf(blocks).map((h) => [h.block, h.id]));
}
