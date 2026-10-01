/**
 * Regression check for the "Keep reading" links at the foot of every article.
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

const orphans = [...inbound].filter(([, n]) => n === 0).map(([s]) => s);
for (const slug of orphans) fail(`${slug} is never offered as related reading by any article`);

if (failed) {
  console.error(`\n${failed} related-link problem(s).`);
  process.exit(1);
}

const counts = [...inbound.values()];
console.log(
  `All ${blogPosts.length} articles linked. Inbound related links: ` +
    `min ${Math.min(...counts)}, max ${Math.max(...counts)}. ` +
    `${tagged} articles had a same-tag pool and all three links stayed on topic ` +
    `(${offTopic} off-topic).`,
);
