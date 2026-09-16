import { buildIndex } from "@/lib/searchIndex";

/**
 * The search index, served as a static file instead of compiled into the
 * browser bundle.
 *
 * `buildIndex()` reads every content data file on the site — pillars,
 * serviceDepth, caseStudies, faqs, disciplines — and produces 183 chunks of
 * text. Until 2026-09-16 that ran inside two client components, so all of it
 * was bundled and downloaded on all 28 routes whether or not anyone opened a
 * search panel. The privacy page, which is plain text, carried the whole lot.
 *
 * `force-static` matters: without it this runs per request, and the point is to
 * generate it once at build time and let it be cached like any other asset.
 * It only changes when the content data changes, which means a rebuild anyway.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(buildIndex()), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Immutable for a day, then revalidated. A stale index for a few hours
      // costs a visitor a slightly out-of-date search result; re-fetching it on
      // every page view costs every visitor the bytes we just removed.
      "Cache-Control": "public, max-age=86400, must-revalidate",
    },
  });
}
