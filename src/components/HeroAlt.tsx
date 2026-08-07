"use client";

import { useEffect, useRef } from "react";
import {
  ArrowRight,
  Megaphone,
  TrendingUp,
  Smartphone,
  Palette,
  Globe,
  Share2,
  type LucideIcon,
} from "lucide-react";

type ServiceNode = {
  icon: LucideIcon;
  label: string;
  top: number;
  left: number;
};

const serviceNodes: ServiceNode[] = [
  { icon: Megaphone, label: "Paid Social Media Marketing", top: 12, left: 8 },
  { icon: TrendingUp, label: "Performance Marketing", top: 14, left: 66 },
  { icon: Smartphone, label: "App Development", top: 46, left: 36 },
  { icon: Palette, label: "App Design", top: 40, left: 82 },
  { icon: Globe, label: "Web Development", top: 76, left: 14 },
  { icon: Share2, label: "Social Media Management", top: 72, left: 62 },
];

const nodeConnections: [number, number][] = [
  [0, 1],
  [1, 3],
  [3, 5],
  [5, 4],
  [4, 2],
  [2, 0],
];

export default function HeroAlt() {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    (async () => {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      if (!frameRef.current) return;

      const tween = gsap.to(frameRef.current, {
        width: "100%",
        borderRadius: "0px",
        ease: "none",
        scrollTrigger: {
          trigger: frameRef.current,
          start: "top 95%",
          end: "top 15%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    })();

    return () => cleanup?.();
  }, []);

  return (
    <section id="home" className="relative overflow-hidden bg-bg text-ink pt-40 pb-16 sm:pt-48 sm:pb-20">
      <div className="pointer-events-none absolute inset-0 grid-fade" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Top split: heading left, supporting text + CTA right */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-start">
          <h1 className="text-5xl sm:text-6xl lg:text-[4rem] font-bold leading-[1.05] tracking-tight text-ink">
            <span className="underline decoration-gold decoration-4 underline-offset-4">
              15 years
            </span>{" "}
            of marketing, design, and development experience — in{" "}
            <span className="underline decoration-gold decoration-4 underline-offset-4">
              one senior partner
            </span>
          </h1>

          <div className="lg:pt-3">
            <p className="max-w-md text-lg text-muted leading-relaxed">
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

      {/* Visual panel: starts at 90% width, expands to 100% on scroll */}
      <div
        ref={frameRef}
        className="relative mx-auto mt-14 overflow-hidden"
        style={{ width: "90%", borderRadius: "1.75rem" }}
      >
        <div className="relative min-h-[420px] bg-bg-soft sm:min-h-[480px]">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="blob pointer-events-none absolute left-1/3 top-1/4 h-72 w-72 rounded-full bg-gold/25" style={{ animationDelay: "-3s" }} />
          <div className="blob pointer-events-none absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-violet/20" style={{ animationDelay: "-8s" }} />

          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {nodeConnections.map(([a, b], i) => (
              <line
                key={i}
                x1={serviceNodes[a].left + 6}
                y1={serviceNodes[a].top + 4}
                x2={serviceNodes[b].left + 6}
                y2={serviceNodes[b].top + 4}
                stroke="rgba(242,201,76,0.25)"
                strokeWidth="0.3"
              />
            ))}
          </svg>

          {serviceNodes.map((node, i) => (
            <div
              key={node.label}
              className="node-float absolute flex items-center gap-2 rounded-xl border border-border bg-black/50 px-3 py-2.5 text-white backdrop-blur-md"
              style={{
                top: `${node.top}%`,
                left: `${node.left}%`,
                animationDelay: `${i * -1.1}s`,
              }}
            >
              <node.icon size={16} className="shrink-0 text-gold" />
              <span className="whitespace-nowrap text-xs font-medium">{node.label}</span>
            </div>
          ))}

          <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-md">
              15+ Years
            </span>
            <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-md">
              Dubai, UAE
            </span>
            <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-md">
              6 Services, One Partner
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
