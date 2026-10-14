import { postsInOrder } from "../content/blog/index";

/**
 * The articles: 76 recovered WordPress posts and the ones written here since.
 *
 * **Storage.** Each post is its own file, `src/content/blog/<slug>.json`, and
 * `src/content/blog/index.ts` lists them in display order with static imports.
 * Until 2026-10-13 all of them lived in one 17,700-line `blogPosts.json`, where
 * a stray comma in one article could take down all of them. Adding a post is
 * `node scripts/new-post.mjs <slug>`; see `docs/adding-a-blog-post.md`.
 *
 * The recovered posts were published on the old WordPress site at the **root**
 * of the domain — `bilalshafqat.com/react-usecallback-hook-explained/`, not
 * under a `/blog/` prefix. When the site was rebuilt in Next.js they were not
 * carried across, so every one of those URLs began returning 404 while still
 * sitting in Google's index: the first eight alone were pulling roughly 6,900
 * impressions a month into a dead page, against 137 for the homepage
 * (roadmap 275).
 *
 * That is why the routes live at the root rather than somewhere tidier. A
 * `/blog/<slug>` layout with redirects would be better information architecture
 * on a site starting fresh; here it would put a hop in front of the only URLs
 * that have any ranking history, to buy a prettier path nobody has linked to.
 * `/blog` exists as the index, and the articles stay where they were indexed.
 * New posts follow the same pattern, so a slug must never match a top-level
 * route folder in `src/app` (`scripts/related-check.mjs` enforces it).
 *
 * Provenance: the prose, headings and code are Bilal's own, recovered verbatim
 * from the Wayback Machine — nothing here is regenerated or paraphrased. Three
 * things did not survive and were dropped rather than faked:
 *
 *   - **Images.** Wayback never captured `/wp-content/uploads` and the origin
 *     has purged it, so the per-article hero and the listicle screenshots are
 *     gone. `archived_snapshots` comes back empty for every one of them.
 *   - **The WordPress chrome** — the duplicated title, the byline row and the
 *     comment count — which was theme furniture, not writing.
 *   - **Decorative emoji** on some headings, stripped so the type matches the
 *     rest of the site.
 *
 * `published` is the real publication date off the original byline, not the
 * date of this recovery. Saying these went up in 2026 would be a lie to both
 * readers and crawlers about content that is a year old. `updatedAt` is the
 * last day the article's content changed, which is what the sitemap and the
 * Article schema's `dateModified` report.
 */
export type BlockType = "h2" | "h3" | "p" | "code" | "list" | "table";

export type Block =
  /** `href` appears only on the two listicles, where the heading *is* the entry
   *  for a site — "Awwwards", "3. UX Hints TL;DR". The original posts linked out
   *  from the paragraph beneath; the first recovery pass kept the prose and
   *  dropped the anchors, which left "10 Best Websites to Master UI UX Design"
   *  naming ten sites and linking to none of them. That is a worse outcome than
   *  the missing images: the list is the whole point of the page.
   *
   *  Two of the eighteen are deliberately absent. `appmotion.design` is a
   *  deleted Framer site and `uxarchive.com` has broken DNS — both checked in a
   *  real browser, because a plain fetch reports 403 for half these hosts and
   *  they are merely bot-blocking, not down. The recommendations still read; we
   *  just do not send anyone to a dead page. Worth re-checking if either
   *  returns. */
  | { t: "h2" | "h3"; v: string; href?: string }
  | { t: "p" | "code"; v: string }
  | { t: "list"; v: string[]; ordered?: boolean }
  /** A comparison table: `head` is the header row, `rows` the body.
   *
   *  Added 2026-10-01 because its absence was losing content. Eleven headings
   *  across ten articles had nothing under them at all — "useReducer vs
   *  useState", "Side-by-Side Comparison", "Key Differences Between FlatList
   *  and ScrollView" — and the pattern gives the cause away: every one of them
   *  introduced a table in the WordPress original, and the extraction had no
   *  block type to put a table into, so it dropped them silently. The same
   *  class of loss as the stripped anchors described above, found the same way:
   *  by looking at the data rather than at the rendered page.
   *
   *  Worth having beyond the repair. These are "X vs Y" articles, and a
   *  comparison table is the format Google lifts into a featured snippet for
   *  exactly that query. Every row must be the same length as `head`, which
   *  `scripts/related-check.mjs` asserts. */
  | { t: "table"; head: string[]; rows: string[][] };

