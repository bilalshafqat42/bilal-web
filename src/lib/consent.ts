"use client";

/** Analytics/attribution consent. "necessary" behaviour never asks. */
export type Consent = "granted" | "denied";

const KEY = "bs-consent";
export const CONSENT_EVENT = "bs-consent-change";

/** Storing the choice itself is necessary-category, so it is not gated. */
export function getConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    // Private mode / storage blocked: behave as "not yet answered" rather than throw.
    return null;
  }
}

export function setConsent(value: Consent) {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    /* nothing we can do; the in-page event below still updates this session */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export function hasConsent(): boolean {
  return getConsent() === "granted";
}
