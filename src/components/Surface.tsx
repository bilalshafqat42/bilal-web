import type { ElementType, ReactNode } from "react";

/**
 * A bordered box: card, panel, callout.
 *
 * **Counted on 2026-10-08: four backgrounds and three radii, mixed freely.**
 *
 *     border border-border panel          36      rounded-2xl      57
 *     border border-border bg-surface/60  21      rounded-xl       30
 *     border border-border bg-surface/40  10      rounded-[2rem]    9
 *     border border-border glass-strong    9
 *
 * Some of that spread is right — a tag should not look like a feature panel.
 * Three different backgrounds on cards of the same size is not, and
 * `border border-border panel` declared the border twice in all 36 places,
 * because `.panel` already set one.
 *
 * `level` names how far the box sits from the page rather than what it is made
 * of, so a visual change lands in `globals.css` once:
 *
 *   1  a card on the page            the default
 *   2  a card inside another card    recedes rather than stacks
 *   3  floating over scrolling content, so it blurs what is behind it
 *
 * `as` because these are not all `<div>`: the same box is an `<article>` in a
 * grid, an `<aside>` beside prose, a `<li>` in a list. Keeping the element
 * correct is the difference between a card and a landmark a screen reader can
 * use.
 */

type Props = {
  children: ReactNode;
  /** 1 on the page, 2 nested, 3 floating. See above. */
  level?: 1 | 2 | 3;
  /** `panel` for a full-width feature block, `card` everyday, `chip` for tags. */
  radius?: "panel" | "card" | "chip";
  /** Padding. `none` when the box holds an image that must reach its own edge. */
  pad?: "none" | "sm" | "md" | "lg";
  as?: ElementType;
  className?: string;
};

const PAD = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-7 sm:p-9",
} as const;

export default function Surface({
  children,
  level = 1,
  radius = "card",
  pad = "md",
  as: Tag = "div",
  className = "",
}: Props) {
  return (
    <Tag className={`surface-${level} r-${radius} ${PAD[pad]} ${className}`}>
      {children}
    </Tag>
  );
}