export type BlogPost = {
  slug: string;
  /** The article's own headline, exactly as published. This is the `h1`. */
  title: string;
  /** A shorter `<title>` for headlines that Google truncates.
   *
   *  Google cuts the title tag around 60 characters; the longest of these runs
   *  to 91, so "...with Real Examples and Best Practices (2025 Guide)" was
   *  never visible in a result — it spent the CTR and showed an ellipsis. The
   *  keyword stays at the front, the stale year goes, and the on-page headline
   *  is untouched: what ranked was the body and the `h1`, and neither moves. */
  metaTitle?: string;
  description: string;
  /** ISO date the article went live: the original byline for a recovered
   *  post, the day it was published here for a new one. This is the
   *  "publishedAt" date; the name predates the split and is read in a dozen
   *  places, so it stays. */
  published: string;
  /** ISO date the content last changed. Never earlier than `published`.
   *
   *  Feeds the sitemap's `lastmod` and the schema's `dateModified`. Until
   *  2026-10-13 every article shared the recovery date (30 Sep), so a post
   *  written on 11 October told Google it was older than it was. Set on
   *  2026-10-13 from git history: the last commit that changed each post, the
   *  recovery date for posts untouched since. Bump it by hand when you change
   *  an article's words; leave it for a typo. */
  updatedAt: string;
  tags: string[];
  /** A lead image for the article.
   *
   *  Added 2026-10-11 for the daily post series (roadmap 394). Every post in
   *  that series ships with an Instagram carousel, and slide one is already a
   *  designed 1200x630-ish board making the post's single claim — so the asset
   *  exists either way and the alternative is 77 articles with no image at all.
   *
   *  It does three jobs: the article gets something above the body, the share
   *  card stops being the site-wide default, and `alt` gives the page a piece
   *  of descriptive text it currently has none of.
   *
   *  Optional, and absent on every recovered article. Their original images
   *  did not survive the WordPress scrape, and inventing stock art for them
   *  would be decoration rather than content. */
  image?: { src: string; alt: string; width: number; height: number };
  /** Body words — paragraphs and list items, excluding headings and code. */
  words: number;
  blocks: Block[];
};

/** Newest first, which is the order `src/content/blog/index.ts` lists them in
 *  and the order the index renders. Sorting here as well would hide a mistake
 *  in that list rather than surface it. */
export const blogPosts = postsInOrder as BlogPost[];

export const blogSlugs = () => blogPosts.map((p) => p.slug);

export function blogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

/** The most recent change to any article, for the `/blog` index pages'
 *  sitemap entries: a new post or an edited description changes what they
 *  list. */
export const BLOG_UPDATED_DATE = blogPosts
  .map((p) => p.updatedAt)
  .sort()
  .at(-1)!;

/** Roughly how long the article takes to read, at 200 words per minute — the
 *  conventional figure. Rounded up, and never below one. */
export const readingMinutes = (p: BlogPost) => Math.max(1, Math.ceil(p.words / 200));

/** What goes in `<title>`: the short form where one exists, else the headline. */
export const metaTitleOf = (p: BlogPost) => p.metaTitle ?? p.title;

