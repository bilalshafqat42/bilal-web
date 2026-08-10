"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const intersection = [
  "Paid marketing & performance advertising",
  "Web, mobile & MERN stack development",
  "Graphic design & social media management",
];

export default function HeroAlt() {
  const heroRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // Yellow "About Me" box starts at the same width as the heading above (max-w-7xl)
  // and 80vh tall, expands to 100% width / 100vh height on scroll, corners
  // squaring off as it reaches full bleed.
  useGSAP(
    () => {
      if (!frameRef.current) return;
      const tween = gsap.to(frameRef.current, {
        width: "100%",
        height: "100vh",
        borderRadius: "0px",
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=600",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
      };
    },
    { scope: heroRef }
  );

  return (
    <div ref={heroRef}>
      {/* Top row: headline 70% / supporting text + CTA 30%, plain black background */}
      <section id="home" className="relative overflow-hidden bg-bg text-ink pt-40 pb-16 sm:pt-48 sm:pb-20">
        <div className="pointer-events-none absolute inset-0 grid-fade" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr] lg:gap-10">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
              <span className="underline decoration-gold decoration-4 underline-offset-4">
                15 years
              </span>{" "}
              of marketing, design, and development experience — in{" "}
              <span className="underline decoration-gold decoration-4 underline-offset-4">
                one senior partner
              </span>
            </h1>

            <div className="lg:pt-3">
              <p className="text-lg text-muted leading-relaxed">
                A hands-on specialist in performance marketing, product
                design, and full-stack development — working directly with
                clients across the UAE and worldwide, no account managers or
                junior staff in between.
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

      {/* Separate "About Me" panel, own scroll-expand animation. Initial width
          matches the heading's own max-w-7xl container above. Glassmorphism
          panel (glass-strong, same style as Contact's card) instead of a solid
          fill, with blurred glow shapes behind it. Centered badge/headline/
          subtitle/photo layout — reference: a Behance profile page Bilal
          shared (centered "[Name] is [Role]" headline over a large photo). */}
      <section id="about" className="relative overflow-hidden bg-bg pb-16 sm:pb-20">
        <div
          ref={frameRef}
          className="glass-strong relative mx-auto overflow-hidden"
          style={{ width: "min(80rem, 100%)", height: "80vh", borderRadius: "1.75rem" }}
        >
          <div
            className="blob pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-gold/40"
            style={{ animationDelay: "-3s" }}
          />
          <div
            className="blob pointer-events-none absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-violet/40"
            style={{ animationDelay: "-8s" }}
          />

          <div className="relative flex h-full flex-col items-center justify-center overflow-y-auto px-6 py-14 text-center sm:px-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
              About Me
            </span>
            <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
              Strategy and execution, under one roof.
            </h2>
            <p className="mt-4 max-w-2xl text-sm sm:text-base text-muted leading-relaxed">
              I run paid marketing campaigns, design and build websites and
              mobile apps, develop custom applications on the MERN stack, and
              produce the graphic design and social content that goes around
              them — as one point of contact. Instead of briefing an agency, a
              developer, and a designer separately, you work with one person
              who understands how it all fits together.
            </p>

            <div className="mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2">
              {intersection.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-xs text-muted"
                >
                  <CheckCircle2 size={13} className="text-gold" />
                  {item}
                </span>
              ))}
            </div>

            <div className="relative mt-10 w-full max-w-xs sm:max-w-sm">
              <div
                className="relative aspect-[1412/1186] w-full"
                style={{
                  maskImage: "linear-gradient(to bottom, transparent, black 18%)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent, black 18%)",
                }}
              >
                <Image
                  src="/images/bilal-shafqat-coat.avif"
                  alt="Portrait of Bilal Shafqat"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
