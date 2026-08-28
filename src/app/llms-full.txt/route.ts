import { buildSiteContent } from "@/lib/siteContent";

// The emerging companion to llms.txt: llms.txt is the index, llms-full.txt is the
// whole content in one plain-text file. Reuses the exact corpus the on-site
// assistant reads, so an external model and the site's own assistant answer from
// identical source material.
export async function GET() {
  return new Response(buildSiteContent(), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
