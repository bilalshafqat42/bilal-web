/**
 * Everything the homepage says, in one file.
 *
 * **Why this exists.** The homepage was already composed rather than written:
 * `page.tsx` is 73 lines with zero hardcoded text, and every section is a
 * component. But the words lived *inside* those components, so changing the
 * hero headline meant opening `HeroBanner.tsx` and editing JSX, while changing
 * a service page headline meant opening `pillars.ts` and editing a string.
 * Two ways to do the same job on one site.
 *
 * **This buys editing, not reuse, and the distinction is worth being honest
 * about.** The service template renders fifteen pages from `pillars.ts`; that
 * is reuse. Every block below is rendered exactly once. What it buys is that
 * all forty-odd strings on the most important page of the site sit together,
 * readable end to end, editable without touching a component.
 *
 * **What deliberately did not move.** Layout stays in the components. A section
 * that renders once does not want twelve props describing its own markup — a
 * component configured by a caller that only ever calls it one way is harder to
 * change than the markup it replaced, which is the failure this whole refactor
 * was avoiding.
 *
 * Three sections are not here because their content already belongs to data
 * files shared with other pages, and copying it would create a second source of
 * truth: the disciplines come from `pillars.ts` (`homeDisciplines`), the process
 * stages from `process.ts`, and the portfolio grid from `caseStudies.ts`.
 */

import { Building2, Home, Network, Users, type LucideIcon } from "lucide-react";
import { caseStudyUrls } from "@/data/caseStudies";
import { disciplinesWithPages } from "@/data/disciplines";

export type Audience = {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
  note: string;
};

export type Stat = {
  value: string;
  label: string;
  detail: string;
  meta: string;
  /** False until a client has approved the figure for publication. Unverified
   *  values are wrapped in brackets at render time rather than in the string,
   *  so removing the brackets is impossible without also flipping this flag —
   *  which is the point. A figure cannot be quietly promoted to a fact. */
  verified: boolean;
};

export type Model = {
  name: string;
  price: string;
  priceNote: string;
  /** The raised, gold-priced column. One only, or it stops meaning anything.
   *
   *  This no longer carries a "[Most chosen]" badge. That is a claim about what
   *  clients pick, and with one published client there is nothing behind it —
   *  it shipped bracketed, which is a placeholder rather than a soft claim. The
   *  column is still raised and still the one with the primary CTA, which makes
   *  the same recommendation without asserting anything. */
  featured?: boolean;
  /** Unverified prices render bracketed, the same guard the proof wall and the
   *  process timings use: the brackets are applied at render time, never typed
   *  into the string, so a figure cannot be promoted to a commitment by editing
   *  a string. */
  priceVerified: boolean;
  cta: { label: string; href: string };
};

export type Cell = string | { items: (string | { text: string; muted: true })[] };

/** Figures under the hero. Each is checkable against the site itself. */
/** Three, not four.
 *
 *  A fourth cell read "[ 0.0x ] — Your strongest client result goes here",
 *  rendered as a visible placeholder with a dashed rule. That was defensible
 *  while it was a design marker; it is not something to ship above the fold on
 *  a live site, where it reads as an unfinished page rather than as a slot
 *  awaiting a number.
 *
 *  Removed rather than filled: no campaign result has been shared for
 *  publication, and inventing one is not an option. To restore it, add a fourth
 *  entry here and change the grid below back to `lg:grid-cols-4`. */
export const heroStats = [
  { value: "15", label: "Years across marketing, design and development" },
  { value: "4", label: "Disciplines, one person, not four suppliers" },
  { value: "UK + UAE", label: "Property developers in the UK and UAE" },
];

/** The recent-work ticker beside the hero. */
export const heroRecent = [
  { name: "Hadley Heights", href: "/portfolio/leos-developments/hadley-heights" },
  { name: "Weybridge Gardens 2", href: "/portfolio/leos-developments/weybridge-gardens-2" },
  { name: "Cavendish Square", href: "/portfolio/leos-developments/cavendish-square" },
];

