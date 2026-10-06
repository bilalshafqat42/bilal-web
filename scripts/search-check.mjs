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
// `search` moved to `searchRank.ts` when the index came off the client bundle.
// This still builds the real index from `searchIndex.ts`, so the fixtures below
// run against the same data the site serves.
import { buildIndex } from "../src/lib/searchIndex.ts";
import { search } from "../src/lib/searchRank.ts";

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
  // Changed on 2026-09-09 when the discipline pages shipped, after checking
  // that the new winner is a better answer rather than a regression. The top
  // hit for "react native" is now "Do you build native or cross-platform?" on
  // /portfolio/mobile-app-development, whose answer names React Native and
  // lands the visitor on the actual React Native work; it used to be the
  // services stack FAQ. "native" is a tighter assertion than "build with",
  // since the old winner's title does not contain it — so a revert still fails.
  ["react native", "native"],
  ["cross platform", "native"],
  // A bare "portfolio" must reach the hub, not one arbitrary discipline. The
  // tokeniser drops words under three characters, so "ui ux portfolio" reduces
  // to this same single term and this fixture protects that case too.
  ["portfolio", "Portfolio"],
  ["social media portfolio", "Social Media Marketing"],
  ["can you take over an existing ad account", "ad account"],
  // The recovered articles (roadmap 275). These are the only pages on the site
  // that answer a technical how-to, so without a fixture each the site search
  // could stop reaching 6,900 impressions' worth of content and nothing would
  // say so. Asserted on the distinctive word in the title, not the qualifier:
  // "best" and "top" are stop words precisely because two of these titles open
  // with one.
  ["usecallback", "useCallback"],
  ["usememo", "useMemo"],
  ["usereducer", "useReducer"],
  ["usecontext", "useContext"],
  ["useimperativehandle", "useImperativeHandle"],
  ["flatlist vs scrollview", "FlatList"],
  ["design inspiration websites", "Design Inspiration"],
  ["flexbox", "Flexbox"],
  ["em and rem units", "EM and REM"],
  ["figma plugins", "Figma Plugins"],
  ["free icon libraries", "Icon Libraries"],
  ["productivity tools", "Productivity Tools"],
  // The articles must not take a hiring query off the page that sells the work.
  // "ui ux designer" returned "8 Must-Have Free Icon Libraries for Designers"
  // once all thirteen were indexed, which is what the `article` kind's score
  // demotion exists to stop. Asserted against the service page, so a change to
  // that weighting fails here rather than quietly costing an enquiry.
  ["ui ux designer", "UI/UX"],
];

// nothing on this site answers these, so they must return zero results
// Nonsense queries. If any of these returns a result, the index has gone loose
// enough that a real query gets noise too.
//
// "cheap flights" has now caught the word "cheap" twice, in headings written
// months apart: "usually the cheap part" (2026-10-02) and "the cheap lead is
// the expensive one" (2026-10-04). Both were reworded, because the fixture is
// right — a site search for "cheap flights" should return nothing.
//
// What it really exposes is that a two-word query can match on one common word.
// Tightening that in `searchRank.ts` is the proper fix and was not taken: 45
// fixtures depend on the current scoring, and a ranking change to spare one
// adjective is a bad trade. The practical consequence is that "cheap" is
// effectively reserved on this site. Use "low-cost" or "inexpensive".
const MUST_NOT_FIND = [
  "pizza delivery",
  "quantum physics",
  "weather in tokyo",
  "cheap flights",
  "car insurance",
  // "restaurant" is effectively reserved on this site, the same way "cheap" is
  // above. A Snapchat and TikTok article on 2026-10-06 asked "Which should a
  // Dubai restaurant start with?" in an FAQ heading, and article headings go
  // into the search index, so it answered a query about restaurants. Reworded
  // to "consumer brand" rather than relaxing the fixture.
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
