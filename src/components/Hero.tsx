import Image from "next/image";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import Reveal from "./Reveal";

const ticker = [
  "Performance Marketing",
  "Paid Ads",
  "UX / UI Design",
  "Web & Mobile Development",
  "CRM Automation",
  "AI Workflows",
  "Growth Strategy",
];

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 grid-fade" />
      <div className="blob pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-gold/30" />
      <div className="blob pointer-events-none absolute top-10 right-0 h-80 w-80 rounded-full bg-violet/30" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
                <Sparkles size={14} /> Growth Strategist · Performance Marketer · Digital Builder
              </span>

              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold leading-[1.1] text-ink">
                I build growth engines from{" "}
                <span className="text-gradient">strategy to shipped product.</span>
              </h1>

              <p className="mt-6 text-lg text-ink/90 font-medium">
                Digital Marketing Manager &amp; Growth Strategist
              </p>
              <p className="mt-3 max-w-xl text-base sm:text-lg text-muted leading-relaxed">
                One partner for performance marketing, UX/UI design, web &amp; mobile
                development, and automation — so growth never stalls between teams.
                Based in Dubai, working with clients across the UAE and worldwide.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="#case-studies"
                  className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-shadow"
                >
                  View My Work <ArrowRight size={16} />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink hover:bg-white/5 transition-colors"
                >
                  Let&apos;s Talk
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
                <span className="font-semibold text-ink">15+ Years</span>
                <span className="hidden sm:inline text-border">|</span>
                <span className="font-semibold text-ink">500+ Projects Delivered</span>
                <span className="hidden sm:inline text-border">|</span>
                <span className="flex items-center gap-1.5 font-semibold text-ink">
                  <MapPin size={14} className="text-gold" /> Dubai, UAE
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-gold/20 via-transparent to-violet/25 blur-2xl" />
              <div className="relative rounded-[2rem] border border-border glass overflow-hidden">
                <Image
                  src="/images/bilal-hero.jpg"
                  alt="Bilal Shafqat, Digital Marketing Manager and Growth Strategist"
                  width={800}
                  height={816}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 glass-strong rounded-2xl px-5 py-3 text-xs">
                <p className="font-semibold text-ink">UAE Real Estate</p>
                <p className="text-muted">Growth Specialist</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Marquee ticker */}
      <div className="relative mt-20 border-y border-border overflow-hidden">
        <div className="marquee-track py-4">
          {[...ticker, ...ticker].map((item, i) => (
            <span
              key={i}
              className="mx-4 flex items-center gap-3 text-sm sm:text-base font-medium text-muted whitespace-nowrap"
            >
              {item}
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
