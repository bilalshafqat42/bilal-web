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
  return {
    ...stored,
    ...fromCurrentUrl(),
    submittedFrom: window.location.pathname,
  };
}
