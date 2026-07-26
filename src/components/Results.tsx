import { Clock, FileText, Home, TrendingUp, Star } from "lucide-react";
import Reveal, { RevealStagger, RevealItem } from "./Reveal";

const stats = [
  { icon: Clock, title: "15+ Years Experience", description: "Across digital marketing, UX, and web technologies" },
  { icon: FileText, title: "500+ Projects Delivered", description: "Including websites, funnels, landing pages, and growth systems" },
  { icon: Home, title: "UAE Real Estate Growth Specialist", description: "Hands-on experience with off-plan & lead-driven campaigns" },
  { icon: TrendingUp, title: "Strategy → Execution Ownership", description: "From planning and design to launch, tracking, and optimization" },
];

const testimonials = [
  {
    quote:
      "Bilal took full ownership of our growth funnel — from paid acquisition to landing pages and tracking. His ability to connect strategy with execution made a measurable impact within weeks.",
    name: "Marketing Manager",
    org: "UAE Real Estate Company",
  },
  {
    quote:
      "What sets Bilal apart is his understanding of both marketing strategy and technical execution. He helped us improve lead quality, conversion rates, and reporting clarity without adding operational complexity.",
    name: "Founder",
    org: "SaaS / Web Platform",
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
                  Measurable outcomes from <span className="text-gradient">growth-focused execution.</span>
                </h2>
                <p className="mt-4 text-muted leading-relaxed max-w-lg">
                  I focus on building scalable marketing systems that deliver consistent,
                  trackable business results — especially across UAE real estate, eCommerce,
                  and service-based businesses.
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
            {testimonials.map((t) => (
              <RevealItem key={t.name}>
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
                      {t.org.charAt(0)}
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
