"use client";

import Link from "next/link";
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

export default function HeroYellowTest() {
  const heroRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // Yellow "About Me" box starts at 80% width / 80vh height, expands to
  // 100% / 100vh on scroll, corners squaring off as it reaches full bleed.
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
      {/* Top row: headline 70% / supporting text + CTA 30%, plain black background, unchanged from before */}
      <section id="home" className="relative overflow-hidden bg-bg text-ink pt-40 pb-16 sm:pt-48 sm:pb-20">
        <div className="pointer-events-none absolute inset-0 grid-fade" />

        <div className="site-container relative">
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
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink hover:bg-white/5 transition-colors"
                >
                  View my work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Separate yellow "About Me" box, own panel, its own scroll-expand animation.
          Initial width matches the heading's own max-w-7xl container above. */}
      <section id="about" className="relative overflow-hidden bg-bg pb-16 sm:pb-20">
        <div
          ref={frameRef}
          className="relative mx-auto overflow-hidden bg-gold"
          style={{ width: "min(80rem, 100%)", height: "80vh", borderRadius: "1.75rem" }}
        >
          <div className="flex h-full flex-col justify-center overflow-y-auto px-6 py-10 sm:px-12 sm:py-14">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[6fr_4fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#14140f]/20 bg-[#14140f]/5 px-4 py-1.5 text-xs font-medium tracking-wide text-[#14140f] uppercase">
                  About Me
                </span>
                <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-[#14140f]">
                  Strategy and execution, under one roof.
                </h2>
                <p className="mt-4 text-sm sm:text-base text-[#14140f]/80 leading-relaxed">
                  I run paid marketing campaigns, design and build websites
                  and mobile apps, develop custom applications on the MERN
                  stack, and produce the graphic design and social content
                  that goes around them — as one point of contact. Instead of
                  briefing an agency, a developer, and a designer separately,
                  you work with one person who understands how it all fits
                  together.
                </p>
                <ul className="mt-5 space-y-2">
                  {intersection.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#14140f]">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-[1.5rem] border border-[#14140f]/15">
                <Image
                  src="/images/bilal-shafqat-coat.avif"
                  alt="Portrait of Bilal Shafqat"
                  width={1412}
                  height={1186}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
