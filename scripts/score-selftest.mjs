/**
 * Self-test for the shared scorer in `lib/score.mjs`.
 *
 * The scorer decides every number in `npm run onpage`, `npm run daily` and the
 * audit, so a regression in its matching quietly moves every score. These
 * cases pin the rules that were each wrong at some point (audit batch 3,
 * 2026-10-24). No network, no server: runs in CI before the build.
 *
 * Usage:  npm run score-selftest
 */
import { decode, text, kwRegex, kwCount, checksFor } from "./lib/score.mjs";

let failed = 0;
const check = (name, got, want) => {
  const ok = got === want;
  if (!ok) failed++;
  console.log(`  ${ok ? "pass" : "FAIL"}  ${name}${ok ? "" : `  (got ${JSON.stringify(got)}, want ${JSON.stringify(want)})`}`);
};

// Entities
check("hex apostrophe &#x27; decodes", decode("Bilal&#x27;s work"), "Bilal's work");
check("decimal apostrophe &#39; decodes", decode("Bilal&#39;s work"), "Bilal's work");
check("named &apos; and &rsquo; decode", decode("a&apos;b&rsquo;c"), "a'b’c");
check("&amp;lt; stays literal text", decode("&amp;lt;"), "&lt;");
check("unknown named entity is a space", text("a&zwnj;b"), "a b");

// Word boundaries
check("'seoul seo consultant dubaian' does not match 'seo consultant dubai'",
  kwRegex("seo consultant dubai").test("seoul seo consultant dubaian"), false);
check("'seo consultant dubai' matches itself", kwRegex("seo consultant dubai").test("An SEO consultant Dubai trusts"), true);

// Stop words, both ways
check("'freelance digital marketer in Dubai' matches keyword without 'in'",
  kwRegex("freelance digital marketer dubai").test("A freelance digital marketer in Dubai"), true);
check("'freelance digital marketer Dubai' matches keyword with 'in'",
  kwRegex("freelance digital marketer in dubai").test("Freelance digital marketer Dubai"), true);
check("slash counts as a separator", kwRegex("ui ux designer dubai").test("UI/UX Designer in Dubai"), true);
check("count respects boundaries", kwCount("seo consultant dubai, seoul seo consultant dubaian", "seo consultant dubai"), 1);

// Count inside <main> only
const doc = `<html><head><title>Home</title></head><body>
  <nav><a href="/x">SEO consultant Dubai</a></nav>
  <main><h1>Welcome</h1><p>Nothing about the keyword here.</p></main>
</body></html>`;
const { checks } = checksFor(doc, "seo consultant dubai");
const twice = checks.find((c) => c.name.startsWith("Keyword appears at least twice"));
check("keyword only in <nav> does not count in the body", twice.note, "0 occurrences");
check("keyword only in <nav> is not in the first 100 words",
  checks.find((c) => c.name === "Keyword in the first 100 words").got, false);

// No <main>: nothing is scored, and it says so
const noMain = checksFor("<html><body><nav>seo consultant dubai</nav><p>seo consultant dubai</p></body></html>", "seo consultant dubai");
check("missing <main> scores no body words", noMain.words, 0);
check("missing <main> adds a failing check", noMain.checks[0].name === "Page has a <main> element" && noMain.checks[0].got, false);

if (failed) {
  console.error(`\n${failed} scorer self-test(s) failed.`);
  process.exit(1);
}
console.log("\nScorer self-test passed.");
