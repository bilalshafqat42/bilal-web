import { buildSiteContent } from "@/lib/siteContent";

// Static: the corpus is built from data compiled into the bundle and nothing
// reads the request, so it is generated once at build rather than per hit.
export const dynamic = "force-static";

// The emerging companion to llms.txt: llms.txt is the index, llms-full.txt is the
// whole content in one plain-text file. Reuses the exact corpus the on-site
// assistant reads, so an external model and the site's own assistant answer from
// identical source material.
export async function GET() {
  return new Response(buildSiteContent(), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
