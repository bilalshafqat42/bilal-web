import type { ReactNode } from "react";

/**
 * The small uppercase label that sits above a heading.
 *
 * **Counted on 2026-10-08: 98 instances across six different sizes.**
 *
 *     font-mono text-[0.7rem]  tracking-[0.18em]   75
 *     font-mono text-[0.65rem] tracking-[0.16em]   10
 *     font-mono text-[0.7rem]  tracking-[0.14em]    4
 *     font-mono text-[0.65rem] tracking-[0.18em]    4
 *     font-mono text-[0.65rem] tracking-[0.14em]    4
 *     font-mono text-[0.6rem]  tracking-[0.14em]    1
 *
 * Nobody chose six. They accumulated one section at a time, which is how a site
 * ends up looking assembled rather than designed. This is the one definition.
 *
 * Two sizes, not six, because two jobs actually exist: the label above a
 * section heading, and the smaller one inside a card where the heading beside
 * it is already small. `tone` covers the handful of places the label sits on
 * the white `.page-opener` band or needs to recede.
 */

type Props = {
  children: ReactNode;
  /** `sm` for inside a card, where a 0.7rem label crowds the heading under it. */
  size?: "default" | "sm";
  /** `muted` for a label that is orienting rather than announcing — the rail's
   *  "Typical timeline", a field name above a value. */
  tone?: "gold" | "muted";
  /** A short gold rule before the text. Used where the eyebrow opens a major
   *  section rather than labelling a card. */
  rule?: boolean;
  className?: string;
};

const SIZES = {
  default: "text-[0.7rem] tracking-[0.18em]",
  sm: "text-[0.65rem] tracking-[0.16em]",
} as const;

const TONES = {
  gold: "text-gold",
  muted: "text-muted/70",
} as const;

export default function Eyebrow({
  children,
  size = "default",
  tone = "gold",
  rule = false,
  className = "",
}: Props) {
  return (
    <span
      className={`inline-flex items-center gap-3 font-mono uppercase ${SIZES[size]} ${TONES[tone]} ${className}`}
    >
      {rule ? <span aria-hidden="true" className="h-px w-6 bg-gold/60" /> : null}
      {children}
    </span>
  );
}
