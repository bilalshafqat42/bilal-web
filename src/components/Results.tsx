import { Clock, FileText, Home, TrendingUp, Star } from "lucide-react";
import Reveal, { RevealStagger, RevealItem } from "./Reveal";

const stats = [
  { icon: Clock, title: "15+ Years Experience", description: "Across digital marketing, design, and web/mobile development" },
  { icon: FileText, title: "6 Services, One Partner", description: "Paid marketing, web, mobile, MERN development, and design under one roof" },
  { icon: Home, title: "UAE Real Estate Growth Specialist", description: "Hands-on experience with off-plan & lead-driven campaigns" },
  { icon: TrendingUp, title: "Strategy → Execution Ownership", description: "From planning and design to launch, tracking, and optimization" },
];

const testimonials = [
  {
    quote:
      "[Add a real client quote — e.g. what this client hired you for and the result they saw.]",
    name: "[Client Name]",
    org: "[Company / Project]",
  },
  {
    quote:
      "[Add a real client quote here once the first studio project is complete.]",
    name: "[Client Name]",
    org: "[Company / Project]",
  },
];

export default function Results() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14">
          <div>
            <Reveal>
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
                  Results &amp; Impact
                </span>
                <h2 className="mt-5 text-3xl sm:text-4xl font-semibold text-ink">
                  Measurable outcomes across <span className="text-gradient">marketing, design & development.</span>
                </h2>
                <p className="mt-4 text-muted leading-relaxed max-w-lg">
                  I focus on delivering consistent, trackable results — whether that&apos;s
                  lead volume, conversion rate, or a shipped product — especially across
                  UAE real estate, eCommerce, and service-based businesses.
                </p>
              </div>
            </Reveal>

            <RevealStagger className="mt-10 grid sm:grid-cols-2 gap-5">
              {stats.map((s) => (
                <RevealItem key={s.title}>
                  <div className="rounded-2xl border border-border glass p-6 h-full">
                    <s.icon size={20} className="text-gold" />
                    <p className="mt-4 font-semibold text-ink leading-snug">{s.title}</p>
                    <p className="mt-1.5 text-sm text-muted leading-relaxed">{s.description}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealStagger>
          </div>

          <RevealStagger className="flex flex-col gap-5">
            {testimonials.map((t, i) => (
              <RevealItem key={i}>
                <div className="rounded-2xl border border-border glass-strong p-7">
                  <div className="flex gap-1 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="mt-4 text-sm sm:text-base text-ink/90 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold/30 to-violet/30 text-sm font-semibold text-ink">
                      {t.org.replace(/^\[/, "").charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{t.org}</p>
                      <p className="text-xs text-gold">{t.name}</p>
                    </div>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </div>
    </section>
  );
}
