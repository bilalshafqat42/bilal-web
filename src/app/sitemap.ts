import type { MetadataRoute } from "next";
import { megaMenuGroups } from "@/data/pillars";
import {
  contentDates,
  SERVICES_CONTENT_DATE,
  PORTFOLIO_CONTENT_DATE,
} from "@/data/contentDates";

/** Falls back to the build date only for a route with no recorded entry, so a
 *  new page is never worse off than it was before this change. */
const dateFor = (path: string) => new Date(contentDates[path] ?? Date.now());
import { caseStudyUrls } from "@/data/caseStudies";

const baseUrl = "https://bilalshafqat.com";

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
    // All four case studies read from src/data/caseStudies.ts, so they share
    // that file's date rather than each claiming to have changed today.
    ...caseStudyUrls().map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(PORTFOLIO_CONTENT_DATE),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // Generated from the same list the mega menu uses, so a new category is
    // never live-but-undiscoverable. This previously read `pillars`, which left
    // the four new category pages out of the sitemap entirely.
    ...megaMenuGroups.map((category) => ({
      url: `${baseUrl}/services/${category.slug}`,
      lastModified: new Date(SERVICES_CONTENT_DATE),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
