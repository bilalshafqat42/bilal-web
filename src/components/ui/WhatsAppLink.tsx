"use client";

import { trackWhatsApp } from "@/lib/analytics";

/**
 * Every outbound WhatsApp link on the site.
 *
 * Added 2026-09-24 (roadmap 213.20). There were six WhatsApp links across the
 * site and **one** of them fired `whatsapp_click` — the one on the contact
 * form's success panel. The other five sent nothing to GA4 and no `Contact` to
 * Meta, including the highest-intent click on the site: the fallback offered
 * when a form submission fails, taken by someone who has already typed out an
 * enquiry and watched it not send.
 *
 * Phase 1 of the roadmap lists `whatsapp_click` among the events that "fire
 * automatically, nothing to create in either UI". That was true of one link.
 *
 * The point of a component rather than five added `onClick` handlers is that a
 * new WhatsApp link cannot be added untracked: there is no raw `wa.me` href
 * left to copy. It also carries `target`/`rel`, which two of the six omitted,
 * and owns the phone number so it is not repeated as a literal in five files.
 */

/** The single source for the number. Digits only — `wa.me` takes no `+`. */
export const WHATSAPP_NUMBER = "971529766006";

type Props = {
  /**
   * Where on the site this link was pressed, sent as `whatsapp_context` to GA4
   * and as `content_name` to Meta. Use a stable, readable token — these become
   * the values in a custom dimension report, so "contact-page-card" is worth
   * having and "link3" is not.
   */
  context: string;
  /** Prefilled message. Omit for a bare chat open. */
  message?: string;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
};

export default function WhatsAppLink({
  context,
  message,
  className,
  children,
  "aria-label": ariaLabel,
}: Props) {
  const href = message
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <a
      href={href}
      // A WhatsApp link leaves the site, so it opens alongside rather than
      // replacing a page someone may still be reading. `noopener` is the part
      // that matters — without it the opened tab can reach back through
      // `window.opener`.
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      // Fired on press rather than on navigation, deliberately: the click hands
      // the visitor to another application and there is no later moment this
      // page is still running to report from.
      onClick={() => trackWhatsApp(context)}
      className={className}
    >
      {children}
    </a>
  );
}