/** Who the work is for, as the homepage states it. */
export const audiences: Audience[] = [
  {
    icon: Building2,
    title: "Startups & Founders",
    description:
      "Early-stage and scaling startups needing paid marketing, a website, or an MVP application without hiring a full team.",
    bullets: ["Paid ads, funnels & landing pages", "Web & mobile MVP development", "Brand visuals & messaging"],
    note: "Founders who need strategy and execution without hiring multiple specialists.",
  },
  {
    icon: Home,
    title: "Real Estate Developers & Agencies (UAE)",
    description: "Specialised marketing and web support for off-plan and ready property sales in competitive markets.",
    bullets: ["Campaign-specific landing pages & funnels", "Paid ads targeting investors & buyers", "CRM-ready lead capture & qualification"],
    note: "Teams focused on high-intent leads and cost efficiency.",
  },
  {
    icon: Users,
    title: "In-House Teams & Growing Companies",
    description: "I work as an extension of internal teams to support marketing, design, or development capacity.",
    bullets: ["Paid marketing & funnel optimisation", "Web, mobile & custom app development", "Design & social content support"],
    note: "Companies needing hands-on expertise without full-time overhead.",
  },
  {
    icon: Network,
    title: "Agencies & Consulting Partners",
    description: "White-label or collaborative support for agencies that need reliable delivery on marketing, design, or dev.",
    bullets: ["Paid ads & landing page execution", "Web, mobile & MERN development support", "Design & social content production"],
    note: "Agencies that value clarity, quality, and dependable delivery.",
  },
];

/** Measured outcomes. Every one traceable to a published case study. */
export const resultStats: Stat[] = [
  {
    value: "15+",
    label: "Years, one point of contact",
    detail: "Strategy, design and build without a handoff layer",
    meta: "Based in Dubai, UAE",
    verified: true,
  },
  {
    // Counted from `caseStudies`, not typed, so it cannot go stale.
    value: `${caseStudyUrls().filter((u) => u.split("/").length > 3).length}`,
    label: "Case studies published",
    detail: "Each with the brief, the decisions and what shipped",
    meta: "Brief · Build · Outcome",
    verified: true,
  },
  {
    // The same four the capability ledger names, counted from the data behind
    // it rather than asserted twice.
    value: `${disciplinesWithPages().length}`,
    label: "Disciplines, one contract",
    detail: "Marketing, design, web and mobile under one agreement",
    meta: "No subcontractors",
    verified: true,
  },
];

/** How those numbers were produced. */
/** How the numbers are produced. This panel is the real differentiator in the
 *  design: every freelancer claims results, and almost none explain the
 *  measurement. It is also the part that stays true regardless of which figures
 *  end up in the cards, which is why it is written as method rather than
 *  outcome. */
export const resultMethod = [
  "Baseline captured before anything changes",
  "Tracked in your own GA4, CRM and ad accounts",
  "One monthly report, no vanity metrics",
];

/** The three facts beside the portrait. */
export const aboutFacts = [
  { value: "15", label: "Years across marketing, design and development" },
  { value: "1", label: "Point of contact, from the brief to the launch" },
  { value: "UK + UAE", label: "Clients, working on Dubai hours" },
] as const;

/** The ways of working, compared on the homepage and on /pricing. */
export const engagementModels: Model[] = [
  {
    name: "Project-based",
    price: "AED 31,500",
    priceNote: "starting price",
    priceVerified: true,
    cta: { label: "Get a quote", href: "/contact" },
  },
  {
    name: "Monthly retainer",
    price: "AED 16,000",
    priceNote: "per month",
    featured: true,
    priceVerified: true,
    cta: { label: "Book a free consultation", href: "/appointment" },
  },
  {
    name: "Ongoing partner",
    // No published rate, and none has ever been supplied — the previous version
    // of this file said exactly that. It shipped as "AED [amount]", which reads
    // as a page nobody finished rather than as a price that depends on scope.
    price: "Priced on scope",
    priceNote: "agreed per engagement",
    priceVerified: true,
    cta: { label: "Discuss it", href: "/contact" },
  },
  {
    name: "Consulting",
    price: "AED 3,500",
    priceNote: "per session",
    priceVerified: true,
    cta: { label: "Book a session", href: "/appointment" },
  },
];

