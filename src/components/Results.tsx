import { Clock, Home, TrendingUp, Star } from "lucide-react";
import Reveal, { RevealStagger, RevealItem } from "./Reveal";
import ClientLogoRow from "./ClientLogoRow";

/**
 * The single proof section on the homepage.
 *
 * Merged from three separate homepage sections that each made a version of the
 * same claim: the client logo wall, the testimonials, and the outcome cards.
 * Proof now appears once, in the order it is most persuasive — who I have
 * worked for, what they said, what came of it.
 *
 * Layout is a single column rather than the previous two, because the
 * testimonial block is now conditional. A two-column grid with one column
 * empty collapses into a lopsided half-width section.
 */

/** Shape to pass when real quotes are available. Fill `testimonials` below and
 *  the block renders itself — no other change needed.
 *
 *  TODO(bilal): supply real quotes as:
 *    { quote: string; name: string; role: string; company: string; photo?: string }
 *  `photo` is optional; without it the card falls back to a monogram built from
 *  the company initial, which is what the original cards did. */
type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  photo?: string;
};

/** Deliberately empty. This previously shipped two `[Client Name]` placeholder
 *  quotes, which was tolerable while proof was spread across three sections and
 *  is not now that this is the only one. The block below is skipped entirely
 *  while this array is empty, so turning testimonials on is a data change
 *  rather than a code change. */
const testimonials: Testimonial[] = [];

/** Three outcome cards.
 *
 *  Was four. "6 Services, One Partner" was removed rather than reworded: the
 *  site now presents four disciplines and eight service categories, so a card
 *  claiming six contradicted the nav, `/services` and the capability ledger.
 *  Deleting a stale claim is not the same as inventing a new one — nothing here
 *  is a fabricated figure. */
const stats = [
  {
    icon: Clock,
    title: "15+ Years Experience",
    description: "Across digital marketing, design, and web/mobile development",
  },
  {
    icon: Home,
    title: "UAE Real Estate Growth Specialist",
    description: "Hands-on experience with off-plan & lead-driven campaigns",
  },
  {
    icon: TrendingUp,
    title: "Strategy → Execution Ownership",
    description: "From planning and design to launch, tracking, and optimization",
  },
];

export default function Results() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="site-container">
        <Reveal>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
              Results &amp; Impact
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
              Measurable outcomes across{" "}
              <span className="text-gradient">marketing, design &amp; development.</span>
            </h2>
            <p className="mt-4 text-muted leading-relaxed max-w-lg">
              I focus on delivering consistent, trackable results — whether that&apos;s lead volume,
              conversion rate, or a shipped product — especially across UAE real estate, eCommerce,
              and service-based businesses.
            </p>
          </div>
        </Reveal>

        {/* Who, before what they said. */}
        <ClientLogoRow variant="row" className="mt-12 justify-start sm:mt-14" />

        {testimonials.length > 0 ? (
          <RevealStagger className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {testimonials.map((t) => (
              <RevealItem key={`${t.company}-${t.name}`}>
                <div className="rounded-2xl border border-border glass-strong p-7">
                  <div className="flex gap-1 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="mt-4 text-base sm:text-lg text-ink/90 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold/30 to-violet/30 text-sm font-semibold text-ink">
                      {t.company.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{t.company}</p>
                      <p className="text-xs text-gold">
                        {t.name}
                        {t.role ? `, ${t.role}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        ) : null}

        <RevealStagger className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((s) => (
            <RevealItem key={s.title}>
              <div className="rounded-2xl border border-border panel p-6 h-full">
                <s.icon size={20} className="text-gold" />
                <p className="mt-4 font-semibold text-ink leading-snug">{s.title}</p>
                <p className="mt-1.5 text-base text-muted leading-relaxed">{s.description}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
