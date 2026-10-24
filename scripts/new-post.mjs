/**
 * Scaffold a new article.
 *
 *   node scripts/new-post.mjs <slug> [--date YYYY-MM-DD]
 *
 * Writes `src/content/blog/<slug>.json` with placeholder fields, and adds the
 * post to the top of `src/content/blog/index.ts` (newest first). `published`
 * and `updatedAt` default to today in Dubai time.
 *
 * It refuses a slug that already exists or that matches a top-level route in
 * `src/app` (including one inside a `(group)` folder), because a static route
 * would shadow the article. Fill in the
 * placeholders, then run `npm run related-check`. See
 * docs/adding-a-blog-post.md.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { topLevelRoutes } from "./lib/routes.mjs";

// Walked in order so the value after `--date` is never taken for the slug:
// `--date 2026-10-20 my-slug` used to scaffold a post called "2026-10-20".
// `--date=2026-10-20` works too.
const args = process.argv.slice(2);
let slug;
let dateArg;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--date") {
    dateArg = args[++i];
    if (dateArg === undefined) {
      console.error("--date needs a value: --date YYYY-MM-DD");
      process.exit(1);
    }
  } else if (a.startsWith("--date=")) {
    dateArg = a.slice("--date=".length);
  } else if (a.startsWith("--")) {
    console.error(`Unknown option ${a}.`);
    process.exit(1);
  } else if (slug === undefined) {
    slug = a;
  } else {
    console.error(`Unexpected extra argument "${a}". Usage: node scripts/new-post.mjs <slug> [--date YYYY-MM-DD]`);
    process.exit(1);
  }
}

const die = (msg) => {
  console.error(msg);
  process.exit(1);
};

if (!slug) die("Usage: node scripts/new-post.mjs <slug> [--date YYYY-MM-DD]");
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) die(`"${slug}" is not a lowercase, hyphenated slug.`);

const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dubai" }).format(new Date());
const date = dateArg ?? today;
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) die(`--date must be YYYY-MM-DD, got "${date}".`);

const root = new URL("../", import.meta.url);
const file = new URL(`src/content/blog/${slug}.json`, root);
const indexFile = new URL("src/content/blog/index.ts", root);

if (existsSync(file)) die(`src/content/blog/${slug}.json already exists.`);
// Every top-level route, including those inside `(group)` folders, from the
// same list related-check uses. Checking only `src/app/<slug>` missed a route
// inside a group.
if (topLevelRoutes(new URL("src/app/", root)).has(slug)) {
  die(`/${slug} is already a route in src/app, so it would never show the article. Pick another slug.`);
}

const index = readFileSync(indexFile, "utf8");
const id = `p_${slug.replace(/[^a-zA-Z0-9]/g, "_")}`;
if (index.includes(`"./${slug}.json"`)) die(`${slug} is already in index.ts.`);

const post = {
  slug,
  title: "TODO: the headline, which is the h1",
  metaTitle: "TODO: under 60 characters, keyword first",
  description: "TODO: 120-160 characters. Check it with npm run serp.",
  published: date,
  updatedAt: date,
  tags: ["TODO"],
  blocks: [
    { t: "p", v: "TODO: opening paragraph." },
    { t: "h2", v: "TODO: a claim or a question, never a label" },
    { t: "p", v: "TODO" },
  ],
  words: 0,
};

// The first import line and the first array entry are where a newest-first
// list takes a new post.
const firstImport = index.indexOf("\nimport ") + 1;
const arrayOpen = index.indexOf("export const postsInOrder = [\n");
if (firstImport <= 0 || arrayOpen < 0) die("index.ts is not in the expected shape; add the post by hand.");
const arrayStart = arrayOpen + "export const postsInOrder = [\n".length;

const next =
  index.slice(0, firstImport) +
  `import ${id} from "./${slug}.json";\n` +
  index.slice(firstImport, arrayStart) +
  `  ${id},\n` +
  index.slice(arrayStart);

writeFileSync(file, JSON.stringify(post, null, 2) + "\n");
writeFileSync(indexFile, next);

console.log(`Created src/content/blog/${slug}.json and added it to the top of index.ts.`);
console.log("Next: replace every TODO, set `words`, then run npm run related-check.");
