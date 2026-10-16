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

import type { Faq } from "./types";
import { spellCount } from "./serviceCategories";
import { yearsExperience } from "@/lib/site";

/** `paragraphs` may carry inline links written as `[label](/path)`. Only
 *  internal paths: the page renders them with `next/link`, and the text
 *  corpora (llms-full.txt, the site search) keep the label and drop the path
 *  through `plainText()` in `src/lib/inlineLinks.ts`.
 *
 *  `table` renders after the paragraphs. Added 2026-10-16 for the CMS
 *  comparison, the first service page whose argument is a comparison. */
export type DepthTable = { caption: string; head: string[]; rows: string[][] };
export type DepthBlock = { heading: string; paragraphs: string[]; table?: DepthTable };
export type { Faq };

type Depth = { blocks: DepthBlock[]; faqs: Faq[] };

export const serviceDepth: Record<string, Depth> = {
  // Added 2026-10-02. The three categories built this week had no depth entry
  // and ran 649-797 words against 1,145-1,316 for the established ones. This
  // file exists because Search Console reported 48 URLs as "Crawled, currently
  // not indexed" when the category pages averaged 250 words, so shipping three
  // thin pages and waiting would have repeated a solved problem.
  //
  // Mobile first, because the measured numbers make it the most commercially
  // valuable service on the site: "mobile app developer dubai" 720 searches at
  // difficulty 16 with a **$113.13 CPC**, "mobile app development dubai" 1,900
  // at 23 and $92.99, "mobile app development company dubai" 1,600 at 29 and
  // **$176.83**. Nothing else on the board is close; the web design terms sit
  // around $8.
  // Added 2026-10-02, same reason as mobile above: 797 words against 1,145 to
  // 1,316 on the established pages, and this file exists because Google
  // declined to index 48 thin pages here once already.
  //
  // Measured: "seo consultant dubai" 480 searches at difficulty 29 with a
  // **$74.66 CPC**, "seo consultant in dubai" 140 at 13, and the long-tail
  // "freelance seo consultant dubai" showing 0 volume at difficulty 4 — which
  // means below Ubersuggest's measurement floor rather than no demand.
  //
  // "seo agency in dubai" is 8,100 at $95.89 and stays excluded (item 325).
  "seo": {
    blocks: [
      {
        heading: "What an SEO consultant in Dubai does first, and why it is the smallest part",
        paragraphs: [
          "Most sites I audit are not held back by keywords. They are held back by things underneath: pages a crawler cannot read properly, titles that describe the company instead of the search, headings that run two words together, structured data that is absent or broken, and a server that takes a second to answer before anything else can start.",
          "None of that is glamorous and most of it is a few days of work. It is also the part that has to be right before content can do anything, because a page Google struggles to read will not rank however well it is written. I would rather find a technical problem and fix it in a week than sell you six months of content on a site that cannot carry it.",
        ],
      },
      {
        heading: "Local search in Dubai is a different game",
        paragraphs: [
          "For most commercial searches here, the first thing on the page is not an organic result. It is an AI overview, then a local pack of three businesses, then People Also Ask. Organic position one can be the sixth thing a person sees, and on some terms nearly half of searchers click nothing at all.",
          "That changes what is worth chasing. A term where the local pack dominates is won through a Google Business Profile and reviews rather than through content, and no amount of writing will get you above it. Part of the job is telling you which of your terms are like that, because funding a year of content for a page you cannot reach is the most expensive mistake in this field.",
        ],
      },
      {
        heading: "Winnable is a number, not an opinion",
        paragraphs: [
          "Before writing anything I want two figures for each target: how many backlinks the current top ten carry, and what is already occupying the first page. Those decide whether content can win the term at all. A term where the top ten average forty thousand backlinks is not a content problem, it is a different sport.",
          "This site is the worked example. The head term for its own field has a top ten averaging 47,700 backlinks; the qualified version of the same term has ten to twenty-four. Same service, same city, and the difference between a year of wasted writing and a reachable page is one word in the search.",
        ],
      },
      {
        heading: "Reported against enquiries, not rankings",
        paragraphs: [
          "Rankings move for reasons that have nothing to do with you, and a report full of green arrows next to terms nobody searches is the oldest trick in this industry. Before work starts I want conversion tracking firing on a real enquiry and leads landing in your CRM with their source attached. Without that, neither of us can tell SEO from luck.",
          "What you should get monthly is which queries produced enquiries, which pages those people landed on, and what changed. Position is a diagnostic in that report, not the headline.",
        ],
      },
      {
        heading: "AI search is becoming a separate problem",
        paragraphs: [
          "Being quoted inside ChatGPT, Gemini or a Google AI Overview is not the same as ranking below one, and the work is not identical. It rewards structured data an assistant can parse, claims specific enough to be checkable, and content organised around questions rather than around keyword density.",
          "The search volume for the term itself is still near zero, so this is not something to buy as a product yet. It is something to build into the work: the structured data, the answer-shaped content and the crawler access that make a page citable cost almost nothing extra when done alongside everything else.",
        ],
      },
      {
        heading: "What I will not promise",
        paragraphs: [
          "Number one on a term you name, by a date. Anyone offering that is either describing a search nobody uses or has not checked who they would have to displace. What I will give you before any money moves is an honest read on which of your terms are reachable, which need paid instead, and roughly how long the reachable ones take.",
          `I am also one person rather than an agency, which is a real limit as well as a real advantage. You get the work done by someone with ${spellCount(yearsExperience())} years behind it instead of by a junior under an account manager. You get one person's capacity. If you need six deliverables a week across several channels, an agency is genuinely the better answer and I will say so on the call.`,
        ],
      },
    ],
    faqs: [
      {
        question: "Will you need access to my site to do this?",
        answer:
          "Yes, and the level depends on the platform. For WordPress an admin login; for a custom build, access to the repository or a developer I can hand specific changes to. I will also want Search Console and Analytics access, which are read-only and the two places the actual answers live. If you do not have Search Console set up, that is the first thing we do and it is free.",
      },
      {
        question: "Do you write the content as well?",
        answer:
          "Yes, and for most sites that is where the time goes once the technical work is done. If you have a writer, I give them the brief: the query, the questions to answer, the competing pages and what they miss. That usually produces better work than me writing in a voice that is not yours.",
      },
      {
        question: "What if my competitors have thousands of backlinks?",
        answer:
          "Then that term is not winnable with content and I will tell you early. But it is worth checking rather than assuming, because the qualified versions of the same search are often held by sites with almost none. A competitor of mine ranks first for a term in this market on six backlinks. Volume and authority are far less correlated here than people expect.",
      },
      {
        question: "How is this different from what an SEO agency does?",
        answer:
          "In the deliverables, often not much. In who does them, entirely. The audit, the fixes and the writing are done by the person you briefed. The trade is capacity and continuity: one person has a ceiling and takes holidays. Decide which of those two things your situation needs more.",
      },
    ],
  },

  // Added 2026-10-02. 649 words, the thinnest of the three new categories.
  //
  // Measured: "freelance web designer dubai" 170 searches at difficulty 20 with
  // an **$8.37 CPC** — real demand, and notably the cheapest clicks of any
  // service here, which is worth knowing when deciding where to spend effort.
  // "web design freelancer dubai" shows 0 at difficulty 4.
  //
  // The head term "web design" is not a target: difficulty 60, top ten
  // averaging 47,700 backlinks (roadmap 319).
  "web-design": {
    blocks: [
      {
        // Carries the search phrase into a subheading, worth 8 points on the
        // scorer and, more to the point, the only place in 1,804 words a reader
        // scanning headings would have seen what this page is for.
        heading: "What a web designer in Dubai decides before anything is drawn",
        paragraphs: [
          "What the first screen has to say, how few steps stand between interest and an enquiry, what gets cut: those settle how a site performs, and they are mostly made before anything is drawn. A page that looks excellent and buries the one thing a visitor came for is a cost, not an asset, and no amount of visual craft rescues it.",
          "So the early conversation is about who lands on each page, what they already know, and what you want them to do next. The visual work comes after, and it is much faster once those are agreed. Starting with the look is how projects end up with six rounds of revisions that are really arguments about strategy.",
        ],
      },
      {
        heading: "Designed on a phone, because that is where the visitors are",
        paragraphs: [
          "Most traffic in this market arrives on a phone, usually from an ad or a social post, often on a connection that is not the office wifi. A design signed off on a 27-inch monitor and squeezed down afterwards tends to produce a phone layout nobody chose: the hero crops badly, the form is below three screens of scrolling, and the call button is where a thumb cannot reach.",
          "Designing the narrow layout first forces the hard choices early, which is exactly why it works. If something does not earn its place on a phone, it rarely earns it on a desktop either.",
        ],
      },
      {
        // "responsive website design dubai", 210 searches at difficulty 28, and
        // the page said "responsive" exactly once despite the section above
        // being entirely about responsive behaviour. The subject was covered.
        // The word a buyer actually searches for was not.
        heading: "Responsive website design, which is more than a layout that shrinks",
        paragraphs: [
          "Responsive design gets treated as a technical checkbox, and the usual implementation is one layout that reflows until it fits. That produces pages that are technically responsive and practically unusable: a table scrolled sideways, a navigation that becomes a hamburger hiding the only link that matters, text at eleven pixels because it was sized for a desktop column.",
          "A responsive design is a set of deliberate layouts, not one layout under stress. What gets reordered on a narrow screen, what gets hidden and what gets replaced with something better suited. A pricing table that works as three columns on a monitor usually works as three stacked cards on a phone, and that is a design decision somebody has to make.",
          "The test I use is simple and it is not a device width. Can someone standing up, one-handed, on a weak connection, do the one thing the page exists for? If not, the layout is responsive and the design is not.",
        ],
      },
      {
        // "wordpress web design dubai", 110 searches at difficulty 9, which is
        // among the lowest on the tracked list. The page mentioned WordPress
        // once, in passing, despite it being a genuine part of the offer.
        heading: "WordPress web design, when it is the right answer",
        paragraphs: [
          "Plenty of Dubai businesses are told they need a custom build when what they need is a site their own team can edit without calling anyone. If your marketing person wants to add a page on a Tuesday afternoon, WordPress is usually the honest recommendation, and I will give it even though a custom build is better paid work.",
          "The version worth having is not a purchased theme with twenty plugins stacked on it. It is a design made for your business and built into WordPress properly, so the editing experience makes sense to a non-technical person and the site is not carrying code for features you do not use. Most slow WordPress sites are slow because of what was installed, not because of WordPress.",
          "Where it stops being the right answer: anything with real custom functionality, a product rather than a site, or a business that will never edit a page and is paying a maintenance cost for flexibility it does not use. That conversation happens before the quote, not after.",
          // Added 2026-10-16. This page keeps the design query; the build
          // query ("wordpress developer dubai") has its own page now, and the
          // two link to each other rather than competing.
          "This page is about the design. If the design is settled and what you need is the build itself, a custom theme, Elementor or ACF, and forms that reach your CRM, that is the [WordPress development](/services/wordpress-development) page, and the [CMS comparison](/services/cms-development) sets WordPress against Wix, Squarespace and Strapi.",
        ],
      },
      {
        heading: "Speed is a design decision before it is a technical one",
        paragraphs: [
          "Most slow sites are slow because of what was designed into them: a full-screen video header, a carousel of uncompressed photographs, four webfonts, and a stack of third-party scripts each loading on every page. Those are choices made in the design, and no amount of optimisation afterwards fully undoes them.",
          "This site runs 100 on both desktop and mobile in Lighthouse, with layout shift at zero. That is not a tuning achievement, it is the result of deciding early what the page does not need to load.",
        ],
      },
      {
        heading: "Designed around the enquiry, not around the template",
        paragraphs: [
          "A template decides the shape of your page before anyone has asked what it is for, and the result usually reads like every other site using it. That is fine for a brochure and expensive for a page you are sending paid traffic to, where the gap between a good layout and an adequate one shows up directly in cost per enquiry.",
          "The part most sites get wrong is the ask. One clear action per page, repeated where a reader is actually ready rather than only at the bottom, and a form that requests the minimum. Every extra field costs you completions, and most forms collect three things nobody ever reads.",
        ],
      },
      {
        heading: "Handover, and what you own",
        paragraphs: [
          "If someone else builds what I design, the handover is where quality usually leaks. A file a developer can build from has the states drawn rather than implied: hover, focus, error, empty, loading, and the breakpoints between. Without those, a developer invents them, and the result is a site that resembles the design rather than matching it.",
          "You own the design files, the domain and the hosting account, regardless of who builds it. That sounds like a formality until the relationship ends and you discover the site is somewhere you cannot reach.",
          // Added 2026-10-16. The file and the handover have their own page
          // now ("figma designer dubai"); this page keeps the web designer
          // query and links across.
          "How the file itself is made, from clickable prototypes for sign-off to components and the build in WordPress or Next.js, is on the [Figma design](/services/figma-design) page.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can you redesign without rebuilding everything?",
        answer:
          "Often, yes, and it is usually the better value. Many sites need the homepage, the main service page and the enquiry flow rather than all forty pages. I would rather fix the three that carry the traffic than quote a full rebuild you do not need.",
      },
      {
        question: "Do you work with my developer?",
        answer:
          "Yes. I hand over a file they can build from and, if you want, review the build against the design before launch. That review is worth more than it sounds: it is where the small differences that add up get caught, while they are still cheap to fix.",
      },
      {
        question: "How many revisions do I get?",
        answer:
          "Enough to get it right, and the honest answer is that rounds are a symptom rather than a unit. Projects that need six usually did not settle the strategy before the design started. If we agree who the page is for and what it has to do first, the visual revisions are normally small and few.",
      },
      {
        question: "Will my site rank better after a redesign?",
        answer:
          "Not automatically, and a redesign done carelessly makes it worse. The usual damage is URLs changing without redirects, which throws away whatever ranking history those pages had. This site had to repair exactly that after a migration, so it is not a theoretical risk. Keep the URLs, or redirect every one of them.",
      },
    ],
  },

  // Added 2026-10-16. "figma designer dubai" and "figma to website". About the
  // file and the handover, deliberately not about what a site should say (web
  // design) or how a product is used (UI/UX); the last block says so and links
  // both. The word "plugins" is avoided on purpose: the two Figma plugin
  // articles own that search on the site (`search-check`).
  "figma-design": {
    blocks: [
      {
        heading: "What a Figma designer in Dubai should hand you",
        paragraphs: [
          "A good Figma file is a specification, not a picture. Pages are organised so anyone can find the screen they need, layouts use auto layout so they resize the way the built page will, and every repeated element is a component, so changing a button once changes it everywhere. Colours, type sizes and spacing are saved as styles and variables rather than typed in by hand on each frame.",
          "Above all, the file shows the states a developer would otherwise have to invent: hover and focus, error and success on forms, empty and loading screens, long names that wrap, and the breakpoints between phone, tablet and desktop. When those are missing, the built site resembles the design rather than matching it, and that gap is where quality goes.",
        ],
      },
      {
        heading: "Prototypes for stakeholder sign-off",
        paragraphs: [
          "Decisions here often involve several people: an owner, a sales director, a marketing manager, sometimes a consultant for the developer. A static mockup invites each of them to picture the site differently. A clickable Figma prototype removes the guessing. Everyone taps through the same flow on their own phone, from the ad's landing page to the thank-you screen, and comments directly on the frame they mean.",
          "Changing a decision in a prototype takes minutes. Changing it after the build takes days and usually breaks something else. So sign-off happens on the prototype, with the comments resolved in the file, and the build starts from an agreed design rather than from a conversation people remember differently.",
        ],
      },
      {
        heading: "Design systems and components that keep it consistent",
        paragraphs: [
          "For anything that will grow, a website with many page types, an app, a family of landing pages, the file is built on a small design system: variables for colour, type and spacing, components with variants for each size and state, and a shared library other files can use. An Arabic version gets right-to-left variants designed rather than mirrored at the last moment.",
          "The system is scaled to the job. A single campaign landing page does not need a library, and building one would be time you pay for and never use. The test is simple: if a second designer, or you in a year, will need to add a page that looks like it belongs, the components earn their keep.",
        ],
      },
      {
        heading: "Figma to website: WordPress or Next.js",
        paragraphs: [
          "Figma to website is where many good designs lose their quality, because the person building has to interpret the file. I build from my own files, and from other designers', with the components mapped one to one: Figma components become WordPress blocks or React components, variables become CSS variables or Tailwind tokens, and spacing comes across as designed rather than eyeballed.",
          "WordPress is the choice where your team will edit the site every week, covered on [WordPress development](/services/wordpress-development). Next.js is the choice where speed, custom functionality or a connection to your CRM matters more, covered on [custom web development](/services/custom-web-development). Either way, the build is checked against the file at every breakpoint before launch, and assets are exported at the sizes the page actually uses.",
        ],
      },
      {
        heading: "Designing landing pages around the campaign",
        paragraphs: [
          "Because I also run the campaigns, landing page design in Figma starts from the ad, not from a blank frame. The first screen repeats the ad's promise, the form is drawn at its real length on a phone, and the events the page has to track, such as a form submission, a WhatsApp click or a brochure download, are marked in the file so the build includes them and GA4 and the Meta Pixel can record them.",
          "Variants for testing are designed together, so a headline test or a shorter form can go live without a second design round. This page is about the file and the handover. What a site should say and do is on [web design](/services/web-design), and how a product is used, screen by screen, is on [UI/UX design](/services/ui-ux-design).",
        ],
      },
      {
        heading: "When you do not need a Figma file",
        paragraphs: [
          "Not every project needs a Figma stage, and paying for one you do not need delays the launch. A quick campaign landing page that follows an existing brand and an existing page layout can be built straight in code, or in a CMS template your team already uses, and changed in the browser where everyone can see it. The same goes for small edits to a live site and for pages that reuse components already in a design system.",
          "In those cases I skip the file and build the page directly, on [WordPress](/services/wordpress-development) or in Next.js, with the tracking and lead form set up the same way. A Figma file earns its cost when several people have to agree on a new design before it is built, when the work is a new site or app, or when the design will be handed to another developer.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can you work from a design another designer made in Figma?",
        answer:
          "Yes. I review the file first for missing states, inconsistent spacing and components that are really one-off frames, and tell you what needs finishing before the build. Small gaps I fill in to match the original; larger ones I raise with you or the designer, so the design stays theirs.",
      },
      {
        question: "Do you use Dev Mode?",
        answer:
          "Where your Figma plan includes it, yes, and it helps when another developer builds from the file, because measurements, variables and assets are easier to inspect. When I build it myself, the file is still prepared as if someone else would, because the next developer might.",
      },
    ],
  },

  // Added 2026-10-04. Shipped at 784 words in the same commit that created the
  // page, which repeats the Phase 2 mistake: this file exists because Google
  // declined to index 48 thin pages here.
  //
  // It also resolves a real overlap. `/services/paid-marketing` renders the
  // same "Google Ads & Performance Max" scope section, because a group's items
  // drive both its menu links and its page sections. One shared section between
  // a hub and its spoke is normal and not a penalty, but only while the spoke is
  // plainly the deeper treatment. At 784 words it was not; at ~1,800 it is.
  // Added 2026-10-04 in the same commit that created the page, rather than in a
  // follow-up for the third time. 757 words without it.
  "facebook-ads": {
    blocks: [
      {
        heading: "Why Facebook ads in Dubai produce low-cost leads and expensive meetings",
        paragraphs: [
          "Instant forms are the most common thing wrong with Meta accounts in this market. They produce leads at a cost per lead that looks excellent on the report and a meaningful share of them are not real prospects: somebody tapped twice between two videos and the form filled itself from their profile without being read.",
          "The report says AED 12 a lead. The sales team says half the numbers do not answer and a third were never interested. Both are true, and only one of them is in the dashboard. The number to hold the account to is cost per qualified conversation, which usually makes a slightly more expensive lead the cheaper one.",
        ],
      },
      {
        heading: "Friction in the right place",
        paragraphs: [
          "The fix is not a longer form, which lowers volume without raising quality. It is one question an idle tapper will not bother to answer and a genuine buyer will: a budget band, a timeframe, which development. One well-chosen question removes most of the accidental submissions and keeps almost all of the real ones.",
          "Then speed. A Meta lead decays in minutes, not days, because the person was not looking for you and will have moved on by the afternoon. If the follow-up is a call the next working day, the form quality barely matters.",
        ],
      },
      {
        heading: "Creative is the targeting",
        paragraphs: [
          "Audience settings matter far less here than on search, because the algorithm finds the people who respond to the creative faster than any targeting you can specify. A video of one specific unit will find the people interested in that kind of unit. A generic brand film will find nobody in particular.",
          "Which means production is most of the work, and it is where most property campaigns in Dubai underinvest. Renders cut for a brochure perform badly in a vertical feed against video shot for it. Several rough cuts tested quickly beats one polished film, and the winner is regularly the one that looked worst in the edit.",
        ],
      },
      {
        heading: "Tracking that survives the browser",
        paragraphs: [
          "Browser-based pixel tracking loses a meaningful share of conversions to ad blockers, privacy settings and iOS, and it loses them silently. The account optimises towards the conversions it can still see, which is a biased sample of the real ones.",
          "Server-side tracking through the Conversions API closes most of that gap, and feeding the qualified status back changes what the platform looks for. Tell Meta success is a form fill and it finds people who fill forms. Tell it success is a qualified enquiry and the targeting shifts underneath you.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can you fix an account someone else is running?",
        answer:
          "Usually, and the audit comes first: what is actually being tracked, what the form asks, and where the spend is going. That is a four-hour session at AED 3,500 with written recommendations you can hand to whoever runs it. Often the answer is a form question and a tracking fix rather than a new agency.",
      },
      {
        question: "What about WhatsApp ads?",
        answer:
          "Click-to-WhatsApp converts well in this market and is worth testing against lead forms, because the conversation starts in the channel people actually reply in. It needs the WhatsApp Business API connected to your CRM or the conversation stays on somebody's personal phone and leaves with them.",
      },
      {
        question: "Why do you call it Facebook when it is Meta?",
        answer:
          "Because that is what people in Dubai type. \"Meta ads dubai\" has no measurable search volume; \"facebook ads dubai\" has ninety searches a month. The company renamed itself in 2021 and the searches did not follow. Naming the page after the brand rather than the search would cost real visitors.",
      },
    ],
  },

  // Added 2026-10-04 with the page.
  "linkedin-marketing": {
    blocks: [
      {
        heading: "What LinkedIn marketing in Dubai actually costs you, and buys you",
        paragraphs: [
          "A click here costs several times what it does on Meta, and the comparison is misleading. On Meta you pay a little to reach a lot of people, most of whom are irrelevant. On LinkedIn you pay a lot to reach exactly the heads of procurement at companies over a certain size in a named industry, which no other platform can do.",
          "So the arithmetic only works for audiences that are narrow and valuable. A commercial property deal or a B2B contract justifies a high cost per click. A residential apartment usually does not, and I would rather say so before the budget moves than after.",
        ],
      },
      {
        heading: "Organic usually beats paid here",
        paragraphs: [
          "LinkedIn rewards posts from people far more than posts from company pages, and in this market a founder posting regularly will outperform a funded company page without much contest. It costs time rather than money, and the time is not transferable: a ghost-written post in a voice nobody recognises performs like an advert.",
          "The sensible sequence is organic first, then ads amplifying what already earned engagement. Running cold ads to an audience that has never seen you is the expensive way to find out whether the message works.",
        ],
      },
      {
        heading: "Targeting that is worth the premium",
        paragraphs: [
          "Job title, seniority, company size, industry, and the companies themselves by name. For an account-based approach where you can list the fifty organisations worth reaching, nothing else comes close, and the cost per click stops being the relevant number.",
          "The trap is going too broad to bring the price down, which removes the only reason to be on the platform. Narrow is the point. If the targeting is wide enough that Meta could have reached them, use Meta.",
        ],
      },
    ],
    faqs: [
      {
        question: "How small can a LinkedIn budget be?",
        answer:
          "Smaller than people expect if the audience is genuinely narrow, because a few thousand of the right people do not take much to reach. What does not work is a small budget against a broad audience: you reach a fraction of them once and learn nothing.",
      },
      {
        question: "Do you write the content as well?",
        answer:
          "I will draft and structure it, and for a founder's own profile the voice has to stay theirs or it reads as ghost-written, which on LinkedIn is obvious and counterproductive. The usual arrangement is that I give the structure and the angle and the founder writes the words.",
      },
      {
        question: "Is LinkedIn worth it in the UAE specifically?",
        answer:
          "For B2B and commercial property, yes, and the professional audience here is unusually concentrated. For consumer products, almost never. The question is not the market, it is whether the people you need can be described by job title.",
      },
    ],
  },

  "google-ads": {
    blocks: [
      {
        heading: "The first week of Google Ads in Dubai is spent finding what you are paying for",
        paragraphs: [
          "Google will happily spend a budget on searches that were never going to convert, and the default settings help it. The expensive part of most accounts is not the bid, it is the breadth: broad match reaching for anything loosely related, no negative list, and a search terms report nobody has read since launch.",
          "So the first work is subtraction. Pull the search terms report, see what you actually showed for, and build the negative list from reality rather than from a template. In Dubai property that single exercise routinely removes a third of the spend without touching a bid, because a large share of the traffic is brokers, students and people researching a city they are not buying in.",
        ],
      },
      {
        heading: "Brand and category are separate campaigns",
        paragraphs: [
          "Someone searching your company name has already decided. Someone searching your category has not. Running both in one campaign means the cheap, high-converting brand clicks flatter the whole thing, the category terms look better than they are, and you keep funding something that is not working because the blended number looks fine.",
          "Split them and the picture becomes honest. It also stops you paying full price to appear above your own organic result, which is a cost worth measuring rather than assuming. For some businesses bidding on your own name is defensive and correct, because competitors bid on it. For others it is a tax you are paying to Google for traffic you already had.",
        ],
      },
      {
        heading: "Performance Max comes later, with brand excluded",
        paragraphs: [
          "Performance Max is given a budget and a goal and reports back very little about where the money went. That is manageable once you know which terms and audiences convert, and close to unmanageable before. Running it first is how accounts end up spending well with nothing learned.",
          "When it does go in, brand searches are excluded. Without that exclusion it quietly absorbs the people who were already looking for you, counts their conversions as its own, and reports a cost per acquisition that cannot be true.",
        ],
      },
      {
        heading: "Dubai costs what it costs, and some terms are not worth buying",
        paragraphs: [
          "Click prices here are high in several sectors because you are bidding against portals and agencies with budgets you will not match. Property is the clearest example: the portals occupy the first page and outbid almost everyone on the obvious terms.",
          "That is not always a problem to be solved. Sometimes the honest answer is that a term is not worth buying at any price, and the budget belongs on narrower searches with less competition and more intent. I would rather tell you that in week one than take a management fee for losing an auction every day.",
        ],
      },
      {
        heading: "The landing page is part of the campaign",
        paragraphs: [
          "Sending paid traffic to a homepage wastes a meaningful share of what you paid for. The page should match the ad, load fast on a phone, and ask for the minimum. Most of the gap between two accounts with the same budget is not in the bidding, it is in what happens after the click.",
          "This is where building and marketing in the same pair of hands actually pays. The page is built to the campaign rather than handed over as a brief, and when the data says the form is the problem, the form changes that week rather than entering someone else's backlog.",
        ],
      },
      {
        heading: "Reported in enquiries, not clicks",
        paragraphs: [
          "Before a dirham is spent I want conversion tracking firing on a real enquiry rather than a page view, and server-side tracking through the Conversions API where the browser alone no longer reports reliably. Without that the optimisation is guesswork dressed as data.",
          "What you should get monthly is cost per qualified enquiry, which searches produced them, and what changed. Impressions and click-through rate are diagnostics in that report, not the headline. If the account cannot produce that, fixing it comes before anything else.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can you audit my existing account before I commit?",
        answer:
          "Yes, and it is usually the sensible first step. A four-hour review at AED 3,500 covers the structure, the search terms report, what is actually being tracked and where the waste is, with written recommendations you can hand to whoever runs the account. If that turns out to be enough, it is enough.",
      },
      {
        question: "Do you charge a percentage of ad spend?",
        answer:
          "No. A percentage fee pays me more when you spend more, which is the wrong incentive on a channel where the best advice is often to spend less. My rates are published: projects from AED 31,500, retainers from AED 16,000 a month. Ad spend is paid to Google and is never part of a quote.",
      },
      {
        question: "What if my account was built by someone else?",
        answer:
          "That is most of them. I work inside your account rather than rebuilding in mine, so the conversion history stays yours. Some accounts need restructuring and some need a negative list and a week of attention. I will tell you which after looking rather than before.",
      },
      {
        question: "How long should I commit for?",
        answer:
          "Three months is a reasonable first commitment. The first fortnight is mostly finding out what you are really showing for, and anything shorter judges the account on its learning period. Be wary of twelve-month minimums offered before anyone has looked at the data.",
      },
    ],
  },

  "mobile-app-development": {
    blocks: [
      {
        heading: "One codebase, two platforms, one set of fixes",
        paragraphs: [
          "React Native builds iOS and Android from the same code. That means one build rather than two, and one set of fixes for as long as the app exists, which is the part that matters more. An app is not a project that finishes; it is a thing you keep paying for. With two native codebases, every fix, every OS update and every new screen gets done twice.",
          "Native earns its cost when an app leans hard on hardware in a way the bridge handles badly, and that is rarer than it is claimed to be. The LEOS app on this site is built in React Native for iOS and Android from one codebase. If your requirement genuinely needs native, I will tell you, and I will tell you it costs more to build and to keep.",
          // Added 2026-10-16 with the four pages under this one.
          "How the React Native build itself works is on the [React Native development](/services/react-native-development) page. The store-specific work has its own pages, one for an [iOS app developer](/services/ios-app-development) and one for an [Android app developer](/services/android-app-development), and the database, APIs and admin panel behind the app are on [app back-end development](/services/app-backend-development).",
        ],
      },
      {
        heading: "What does mobile app development in Dubai cost?",
        paragraphs: [
          "My published project minimum is AED 31,500 and app projects normally sit well above it, because an app is three things rather than one: the app itself, the back end holding the data, and the admin side you use to run it. A quote that looks surprisingly low is usually pricing the first and leaving the other two out.",
          "What moves the number, in order: custom functionality such as payments, live tracking, chat or offline use; the integrations with systems you do not control; building for two platforms, which costs less with React Native than with native but is never free; and the design, where every state is a screen and there are more of them than anyone expects.",
          "Then maintenance, which is not optional and is the line most commonly missing from a budget. Operating systems update twice a year and can break things, store rules change, certificates expire. An app nobody maintains stops working, usually inside about eighteen months.",
        ],
      },
      {
        heading: "Android is not an afterthought here",
        paragraphs: [
          "A lot of UAE app projects are designed on an iPhone and tested on an iPhone, then shipped to an Android audience that is larger. Android devices span a far wider range of screens, OS versions and processing power, and a layout that holds on the newest phone can break on a three-year-old one that half your users carry.",
          "So Android gets tested on real devices rather than on the one simulator that always passes. Back button behaviour, keyboard handling, deep links and notification permissions all differ, and each is the kind of detail that looks trivial until a user hits it on their first run and never opens the app again.",
        ],
      },
      {
        // "android app development dubai", 260 searches at difficulty 26. The
        // page had an Android section and never used the phrase a buyer types.
        //
        // 2026-10-16: the phrase moved to its own page,
        // /services/android-app-development, and this heading no longer carries
        // it, so the two pages do not compete for one query (roadmap 398 §5).
        // The section stays, shorter on Play Store detail, and links across.
        //
        // Later the same day the Android page was retitled "Android App
        // Developer in Dubai", because its old title contained "app
        // development in Dubai" and competed with this page. The phrase came
        // back here, where the rest of "app development in Dubai" lives.
        heading: "Android app development in Dubai: half the work, most of the market",
        paragraphs: [
          "Android is the majority platform across much of this region, and it is routinely treated as the version that gets done second and tested least. The symptoms are familiar: a layout built to iOS proportions, a back gesture that does nothing, notifications that behave differently and nobody checked, and testing done on one recent flagship rather than on the four-year-old device a real customer is using.",
          "Building cross-platform in React Native means the Android app is not a port. It is built in the same pass from the same codebase, which removes the budget pressure that usually causes the shortcuts. What still needs separate attention is the platform behaviour: navigation conventions, permissions, background limits, notification channels, and the Play Store's own review rules, which differ from Apple's.",
          "Testing happens on real Android hardware rather than only in an emulator, including older devices and weak connections, because that is the condition most of your users are actually in. The detail, Play Console and device testing included, is on the [Android app developer](/services/android-app-development) page.",
        ],
      },
      {
        heading: "Analytics go in during the build, not after launch",
        paragraphs: [
          "The most common thing wrong with an app I inherit is that nobody can say where users stop. There is a download number, a vague sense that engagement is low, and no event data to explain either. Retrofitting that after launch means a release cycle, a store review, and waiting weeks for enough data to mean anything.",
          "Putting it in during the build costs almost nothing. Screen views, the two or three actions that actually matter for your business, and the drop-off points you already suspect. Then the first month of real usage answers questions instead of raising them, and the second release is aimed at something you measured rather than something you assumed.",
        ],
      },
      {
        heading: "The store listing is a conversion page",
        paragraphs: [
          "Most of the people who see your app never download it, and the decision happens on the store listing in a few seconds. The first two lines of the description, the icon and the first screenshot carry almost all of it. Treating that page as paperwork to be completed at the end is how good apps get bad install rates.",
          "It is also where the app meets search. App Store and Play Store listings are indexed, and so is the web page you point your campaigns at. Because I run the campaigns as well as build the app, the listing, the landing page and the ads say the same thing, which is harder to achieve than it sounds when three suppliers own the three pieces.",
        ],
      },
      {
        heading: "The accounts are yours from the first submission",
        paragraphs: [
          "Apps get submitted under your Apple Developer and Google Play accounts, not mine. This sounds like a formality and is not: an app published under a supplier's account cannot be updated, transferred or taken down without that supplier, and transferring it afterwards is a process rather than a click.",
          "The same applies to the analytics property, the push notification service and any backend. You should own every account the app depends on. If a developer resists that, it is worth asking why, because the answer is usually that it makes you harder to leave.",
        ],
      },
      {
        heading: "What it costs, and what moves the number",
        paragraphs: [
          "Project work starts at AED 31,500 and an app is usually well above that, because the scope is wider than a website by definition: two platforms, a backend, store submission, and the review cycle. I would rather give you a range after seeing what the app has to do than a figure now that we both know is a guess.",
          "What moves it most: whether the app needs its own backend or can use what you already run, how many screens genuinely differ rather than repeat, whether payments are involved, and whether offline use is a requirement. Those four decisions account for most of the difference between a straightforward build and a long one.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can you take over an app someone else built?",
        answer:
          "Often, and the first thing I would do is read the code before quoting, because inherited React Native projects vary enormously. Some are clean and a handover takes days. Some are three years of patches on an abandoned version and the honest answer is that rebuilding costs less than maintaining. I will tell you which one you have before you commit to anything.",
      },
      {
        question: "Do I need an app at all, or will a mobile site do?",
        answer:
          "A fair question and the answer is often the site. An app earns its cost when you need push notifications, offline use, device hardware, or a genuinely repeat relationship with the same user. If what you need is for your website to work properly on a phone, that is a far cheaper problem and I would rather tell you that than sell you an app.",
      },
      {
        question: "How much does app maintenance cost?",
        answer:
          "Budget for it rather than being surprised by it. iOS and Android both ship changes that break things, store requirements shift, and the first months of real usage always surface something. Whether that is a retainer with me or a handover to your own team depends on how much the app changes after launch, and I will be straight about which makes sense.",
      },
      {
        question: "Can you do the launch campaign too?",
        answer:
          "That is the reason to use one person rather than a development shop and an agency. The tracking is built in rather than retrofitted, the store listing is written as a conversion page, and the campaign is planned against the same funnel. Most apps are built by one supplier and marketed by another, and the join is exactly where the measurement disappears.",
      },
    ],
  },

  // React Native, iOS, Android and app back end, added 2026-10-16. See the note
  // in `serviceCategories.ts`. Store rules named below (TestFlight, App
  // Tracking Transparency, Play testing tracks, the Data safety form) are
  // general properties of Apple's and Google's platforms, not figures. The
  // LEOS sales application is linked as the published example of a property
  // sales tool, without stating which framework it was built in; the LEOS
  // mobile app is the React Native case study.
  "react-native-development": {
    blocks: [
      {
        heading: "What a React Native developer in Dubai should be building",
        paragraphs: [
          "React Native suits the large majority of business apps: screens of lists, forms, search, maps, media, accounts and notifications. That covers customer apps, booking apps, loyalty and content apps, and the internal tools sales teams use. For those, one React Native codebase produces a real app for iPhone and Android, using each platform's own interface components, and every later change is made once.",
          "It is the wrong tool for a narrow set of apps: games and constant heavy graphics, deep custom hardware work, or a product whose value depends on the newest Apple or Google features on the day they ship. If yours is one of them, I will say so. The fuller argument, written so you could use it against me, is in [native vs cross-platform](/native-vs-cross-platform-app-development).",
        ],
      },
      {
        heading: "Sales apps for real estate: 3D views, CRM data and live project data",
        paragraphs: [
          "Much of my app work is for property sales teams, and it shapes how I build. A sales app is used in front of a buyer, on a tablet in a sales centre or a phone in a meeting, so it has to be fast, obvious and right. The work has included 3D views of buildings and floors a buyer can rotate, unit availability read from the CRM so it is true at the moment it is shown, and live project data such as pricing, payment plans and construction progress.",
          "Two examples written up as case studies show the range. The [LEOS mobile app](/portfolio/leos-developments/mobile-app) is a React Native app for iOS and Android from one codebase. The [LEOS sales application](/portfolio/leos-developments/sales-app) shows the same thinking on a showroom touch screen: every development in one place, 3D floor plates and availability from the CRM.",
        ],
      },
      {
        heading: "Performance is designed in, not tuned afterwards",
        paragraphs: [
          "Most slow React Native apps are slow for the same few reasons: long lists rendered all at once, images downloaded at full size, and screens that re-render whenever anything changes. Long lists use virtualised components, explained in [FlatList vs ScrollView](/react-native-flatlist-vs-scrollview), images are sized and cached, and state is structured so a change redraws only what it affects.",
          "The app is then measured on the phones your customers carry, which in this market includes plenty of mid-range Android devices, not only the newest iPhone on the developer's desk. Start-up time, scrolling and memory are checked on real hardware before each release, because an app that stutters on first launch rarely gets a second one.",
        ],
      },
      {
        heading: "Tracking and the marketing side",
        paragraphs: [
          "Analytics go in during the build. Screen views and the handful of events that matter to the business, such as an enquiry, a booking or a brochure download, are sent to Firebase Analytics and GA4, and to Meta and Google where app campaigns are running. Deep links let a campaign open the app on the right screen rather than its home page, which is often the difference between an install and a lead.",
          "Leads created in the app go to your CRM with their source, the same as a website enquiry, through the [app back end](/services/app-backend-development). The store listings are written as conversion pages, and each store has its own rules, covered on the [iOS app developer](/services/ios-app-development) and [Android app developer](/services/android-app-development) pages.",
        ],
      },
      {
        heading: "Releases, updates and handover",
        paragraphs: [
          "Builds run through Expo's build service or the native toolchains, and every release goes to testers first, TestFlight on iOS and a testing track on Android, before the public stores. Small JavaScript fixes can ship as over-the-air updates within the stores' rules, so a typo does not need a full review cycle.",
          "The code is TypeScript in a repository you own, and the Apple and Google accounts are yours from the first submission. Handover includes how to build and release, so another developer could pick the app up. If you are still deciding whether you need an app at all, the [mobile app development](/services/mobile-app-development) page starts there.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can React Native apps work offline?",
        answer:
          "Yes. Data can be stored on the device and synced when the connection returns, which suits sales teams in show apartments or on site visits where signal is poor. Offline support adds work, mainly in deciding what happens when two people change the same record, so it is scoped deliberately rather than assumed.",
      },
      {
        question: "Can the app share code with our website?",
        answer:
          "Some of it. Business rules, validation, API clients and types can be shared between a React Native app and a React or Next.js website, especially in one repository. Screens are built separately, because a phone and a browser need different interfaces, but the rules behind them stay the same in both.",
      },
    ],
  },

  "ios-app-development": {
    blocks: [
      {
        heading: "What an iOS app developer in Dubai handles beyond the code",
        paragraphs: [
          "Building the screens is the part people picture. The rest is Apple's: an app has to run well across the iPhones still in use, follow the Human Interface Guidelines closely enough to feel at home, declare exactly what data it collects, ask for permissions at the right moment, and pass App Review before anyone can download it. Each of those can delay a launch, and each is predictable if it is planned from the start.",
          "I build iOS apps in React Native rather than Swift. The result is a real iOS app using Apple's own interface components, and the same code ships to Android, which matters to most businesses here. Where an app genuinely needs Swift, such as for heavy graphics or the newest Apple frameworks on day one, a native iOS developer is the better hire, and I will tell you before you commit.",
        ],
      },
      {
        heading: "iPhone, and the iPad in the sales centre",
        paragraphs: [
          "Most apps are designed for the iPhone first, and that is right for customer apps. Sales teams are different. In property especially, the iPad is the presentation device: a sales manager sits beside a buyer and walks them through projects, floor plans and availability on a ten or eleven-inch screen. An iPhone layout stretched to that size wastes it.",
          "So iPad layouts are designed for the larger screen, often with a list and its detail side by side, and tested in landscape, which is how tablets sit on a sales desk. For a tablet dedicated to one app in a showroom, iOS features such as Guided Access keep it locked to that app. The [React Native development](/services/react-native-development) page covers the sales apps this work comes from.",
        ],
      },
      {
        heading: "TestFlight, App Review and the rules that cause rejections",
        paragraphs: [
          "Every build goes to TestFlight before the App Store. Your team installs it on their own iPhones and iPads, uses it for real and reports problems, and external testers can be invited after Apple's beta review. That is where most issues are caught, while they are inexpensive to fix.",
          "App Review then checks the app against Apple's guidelines. The usual rejections are avoidable: a demo login the reviewer can use, a privacy policy that matches what the app does, no placeholder content or broken links, and payments for digital goods going through Apple's in-app purchase where the rules require it. Releases can also be phased, so an update reaches users gradually and a problem can be paused before it reaches everyone.",
        ],
      },
      {
        heading: "Privacy labels, permissions and App Tracking Transparency",
        paragraphs: [
          "Every App Store listing carries privacy details that state what the app collects and why, and they have to match what the app and its third-party tools actually do. Analytics and advertising SDKs count, so they are listed before submission rather than discovered by a reviewer. The same thinking applies to the UAE PDPL: collect what the app needs and say so plainly.",
          "Permissions are asked for in context. A request for notifications on first launch is usually refused; the same request after a buyer saves a property, explaining that they will hear about price changes, usually is not. Tracking users across other companies' apps and websites requires Apple's App Tracking Transparency prompt, and many people decline it, so app campaigns are measured with that in mind rather than with numbers that assume everyone said yes.",
        ],
      },
      {
        heading: "When a native Swift build is the better call",
        paragraphs: [
          "React Native is not the right tool for every iPhone app, and the honest answer matters more than the booking. A native Swift build is the better call when the app is built around Apple hardware or frameworks: augmented reality with ARKit, heavy real-time graphics or video processing, deep Apple Watch, widget or CarPlay work, or a feature that depends on an Apple framework released this year. It is also the better call when the app will only ever be on iPhone and you already have, or plan to hire, an iOS team that works in Swift.",
          "In those cases I will say so before we start and recommend you hire a Swift developer for the app. I can still own the parts around it that I do build: the [app back end](/services/app-backend-development), the tracking, the App Store listing and the campaign that sends people to download it.",
        ],
      },
      {
        heading: "Push notifications and the App Store listing",
        paragraphs: [
          "Push notifications go through Apple's notification service, usually via Firebase Cloud Messaging or Expo, from an [app back end](/services/app-backend-development) that decides who receives what. Fewer, relevant messages keep people from switching notifications off: a viewing reminder, a price change on a saved unit, a launch they registered for.",
          "The App Store listing is a conversion page. The name, subtitle, keywords, screenshots and the first lines of the description decide most installs, and App Store Connect can produce campaign links so you can see which campaign brought each download. Leads from the app reach your CRM with their source, the same as a web enquiry. The Android side is on the [Android app developer](/services/android-app-development) page.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can the app run on iPad as well as iPhone?",
        answer:
          "Yes. React Native supports iPad, and the layouts are designed for the larger screen rather than stretched, with a list and its detail side by side where a sales manager needs both. Apple reviews iPad support too, so if the app offers it, it has to work well on it.",
      },
      {
        question: "What is TestFlight?",
        answer:
          "Apple's beta testing service. Builds are uploaded and sent to internal testers in your team, or to external testers after a short Apple review, so the people who will use the app can try it on their own devices before it reaches the public App Store.",
      },
    ],
  },

  "android-app-development": {
    blocks: [
      {
        heading: "What an Android app developer in Dubai has to plan for",
        paragraphs: [
          "Android is not one platform in the way iOS is. Samsung, Xiaomi, Oppo, Huawei and others ship their own versions of it on phones that range from flagships to budget models several years old, with different screen sizes, memory and battery rules. An app that is only tested on one recent phone will meet the rest for the first time in the hands of a customer.",
          "There is a regional detail worth knowing early. Recent Huawei phones ship without Google Play services, so features that depend on them, such as Firebase push notifications and Google sign-in, need an alternative or are accepted as a gap, and Huawei has its own store, AppGallery. Whether that matters depends on your audience, and it is decided before the build rather than after the first complaint.",
        ],
      },
      {
        heading: "React Native, not Kotlin, and why that suits most apps",
        paragraphs: [
          "I build Android apps in React Native rather than Kotlin. The app is a real Android app using Android's own components, and it shares its code with the iOS version, so a feature or a fix is built once. For the kind of apps most businesses need, the difference to a user is not visible; the difference to a budget is.",
          "What does not come for free is Android's own behaviour, and it is built deliberately: the system back gesture, how the keyboard pushes a form up, runtime permissions, notification channels a user can switch off one at a time, and background limits that some phone makers apply more strictly than others. The shared build is covered on the [React Native development](/services/react-native-development) page.",
        ],
      },
      {
        heading: "Testing across the range, not on one flagship",
        paragraphs: [
          "Testing happens on real devices across ages and price points, not only in the emulator. Small screens, large font settings, Arabic right-to-left layouts, low memory and weak connections each find different problems, and each reflects someone in your audience. A form that hides its submit button behind the keyboard on a small phone is a lost lead that no report will explain.",
          "Where a wider spread of devices is needed than a desk can hold, a device cloud such as Firebase Test Lab runs the app across many more models. Crashes and slow screens in production are reported back through crash reporting, so problems on a particular model show up as data rather than as one-star reviews.",
        ],
      },
      {
        heading: "Google Play Console: listing, testing tracks and policy",
        paragraphs: [
          "Apps are published through Google Play Console under your organisation's account. Builds go first to internal testing, then closed or open testing tracks, and releases to the public can be staged so an update reaches a share of users first. New personal developer accounts must complete a closed test with real testers before publishing, which is one reason a business should publish under an organisation account.",
          "Each app also needs its Data safety section, which declares what data is collected and shared, a content rating and a target audience, and it has to meet Google Play's current target API level. The store listing is a conversion page: a short description of up to 80 characters, screenshots that show the app doing its job, and custom store listings where a campaign deserves its own version.",
        ],
      },
      {
        heading: "Tracking installs and leads from Android",
        paragraphs: [
          "Google Play passes campaign details to the app through the Play Install Referrer, so installs can be attributed to the campaign that produced them, and app campaigns in Google Ads and Meta use that data to find more of the right users. In-app events, an enquiry, a booking, a brochure download, go to Firebase Analytics and GA4 so you can see what installs turn into.",
          "Leads created in the app should land in the same CRM as everything else, with their source attached, which is the job of the [app back end](/services/app-backend-development) and the [CRM integration](/services/crm-integration) behind it. The iPhone side of the same app is on the [iOS app developer](/services/ios-app-development) page.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can an internal app be distributed without the public Play Store?",
        answer:
          "Yes. A sales team app can be published privately through managed Google Play and installed on company devices by your device management, such as Microsoft Intune, so it never appears in the public store. That is safer than sending installation files around, which bypasses Play's checks and your device policies.",
      },
      {
        question: "Will notifications work the same as on iPhone?",
        answer:
          "Not exactly. Android groups notifications into channels that users can switch off one by one, asks for permission on recent versions, and some phone makers restrict background activity to save battery. Each is planned for, so a reminder about a viewing arrives when it should.",
      },
    ],
  },

  "app-backend-development": {
    blocks: [
      {
        heading: "What app back-end development in Dubai covers",
        paragraphs: [
          "Take one tap: a buyer presses Book a viewing. The app checks who they are, saves the request, checks the slot is still free, notifies the right agent, sends the lead to the CRM with the campaign that brought them, and confirms by push notification. None of that happens on the phone. It happens in the back end: the database, the authentication, the APIs, the functions that run on events, and the integrations with your other systems.",
          "That is why app quotes that leave the back end vague are the ones that grow. It is also where most of the long-term cost sits, because the back end is what has to stay secure, stay up and keep serving older versions of the app that people have not updated.",
        ],
      },
      {
        heading: "Firebase or MongoDB: how they compare",
        paragraphs: [
          "The two back ends I build on suit different apps. Firebase, mainly Firestore, Authentication, Cloud Functions and Cloud Messaging, gets an app live quickly and makes realtime updates simple. MongoDB, with an API in Node and Express, takes longer to set up and gives you control over the data, the queries and where everything runs. The table sets out the differences that usually decide it.",
        ],
        table: {
          caption: "How Firebase and MongoDB with Node and Express compare as an app back end",
          head: ["What matters", "Firebase (Firestore)", "MongoDB with Node and Express"],
          rows: [
            ["Realtime updates", "Built in: screens update the moment data changes", "Possible with change streams and sockets, built for the app"],
            ["Authentication", "Firebase Authentication: email, phone, Google and Apple sign-in ready to use", "Built into the API, or an authentication provider alongside it"],
            ["Offline use", "Offline caching and sync built into the client libraries", "Built in the app, with local storage and a sync step"],
            ["Querying and reporting", "Fast simple queries; joins and complex reports are limited", "Rich queries and aggregation; suits reporting"],
            ["Cost as you grow", "Pay per read, write and stored data; low to start, can climb with heavy reading", "Pay for server and database size; more predictable at volume"],
            ["Lock-in", "Higher: Google's APIs and data model", "Lower: open-source database that runs on any cloud"],
            ["Best for", "Chat, live updates, first versions, apps with simple data", "Business apps with complex data, reporting and integrations"],
          ],
        },
      },
      {
        heading: "Node and Express APIs the app can rely on",
        paragraphs: [
          "An API built in Node and Express sits between the app and the database. Every request is checked: who is asking, whether they are allowed, and whether the data they send is valid, before anything is written. Responses are shaped for the screens that use them, so the app downloads what it shows and no more, which matters on mobile data.",
          "Versioning is the part apps need that websites do not. When a new version of the app ships, plenty of people keep the old one for weeks, so the API keeps serving both until the old version can be retired. Requests are logged, errors alert someone, and MongoDB collections are indexed for the queries the app actually makes, which keeps it quick as the data grows.",
        ],
      },
      {
        heading: "Admin panels your team runs the app from",
        paragraphs: [
          "An app without an admin panel needs a developer for every change. The admin panel, built in React or Next.js, is where your team adds a project, updates prices or availability, manages users, reads enquiries and sends push notifications to a chosen group. Roles limit who can do what, so a sales coordinator can update availability without being able to delete a project.",
          "The same back end can power your website as well as the app, so a listing added once appears in both. That web side is covered on [custom web development](/services/custom-web-development), and the app it serves on [React Native development](/services/react-native-development).",
        ],
      },
      {
        heading: "CRM sync, tracking and security",
        paragraphs: [
          "Leads, bookings and sign-ups created in the app are sent to your CRM with their source, by API or webhook, and updates from the CRM, such as availability or a lead's owner, flow back. The connection is logged and retried, because an integration that fails quietly loses leads without anyone noticing. How the CRM side is set up is on [CRM integration](/services/crm-integration).",
          "Security follows least privilege. Firebase security rules or API checks ensure each user reads only their own data, keys and secrets stay on the server rather than inside the app, data is encrypted in transit, and backups are tested. Both Firebase and MongoDB let you choose the cloud region your data is held in, and the options vary by service, so the region is checked against your requirements, including the UAE PDPL, before setup.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can the same back end serve the app and the website?",
        answer:
          "Yes, and it should when they share users or data. A Node and Express API, or Firebase, can serve a React Native app, a Next.js website and an admin panel at once, so a booking made on a phone appears on the website straight away and your team manages both from one place.",
      },
      {
        question: "Where is the data stored, and does it have to stay in the UAE?",
        answer:
          "Both Firebase and MongoDB let you choose the cloud region your data is held in, and the available regions differ by service. Whether your data must stay in the UAE depends on your sector and the data itself, under the UAE PDPL and any sector rules. I set up the region you decide on, but for a formal position on data residency please consult a qualified legal professional.",
      },
    ],
  },

  "paid-marketing": {
    blocks: [
      {
        heading: "Paid marketing in Dubai starts with the tracking, not the spend",
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
        heading: "Social media marketing in Dubai, by one person rather than a department",
        paragraphs: [
          "Social media marketing in Dubai is sold in two shapes. An agency assigns you an account manager, a strategist, a designer and a community person, and you speak to the account manager. A low-cost freelancer sends you fifteen posts a month and nothing else happens. Neither is what most businesses here actually need.",
          "What this is: one social media manager who writes the strategy, designs the creative, schedules and posts it, watches the inbox, and runs the paid budget behind it. Fewer people means fewer handovers, and in social that matters more than in most work because the gap between an idea and a post is where tone goes to die.",
          "Scope is agreed per month rather than sold as a package with a number of posts on it, because posting volume is the least useful thing to buy. Three posts that say something beat fifteen that fill a grid, and a calendar built to hit a quota is how a brand ends up posting on International Pancake Day.",
        ],
      },
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
        // "social media management dubai" is 480 searches at a $106.58 CPC,
        // the most expensive click measured anywhere on this site's board, and
        // "social media management in dubai" another 590. The page covered
        // management thoroughly and never used the phrase.
        heading: "Social media management in Dubai, which is the part most people hand back",
        paragraphs: [
          "There is a difference between social media marketing and social media management, and most suppliers quietly sell the first while the client assumed the second. Marketing is the strategy and the creative. Management is the daily work: scheduling, posting at the hours your audience is actually awake, answering comments, routing the direct message that is really an enquiry to somebody who can close it.",
          "Management is where most arrangements fail, because it is unglamorous and continuous and nobody puts it in a proposal. A folder of beautiful assets delivered on the first of the month is not management, and a business that has to post them itself has bought design, not social.",
          "Here it is included. The calendar is agreed ahead, the posting happens on schedule, and the inbox is monitored on working days. Where a message is a genuine enquiry it goes to you with the context attached, not left in an app nobody opens at the weekend.",
        ],
      },
      {
        // "instagram marketing dubai", 170 searches at difficulty 15, which is
        // low for this cluster. Instagram is the platform most UAE clients mean
        // when they say social, and the page named it only in passing.
        heading: "Instagram marketing in Dubai, and why it is not the whole answer",
        paragraphs: [
          "Instagram is what most UAE businesses mean when they say social media, and for a lot of them it is the right first channel: visual, local, and where the audience already is. Reels reach beyond your followers, which is the one organic distribution still genuinely working, and the UAE audience is on it heavily.",
          "What it does not do is close. Instagram is a discovery channel, and a business judging it by follower count rather than by enquiries will be pleased with a number that means nothing. The measure is how many people moved from a post to a conversation, which is why the profile link, the direct message routing and the landing page behind it matter more than the grid.",
          "LinkedIn carries a different audience and converts differently for anything B2B. TikTok reaches further and converts less reliably. Which combination is right depends on who is buying from you, and that is a conversation worth having before anyone commits to a content calendar.",
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
        // Written to be quotable. An AI answering "what does digital marketing
        // cost in Dubai" needs a short factual answer under a heading matching
        // the question, with the figures as text rather than inside an image or
        // a chart. That is the shape that gets lifted and attributed, and it
        // costs a human reader nothing because it is the same thing they came
        // to find out.
        heading: "What does digital marketing cost in Dubai?",
        paragraphs: [
          "Project work starts at AED 31,500 and monthly retainers at AED 16,000, with a one-off review session at AED 3,500. Those are my own published rates rather than a market average, and ad spend is separate in every case.",
          "What moves the number is scope rather than the number of channels. A single campaign with one landing page and the tracking behind it is a different project from a monthly retainer running five channels with content feeding them. The honest shortcut: if your total monthly budget including ad spend is under about AED 20,000, a retainer is the wrong shape and a one-off project or a review session will serve you better.",
          "Agency retainers in this market generally start above the freelance range and climb with scope, because an office, an account manager and a project manager sit in the quote whether or not your project benefits from them. That is a fair trade on a large programme with several stakeholders and poor value on a single-channel campaign.",
        ],
      },
      {
        // "digital marketing in dubai" is 1,300 searches, larger than every
        // term in this page's existing cluster combined, and "digital
        // marketing services dubai" another 880. Both are claimable because
        // they describe a service rather than a company. The 4,400-search
        // "digital marketing agencies dubai" stays excluded for the same
        // licence reason as "seo agency in dubai" in item 325.
        heading: "What digital marketing in Dubai actually involves",
        paragraphs: [
          "Digital marketing is a category rather than a service, which is why quotes for it vary by a factor of ten. What sits under it here: paid advertising across Google, Meta, TikTok, Snapchat and LinkedIn; search visibility, meaning both classic SEO and the AI answers that increasingly sit above it; email and WhatsApp; the content that feeds all three; and the tracking that tells you which of them produced an enquiry.",
          "The Dubai specifics change the shape of it more than people expect. The market is small enough that a national campaign is a city campaign, competitive enough that cost per click is high by international standards, and multilingual enough that an English-only funnel leaves money behind. WhatsApp is a primary channel here rather than an afterthought, and the response window people expect on it is measured in minutes.",
          "Digital marketing services in Dubai are usually bought as a bundle and delivered as separate projects, which is where the margin goes. Running them as one sequence, with the same person deciding what the landing page says and what the ad promises, is the practical difference between a campaign that leaks and one that compounds.",
          "All of it is run by one freelance digital marketing specialist rather than split across a team, which is the trade worth understanding before you hire either way. An agency gives you capacity and cover. A freelancer gives you the person who decides what the ad promises also deciding what the landing page says, which is where most campaigns lose their money.",
          "Performance marketing is the half of this that is judged on a number rather than on reach: cost per enquiry, cost per qualified lead, cost per sale. That is the half I am usually hired for, and it is also the half that cannot be done honestly without the tracking being right first, which is why the tracking goes in before the spend starts rather than after somebody asks why the reporting does not add up.",
        ],
      },
      {
        // "whatsapp marketing dubai", 90 searches at a $33.22 CPC. The work is
        // already in the service list and the depth never covered it.
        heading: "WhatsApp marketing, which in this market is not optional",
        paragraphs: [
          "WhatsApp is the default business channel across the UAE, and treating it as a support inbox rather than a marketing channel leaves the most responsive audience you have untouched. People who ignore an email reply on WhatsApp within the hour.",
          "What that looks like in practice: click-to-WhatsApp as the primary action on a campaign rather than a form, so somebody can enquire in two taps from a phone; an automated first reply that qualifies rather than says we will get back to you; broadcast campaigns to an opted-in list for launches and offers; and the whole thing connected to your CRM so a conversation becomes a record with a next action against it.",
          "Consent matters and the rules are not optional. Messaging people who have not opted in gets a number blocked, and the UAE has its own data protection regime on top of the platform's rules. Build the list properly or the channel stops working, and take proper advice on your own obligations from a qualified professional.",
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
        // "digital marketer in uae" is 390 searches at difficulty 11 and four
        // competitors rank for it. Every page on this site says Dubai. Nothing
        // said UAE, so the term had nowhere to land. Also carries "digital
        // marketing specialist" (260) and "strategist" (170), neither of which
        // appeared anywhere despite describing the work accurately.
        heading: "Working as a digital marketer across the UAE, not only in Dubai",
        paragraphs: [
          "Most of the work is Dubai, because most of the clients are. The market is not, and a campaign built only around Dubai search behaviour leaves money on the table in Abu Dhabi, Sharjah and the Northern Emirates, where competition is usually thinner and cost per enquiry lower.",
          "What that changes in practice is targeting and language rather than the strategy. Search volumes differ by emirate, the Arabic to English split differs, and the hours people respond on WhatsApp differ. Those are settings on a campaign, not a different campaign, and they are the sort of thing that gets missed when everything is configured once for the UAE as a single market.",
          "The title varies with who is asking. A digital marketing specialist is usually the person running the channels. A digital marketing strategist is usually the person deciding which channels, with what budget split, and what counts as the measurement. In a business of this size both are the same person, and that person should be able to explain why the plan is what it is rather than only execute it.",
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
        heading: "What a freelance web developer in Dubai should be building around",
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
          "Where your own team needs to edit the site, the choice between WordPress, Wix, Squarespace and Strapi is on the [CMS development](/services/cms-development) page. Portals, dashboards and calculators, and the hosting behind them, are on [custom web development](/services/custom-web-development).",
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
          "Next.js and React for websites and marketing tools, written in TypeScript, React Native for mobile apps, and the MERN stack (MongoDB, Express, React, Node.js) for custom applications and dashboards. PostgreSQL where relational data and reporting matter more than document flexibility, and PHP for existing systems. On the CMS side: WordPress (with Elementor and ACF), Wix, Squarespace and Strapi.",
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

  // The CMS hub and its four platforms, plus custom web development, added
  // 2026-10-16. See the note above them in `serviceCategories.ts`. Every
  // platform claim below is a general, checkable property of the platform
  // (what it can export, what it bundles, what needs a plan or a plugin), not a
  // figure; no prices beyond pointing at /pricing, no client beyond LEOS.
  "cms-development": {
    blocks: [
      {
        heading: "What CMS development in Dubai should start with",
        paragraphs: [
          "Most businesses here pick a CMS because a friend uses it, an agency resells it or a template looked good. Then the site goes live, the marketing starts, and the platform turns out to be wrong for the job: the sales team cannot add a project page without a developer, or next week's campaign landing page cannot carry the tracking the ads need.",
          "So the choice is made against five questions, in this order. Who edits the site, and how comfortable are they with software? How much content is there, and does it come in English and Arabic or more? What is the real budget, including running costs for the next two years? How fast does the site need to be on a phone on mobile data? And what does it have to talk to: Google Ads, Meta, GA4, a CRM such as HubSpot, Zoho or Salesforce, WhatsApp?",
        ],
      },
      {
        heading: "WordPress, Wix, Squarespace and Strapi compared",
        paragraphs: [
          "The short version is in the table. Each platform has its own page with the detail: [WordPress development](/services/wordpress-development), [Wix development](/services/wix-development), [Squarespace development](/services/squarespace-development) and [Strapi development](/services/strapi-development).",
        ],
        table: {
          caption: "How WordPress, Wix, Squarespace and Strapi compare for a marketing-led website",
          head: ["What matters", "WordPress", "Wix", "Squarespace", "Strapi"],
          rows: [
            ["Who edits it", "A marketing team, several editors", "The owner, one or two people", "The owner, usually design-minded", "Editors in a structured admin; a developer owns the front end"],
            ["Content volume", "Hundreds of pages and posts", "Small to medium", "Small and image-led", "Large, structured, reused across channels"],
            ["Running cost", "Hosting, updates and plugin licences", "A monthly plan, little else", "A monthly plan, little else", "Hosting for the CMS and the front end, plus developer time"],
            ["Speed", "Good when built lean, slow when overloaded", "Acceptable, limited control", "Acceptable, limited control", "The fastest of the four, with a Next.js front end"],
            ["Tracking and CRM", "Full control: GTM, server-side, any CRM", "Built-in integrations; custom code on paid plans", "Built-in integrations; code injection on some plans", "Full control, built into the front end"],
            ["Leaving later", "Easy: your files, any host", "Hard: the design stays on Wix", "Hard: only some content exports", "Easy: your code, your database"],
            ["Best for", "Content-heavy marketing sites", "Small business sites and quick campaign pages", "Portfolios and brochure sites", "Multilingual listings, a site plus an app"],
          ],
        },
      },
      {
        heading: "When none of them is the answer",
        paragraphs: [
          "Sometimes the site is not really a content site. A payment plan calculator, a portal brokers log into, a dashboard that reads from your CRM, a page that has to load instantly on a weak connection: forcing those into a CMS produces a plugin stack nobody can maintain. That is [custom web development](/services/custom-web-development), and the honest recommendation is to build it properly rather than bend a CMS around it.",
          "Often the answer is both: a CMS for the pages the marketing team edits every week, and a custom build for the one tool that does something no plugin does. They can share a domain, a design and the same tracking.",
        ],
      },
      {
        heading: "Built for the campaigns that send it traffic",
        paragraphs: [
          "This is the part most CMS projects skip. Before launch, every form is tested end to end: the submission reaches the CRM with the campaign source attached, GA4 records the conversion, and the Meta Pixel and Google Ads tags fire on the right event and only on that event. Google Tag Manager goes in on every platform that allows it, so tags can change later without a developer.",
          "SEO is set up the same way: clean URLs, editable titles and descriptions on every page, a sitemap, redirects for anything that moved, and page speed checked on a phone rather than on an office connection. A site that cannot be measured cannot be improved, whatever platform it runs on. The campaign side of this is on the [digital marketing](/services/digital-marketing) page.",
        ],
      },
      {
        heading: "What it costs to run, not just to build",
        paragraphs: [
          "The launch quote is the smaller number. WordPress needs hosting, updates and security patches every month, and a site with thirty plugins needs more of that than one with eight. Wix and Squarespace bundle all of it into a subscription that is hard to leave, because neither exports a working site to another host. Strapi needs hosting for the CMS and for the front end, and a developer on call.",
          "None of that is a reason to avoid any of them. It is a reason to compare them over two years rather than at launch, and the [pricing page](/pricing) explains how project and retainer work is charged. If you are weighing WordPress against a custom Next.js build, there is a longer comparison in [WordPress or Next.js for your business website](/wordpress-or-nextjs-for-your-business-website).",
        ],
      },
    ],
    faqs: [
      {
        question: "What does CMS development cost?",
        answer:
          "It depends on the platform and the scope, and the published starting figures are on the pricing page. As a rule, the platform is rarely the expensive part. Custom design, integrations with your CRM and the number of page templates decide the cost far more than whether it is Wix or WordPress.",
      },
      {
        question: "Is a headless CMS better than WordPress?",
        answer:
          "Not by default. A headless CMS such as Strapi separates content from the front end, which gives you speed and the freedom to publish the same content to a website, an app and a portal. It also means a developer owns the front end permanently. For a marketing site with a few editors, WordPress or a site builder is usually the better trade.",
      },
    ],
  },

  "wordpress-development": {
    blocks: [
      {
        heading: "What a WordPress developer in Dubai should be building",
        paragraphs: [
          "WordPress runs a large share of the web, which is both why it is a safe choice and why so much of it is badly built. The platform is fine. What goes wrong is the assembly: a multipurpose theme that ships with forty layouts you will never use, a page builder layered on top, and a plugin for every small job. Each one adds weight, updates and another way for the site to break.",
          "The build I do starts from the design and the content, not from a theme. A custom theme carries only what your pages need, and the editing screens are shaped around what your team actually changes: a project, a price, a team member, a landing page. That is what keeps a WordPress site fast and tidy two years after launch.",
        ],
      },
      {
        heading: "Elementor or ACF, decided by who edits the site",
        paragraphs: [
          "Elementor is the right tool when your marketing team wants to build new page layouts without a developer. It is the wrong tool when it is handed over unconfigured, because every editor then makes their own decisions about fonts, spacing and colours, and the brand drifts within months. Set up properly, with global styles and a library of saved sections, it gives a team freedom without the drift.",
          "Advanced Custom Fields suits the opposite case: content with a fixed shape. Property listings, case studies, team pages, events. Editors fill in fields, the theme handles the layout, and nobody can break a page by dragging a block. Many sites use both: ACF for the structured content, Elementor or the block editor for the landing pages marketing builds every month.",
        ],
      },
      {
        heading: "Made for non-technical marketing teams",
        paragraphs: [
          "The measure of a WordPress build is what happens when the developer is not there. Can your marketing coordinator add a landing page for Thursday's campaign, change a form or publish an article without asking anyone? If not, the site is a dependency rather than a tool.",
          "So the admin is trimmed to what your team uses, custom fields are labelled in plain English, and before handover the person who will edit the site does each common task in front of me. Anything that needs a second attempt gets simplified or written into a short guide.",
        ],
      },
      {
        heading: "Speed and SEO are build decisions",
        paragraphs: [
          "A slow WordPress site is almost always slow because of what was put on it: images uploaded at camera size, a slider on every page, scripts from five plugins loading whether the page uses them or not. Fixing that afterwards is possible and avoiding it is better value. Images are resized and served in modern formats, scripts load only where they are needed, and the result is measured on a mid-range phone rather than a developer's laptop.",
          "SEO gets the same treatment: editable titles and descriptions on every page, clean URLs, schema where it helps, no thin tag and archive pages competing with the real ones, and every old URL redirected when a site is rebuilt. If the design itself is the open question rather than the build, that is the [web design](/services/web-design) page.",
        ],
      },
      {
        heading: "Lead forms that reach your CRM",
        paragraphs: [
          "This is where my work differs from a typical WordPress build. A contact form that sends an email is not a lead system: it cannot tell you which campaign produced the enquiry or whether anyone followed it up. Forms here post to your CRM, whether that is HubSpot, Zoho or Salesforce, with the UTM source, the page and the campaign attached, and the same submission fires the GA4 and Meta Pixel conversion through Google Tag Manager.",
          "Because I also run the campaigns, landing pages are built for the ads that will point at them: the same promise above the fold, a form short enough to finish on a phone, and a thank-you page the ad platforms can count. The tracking side is covered on the [CRM and tracking](/services/crm-marketing-automation) page, and if you are still choosing between WordPress and a custom build, read [WordPress or Next.js](/wordpress-or-nextjs-for-your-business-website) first.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is WordPress good for SEO?",
        answer:
          "It gives you everything SEO needs: editable titles and descriptions, clean URLs, sitemaps and full control of the HTML. It does not do SEO for you, and an SEO plugin showing all green is not the same as a page that ranks. The bigger risks are speed and the duplicate pages that tags and archives create, and both are build decisions.",
      },
      {
        question: "Can WordPress handle English and Arabic?",
        answer:
          "Yes. WordPress supports right-to-left languages, and a multilingual plugin such as WPML or Polylang manages the translated pages. The work is in the theme: an Arabic layout needs to be designed and tested as Arabic rather than simply mirrored, or it reads like an afterthought.",
      },
    ],
  },

  "wix-development": {
    blocks: [
      {
        heading: "When a Wix developer in Dubai is the right hire",
        paragraphs: [
          "Wix makes sense when three things are true: the site is small to medium, one or two people will edit it, and nobody wants to manage hosting, updates or security. That describes a lot of businesses here: a clinic, a consultancy, a training provider, a small brokerage, a shop with a handful of services. For them, a custom build or a WordPress install would mean paying for flexibility they will never use.",
          "Where Wix stops being the right answer is just as clear: many editors with different permissions, hundreds of listings that need filtering, a site that must load instantly on poor connections, or a deep integration with your own systems. At that point I will say so and point you at [WordPress](/services/wordpress-development) or a [custom build](/services/custom-web-development) instead, before any money goes into the wrong platform.",
        ],
      },
      {
        heading: "Built for the owner who maintains it",
        paragraphs: [
          "The point of Wix is that you can change your own site, so the build is shaped around that: sections you can duplicate rather than rebuild, a small set of fonts and colours saved as the site theme, and image areas that a new upload will not break. When you add a page in six months, it should look like it belongs.",
          "Handover is practical. You change a price, add a team member and publish a page while I watch, and anything that is not obvious goes into a one-page guide. The account, the domain and the billing stay in your name.",
        ],
      },
      {
        heading: "Landing pages for campaigns, not just a homepage",
        paragraphs: [
          "Most small business Wix sites send every ad to the homepage, which has to serve every visitor and serves none of them well. A campaign landing page does one job: it repeats the ad's promise, answers the two or three questions that stop people enquiring, and asks for the minimum on a form that works with one thumb.",
          "Wix handles this well. Landing pages can be built quickly, kept out of the main menu and duplicated for the next campaign. Because I also run [Google Ads](/services/google-ads) and [Facebook ads](/services/facebook-ads), the page is written against the ad that will send traffic to it rather than in isolation.",
        ],
      },
      {
        heading: "SEO and tracking set up properly on Wix",
        paragraphs: [
          "Wix gives you the controls: page titles and descriptions, URL slugs, a redirect manager, structured data and a sitemap. Many Wix sites never use them, so every page goes out with a default title and the business ranks only for its own name. Setting them deliberately, with each page aimed at one thing people actually search for, is often the biggest single improvement a small site can make.",
          "Tracking is the same story. GA4, Google Tag Manager and the Meta Pixel connect through Wix's marketing integrations, and form submissions are marked as conversions, so you can see which campaign produced which enquiry instead of guessing. Where a CRM is involved, form entries reach it through an integration or a small piece of code rather than being copied by hand.",
        ],
      },
      {
        heading: "Velo, apps and the limits worth knowing",
        paragraphs: [
          "When the editor cannot do something, there are two routes. The Wix App Market covers common needs such as appointments, reviews and chat. Velo, Wix's coding layer, allows custom JavaScript, data collections and connections to outside services. I use it for the specific things that justify it: a calculator, a filtered list of projects, or sending form data to a CRM that has no ready-made app.",
          "The limits are real, and better known before you start than after. You have less control over page weight and code than on WordPress or a custom build, so a Wix site is rarely the fastest in its market, and it cannot be moved to another host: your content and domain are yours, but the design stays on Wix. For most small businesses those are fair trades for a site they never have to maintain. The [CMS comparison](/services/cms-development) sets them against the other platforms.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is Velo, and do I need it?",
        answer:
          "Velo is Wix's coding layer: JavaScript, data collections and connections to other services inside a Wix site. It is useful for things the editor cannot do, such as a calculator, a filtered listing or sending form data somewhere specific. Most small business sites never need it, and I only use it where it saves you a workaround.",
      },
      {
        question: "Wix or Wix Studio?",
        answer:
          "Wix Studio is the version aimed at agencies and designers, with more control over responsive layouts. For a site an owner will maintain alone, the standard editor is usually simpler to live with. I build in whichever suits the person who edits the site afterwards.",
      },
    ],
  },

  "squarespace-development": {
    blocks: [
      {
        heading: "What a Squarespace developer in Dubai is hired for",
        paragraphs: [
          "Squarespace is built for brochure and portfolio sites: a business with a strong visual identity, a modest number of pages and an owner who wants to change them without help. Interior design studios, architects, photographers, boutique consultancies and personal brands are the natural fit. For them, a Squarespace site can look as considered as a custom build at a fraction of the effort to maintain.",
          // Real work, added 2026-10-16. Not linked: the Choppershoot case study
          // in caseStudies.ts is still a noindex draft.
          "The website I built for Choppershoot, a production house, is a good example. It runs on Squarespace so the team can update their showreels and projects themselves, without waiting on a developer for every new piece of work.",
          "The work is not dragging blocks onto a template. It is deciding what the site has to say and in what order, adapting the template so it looks like your brand rather than its demo, and setting up the parts Squarespace leaves to you: the enquiry route, the search settings and the tracking.",
        ],
      },
      {
        heading: "Design-led, without looking like the template",
        paragraphs: [
          "Squarespace templates are good, which is the problem: a great many sites use the same ones, and a visitor who has seen the demo recognises it. The fix is in the site styles rather than in decoration. Your type, your spacing, your colours and a consistent treatment for photography change the feel of a template more than any number of added effects.",
          "Where the built-in controls stop, custom CSS fills the gap, used sparingly so the site still updates cleanly. If you need a brand identity before a website, the [graphic design and branding](/services/graphic-design-branding) work comes first and the site is built from it.",
        ],
      },
      {
        heading: "When to choose Squarespace over Wix or WordPress",
        paragraphs: [
          "Choose Squarespace when the site will stay small, the design matters more than features, and you never want to think about hosting, plugins or updates. Choose [Wix](/services/wix-development) when you need more from an app market or more layout freedom. Choose [WordPress](/services/wordpress-development) when several people will publish often, you need structured content such as listings, or you want full control over speed and code.",
          "The limits are worth knowing in advance. Squarespace has no plugin ecosystem in the WordPress sense, multilingual and right-to-left support is limited, and some features, such as adding your own code to every page, depend on the plan you are on. None of that matters for a twenty-page portfolio. All of it matters for a bilingual property site with three hundred units.",
        ],
      },
      {
        heading: "Lead capture and tracking on Squarespace",
        paragraphs: [
          "A portfolio site that impresses people and never hears from them is a common outcome. Every project page needs a route to an enquiry, the contact form should ask only what you will use, and its entries need to go somewhere you will see and act on within the hour, not to an inbox checked on Fridays.",
          "Squarespace connects to GA4 and the Meta Pixel, and Google Tag Manager can be added through code injection on plans that allow it. Form submissions are tracked as conversions, so if you run [paid campaigns](/services/paid-marketing) you can see what each enquiry cost. Where a CRM is involved, entries are passed to it through an integration and tested end to end before launch.",
        ],
      },
      {
        heading: "Speed and search on an image-heavy site",
        paragraphs: [
          "Image-led sites are the ones most likely to be slow on a phone. Squarespace serves images at sizes suited to each screen, but it cannot fix a gallery of forty full-resolution photographs on one page. Fewer, better images per page, a sensible upload size, and pages split by project rather than one endless gallery keep the site quick.",
          "Search needs words. A project page with twelve photographs and one line of text gives Google nothing to rank. Each project gets a title that says what and where, a few honest paragraphs about the brief and the result, and image descriptions that a screen reader and a search engine can both use.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does Squarespace work for Arabic or bilingual sites?",
        answer:
          "Not well on its own. Squarespace has limited built-in support for multilingual sites and right-to-left text, so a bilingual site usually needs a translation service on top or two linked sites. If Arabic is central to your audience, WordPress or Strapi is usually the better foundation, and I will say so before we start.",
      },
      {
        question: "Can Squarespace send enquiries to my CRM?",
        answer:
          "Yes, with some setup. Squarespace forms can send submissions to email and a few connected services, and an automation tool can pass them on to HubSpot, Zoho or Salesforce with the source attached. It is less direct than on WordPress or a custom build, so I test it end to end before launch rather than assume it works.",
      },
    ],
  },

  "strapi-development": {
    blocks: [
      {
        heading: "What a Strapi developer in Dubai builds, and why headless",
        paragraphs: [
          "In a traditional CMS the content and the design live in one system. In a headless setup they are separate: Strapi holds the content and serves it through an API, and a front end built in Next.js decides how it looks. The split sounds technical and the commercial effect is simple. Pages load faster, the same content can feed a website, an app and a sales screen, and the design can change without touching the content.",
          "The cost is that the front end is code. Your team edits content freely, but a new page layout needs a developer. That is the trade to weigh before choosing Strapi, and it is why I recommend it less often than any other platform on this site.",
        ],
      },
      {
        heading: "Where it earns its place: structured content at volume",
        paragraphs: [
          "The clearest case in this market is real estate. A developer or brokerage with several projects, hundreds of units, floor plans, payment plans, amenities and agents, in English and Arabic, is managing a database, not writing pages. In Strapi each of those is a content type with its own fields, the relationships between them are defined once, and every project page, listing and comparison is built from the same source.",
          "Other good fits share that shape: a property portal, a directory, a product catalogue that also feeds an app, or a marketing site where a landing page for each campaign is generated from structured data rather than built by hand. For property specifically, the [real estate marketing](/real-estate-marketing) page covers the campaign side.",
        ],
      },
      {
        heading: "A fast Next.js front end, built for search and campaigns",
        paragraphs: [
          "The front end is where the speed comes from. Next.js renders pages on the server, so a listing page arrives ready to read on a mid-range phone on mobile data, and search engines and AI assistants can read it without running JavaScript. When an editor publishes in Strapi, a webhook tells the site to refresh that page, so changes appear within moments and without a full rebuild.",
          "Because it is code, the tracking is exactly what the campaigns need. GA4 and Meta Pixel events fire on real actions such as a brochure download or a callback request, forms post to your CRM with the listing and the campaign attached, and landing pages can be created per project from the data. More on the build side is on the [custom web development](/services/custom-web-development) page.",
        ],
      },
      {
        heading: "Roles, languages and the editors who use it",
        paragraphs: [
          "Strapi's admin is clean and quick to learn, and its roles and permissions let you decide who can do what: sales updates availability, marketing publishes pages, a translator works only on the Arabic versions. Internationalisation is built in, so each translation is linked to its original and nothing goes live in one language and not the other by accident.",
          "Before handover, each role does its own common tasks in front of me. If an agent cannot update a unit in under a minute, the content model gets simplified, because a CMS the sales team avoids ends up full of stale prices, which is worse than having no CMS at all.",
        ],
      },
      {
        heading: "When Strapi is overkill",
        paragraphs: [
          "Most of the time, honestly. A company website with twenty pages, one editor and no app does not need a headless CMS, and building one anyway means paying for two systems and a developer for every layout change. [WordPress](/services/wordpress-development) or a site builder will launch sooner and cost less to run.",
          "The test I use has three parts: is the content structured, is it reused in more than one place, and does speed or scale matter enough to justify a separate front end? If two of those are not true, Strapi is the wrong answer, and the [CMS comparison](/services/cms-development) will point to a better one.",
        ],
      },
    ],
    faqs: [
      {
        question: "Where is Strapi hosted?",
        answer:
          "Strapi is open source, so it can run on a cloud server you control with a PostgreSQL database, or on Strapi's own cloud hosting. The Next.js front end is hosted separately, usually on Vercel, Netlify or Cloudflare. Every account sits in your name, not mine.",
      },
      {
        question: "Can the same content feed a website and a mobile app?",
        answer:
          "Yes, and it is one of the main reasons to choose a headless CMS. The website and the app read the same API, so a new project or a price change is entered once and appears in both. Without that, the same listing is typed into two systems and they drift apart within weeks.",
      },
    ],
  },

  "custom-web-development": {
    blocks: [
      {
        heading: "When custom web development in Dubai beats a CMS",
        paragraphs: [
          "A CMS is built for publishing pages. The moment a site has to do something with data, it starts fighting you: a mortgage or payment plan calculator, a portal where brokers log in to see their leads, a dashboard that reads live from the CRM, a property search with filters that must respond instantly. Each of those can be bolted onto WordPress with plugins, and each bolt is another thing to maintain, slow down and break.",
          "Custom development is the right call when the logic is the product, when the integration matters more than the editing, or when speed decides the outcome. It is the wrong call for a marketing site that mostly publishes pages, and the [CMS development](/services/cms-development) page covers that side. Plenty of projects need both: a CMS for the pages and a custom tool beside it.",
        ],
      },
      {
        heading: "The kind of work this covers",
        paragraphs: [
          "Most of what I build sits where marketing meets sales. Broker portals with a web app and a mobile app sharing one back end, so agents see the same leads and listings wherever they are. Sales presentation applications for real estate, used in the room with a buyer; one of them, built for LEOS Developments and reading live unit availability from the CRM, is written up as a [case study](/portfolio/leos-developments/sales-app).",
          "And CRM-connected landing pages: campaign pages where every enquiry lands in HubSpot, Zoho or Salesforce with its source, its campaign and the listing it came from, and the conversion goes back to the ad platforms so they optimise towards real leads. These are small builds with an outsized effect, because they fix the measurement everything else depends on.",
        ],
      },
      {
        heading: "The stack: MERN, React, Next.js, TypeScript and PHP",
        paragraphs: [
          "Front ends are React, and marketing sites and landing pages are Next.js, which renders on the server so pages are quick on a phone and readable by search engines without waiting for JavaScript. Applications use the MERN stack, MongoDB, Express, React and Node.js, with PostgreSQL in place of MongoDB when the data is relational and needs reporting across it.",
          "New code is written in TypeScript, because it makes a project safer to change and easier for the next developer to take over. PHP is part of the toolkit too, for existing systems, WordPress work and hosts that run nothing else. The choice follows the project and whoever will maintain it, not habit. Apps that share the same back end are covered on the [mobile app development](/services/mobile-app-development) page.",
        ],
      },
      {
        heading: "Hosting and deployment: Netlify, Vercel and Cloudflare",
        paragraphs: [
          "Where code runs matters as much as how it is written. Netlify and Vercel are hosting and deployment platforms, not content management systems: every change pushed to the repository is built and published automatically, each change can be previewed on its own link before it goes live, and rolling back is a single step. Vercel is made by the team behind Next.js; Netlify suits static sites and front ends with small serverless functions.",
          "Cloudflare sits in front of many sites as DNS, security and a content delivery network, caching pages close to visitors, and it can host front ends and small functions itself. APIs and databases for larger applications run on a cloud server or a managed database. The accounts are opened in your name, the deployment is documented, and nothing depends on a login only I hold.",
        ],
      },
      {
        heading: "Built with the marketing in mind",
        paragraphs: [
          "A custom build from a typical development shop arrives without tracking, or with a tag pasted in the week before launch. Here the events are part of the specification: which actions count as a lead, what is sent to GA4 and to the ad platforms, including Meta's Conversions API, and which fields go to the CRM. Server-side tracking is set up where the ad spend justifies it, so the numbers survive ad blockers and privacy settings.",
          "That is the reason to have someone who runs campaigns build the thing the campaigns point at. Scope and cost depend on the build; the [pricing page](/pricing) explains how projects are charged, and a [free consultation](/appointment) is the quickest way to find out whether you need custom at all.",
        ],
      },
    ],
    faqs: [
      {
        question: "Where will the site be hosted?",
        answer:
          "In your accounts, on the platform that suits the build. Next.js front ends usually go on Vercel, Netlify or Cloudflare; Node APIs and databases on a cloud server or a managed service; PHP on conventional hosting. You own the repository, the hosting and the domain from day one.",
      },
      {
        question: "Can you work on an existing PHP or React codebase?",
        answer:
          "Often, yes. I read the code first and tell you whether extending it is better value than replacing it, including when the honest answer is that it is not. Inherited projects usually need their tracking and forms checked before anything else, because that is where they quietly lose leads.",
      },
    ],
  },

  "ui-ux-design": {
    blocks: [
      {
        heading: "What a UI/UX designer in Dubai hands a developer",
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
        // Added 2026-10-16: the tools, named once and plainly. Figma was in two
        // FAQs and nowhere a scanning reader would see it.
        heading: "Tools: Figma, with Photoshop and Illustrator for assets",
        paragraphs: [
          "Interface work is done in Figma: wireframes, components with a variant for each state, auto layout so screens respond the way the build will, and clickable prototypes, all in a file you own and your developer can inspect directly. Image and icon assets that go into the interface are prepared in Adobe Photoshop and Illustrator, so they arrive at the right size and format rather than as screenshots.",
          // Added 2026-10-16: the Figma page takes "figma designer dubai"; this
          // page keeps "ui ux designer dubai".
          "If what you need is the Figma work on its own, a website or landing page designed and handed over for build, that is the [Figma design](/services/figma-design) page.",
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
        // "graphic design in dubai" is 390 searches at difficulty 20 and
        // "dubai graphic designer" another 320. The page is titled "Graphic
        // Design & Branding" and used neither phrase in its body, because the
        // copy led with branding and treated graphic design as implied.
        //
        // Restored 2026-10-07. The 2026-10-07 retarget replaced this heading,
        // which read "Graphic design in Dubai, beyond the brand guidelines
        // deck", with a "graphic designer" version — and took the only
        // occurrence of the **measured** 390-search phrase off the page with
        // it, trading it for an unmeasured one. The daily report caught it as
        // a 12-point drop the same evening.
        //
        // Both phrases now appear: this heading carries "graphic design in
        // Dubai", and heading 3 below carries "graphic designer in Dubai".
        heading: "Graphic design in Dubai, beyond the brand guidelines deck",
        paragraphs: [
          "Branding projects get the attention and graphic design is what a business actually needs most weeks: the company profile for a tender, the pitch deck for Thursday, the hoarding for the site, the brochure the sales team hands over, the ad creative that has to exist in nine sizes by Sunday.",
          "In this market the formats are specific. A company profile that will be printed and also emailed as a PDF. Bilingual layouts where the Arabic is set properly rather than pasted in and left looking like an afterthought. Collateral for an exhibition stand, where the viewing distance changes every size decision. Creative sized for the places UAE audiences actually are, which includes WhatsApp and Instagram more than it includes anything printed.",
          "The reason to use one designer across these rather than whoever is available is consistency. A brand is not the logo file, it is what happens when fifteen different pieces are produced over a year by different people under deadline. That is the part guidelines are meant to protect and the part they usually fail to.",
        ],
      },
      {
        heading: "A system, not a folder of one-off assets",
        paragraphs: [
          "The problem with commissioning design piece by piece is that the fifth asset no longer matches the first. Colours drift, type sizes are improvised, and the brand is whatever the last supplier felt like doing that week.",
          "A brand system fixes the decisions once: the palette and where each colour is allowed to be used, the type scale, spacing, logo behaviour at small sizes and on photography, and the rules for campaign creative. Anyone producing work afterwards, including you, has something to check against.",
        ],
      },
      {
        heading: "What a graphic designer in Dubai is actually asked for",
        paragraphs: [
          "Most of my recent brand work has been launch creative for property, where a single development needs a coherent look across social, portal listings, brochures, hoardings and the landing page, produced quickly and consistently under a launch deadline.",
          "That work is built to be extended. Templates and a defined set of rules mean the tenth asset takes a fraction of the time the first did, and still belongs to the same brand, which is what makes design economics work over a campaign rather than a single post.",
        ],
      },
      {
        heading: "Deliverables and file handover",
        paragraphs: [
          "You get working source files, not only flattened exports: layered Adobe Illustrator and Photoshop originals, InDesign files for multi-page documents such as company profiles and brochures, logo lockups in vector at the sizes and colourways you will actually need, and a written guideline document covering the decisions rather than only showing the outcome.",
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
        question: "Which design software do you use?",
        answer:
          "Adobe Illustrator for logos and vector artwork, InDesign for multi-page documents such as company profiles, brochures and guideline decks, and Photoshop for image work. Figma for anything that will end up on a screen. Source files come in those formats, so another designer can pick them up.",
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
    ],
  },

  "crm-marketing-automation": {
    blocks: [
      {
        heading: "The measurement problem a CRM consultant in Dubai is really hired for",
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
          // Added 2026-10-16 with the CRM integration pages. This page keeps
          // the consultant query; the connections and each platform have their
          // own pages now, linked here and in the cards near the top.
          "Getting every lead source into one CRM, and choosing between the platforms, is on the [CRM integration](/services/crm-integration) page. Each platform has its own: [Zoho CRM integration](/services/zoho-crm-integration), [HubSpot integration](/services/hubspot-integration) and [Salesforce integration](/services/salesforce-integration), which covers Marketing Cloud. When none of them fits, there is [custom CRM development](/services/custom-crm-development).",
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

  // The CRM integration hub and its four platforms, added 2026-10-16. See the
  // note above them in `serviceCategories.ts` for what each page may claim.
  // Platform features named below are general, checkable properties of the
  // product (a native lead ads connection, a Forms API, Web-to-Lead), not
  // figures. No prices, no client names, no employer named.
  "crm-integration": {
    blocks: [
      {
        heading: "What CRM integration in Dubai should fix first",
        paragraphs: [
          "The symptom is nearly always the same meeting. Marketing reports four hundred leads, sales says it received one hundred and fifty worth calling, and finance wants to know what a sale cost. All three are reading different systems. Meta lead forms sit in Meta, Google Ads forms in Google, website enquiries in an inbox, WhatsApp chats on agents' phones and portal leads in a weekly export.",
          "CRM integration fixes that at the source. Every channel lands in one CRM, as it happens, with its campaign, ad and page attached, and the CRM becomes the only place anyone counts. The tracking and automation that sit around this are covered on the [CRM and MarTech integration](/services/crm-marketing-automation) page; this one is about the connections themselves and the CRM they feed.",
        ],
      },
      {
        heading: "One view: leads by source and cost per qualified lead",
        paragraphs: [
          "Ad spend lives in the ad platforms and outcomes live in the CRM, so neither can tell you what a qualified lead cost. Joining them is the point of the exercise. Once each lead carries its source and the CRM records whether it qualified, a single report can show leads, qualified leads, viewings or meetings, and cost per qualified lead by channel and by campaign.",
          "That number matters more than cost per lead, which can fall while lead quality collapses, a pattern described in [your cost per lead is fine, your sales team is still unhappy](/cost-per-lead-is-fine-sales-team-unhappy). The same qualified leads are sent back to Google Ads and Meta as offline conversions, so the platforms optimise towards people your sales team wanted to speak to rather than anyone who filled in a form.",
        ],
      },
      {
        heading: "Lead routing and deduplication",
        paragraphs: [
          "A lead that waits is a lead that cools. Routing rules assign each one the moment it arrives: by project, by language, by budget, or in rotation across the team, with an alert to a manager if nobody has made contact within the time you set. The rules are agreed with sales before they are built, because a routing rule nobody believes in gets worked around within a week.",
          "Deduplication runs alongside it. The same buyer often enquires on several campaigns and a portal in the same week. Without a matching rule that becomes several contacts, owned by several agents, each calling the same person. Matching on phone number in international format first, then email, turns it into one contact with a history of enquiries, which is also the only way the source reports stay honest.",
        ],
      },
      {
        heading: "Forms, WhatsApp and ad platforms into the CRM",
        paragraphs: [
          "Website and landing page forms post to the CRM through its API, carrying the UTM parameters and the Google and Meta click IDs captured when the visitor arrived. Meta and Google lead forms connect through each CRM's native integration or a webhook. Click-to-WhatsApp ads and the WhatsApp button on the site create or update a contact, so the chat is not the only record of the lead.",
          "Every route is tested end to end before launch: a real submission from each source, checked in the CRM for its fields, its owner and its campaign, and checked in GA4 and the ad platforms for its conversion. Broken integrations fail silently, which is why the second item in [why your leads are not converting](/why-your-leads-are-not-converting) is the enquiry that went somewhere nobody looks.",
        ],
      },
      {
        heading: "Zoho, HubSpot, Salesforce or a custom CRM",
        paragraphs: [
          "The platform matters less than the setup, and most of the work above is the same on all four. They still differ in who they suit, and the table sets them side by side. Each has its own page with the detail: [Zoho CRM integration](/services/zoho-crm-integration), [HubSpot integration](/services/hubspot-integration), [Salesforce integration](/services/salesforce-integration) and [custom CRM development](/services/custom-crm-development). For property specifically, [the best CRM for a Dubai real estate business](/best-crm-for-dubai-real-estate) goes further.",
        ],
        table: {
          caption: "How Zoho CRM, HubSpot, Salesforce and a custom CRM compare for a marketing-led sales team",
          head: ["What matters", "Zoho CRM", "HubSpot", "Salesforce", "Custom CRM"],
          rows: [
            ["Best for", "Cost-conscious teams who will configure it properly", "Marketing-led teams who want reporting without a specialist", "Large teams with a dedicated administrator", "Processes and reporting no package fits"],
            ["Running cost", "Per-user licences, usually the lowest of the three", "Free to start; climbs with contacts and paid tiers", "Per-user licences plus administrator time", "No licences; hosting and developer time"],
            ["Adoption", "Flexible, so easy to configure badly", "The easiest for marketing teams", "Powerful, needs training and ownership", "Built around how your team already works"],
            ["Lead ads and forms", "Native Meta lead ads; web forms and API", "Ads tool for Google, Meta and LinkedIn; Forms API", "Web-to-Lead, API and connectors", "Whatever you need, through each platform's API"],
            ["WhatsApp", "Through Zoho's integration or a provider", "Built-in inbox on eligible plans", "Through connectors or partners", "WhatsApp Business Platform, built in"],
            ["Leaving later", "Data exports; configuration stays", "Data exports; configuration stays", "Data exports; configuration stays", "Your code and your database"],
          ],
        },
      },
    ],
    faqs: [
      {
        question: "How do you stop duplicate leads?",
        answer:
          "By deciding what makes two records the same person before anything is connected, usually the phone number in international format, then the email. Every source is checked against that rule as the lead arrives, so a buyer who enquires on three campaigns becomes one contact with three enquiries rather than three contacts for three agents to chase.",
      },
      {
        question: "Is lead data in the CRM covered by UAE data protection law?",
        answer:
          "Personal data such as names, phone numbers and emails is, and the UAE PDPL sets rules on consent, purpose and retention. I build integrations with consent captured on the form and access limited to the people who need it, but I am not a lawyer, so for a formal position please speak to a qualified professional.",
      },
    ],
  },

  "zoho-crm-integration": {
    blocks: [
      {
        heading: "What a Zoho CRM consultant in Dubai is usually fixing",
        paragraphs: [
          "The pattern is familiar from real estate sales teams here. Leads from Meta campaigns are downloaded as a spreadsheet and imported once a day, or once a week. Lead source is a free text field, so the same campaign appears under six spellings and no report can group it. Agents call from their own phones and the CRM never hears about it. Zoho is doing its job; nothing is feeding it properly.",
          "I have managed leads in Zoho CRM for real estate developers in Dubai, so the fixes below are the ones that made the difference there: leads arriving on their own within seconds, sources that can be reported on, assignment that does not depend on a manager forwarding emails, and a WhatsApp follow-up that goes out before the buyer has spoken to a competitor. Whether Zoho is the right CRM at all, and how every other lead source reaches it, is covered on the [CRM integration](/services/crm-integration) page.",
        ],
      },
      {
        heading: "Social media lead forms flowing into Zoho",
        paragraphs: [
          "Meta lead ads, on Facebook and Instagram, connect to Zoho CRM through its native integration, or through a webhook where a campaign needs extra fields or logic. The mapping is where care goes: name, phone in international format so WhatsApp works, email, the project or unit asked about, any qualifying answers, and the campaign, ad set and ad the lead came from, each in its own field rather than squeezed into a description.",
          "Other social platforms with lead forms, and the website's own forms, feed the same module the same way, so a lead from a TikTok form and a lead from a landing page look identical in Zoho apart from their source. Website forms post through Zoho's web forms or its API with UTM parameters carried across. If you run the campaigns with me, the [Facebook ads](/services/facebook-ads) work and the CRM setup are planned as one job.",
        ],
      },
      {
        heading: "Assignment rules and follow-up automation",
        paragraphs: [
          "Zoho's assignment rules decide who owns each lead: by project, by language, by source or in rotation. Workflow rules then do the remembering. A new lead creates a call task for its owner, a lead untouched after the time you set alerts a manager, and a lead marked as not reachable gets a second attempt scheduled rather than forgotten.",
          "Where the sales process has fixed stages, Zoho's Blueprint can enforce them, so a lead cannot be marked as a site visit without a date or moved to a booking without the unit attached. Used lightly, that keeps the data clean. Used everywhere, it frustrates agents into avoiding the CRM, so it goes only where a missing field actually breaks a report.",
        ],
      },
      {
        heading: "WhatsApp follow-up from inside Zoho",
        paragraphs: [
          "In this market the first reply often decides who gets the conversation. When a lead lands in Zoho, an approved WhatsApp template can go out automatically within moments: a thank you, the brochure for the project they asked about, and the name of the agent who will call. Replies come back into Zoho against the contact, so a manager can see the conversation and it survives an agent leaving.",
          "WhatsApp's rules shape the design. Messages outside a customer's most recent conversation window must use templates approved in advance, and people have to have agreed to hear from you. Both are planned before launch, along with the opt-out, because a number reported as spam is hard to recover.",
        ],
      },
      {
        heading: "Reporting by campaign and project, and sending results back",
        paragraphs: [
          "With sources clean and stages enforced, Zoho's reports and dashboards, or Zoho Analytics for heavier work, show what matters: leads, qualified leads, site visits and bookings by campaign and by project, and response times by agent. That is the view a sales director and a marketing manager can both work from, because it is the same data.",
          "The results then go back to the ad platforms. Qualified leads and bookings are sent to Meta and to [Google Ads](/services/google-ads) as conversions, so both learn which audiences produce buyers rather than form fills. If Zoho turns out not to fit your team, the [CRM integration](/services/crm-integration) page compares it with the alternatives.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can you fix a Zoho CRM someone else set up?",
        answer:
          "Usually. The common problems repeat: too many custom fields nobody fills in, lead sources typed by hand so reports cannot group them, and workflows that fire twice or not at all. I audit the setup, fix the fields and rules that do the most damage first, and keep your data and history intact.",
      },
      {
        question: "Does Zoho CRM work for real estate?",
        answer:
          "Well, once it is configured for property. Out of the box it knows leads, contacts and deals. It does not know projects, units or brokers. Custom modules and fields add those, so a lead can be tied to the project it enquired about and a deal to the unit it is for, and reports can be run by project as well as by campaign.",
      },
    ],
  },

  "hubspot-integration": {
    blocks: [
      {
        heading: "What HubSpot integration in Dubai usually has to repair",
        paragraphs: [
          "HubSpot is easy to start and easy to leave unfinished. A common inheritance: the tracking code on some pages and not others, forms that create contacts without an original source, every contact labelled a lead whether they downloaded a brochure or asked for a quote, and a dashboard nobody opens because nobody believes it.",
          "None of that is HubSpot's fault, and none of it needs a new CRM. It needs the integration finished: every form and ad connected, stages defined, workflows doing the follow-up and reports that both teams accept. The order matters, because reports built on unfinished tracking only formalise the argument.",
        ],
      },
      {
        heading: "Forms and site tracking into HubSpot",
        paragraphs: [
          "The HubSpot tracking code goes on every page, through Google Tag Manager or the site itself, so a contact's original source, first page and later visits are recorded from the first click. HubSpot forms can be embedded directly. Forms on a WordPress or custom site can stay as they are and post to HubSpot through its Forms API, which keeps your design and still links the submission to the visitor.",
          "UTM parameters are standardised before anything else, because HubSpot groups sources by them and six spellings of one campaign make six rows in every report. GA4 and the ad pixels run alongside HubSpot rather than instead of it, and each form submission is checked in all of them before launch. WhatsApp chats can come into HubSpot's inbox on eligible plans, so they are logged as well.",
        ],
      },
      {
        heading: "Lifecycle stages and lead status that mean something",
        paragraphs: [
          "HubSpot's lifecycle stages, from subscriber through lead, marketing qualified lead, sales qualified lead, opportunity and customer, are only useful if each one has a definition everyone agrees with. That definition is written with your sales team, not handed to them. What makes someone marketing qualified? What does sales have to do, and by when, to accept or reject them?",
          "Lead status then tracks the sales side within a stage: new, attempted, connected, bad timing, unqualified. Moving contacts between stages is automated on real triggers, a form, a meeting booked, a deal created, so the funnel report is a record of what happened rather than of who remembered to update a dropdown.",
        ],
      },
      {
        heading: "Workflows that do the follow-up",
        paragraphs: [
          "Workflows take on the work people forget. A new sales qualified lead is assigned an owner in rotation and given a call task. A contact who downloads a price list but does not book a meeting gets a short nurture sequence. A deal that has not moved in a set period alerts its owner and their manager. Each workflow has one job and a name that says what it is.",
          "Automation is added only where the process is already sound. Automating a follow-up nobody would send by hand produces emails that read like automation, and automating around an unclear stage definition makes the confusion faster. Marketing emails sent from HubSpot follow the same rules as the [email marketing](/services/email-marketing) work: consented lists, useful content, an easy way out.",
        ],
      },
      {
        heading: "Ads, attribution and reports sales trusts",
        paragraphs: [
          "HubSpot's ads tool connects Google Ads, Facebook and Instagram, and LinkedIn. Lead form submissions on those platforms sync into HubSpot, and lifecycle changes go back to the platforms as conversion events, so the campaigns optimise towards sales qualified leads rather than raw form fills. That is usually the single biggest improvement the integration makes to the ad spend.",
          "The reporting then answers the questions management asks: contacts and qualified leads by original source, how many marketing qualified leads sales accepted, and what each qualified lead cost per channel. If HubSpot turns out to be the wrong fit for your team, the [CRM integration](/services/crm-integration) page compares it with Zoho, Salesforce and a custom build.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can you migrate us to HubSpot from spreadsheets or another CRM?",
        answer:
          "Yes. Contacts, companies and deals are mapped to HubSpot's properties, duplicates merged on email and phone before import, and the source of each historical lead kept where it exists. Old activity comes across as history, so nothing that happened before the switch is lost.",
      },
      {
        question: "Does HubSpot work with WhatsApp?",
        answer:
          "Yes. HubSpot connects to the WhatsApp Business Platform, so messages can be sent and received from the HubSpot inbox and logged against the contact. Availability depends on your HubSpot plan and a WhatsApp Business account connected to it, so both are confirmed before the build is planned.",
      },
    ],
  },

  "salesforce-integration": {
    blocks: [
      {
        heading: "What Salesforce integration in Dubai means on the marketing side",
        paragraphs: [
          "Salesforce is a family of products rather than one. Sales Cloud holds leads, accounts and opportunities and is where sales teams work. Marketing Cloud sends email, hosts pages and holds marketing data. Many projects fail at the join between them: campaigns run in one place, leads are worked in another, and nobody can trace a sale to the email or ad that started it.",
          "My Salesforce work sits on the marketing side of that join. I design EDMs to Marketing Cloud templates, write and lay out sales offer content, build CloudPages, and connect campaigns and lead capture to Salesforce so the source survives into the sales record. The deep configuration of Sales Cloud is a different specialism, and the last section on this page is plain about where my work stops.",
        ],
      },
      {
        heading: "EDMs designed to Marketing Cloud templates",
        paragraphs: [
          "An EDM in Marketing Cloud is rarely a one-off. It is built from your templates and content blocks so the next launch, the next payment plan offer or the next event invitation can reuse it without a designer. I design within that system: your brand, your blocks, layouts that work on a phone first, images that are not carrying the message on their own, and alt text for the inboxes that block images.",
          "Sales offer content is where design and copy meet. A launch email has one job, getting a qualified buyer to ask for details, so the offer, the price point where you publish one and the call to action sit at the top, not under three paragraphs of introduction. Every send is tested across the main email clients before it goes to your list, and links carry UTM parameters so GA4 and the CRM can see what each email produced.",
        ],
      },
      {
        heading: "CloudPages that show sales data to the people who need it",
        paragraphs: [
          "CloudPages are Marketing Cloud's own web pages. Most companies use them for landing pages and preference centres. I have also built them to show company sales data to sales managers inside a custom application: figures held in Marketing Cloud, presented on a page designed for a quick read on a laptop or tablet rather than a report someone has to export.",
          "That use takes the same care as any internal tool. The page shows only what its audience needs, access is limited to the people who should see it, and the layout is designed around the two or three numbers a sales manager checks first. Campaign landing pages on CloudPages get the same treatment as any other landing page: message match with the email or ad, a short form, and tracking that records the conversion.",
        ],
      },
      {
        heading: "Campaigns and lead capture connected to Salesforce",
        paragraphs: [
          "Leads reach Salesforce from website forms through Web-to-Lead or the API, and from Meta and Google lead forms through connectors. Each one carries its source: the campaign, the medium and the UTM values captured on arrival, mapped to fields and to Salesforce Campaigns so reports can group them. Duplicates are checked before a lead is created rather than merged by hand later.",
          "The same submission is tracked in GA4 and the ad platforms through Google Tag Manager, so the numbers in Salesforce and the numbers in the ad accounts describe the same events. This is the same discipline as the [CRM integration](/services/crm-integration) work on any platform, applied to the system your sales team already uses.",
        ],
      },
      {
        heading: "Where my Salesforce work stops",
        paragraphs: [
          "I do not offer Sales Cloud administration, Apex development or complex permission and sharing models. Those belong with a certified Salesforce administrator or a Salesforce partner, and pretending otherwise would put your system at risk. On projects that need both, I work alongside your administrator: they own the platform, I own the email, the pages and the marketing data feeding it.",
          "It is also worth asking whether Salesforce is the right CRM at all. For a smaller team without an administrator, [Zoho CRM](/services/zoho-crm-integration) or [HubSpot](/services/hubspot-integration) usually delivers more for less effort. If you already run Salesforce, the marketing side is where most of the untapped value tends to be.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can web forms and ad leads go into Salesforce?",
        answer:
          "Yes. Web-to-Lead, the Salesforce API or a connector can create leads from your website forms, and Meta and Google lead forms can be connected the same way. The important part is the same as on any CRM: the campaign source travels with the lead, and the record is checked for duplicates before it is created.",
      },
      {
        question: "Is Salesforce worth it for a small team?",
        answer:
          "Often not. Salesforce is the most configurable of the major CRMs and needs someone to own that configuration. A small sales team without an administrator usually gets more from Zoho or HubSpot, and the CRM integration page compares the three.",
      },
    ],
  },

  "custom-crm-development": {
    blocks: [
      {
        heading: "When custom CRM development in Dubai is the right call",
        paragraphs: [
          "The signs are practical rather than technical. Someone spends part of every day copying leads between systems. Management reports are rebuilt in a spreadsheet each week because the CRM cannot produce them. The sales process has steps, approvals or relationships, such as brokers, projects and units, that the CRM can only represent with a workaround. Or a large team pays per-user licences for a platform it uses a fraction of.",
          "Even then, the first question is whether better configuration would do. Most teams that think they need a custom CRM need their current one set up properly, and the [CRM integration](/services/crm-integration) page covers that. A custom build is the answer when the gap is in what the software can represent, not in how it was configured.",
        ],
      },
      {
        heading: "What I have built and worked with",
        paragraphs: [
          "Two kinds of experience sit behind this page. I have worked inside a brokerage's custom CRM, with agents, listings and leads from several sources, so I know what a sales team needs from one day to day and where custom systems tend to fall short: reporting added late, integrations nobody monitors, and screens built for the developer rather than the agent.",
          "I have also built my own CRM and reporting platform from scratch. It takes in leads from forms and ad platforms, attributes each one to its campaign, syncs with the ad platforms and produces the reports I use to judge marketing, including for this site. Building and using it is where the opinions on this page come from.",
        ],
      },
      {
        heading: "The core: lead intake, pipelines and roles",
        paragraphs: [
          "A custom CRM starts with the data model, agreed before any screen is drawn: what a lead, a contact, a deal, a project, a unit and an agent are, which fields are required, and how they relate. Getting this right is most of the value, because every report and every screen depends on it.",
          "Then the parts a team touches every day. Lead intake from every source, with duplicates matched on arrival. Pipelines with the stages your team actually uses. Roles, so agents see their own leads, managers see their team and marketing sees sources without seeing everything. And an audit trail, so when a lead changes hands or a status changes, the record says who did it and when.",
        ],
      },
      {
        heading: "Attribution and ad platform syncs",
        paragraphs: [
          "This is where a custom CRM can do what packaged ones struggle with. Every lead stores its UTM parameters and its Google and Meta click IDs. Ad spend is pulled daily from Google Ads and Meta through their APIs, so cost per lead and cost per qualified lead are calculated from real figures rather than typed into a spreadsheet at the end of the month.",
          "Qualified leads and sales go back the other way, to Google Ads as offline conversions and to Meta through the Conversions API, so the platforms optimise towards buyers. The campaign side of that is on the [paid marketing](/services/paid-marketing) page. Each sync is monitored and logged, because ad platform APIs change and an integration that fails quietly is the main risk of owning the system.",
        ],
      },
      {
        heading: "The stack, and what you own",
        paragraphs: [
          "Custom CRMs here are built on the MERN stack, MongoDB, Express, React and Node.js, with Next.js for the web interface and TypeScript throughout. PostgreSQL replaces MongoDB where the reporting leans heavily on relationships between records. The same back end can serve a [mobile app](/services/mobile-app-development) for agents in the field, so a lead updated on a phone is updated everywhere.",
          "The repository, the database and the hosting accounts sit in your name from day one, and the system is documented so another developer could take it over. More on the build side, hosting included, is on the [custom web development](/services/custom-web-development) page, and the [pricing page](/pricing) explains how project and retainer work is charged.",
        ],
      },
    ],
    faqs: [
      {
        question: "What does it cost to run a custom CRM?",
        answer:
          "There are no per-user licences, but there is hosting, monitoring and developer time for changes and API updates. Over a few years that can come to less or more than a subscription, depending on team size and how much the system changes. The pricing page explains how project and retainer work is charged.",
      },
      {
        question: "Can we start with an off-the-shelf CRM and move later?",
        answer:
          "Yes, and it is often the sensible order. A year on Zoho or HubSpot shows which features your team uses and which reports matter, which makes the custom build smaller and better aimed. All three export their data, so moving later is a migration rather than a restart.",
      },
    ],
  },

  /** Method, not results: see the note on the category in
   *  `serviceCategories.ts`. Every
   *  paragraph below describes how the work is done rather than what it
   *  achieved, because no email campaign is published on this site to point at. */
  "email-marketing": {
    blocks: [
      {
        heading: "Email marketing in Dubai fails at the list, not at the writing",
        paragraphs: [
          "A nurture sequence sent to one undifferentiated list is a broadcast wearing a costume. The person who downloaded a floor plan last week and the person who enquired eighteen months ago and went quiet need different messages, and if the list cannot tell them apart then neither can the sequence. Segmentation is not an advanced feature you add later; it is the thing that decides whether any of it works.",
          "That segmentation has to come from data the forms actually capture. If the enquiry form collects a name and an email and nothing else, there is nothing to segment on, and no amount of writing fixes it. This is why the email work and the CRM work are the same job. I would rather change the form than write cleverer copy around a field that was never collected.",
        ],
      },
      {
        heading: "Sequences end, campaigns do not",
        paragraphs: [
          "A welcome sequence has a job and a finish line: take someone who just raised a hand, tell them what they need to decide, and hand them to a human or stop. Sequences that never end are how a list burns out, and an unsubscribe is the polite version of what actually happens: most people just stop opening, and the damage is invisible until a send that matters lands in a promotions tab.",
          "Campaigns are the other half: a launch, a price change, a construction update. They go to a segment rather than the whole list, and they are worth sending precisely because they are not automatic. Getting the split right is most of the work: automate the predictable, write the rest.",
        ],
      },
      {
        heading: "Where email sits in a UAE setup",
        paragraphs: [
          "WhatsApp is the default business channel here, and pretending otherwise produces an email programme nobody reads. But WhatsApp is the wrong tool for the long middle of a buying decision. A fourteen-message nurture on WhatsApp is an intrusion, and most people will block rather than unsubscribe. Email carries the contacts who are months from deciding; WhatsApp carries the ones who are minutes from it.",
          "The CRM is what decides which channel a contact is on, and when they move between them. That is a configuration decision rather than a writing one, which is why this page keeps returning to the plumbing rather than the prose.",
        ],
      },
      {
        heading: "Deliverability is a technical problem",
        paragraphs: [
          "A well-written sequence in a spam folder is worth nothing. SPF, DKIM and DMARC have to be right on the sending domain, the sending domain usually should not be the same one as your main site for bulk mail, and a new domain needs warming before it carries volume. None of that is marketing work and all of it decides whether the marketing work arrives.",
          "It is also the part most commonly skipped, because it is invisible when it is right and blamed on the copy when it is wrong. I check it before writing anything, and I will tell you if the reason your last campaign underperformed was a DNS record rather than a subject line.",
        ],
      },
    ],
    faqs: [
      {
        question: "What do you need from me to start?",
        answer:
          "Access to whatever list exists, the CRM if there is one, and the sending domain's DNS. If any of the three is missing that is fine; it just changes the first task from writing to setting up.",
      },
      {
        question: "Will you migrate an existing list?",
        answer:
          "Yes, and it is worth doing carefully rather than quickly. A list imported without its source and consent data is a list you cannot segment and should be cautious about mailing, so the migration is usually where the segmentation work actually happens.",
      },
      {
        question: "How often should we send?",
        answer:
          "Less than most tools encourage. The right answer depends on whether you have something to say, and a calendar that demands a send every Tuesday will invent reasons. I would rather set the cadence from your actual launch and project schedule.",
      },
    ],
  },
  "video-conversion": {
    blocks: [
      {
        heading: "What a video editor in Dubai should be briefed on",
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
          "Edits are cut in Adobe Premiere Pro, with CapCut for quick social cutdowns and captioned reels where turnaround matters more than a finishing pass.",
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
        question: "Which editing software do you use?",
        answer:
          "Adobe Premiere Pro for most edits, from launch films to property walkthroughs, and CapCut for fast short-form cutdowns and captioned reels. The software matters less than the brief: knowing what the video is for decides more than any tool.",
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
