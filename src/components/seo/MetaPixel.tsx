"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useConsent } from "@/lib/consent";

/**
 * Meta (Facebook) Pixel.
 *
 * The snippet Meta gives you fires on page load. That is not usable here: this
 * site shows a consent banner promising nothing loads until the visitor accepts,
 * and the pixel writes an `_fbp` cookie and sends an identifier. Firing it first
 * would make the banner a lie, and under UAE PDPL and GDPR consent has to come
 * before the tracker, not after.
 *
 * So the loader is held until consent is "granted", and it reacts to the banner
 * in the same session rather than only on the next page load.
 *
 * Meta's <noscript> tracking image is deliberately NOT included. It cannot be
 * consent-gated: with JavaScript disabled there is no way to read a stored
 * choice, so it would fire for every visitor before they answered. It covers a
 * fraction of a percent of traffic and is not worth breaking the consent model
 * for.
 *
 * **Where the ID comes from.** `NEXT_PUBLIC_META_PIXEL_ID` when it is set.
 * Production does not set it today (it is in neither `.env.local.example` nor
 * the deploy notes), so the live site depends on the default below. The ID is
 * public by design, since it ships in the page source of every site that uses
 * one, so keeping a default costs nothing in secrecy.
 *
 * **What changed on 2026-10-13: it only fires on the live hostname.** The
 * default used to apply everywhere, so `npm run dev`, a preview build and any
 * local `next start` all reported PageViews and leads into the production
 * pixel. That pollutes the audience and, worse, the conversion data Meta
 * optimises campaigns against. Now the loader checks `location.hostname` and
 * does nothing anywhere else. To test the pixel locally, use Meta's Pixel
 * Helper against the live site, or set the variable to a test pixel and add
 * the host to `PIXEL_HOSTS`.
 */
const PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ||
  (process.env.NODE_ENV === "production" ? "1793281825039961" : undefined);

/** The only hostnames the pixel may fire on. www redirects to the apex, but it
 *  is listed in case a request is ever served before the redirect. */
const PIXEL_HOSTS = new Set(["bilalshafqat.com", "www.bilalshafqat.com"]);

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
    _fbq?: unknown;
  }
}

export default function MetaPixel() {
  const allowed = useConsent() === "granted";
  const loaded = useRef(false);
  const pathname = usePathname();

  // Inject the loader once, the first time consent allows it.
  useEffect(() => {
    if (!allowed || loaded.current || !PIXEL_ID) return;
    if (!PIXEL_HOSTS.has(window.location.hostname)) return;
    loaded.current = true;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    (function (f: any, b: Document, e: string, v: string) {
      if (f.fbq) return;
      const n: any = (f.fbq = function (...args: unknown[]) {
        if (n.callMethod) n.callMethod(...args);
        else n.queue.push(args);
      });
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      const t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      const s = b.getElementsByTagName(e)[0];
      s.parentNode?.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable @typescript-eslint/no-explicit-any */

    window.fbq?.("init", PIXEL_ID);
    window.fbq?.("track", "PageView");
  }, [allowed]);

  // This is a single-page app, so a route change never reloads the document and
  // Meta would otherwise record one PageView for a whole session. Skips the
  // first run, which the loader above already counted.
  const firstPath = useRef(true);
  useEffect(() => {
    if (!allowed || !loaded.current) return;
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname, allowed]);

  return null;
}
