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
        question: "Do you work with WordPress, or only Next.js?",
        answer:
          "I build new work in Next.js because it is faster and cleaner for the marketing sites and applications I am usually asked for. I can maintain and improve an existing WordPress site, and I will tell you plainly when a rebuild is not worth the money and a fix is.",
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
