/**
 * The free website and marketing health check (/free-website-health-check).
 *
 * Copy lives here rather than in the page so the site search, llms.txt and the
 * page all describe the same ten checks in the same words.
 *
 * Every line is something that can be checked from outside, with public tools
 * and a browser, without a login. Where a point can only be partly confirmed
 * from outside (backups, whether a lead reaches a CRM), the copy says so
 * rather than implying more than the check can see. No turnaround is promised
 * beyond the site's usual "usually within one working day" reply.
 */
import type { Faq } from "@/data/types";

export const HEALTH_CHECK_PATH = "/free-website-health-check";

/** Name of the offer as it appears in links around the site. */
export const HEALTH_CHECK_LABEL = "Free website health check";

export type HealthCheckPoint = {
  /** Short name of the check: the card heading. */
  title: string;
  /** What is checked, in one or two plain sentences. */
  body: string;
};

export const HEALTH_CHECK_POINTS: HealthCheckPoint[] = [
  {
    title: "Speed on a phone",
    body: "How quickly your main pages load on a mobile connection, measured with Google's PageSpeed Insights, and the one or two things slowing them down most.",
  },
  {
    title: "The main call to action",
    body: "Whether someone on a phone can see what you offer and how to contact you without scrolling, and whether the button says what happens next.",
  },
  {
    title: "The contact form",
    body: "Whether the form submits and confirms properly. I send one test enquiry, clearly labelled as a test, so you can see whether it reaches a CRM or only an inbox.",
  },
  {
    title: "Tracking and key events",
    body: "Whether Google Analytics 4, Google Tag Manager and the Meta Pixel load, and whether a form submission is recorded as a key event or conversion, checked in the browser as the tags fire.",
  },
  {
    title: "Consent banner",
    body: "Whether there is a cookie consent banner, and whether tracking waits for an answer or fires before the visitor has chosen. A technical check, not legal advice.",
  },
  {
    title: "Google Business Profile",
    body: "Whether your business has a profile on Google Maps, whether its name, phone, hours and website link match the site, and whether reviews get a reply.",
  },
  {
    title: "Page titles and descriptions",
    body: "How your main pages appear in a Google result: a title and description on each, no duplicates, and nothing cut off before the point is made.",
  },
  {
    title: "Readable by AI search",
    body: "Whether ChatGPT, Perplexity, Copilot and Google's AI answers can read your pages: the text is in the page rather than only in images, and robots.txt is not blocking them.",
  },
  {
    title: "Ads and their landing pages",
    body: "If you run Google or Meta ads, whether the page each ad opens says what the ad promised. I use the public Google Ads Transparency Center and Meta Ad Library, so no ad account access.",
  },
  {
    title: "Security basics",
    body: "HTTPS with a valid certificate, and http redirecting to it. On WordPress, an outdated WordPress or PHP version where the site reveals one. Backups cannot be seen from outside, so you get the questions to ask your host.",
  },
];

export const HEALTH_CHECK_FAQS: Faq[] = [
  {
    question: "Is the health check really free?",
    answer:
      "Yes. There is nothing to pay and no card to enter. It is a short review of ten points, not the paid review session listed on the pricing page, and it is written to be useful on its own.",
  },
  {
    question: "Do I have to hire you afterwards?",
    answer:
      "No. The fixes are written so you, or whoever looks after your site, can act on them. If you would like me to do them, ask and I will quote. If not, that is the end of it, and you are not added to a mailing list.",
  },
  {
    question: "What do you need from me?",
    answer:
      "Your website address and an email address to send the summary to. Your main goal helps me put the fixes in the right order, and if you run ads, say so. I send one test enquiry through your form, labelled as a test; if you would rather I did not, say so in the message box.",
  },
  {
    question: "Do you need logins or access to my accounts?",
    answer:
      "No. Every check is done from the outside, the way a visitor, Google or an AI assistant sees your site. No passwords, no admin access, and no access to Google Analytics or your ad accounts. A few things can only be confirmed from inside, and the summary says which.",
  },
  {
    question: "Is this a full SEO audit?",
    answer:
      "No. It is ten points across the site, its tracking and its ads, checked at a glance. A full SEO review, with keywords, content and links, is part of the SEO service.",
  },
  {
    question: "Is it an automated report?",
    answer:
      "No. I go through the site myself, using public tools such as Google PageSpeed Insights alongside a browser, and write the summary by hand. You get the few fixes that matter most, not forty pages of warnings.",
  },
];

/** One paragraph for the site search and llms.txt. */
export const HEALTH_CHECK_SUMMARY =
  "A free 10-point review of a business website, its tracking and its ads, checked from the outside with no logins: speed on a phone, the main call to action, the contact form and whether it reaches a CRM, GA4 and Meta Pixel key events, the consent banner, the Google Business Profile, page titles and descriptions, whether AI search can read the pages, whether ad landing pages match their ads, and security basics such as HTTPS and WordPress versions. The result is a short written summary of the top fixes, by email.";
