import type { ElementType, ReactNode } from "react";

/**
 * A small bordered label for a list of categories.
 *
 * **Two uses, and they had already drifted**, which is why this exists at two
 * rather than the three the rest of the refactor used as its threshold:
 *
 *     CaseStudyGrid   px-3 py-1    text-[0.7rem]
 *     PortfolioGrid   px-3 py-1.5  text-xs
 *
 * Different height and different type size for the same thing, on two grids a
 * visitor sees in one session. Nobody chose that; it is what happens when the
 * second one is written by copying the first and adjusting by eye.
 *
 * `as` because one is a `<span>` inside a flex row and the other an `<li>`
 * inside a list, and both are correct for their context. Same reasoning as
 * `Eyebrow`: keeping the element right is the difference between a label and
 * markup a screen reader can navigate.
 *
 * Not a link and deliberately not interactive. These describe the card they sit
 * on; the card itself is the link. A tag that looked clickable and was not
 * would be worse than one that plainly is not.
 */
export default function Tag({
  children,
  as: Tag = "span",
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Tag className={`r-chip border border-border px-3 py-1.5 text-xs text-muted ${className}`}>
      {children}
    </Tag>
  );
}
