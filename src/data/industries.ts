/**
 * Industries Bilal has worked in, with the companies behind each.
 *
 * Added 2026-10-19 from Bilal's own list. Shown on /about and, as sector
 * names only, in the footer. Plain text, not client logos and not case-study
 * claims: naming a company here says "I have worked in this sector for them",
 * nothing about results.
 *
 * Employers (Refine, Tomorrow World, PSI) are not named. Bilal asked on
 * 2026-10-19 to keep Refine and Tomorrow World off the site until written
 * permission is in hand (roadmap 416), so they are counted inside a
 * description instead. Add a name to `companies` once that permission
 * arrives; nothing else needs changing.
 *
 * `href` only where a published page exists. Draft case studies (4Direction,
 * Choppershoot) stay unlinked until they are published. Texdale was linked
 * when its case study was published on 2026-10-24.
 */
export type IndustryEntry = {
  sector: string;
  companies: { name: string; href?: string }[];
  /** Extra line for work that is counted but not named. */
  note?: string;
};

export const industriesWorkedIn: IndustryEntry[] = [
  {
    sector: "Real estate",
    companies: [
      { name: "LEOS Developments", href: "/portfolio/leos-developments" },
      { name: "4Direction Developments" },
    ],
    note: "Plus three Dubai developers and brokerages.",
  },
  {
    sector: "Renovation",
    companies: [{ name: "LEOS Project Management" }],
  },
  {
    sector: "Production house",
    companies: [{ name: "Choppershoot" }],
  },
  {
    sector: "Textile chemicals, UK",
    companies: [{ name: "Texdale", href: "/portfolio/texdale" }, { name: "AKS Chemicals" }],
  },
  {
    sector: "HR consultancy",
    companies: [{ name: "Next Gen HR Consultancy" }],
  },
];
