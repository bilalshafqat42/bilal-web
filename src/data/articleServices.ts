import { megaMenuGroups } from "@/data/pillars";
import type { BlogPost } from "@/data/blogPosts";

/**
 * Which service each recovered article should point a reader at.
 *
 * The problem this solves, measured from Search Console on 2026-09-30: the 13
 * article pages that earn impressions earn 6,933 of them between them, and the
 * commercial pages earn almost none. The articles are where the audience is.
 * Until now the only route off an article was `/appointment` and a block of
 * copy reading "I build the web and mobile products these notes come out of" —
 * which is true of the React posts and simply wrong on an article about UI/UX
 * design websites or Figma plugins. A reader who had just been told about icon
 * libraries was being asked whether they needed a product built.
 *
 * So the route off an article is now the service the article is actually about,
 * and the copy is written per service rather than once for all 52.
 *
 * Driven from `post.tags`, which the articles already carry, rather than a
 * hand-maintained slug list: a slug list would need an edit every time a post
 * is added and would silently miss it when nobody remembered. Tags were set in
 * WordPress by the person who wrote the posts, so they describe the subject
 * better than anything we would infer from the title.
 */

/** Tags in priority order. First match wins, so a post tagged both "Figma" and
 *  "UI UX Design" resolves the same way regardless of tag order, and the React
 *  posts tagged "Javascript" as well resolve to development rather than
 *  flapping between the two.
 *
 *  Priority matters most where the two lists overlap: "CSS" and "Flexbox" sit
 *  under development rather than design because the posts carrying them are
 *  about writing the CSS, not about the visual decision behind it. */
const TAG_ROUTES: { service: string; tags: string[] }[] = [
  {
    service: "ui-ux-design",
    tags: ["UI UX Design", "Figma", "Design"],
  },
  {
    service: "website-app-development",
    tags: [
      "React Js",
      "React Hooks",
      "Redux",
      "Node JS",
      "Typescript",
      "Javascript",
      "Es6",
      "CSS",
      "Flexbox",
    ],
  },
  {
    service: "digital-marketing",
    tags: ["Seo"],
  },
];

/** The pitch, per service.
 *
 *  Written to follow the article rather than to sell over the top of it. A
 *  reader who has just finished a 500-word explainer has not asked to be sold
 *  to, so each one names the work plainly and says what a first conversation
 *  costs, which is nothing.
 *
 *  `eyebrow` and `heading` stay short because they render inside a centred
 *  panel at `t-h2`; `body` carries the specifics. */
type Pitch = { eyebrow: string; heading: string; accent: string; body: string };

const PITCHES: Record<string, Pitch> = {
  "ui-ux-design": {
    eyebrow: "Design work",
    heading: "Want this",
    accent: "designed properly?",
    body:
      "Reading about good interface design is the easy part. I design the websites, apps and product interfaces these notes come out of, working directly with you rather than through an account manager.",
  },
  "website-app-development": {
    eyebrow: "Build work",
    heading: "Need this",
    accent: "built properly?",
    body:
      "I build the web and mobile products these notes come out of, in React, React Native and Node. A first conversation costs nothing and often ends with a smaller scope than you expected.",
  },
  "digital-marketing": {
    eyebrow: "Growth work",
    heading: "Want people to",
    accent: "actually find it?",
    body:
      "A site nobody reaches is a site nobody buys from. I handle the search, content and outreach side of getting a business found, measured against enquiries rather than impressions.",
  },
};

/** The fallback, for the handful of posts whose tags name a tool rather than a
 *  discipline: "AI", "ChatGPT", "DeepSeek", "Tools". Pointing those at a
 *  specific service would be a guess, so they go to the hub, which is a real
 *  destination listing all nine. */
const FALLBACK = {
  href: "/services",
  label: "all services",
  pitch: {
    eyebrow: "Working together",
    heading: "Got a project",
    accent: "in mind?",
    body:
      "Marketing, design and development under one roof, run by one person rather than handed between three. A first conversation costs nothing and often ends with a smaller scope than you expected.",
  } satisfies Pitch,
};

export type ArticleService = {
  /** The service page to link to. */
  href: string;
  /** How the service is named in the link, e.g. "UI/UX Design". */
  label: string;
  pitch: Pitch;
};

/**
 * Resolve an article to the service it should send a reader to.
 *
 * Never returns undefined: an article with no matching tag resolves to the
 * services hub. A dead end is the thing this module exists to remove, so
 * falling back to nothing would defeat it.
 */
export function serviceForArticle(post: BlogPost): ArticleService {
  for (const route of TAG_ROUTES) {
    if (!post.tags.some((t) => route.tags.includes(t))) continue;
    // Read the label from the menu data rather than restating it here. The
    // group titles are what the nav, /services and llms.txt already use, so a
    // rename lands in one place instead of drifting out of step the way the
    // "eight services" copy did.
    const group = megaMenuGroups.find((g) => g.slug === route.service);
    if (!group) continue;
    return {
      href: `/services/${group.slug}`,
      label: group.title,
      pitch: PITCHES[route.service] ?? FALLBACK.pitch,
    };
  }
  return { href: FALLBACK.href, label: FALLBACK.label, pitch: FALLBACK.pitch };
}
