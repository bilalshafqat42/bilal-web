/**
 * Data integrity checks for the recovered articles.
 *
 * Two unrelated things, in one script because both read the same module and
 * neither is big enough to justify its own npm script.
 *
 * Two things can go wrong here and neither shows up in a build.
 *
 * 1. **Orphans.** If an article is never offered as related reading by any
 *    other article, its only inbound link is the blog index. That is how nine
 *    of the thirteen recovered posts ended up with a single inbound link
 *    (roadmap 280) — `slice(0, 3)` handed every post the same three.
 *
 * 2. **Off-topic pairing.** Index rotation guarantees no orphans but pairs a
 *    React hooks article with whatever happens to sit beside it in the JSON.
 *    The links exist and say nothing about the subject, which is the part a
 *    search engine reads.
 *
 * So this asserts both: every article is linked from at least one other, and
 * articles that share a tag with something actually link to it.
 *
 *
 * ---------------------------------------------------------------------------
 * 2. **Word counts.** `words` is prose only: `p` and `list` blocks, not
 *    headings and not code. That rule was never written down anywhere, it was
 *    simply how the WordPress extraction happened to work, and on 2026-10-01 I
 *    recomputed fifteen articles with a formula that counted every block. The
 *    counts came out roughly 30% high, `readingMinutes` inflated with them, and
 *    `wordCount` in the Article schema went with it.
 *
 *    Nothing caught it except the numbers looking wrong by eye. So the rule is
 *    asserted here now: a convention that lives only in the shape of the data
 *    is a convention that gets broken by the next person to touch it.
 *
 *
 * ---------------------------------------------------------------------------
 * 3. **Empty headings and malformed tables.** A heading with nothing under it
 *    is content that went missing: eleven of them, across ten articles, were
 *    tables in the WordPress original that the extraction had no block type to
 *    hold. They render as a bare line with a gap under it and nobody notices,
 *    because the page still looks finished.
 *
 *    A table row with the wrong number of cells is the same class of problem
 *    one layer down: it renders as a ragged row rather than as an error.
 *
 * Usage:  npm run related-check
 */
import { blogPosts, relatedPosts } from "../src/data/blogPosts.ts";

let failed = 0;
const fail = (msg) => {
  console.error(`FAIL  ${msg}`);
  failed++;
};

const inbound = new Map(blogPosts.map((p) => [p.slug, 0]));
let offTopic = 0;
let tagged = 0;

for (const post of blogPosts) {
  const related = relatedPosts(post.slug);

  if (related.length !== 3) {
    fail(`${post.slug} offers ${related.length} related posts, expected 3`);
  }
  if (related.some((r) => r.slug === post.slug)) {
    fail(`${post.slug} offers itself as related reading`);
  }
  if (new Set(related.map((r) => r.slug)).size !== related.length) {
    fail(`${post.slug} offers the same post twice`);
  }

  for (const r of related) inbound.set(r.slug, (inbound.get(r.slug) ?? 0) + 1);

  // Topical check. Only meaningful for a post whose tags are shared by at
  // least three others — below that there is nothing on-topic left to offer
  // and rotation is the correct answer rather than a bug.
  const pool = blogPosts.filter(
    (p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t)),
  );
  if (pool.length >= 3) {
    tagged++;
    const onTopic = related.filter((r) => r.tags.some((t) => post.tags.includes(t))).length;
    if (onTopic < 3) {
      offTopic++;
      fail(
        `${post.slug} has ${pool.length} same-tag articles available but only ` +
          `${onTopic} of its 3 related links share a tag`,
      );
    }
  }
}

/** Prose only: `p` and `list`. Headings are navigation and code is not read at
 *  reading speed, so neither belongs in a reading-time estimate. */
const proseWords = (post) =>
  post.blocks
    .filter((b) => b.t === "p" || b.t === "list")
    .reduce((n, b) => n + (Array.isArray(b.v) ? b.v.join(" ") : b.v).trim().split(/\s+/).length, 0);

for (const post of blogPosts) {
  const expected = proseWords(post);
  if (post.words !== expected) {
    fail(`${post.slug} stores words=${post.words}, prose is ${expected}`);
  }
}

const level = (t) => (t === "h2" ? 2 : t === "h3" ? 3 : 0);

for (const post of blogPosts) {
  post.blocks.forEach((b, i) => {
    const L = level(b.t);
    if (L) {
      const next = post.blocks[i + 1];
      // Empty means nothing follows, or the next block is a heading at the same
      // or a higher level, so no sub-section carries the content either. An
      // "FAQs" h2 followed by its h3 questions is correct and must not fail.
      if (!next || (level(next.t) && level(next.t) <= L)) {
        fail(`${post.slug} has an empty heading: "${b.v}"`);
      }
    }
    if (b.t === "table") {
      if (!b.head?.length || !b.rows?.length) fail(`${post.slug} has an empty table`);
      for (const row of b.rows ?? []) {
        if (row.length !== b.head.length) {
          fail(`${post.slug} table row has ${row.length} cells, head has ${b.head.length}`);
        }
      }
    }
  });
}

const orphans = [...inbound].filter(([, n]) => n === 0).map(([s]) => s);
for (const slug of orphans) fail(`${slug} is never offered as related reading by any article`);

if (failed) {
  console.error(`\n${failed} related-link problem(s).`);
  process.exit(1);
}

const counts = [...inbound.values()];
console.log(
  `All ${blogPosts.length} articles linked, word counts correct, no empty headings. ` +
    `Inbound related links: ` +
    `min ${Math.min(...counts)}, max ${Math.max(...counts)}. ` +
    `${tagged} articles had a same-tag pool and all three links stayed on topic ` +
    `(${offTopic} off-topic).`,
);
