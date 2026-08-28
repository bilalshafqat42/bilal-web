// The assistant's knowledge base, assembled from the same data the pages render.
//
// Deliberately not a separate copy: every fact here already lives in pillars.ts,
// faqs.ts or caseStudies.ts, so the assistant cannot drift from the site the way
// a hand-maintained knowledge file would. Add a service or a case study and the
// assistant knows about it on the next build.

import { pillars, megaMenuGroups } from "@/data/pillars";
import { faqGroups } from "@/data/faqs";
import { clients } from "@/data/caseStudies";

export function buildSiteContent(): string {
  const parts: string[] = [];

  parts.push(`# About Bilal Shafqat

A Dubai-based freelance digital marketer, developer and designer with 15 years of
experience. Works directly with clients — no account managers, no junior staff, no
handoffs between departments. Based in Dubai (Gulf Standard Time, UTC+4), Monday to
Friday, working with clients across the UAE and internationally.

Contact: bilalshafqat42@gmail.com, +971 52 976 6006 (also WhatsApp).
Contact page: /contact  ·  Pricing: /pricing  ·  FAQ: /faq`);

  parts.push(`# Services\n`);
  for (const group of megaMenuGroups) {
    parts.push(`## ${group.title}  (page: /services/${group.slug})
${group.intro}

Includes: ${group.items.map((i) => i.title).join(", ")}.`);
    for (const faq of group.faqs) {
      parts.push(`Q: ${faq.question}\nA: ${faq.answer}`);
    }
  }

  parts.push(`# Service detail\n`);
  for (const pillar of pillars) {
    for (const section of pillar.sections) {
      parts.push(`## ${section.title}\n${section.body}\nCovers: ${section.bullets.join(", ")}.`);
    }
  }

  parts.push(`# Case studies\n`);
  for (const client of clients) {
    parts.push(`## ${client.name}  (page: /portfolio/${client.slug})
${client.intro}
Scope: ${client.scope.map((s) => `${s.heading} — ${s.body}`).join(" ")}`);
    for (const p of client.projects) {
      parts.push(`### ${p.name}  (page: /portfolio/${client.slug}/${p.slug})
${p.summary}
Facts: ${p.facts.map((f) => `${f.label}: ${f.value}`).join("; ")}.
${p.landingPage ? p.landingPage.body : ""}`);
    }
  }

  parts.push(`# Frequently asked questions\n`);
  for (const group of faqGroups) {
    for (const item of group.items) {
      parts.push(`Q: ${item.question}\nA: ${item.answer}`);
    }
  }

  parts.push(`# Pricing

No published price list. Four engagement models: Project-Based (fixed scope, timeline
and price), Monthly Retainer, Ongoing Partner (embedded alongside an existing team),
and Consulting & Advisory (review and direction without implementation).

Cost is driven up by custom functionality and integrations, multiple languages,
compressed timelines, and content that must be created from scratch. Cost is brought
down by a clear brief and a single decision-maker, existing brand assets, building on
what already works, phasing the work, and realistic timelines.

A real figure usually comes within a business day of describing the project. The first
conversation is free. AED for UAE clients; other currencies quoted on request.`);

  return parts.join("\n\n");
}
