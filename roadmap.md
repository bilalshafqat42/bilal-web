# Project: Bilal Shafqat — freelance website (UAE)

This file gives context for this codebase. Claude Code (or any AI assistant working in this repo) should read this before making changes, so the site build stays consistent with the brief below.

## Who this is for

Bilal is a UAE-based freelancer building his own personal brand website. He positions himself as a full-fledged, one-person digital marketing and product shop, not a narrow specialist. He personally covers:

- Performance development, web and mobile (builds the sites/apps himself)
- Design, web, app, and social media
- Paid campaigns / ads management (Meta, Google, TikTok)
- Automation (workflow / marketing automation)
- Performance marketing (results-driven reporting)

Positioning line: one person doing what usually takes an agency, no handoffs between departments, single point of contact. The site's main goal is to win clients and read as professional, not just look impressive.

## Hard rules (do not deviate without asking Bilal)

- **CTA wording**: always "Book a free consultation." Never "Book your site/free audit" — Bilal specifically rejected "audit" because it reads as SEO-specialist-only, and he doesn't want to be boxed into one service.
  - **Status: done.** Every CTA button across the homepage and /portfolio now reads "Book a free consultation." The Hero's primary (filled) button carries this; "View my work" is the secondary, outline-style button.
- **Portfolio section**: a grid/wall of client company logos, not project screenshot cards. Detailed case studies with real metrics belong on a separate Portfolio/Case Studies page, not the homepage.
  - **Status: structurally done, content pending.** Homepage shows a logo-wall section that links to `/portfolio`, which holds the full detailed write-ups. The logo tiles are still text placeholders — real client logos haven't been supplied yet.
  - **Decision confirmed:** the logo wall stands alone. Do not add a separate "industries worked in" tag row (Real Estate, SaaS, Startups) alongside it — one trust section here, not two.
- **This is a multi-page site**, not a single-page site. Do not collapse everything onto one homepage.
  - **Status: started.** `/` and `/portfolio` exist as separate routes. Services, About, Blog, FAQ, and a dedicated Contact page are still single sections on the homepage, not their own routes yet (see gaps below).

## Sitemap

- Home
- Services (deep breakdown per service: design, development, paid campaigns, automation, performance marketing)
- Portfolio / Case Studies (full write-ups with real numbers; logo wall on the homepage links here) — **built**
- About (personal story / growth narrative, expanded)
- Blog
- FAQ (full list; homepage only shows 4-5 questions)
- Contact / Book a consultation

## Homepage section order (current build)

This reflects what's actually in the code right now, after the CTA-wording and portfolio/logo-wall fixes.

1. Sticky navbar — CTA: "Book a free consultation." Secondary nav: Home / Services / Work / About / Process / Pricing. "Work" links to `/portfolio`, not an in-page anchor.
2. Hero — headline, sub-line, primary CTA "Book a free consultation," secondary "View my work" (links to `/portfolio`). Bilal's real photo sits directly in the hero. Includes a 3-item stat line ("15+ Years", "6 Services, One Partner", "Dubai, UAE") and a scrolling skills ticker (Paid Marketing, Performance Marketing, Web Design & Development, MERN Stack Development, Mobile App Development, Graphic Design, Social Media Management).
3. Services — "Seven Services, One Point Of Contact," grouped into 3 categories: Marketing & Growth, Website & App Dev, Brand & Content. Intentional, keep the categorized structure.
4. Logo wall — grid of client company tiles, currently text placeholders (e.g. "[Client Logo — Off-Plan Developer]"), links through to `/portfolio` for the full case studies. This is the sole portfolio/trust section on the homepage (no separate industries tag row, see decision above).
5. About Me — Bilal's photo, "Strategy and execution, under one roof" narrative, two bullet columns ("Core Services I Deliver" / "What Sets Me Apart").
6. How I Work — 4-step process: Understand the Brief, Plan & Design, Build & Launch, Optimize & Scale.
7. Growth Partnerships — segments by client type: Startups & Founders, Real Estate Developers & Agencies (UAE), In-House Teams & Growing Companies, Agencies & Consulting Partners.
8. Engagement Models — 4 packages: Project-Based, Monthly Retainer, Ongoing Partner / Dedicated Support, **Consulting & Advisory** (renamed from "Consulting & Audit" — see resolved decisions below).
9. Measurable Outcomes — 4 stat tiles plus 2 testimonial cards in one section. Testimonials are still placeholder content (see gaps).
10. Final CTA — "Book a free consultation," repeated.
11. Footer — contact details, secondary nav (Work now points to `/portfolio`).

### /portfolio (new page)

