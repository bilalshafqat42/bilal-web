import Image from "next/image";
import { ArrowUpRight, Mail, ChevronDown, Sparkles } from "lucide-react";

export default function HeroAlt() {
  return (
    <section className="relative overflow-hidden bg-bg text-ink px-4 py-16 sm:px-8 sm:py-20">
      <div className="pointer-events-none absolute inset-0 grid-fade" />
      <div className="relative mx-auto max-w-[1400px]">
        {/* Hero content */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left: headline */}
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-sm text-muted">
                <Sparkles size={14} className="text-muted" /> Marketing
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-sm text-muted">
                <Sparkles size={14} className="text-muted" /> Design &amp; Dev
              </span>
            </div>

            <h1 className="mt-6 text-5xl sm:text-6xl font-semibold uppercase leading-[1.05] tracking-tight text-ink">
              Where your
              <br />
              <span className="inline-flex items-center rounded-full border-2 border-border px-4 py-0.5">
                growth
              </span>
              <br />
              <Sparkles size={30} className="inline -translate-y-1 text-muted" /> never stalls
            </h1>

            <div className="mt-6 h-px w-full max-w-sm bg-border" />

            <p className="mt-6 max-w-sm text-base text-muted leading-relaxed">
              Paid marketing, web &amp; mobile development, and design — under one
              roof, working with clients across the UAE and worldwide.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#"
                className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
              >
                Book a free consultation
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium text-ink hover:bg-white/5 transition-colors"
              >
                View my work
              </a>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted hover:bg-white/5 transition-colors"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted hover:bg-white/5 transition-colors"
                aria-label="Scroll to services"
              >
                <ChevronDown size={16} />
              </a>
            </div>
          </div>

          {/* Right: single photo with floating stats + rotating badge, all contained within the frame */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem]">
            <Image
              src="/images/bilal-hero.jpg"
              alt="Bilal Shafqat"
              fill
              className="object-cover"
            />

            {/* Rotating "view work" badge — top-right, fully inside the frame */}
            <div className="absolute right-4 top-4 flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 animate-spin rounded-full border border-dashed border-white/40 [animation-duration:12s]" />
              <a
                href="#"
                className="flex flex-col items-center justify-center gap-0.5 text-center text-[9px] font-medium leading-tight text-white"
              >
                View
                <br />
                work
                <ArrowUpRight size={10} className="mt-0.5" />
              </a>
            </div>

            <div className="absolute right-4 top-1/3 max-w-[170px] rounded-2xl bg-black/50 p-4 text-white backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold">15+</span>
                <ArrowUpRight size={16} />
              </div>
              <p className="mt-1 text-xs text-white/80">Years across marketing, design &amp; dev</p>
            </div>

            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                Dubai, UAE
              </span>
              <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                6 Services, One Partner
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
