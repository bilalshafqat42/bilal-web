/**
 * The four delivery stages, shared by both renderings of the process.
 *
 * Extracted here so the full image-rich version on `/process` and the compact
 * four-across version on the homepage read the same source. Editing a step in
 * one place changes both, which is the point — the previous single component
 * meant the homepage and a dedicated page could not show the same process
 * without the copy being duplicated.
 *
 * `image`/`alt` are consumed only by the full version. The compact one drops
 * them, along with `bullets`.
 */
export type ProcessStep = {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  image: string;
  alt: string;
};

// Images are real project work but only loosely match each step. They are the
// weakest part of this section: swap `image` and `alt` and nothing else changes.
export const processSteps: ProcessStep[] = [
  {
    step: "01",
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
    image: "/portfolio/leos/social-media/3.avif",
    alt: "Campaign creative developed for LEOS Developments after the discovery stage",
  },
  {
    step: "02",
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
    image: "/portfolio/leos/landing-page/leos-landing-page.avif",
    alt: "LEOS Developments corporate website interface design",
  },
  {
    step: "03",
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
    image: "/portfolio/leos/hadley-heights/landing-page/hadley-heights-landing-page.avif",
    alt: "Hadley Heights landing page built and shipped for launch",
  },
  {
    step: "04",
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
    image: "/portfolio/leos/hadley-heights/social-media/2.avif",
    alt: "Ongoing campaign creative produced for Hadley Heights",
  },
];

