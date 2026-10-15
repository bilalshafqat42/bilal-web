import type { Metadata } from "next";

/**
 * Site-wide constants, and the one helper every page uses for its metadata.
 *
 * **Why this exists.** The site URL was written out by hand in ten files, and
 * a hard-coded count of years in five. The first is the same problem `contact.ts` solved for the
 * email address. The second is worse: a hand-written count of years goes wrong
 * by itself every January, and nobody notices until a prospect does the sum.
 */

export const SITE_URL = "https://bilalshafqat.com";
export const SITE_NAME = "Bilal Shafqat";

/**
 * The site-wide share card. Defined here and re-exported by `ogImage.ts`, which
 * carries the reasoning (JPEG, absolute URL, 1200x630). It lives in this file
 * rather than there so `pageMetadata` can use it without the two modules
 * importing each other, which would leave `SITE_URL` undefined for whichever
 * one happened to load second.
 */
export const OG_IMAGE_URL = `${SITE_URL}/images/og-default.jpg`;

export const OG_IMAGES = [
  {
    url: OG_IMAGE_URL,
    width: 1200,
    height: 630,
    alt: "Bilal Shafqat, freelance digital marketer in Dubai: paid campaigns and the pages they land on",
  },
];

/**
 * The year the years-of-experience count starts from.
 *
 * 2009, the first role on the CV (Vitalsouls). Confirmed by Bilal on
 * 2026-10-13; until then the site carried a hand-written, lower count. Every page reads this.
 */
export const CAREER_START_YEAR = 2009;

/**
 * The year the site was built, inlined by `next.config.ts` as
 * `NEXT_PUBLIC_BUILD_YEAR`.
 *
 * Read from the build rather than from `new Date()` at render time because two
 * of the components that show the count are client components. A static page
 * built in December and hydrated in January would compute two different numbers
 * on server and client, and React would report a hydration mismatch. One build,
 * one number, on both sides.
 */
const BUILD_YEAR = Number(process.env.NEXT_PUBLIC_BUILD_YEAR) || new Date().getFullYear();

/** Whole years since `CAREER_START_YEAR`, as of the build. */
export function yearsExperience(): number {
  return BUILD_YEAR - CAREER_START_YEAR;
}

/**
 * The positioning line, in one place. The site sells a digital marketer who
 * also builds what the campaign lands on: development and design are how the
 * work gets done, not the headline identity (roadmap 397, "One positioning,
 * everywhere"). Every profile and every machine-readable summary uses this.
 */
export const POSITIONING =
  "Digital marketer in Dubai. I run the campaign and build the page it lands on.";

/** The homepage's title and description. The layout uses them as the default
 *  for every route, and the homepage restates them with its own `og:url`. */
export const HOME_TITLE = "Freelance Digital Marketer in Dubai | Bilal Shafqat";
export const HOME_DESCRIPTION =
  "Freelance digital marketer in Dubai. I run your paid ads, SEO and social, and build the page each campaign lands on, as one senior partner.";

/** The /blog index's title and description, shared with the paginated pages
 *  so the two cannot drift. Rewritten 2026-10-14: the old line led with React
 *  hooks, which no longer describes a blog that opens with Dubai marketing
 *  articles. Pages 2 onward add their number to both, so no two match. */
export const BLOG_TITLE = "Writing: Digital Marketing in Dubai, Design and Development";
export const BLOG_DESCRIPTION =
  "Digital marketing notes for Dubai businesses: ad budgets, Google versus Meta, SEO and lead quality, plus older design and development notes.";
export const blogPagedTitle = (page: number) =>
  `Writing on Digital Marketing in Dubai, Page ${page}`;
export const blogPagedDescription = (page: number) =>
  `Page ${page} of the archive. Digital marketing notes for Dubai businesses, plus older notes on design, React and web development, written from client work.`;

/**
 * Title, description, canonical, Open Graph and Twitter card for one page.
 *
 * **Why a helper.** Next replaces `openGraph` and `twitter` wholesale when a
 * route declares them, and inherits them whole when it does not. So eight pages
 * that set only `title` and `description` were sharing with the *homepage's*
 * og:title and twitter:title, and no page carried an `og:url` at all. A link to
 * /contact pasted into WhatsApp previewed as the homepage. Building all four
 * from the same three inputs makes that mismatch impossible to write.
 *
 * `title` is used as given. There is no title template on this site, so what
 * is passed here is exactly what appears in the tab and the search result.
 */
export function pageMetadata(opts: {
  title: string;
  description: string;
  /** Path from the site root, with a leading slash: "/about", or "/" for home. */
  path: string;
  /** Absolute image URL. Defaults to the site-wide card in `ogImage.ts`. */
  image?: { url: string; width?: number; height?: number; alt?: string };
  /** Overrides for the share card only, when it should read differently. */
  ogTitle?: string;
  ogDescription?: string;
}): Metadata {
  const images = opts.image ? [opts.image] : OG_IMAGES;
  const ogTitle = opts.ogTitle ?? opts.title;
  const ogDescription = opts.ogDescription ?? opts.description;
  return {
    title: opts.title,
    description: opts.description,
    // Next replaces `alternates` whole, so a page that sets its own canonical
    // loses the layout's RSS link unless it is repeated here.
    alternates: {
      canonical: opts.path,
      types: { "application/rss+xml": [{ url: "/rss.xml", title: `${SITE_NAME}: Writing` }] },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: opts.path,
      siteName: SITE_NAME,
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: images.map((i) => i.url),
    },
  };
}
