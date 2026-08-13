import postsJson from "@/content/blog-posts.json";

export type PostCategory = {
  name: string;
  slug: string;
};

export type Post = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  date: string;
  modified: string;
  excerpt: string;
  categories: PostCategory[];
  content: string;
};

export const posts: Post[] = postsJson as Post[];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return posts.filter((p) => p.categories.some((c) => c.slug === categorySlug));
}

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Strip HTML and clamp, for card summaries where no excerpt exists. */
export function summarise(post: Post, max = 160): string {
  const raw = post.seoDescription || post.excerpt || "";
  const text = raw.replace(/<[^>]*>/g, "").trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

/**
 * Wrap tables so wide tables scroll inside their own container instead of
 * forcing the whole page to scroll horizontally on mobile.
 */
export function prepareContent(html: string): string {
  return html.replace(/<table/g, '<div class="table-scroll"><table').replace(/<\/table>/g, "</table></div>");
}
