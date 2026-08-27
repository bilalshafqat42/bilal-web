// FAQ content for /faq and the homepage FAQ block.
//
// Written as questions people actually type or ask a chatbot, not as headings.
// That phrasing is deliberate: AI search matches natural questions, and a page
// that answers one in its own words is what gets quoted.
//
// Anything stated here must be verifiable from how Bilal actually works. Where a
// commitment is made on his behalf it is flagged in the roadmap for confirmation
// rather than invented.

export type FaqItem = { question: string; answer: string };
export type FaqGroup = { id: string; title: string; items: FaqItem[] };

export const faqGroups: FaqGroup[] = [
  {
    id: "working-together",
    title: "Working together",
    items: [
      {
        question: "Should I hire a freelancer or an agency?",
        answer:
          "It depends on what you are buying. An agency gives you capacity and continuity across a large team, and you pay for that overhead. A freelancer gives you direct access to the person doing the work, faster decisions and lower cost, with the trade-off that one person has finite hours. For most small and mid-sized projects the practical difference is that with me there is no account manager translating your brief to someone else, and no junior staff learning on your budget.",
      },
      {
        question: "Who actually does the work?",
        answer:
          "I do. Strategy, campaign management, design and development all come from the same person. Nothing is subcontracted without telling you first.",
      },
      {
        question: "What if I only need one thing, not everything?",
        answer:
          "That is normal and completely fine. Most engagements start with one piece — a landing page, a campaign audit, a CRM fix — and grow only if it makes sense. There is no requirement to buy a bundle.",
      },
      {
        question: "Can you work with our existing agency or in-house team?",
        answer:
          "Yes. A common arrangement is filling a specific gap a team does not have in-house, such as server-side tracking, a Next.js build or conversion work, while they keep running everything else.",
      },
    ],
  },
  {
    id: "location-and-hours",
    title: "Location, hours and timezones",
    items: [
      {
        question: "Where are you based?",
        answer:
          "Dubai, United Arab Emirates. I work with clients across the UAE and internationally.",
      },
      {
        question: "Can you work with clients outside the UAE?",
        answer:
          "Yes, and much of the work suits remote delivery well: audits, tracking implementation, landing page builds and design work do not require being in the same room. Campaign management that needs daily contact is easier within a few hours of Gulf Standard Time.",
      },
      {
        question: "What are your working hours if I'm in the UK or US?",
        answer:
          "I work Gulf Standard Time, UTC+4, Monday to Friday. That overlaps most of a UK working day, so live calls are straightforward. North America overlaps only in your morning, so those projects run better with async updates and a scheduled weekly call rather than ad-hoc availability.",
      },
      {
        question: "How quickly do you reply?",
        answer:
          "Typically within one business day, and the same day if you reach me on WhatsApp.",
      },
    ],
  },
  {
    id: "projects",
    title: "Projects and process",
    items: [
      {
        question: "How does a project usually start?",
        answer:
          "With a conversation about what you are trying to achieve, not a proposal template. From there you get an honest view of what is worth doing, which often includes telling you a smaller piece of work would solve the problem.",
      },
      {
        question: "What do you need from me to get started?",
        answer:
          "The goal in your own words, any deadline, and access to what already exists — your website, ad accounts or CRM. Nothing else is required for a first conversation.",
      },
      {
        question: "Do you work with any particular industry?",
        answer:
          "No. The published case studies happen to be property, because that is where recent work has been concentrated, but the services are industry-neutral. A Google Ads campaign or a Next.js build is judged on execution, not sector.",
      },
      {
        question: "Do you rebuild everything, or improve what we have?",
        answer:
          "Whichever costs less to reach the goal. Plenty of engagements improve, extend or fix what is already there. A rebuild only makes sense when the existing thing is the actual constraint.",
      },
    ],
  },
  {
    id: "measurement",
    title: "Measurement and reporting",
    items: [
      {
        question: "How do you measure whether marketing is working?",
        answer:
          "Against enquiries and revenue, not impressions and engagement. Conversion tracking is configured before spend starts, so cost per lead and cost per acquisition are real numbers from the first week rather than something reconstructed later.",
      },
      {
        question: "Why does server-side tracking matter?",
        answer:
          "Because browser-based tracking has become far less reliable. Ad blockers, cookie restrictions and iOS privacy changes all reduce what a standard pixel can see, which means platforms under-report conversions and optimise against incomplete data. Server-side tracking sends conversion data directly from your server instead.",
      },
      {
        question: "Will I be able to see the data myself?",
        answer:
          "Yes. Reporting is set up in your own accounts, so you keep access to everything whether or not we continue working together.",
      },
    ],
  },
];

export const allFaqs: FaqItem[] = faqGroups.flatMap((g) => g.items);
