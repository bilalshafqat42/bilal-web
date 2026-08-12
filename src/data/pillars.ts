import { Target, Code2, Palette, Workflow, type LucideIcon } from "lucide-react";

export type Accent = "gold" | "violet" | "cyan";

export type PillarSection = {
  title: string;
  body: string;
  bullets: string[];
};

export type Faq = {
  question: string;
  answer: string;
};

export type Pillar = {
  slug: string;
  icon: LucideIcon;
  accent: Accent;
  label: string;
  shortDescription: string;
  capabilities: string[];
  heroDescription: string;
  sections: PillarSection[];
  faqs: Faq[];
};

export const pillars: Pillar[] = [
  {
    slug: "paid-marketing",
    icon: Target,
    accent: "gold",
    label: "Paid Marketing & Lead Generation",
    shortDescription:
      "I plan and run paid campaigns across Google and social platforms to bring in qualified leads, not just clicks.",
    capabilities: [
      "Google Search & Performance Max",
      "Meta, LinkedIn & TikTok Ad Campaigns",
      "Lead Generation & Demand Generation",
    ],
    heroDescription:
      "Paid media only works if it's built around your actual sales pipeline, not vanity metrics. I plan, launch, and manage campaigns across Google and the major social platforms, then track every lead back to cost per acquisition and revenue, not just clicks and impressions.",
    sections: [
      {
        title: "Google Ads & Performance Max",
        body: "Search, Shopping, Display, and Performance Max campaigns built around the keywords and audiences your actual customers use, with conversion tracking set up before a single dirham is spent.",
        bullets: ["Search & Shopping campaigns", "Performance Max setup", "Conversion tracking & attribution"],
      },
      {
        title: "Meta, LinkedIn & TikTok Advertising",
        body: "Paid social campaigns across Meta (Facebook & Instagram), LinkedIn, and TikTok, matched to where your specific audience actually spends time, not run everywhere by default.",
        bullets: ["Audience targeting & creative testing", "Campaign structure & budget pacing", "Platform-specific creative formats"],
      },
      {
        title: "Performance Marketing & Lead Generation",
        body: "Ongoing optimisation once campaigns are live: lowering cost per lead over time, building landing pages that convert, and setting up demand generation for longer sales cycles.",
        bullets: ["Funnel & landing page strategy", "Cost-per-lead optimisation", "Demand generation for B2B pipelines"],
      },
    ],
    faqs: [
      {
        question: "Which ad platforms do you manage?",
        answer:
          "Google (Search, Shopping, Display, Performance Max), Meta (Facebook & Instagram), LinkedIn, and TikTok. I recommend the platform mix based on where your actual customers are, not run every channel by default.",
      },
      {
        question: "Do you handle the creative as well as the media buying?",
        answer:
          "Yes. Ad creative and copy come from the same person managing the campaigns, so there's no handoff between a media buyer and a separate designer.",
      },
      {
        question: "How is performance tracked?",
        answer:
          "Every campaign is set up with proper conversion tracking from day one, tied to leads and revenue rather than just clicks. You get visibility into real cost per lead and cost per acquisition, not vanity metrics.",
      },
    ],
  },
  {
    slug: "website-app-development",
    icon: Code2,
    accent: "violet",
    label: "Website & App Development",
    shortDescription:
      "I design and build the websites, apps, and tools your marketing and sales teams actually run on.",
    capabilities: [
      "High-Converting Landing Pages (Next.js)",
      "Web & Custom Mobile App Development",
      "Custom Marketing Tools & Calculators",
    ],
    heroDescription:
      "A website that looks good but doesn't convert is a cost, not an asset. I design and build websites, mobile apps, and internal tools on modern, fast frameworks, built from the start to support whatever marketing is driving traffic to them.",
    sections: [
      {
        title: "Website Design & Development",
        body: "Websites built on Next.js for speed and SEO out of the box, designed around conversion rather than just visual polish, with a CMS behind them when you need to update content yourself.",
        bullets: ["High-converting landing pages", "SEO-ready page structure", "CMS integration"],
      },
      {
        title: "Mobile App Development",
        body: "Cross-platform mobile apps that extend a product or campaign onto iOS and Android, from the first build through app store submission.",
        bullets: ["Cross-platform app builds", "App store setup & submission", "Push notifications & analytics"],
      },
      {
        title: "Custom Marketing Tools & Calculators",
        body: "Bespoke tools, calculators, and internal dashboards built on the MERN stack (MongoDB, Express, React, Node.js) when an off-the-shelf product doesn't fit how your team actually works.",
        bullets: ["Custom marketing applications", "Internal dashboards & tools", "APIs & third-party integrations"],
      },
    ],
    faqs: [
      {
        question: "What technology do you build with?",
        answer:
          "Next.js for websites and marketing tools, React Native for mobile apps, and the MERN stack (MongoDB, Express, React, Node.js) for custom applications and dashboards.",
      },
      {
        question: "Can you work with our existing website instead of rebuilding it?",
        answer:
          "Often, yes, depending on the platform. I can frequently improve, extend, or fix an existing site rather than rebuild from scratch, we'll work out which makes sense once I see what you have.",
      },
      {
        question: "Do you design as well as develop?",
        answer:
          "Yes. Design and development come from the same person, so what gets designed is what actually gets built, with no handoff loss between a designer's file and a developer's build.",
      },
    ],
  },
  {
    slug: "design-content-conversion",
    icon: Palette,
    accent: "cyan",
    label: "Design, Content & Conversion",
    shortDescription:
      "I create the visuals and content behind your campaigns, then optimise the pages that turn visitors into leads.",
    capabilities: [
      "Social Media Strategy & Asset Design",
      "High-Ticket B2B & Real Estate Video Editing",
      "Conversion Rate Optimization (CRO)",
    ],
    heroDescription:
      "Good design and content should do more than look right, they should move someone from scrolling to clicking to booking a call. I handle the visuals, video, and page-level testing that support that whole path, not just one piece of it.",
    sections: [
      {
        title: "Social Media Strategy & Design",
        body: "Content calendars, creative direction, and the actual asset design for the channels you're active on, kept consistent with your brand and built to support paid campaigns rather than sit separately from them.",
        bullets: ["Content calendars & posting", "Social media creatives", "Brand collateral"],
      },
      {
        title: "B2B & Real Estate Video Editing",
        body: "Video editing for high-ticket B2B and real estate marketing specifically: property walkthroughs, testimonials, and campaign videos edited for how those audiences actually watch and decide.",
        bullets: ["Property & project walkthroughs", "Testimonial & case study videos", "Ad & social video cuts"],
      },
      {
        title: "Conversion Rate Optimization (CRO)",
        body: "Once traffic is arriving, CRO work looks at what's actually stopping visitors from converting: page structure, copy, forms, and load speed, and tests changes against real data.",
        bullets: ["Landing page audits", "A/B testing", "Form & funnel optimisation"],
      },
    ],
    faqs: [
      {
        question: "Do you only design for real estate and B2B clients?",
        answer:
          "No, that's a specific strength given past project experience, but the same design and content process applies across industries.",
      },
      {
        question: "What does a CRO engagement actually involve?",
        answer:
          "An audit of your current pages against real user behaviour, a prioritised list of changes, then implementing and testing those changes rather than guessing what might help.",
      },
      {
        question: "Can you take over an existing brand identity, or do we need a full rebrand?",
        answer:
          "Existing brand guidelines are usually a starting point, not a blocker. Most engagements build on what you already have rather than starting from zero.",
      },
    ],
  },
  {
    slug: "crm-marketing-automation",
    icon: Workflow,
    accent: "gold",
    label: "CRM & Marketing Automation",
    shortDescription:
      "I connect your marketing, website, and sales data so leads are tracked and followed up automatically, not lost in a spreadsheet.",
    capabilities: [
      "HubSpot, Zoho & Salesforce CRM Setup",
      "Server-Side Pixel & Conversions API Tracking",
      "Marketing Automation Workflows",
    ],
    heroDescription:
      "Most of the leads a business loses aren't lost to bad marketing, they're lost to a follow-up that never happened because nothing was tracking them properly. This pillar connects everything else, campaigns, website, and CRM, into one system that doesn't rely on someone remembering to check a spreadsheet.",
    sections: [
      {
        title: "CRM Setup (HubSpot, Zoho & Salesforce)",
        body: "Setting up or reconfiguring HubSpot, Zoho, or Salesforce so leads from every channel land in one place, with the pipeline stages and fields that match how your team actually sells.",
        bullets: ["CRM setup & configuration", "Pipeline & lead-stage design", "Team onboarding"],
      },
      {
        title: "Server-Side Tracking & Conversions API",
        body: "Server-side pixel and Conversions API setup for Meta and Google, so conversion data keeps flowing accurately even as browser-based tracking becomes less reliable.",
        bullets: ["Server-side pixel setup", "Conversions API integration", "Cross-platform attribution"],
      },
      {
        title: "Marketing Automation Workflows",
        body: "Automated follow-up sequences, lead scoring, and internal notifications, so a new lead gets a response in minutes, not whenever someone next opens their inbox.",
        bullets: ["Automated email & follow-up sequences", "Lead scoring & routing", "Internal notifications & alerts"],
      },
    ],
    faqs: [
      {
        question: "Which CRMs do you work with?",
        answer:
          "HubSpot, Zoho, and Salesforce most often. If you're using something else, get in touch and we'll confirm fit.",
      },
      {
        question: "What is server-side tracking, and why does it matter?",
        answer:
          "It's a way of sending conversion data, like a completed lead form, directly from your server to platforms like Meta and Google, instead of relying only on a browser-based pixel. It matters because browser tracking has become far less reliable: ad blockers, cookie restrictions, and iOS privacy changes all reduce what a standard pixel can see.",
      },
      {
        question: "We already have a CRM, can you just fix the automation?",
        answer:
          "Yes. Most of this work is improving or rebuilding automation inside a CRM you already have, not necessarily replacing it.",
      },
    ],
  },
];

export function getPillarBySlug(slug: string): Pillar | undefined {
  return pillars.find((pillar) => pillar.slug === slug);
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const accentClasses: Record<Accent, { icon: string; bg: string; dot: string; glow: string }> = {
  gold: { icon: "text-gold", bg: "from-gold/25 to-gold-2/10", dot: "bg-gold", glow: "bg-gold/25" },
  violet: { icon: "text-violet", bg: "from-violet/25 to-violet/10", dot: "bg-violet", glow: "bg-violet/25" },
  cyan: { icon: "text-cyan", bg: "from-cyan/25 to-cyan/10", dot: "bg-cyan", glow: "bg-cyan/25" },
};
