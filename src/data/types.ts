/**
 * Shapes shared by more than one data file.
 *
 * `Faq` was declared four times (FaqSection, serviceDepth, caseStudies,
 * pillars), identically each time. Identical today is not a guarantee: the day
 * one copy gains a field, the others silently stop matching. One declaration.
 *
 * There is deliberately no shared `Discipline`. The name covers two different
 * things: `Discipline` in `disciplines.ts` is a portfolio route (slug, group,
 * artefact kinds, page copy) and `HomeDiscipline` in `pillars.ts` is a homepage
 * ledger row (label, summary, href, tags). They share no fields, so merging
 * them would mean a type where everything is optional and nothing is checked.
 */

export type Faq = { question: string; answer: string };

export type Accent = "gold" | "violet" | "cyan";

/** A chip under a ledger row: what it says, and the service page it opens. */
export type LedgerTag = { label: string; href: string };
