// Client-side search index, built from the same data files the pages render.
//
// Exists so the assistant works with no API key and no per-question cost. It
// cannot compose a sentence the way a model can, but it never invents anything,
// answers instantly, and is free — which for a small site covers most of what
// visitors actually ask.

import { pillars, megaMenuGroups } from "@/data/pillars";
import { faqGroups } from "@/data/faqs";
import { clients } from "@/data/caseStudies";
import { serviceDepth } from "@/data/serviceDepth";
import { disciplinesWithPages, disciplineItems } from "@/data/disciplines";


export type { Chunk } from "./searchRank";
import type { Chunk } from "./searchRank";

export function buildIndex(): Chunk[] {
  const chunks: Chunk[] = [];

  for (const group of megaMenuGroups) {
    chunks.push({
      title: group.title,
      body: `${group.intro} Includes ${group.items.map((i) => i.title).join(", ")}.`,
      url: `/services/${group.slug}`,
      kind: "service",
    });
    for (const faq of group.faqs) {
      chunks.push({ title: faq.question, body: faq.answer, url: `/services/${group.slug}`, kind: "faq" });
    }
    // The long-form category copy and its extra FAQs. Without these the
    // assistant knew less than the page a visitor was reading: "wordpress",
    // for one, appears only here and returned nothing.
    const depth = serviceDepth[group.slug];
    if (depth) {
      for (const block of depth.blocks) {
        chunks.push({
          title: block.heading,
          body: block.paragraphs.join(" "),
          url: `/services/${group.slug}`,
          kind: "service",
        });
      }
      for (const faq of depth.faqs) {
        chunks.push({ title: faq.question, body: faq.answer, url: `/services/${group.slug}`, kind: "faq" });
      }
    }
  }

  // The portfolio hub, and the reason the discipline chunks below are titled
  // "<discipline> work" rather than "<discipline> portfolio".
  //
  // The tokeniser drops words under three characters, so "ui ux portfolio"
  // collapses to the single term "portfolio". With that word in all four
  // discipline titles they tied on it and an arbitrary one won — a visitor
  // asking for the UI/UX portfolio landed on social media creative. Keeping
  // "portfolio" unique to this chunk makes a query that names no discipline the
  // index can see resolve to the hub, which is the correct answer to it.
  chunks.push({
    title: "Portfolio",
    body:
      "All the work, browsable by discipline or by client: web design and development, UI/UX and interface design, React Native mobile apps, and social media creative. " +
      disciplinesWithPages()
        .map((d) => `${d.title}: ${disciplineItems(d).length} pieces.`)
        .join(" "),
    url: "/portfolio",
    kind: "work",
  });

  // Discipline pages. Someone asking the assistant "do you build mobile apps"
  // should reach the portfolio cut, not only the service page.
  for (const d of disciplinesWithPages()) {
    if (!d.page) continue;
    chunks.push({
      title: `${d.title} work`,
      body: `${d.page.intro} ${d.page.lens} ${disciplineItems(d).length} pieces.`,
      url: `/portfolio/${d.slug}`,
      kind: "work",
    });
    for (const faq of d.page.faqs) {
      chunks.push({ title: faq.question, body: faq.answer, url: `/portfolio/${d.slug}`, kind: "faq" });
    }
  }

  for (const pillar of pillars) {
    for (const section of pillar.sections) {
      const group = megaMenuGroups.find((g) => g.items.some((i) => i.title === section.title));
      if (!group) continue;
      chunks.push({
        title: section.title,
        body: `${section.body} Covers ${section.bullets.join(", ")}.`,
        url: `/services/${group.slug}`,
        kind: "service",
      });
    }
  }

  for (const group of faqGroups) {
    for (const item of group.items) {
      chunks.push({ title: item.question, body: item.answer, url: "/faq", kind: "faq" });
    }
  }

  for (const client of clients) {
    chunks.push({
      title: client.name,
      body: `${client.intro} ${client.keywords.join(". ")}.`,
      url: `/portfolio/${client.slug}`,
      kind: "work",
    });
    for (const p of client.projects) {
      chunks.push({
        title: `${p.name} — ${client.name}`,
        body: `${p.summary} ${p.facts.map((f) => `${f.label}: ${f.value}`).join(". ")}. ${p.keywords.join(". ")}.`,
        url: `/portfolio/${client.slug}/${p.slug}`,
        kind: "work",
      });
    }
  }

  chunks.push({
    title: "Pricing and how projects are costed",
    body: "No published price list. Four engagement models: project-based with a fixed scope and price, monthly retainer, ongoing partner embedded with your team, and consulting and advisory. Cost is driven by custom functionality, timelines and whether content already exists. Priced by project wherever the scope can be defined, so the estimating risk sits with Bilal rather than the client; retainers are priced monthly; hourly is used only for advisory work. A real figure usually comes within a business day. The first conversation is free. AED for UAE clients, other currencies on request.",
    url: "/pricing",
    kind: "info",
  });
  chunks.push({
    title: "Getting in touch",
    body: "Email bilalshafqat42@gmail.com or WhatsApp +971 52 976 6006. Based in Dubai, Gulf Standard Time UTC+4, Monday to Friday. Replies usually within one business day, same day on WhatsApp. Works with clients across the UAE and internationally.",
    url: "/contact",
    kind: "info",
  });

  // The same heading can be reached from two builders (a category and the

  // pillar section behind it), which spent two of only three result slots

  // saying the same thing. Keep the first, which carries the fuller body.

  const seen = new Set<string>();

  return chunks.filter((c) => {

    const key = `${c.title}|${c.url}`;

    if (seen.has(key)) return false;

    seen.add(key);

    return true;

  });
}

// Includes conversational filler, not just grammar words. People phrase these
// as requests — "I need a website", "looking for help with ads" — and treating
// "need" or "looking" as content made them outrank the thing actually asked for.
