"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const intersection = [
  "Paid marketing & performance advertising",
  "Web, mobile & app development",
  "Graphic design & social media management",
  "CRM & marketing automation",
];

export default function HeroAlt() {
  const heroRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // About panel starts at the same width as the 10-column content above
  // and 80vh tall, expands to 100% width / 100vh height on scroll, corners
  // squaring off as it reaches full bleed.
  useGSAP(
    () => {
      if (!frameRef.current) return;
      const mm = gsap.matchMedia();

      // Desktop only. Below lg the panel stays full width, because starting a
      // phone at 10 of 12 columns just wastes the screen.
      mm.add("(min-width: 1024px)", () => {
        // 10 of the 12 columns to start, reaching all 12 at 70% of the panel's
        // climb towards the navbar. `end: "top 30%"` is that 70% point: the
        // travel runs from the panel's top at the viewport bottom to its top at
        // the viewport top, so stopping at 30% down finishes it seven tenths of
        // the way through and holds full bleed for the rest.
        const tween = gsap.fromTo(
          frameRef.current,
          { width: "83.3333%", borderRadius: "1.75rem" },
          {
            width: "100%",
            borderRadius: "0px",
            ease: "none",
            scrollTrigger: {
              // Starts at the very top of the page rather than when the panel
              // enters the viewport. The hero above it is shorter than one
              // screen, so the panel is already partway up on load; triggering
              // on its entry meant it was never actually seen at 10 columns.
              trigger: heroRef.current,
              start: "top top",
              endTrigger: frameRef.current,
              end: "top 30%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        );
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: heroRef }
  );

  return (
    <div ref={heroRef}>
      {/* Top row: headline 70% / supporting text + CTA 30%, plain black background */}
      <section id="home" className="relative overflow-hidden bg-bg text-ink pt-40 pb-16 sm:pt-48 sm:pb-20">
        <div className="pointer-events-none absolute inset-0 grid-fade" />

        <div className="site-container relative">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr] lg:gap-10">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
              <span className="underline decoration-gold decoration-4 underline-offset-4">
                15 years
              </span>{" "}
              of marketing, design, and development experience, in{" "}
              <span className="underline decoration-gold decoration-4 underline-offset-4">
                one senior partner
              </span>
            </h1>

            <div className="lg:pt-3">
              <p className="text-lg text-muted leading-relaxed">
                Direct access to senior-level expertise, no account managers,
                no junior staff, & no handoffs between departments. Trusted
                by businesses across the UAE for paid marketing, web & app
                development, design, & automation, delivered personally from
                strategy to launch.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
                >
                  Book a free consultation <ArrowRight size={16} />
                </a>
                <a
                  href="/portfolio"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink hover:bg-white/5 transition-colors"
                >
                  View my work
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal panel, own scroll-expand animation. Initial width matches the
          10-column site container above. Layout follows a reference Bilal
          shared: badge top-left, headline left, short intro and CTA right, the
          photo centred, and an oversized wordmark behind it that the shoulders
          overlap. */}
      <section id="about" className="relative overflow-hidden bg-bg pb-16 sm:pb-20">
        <div
          ref={frameRef}
          className="glass-strong relative mx-auto overflow-hidden"
          style={{
            // Full width is the base, so phones use the whole screen. On
            // desktop the scroll tween's `from` state pulls this back to 10 of
            // 12 columns as soon as it renders.
            width: "100%",
            // Tall enough to hold the whole composition, capped so it still
            // leaves room for the section below on a short laptop screen.
            height: "min(88vh, 900px)",
            borderRadius: "1.75rem",
          }}
        >
          <div
            className="blob pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-gold/40"
            style={{ animationDelay: "-3s" }}
          />
          <div
            className="blob pointer-events-none absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-violet/40"
            style={{ animationDelay: "-8s" }}
          />

          {/* Wordmark sits at the very bottom and behind everything, so the
              portrait's shoulders cut across it. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-5 z-30 hidden select-none whitespace-nowrap text-center font-display font-bold leading-[0.78] tracking-tight text-white/70 mix-blend-difference lg:block"
            style={{ fontSize: "clamp(4rem, 13vw, 12rem)" }}
          >
            Bilal Shafqat
          </span>

          {/* Portrait, anchored to the bottom centre and layered above the
              wordmark. Masked at the top so it emerges from the panel instead
              of ending on a hard edge. */}
          <div
            role="img"
            aria-label="Portrait of Bilal Shafqat"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-auto hidden h-[82%] w-[61%] max-w-2xl lg:block"
            style={{
              backgroundImage: "url(/images/bilal-shirt.avif)",
              backgroundSize: "cover",
              backgroundPosition: "center 22%",
              backgroundRepeat: "no-repeat",
              maskImage: "linear-gradient(to bottom, transparent, black 16%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 16%)",
            }}
          />

          <div className="relative z-20 flex h-full flex-col px-6 pt-10 sm:px-10 sm:pt-12 lg:px-14">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              Available for work
            </span>

            {/* Three columns with an empty middle: the portrait shows through
                the gap rather than sitting behind the text. */}
            <div className="mt-10 grid flex-1 grid-cols-1 gap-8 lg:mt-14 lg:grid-cols-[1fr_34%_1fr] lg:gap-6">
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
                  Paid marketing, development and design, based in{" "}
                  <span className="text-gradient">Dubai</span>
                </h2>
                <ul className="mt-8 space-y-3">
                  {intersection.slice(0, 2).map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-muted">
                      <CheckCircle2 size={15} className="shrink-0 text-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hidden lg:block" />

              <div className="lg:justify-self-end lg:text-right">
                <p className="max-w-sm text-base leading-relaxed text-muted lg:ml-auto">
                  Hi, I&apos;m Bilal Shafqat. I run the paid campaigns, build the
                  websites and apps they point at, and design the creative around
                  them, so you brief one senior partner instead of managing three
                  suppliers.
                </p>
                <a
                  href="/portfolio"
                  className="btn-primary mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-shadow"
                >
                  See my work <ArrowRight size={16} />
                </a>
                <ul className="mt-8 space-y-3 lg:ml-auto">
                  {intersection.slice(2).map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-muted lg:justify-end"
                    >
                      <CheckCircle2 size={15} className="shrink-0 text-gold lg:order-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Below lg there is no room to layer a portrait behind text, so the
                same content stacks and the photo simply follows it. */}
            <div
              role="img"
              aria-label="Portrait of Bilal Shafqat"
              className="mt-8 h-56 w-full sm:h-72 lg:hidden"
              style={{
                backgroundImage: "url(/images/bilal-shirt.avif)",
                backgroundSize: "cover",
                backgroundPosition: "center 22%",
                maskImage: "linear-gradient(to bottom, transparent, black 18%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black 18%)",
              }}
            />

          </div>
        </div>
      </section>
    </div>
  );
}
