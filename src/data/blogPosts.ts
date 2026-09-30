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
  title: string;
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
