import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import Reveal, { RevealStagger, RevealItem } from "./Reveal";
import ClientLogoRow from "./ClientLogoRow";
import CtaButton from "@/components/CtaButton";
import { caseStudyUrls } from "@/data/caseStudies";
import { disciplinesWithPages } from "@/data/disciplines";

/**
 * The proof wall — the single proof section on the homepage.
 *
 * Rebuilt 2026-09-28 to the design Bilal sent: a claim about *method* rather
 * than adjectives, a panel explaining how the numbers are produced, four
 * figures, the client row, and one handoff bar.
 *
 * ---------------------------------------------------------------------------
 * **Every figure here is checkable, and two of them are counted rather than
 * claimed.**
 *
 * It shipped with `[3.2x]` return on ad spend and `[-41%]` cost per qualified
 * lead. Both were placeholders, both went live, and both were read by real
 * visitors as facts — a bracketed number is still a number to someone skimming.
 * Nothing had ever been measured against a real account, and roadmap 213.12
 * records why: that data belongs to the client and none has been released.
 *
 * They are gone. What replaced them is derived from the site's own data — the
 * case study count and the discipline count both come from the files that build
 * those pages, so neither can drift from what the site actually contains.
 *
 * **If a client approves a real performance figure, add it here with
 * `verified: true`.** The `verified` flag stays because the next unverified
 * number should be caught the same way: it renders bracketed, which is a
 * warning to us, not a design.
 */

type Stat = {
  value: string;
  label: string;
  detail: string;
  meta: string;
  /** False until a client has approved the figure for publication. Unverified
   *  values are wrapped in brackets at render time rather than in the string,
   *  so removing the brackets is impossible without also flipping this flag —
   *  which is the point. A figure cannot be quietly promoted to a fact. */
  verified: boolean;
};

const stats: Stat[] = [
  {
    value: "15+",
    label: "Years, one point of contact",
    detail: "Strategy, design and build without a handoff layer",
    meta: "Based in Dubai, UAE",
    verified: true,
  },
  {
    // Counted from `caseStudies`, not typed, so it cannot go stale.
    value: `${caseStudyUrls().filter((u) => u.split("/").length > 3).length}`,
    label: "Case studies published",
    detail: "Each with the brief, the decisions and what shipped",
    meta: "Brief · Build · Outcome",
    verified: true,
  },
  {
    // The same four the capability ledger names, counted from the data behind
    // it rather than asserted twice.
    value: `${disciplinesWithPages().length}`,
    label: "Disciplines, one contract",
    detail: "Marketing, design, web and mobile under one agreement",
    meta: "No subcontractors",
    verified: true,
  },
];

/** How the numbers are produced. This panel is the real differentiator in the
 *  design: every freelancer claims results, and almost none explain the
 *  measurement. It is also the part that stays true regardless of which figures
 *  end up in the cards, which is why it is written as method rather than
 *  outcome. */
const METHOD = [
  "Baseline captured before anything changes",
  "Tracked in your own GA4, CRM and ad accounts",
  "One monthly report, no vanity metrics",
];

export default function Results() {
  // Derived, never hard-coded. The design's caption said "Five case studies";
  // the real number is whatever is in the data, and a hand-typed count is a
  // claim that goes stale the moment a project is added or removed.
  const studies = caseStudyUrls().filter((u) => u.split("/").length > 3).length;

  return (
    <section className="relative py-24 sm:py-32">
      <div className="site-container">
        {/* Claim and method, side by side. The method panel earns the right
            column: it is the answer to the question the figures provoke. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-16">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                <span aria-hidden="true" className="h-px w-6 bg-gold/60" />
                Results &amp; Impact
              </span>
              <h2 className="t-h2 mt-5 text-ink">
                Numbers first.{" "}
                <br />
                Opinions second.
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
                Every engagement starts with a tracked baseline and reports against one
                number you agreed to. Below is the shape of that across UAE real estate,
                eCommerce and service businesses.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-2xl border border-border panel p-6 sm:p-7">
              <p className="font-semibold text-ink">How these numbers are produced</p>
              <ul className="mt-4 space-y-3">
                {METHOD.map((m) => (
                  <li key={m} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <Check size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                    {m}
                  </li>
                ))}
              </ul>
              <hr className="mt-5 border-t border-border" />
              <p className="mt-4 text-xs leading-relaxed text-muted/80">
                Access stays in your name. If we stop working together, the data stays
                with you.
              </p>
            </div>
          </Reveal>
        </div>

        {/* The figures. `items-stretch` plus `h-full` so a card with a longer
            detail line does not leave its neighbours short. */}
        <RevealStagger className="mt-14 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {stats.map((s) => (
            <RevealItem key={s.label} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-border panel p-6">
                <p className="t-h2 text-gold">{s.verified ? s.value : `[${s.value}]`}</p>
                <p className="mt-3 font-semibold leading-snug text-ink">{s.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.detail}</p>
                <p className="mt-auto pt-6 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted/70">
                  {s.meta}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

        {/* Worked with. A rule beside the label rather than above the row, so
            the logos read as a continuation of the proof rather than a new
            section. */}
        <div className="mt-16 flex items-center gap-5">
          <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted/70">
            Worked with
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-border" />
        </div>
        {/* The real clients only. The design carried two extra tiles reading
            "[Client 4]" and "[Client 5]"; empty seats on a live page read as a
            roster with names withheld, which is a claim rather than a layout.
            The row grows on its own as clients are added. */}
        <ClientLogoRow variant="row" className="mt-6 justify-start" />

        {/* One handoff, at the end, where a reader who believed the numbers is
            looking for what to do next. */}
        <Reveal className="mt-14">
          <div className="flex flex-col gap-6 rounded-2xl border border-border panel p-7 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-semibold text-ink">Want the working behind these numbers?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {studies} case studies, with the brief, the spend and what actually moved.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/portfolio"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-gold/40"
              >
                View case studies
                <ArrowRight
                  size={15}
                  className="shrink-0 transition-transform group-hover:translate-x-1"
                />
              </Link>
              <CtaButton href="/appointment">Book a free consultation</CtaButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