Full case-study write-ups (goal, role, execution bullets, outcome) for 5 projects: off-plan lead generation, a real estate launch campaign, continuous lead gen for agencies, a custom MERN marketing application, and a mobile app/brand/social launch. The last two still carry bracket placeholders (`[Client Industry]`, `[Add the real business goal]`) pending real client details.

## Resolved decisions (apply these in code)

1. **Package name**: rename "Consulting & Audit" to **"Consulting & Advisory"** everywhere it appears (Engagement Models section, and any pricing/portfolio references). Reason: reusing "audit" conflicts with the CTA-wording rule above, even though it's a package name and not a call-to-action.
2. **Logo wall vs. industries tags**: keep the logo wall only. Do not add a separate "industries worked in" tag row. If a future need arises to show sector coverage, fold it into the About Me or Services copy instead of adding a new homepage section.

## Open gaps (still need to be added/fixed)

- **Testimonials with real names and photos**: still placeholder brackets (`[Client Name]`) in the Measurable Outcomes section. This was flagged as the strongest trust signal after a personal photo.
- **Blog carousel**: not present. Add near the bottom of the homepage, above a future FAQ section.
- **FAQ section**: not present anywhere. Add before the final CTA, capped at 4-5 questions on the homepage (full list to live on a dedicated FAQ page).
- **Real client logos**: the logo wall exists and links to `/portfolio`, but all 5 tiles are text placeholders. Needs actual logo files (with each client's permission) before it reads as a genuine trust signal.
- **Case study placeholder content**: 2 of 5 write-ups on `/portfolio` still have bracket placeholders for goal/outcome text.
- **Remaining sitemap pages**: Services, About, Blog, and FAQ are still homepage sections only, not their own routes. Contact is a homepage section reused as a block on `/portfolio`, not a standalone page either.

Reference sites (adapt style, do not copy content):
- https://www.brionycullin.com/ (low-friction consultation CTA)
- https://www.punith.com/ (process steps)
- https://muradmurad.com/ (industries worked in — style reference only; not used as a separate homepage section, see resolved decisions)
- https://www.ryrob.com/ (growth story section — currently folded into About Me, could be pulled back out as its own section if it gets lost)
- https://www.sajidsulaiman.com/ (detailed breakdown section — currently folded into About Me)
- https://growwithward.com/ ("how I grow your business" framing — currently expressed via Growth Partnerships/Engagement Models instead)

## UX target

- Core Web Vitals (2026 Google real-user thresholds): LCP under 2.0s, INP under 200ms, CLS under 0.1
- WCAG AA accessibility: contrast, alt text on every image/logo, full keyboard navigation
- A real photo or short video of Bilal near the hero/process section (strongest personal trust signal for a solo freelancer) — **done**, keep it in the hero
- On mobile, collapse the deepest sections (growth story, detailed breakdown, "how I grow your business") or move that depth to inner pages so the homepage stays skimmable
- One consistent CTA style repeated throughout, never introduce a second competing CTA style
- Real user testing (heatmaps/session recordings) after launch — this is what actually closes the gap to excellent UX, not layout alone

## SEO target (Google, Bing — Yahoo results are Bing-powered so this covers both)

- HTTPS, XML sitemap submitted to Google Search Console and Bing Webmaster Tools
- Canonical URLs, unique meta title/description per page
- JSON-LD structured data: Organization, Service, FAQPage, Review schema
- Alt text on all images including the logo wall
- Internal linking across homepage, services, portfolio, blog
- E-E-A-T content signals: real case studies, credentials, named testimonials, blog content answering real client search queries
- Backlinks from credible sites (slow-moving factor, needs ongoing outreach, not a one-time build task)

## AI search / GEO target (ChatGPT, Claude, Perplexity, Gemini, Copilot)

This is an evolving space with no official published ranking algorithm from these providers as of 2026. Revisit every few months.

- robots.txt: explicitly allow GPTBot, ClaudeBot, Google-Extended, PerplexityBot; decide CCBot case by case
- Add an llms.txt file describing site content and sections. Note: as of early 2026, roughly 90% of AI crawler traffic ignores llms.txt and reads HTML directly, so clean semantic HTML matters more than the file itself
- Structure key content in question-first, FAQ-style blocks that match how clients actually phrase search prompts
- Use specific numbers in case studies (e.g. "3.2x ROAS") since AI engines favor evidence-dense, extractable content over vague claims
- Keep content refreshed; AI citation pools favor recently updated pages over stale ones

## Important caveat to keep repeating to Bilal

No on-page work guarantees a top ranking on Google, Bing, Yahoo, or citation in AI search results. Backlinks, domain age, and competition all matter and take months to build. This file describes what's fully controllable through design and technical build quality, not a ranking guarantee.