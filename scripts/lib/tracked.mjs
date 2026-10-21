/**
 * The pages worth measuring daily, with the keyword each is built for.
 *
 * Lives here rather than inside `daily.mjs` so `onpage-check.mjs` can fall back
 * to it when run with no arguments. Before this, `npm run onpage` printed a
 * usage line and exited, which is a poor answer to somebody who just wants to
 * know where the site stands.
 *
 * Two deliberate omissions and why:
 *
 *   - **`google ads agency dubai`** (390 searches, difficulty 9) is the biggest
 *     term in that cluster and is not claimable. One person is not an agency,
 *     and the site does not say it is. `google ads dubai` is the honest target.
 *   - **`/portfolio`, `/about`, `/faq`, `/contact`** are conversion pages, not
 *     keyword pages. Scoring `/faq` against a head term reports 21 forever, and
 *     forcing a keyword in would put it in competition with the homepage, which
 *     already scores 100 for that exact phrase.
 */
export const TRACKED = [
  ["/", "freelance digital marketer in dubai"],
  ["/services/digital-marketing", "digital marketing in dubai"],
  ["/services/seo", "seo consultant dubai"],
  ["/services/social-media-marketing", "social media marketing in dubai"],
  ["/services/email-marketing", "email marketing dubai"],
  ["/services/paid-marketing", "paid marketing dubai"],
  ["/services/google-ads", "google ads dubai"],
  ["/services/facebook-ads", "facebook ads dubai"],
  ["/services/linkedin-marketing", "linkedin marketing dubai"],
  // Retargeted 2026-10-16 from "web developer dubai" at Bilal's request.
  ["/services/website-app-development", "web development dubai"],
  // Added 2026-10-16. Volumes for these six were not measured before they
  // shipped (no Ubersuggest check in hand); they are tracked so the daily
  // report shows whether any of them earns impressions.
  ["/services/cms-development", "cms development dubai"],
  ["/services/wordpress-development", "wordpress developer dubai"],
  ["/services/wix-development", "wix developer dubai"],
  ["/services/squarespace-development", "squarespace developer dubai"],
  ["/services/strapi-development", "strapi developer dubai"],
  // 2026-10-19: retitled off the hub's "web development in Dubai".
  ["/services/custom-web-development", "custom web application development dubai"],
  ["/services/mobile-app-development", "mobile app development dubai"],
  // Added 2026-10-16, unmeasured like the six above. iOS and Android moved
  // the same day from "<platform> app development dubai" to "<platform> app
  // developer dubai", so they stop competing with the mobile hub. "android
  // app development dubai" (260 searches on the 2026-10-02 board) is now a
  // section heading on the hub. Zoho moved from "zoho crm integration dubai"
  // to "zoho crm consultant dubai" for the same reason against the CRM
  // integration hub.
  ["/services/react-native-development", "react native developer dubai"],
  // 2026-10-19: "app developer" dropped so neither contains "app developer
  // dubai". "mobile app developer dubai" is owned by the article
  // /how-to-choose-a-mobile-app-developer-in-dubai (roadmap 414), not the
  // mobile hub, which keeps "mobile app development dubai".
  ["/services/ios-app-development", "ios developer dubai"],
  ["/services/android-app-development", "android developer dubai"],
  ["/services/app-backend-development", "app back end development dubai"],
  ["/services/crm-marketing-automation", "crm consultant dubai"],
  ["/services/crm-integration", "crm integration dubai"],
  // 2026-10-19: "consultant" left to /services/crm-marketing-automation.
  ["/services/zoho-crm-integration", "zoho crm implementation dubai"],
  ["/services/hubspot-integration", "hubspot integration dubai"],
  ["/services/salesforce-integration", "salesforce integration dubai"],
  ["/services/custom-crm-development", "custom crm development dubai"],
  ["/services/ui-ux-design", "ui ux designer dubai"],
  ["/services/web-design", "web designer dubai"],
  ["/services/figma-design", "figma designer dubai"],
  ["/services/graphic-design-branding", "graphic designer in dubai"],
  ["/services/video-conversion", "video editor dubai"],
  ["/pricing", "freelance digital marketer costs in dubai"],
];
