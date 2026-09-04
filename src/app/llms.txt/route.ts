import { megaMenuGroups } from "@/data/pillars";
import { clients } from "@/data/caseStudies";
import { faqGroups } from "@/data/faqs";

const SITE = "https://bilalshafqat.com";

// Generated, not hand-written. The previous static file listed 6 of 20 pages
// because it was maintained by hand and fell behind every time a page shipped.
export async function GET() {
  const lines: string[] = [];

  lines.push(`# Bilal Shafqat

> Dubai-based freelance digital marketer, developer and designer with 15 years of
> experience. One person covering paid marketing, web and app development, design,
> and the CRM automation that connects them — no agency handoffs, no account
> managers. Works with clients across the UAE and internationally.

Contact: bilalshafqat42@gmail.com · +971 52 976 6006 (WhatsApp)
Location: Dubai, UAE (Gulf Standard Time, UTC+4), Monday to Friday
Full content for machine reading: ${SITE}/llms-full.txt

## Core pages

- [Home](${SITE}/): overview of services and recent work
- [About](${SITE}/about): background, working principles, tools and platforms
- [Services](${SITE}/services): all eight service categories
- [Work](${SITE}/portfolio): case studies
- [Process](${SITE}/process): the four delivery stages — brief and discovery, planning and design, build and launch, then measurement and iteration, with worked examples
- [Pricing](${SITE}/pricing): engagement models and what drives cost — no published price list
- [FAQ](${SITE}/faq): freelancer vs agency, timezones, process, measurement
- [Contact](${SITE}/contact): enquiry form, email, WhatsApp
- [Privacy](${SITE}/privacy): what the site stores`);

  lines.push(`## Services\n`);
  for (const g of megaMenuGroups) {
    lines.push(`- [${g.title}](${SITE}/services/${g.slug}): ${g.intro} Includes ${g.items.map((i) => i.title).join(", ")}.`);
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
      lines.push(`- ${item.question} — ${item.answer}`);
    }
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
