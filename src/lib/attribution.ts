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

/*
 * The last two in-site paths, kept by `RouteHistory` in the layout.
 *
 * Added 2026-11-11. `document.referrer` is set once per full page load and
 * never changes on client-side navigation, so a visitor who went
 * /services/google-ads -> /contact through a Next link was recorded with
 * pageOfInterest "/contact". This in-memory record is updated on every route
 * change. Memory only: nothing is written to storage, so it needs no consent.
 */
let currentPath: string | undefined;
let previousPath: string | undefined;

export function notePath(path: string) {
  if (path === currentPath) return;
  previousPath = currentPath;
  currentPath = path;
}

/** The in-site page before this one, or undefined on a first page load. During
 *  the render of a new page the route effect has not run yet, so `currentPath`
 *  is still the page they came from. */
function previousInSitePath(): string | undefined {
  const here = window.location.pathname;
  if (currentPath && currentPath.split("?")[0] !== here) return currentPath;
  return previousPath && previousPath.split("?")[0] !== here ? previousPath : undefined;
}

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
  let internalReferrer: string | undefined = previousInSitePath();
  try {
    if (!internalReferrer && document.referrer) {
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

  // Ad click IDs and the full URL (which can carry them) only with consent
  // (2026-11-11). The banner says "Decline and nothing is stored", and a click
  // ID saved to the CRM is stored. Without consent the lead keeps the path.
  const consented = hasConsent();
  return {
    ...stored,
    ...(consented ? fromCurrentUrl() : {}),
    submittedFrom: path,
    pageUrl: consented ? window.location.href : window.location.origin + path,
    internalReferrer,
    pageOfInterest,
  };
}

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  if (!match) return undefined;
  // A malformed cookie (a stray "%") makes decodeURIComponent throw, and this
  // runs inside the lead submit: one bad cookie must not stop an enquiry.
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return undefined;
  }
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
