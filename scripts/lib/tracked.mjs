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
  ["/services/website-app-development", "web developer dubai"],
  ["/services/mobile-app-development", "mobile app development dubai"],
  ["/services/crm-marketing-automation", "crm consultant dubai"],
  ["/services/ui-ux-design", "ui ux designer dubai"],
  ["/services/web-design", "web designer dubai"],
  ["/services/graphic-design-branding", "graphic design in dubai"],
  ["/services/video-conversion", "video editor dubai"],
  ["/pricing", "freelance digital marketer costs in dubai"],
];
