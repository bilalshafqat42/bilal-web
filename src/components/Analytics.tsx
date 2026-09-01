"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_EVENT, getConsent } from "@/lib/consent";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

/**
 * Google Analytics 4, with Google Tag Manager as an optional alternative.
 *
 * GA4 is loaded directly rather than through a container. GTM is a convenience
 * layer for adding and removing tags without a deploy, which is worth having on
 * a team and not worth ~100KB for one tag on a one-person site. Set
 * NEXT_PUBLIC_GTM_ID instead of NEXT_PUBLIC_GA4_ID if that ever changes; if both
 * are set, GTM wins and is expected to own the GA4 tag itself.
 *
 * Consent Mode v2 applies either way. Every storage type defaults to "denied"
 * before anything loads, so no cookies are written and no identifiers are sent
 * until the visitor accepts. This is Google's documented pattern, and it keeps
 * conversion modelling available, which a "load nothing at all" approach loses.
 *
 * Renders nothing when neither ID is set, so the site works untouched until one
 * exists.
 */
export default function Analytics() {
  const enabled = Boolean(GA4_ID || GTM_ID);
  const pathname = usePathname();
  const first = useRef(true);

  // GA4 records one page_view per document load, so client-side navigation is
  // invisible to it without this. The first run is skipped because
  // gtag('config') already counted it.
  useEffect(() => {
    if (!GA4_ID || GTM_ID) return;
    if (first.current) {
      first.current = false;
      return;
    }
    // Query string read from `window` rather than useSearchParams, which forces
    // every page into a Suspense boundary and broke prerendering when this
    // component sits in the root layout.
    window.gtag?.("event", "page_view", {
      page_path: window.location.pathname + window.location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  useEffect(() => {
    if (!enabled) return;

    const apply = (value: string | null) => {
      window.dataLayer = window.dataLayer || [];
      // gtag's own signature relies on `arguments`, so push the array form.
      window.dataLayer.push([
        "consent",
        "update",
        {
          ad_storage: value === "granted" ? "granted" : "denied",
          ad_user_data: value === "granted" ? "granted" : "denied",
          ad_personalization: value === "granted" ? "granted" : "denied",
          analytics_storage: value === "granted" ? "granted" : "denied",
        },
      ]);
    };

    apply(getConsent());
    const onChange = (e: Event) => apply((e as CustomEvent<string>).detail);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Must run before anything else so the defaults are in place on first
          load, otherwise a tag can fire once before consent is known. */}
      <Script id="consent-default" strategy="beforeInteractive">
        {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`}
      </Script>

      {GTM_ID ? (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      ) : (
        <>
          <Script
            id="ga4-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`gtag('js', new Date());
gtag('config', '${GA4_ID}', { send_page_view: true });`}
          </Script>
        </>
      )}
    </>
  );
}
