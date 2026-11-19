import { categoryAncestors, isInServiceMenu } from "@/data/serviceCategories";

/**
 * The free-consultation call to action, worded for the service a page is about.
 *
 * Added 2026-11-17. Bilal asked for every booking button to name its service:
 * a website page offers a free website consultation, a digital marketing page a
 * free digital marketing consultation. Every page said "Book a free
 * consultation", which tells the visitor nothing about what the call is for.
 *
 * The link carries `?service=<menu slug>`, and /appointment pre-selects that
 * service in "What is it about?", so nobody has to restate what they came for.
 * Pages that are not in the Services menu (the platform pages) book under the
 * menu page above them, because the booking dropdown lists menu pages only.
 *
 * One place for the wording, so the service pages, the portfolio discipline
 * pages and the case studies cannot drift apart.
 */

/** What the call is about, as it reads after "Book a free". Kept short so the
 *  button fits one line on a phone. Sub-pages missing here use their parent's. */
const TOPIC: Record<string, string> = {
  "paid-marketing": "paid ads",
  "google-ads": "Google Ads",
  "facebook-ads": "Meta ads",
  "linkedin-marketing": "LinkedIn marketing",
  "social-media-marketing": "social media",
  "digital-marketing": "digital marketing",
  "website-app-development": "website and app",
  "cms-development": "website",
  "custom-web-development": "website",
  "mobile-app-development": "app",
  "ui-ux-design": "UI/UX design",
  "web-design": "website design",
  "graphic-design-branding": "branding",
  "crm-marketing-automation": "CRM",
  seo: "SEO",
  "email-marketing": "email marketing",
  "whatsapp-marketing": "WhatsApp marketing",
  "marketing-automation": "automation",
  "video-conversion": "video",
  "wordpress-development": "WordPress",
  "wix-development": "Wix",
  "squarespace-development": "Squarespace",
  "strapi-development": "Strapi",
  "ios-app-development": "iOS app",
  "android-app-development": "Android app",
  "react-native-development": "app",
  "figma-design": "design",
  "zoho-crm-integration": "Zoho CRM",
  "hubspot-integration": "HubSpot",
  "salesforce-integration": "Salesforce",
};

/** The topic for a service slug, falling back to the nearest page above it. */
export function consultTopic(slug: string): string {
  if (TOPIC[slug]) return TOPIC[slug];
  const parent = categoryAncestors(slug)
    .reverse()
    .find((a) => TOPIC[a.slug]);
  return parent ? TOPIC[parent.slug] : "digital marketing";
}

/** "Book a free SEO consultation". */
export function consultLabel(slug: string): string {
  return `Book a free ${consultTopic(slug)} consultation`;
}

/** /appointment with the service pre-selected: the page itself when it is in
 *  the menu, otherwise the nearest menu page above it. */
export function bookingHref(slug: string): string {
  const menuSlug = isInServiceMenu(slug)
    ? slug
    : categoryAncestors(slug)
        .reverse()
        .find((a) => isInServiceMenu(a.slug))?.slug;
  return menuSlug ? `/appointment?service=${menuSlug}` : "/appointment";
}
