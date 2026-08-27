"use client";

import Script from "next/script";
import { useEffect } from "react";
import { CONSENT_EVENT, getConsent } from "@/lib/consent";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

/**
 * Google Tag Manager with Consent Mode v2.
 *
 * Why GTM rather than GA4 directly: everything else (GA4, Meta pixel, LinkedIn,
 * TikTok, conversion tags) goes inside the container, so new tracking never needs
 * a code change or a redeploy.
 *
 * Consent approach: the container loads, but with every storage type defaulted to
 * "denied", so no cookies are written and no identifiers are sent until the visitor
 * accepts. This is Google's own documented pattern and it keeps conversion
 * modelling available for Google Ads, which a stricter "load nothing at all"
 * approach loses. To switch to strict instead, gate the <Script> below on
 * consent === "granted".
 *
 * Renders nothing when NEXT_PUBLIC_GTM_ID is unset, so the site works untouched
 * until a container ID exists.
 */
export default function Analytics() {
  useEffect(() => {
    if (!GTM_ID) return;

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
  }, []);

  if (!GTM_ID) return null;

  return (
    <>
      {/* Must run before the container so defaults are in place on first load. */}
      <Script id="consent-default" strategy="beforeInteractive">
        {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`}
      </Script>
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
    </>
  );
}
