"use client";

import { useEffect } from "react";
import { trackEmail, trackPhone } from "@/lib/analytics";

/**
 * Reports every `tel:` and `mailto:` click on the site.
 *
 * Added 2026-11-06. WhatsApp clicks were tracked through `WhatsAppLink`, but
 * the phone numbers in the footer, the contact page, the thank-you page and the
 * contact section sent nothing, so a visitor who called was invisible to GA4
 * and Meta. Those links sit in server components, which cannot take an
 * `onClick`; one delegated listener on the document covers all of them, and
 * any added later, without converting each one.
 *
 * The context is the page path, which is what a report on these events needs:
 * which page made someone pick up the phone. Renders nothing.
 */
export default function ContactClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      const href = link?.getAttribute("href") || "";
      if (href.startsWith("tel:")) trackPhone(window.location.pathname);
      else if (href.startsWith("mailto:")) trackEmail(window.location.pathname);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
