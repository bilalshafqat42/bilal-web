import type { BlogPost } from "@/data/blogPosts";

/**
 * Four reader-facing topics for the articles, and a kind label per article.
 *
 * Added 2026-10-23. The tags were written one article at a time and there are
 * 26 of them, several used once ("Seo", "Tools", "Flexbox"). That is too many to
 * filter by and too uneven to browse. Topics group them into the four things
 * the site actually does, and every tag maps to at most one topic.
 *
 * **Not a route.** There is no `/blog/category/...` and there must not be one:
 * the old WordPress `/category/*` URLs are gone (410 or redirected), and four
 * thin listing pages competing with `/blog` would undo that. Topics drive the
 * client-side filter on `/blog` (`?topic=`, canonical stays `/blog`), the chips
 * in the article header and the sidebar. Nothing new is indexed.
 *
 * **Client-safe.** This file has no runtime import of `blogPosts`, only the
 * type, so the `/blog` filter can import `TOPICS` without bundling every
 * article into the browser.
 *
 * Two tags map to no topic, deliberately:
 *
 *   - **Dubai** is on 31 posts across all four subjects. It says where the
 *     reader is, not what the article is about.
 *   - **Pricing** is on buyer guides about websites, design and marketing
 *     alike ("How much does a website cost in Dubai"). Mapping it to Marketing
 *     would file a website price guide under Marketing. Every Pricing post also
 *     carries a subject tag, so none is left without a topic.
 *
 * `npm run related-check` fails if any post maps to no topic, or if any tag in
 * use is missing from `TAG_TOPIC` (so a new tag cannot silently file nowhere).
 */

export const TOPICS = [
  { slug: "marketing", label: "Marketing" },
  { slug: "development", label: "Development" },
  { slug: "design", label: "Design" },
  // "AI & Tools", not "AI": the one productivity-tools list (Trello, Asana,
  // Notion) belongs nowhere else, and filing it under "AI" would be wrong.
  { slug: "ai", label: "AI & Tools" },
] as const;

export type TopicSlug = (typeof TOPICS)[number]["slug"];
export type Topic = (typeof TOPICS)[number];

/** Every tag in use, and the topic it files under (`null` for none). */
export const TAG_TOPIC: Record<string, TopicSlug | null> = {
  // Marketing
  "Digital Marketing": "marketing",
  "Paid Ads": "marketing",
  "Real Estate": "marketing",
  Seo: "marketing",
  // Development
  "React Js": "development",
  "React Hooks": "development",
  Javascript: "development",
  Es6: "development",
  "Web Development": "development",
  "Mobile Apps": "development",
  CSS: "development",
  Flexbox: "development",
  WordPress: "development",
  Redux: "development",
  Typescript: "development",
  "Node JS": "development",
  // Design
  "UI UX Design": "design",
  Design: "design",
  "Web Design": "design",
  Figma: "design",
  // AI & Tools
  AI: "ai",
  ChatGPT: "ai",
  DeepSeek: "ai",
  Tools: "ai",
  // No topic: see the note at the top.
  Dubai: null,
  Pricing: null,
};

export const isTopicSlug = (s: string | null | undefined): s is TopicSlug =>
  TOPICS.some((t) => t.slug === s);

export const topicBySlug = (slug: TopicSlug): Topic => TOPICS.find((t) => t.slug === slug)!;

/** The post's topics, in `TOPICS` order so chips always line up the same way. */
export function topicsFor(post: Pick<BlogPost, "tags">): TopicSlug[] {
  const found = new Set(post.tags.map((t) => TAG_TOPIC[t]).filter((t): t is TopicSlug => !!t));
  return TOPICS.map((t) => t.slug).filter((s) => found.has(s));
}

/**
 * Guide, Tip or News.
 *
 * The rule, in order:
 *
 *   1. `kind` in the post's JSON, when set. Used for news: an article tied to
 *      a dated event (a Google Tag Manager change, a PHP vulnerability) that
 *      word count cannot tell apart from a guide.
 *   2. **Tip** when the article reads in three minutes or less (under 600
 *      body words, the same count `readingMinutes` uses).
 *   3. **Guide** otherwise.
 */
export const KINDS = ["Guide", "Tip", "News"] as const;
export type Kind = (typeof KINDS)[number];

export const TIP_MAX_WORDS = 599;

export function kindOf(post: Pick<BlogPost, "words"> & { kind?: string }): Kind {
  if (post.kind && (KINDS as readonly string[]).includes(post.kind)) return post.kind as Kind;
  return post.words <= TIP_MAX_WORDS ? "Tip" : "Guide";
}
