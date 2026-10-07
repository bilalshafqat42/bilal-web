import { blogPosts, type BlogPost } from "@/data/blogPosts";
import { serviceForArticle } from "@/data/articleServices";

/**
 * Which articles each service page should send a reader to.
 *
 * **The problem this solves, measured on 2026-10-07.** Search Console reported
 * 44 pages as "Crawled - currently not indexed", and the thirteen that matter
 * are real pages of ours crawled on 5 and 6 October. Counting every internal
 * link to those nine articles across all 119 pages in the sitemap gave:
 *
 *     /blog and /blog/page/2     every article
 *     other articles             2 to 5 each
 *     service pages              0
 *
 * Not one of the fifteen service pages linked to a single article. Checked all
 * fifteen: the only non-service link any of them carried was
 * `/real-estate-marketing`.
 *
 * That matters because the service pages are the strongest pages on the site.
 * They hold the rankings and whatever authority eleven referring domains buy.
 * All of it flowed nowhere, while nine new articles sat vouched for only by
 * other new articles, which is a closed loop and a weak signal.
 *
 * **Why this inverts `articleServices` rather than listing slugs.** That module
 * already routes every article to a service from the tags the articles carry.
 * Calling `serviceForArticle` here and grouping the result means the two
 * directions are the same map read two ways, so a retag lands in both at once.
 * A hand-written list would go stale the first time an article is published and
 * nobody remembers to update it — the failure the footer already has, carrying
 * six of fifteen services hardcoded.
 *
 * **Why newest rather than hand-picked.** Every article published from now on
 * gets a service link the day it ships, which is exactly when it needs one. A
 * curated list would need an edit per article and would silently miss it.
 */

/** Articles grouped by the service slug `serviceForArticle` resolves them to,
 *  newest first. Built once at module load. */
const BY_SERVICE: Record<string, BlogPost[]> = (() => {
  const out: Record<string, BlogPost[]> = {};
  for (const post of blogPosts) {
    const { href } = serviceForArticle(post);
    // The fallback resolves to `/services`, the hub, which is not one of the
    // fifteen category pages and has no block of its own.
    const slug = href.startsWith("/services/") ? href.slice("/services/".length) : null;
    if (!slug) continue;
    (out[slug] ??= []).push(post);
  }
  for (const list of Object.values(out)) {
    list.sort((a, b) => b.published.localeCompare(a.published));
  }
  return out;
})();

/**
 * The articles to show on one service page. Empty for a service with none.
 *
 * **Deliberately no inheritance from the parent category.** The first version
 * let the ten services with no articles of their own borrow from their menu
 * parent — SEO and Email from Digital Marketing, Google Ads from Paid
 * Marketing, Web Design from UI/UX. Modelled against the real data it put an
 * identical block on four pages at once and covered **zero** additional
 * articles, since the parent's newest three are already linked from the parent.
 * All it added was duplication, and a reader on the SEO page being shown an
 * article about marketing budgets.
 *
 * So ten of the fifteen service pages render nothing here. An absent section is
 * better than a wrong one, and the five that do carry it reach eight of the
 * nine articles that needed the link.
 */
export function articlesForService(slug: string, count = 3): BlogPost[] {
  return (BY_SERVICE[slug] ?? []).slice(0, count);
}
