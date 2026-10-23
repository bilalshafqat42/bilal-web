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
 *    React hooks article with whatever happens to sit beside it in the list.
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
 *
 * ---------------------------------------------------------------------------
 * 4. **Storage and routing.** Each post is `src/content/blog/<slug>.json`,
 *    listed in `src/content/blog/index.ts`. Checked here:
 *
 *    - every JSON file in that folder is in the index (a file that is not
 *      would simply never appear, with no error), and its name is its slug;
 *    - no slug is used twice;
 *    - no slug equals a top-level folder in `src/app`. Articles live at the
 *      root, and a static route beats the `[slug]` route, so a post called
 *      `pricing` would build and never be served;
 *    - `published` and `updatedAt` are ISO dates and `updatedAt` is not
 *      earlier than `published`.
 *
 *
 * ---------------------------------------------------------------------------
 * 5. **Topics, kinds, the sidebar list and FAQ schema** (2026-10-23).
 *
 *    - every tag in use is listed in `TAG_TOPIC` (`src/data/blogTopics.ts`),
 *      so a new tag cannot quietly file a post nowhere;
 *    - every post maps to at least one topic, or the `/blog` filter would
 *      hide it under every chip but "All";
 *    - an explicit `kind` is one of Guide, Tip, News;
 *    - "Read more like this" never offers the post itself or any of its
 *      "Keep reading" three, and shares a topic with it;
 *    - FAQ schema: every question is an `h3` the page shows, every answer is
 *      the visible text of the paragraphs under it, and no `[[label|/path]]`
 *      link syntax survives into the JSON.
 *
 * Usage:  npm run related-check
 */
import { readdirSync } from "node:fs";
import { blogPosts, relatedPosts, moreLikeThis, faqOf, articlePlainText } from "../src/data/blogPosts.ts";
import { TAG_TOPIC, KINDS, topicsFor } from "../src/data/blogTopics.ts";

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

// 4. Storage and routing.
const contentDir = new URL("../src/content/blog/", import.meta.url);
const indexed = new Set(blogPosts.map((p) => p.slug));
if (indexed.size !== blogPosts.length) fail("a slug appears twice in src/content/blog/index.ts");
for (const file of readdirSync(contentDir).filter((f) => f.endsWith(".json"))) {
  const slug = file.slice(0, -".json".length);
  if (!indexed.has(slug)) fail(`src/content/blog/${file} is not listed in src/content/blog/index.ts (or its slug field differs from its file name)`);
}

/** Top-level route segments. `(group)` folders add no segment, so their
 *  children count as top level; `[dynamic]`, `_private` and `@slot` folders
 *  claim no fixed name. */
const appDir = new URL("../src/app/", import.meta.url);
const routeNames = (dir) =>
  readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) => {
      if (/^\(.*\)$/.test(d.name)) return routeNames(new URL(`${d.name}/`, dir));
      if (/^[[_@]/.test(d.name)) return [];
      return [d.name];
    });
const routes = new Set(routeNames(appDir));
for (const post of blogPosts) {
  if (routes.has(post.slug)) fail(`${post.slug} matches the static route src/app/${post.slug}, which would shadow the article`);
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;
for (const post of blogPosts) {
  if (!ISO.test(post.published ?? "")) fail(`${post.slug} has no ISO \`published\` date`);
  if (!ISO.test(post.updatedAt ?? "")) fail(`${post.slug} has no ISO \`updatedAt\` date`);
  else if (post.updatedAt < post.published) fail(`${post.slug} updatedAt ${post.updatedAt} is before published ${post.published}`);
}

// 5. Topics, kinds, the sidebar list and FAQ schema.
const topicCounts = {};
let withFaq = 0;
for (const post of blogPosts) {
  for (const t of post.tags) {
    if (!(t in TAG_TOPIC)) fail(`${post.slug} uses tag "${t}", which is not in TAG_TOPIC (src/data/blogTopics.ts)`);
  }
  const topics = topicsFor(post);
  if (!topics.length) fail(`${post.slug} maps to no topic: give it a subject tag`);
  for (const t of topics) topicCounts[t] = (topicCounts[t] ?? 0) + 1;
  if (post.kind !== undefined && !KINDS.includes(post.kind)) fail(`${post.slug} has kind "${post.kind}", expected one of ${KINDS.join(", ")}`);

  const keep = new Set(relatedPosts(post.slug).map((p) => p.slug));
  for (const m of moreLikeThis(post.slug)) {
    if (m.slug === post.slug) fail(`${post.slug} offers itself under "Read more like this"`);
    if (keep.has(m.slug)) fail(`${post.slug} repeats ${m.slug} in both "Keep reading" and "Read more like this"`);
    if (!topicsFor(m).some((t) => topics.includes(t))) fail(`${post.slug} offers off-topic ${m.slug} under "Read more like this"`);
  }

  const faq = faqOf(post);
  if (faq.length) withFaq++;
  const h3s = new Set(post.blocks.filter((b) => b.t === "h3").map((b) => b.v.trim()));
  const paras = post.blocks.filter((b) => b.t === "p").map((b) => articlePlainText(b.v).trim());
  for (const { question, answer } of faq) {
    if (!h3s.has(question)) fail(`${post.slug} FAQ question is not a visible h3: "${question}"`);
    if (!answer || /\[\[|\]\]/.test(answer)) fail(`${post.slug} FAQ answer is empty or carries link syntax: "${question}"`);
    // The answer must be made of whole visible paragraphs, in order.
    let rest = answer;
    while (rest) {
      const next = paras.find((p) => rest === p || rest.startsWith(`${p} `));
      if (!next) {
        fail(`${post.slug} FAQ answer does not match the visible text: "${question}"`);
        break;
      }
      rest = rest.slice(next.length).trimStart();
    }
  }
}

const orphans = [...inbound].filter(([, n]) => n === 0).map(([s]) => s);
for (const slug of orphans) fail(`${slug} is never offered as related reading by any article`);

if (failed) {
  console.error(`\n${failed} related-link problem(s).`);
  process.exit(1);
}

const counts = [...inbound.values()];
console.log(
  `All ${blogPosts.length} articles linked, word counts correct, no empty headings, ` +
    `every file indexed, no slug shadowed by any of ${routes.size} top-level routes, dates valid. ` +
    `Inbound related links: ` +
    `min ${Math.min(...counts)}, max ${Math.max(...counts)}. ` +
    `${tagged} articles had a same-tag pool and all three links stayed on topic ` +
    `(${offTopic} off-topic). ` +
    `Topics: ${Object.entries(topicCounts).map(([t, n]) => `${t} ${n}`).join(", ")}; every post has one. ` +
    `FAQ schema on ${withFaq} articles, all matching visible text.`,
);
