// Long-form content for the eight service category pages.
//
// Why this file exists: Search Console reported 48 URLs as "Crawled, currently
// not indexed", which is Google saying the pages were not substantial enough to
// be worth indexing. The category pages averaged 250 words. This adds the depth
// that makes them worth ranking, kept separate from `pillars.ts` so the mega
// menu data stays readable.
//
// Everything here describes work Bilal actually does. No invented metrics, no
// client names beyond LEOS Developments, which is public on his Behance and in
// the case studies on this site.

export type DepthBlock = { heading: string; paragraphs: string[] };
export type Faq = { question: string; answer: string };

type Depth = { blocks: DepthBlock[]; faqs: Faq[] };

export const serviceDepth: Record<string, Depth> = {
  "paid-marketing": {
    blocks: [
      {
        heading: "Tracking goes in before the spend does",
        paragraphs: [
          "Most accounts I inherit are spending money they cannot account for. The pixel fires on every page load rather than on a real enquiry, form submissions are counted twice, and the platform is optimising towards a conversion that does not mean anything. Until that is fixed, every reported number is fiction and every optimisation decision is a guess.",
          "So the first week is not campaign building. It is auditing what is currently tracked, defining what actually counts as a lead for your business, and wiring that up properly, including server-side tracking through the Conversions API where the browser alone is no longer reliable. Only once the measurement is honest does budget start moving.",
        ],
      },
      {
        heading: "Structure that a real budget can survive",
        paragraphs: [
          "Campaign structure decides how much of your money reaches the people worth reaching. That means separating markets rather than lumping the UAE in with the UK, separating intent so someone searching your development by name is not bidding against someone browsing the category, and setting exclusions before spend rather than after a wasted month.",
          "For property and high-value services in particular, the qualifier belongs early. Putting a starting price in the ad and again above the fold on the landing page filters out traffic that was never going to convert. It lowers your click volume and raises your cost per click, and it is still the cheapest thing you can do to your cost per acquisition.",
        ],
      },
      {
        heading: "Reported against pipeline, not impressions",
        paragraphs: [
          "Reporting comes back as cost per lead, cost per qualified lead and cost per acquisition, tied to what your CRM says happened afterwards. Reach, impressions and engagement are diagnostic numbers, useful for working out why something is or is not working, and they are not the headline.",
          "I run Google Ads including Performance Max, Meta, TikTok, Snapchat and LinkedIn. Which of those you should be on depends entirely on where your buyers are and what they are worth, and part of the job is telling you when a channel is not worth your budget rather than spreading it thinly across all five.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you run Google Ads and Meta ads, or only one?",
        answer:
          "Both, plus TikTok, Snapchat and LinkedIn where they fit. Which you should be on depends on where your buyers actually are and what a customer is worth to you. Part of my job is telling you when a platform is not worth your budget rather than spreading it thin across all five.",
      },
      {
        question: "Can you take over an existing ad account?",
        answer:
          "Yes, and it is usually faster than starting fresh because the conversion history is worth keeping. I work inside your account with you as owner, so if we ever stop working together the data stays with you rather than leaving with me.",
      },
      {
        question: "Do you charge a percentage of ad spend?",
        answer:
          "No. Percentage-of-spend pricing rewards a supplier for spending more of your money, which is the wrong incentive. Fees are fixed for the scope, so my income does not go up when your budget does.",
      },
      {
        question: "Can you run campaigns for off-plan property in Dubai?",
        answer:
          "Yes, this is where most of my recent campaign work sits. Off-plan has its own pattern: the price qualifier belongs high in the ad and again on the landing page so unqualified traffic filters itself out before it costs you a click.",
      },
      {
        question: "What do I need to give you to start?",
        answer:
          "Access to your ad accounts, your website or landing page, and an honest number for what a closed customer is worth. That last one matters most, because without it there is no way to say whether a cost per lead is good or bad.",
      },
      {
        question: "What is the minimum ad budget worth starting with?",
        answer:
          "It depends on your cost per click and how many conversions a platform needs before it can optimise. Rather than quote a number that fits nobody, I work backwards from your average deal value and close rate, and tell you honestly if the budget you have is too thin to learn anything from. Sometimes the right advice is to fix the landing page first and start spending later.",
      },
      {
        question: "Do you need access to my ad accounts, or do you build new ones?",
        answer:
          "I work inside your accounts, under your billing, with you as owner. That matters more than it sounds: agencies that build campaigns in their own account keep the conversion history when the relationship ends, and you start from zero with the next supplier. Your data should stay yours.",
      },
      {
        question: "How long before the numbers mean anything?",
        answer:
          "Roughly two to four weeks for the platform to gather enough conversion data to optimise against, and six to eight before cost per acquisition is stable enough to make real decisions on. Anyone promising meaningful results in the first fortnight is describing luck rather than a process.",
      },
    ],
  },

  "social-media-marketing": {
    blocks: [
      {
        heading: "Organic and paid are one system, not two",
        paragraphs: [
          "The most common waste I see is a social calendar built by one team and ad creative built by another, with nothing shared between them. The organic grid says one thing, the ads say another, and a buyer who sees both comes away unsure what the company actually is.",
          "Because the same person makes both here, the creative that performs in paid gets promoted into the organic calendar, and the organic posts that earn genuine engagement become ad tests. That feedback loop is most of the value, and it only exists when one person can see both sets of numbers.",
        ],
      },
      {
        heading: "What a month actually contains",
        paragraphs: [
          "A working month is a content plan tied to what the business is trying to sell that month rather than to a generic calendar, the creative to deliver it across feed, story and reel formats, scheduling, and community management so comments and direct messages get answered while intent is still warm.",
          "For launches, that plan is built backwards from the launch date: teaser, reveal, detail, urgency, then post-launch proof. Posting consistently is table stakes. Posting in a sequence that matches how a buyer actually decides is what makes the channel earn its budget.",
        ],
      },
      {
        heading: "Built on a real brand system",
        paragraphs: [
          "Campaign creative is produced from the same brand rules as the website and the sales material, so what a buyer sees on Instagram, on the landing page and in the brochure looks like one company. That sounds obvious and is genuinely rare, because those three things are usually made by three different suppliers.",
          "Award-winning work for LEOS Developments came out of exactly that arrangement: the same person building the site the campaigns pointed at, and making the creative that drove traffic to it. You can see how that played out in the case studies on this site.",
        ],
      },
      {
        heading: "Measuring social honestly",
        paragraphs: [
          "Followers and likes are the easiest numbers to report and the least useful to act on. An account can add thousands of followers who will never buy, and the graph still points upward, which is why vanity metrics survive so long inside marketing reports.",
          "What I report instead is saves and shares, which indicate genuine interest, profile visits and link clicks, which indicate intent, and enquiries attributed back to social, which indicate revenue. Where the platform cannot attribute cleanly, I say so rather than presenting a confident number the data does not support.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you post for us, or only produce the content?",
        answer:
          "Either. Some clients want the creative delivered and post it themselves; others want the whole channel run, including scheduling and replying to comments and direct messages. Tell me which you want and the scope is priced accordingly.",
      },
      {
        question: "How many posts do you produce in a month?",
        answer:
          "It depends on the plan rather than a fixed number, because a launch month and a quiet month should not look the same. What matters more is that the plan is built around what you are selling that month rather than filling a calendar.",
      },
      {
        question: "Do you handle comments and direct messages?",
        answer:
          "Yes, where community management is part of the scope. It matters more than it sounds: an enquiry in a comment thread goes cold quickly, and most of the value of social for a service business arrives in the inbox rather than in the likes.",
      },
      {
        question: "Can you guarantee follower growth?",
        answer:
          "No, and I would be careful with anyone who does. Followers can be bought and mean nothing commercially. What I report instead is saves, shares, profile visits and enquiries, because those are the numbers that connect to revenue.",
      },
      {
        question: "Which platforms do you cover?",
        answer:
          "Instagram, Facebook, TikTok and LinkedIn, with the creative made for each rather than one asset resized four ways. Which ones are worth your effort depends on whether your buyers are consumers or businesses.",
      },
      {
        question: "Do you write the captions and copy as well as the design?",
        answer:
          "Yes. Splitting copy from design is what produces posts where the words and the image are arguing with each other. Both come from the same brief, and both are written for the platform rather than reformatted from a press release.",
      },
      {
        question: "Can you work with our existing brand guidelines?",
        answer:
          "Yes, and it is usually the faster start. If guidelines exist I work inside them. If they do not, or they only cover a logo and two colours, I will tell you what is missing before it becomes a problem across fifty assets.",
      },
      {
        question: "Do you manage the ad spend behind social posts too?",
        answer:
          "Yes. Paid social sits with the paid marketing work, which means boosted content is planned against a cost per lead rather than boosted because a post happened to do well organically.",
      },
    ],
  },

  "digital-marketing": {
    blocks: [
      {
        heading: "Where the traffic comes from when the ads stop",
        paragraphs: [
          "Paid traffic disappears the day you stop paying for it. Search visibility, content and outreach are slower and they compound, and a business that relies entirely on one is exposed. The mix matters more than the individual channel.",
          "That means technical SEO that is actually implemented rather than delivered as a spreadsheet of recommendations, content built around what buyers type into a search bar instead of what a company enjoys writing about, and internal linking so the pages you want ranking are supported by the rest of the site.",
        ],
      },
      {
        heading: "Search visibility now includes AI answers",
        paragraphs: [
          "A growing share of research happens inside ChatGPT, Claude, Perplexity and Google's AI results, and those systems read the page rather than a meta tag. Clean semantic HTML, question-shaped headings, specific numbers instead of vague claims, and content that stays current all matter more for that than any keyword density rule ever did.",
          "This is an evolving area and nobody publishes the ranking rules, so I will not promise placement in an AI answer. What I will do is make sure the site is structured so it can be read, quoted and attributed properly, and be straight with you about which parts of it are established practice and which are still educated guesswork.",
        ],
      },
      {
        heading: "Outreach that is not a mail merge",
        paragraphs: [
          "Cold outreach works when the list is small and researched and fails when it is large and generic. I would rather send eighty messages that reference something real about the recipient's business than eight thousand that do not, because the second approach burns your domain reputation for a response rate close to zero.",
          "Practically that means list building against a clear profile, warm-up and sending infrastructure set up so your mail lands, sequences with a genuine reason to follow up, and replies routed into the same CRM as everything else so nothing is tracked in a personal inbox.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the difference between SEO and paid ads?",
        answer:
          "Paid ads buy visibility and stop the day you stop paying. SEO earns it slowly and keeps working, but takes months and cannot be guaranteed. Most businesses need both: ads for now, search for later.",
      },
      {
        question: "Do you do email marketing?",
        answer:
          "Yes, as part of the automation work rather than as a standalone newsletter service. The useful version is triggered email tied to what someone actually did on your site, not a monthly blast to a list that has gone cold.",
      },
      {
        question: "Can you help us rank outside the UAE?",
        answer:
          "Yes. I work with clients in the UK, Europe and North America. Ranking in a new market is mostly a content and structure problem rather than a technical one, and it takes longer in a competitive market than a local one.",
      },
      {
        question: "Do you write the content yourself?",
        answer:
          "Yes. Content written by someone who does not understand the service reads like it, and search engines and buyers both notice. If you have a subject expert internally, the best results come from me interviewing them rather than guessing.",
      },
      {
        question: "How is this different from hiring an agency?",
        answer:
          "You talk to the person doing the work. No account manager translating your brief, no junior staff learning on your budget, and no handoffs between a strategy team and a delivery team. The trade-off is that I have limited capacity, so I take fewer clients.",
      },
      {
        question: "How long does SEO take to show results?",
        answer:
          "Technical fixes can show in weeks. Content and authority take months, and in a competitive market like Dubai real estate or UK agency search, six to twelve months is realistic for pages that were not ranking at all. Anyone giving you a shorter number is either working on very low competition terms or is guessing.",
      },
      {
        question: "Can you guarantee a first page ranking?",
        answer:
          "No, and neither can anyone else honestly. Rankings depend on competition, domain age and backlinks as well as on-page quality, and none of those are fully controllable. What is controllable is technical quality, content depth and internal structure, and that is what the work covers.",
      },
      {
        question: "Do you work with businesses outside the UAE?",
        answer:
          "Yes. I am based in Dubai and work with clients in the UK, Europe and North America. The time difference is three to four hours to London and eight to nine to New York, which means most of a UK working day overlaps and North American calls happen in my evening.",
      },
    ],
  },

  "website-app-development": {
    blocks: [
      {
        heading: "Built around the campaign that feeds it",
        paragraphs: [
          "A landing page built in isolation from the campaign pointing at it is where most paid budget quietly leaks. The ad promises one thing, the page opens with another, and the form asks for eight fields when three would do. None of that shows up as a broken link, so it goes unnoticed for months.",
          "Because the campaign and the build sit with the same person here, the page is designed against the ad that will send traffic to it: the same promise above the fold, the qualifier high enough to filter, and one primary action with anything secondary visibly subordinate to it.",
        ],
      },
      {
        heading: "The stack, and why it is that stack",
        paragraphs: [
          "Marketing sites and landing pages are built on Next.js, which renders on the server. That matters commercially rather than technically: server-rendered pages are fast on a mid-range phone on mobile data, and they are readable by search engines and AI crawlers without waiting for JavaScript. Application work is MERN, MongoDB, Express, React and Node, with React Native where a mobile app is genuinely warranted.",
          "Speed is treated as a requirement, not a nice-to-have. Images are served in modern formats at the sizes actually used, third-party scripts are loaded so they cannot block the page, and the result is checked on real viewport sizes rather than on a designer's monitor.",
        ],
      },
      {
        heading: "Handover you can actually take over",
        paragraphs: [
          "You get the repository, the hosting account and the documentation, in your name. If you want to move the work to an in-house developer or another supplier later, nothing is locked behind a proprietary builder or an account only I can access.",
          "Tracking, analytics and CRM connections are set up as part of the build rather than bolted on afterwards by someone who did not write the forms. That is the difference between a site that reports leads accurately from day one and one that needs a second project to fix its own measurement.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you work with Squarespace or Wix?",
        answer:
          "Yes. They are a sensible choice for a small brochure site where the priority is being live quickly on a modest budget, and I would rather set you up properly on one than sell you a custom build you do not need. The limits appear when you want real speed, custom functionality or anything the builder does not allow, and I will tell you when you have reached them.",
      },
      {
        question: "Which platform should I actually be on?",
        answer:
          "It depends on who updates the site and what it has to do. Squarespace or Wix for a small brochure site you maintain yourself. WordPress for a content-heavy site with several editors. Next.js when speed, search performance or custom functionality decide the outcome. I will recommend one and explain the trade-off rather than defaulting to whichever I prefer to build.",
      },
      {
        question: "What is your full development stack?",
        answer:
          "Next.js and React for websites and marketing tools, React Native for mobile apps, and the MERN stack (MongoDB, Express, React, Node.js) for custom applications and dashboards. PostgreSQL where relational data and reporting matter more than document flexibility. On the CMS side: WordPress, Squarespace and Wix.",
      },
      {
        question: "Do you use MongoDB or PostgreSQL?",
        answer:
          "Whichever suits the data. MongoDB when the shape of a record varies or changes often, PostgreSQL when the data is genuinely relational and you will be reporting across it. Picking the wrong one is expensive to undo later, so it is worth deciding deliberately rather than by habit.",
      },
      {
        question: "How much does a website cost?",
        answer:
          "It depends on scope, and any number quoted before understanding that is guesswork. A focused landing page and a multi-language site with a CMS and CRM integration are different projects. Send me what you have in mind and you will get a real number rather than a range.",
      },
      {
        question: "How long does a website take?",
        answer:
          "A landing page is usually a couple of weeks, a full marketing site four to eight, and an application longer. The variable is rarely build time, it is how quickly feedback comes back and how many people need to approve it.",
      },
      {
        question: "Do you build e-commerce sites?",
        answer:
          "Yes, though I will tell you honestly when an off-the-shelf platform like Shopify is the better commercial decision than a custom build. Paying for custom development to replicate what a hosted platform already does well is a poor use of budget.",
      },
      {
        question: "Can you build a mobile app as well?",
        answer:
          "Yes, with React Native so one codebase serves iOS and Android. I will also tell you when you do not need an app: for a lot of businesses a fast mobile website does the same job without app store approval and two platforms to maintain.",
      },
      {
        question: "Do you provide hosting and ongoing maintenance?",
        answer:
          "Yes, as a care plan rather than as hosting resale: updates, monitoring, backups and a set amount of change work each month. You keep ownership of the hosting account either way.",
      },
      {
        question: "Do you work with WordPress, or only Next.js?",
        answer:
          "Both. I build on WordPress as well as taking over and improving existing WordPress sites. It is the right call when you need a large content site that non-technical staff update every day, or when the plugin ecosystem already solves something that would otherwise be a custom build. Next.js is the right call when speed, search performance or custom functionality matter more than a familiar admin panel.",
      },
      {
        question: "Who owns the code?",
        answer:
          "You do. The repository is yours, hosted under your account. This matters more than people expect: it is what lets you take the work elsewhere without a rebuild if the relationship ends.",
      },
      {
        question: "Can you take over a project someone else started?",
        answer:
          "Often, yes. It depends on the state of the code. I will look at it first and give you a straight assessment of whether continuing is cheaper than restarting, including when the honest answer is that it is not.",
      },
    ],
  },

  "ui-ux-design": {
    blocks: [
      {
        heading: "Design that survives contact with development",
        paragraphs: [
          "A lot of interface design falls apart at handover. It looks right in the design file and then breaks in the browser, because the layout assumed one text length, the states were never drawn, and nobody decided what happens on a 360px screen.",
          "Because the same person builds it afterwards, the design is made against what the browser will actually do. Long names, empty states, error states and loading states are decided during design rather than improvised during development, which is where most of the visual drift between a mockup and a live site comes from.",
        ],
      },
      {
        heading: "Phone first, properly",
        paragraphs: [
          "Most traffic arrives on a phone, and most designs are still drawn at desktop width and squeezed down afterwards. The result is a hero cropped so the product is out of frame, a primary button below the fold, and a form that needs two hands.",
          "Designing at the small size first forces the real decisions: what the one message is, which single action matters, and what can be cut. The desktop layout is then an expansion of something already proven to work in the harder constraint rather than a compression of something that was never tested in it.",
        ],
      },
      {
        heading: "What you actually receive",
        paragraphs: [
          "Wireframes for structure, then interface design in Figma with the components, spacing scale and type scale defined so the design can be extended without guessing. Where the work will keep growing, that becomes a small design system rather than a set of one-off screens.",
          "Prototypes are used for anything with real interaction, so a flow can be clicked through and corrected before it is expensive to change. Testing with real users is part of the work where the budget allows, because how something is actually used is more useful than any opinion about it, including mine.",
        ],
      },
      {
        heading: "Accessibility is part of the design, not a retrofit",
        paragraphs: [
          "Contrast, focus states, target sizes and reading order are decided during design because retrofitting them afterwards means reopening layouts that were signed off months earlier. It is far cheaper as a design constraint than as a remediation project.",
          "In practice that means text contrast checked against WCAG rather than eyeballed, interactive elements that are reachable and visible by keyboard, and motion that respects a visitor's reduced-motion setting. That is good practice everywhere, and it matters commercially if you sell to organisations that ask about accessibility during procurement.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the difference between UI design and UX design?",
        answer:
          "UX is how it works, UI is how it looks. UX decides what the screens are, what order they come in and what a person is trying to get done. UI is the type, colour, spacing and components that make it feel like something. Most projects need both, and separating them across two suppliers is where designs usually fall apart.",
      },
      {
        question: "Is web design the same as UI/UX design?",
        answer:
          "They overlap but are not identical. Web design usually means the visual design of a marketing site. UI/UX covers that plus product interfaces, app screens, flows and states. If you need a site that looks good, that is web design. If you need something people have to use repeatedly, that is UI/UX.",
      },
      {
        question: "Do you design mobile apps as well as websites?",
        answer:
          "Yes, and I design them phone first rather than shrinking a desktop layout. That matters: most designs that break on a phone were drawn at desktop width and squeezed afterwards, which is how you end up with the main action below the fold.",
      },
      {
        question: "Can you redesign an existing site without rebuilding it?",
        answer:
          "Often yes, and it is usually the cheaper call. If the structure is sound, reworking the type, spacing, hierarchy and key pages gets most of the benefit for a fraction of a rebuild. I will look at what you have and tell you which one you actually need.",
      },
      {
        question: "Do I get the Figma files?",
        answer:
          "Yes, shared with you and yours to keep, with components and styles named so another designer or developer can pick them up without a handover call. Withholding source files to keep a client dependent is common and not something I do.",
      },
      {
        question: "Do you design in Figma?",
        answer:
          "Yes. Files are shared with you and stay accessible, with components and styles named so another designer or developer can pick them up without a handover call.",
      },
      {
        question: "Can you design without building it?",
        answer:
          "Yes, design-only engagements are common. You get files built to be handed to a developer, with states and breakpoints specified rather than left implied, which is usually where design-only handovers go wrong.",
      },
      {
        question: "How many revision rounds are included?",
        answer:
          "Two rounds of structured feedback at each stage, which is enough for genuine iteration without turning into an open-ended loop. Anything beyond that is quoted, and I will say so before the work happens rather than after.",
      },
    ],
  },

  "graphic-design-branding": {
    blocks: [
      {
        heading: "A system, not a folder of one-off assets",
        paragraphs: [
          "The problem with commissioning design piece by piece is that the fifth asset no longer matches the first. Colours drift, type sizes are improvised, and the brand is whatever the last supplier felt like doing that week.",
          "A brand system fixes the decisions once: the palette and where each colour is allowed to be used, the type scale, spacing, logo behaviour at small sizes and on photography, and the rules for campaign creative. Anyone producing work afterwards, including you, has something to check against.",
        ],
      },
      {
        heading: "Launch and campaign creative",
        paragraphs: [
          "Most of my recent brand work has been launch creative for property, where a single development needs a coherent look across social, portal listings, brochures, hoardings and the landing page, produced quickly and consistently under a launch deadline.",
          "That work is built to be extended. Templates and a defined set of rules mean the tenth asset takes a fraction of the time the first did, and still belongs to the same brand, which is what makes design economics work over a campaign rather than a single post.",
        ],
      },
      {
        heading: "Deliverables and file handover",
        paragraphs: [
          "You get working source files, not only flattened exports: layered originals, logo lockups in vector at the sizes and colourways you will actually need, and a written guideline document covering the decisions rather than only showing the outcome.",
          "Exports are supplied at the specifications each channel actually needs, which sounds small and saves a great deal of back and forth once ten people start asking for the logo in different formats.",
        ],
      },
      {
        heading: "How a brand project actually runs",
        paragraphs: [
          "It starts with questions rather than moodboards: who is buying, what they are comparing you against, and what the business needs the brand to signal. A brand that looks excellent and says the wrong thing about price or seriousness is an expensive mistake.",
          "From there it is direction, usually two or three routes rather than a dozen, then refinement of one, then application across the pieces you will actually use. Reviewing routes as full applications rather than logos on white is what stops the common outcome of approving a mark that then falls apart on a hoarding or a phone screen.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you design logos?",
        answer:
          "Yes, though a logo on its own is rarely what a business actually needs. A mark without a defined palette, type scale and usage rules drifts within months as different people apply it differently. The logo is one deliverable inside a brand system.",
      },
      {
        question: "What is the difference between a logo and a brand identity?",
        answer:
          "A logo is one asset. A brand identity is the set of decisions that make everything else consistent: colours and where each is allowed to be used, type scale, spacing, how the logo behaves at small sizes and over photography, and the rules for campaign creative.",
      },
      {
        question: "Do you do print as well as digital?",
        answer:
          "Yes, including brochures, hoardings and sales material, supplied print-ready with bleed and colour handled properly rather than a screen file sent to a printer and hoped for.",
      },
      {
        question: "Can you design a company profile or pitch deck?",
        answer:
          "Yes. These are usually the highest-value design a service business owns, because they are what a buyer reads when deciding whether you are serious, and most are built in a hurry from a template.",
      },
      {
        question: "How much does branding cost?",
        answer:
          "It depends whether you need a focused identity or a full system across print and campaign templates. The honest answer is that I will scope it after understanding who is buying from you and what the brand has to signal, not before.",
      },
      {
        question: "Do I get the editable source files?",
        answer:
          "Yes. Layered source files and vector logo artwork are handed over as standard. Withholding them to keep a client dependent is common practice and not something I do.",
      },
      {
        question: "Can you refresh a brand without starting again?",
        answer:
          "Usually yes, and often it is the better call. If the brand has recognition, a refresh that tightens the type, fixes the palette and defines the missing rules gets you most of the benefit without discarding what people already recognise.",
      },
      {
        question: "How long does a brand project take?",
        answer:
          "Two to four weeks for a focused identity with guidelines, longer if it extends into a full system across print and campaign templates. The variable is rarely the design time, it is how quickly feedback comes back and how many people need to agree, so I would rather know who the decision-maker is at the start than discover it at round three.",
      },
      {
        question: "Do you do print as well as digital?",
        answer:
          "Yes, brochures, hoardings and sales material included, supplied print-ready with bleed and colour handled properly rather than as a screen file sent to a printer and hoped for.",
      },
    ],
  },

  "crm-marketing-automation": {
    blocks: [
      {
        heading: "The measurement problem underneath everything",
        paragraphs: [
          "Almost every reporting argument I get called into is really a tracking problem. Marketing counts leads one way, sales counts them another, and both numbers are defended for weeks because neither is verifiable. The disagreement is not about performance, it is about definitions nobody wrote down.",
          "The fix is unglamorous: agree what a lead is, make the form capture it that way, make the CRM store it that way, and make the ad platform optimise towards that same event. Once the same definition runs end to end, the reporting argument disappears because there is only one number.",
        ],
      },
      {
        heading: "CRM set up to be used, not admired",
        paragraphs: [
          "I work with HubSpot, Zoho and Salesforce. The platform matters less than whether the pipeline stages match how your team actually sells, because a CRM that does not reflect reality gets worked around within a fortnight and then holds data nobody trusts.",
          "Automation is added where it removes real work: routing enquiries to the right person, chasing follow-ups that would otherwise be forgotten, and moving records between stages on genuine triggers. Automating a broken process only makes it break faster, so the process gets fixed first.",
        ],
      },
      {
        heading: "Server-side tracking, and why it now matters",
        paragraphs: [
          "Browser-based tracking has been degrading for years through ad blockers, privacy defaults and shortened cookie lifetimes. The practical result is that platforms undercount conversions, then optimise against an incomplete picture, and your cost per acquisition looks worse than it is.",
          "Server-side tracking through the Conversions API sends conversion data from your server rather than the visitor's browser, which is both more accurate and more durable. It is set up with consent handling in place, because attribution that ignores consent is a liability rather than an asset, particularly under UAE PDPL and GDPR.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is a CRM and do I actually need one?",
        answer:
          "It is the system that holds every enquiry and what happened to it afterwards. You need one the moment enquiries are being tracked in someone's inbox or a spreadsheet, because that is the point at which leads start going missing without anyone noticing.",
      },
      {
        question: "Can you connect my website forms to my CRM?",
        answer:
          "Yes, and it is usually where the real value is. A form that emails you is not a system: it cannot tell you which campaign produced the lead, whether anyone followed up, or what happened next.",
      },
      {
        question: "Do you set up WhatsApp automation?",
        answer:
          "Yes, including routing enquiries into WhatsApp and pushing them into the CRM at the same time so a conversation on a phone does not become the only record of a lead.",
      },
      {
        question: "What is server-side tracking and do I need it?",
        answer:
          "Browser tracking has been degrading for years through ad blockers and privacy defaults, so platforms undercount conversions and then optimise against an incomplete picture. Server-side tracking sends the conversion from your server instead, which is more accurate and more durable. You need it if you are spending meaningfully on ads.",
      },
      {
        question: "Can you fix our existing tracking rather than rebuild it?",
        answer:
          "Usually yes, and I will audit it first. Most tracking problems are a handful of wrong definitions rather than a broken setup, and finding that out costs less than a rebuild.",
      },
      {
        question: "Which CRM should we use?",
        answer:
          "It depends on team size, sales process and budget rather than on which is best in the abstract. HubSpot is the easiest to adopt, Zoho is the most cost-effective at scale, Salesforce is the most configurable and the most expensive to run. I will recommend one and explain the trade-off rather than defaulting to whichever pays a partner commission.",
      },
      {
        question: "Can you migrate our existing data?",
        answer:
          "Yes, including deduplication and field mapping. Migration is usually where the hidden work is, because legacy data is rarely as clean as people remember, and I would rather find that in week one than in week six.",
      },
      {
        question: "Is server-side tracking compliant?",
        answer:
          "It can be, and it is how I set it up: consent captured before tracking fires, and consent state respected downstream. I am not a lawyer and this is not legal advice, so for a formal position on UAE PDPL or GDPR you should speak to a qualified professional.",
      },
    ],
  },

  "video-conversion": {
    blocks: [
      {
        heading: "Video that has a job to do",
        paragraphs: [
          "Video is expensive to produce and easy to waste. A film that wins compliments internally and moves nothing commercially is a common and costly outcome, usually because nobody decided what it was for before it was made.",
          "So the brief starts with the job: stopping the scroll in a feed, explaining a product to someone already interested, or reassuring a buyer who is close to deciding. Those are three different edits, three different lengths and three different opening seconds, and a single film rarely does all three well.",
        ],
      },
      {
        heading: "Editing for the platform, not just for the story",
        paragraphs: [
          "Most social video is watched muted, on a phone, in a feed that offers something else every second. That makes the first frame, the crop and the subtitles part of the edit rather than an afterthought, and it means the vertical cut is planned rather than salvaged from a horizontal one.",
          "Most of my recent editing has been property and B2B: development walkthroughs, launch films and campaign cutdowns, delivered in the aspect ratios and durations each placement actually needs rather than one master everyone is told to make do with.",
        ],
      },
      {
        heading: "Conversion work is measurement first",
        paragraphs: [
          "Conversion rate optimisation gets sold as a list of best practices, most of which are someone else's test result from a different audience. What actually moves a rate is looking at where people leave your specific funnel, forming a view about why, and testing that.",
          "That means session recordings and funnel data before opinions, changes made one at a time so the result is attributable, and enough traffic for the outcome to mean something. On a low-traffic site the honest answer is often that you cannot test your way there yet, and the money is better spent on traffic or on fixing something already obviously broken.",
        ],
      },
      {
        heading: "What actually gets tested first",
        paragraphs: [
          "The order matters. Page speed and obvious friction come before anything clever, because a page that takes six seconds on mobile data loses people who never see whatever you were planning to test. Then the offer and its clarity, then form length, then layout.",
          "Headline and button colour tests are where most CRO programmes start and where most of them stall, because those are small effects that need large traffic to detect. Fixing something structurally broken produces a bigger change than any number of micro-tests, and costs less to find.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you shoot video or only edit?",
        answer:
          "My side is editing, motion and post-production. For shooting I work alongside production teams, which is the arrangement I have with Choppershoot, where I handle the digital side rather than the camera.",
      },
      {
        question: "Do you make reels and short-form video?",
        answer:
          "Yes, cut for the platform rather than exported once and reused. Most social video is watched muted on a phone, so the first frame, the crop and the subtitles are part of the edit rather than an afterthought.",
      },
      {
        question: "What is conversion rate optimisation?",
        answer:
          "Making more of the visitors you already have take action, rather than buying more visitors. It starts with looking at where people actually leave your funnel, forming a view about why, and testing that, rather than applying a list of best practices from someone else's audience.",
      },
      {
        question: "Can you edit property walkthrough and launch videos?",
        answer:
          "Yes, this is most of my recent editing work: development walkthroughs, launch films and campaign cutdowns, delivered in the aspect ratios and durations each placement actually needs.",
      },
      {
        question: "How long does a video take?",
        answer:
          "An edit from supplied footage is usually days rather than weeks. The delay is almost always feedback rounds and music or licensing decisions, so agreeing who approves it before we start saves the most time.",
      },
      {
        question: "Do you shoot video or only edit?",
        answer:
          "My side is editing, motion and post-production. For shooting I work alongside production teams, which is exactly the arrangement I have with Choppershoot, where I handle the digital side rather than the camera.",
      },
      {
        question: "How much traffic do we need before CRO is worth doing?",
        answer:
          "Enough for a difference to be distinguishable from noise, which in practice means a few hundred conversions a month before formal A/B testing tells you much. Below that, fixing clearly broken things and improving clarity is a better use of money than testing.",
      },
      {
        question: "Can you improve conversion without redesigning the site?",
        answer:
          "Often yes. Form length, the clarity of the offer, page speed and where the primary action sits are frequently worth more than a redesign, and they are far cheaper to change. I would rather exhaust those first.",
      },
    ],
  },
};
