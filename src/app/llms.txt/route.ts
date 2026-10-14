import { megaMenuGroups } from "@/data/pillars";
import { clients } from "@/data/caseStudies";
import { faqGroups } from "@/data/faqs";
import { disciplinesWithPages, disciplineItems } from "@/data/disciplines";
import { blogPosts } from "@/data/blogPosts";
import { SITE_URL as SITE, POSITIONING, yearsExperience } from "@/lib/site";
import { SITE_EMAIL, SITE_PHONE } from "@/lib/contact";

// Built once at build time. Nothing here reads the request, and every input is
// data compiled into the bundle, so rendering it per request only cost CPU.
// The Cache-Control below still tells clients and CDNs how long to keep it.
export const dynamic = "force-static";

// Generated, not hand-written. The previous static file listed 6 of 20 pages
// because it was maintained by hand and fell behind every time a page shipped.
//
// The core-page list below is still written by hand, and on 2026-09-25 it was
// caught two pages short: /appointment and /real-estate-marketing were in the
// sitemap at priority 0.9 — the two highest-intent commercial URLs on the site
// — and absent here, so an assistant reading this file could not point anyone
// at the booking page. Diffed the sitemap against the URLs this file emits;
// worth repeating whenever a route is added.
export async function GET() {
  const lines: string[] = [];

  lines.push(`# Bilal Shafqat

> ${POSITIONING} Freelance digital marketer with ${yearsExperience()} years
> of experience: paid media, SEO, social and email, plus the landing pages, websites,
> apps and CRM automation the campaigns land on, built by the same person. No agency
> handoffs, no account managers. Works with clients across the UAE and internationally.

Contact: ${SITE_EMAIL} · ${SITE_PHONE} (WhatsApp)
Location: Dubai, UAE (Gulf Standard Time, UTC+4), Monday to Friday
Full content for machine reading: ${SITE}/llms-full.txt

## Core pages

- [Home](${SITE}/): overview of services and recent work
- [About](${SITE}/about): background, working principles, tools and platforms
- [Services](${SITE}/services): all ${megaMenuGroups.length} service categories
- [Portfolio](${SITE}/portfolio): all work, browsable by discipline and by client
- [LEOS mobile app](${SITE}/portfolio/leos-developments/mobile-app): React Native case study: cross-platform iOS and Android from one codebase, screen by screen
- [Process](${SITE}/process): the four delivery stages: brief and discovery, planning and design, build and launch, then measurement and iteration, with worked examples
- [Pricing](${SITE}/pricing): published figures (projects from AED 31,500, retainers from AED 16,000 a month, a review session at AED 3,500), engagement models and what drives cost
- [FAQ](${SITE}/faq): freelancer vs agency, timezones, process, measurement
- [Book a consultation](${SITE}/appointment): the booking page every primary CTA points at; pick a slot for a free call
- [Real estate marketing](${SITE}/real-estate-marketing): off-plan and property developer work: campaigns, launch sites and CRM, as one vertical
- [Contact](${SITE}/contact): enquiry form, email, WhatsApp
- [Writing](${SITE}/blog): ${blogPosts.length} technical articles on React hooks, React Native and design practice
- [Privacy](${SITE}/privacy): what the site stores`);

  // The articles sit at the root of the domain, not under /blog — they are the
  // original WordPress URLs, restored (roadmap 275). Listed individually
  // because an assistant asked "how does useCallback work" should be able to
  // reach the article, not just the index that links to it.
  lines.push(`## Writing
`);
  for (const post of blogPosts) {
    lines.push(`- [${post.title}](${SITE}/${post.slug}): ${post.description} Published ${post.published}.`);
  }

  lines.push(`## Services\n`);
  for (const g of megaMenuGroups) {
    lines.push(`- [${g.title}](${SITE}/services/${g.slug}): ${g.intro} Includes ${g.items.map((i) => i.title).join(", ")}.`);
  }

  // Portfolio by discipline. Listed before the client case studies because it
  // is the axis a machine answering "does he do X" needs, and each entry states
  // its real item count so an assistant quoting this cannot inflate it.
  lines.push(`\n## Portfolio by discipline\n`);
  for (const d of disciplinesWithPages()) {
    if (!d.page) continue;
    lines.push(
      `- [${d.title}](${SITE}/portfolio/${d.slug}): ${d.page.intro} ${disciplineItems(d).length} pieces shown.`
    );
  }

  lines.push(`\n## Case studies\n`);
  for (const c of clients) {
    lines.push(`- [${c.name}](${SITE}/portfolio/${c.slug}): ${c.intro}`);
    for (const p of c.projects) {
      lines.push(`  - [${p.name}](${SITE}/portfolio/${c.slug}/${p.slug}): ${p.cardBlurb}`);
    }
  }

  lines.push(`\n## Answers to common questions\n`);
  for (const group of faqGroups) {
    for (const item of group.items) {
      lines.push(`- ${item.question} ${item.answer}`);
    }
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
