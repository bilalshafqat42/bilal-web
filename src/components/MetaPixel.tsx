"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_EVENT, getConsent } from "@/lib/consent";

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
 * The pixel ID is public by design — it ships in the page source of every site
 * that uses one — so it lives here rather than in an env var. Override with
 * NEXT_PUBLIC_META_PIXEL_ID if it ever needs to change per environment.
 */
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1793281825039961";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
    _fbq?: unknown;
  }
}

export default function MetaPixel() {
  const [allowed, setAllowed] = useState(false);
  const loaded = useRef(false);
  const pathname = usePathname();

  // Watch consent, both the stored answer and a change made this session.
  useEffect(() => {
    setAllowed(getConsent() === "granted");
    const onChange = (e: Event) =>
      setAllowed((e as CustomEvent<string>).detail === "granted");
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  // Inject the loader once, the first time consent allows it.
  useEffect(() => {
    if (!allowed || loaded.current || !PIXEL_ID) return;
    loaded.current = true;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    (function (f: any, b: Document, e: string, v: string) {
      if (f.fbq) return;
      const n: any = (f.fbq = function (...args: unknown[]) {
        n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
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
