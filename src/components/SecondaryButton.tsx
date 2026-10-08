import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The outlined button that sits beside a `CtaButton`.
 *
 * **Counted on 2026-10-08: 16 hand-rolled copies across four different sizes.**
 *
 *     rounded-full border border-border px-6 py-3.5   9
 *     rounded-full border border-border px-5 py-2.5   4
 *     rounded-full border border-border px-6 py-3     2
 *     rounded-full border border-border px-8 py-4     1
 *
 * `CtaButton` was always a component and never drifted. This one was not, and
 * grew four sizes of what a visitor reads as the same control. That contrast is
 * the whole argument for the refactor.
 *
 * Two sizes, matching `CtaButton`'s `sm` and `lg`, so a primary and a secondary
 * placed side by side line up without either call site nudging padding.
 *
 * Renders an `<a>` for anything that is not an internal route, and a `<button>`
 * when given `onClick` instead of `href` — the same control appears in both
 * roles across the site and splitting it in two would put the drift back.
 */

type Common = {
  children: ReactNode;
  /** `lg` beside a hero CTA, `sm` in a card footer or a dense row. */
  size?: "sm" | "lg";
  /** Layout-only classes from the call site, e.g. `mt-8`. */
  className?: string;
};

type Props = Common &
  (
    | { href: string; onClick?: never; target?: string; rel?: string; type?: never }
    | { href?: never; onClick: () => void; target?: never; rel?: never; type?: "button" | "submit" }
  );

const isRoute = (href: string) => href.startsWith("/");

export default function SecondaryButton({
  children,
  size = "lg",
  className = "",
  ...rest
}: Props) {
  // `tap-target` is not decoration: the 24px floor from roadmap 364 applies to
  // every standalone control, and putting it here means a new call site cannot
  // reintroduce a 16px button.
  const pad = size === "lg" ? "px-6 py-3.5 text-sm" : "px-5 py-2.5 text-sm";
  const cls = `tap-target inline-flex items-center justify-center gap-2 rounded-full border border-border font-semibold text-ink transition-colors hover:border-gold/40 hover:bg-white/5 ${pad} ${className}`;

  if ("onClick" in rest && rest.onClick) {
    return (
      <button type={rest.type ?? "button"} onClick={rest.onClick} className={cls}>
        {children}
      </button>
    );
  }

  const href = rest.href as string;
  return isRoute(href) ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <a href={href} className={cls} target={rest.target} rel={rest.rel}>
      {children}
    </a>
  );
}
