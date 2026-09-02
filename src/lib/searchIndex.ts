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
/**
 * Inverse document frequency, cached per index.
 *
 * Without it every matched term is worth the same, so "what is the difference
 * between..." scored higher on the shared words than on the one word that
 * actually distinguished the question. A term in most chunks is nearly
 * worthless; a term in two chunks is the whole query.
 */
const idfCache = new WeakMap<Chunk[], Map<string, number>>();

function idfFor(index: Chunk[]): Map<string, number> {
  const cached = idfCache.get(index);
  if (cached) return cached;
  const df = new Map<string, number>();
  for (const chunk of index) {
    for (const t of new Set([...terms(chunk.title), ...terms(chunk.body)])) {
      df.set(t, (df.get(t) ?? 0) + 1);
    }
  }
  const idf = new Map<string, number>();
  for (const [t, n] of df) {
    // The ceiling has to be well above the common-word range or it flattens the
    // very distinction it exists to make: at a cap of 2.5, "build" (2.33) scored
    // almost as high as "wordpress" (3.55 uncapped), so "do you build wordpress
    // sites" ranked on "build" and returned the e-commerce answer.
    idf.set(t, Math.max(0.2, Math.min(6, Math.log(index.length / n))));
  }
  idfCache.set(index, idf);
  return idf;
}

export function search(index: Chunk[], query: string, limit = 3): Chunk[] {
  const q = terms(query);
  if (!q.length) return [];
  const idf = idfFor(index);

  // Falls back to a prefix match when the stems do not line up exactly, which
  // is what connects "develop" to "development" or "market" to "marketing"
  // without hand-writing a rule per suffix. Worth less than an exact hit.
  // Both sides need real length, or a short stem swallows an unrelated word:
  // "postgres" stems to "postgr", which starts with "post", which is how a
  // database query reached a social-posting answer.
  // Returns the matched index word, not just a boolean, so the score can be
  // weighted by *its* idf. Weighting by the query term instead meant a stemmed
  // query like "postgr" fell back to a default weight, and "postgres" never
  // reached the PostgreSQL answer despite matching it cleanly.
  const prefixHit = (words: Set<string>, t: string): string | null => {
    if (t.length < 5) return null;
    for (const w of words) {
      if (w.length < 5) continue;
      if (w.startsWith(t) || t.startsWith(w)) return w;
    }
    return null;
  };

  return index
    .map((chunk) => {
      const titleWords = new Set(terms(chunk.title));
      const bodyWords = new Set(terms(chunk.body));
      let score = 0;
      let matched = 0;
      let exact = 0;
      for (const t of q) {
        const w = idf.get(t) ?? 1.5; // unseen term: treat as distinctive
        let hit = false;
        if (titleWords.has(t)) { score += 10 * w; hit = true; exact += 1; }
        else {
          const pw = prefixHit(titleWords, t);
          if (pw) { score += 6 * (idf.get(pw) ?? w); hit = true; }
        }
        if (bodyWords.has(t)) { score += 3 * w; hit = true; exact += 1; }
        else {
          const pw = prefixHit(bodyWords, t);
          if (pw) { score += 2 * (idf.get(pw) ?? w); hit = true; }
        }
        if (hit) matched += 1;
      }
      // Coverage of the title, counting only its distinctive words. Measured over
      // every word instead, "do you build wordpress sites" scored higher against
      // "Do you build e-commerce sites?" than against the WordPress answer,
      // because four filler words matched and the one that mattered did not.
      const keyTitle = [...titleWords].filter((t) => (idf.get(t) ?? 1.5) > 0.9);
      if (keyTitle.length) {
        const covered = keyTitle.filter((t) => q.includes(t)).length / keyTitle.length;
        score += covered * 10;
      }

      if (matched === q.length && q.length > 1) score += 4;
      if (chunk.kind === "faq") score *= 1.15; // an FAQ is usually the most direct answer
      return { chunk, score, matched, exact };
    })
    // A single-term query can only ever score on one term, so it needs a lower
    // floor than a multi-term one. Multi-term queries additionally need either
    // two matched terms or one solid title hit, so a single loose prefix match
    // cannot drag in an unrelated chunk.
    // A multi-term query must land at least one *exact* term somewhere. Without
    // that, "pizza delivery" scored on "delivery" merely brushing "deliver" and
    // returned an unrelated chunk.
    .filter((r) =>
      q.length === 1
        // A single word gets no help from a second term, so a strong prefix hit
        // has to count: "postgres" must still reach "PostgreSQL".
        ? r.exact >= 1 ? r.score >= 8 : r.score >= 22
        // Thresholds scale with the IDF ceiling. They were tuned against a
        // fixture of real questions plus deliberate nonsense; loosening them
        // lets "pizza delivery" back in.
        : r.score >= 18 && r.exact >= 1 && (r.matched >= 2 || r.score >= 28)
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.chunk);
}
