import type { MetadataRoute } from "next";
import { megaMenuGroups } from "@/data/pillars";
import {
  contentDates,
  serviceContentDate,
  clientContentDate,
  DISCIPLINE_CONTENT_DATE,
} from "@/data/contentDates";

/** Falls back to the build date only for a route with no recorded entry, so a
 *  new page is never worse off than it was before this change. */
const dateFor = (path: string) => new Date(contentDates[path] ?? Date.now());
import { caseStudyUrls } from "@/data/caseStudyUrls";
import { blogPosts, BLOG_UPDATED_DATE } from "@/data/blogPosts";
import { totalBlogPages, blogPagePath } from "@/lib/blogPagination";
import { disciplinesWithPages } from "@/data/disciplines";
import { SITE_URL } from "@/lib/site";

const baseUrl = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: dateFor("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: dateFor("/contact"),
      changeFrequency: "monthly",
      // Secondary to /appointment, which is where every primary CTA now goes.
      // Kept indexed rather than redirected: it answers "contact" queries and
      // is the only page carrying the WhatsApp and phone routes.
      priority: 0.7,
    },
    {
      url: `${baseUrl}/appointment`,
      lastModified: dateFor("/appointment"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      // The off-plan vertical. Sits at the root rather than under /services
      // because it is an industry page cutting across several disciplines, not
      // a ninth service category.
      url: `${baseUrl}/real-estate-marketing`,
      lastModified: dateFor("/real-estate-marketing"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: dateFor("/pricing"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: dateFor("/faq"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: dateFor("/privacy"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/process`,
      lastModified: dateFor("/process"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: dateFor("/about"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: dateFor("/portfolio"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: dateFor("/services"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      // The newest change to any article: a new post or an edited description
      // changes what the index shows.
      lastModified: new Date(BLOG_UPDATED_DATE),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Writing, page two onward. Each one carries its own canonical rather than
    // pointing back at /blog, so they belong in the sitemap: an article that
    // appears only on page four has no other route in from the index.
    //
    // Derived from `totalBlogPages()` rather than listed, so publishing the
    // article that spills onto a new page adds that page here with no edit.
    ...Array.from({ length: totalBlogPages() - 1 }, (_, i) => ({
      url: `${baseUrl}${blogPagePath(i + 2)}`,
      // A new post shifts every page by one, so they all change together.
      lastModified: new Date(BLOG_UPDATED_DATE),
      changeFrequency: "monthly" as const,
      // Below /blog itself: these are navigation, not destinations.
      priority: 0.4,
    })),
    // The articles, at the root of the domain rather than under /blog — for
    // the recovered ones these are the URLs Google already has (roadmap 275).
    //
    // `lastModified` is each post's own `updatedAt`: the recovery date (30 Sep)
    // for a recovered post untouched since, never the 2025 byline, and the
    // real date for anything written or edited here. Until 2026-10-13 every
    // article claimed 30 Sep, so posts written in October looked older than
    // they were.
    ...blogPosts.map((p) => ({
      url: `${baseUrl}/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "yearly" as const,
      // Below the service and portfolio pages: these bring reach, but the
      // pages that convert are the ones that should be crawled first.
      priority: 0.5,
    })),
    // Each client's pages carry that client's own date (CLIENT_CONTENT_DATES),
    // so publishing one case study does not re-date every other one.
    ...caseStudyUrls().map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(clientContentDate(path.split("/")[2])),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // Generated from the same list the mega menu uses, so a new category is
    // never live-but-undiscoverable. This previously read `pillars`, which left
    // the four new category pages out of the sitemap entirely.
    ...megaMenuGroups.map((category) => ({
      url: `${baseUrl}/services/${category.slug}`,
      lastModified: new Date(serviceContentDate(category.slug)),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // Discipline pages, derived from the same helper the routes and the mega
    // menu use. A discipline with no work has no page and so never reaches the
    // sitemap: submitting an empty URL is worse than not having it.
    ...disciplinesWithPages().map((d) => ({
      url: `${baseUrl}/portfolio/${d.slug}`,
      lastModified: new Date(DISCIPLINE_CONTENT_DATE),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
