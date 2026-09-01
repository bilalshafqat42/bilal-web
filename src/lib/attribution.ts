"use client";

import { hasConsent } from "./consent";

// Marketing params worth attributing a lead to. Click IDs cover the platforms
// actually run on this site's campaigns: Google, Meta, TikTok and Microsoft.
const PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "ttclid",
  "msclkid",
] as const;

export type Attribution = Partial<Record<(typeof PARAMS)[number], string>> & {
  referrer?: string;
  landingPage?: string;
  submittedFrom?: string;
  /** Full URL of the page the form was submitted from. */
  pageUrl?: string;
  /** The previous page on this site, when they arrived by clicking an internal
   *  link. On /contact this is the page they were actually reading, which is far
   *  more useful than "/contact" itself. */
  internalReferrer?: string;
  /** The page the enquiry is *about*, and the single value the CRM should store.
   *  On a dedicated contact page that means the page they clicked through from;
   *  anywhere else (popup, chat) it is the page they were on. This is also
   *  exactly what the form displays, so what a visitor sees and what the CRM
   *  records can never disagree. */
  pageOfInterest?: string;
};

const KEY = "bs-attribution";

function fromCurrentUrl(): Attribution {
  if (typeof window === "undefined") return {};
  const q = new URLSearchParams(window.location.search);
  const out: Attribution = {};
  for (const p of PARAMS) {
    const v = q.get(p);
    if (v) out[p] = v.slice(0, 200);
  }
  return out;
}

/**
 * Records first-touch attribution once per session.
 *
 * Consent-gated on purpose: this writes to sessionStorage, so it only runs once
 * the visitor has accepted. Without consent nothing is stored, and a submission
 * still carries whatever params are on the URL at that moment (read live, never
 * persisted) so a single-page visit from an ad is not lost.
 */
export function captureAttribution() {
  if (typeof window === "undefined" || !hasConsent()) return;
  try {
    if (window.sessionStorage.getItem(KEY)) return; // first touch wins
    const data: Attribution = {
      ...fromCurrentUrl(),
      referrer: document.referrer ? document.referrer.slice(0, 300) : undefined,
      landingPage: window.location.pathname,
    };
    if (Object.keys(data).length > 0) {
      window.sessionStorage.setItem(KEY, JSON.stringify(data));
    }
  } catch {
    /* storage unavailable — attribution is best-effort, never a hard failure */
  }
}

/** Stored first-touch (if consented) merged with anything on the URL right now. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  let stored: Attribution = {};
  try {
    if (hasConsent()) {
      stored = JSON.parse(window.sessionStorage.getItem(KEY) || "{}");
    }
  } catch {
    stored = {};
  }
  // Same-origin referrer only. An external referrer is already captured as
  // `referrer` at landing; here we want "which of my pages sent them here".
  let internalReferrer: string | undefined;
  try {
    if (document.referrer) {
      const r = new URL(document.referrer);
      if (r.origin === window.location.origin && r.pathname !== window.location.pathname) {
        internalReferrer = r.pathname + r.search;
      }
    }
  } catch {
    internalReferrer = undefined;
  }

  const path = window.location.pathname;
  const isContactPage = path === "/contact";
  const pageOfInterest = isContactPage ? internalReferrer || path : path;

  return {
    ...stored,
    ...fromCurrentUrl(),
    submittedFrom: path,
    pageUrl: window.location.href,
    internalReferrer,
    pageOfInterest,
  };
}

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Meta's own `_fbp`/`_fbc` cookies, set by the pixel once consent is granted
 * and it loads. Sending these along with a lead submission significantly
 * improves match quality on the server-side Conversions API event Performo
 * sends — Meta uses them to link the event to the same browser/click that
 * fired the pixel, on top of (or instead of) the shared eventId.
 */
export function getFacebookCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === "undefined" || !hasConsent()) return {};
  return { fbp: readCookie("_fbp"), fbc: readCookie("_fbc") };
}
