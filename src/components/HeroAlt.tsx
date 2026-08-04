import Image from "next/image";
import { ArrowUpRight, Mail, ChevronDown, Sparkles } from "lucide-react";

export default function HeroAlt() {
  return (
    <section className="bg-bg text-ink px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-[1400px] rounded-[2.5rem] border border-border bg-bg-soft p-6 sm:p-10">
        {/* Nav */}
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-border bg-surface/60 px-6 py-3">
          <a href="#" className="flex items-center gap-2 font-semibold text-lg">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-bold text-bg">
              BS
            </span>
            Bilal Shafqat
          </a>

          <nav className="hidden items-center gap-8 text-sm text-muted lg:flex">
            <a href="#" className="hover:text-ink transition-colors">Services</a>
            <a href="#" className="hover:text-ink transition-colors">Work</a>
            <a href="#" className="hover:text-ink transition-colors">About</a>
            <a href="#" className="font-medium text-ink underline underline-offset-4">Talk to us</a>
          </nav>

          <div className="flex items-center gap-1 rounded-full bg-white/5 p-1">
            <a href="#" className="rounded-full px-4 py-2 text-sm text-muted">
              View work
            </a>
            <a href="#" className="btn-primary rounded-full px-4 py-2 text-sm font-medium">
              Book a free consultation
            </a>
          </div>
        </header>

        {/* Hero content */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
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

          {/* Right: single photo with floating stats + rotating badge */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-border">
              <Image
                src="/images/bilal-hero.jpg"
                alt="Bilal Shafqat"
                fill
                className="object-cover"
              />
              <div className="absolute right-4 top-4 flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white/60" />
                <span className="h-2 w-2 rounded-full bg-white/60" />
              </div>
              <div className="absolute right-4 top-4 max-w-[170px] rounded-2xl bg-black/50 p-4 text-white backdrop-blur-md">
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

            <div className="absolute -bottom-8 -right-8 flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 animate-spin rounded-full border border-dashed border-border [animation-duration:12s]" />
              <a
                href="#"
                className="flex flex-col items-center justify-center gap-0.5 text-center text-[10px] font-medium leading-tight text-ink"
              >
                View my
                <br />
                work
                <ArrowUpRight size={12} className="mt-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
