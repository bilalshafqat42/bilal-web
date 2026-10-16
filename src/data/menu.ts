import type { Accent } from "./types";

/**
 * The Services menu, without the copy behind it.
 *
 * Split out of `pillars.ts` on 2026-10-13. The header is a client component, and
 * it used to import `megaMenuGroups` directly, which put every service page's
 * headline, intro, meta tags and FAQs into the JavaScript every visitor
 * downloads, for a menu that reads a title and a colour.
 *
 * **Nothing in this file may import page copy.** Client components import it.
 * The menu entries themselves are built on the server by `buildServiceMenu()`
 * in `serviceCategories.ts`, from the same `megaMenuGroups` the service pages
 * render, and handed to the header as props. Titles are never written twice.
 */

export type MenuService = {
  slug: string;
  title: string;
  accent: Accent;
  /** The first sentence of the service page's intro, for the preview rail. */
  summary: string;
  /** The first three section titles on the page, for the preview rail. */
  points: string[];
  /** See `MegaMenuGroup.railTimeline`. Absent where nothing is published. */
  timeline?: string;
};

export type MenuColumn = { title: string; services: MenuService[] };

/**
 * The Services menu, as four numbered columns of real pages.
 *
 * Rebuilt 2026-10-06. The menu was fifteen flat groups, each with three to five
 * sub-items, and the sub-items were the problem: **49 entries carrying 31
 * unique labels.** "Lead Generation" appeared four times, "Demand Generation"
 * three, and ten more twice each. None of them led anywhere of their own, they
 * were anchors into a section of the parent page, so a reader comparing two
 * columns saw the same phrases and learned nothing from the repetition.
 *
 * All fifteen service pages are real and live. They are what belongs in a menu.
 * So the hierarchy is now four groups of real pages rather than fifteen groups
 * of repeated tags, which is both shorter to read and honest about the shape of
 * the business.
 *
 * Grouped by discipline, at Bilal's suggestion and over my own first attempt.
 * Mine split marketing into "Paid Advertising" and "Marketing & Growth", which
 * is a practitioner's distinction: somebody who wants Google Ads reads
 * "Marketing" and would not necessarily look in a separate paid column for it.
 * Three disciplines is also what he actually sells, and the menu should say
 * what the business is rather than how a specialist files it.
 *
 * The columns are uneven, 8 / 4 / 3, and that is honest. Marketing is the
 * positioning and it carries the volume. Padding the other two to match would
 * mean inventing services.
 *
 * Deliberately not derived from `pillars`. Those four describe how the work is
 * delivered and exist for the pillar pages; these three describe what somebody
 * is looking for when they open a menu.
 */
export type ServiceMenuColumn = {
  /** Shown as 01, 02, 03. */
  title: string;
  /** Slugs from `megaMenuGroups`, in the order they should read. */
  slugs: string[];
};

export const serviceMenuColumns: ServiceMenuColumn[] = [
  {
    // Marketing and Paid Marketing are two named columns rather than one
    // eight-item column split across two unlabelled tracks.
    //
    // The old version used `span: 2` and `grid-flow-col` to make eight items
    // read down one track and then down the next. The grouping was real — paid
    // in one track, earned in the other — but nothing on screen said so, and a
    // reader cannot infer a split from position alone. Naming both halves costs
    // one heading and removes the guess.
    //
    // Marketing sits first, Paid second, for three reasons:
    //   1. Hierarchy. Paid Marketing is a child of Digital Marketing, which is
    //      the conclusion Bilal reached himself on 2026-10-06. Left to right
    //      should read broad then narrow.
    //   2. Search. "digital marketing in dubai" is 1,300 searches, the largest
    //      term on the board, and this puts its page first in source order on
    //      every page of the site.
    //   3. Journey. Somebody who already knows they want Google Ads will find
    //      "Google Ads" wherever it sits. Somebody who does not know what they
    //      want needs the general bucket in front of the specific one.
    //
    // Each column leads with its own hub page, so the broadest page in a group
    // is the first thing read in it.
    title: "Marketing",
    slugs: ["digital-marketing", "seo", "social-media-marketing", "email-marketing"],
  },
  {
    title: "Paid Marketing",
    slugs: ["paid-marketing", "google-ads", "facebook-ads", "linkedin-marketing"],
  },
  {
    // CRM belongs here rather than under Marketing: the page is about systems,
    // integrations and server-side tracking, and the person who needs it is
    // asking a technical question.
    //
    // CMS Development and Custom Web Development added 2026-10-16, second and
    // third: they are the two halves of the web decision the column opens on.
    // The four platform pages under CMS Development (WordPress, Wix,
    // Squarespace, Strapi) are deliberately not here. They are reached from
    // the CMS hub and the footer; four tool names in the menu would make it
    // longer without adding a decision a visitor makes from a menu.
    title: "Development",
    slugs: [
      "website-app-development",
      "cms-development",
      "custom-web-development",
      "mobile-app-development",
      "crm-marketing-automation",
    ],
  },
  {
    // Web Design sits here rather than under Development. Its own page opens
    // "most of the design decisions that matter here are not visual ones",
    // which is a design argument, and a visitor looking for a web designer is
    // not looking for a developer.
    title: "Design",
    slugs: ["ui-ux-design", "web-design", "graphic-design-branding", "video-conversion"],
  },
];

export const accentClasses: Record<Accent, { icon: string; bg: string; dot: string; glow: string }> = {
  gold: { icon: "text-gold", bg: "from-gold/25 to-gold-2/10", dot: "bg-gold", glow: "bg-gold/25" },
  violet: { icon: "text-violet", bg: "from-violet/25 to-violet/10", dot: "bg-violet", glow: "bg-violet/25" },
  cyan: { icon: "text-cyan", bg: "from-cyan/25 to-cyan/10", dot: "bg-cyan", glow: "bg-cyan/25" },
};
