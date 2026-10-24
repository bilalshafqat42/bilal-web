/**
 * Every published case-study URL, in a module small enough to import anywhere.
 *
 * **Why this is not in `caseStudies.ts`.** That file is over 1,300 lines of
 * copy, captures and alt text. `home.ts` needs one number from it (how many
 * case studies are published) and `home.ts` is imported by client components
 * such as `AboutSplit`, so importing `caseStudies.ts` there put every case
 * study's data in the browser bundle to compute a count. Split out on
 * 2026-10-14.
 *
 * **One source of truth.** This manifest is what lists, counts and the sitemap
 * read. `caseStudies.ts` imports it and checks, when it loads, that the URLs its
 * own published data produces are exactly these, in this order, and throws if
 * they are not. So publishing a client, adding a project or renaming a slug
 * fails the build until this list says the same thing. Nothing can drift
 * silently.
 *
 * Do not import `caseStudies.ts` from here: that would undo the split.
 */

type PublishedCaseStudy = {
  /** The client's slug, `/portfolio/<client>`. */
  client: string;
  /** Whether `/portfolio/<client>/mobile-app` exists. */
  mobileApp: boolean;
  /** Project slugs, in the order `caseStudies.ts` lists them. */
  projects: readonly string[];
};

export const PUBLISHED_CASE_STUDIES: readonly PublishedCaseStudy[] = [
  {
    client: "leos-developments",
    mobileApp: true,
    projects: [
      "cavendish-square",
      "hadley-heights",
      "sales-app",
      "weybridge-gardens",
      "weybridge-gardens-2",
    ],
  },
  // A single-page case study: no app page and no projects under it, so the
  // overview is the case study (see `caseStudyCount`).
  { client: "texdale", mobileApp: false, projects: [] },
];

/** Every case-study URL, for the sitemap: each client overview, its mobile app
 *  page where there is one, and each project. */
export function caseStudyUrls(): string[] {
  return PUBLISHED_CASE_STUDIES.flatMap((c) => [
    `/portfolio/${c.client}`,
    ...(c.mobileApp ? [`/portfolio/${c.client}/mobile-app`] : []),
    ...c.projects.map((p) => `/portfolio/${c.client}/${p}`),
  ]);
}

/** The figure the homepage quotes.
 *
 *  A client with pages under it (projects, an app page) counts those pages and
 *  not its overview, which is a hub onto them: LEOS is six case studies, not
 *  seven. A client with nothing under it is a single-page case study and
 *  counts once. Before Texdale (2026-10-24) every published client had
 *  sub-pages, and counting only those would have left Texdale out of the
 *  number entirely. */
export function caseStudyCount(): number {
  return PUBLISHED_CASE_STUDIES.reduce((n, c) => {
    const below = c.projects.length + (c.mobileApp ? 1 : 0);
    return n + (below > 0 ? below : 1);
  }, 0);
}
