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
  /** A small sub-label rendered above this entry (see `ServiceMenuColumn`). */
  subLabel?: string;
};

export type MenuColumn = { title: string; services: MenuService[] };

/**
 * The Services menu, as numbered columns of real pages (three since
 * 2026-10-24; see `serviceMenuColumns`).
 *
 * Rebuilt 2026-10-06. The menu was fifteen flat groups, each with three to five
 * sub-items, and the sub-items were the problem: **49 entries carrying 31
 * unique labels.** "Lead Generation" appeared four times, "Demand Generation"
 * three, and ten more twice each. None of them led anywhere of their own, they
 * were anchors into a section of the parent page, so a reader comparing two
 * columns saw the same phrases and learned nothing from the repetition.
 *
 * All fifteen service pages are real and live. They are what belongs in a menu.
 * So the hierarchy is now three groups of real pages rather than fifteen groups
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
 * The columns are uneven, 8 / 4 / 5, and that is honest. Marketing is the
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
  /** Optional small sub-label shown above one slug inside the column, so a
   *  long column can name its second half without becoming a column of its
   *  own. Keyed by the slug it sits above. */
  subLabels?: Record<string, string>;
};

/**
 * Three columns since 2026-10-24, at Bilal's request: the site sells three
 * disciplines (the homepage ledger reads 01 Marketing, 02 Design,
 * 03 Development) and the menu and footer now say the same thing in the same
 * order. Until then Paid Marketing was a fourth column of its own and Design
 * sat last, so the header, the footer and the homepage disagreed.
 *
 * Paid is folded back into Marketing with a small "Paid" sub-label above it.
 * That keeps the split visible, which was the reason it was a column (a reader
 * cannot infer a split from position alone), without presenting it as a
 * fourth discipline.
 *
 * Menu only. The set of slugs is unchanged, so `isInServiceMenu()`,
 * `menuGroups()`, breadcrumbs, schema and every service page are unaffected;
 * only the header panel, the mobile drawer and the footer read the grouping.
 */
export const serviceMenuColumns: ServiceMenuColumn[] = [
  {
    // Earned first, paid second: Paid Marketing is a child of Digital
    // Marketing (Bilal, 2026-10-06), so broad reads before narrow, and
    // "digital marketing in dubai" stays first in source order sitewide.
    title: "Marketing",
    slugs: [
      "digital-marketing",
      "seo",
      "social-media-marketing",
      "email-marketing",
      "paid-marketing",
      "google-ads",
      "facebook-ads",
      "linkedin-marketing",
    ],
    subLabels: { "paid-marketing": "Paid" },
  },
  {
    // Web Design sits here rather than under Development. Its own page opens
    // "most of the design decisions that matter here are not visual ones",
    // which is a design argument, and a visitor looking for a web designer is
    // not looking for a developer.
    title: "Design",
    slugs: ["ui-ux-design", "web-design", "graphic-design-branding", "video-conversion"],
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
];

export const accentClasses: Record<Accent, { icon: string; bg: string; dot: string; glow: string }> = {
  gold: { icon: "text-gold", bg: "from-gold/25 to-gold-2/10", dot: "bg-gold", glow: "bg-gold/25" },
  violet: { icon: "text-violet", bg: "from-violet/25 to-violet/10", dot: "bg-violet", glow: "bg-violet/25" },
  cyan: { icon: "text-cyan", bg: "from-cyan/25 to-cyan/10", dot: "bg-cyan", glow: "bg-cyan/25" },
};
