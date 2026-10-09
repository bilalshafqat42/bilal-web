/**
 * The one place the contact details live.
 *
 * **Why this exists.** On 2026-10-09 the address changed from a Gmail account
 * to `bilal@bilalshafqat.com`, and it was written out by hand in **twelve**
 * files: the footer, the contact page, the privacy page, the lead popup, the
 * contact form, two schema nodes, `llms.txt`, `siteContent`, `searchIndex` and
 * the Contact component. Twelve chances for one to be missed, and the one that
 * is missed is the one a prospect emails.
 *
 * Same reasoning as the design system and the SEO scorer: a value used in more
 * than two places belongs in one file.
 */

/** The address published everywhere. A domain address, not a free mailbox:
 *  a Gmail address on a site quoting AED 31,500 projects undercuts the quote. */
export const SITE_EMAIL = "bilal@bilalshafqat.com";

/** Primary number. Also the WhatsApp number. */
export const SITE_PHONE = "+971 52 976 6006";

/** `tel:` form, no spaces. */
export const SITE_PHONE_HREF = "+971529766006";