/**
 * The three articles to offer at the foot of an article.
 *
 * Related by shared tags, with index rotation as the tiebreak, then a repair
 * pass so nothing is left unlinked.
 *
 * Rotation on its own — which is all this did until 2026-10-01 — picked the
 * next three posts in file order, so a React hooks article offered whatever
 * happened to sit beside it in the list. It guaranteed every post an inbound
 * link, which was the bug it was written to fix (roadmap 280), but it spent
 * that link on an unrelated subject.
 *
 * Shared tags matter beyond the reader's experience. At 52 articles, when this
 * was written, twenty-two were React and twelve design; linking within groups
 * like those is what tells a search engine the site covers a subject in depth
 * rather than holding a pile of unrelated pages. The previous approach,
 * rotation, is recorded under roadmap 280. Internal links are the only part of that signal
 * we control without waiting on anyone else to link to us.
 *
 * The repair pass is not optional. Scoring purely on shared tags orphaned two
 * articles outright — `react-usestate-hook-explained-with-examples` and
 * `master-infinite-scroll-in-javascript` — because in a 22-article React
 * cluster the same few posts win every comparison and the rest are never
 * offered by anyone. An orphan's only inbound link is the blog index, which is
 * the exact problem rotation existed to solve, so the fix had to keep both
 * properties rather than trade one for the other.
 *
 * `scripts/related-check.mjs` asserts both: no orphans, and no off-topic link
 * where an on-topic one was available.
 */
type Related = Record<string, BlogPost[]>;

/** Computed once for the whole collection rather than per call, because "is
 *  anything left unlinked" is a question about the set, not about one post. */
const RELATED: Related = (() => {
  const n = blogPosts.length;
  const index = new Map(blogPosts.map((p, i) => [p.slug, i]));

  // Pass one: the three best matches for each post. Ties on shared-tag count
  // fall through to rotation distance, which is unique per post, so the result
  // never depends on sort stability.
  const picks = new Map<string, BlogPost[]>();
  for (let i = 0; i < n; i++) {
    const self = blogPosts[i];
    const tags = new Set(self.tags);
    const scored = blogPosts
      .map((p, j) => ({
        post: p,
        shared: p.tags.filter((t) => tags.has(t)).length,
        distance: (j - i + n) % n,
      }))
      .filter((c) => c.distance !== 0)
      .sort((a, b) => b.shared - a.shared || a.distance - b.distance);
    picks.set(self.slug, scored.slice(0, Math.min(3, n - 1)).map((c) => c.post));
  }

  const inbound = new Map(blogPosts.map((p) => [p.slug, 0]));
  for (const list of picks.values()) {
    for (const p of list) inbound.set(p.slug, (inbound.get(p.slug) ?? 0) + 1);
  }

  // Pass two: give every orphan a home. Orphans are visited in file order and
  // hosts are chosen by rotation distance, so the outcome is the same on every
  // build rather than depending on Map iteration order.
  for (const orphan of blogPosts) {
    if ((inbound.get(orphan.slug) ?? 0) > 0) continue;
    const oi = index.get(orphan.slug)!;

    // Prefer a host that shares a tag, so the repaired link is still on topic;
    // failing that, any post at all, taken in rotation order from the orphan.
    const hosts = blogPosts
      .map((p, j) => ({ post: p, j, shared: p.tags.filter((t) => orphan.tags.includes(t)).length }))
      .filter((h) => h.post.slug !== orphan.slug)
      .sort((a, b) => b.shared - a.shared || ((a.j - oi + n) % n) - ((b.j - oi + n) % n));

    for (const host of hosts) {
      const list = picks.get(host.post.slug)!;
      if (list.some((p) => p.slug === orphan.slug)) break;
      // Only displace a link whose target has another inbound link, or the
      // repair would simply move the orphan problem to a different article.
      const victim = list[list.length - 1];
      if ((inbound.get(victim.slug) ?? 0) <= 1) continue;
      list[list.length - 1] = orphan;
      inbound.set(victim.slug, (inbound.get(victim.slug) ?? 0) - 1);
      inbound.set(orphan.slug, 1);
      break;
    }
  }

  return Object.fromEntries(picks) as Related;
})();

export function relatedPosts(slug: string, count = 3): BlogPost[] {
  const list = RELATED[slug];
  if (!list) return blogPosts.filter((p) => p.slug !== slug).slice(0, count);
  return list.slice(0, count);
}
