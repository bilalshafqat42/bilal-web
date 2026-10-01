import { blogPosts } from "@/data/blogPosts";

/**
 * Paging for the writing index.
 *
 * The index listed all of them on one page, which was fine at thirteen posts
 * and is not at fifty-seven: the page is long enough that nobody reaches the
 * bottom, and every post competes with every other for the same attention.
 *
 * **Page one stays at `/blog`.** It is the URL that is indexed, linked from the
 * nav and referenced from every article's breadcrumb, so it keeps its address.
 * Later pages live at `/blog/page/2` and up. The alternative, redirecting
 * `/blog` to `/blog/page/1`, would move an established URL for a cosmetic gain.
 */
export const POSTS_PER_PAGE = 12;

export const totalBlogPages = () => Math.max(1, Math.ceil(blogPosts.length / POSTS_PER_PAGE));

/** 1-indexed, matching the URL. Out-of-range returns an empty slice, and the
 *  route is responsible for calling `notFound()` on that rather than rendering
 *  an empty list. */
export function blogPageSlice(page: number) {
  const start = (page - 1) * POSTS_PER_PAGE;
  return blogPosts.slice(start, start + POSTS_PER_PAGE);
}

/** The canonical path for a page number, so `/blog` and `/blog/page/1` can
 *  never drift apart across the sitemap, the canonical tag and the links. */
export const blogPagePath = (page: number) => (page <= 1 ? "/blog" : `/blog/page/${page}`);
