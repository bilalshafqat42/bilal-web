/**
 * Regression check for the on-site search ranking.
 *
 * The scoring in `src/lib/searchIndex.ts` carries tuned constants: an IDF
 * clamp, a title-coverage weight, and score floors per query length. They were
 * fitted against the fixtures below, and a small change to any of them silently
 * either loses real answers or lets nonsense back in. This catches both.
 *
 * Usage:  npm run search-check
 */
import { buildIndex, search } from "../src/lib/searchIndex.ts";

// query -> a substring the top result's title must contain
const MUST_FIND = [
  ["wordpress", "WordPress"],
  ["squarespace", "Squarespace"],
  ["wix", "Squarespace"],
  ["postgres", "PostgreSQL"],
  ["postgresql", "PostgreSQL"],
  ["do you build wordpress sites", "WordPress"],
  ["mongodb or postgresql", "PostgreSQL"],
  ["ui ux designer", "UI/UX"],
  ["designer", "design"],
  ["developer", "develop"],
  ["difference between ui and ux", "UI design and UX"],
  ["is web design the same as ui ux", "web design the same"],
  ["do you do print design", "print"],
  ["do you design logos", "logos"],
  ["how much does a website cost", "website cost"],
  ["do i get the figma files", "Figma"],
  ["do you shoot video", "shoot video"],
  ["do you provide hosting", "hosting"],
  ["seo", "SEO"],
  ["react native", "build with"],
  ["can you take over an existing ad account", "ad account"],
];

// nothing on this site answers these, so they must return zero results
const MUST_NOT_FIND = [
  "pizza delivery",
  "quantum physics",
  "weather in tokyo",
  "cheap flights",
  "car insurance",
  "best restaurants",
  "football scores",
  "hotel booking",
];

const index = buildIndex();
let failed = 0;

for (const [query, expect] of MUST_FIND) {
  const top = search(index, query, 3)[0];
  const ok = top && top.title.toLowerCase().includes(expect.toLowerCase());
  if (!ok) {
    failed++;
    console.error(`  MISS   ${JSON.stringify(query)} -> ${top ? top.title : "no results"}`);
  }
}

for (const query of MUST_NOT_FIND) {
  const results = search(index, query, 3);
  if (results.length) {
    failed++;
    console.error(`  NOISE  ${JSON.stringify(query)} -> ${results[0].title}`);
  }
}

const total = MUST_FIND.length + MUST_NOT_FIND.length;
if (failed) {
  console.error(`\n${failed} of ${total} search checks failed (index: ${index.length} chunks).`);
  process.exit(1);
}
console.log(`All ${total} search checks passed. Index: ${index.length} chunks.`);
