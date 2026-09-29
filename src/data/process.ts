/**
 * The four delivery stages, shared by both renderings of the process.
 *
 * Extracted here so the full image-rich version on `/process` and the compact
 * four-across version on the homepage read the same source. Editing a step in
 * one place changes both, which is the point — the previous single component
 * meant the homepage and a dedicated page could not show the same process
 * without the copy being duplicated.
 *
 * `bullets` is consumed only by the full version on /process; the compact one
 * on the homepage drops it.
 *
 * `proofHref`/`proofLabel` are optional on purpose. A stage links to work that
 * demonstrates it only where such work is actually published — stage four has
 * no measurement work on the site yet, so it carries no link rather than a
 * misleading one.
 */
export type ProcessStep = {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  proofHref?: string;
  proofLabel?: string;
  /** How long the stage runs, and whether that duration has been confirmed.
   *
   *  Unverified values are bracketed at render time rather than in the string,
   *  the same guard the proof wall uses: a duration cannot be quietly promoted
   *  to a commitment by editing a string. Bilal's design bracketed the three
   *  week ranges and left "Ongoing" plain, which is exactly the distinction —
   *  the first three are estimates nobody has checked against a finished
   *  project, and the fourth is a statement of shape rather than length. */
  timing?: { label: string; verified: boolean };
  /** The one thing the client physically has at the end of the stage. Written
   *  as an object, not an activity: "a written brief with one agreed success
   *  metric" is checkable, "discovery" is not. */
  deliverable?: string;
};

// The `image`/`alt` pair was removed on 2026-09-16. This comment used to admit
// that the images were real project work which "only loosely match each step",
// which is decoration standing in for evidence on a page whose whole job is to
// be credible. Stages now link to work that genuinely shows the stage.
export const processSteps: ProcessStep[] = [
  {
    step: "01",
    timing: { label: "Week 1", verified: false },
    deliverable: "A written brief with one agreed success metric",
    title: "Understand the Brief",
    subtitle: "Research & Discovery",
    description:
      "I start by understanding the business, audience, and goals before proposing a marketing, design, or development approach.",
    bullets: [
      "Business goals & success metrics",
      "Target audience & user needs",
      "Market positioning & competitors",
      "Existing tools, data, and constraints",
    ],
    proofHref: "/portfolio/leos-developments",
    proofLabel: "See a full client engagement",
  },
  {
    step: "02",
    timing: { label: "Weeks 2 to 3", verified: false },
    deliverable: "Designs and a plan to sign off on",
    title: "Plan & Design",
    subtitle: "Structure & Interface",
    description:
      "Based on the brief, I plan the campaign, application, or design system and map out how each piece fits together.",
    bullets: [
      "Campaign or funnel strategy",
      "UX wireframes & UI design",
      "Technical architecture (for apps)",
      "Content & creative direction",
    ],
    proofHref: "/portfolio/ui-ux-design",
    proofLabel: "See the design work",
  },
  {
    step: "03",
    timing: { label: "Weeks 4 to 8", verified: false },
    deliverable: "The live thing, with tracking already wired up",
    title: "Build & Launch",
    subtitle: "Development & Delivery",
    description:
      "Execution is hands-on, building, testing, and shipping the campaign, website, or application.",
    bullets: [
      "Paid campaign setup & launch",
      "Development, QA & deployment",
      "Design production & asset delivery",
      "Tracking & analytics setup",
    ],
    proofHref: "/portfolio/leos-developments/hadley-heights",
    proofLabel: "See a launch that shipped",
  },
  {
    step: "04",
    timing: { label: "Ongoing", verified: true },
    deliverable: "A monthly report against the agreed metric",
    title: "Optimize & Scale",
    subtitle: "Measurement & Iteration",
    description:
      "Once live, I focus on measuring performance and improving it, whether that's ad spend, conversion rate, or app usage.",
    bullets: [
      "Performance monitoring & reporting",
      "Ongoing testing and iteration",
      "Automation & workflow improvements",
      "Handover or ongoing support",
    ],
  },
];

