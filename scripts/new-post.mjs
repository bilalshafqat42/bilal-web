/**
 * Scaffold a new article.
 *
 *   node scripts/new-post.mjs <slug> [--date YYYY-MM-DD]
 *
 * Writes `src/content/blog/<slug>.json` with placeholder fields, and adds the
 * post to the top of `src/content/blog/index.ts` (newest first). `published`
 * and `updatedAt` default to today in Dubai time.
 *
 * It refuses a slug that already exists or that matches a top-level folder in
 * `src/app`, because a static route there would shadow the article. Fill in the
 * placeholders, then run `npm run related-check`. See
 * docs/adding-a-blog-post.md.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const dateArg = args.includes("--date") ? args[args.indexOf("--date") + 1] : undefined;

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
if (existsSync(new URL(`src/app/${slug}`, root))) {
  die(`src/app/${slug} is a route, so /${slug} would never show the article. Pick another slug.`);
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
