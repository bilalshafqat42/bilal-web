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

export type Chunk = {
  title: string;
  body: string;
  url: string;
  kind: "service" | "faq" | "work" | "info";
};

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

  return chunks;
}

// Includes conversational filler, not just grammar words. People phrase these
// as requests — "I need a website", "looking for help with ads" — and treating
// "need" or "looking" as content made them outrank the thing actually asked for.
const STOP = new Set(["the","a","an","and","or","is","are","do","does","you","your","can","i","to","for","of","in","on","with","it","me","my","we","what","how","much","have","has","be","this","that","any","need","want","looking","help","get","would","like","some","please","hi","hello"]);

/**
 * Crude suffix stripping, not a real stemmer.
 *
 * It exists to make "developers" match "developer" and "apps" match "app". A
 * naive prefix match would do that too, but it also makes "planning" match
 * "plan", which is how "off plan launch" ended up ranking Social Media Planning
 * above the actual off-plan case study. Normalising both sides avoids that.
 */
function stem(t: string): string {
  if (t.length > 4 && t.endsWith("ies")) return t.slice(0, -3) + "y";
  if (t.length > 4 && (t.endsWith("es") || t.endsWith("ed"))) return t.slice(0, -2);
  if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss")) return t.slice(0, -1);
  if (t.length > 5 && t.endsWith("ing")) return t.slice(0, -3);
  // Agent nouns. Without this, "designer" and "developer" never reach "design"
  // and "develop", so someone searching the exact job title Bilal wants to rank
  // for got zero results.
  if (t.length > 5 && t.endsWith("ers")) return t.slice(0, -3);
  if (t.length > 4 && t.endsWith("er")) return t.slice(0, -2);
  return t;
}

function terms(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t))
    .map(stem);
}

/**
 * Ranks chunks against a question.
 *
 * Title matches are weighted heavily because the titles here are largely real
 * questions and service names — the exact thing a visitor types. Partial matches
 * count for less, so "app" still finds "App Development" without letting one
 * loose prefix outrank a genuine hit.
 */
export function search(index: Chunk[], query: string, limit = 3): Chunk[] {
  const q = terms(query);
  if (!q.length) return [];

  // Falls back to a prefix match when the stems do not line up exactly, which
  // is what connects "develop" to "development" or "market" to "marketing"
  // without hand-writing a rule per suffix. Worth less than an exact hit.
  const prefixHit = (words: Set<string>, t: string) => {
    if (t.length < 4) return false;
    for (const w of words) if (w.startsWith(t) || t.startsWith(w)) return true;
    return false;
  };

  return index
    .map((chunk) => {
      // Both sides are stemmed, so comparison is a set membership test rather
      // than substring matching — no more "plan" matching inside "planning".
      const titleWords = new Set(terms(chunk.title));
      const bodyWords = new Set(terms(chunk.body));
      let score = 0;
      let matched = 0;
      for (const t of q) {
        let hit = false;
        if (titleWords.has(t)) { score += 10; hit = true; }
        else if (prefixHit(titleWords, t)) { score += 6; hit = true; }
        if (bodyWords.has(t)) { score += 3; hit = true; }
        else if (prefixHit(bodyWords, t)) { score += 2; hit = true; }
        if (hit) matched += 1;
      }
      // Coverage bonus: a short query whose every term appears is a strong signal
      // even with no title hit. Without this, "are you available for a retainer"
      // scored 3 against the pricing chunk and fell below the floor.
      // 2+ terms only: on a single-term query this bonus just promotes noise.
      if (matched === q.length && q.length > 1) score += 4;
      if (chunk.kind === "faq") score *= 1.15; // an FAQ is usually the most direct answer
      return { chunk, score, matched };
    })
    // Two body matches (3 + 3) is the weakest multi-term signal worth returning.
    // A single-term query can only ever score 3 on a body hit, so it could never
    // clear a floor of 6 — which is why "seo" returned nothing despite appearing
    // in the corpus. Single-term queries get the lower floor they need.
    // A single-term query can only ever score 3 on a body hit, so it could never
    // clear a floor of 6 — which is why "seo" returned nothing despite being in
    // the corpus. Multi-term queries additionally need either two matched terms
    // or one solid exact title hit, so a single loose prefix match ("delivery"
    // brushing "deliver") cannot drag in an unrelated chunk.
    .filter((r) =>
      q.length === 1
        ? r.score >= 3
        : r.score >= 6 && (r.matched >= 2 || r.score >= 10)
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.chunk);
}