/** The comparison table rows. */
export const engagementRows: { label: string; cells: Cell[] }[] = [
  {
    label: "Commitment",
    cells: ["One scope", "Minimum 3 months", "Agreed days each week", "One session"],
  },
  {
    label: "Best for",
    cells: [
      "A focused project with a clear goal and deadline",
      "Consistent output month after month",
      "A scaling team that needs capacity, not a vendor",
      "A team that needs a second opinion, not hands",
    ],
  },
  {
    label: "What you get",
    cells: [
      { items: ["Fixed scope and price", "Design and build", "Tracking before launch", "Post-launch support"] },
      { items: ["One agreed focus a month", "Marketing, design or dev", "Report against one metric", "Direct access, no PM layer"] },
      { items: ["Inside your tools", "Priority over other work", "Quarterly planning", "Handover docs as standard"] },
      { items: ["Four-hour session", "Campaign or build review", "Written recommendations", { text: "No implementation", muted: true }] },
    ],
  },
  {
    label: "Reporting",
    cells: ["At handover", "Monthly", "Weekly", "Written summary"],
  },
];

/** The questions asked before a first call. */
export const homeFaqs = [
  {
    // Added 2026-10-05. Measured: the homepage carried 1,468 words and the
    // phrase "digital marketing" appeared zero times, while three of the nine
    // terms this page competes for contain it exactly: "digital marketing
    // freelancer in dubai" (720), "digital marketing expert in dubai" (320)
    // and "digital marketing freelance" (210). "Digital marketer" is a
    // different string and does not cover them.
    //
    // A question first and a keyword second: this is the one people genuinely
    // ask, because "freelancer" and "agency" are the two options they are
    // weighing, and it belongs at the top for that reason rather than this one.
    q: "What does a freelance digital marketer in Dubai actually cover?",
    a: "Paid ads on Google, Meta, TikTok, Snapchat and LinkedIn, search and content, email and WhatsApp, and the tracking underneath all of it. The difference from most digital marketing freelancers in Dubai is that I also build the landing pages and apps the campaigns point at, so the site and the spend are designed together instead of handed between two suppliers.",
  },
  {
    q: "Do you build mobile apps?",
    // From the website-app-development FAQ, kept whole. The second half is the
    // part worth keeping: telling someone they do not need an app is the
    // answer that earns trust.
    a: "Yes, with React Native so one codebase serves iOS and Android. I will also tell you when you do not need an app — for a lot of businesses a fast mobile website does the same job without app store approval and two platforms to maintain.",
  },
  {
    q: "How much does a landing page cost?",
    a: "It depends on scope, and any number quoted before understanding that is guesswork. What is published: project work starts at AED 31,500, a monthly retainer at AED 16,000, and an advisory session at AED 3,500. Describe what you have in mind and you get a real figure within a business day.",
  },
  {
    q: "Can you work with clients outside the UAE?",
    a: "Yes, and much of the work suits remote delivery well: audits, tracking implementation, landing page builds and design work do not require being in the same room. Campaign management that needs daily contact is easier within a few hours of Gulf Standard Time.",
  },
  {
    q: "What have you done for property developers?",
    // Named work is LEOS's, because that is the client with published case
    // studies. Tomorrow World and Refine are named as clients rather than
    // attached to projects, which is what the logo row already claims and no
    // more.
    a: "Campaigns, websites and apps for LEOS Developments, plus work for Tomorrow World Real Estate and Refine. The published case studies cover Hadley Heights, Weybridge Gardens and Cavendish Square: off-plan lead generation, launch and sales-gallery sites, and the CRM behind the enquiries.",
  },
  {
    q: "What actually happens in the free consultation?",
    a: "Thirty minutes. You describe the business and the number you want to move, I ask questions, and you leave with a recommended approach and a price range. No deck, no follow-up sequence, and no obligation.",
  },
];
