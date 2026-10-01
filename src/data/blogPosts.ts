import raw from "./blogPosts.json";

/**
 * The recovered WordPress articles.
 *
 * These eight posts were published on the old WordPress site at the **root** of
 * the domain — `bilalshafqat.com/react-usecallback-hook-explained/`, not under
 * a `/blog/` prefix. When the site was rebuilt in Next.js they were not carried
 * across, so every one of those URLs began returning 404 while still sitting in
 * Google's index: between them they were pulling roughly 6,900 impressions a
 * month into a dead page, against 137 for the homepage (roadmap 275).
 *
 * That is why the routes live at the root rather than somewhere tidier. A
 * `/blog/<slug>` layout with redirects would be better information architecture
 * on a site starting fresh; here it would put a hop in front of the only URLs
 * that have any ranking history, to buy a prettier path nobody has linked to.
 * `/blog` exists as the index, and the articles stay where they were indexed.
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
 * readers and crawlers about content that is a year old.
 */
export type BlockType = "h2" | "h3" | "p" | "code" | "list";

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
  | { t: "list"; v: string[]; ordered?: boolean };

export type BlogPost = {
  slug: string;
  /** The article's own headline, exactly as published. This is the `h1`. */
  title: string;
  /** A shorter `<title>` for the eight headlines that Google truncates.
   *
   *  Google cuts the title tag around 60 characters; the longest of these runs
   *  to 91, so "...with Real Examples and Best Practices (2025 Guide)" was
   *  never visible in a result — it spent the CTR and showed an ellipsis. The
   *  keyword stays at the front, the stale year goes, and the on-page headline
   *  is untouched: what ranked was the body and the `h1`, and neither moves. */
  metaTitle?: string;
  description: string;
  /** ISO date, from the original byline. */
  published: string;
  tags: string[];
  /** Body words — paragraphs and list items, excluding headings and code. */
  words: number;
  blocks: Block[];
};

/** Newest first, which is the order the JSON is written in and the order the
 *  index renders. Sorting here as well would hide a generation bug rather than
 *  surface it. */
export const blogPosts = raw as BlogPost[];

export const blogSlugs = () => blogPosts.map((p) => p.slug);

export function blogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

/** The most recent publication date, for the `/blog` index's sitemap entry. */
export const BLOG_CONTENT_DATE = blogPosts
  .map((p) => p.published)
  .sort()
  .at(-1)!;

/** Roughly how long the article takes to read, at 200 words per minute — the
 *  conventional figure. Rounded up, and never below one. */
export const readingMinutes = (p: BlogPost) => Math.max(1, Math.ceil(p.words / 200));

/** What goes in `<title>`: the short form where one exists, else the headline. */
export const metaTitleOf = (p: BlogPost) => p.metaTitle ?? p.title;

/** The three posts to offer at the end of an article.
 *
 *  The window rotates: each post points at the three that follow it, wrapping
 *  round the end of the list. That is not a styling choice — it is the only
 *  part of these pages' internal linking this file controls.
 *
 *  It replaces `blogPosts.filter(notSelf).slice(0, 3)`, which always returned
 *  the three *newest* posts. Measured against the live site afterwards: those
 *  three had 13 inbound internal links each, one had 4, and **the other nine
 *  had exactly one** — the listing on `/blog` — while every external link the
 *  domain has ever earned points at the homepage. Deep pages rank substantially
 *  on their own links, so nine of thirteen were being starved by a `slice`.
 *
 *  Rotation gives every post exactly three, and because the list is ordered by
 *  date the neighbours are already topical: the six React posts were published
 *  together in June and July, the design listicles in January and February. So
 *  an even spread and a relevant one turn out to be the same thing here, with
 *  no tag matching needed. */
/**
 * The three articles to offer at the foot of an article.
 *
 * Related by shared tags, with index rotation as the tiebreak, then a repair
 * pass so nothing is left unlinked.
 *
 * Rotation on its own — which is all this did until 2026-10-01 — picked the
 * next three posts in file order, so a React hooks article offered whatever
 * happened to sit beside it in the JSON. It guaranteed every post an inbound
 * link, which was the bug it was written to fix (roadmap 280), but it spent
 * that link on an unrelated subject.
 *
 * Shared tags matter beyond the reader's experience. Twenty-two of the 52
 * articles are React and twelve are design; linking within those groups is
 * what tells a search engine the site covers a subject in depth rather than
 * holding 52 unrelated pages. Internal links are the only part of that signal
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
