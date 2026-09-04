import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Primary marketing call to action.
 *
 * A pill with the arrow in a circular badge on its leading edge, rather than a
 * bare icon trailing the label.
 *
 * Colours are unchanged from `.btn-primary`, deliberately: the gradient and the
 * dark ink are reused as-is, and the badge inverts them — the disc takes the
 * button's own text colour and the arrow takes the button's background. So the
 * new shape introduces no new colour to the palette, which is the constraint
 * this was asked under.
 *
 * The badge is `aria-hidden`. It carries no meaning the label does not already
 * give, and announcing "arrow" after "Book a free consultation" is noise.
 *
 * Not used for form submits, the cookie banner, the search panel, the WhatsApp
 * widget or the assistant's send control. Those are utility buttons that happen
 * to share the gold; a decorative arrow badge on "Accept" or "Send" would be
 * meaningless and, at 40px, would not fit.
 */
type Props = {
  href: string;
  children: React.ReactNode;
  /** Layout-only classes from the call site, e.g. `mt-9`. */
  className?: string;
  /** `lg` matches the hero and the section-closing CTAs; `sm` suits denser
   *  placements like a card footer. */
  size?: "sm" | "lg";
  target?: string;
  rel?: string;
};

/** `next/link` is for internal routes. A `mailto:`, a `tel:`, an external URL
 *  or a bare fragment is not one, and routing them through the client router
 *  either breaks them or pointlessly involves it. */
const isRoute = (href: string) => href.startsWith("/");

export default function CtaButton({
  href,
  children,
  className = "",
  size = "lg",
  target,
  rel,
}: Props) {
  const pad = size === "lg" ? "py-2 pl-2 pr-7 text-sm" : "py-1.5 pl-1.5 pr-6 text-sm";
  const disc = size === "lg" ? "h-11 w-11" : "h-9 w-9";

  const cls = `btn-primary group inline-flex items-center gap-3.5 rounded-full font-semibold ${pad} ${className}`;
  const inner = (
    <>
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center rounded-full bg-[#14140f] text-gold transition-transform duration-200 group-hover:translate-x-0.5 ${disc}`}
      >
        <ArrowRight size={size === "lg" ? 17 : 15} />
      </span>
      {children}
    </>
  );

  return isRoute(href) ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={cls} target={target} rel={rel}>
      {inner}
    </a>
  );
}
