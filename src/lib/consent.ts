"use client";

import { useSyncExternalStore } from "react";

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

/**
 * The cookies granting consent causes to be written.
 *
 * `_ga` and `_ga_<id>` are GA4's client id; `_fbp` is Meta's browser id; `_gcl_*`
 * are Google Ads click ids. Listed rather than wildcarded because a blind sweep
 * of `document.cookie` would also delete anything a future tool sets for a
 * necessary purpose.
 */
const TRACKING_COOKIES = ["_ga", "_gid", "_fbp", "_fbc", "_gcl_au", "_gcl_aw", "_gcl_dc"];

/** GA4 writes `_ga_G-XXXXXXX`, so the suffix cannot be known here. */
const TRACKING_PREFIXES = ["_ga_"];

/**
 * Expires a cookie everywhere it could have been set.
 *
 * Both the exact host and the registrable domain, because a cookie set on
 * `.bilalshafqat.com` is not removed by expiring it on `bilalshafqat.com`, and
 * the two are indistinguishable when reading `document.cookie`.
 */
function expire(name: string) {
  const host = window.location.hostname;
  const parts = host.split(".");
  const domains = [undefined, host, `.${host}`];
  if (parts.length > 2) {
    const registrable = parts.slice(-2).join(".");
    domains.push(registrable, `.${registrable}`);
  }
  for (const domain of domains) {
    document.cookie =
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/` +
      (domain ? `; domain=${domain}` : "");
  }
}

/**
 * Forgets the stored choice so the banner asks again, and deletes what consent
 * caused to be written.
 *
 * Reloads rather than just clearing: a tracker that has already loaded cannot be
 * unloaded, and a reload is the only honest way to return the page to a
 * pre-consent state.
 *
 * The cookie sweep was missing (roadmap 213.23). Clearing localStorage made the
 * banner ask again while `_ga` and `_fbp` survived the reload and carried on
 * identifying the visitor — so withdrawal looked like it had worked and had
 * not. Withdrawal has to be as effective as consent was.
 */
export function clearConsent() {
  try {
    window.localStorage.removeItem(KEY);
    window.sessionStorage.clear();
  } catch {
    /* storage blocked; the sweep and reload below still reset the page */
  }

  try {
    const present = document.cookie.split(";").map((c) => c.split("=")[0].trim());
    for (const name of present) {
      if (TRACKING_COOKIES.includes(name) || TRACKING_PREFIXES.some((p) => name.startsWith(p))) {
        expire(name);
      }
    }
  } catch {
    /* cookies blocked entirely, which is the state we were aiming for anyway */
  }

  window.location.reload();
}

export function hasConsent(): boolean {
  return getConsent() === "granted";
}

/**
 * Subscribes a component to the stored consent choice.
 *
 * `useSyncExternalStore` is React's built-in answer for reading a value that
 * lives outside React, which localStorage is. It replaces the older pattern of
 * reading in a mount effect and calling setState, which trips
 * `react-hooks/set-state-in-effect` and also renders one frame with the wrong
 * value before correcting itself.
 *
 * The server snapshot is `null` because the server cannot know a browser's
 * stored choice, and `null` is already the "not yet answered" state.
 */
function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  // Another tab answering the banner should update this one too.
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useConsent(): Consent | null {
  return useSyncExternalStore(subscribe, getConsent, () => null);
}
