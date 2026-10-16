# Daily posts — the template, and post 1

Roadmap 394. Seven posts, one a day, each shipped as a blog post here plus a
LinkedIn post and an Instagram carousel.

Post 1 below is the worked example. Posts 2 to 7 follow the same shape.

---

## The template

### Blog post

Lives in `src/content/blog/<slug>.json`, one file per post. Create it with
`node scripts/new-post.mjs <slug>` (see `docs/adding-a-blog-post.md`). Shape:

| Field | Rule |
| --- | --- |
| `title` | The hook. This is the `h1`, and it is allowed to be a sentence |
| `metaTitle` | The search version, under 60 characters, keyword at the front |
| `description` | 120-160 characters **and** under 920px. Run `npm run serp` |
| `published` | One per day, in order |
| `updatedAt` | Same as `published` at first; bump it when the words change |
| `tags` | From the existing set. `Paid Ads`, `Digital Marketing`, `Dubai` etc |
| `image` | Slide 1 of the Instagram carousel, 1200x630 |
| `blocks` | 5-6 `h2`, every one a claim or a question. Never a label |
| `words` | 850-1,100 body words |

**Title and metaTitle do different jobs and should not match.** The `h1` is read
by a person who already clicked; the `<title>` is read by someone deciding
whether to. Post 1 uses "Your Cost Per Lead Is Fine. Your Sales Team Is Still
Unhappy." and "Cost Per Lead vs Lead Quality".

**Inline links** are written `[[label|/path]]` in any paragraph or list item.
Internal paths only. Three per post, each in the sentence that earns it, not
bolted on at the end.

**Verify before publishing:**

```
npm run build
npm run onpage -- "http://localhost:3111/<slug>" "<target keyword>"
npm run serp -- /<slug>
```

Target 90+. Post 1 scores 96; the missing 4 are the image alt, which lands when
the carousel is designed.

### LinkedIn

The whole argument in the post body. 150 to 250 words. Link at the end, not in
the first comment.

Structure that works:

1. One line that states the contradiction
2. Three or four short paragraphs making the case
3. One concrete example with a real detail
4. The link

No hashtag block longer than three. No "thoughts?" at the end.

### The quote card

Generated, not drawn. One sentence in, four platform sizes out:

```
npm run cards
```

Writes HTML and PNG to `.post-cards/` (gitignored). To add a post, copy the
block in `scripts/post-cards.mjs` and change four fields. A `*phrase*` gets the
gold highlight block.

| File | Size | For |
| --- | --- | --- |
| `<name>-link.png` | 1200 x 630 | Blog lead image, LinkedIn and Facebook link cards |
| `<name>-feed.png` | 1080 x 1350 | Instagram and Facebook feed |
| `<name>-pin.png` | 1000 x 1500 | Pinterest |
| `<name>-story.png` | 1080 x 1920 | Stories |

The link card becomes the post's `image`, which is both the article hero and
the share card:

```
sips -s format jpeg -s formatOptions 82 .post-cards/<name>-link.png \
  --out public/blog/<name>/card.jpg
```

**On the Musemind reference.** The structure is borrowed and the palette is
not. Their cream-and-green is their brand, and someone clicking a cream card
through to a black site has been handed two companies. These use the site's own
`--color-bg` and `--color-gold`.

Two things from the reference are deliberately absent. The **verified badge**,
because drawing a platform's verification mark on your own graphic is a lie
about the platform. And the **connector line between the two highlights**,
which is the most recognisable thing on their card and the fastest way to look
like a copy of the account you learned from.

One rule the generator enforces: **a highlighted phrase never breaks across
lines.** The first render split "cost per" from "lead" and the card read as a
rendering fault rather than as emphasis.

### Instagram

Carousel, 5 to 7 slides, one idea per slide.

| Slide | Content |
| --- | --- |
| 1 | The claim, large. This file also becomes the blog `image` |
| 2 | Why the usual answer is wrong |
| 3-5 | The argument, one step each |
| 6 | What to do this week |
| 7 | Who you are, one line, and where to read the rest |

Build on the LEOS board design system so the grid reads as one account.

### Rules that apply to all seven

- **Never paste the same text in two places.** Google picks one page when text
  is duplicated and it will not pick this domain over LinkedIn.
- **Publish the blog post before the social post**, so the link works on day one.
- **No invented numbers.** Post 6 is the only one with figures and they are this
  site's own measured Cloudflare results.
- Ping IndexNow on publish. For Bing, which feeds Copilot. Google crawls anyway.

---

## Post 1

**Blog:** `/cost-per-lead-is-fine-sales-team-unhappy` — live in the data, 857
words, scores 96/100 on "cost per lead".

### LinkedIn

```
Two reports land on the same desk every month.

The media buyer's report says cost per lead is down. The sales manager says the
leads are rubbish.

Both are telling the truth.

Cost per lead is set by the campaign — audience, bid, creative. A media buyer
can move it this week without speaking to anyone.

Lead quality is set by the page. What it says the thing costs. What the form
asks. Whether someone who is never going to buy finds that out in two seconds
or after a sales call.

So when a campaign is judged on cost per lead alone, the cheapest way to win is
to make the page ask for less and promise more. Volume goes up, quality goes
down, the report improves. Nobody has done anything wrong.

On a Dubai property launch I put the entry price in the hero. From AED 1
million, before anything else on the page. Someone whose budget is a third of
that leaves in two seconds instead of after a call.

That costs clicks. It looks worse on a traffic report. It produces a better
cost per qualified lead, which is the number that decides whether the spend
paid for itself.

One change fixes most of this: stop reporting every lead and start reporting
the ones your sales team would call again.

Full version, including what to do this week:
bilalshafqat.com/cost-per-lead-is-fine-sales-team-unhappy
```

### Instagram carousel

| Slide | Text |
| --- | --- |
| 1 | **Your cost per lead is fine.** Your sales team is still unhappy. |
| 2 | They are not the same number. One is set by the campaign. The other is set by the page. |
| 3 | A media buyer can change cost per lead this week. Nobody asks them to change the page. |
| 4 | Three things decide lead quality, and none are targeting settings: the price on the page, what the form asks, where existing customers go. |
| 5 | On a Dubai launch I put the entry price in the hero. Fewer clicks. Better cost per qualified lead. |
| 6 | **This week:** mark your last 20 leads qualified or not. Divide spend by that number. That is your real cost. |
| 7 | I run the campaign and build the page it lands on. Full post at bilalshafqat.com |

**Caption:** the first three lines of the LinkedIn post, then "Full breakdown
on the site, link in bio."

---

## Still to do on post 1

- Design the carousel. Slide 1 at 1200x630 goes into the post's `image` field,
  which also replaces the default share card.
- Decide the publish date. Currently set to 2026-10-12.

---

## Post 2

**Blog:** `/your-landing-page-is-part-of-your-ad-spend`, live, dated
2026-10-13. Social goes out on the 13th so the date on the article matches.

**Cards** (in `.post-cards/`, gitignored, so only on the machine that ran
`npm run cards`; the 1200x630 version is also in git at
`public/blog/landing-page-ad-spend/card.jpg`):

| Platform | File |
| --- | --- |
| LinkedIn, Facebook, Google Business Profile | `landing-page-ad-spend-link.png` |
| Instagram feed, Facebook feed | `landing-page-ad-spend-feed.png` |
| Pinterest | `landing-page-ad-spend-pin.png` |
| Instagram and Facebook stories | `landing-page-ad-spend-story.png` |

Full URL for every platform:
`https://bilalshafqat.com/your-landing-page-is-part-of-your-ad-spend`

### The card Bilal designed (2026-10-12)

He designed post 2's card himself in a new light style: cream ground, faint
grid, dark Montserrat type, the word "is" in gold, his photo and "Digital
Marketer" at the foot. 1080x1350, used for Instagram, Facebook, LinkedIn, X
and Threads. Pinterest needs a 1000x1500 version.

His first draft reused post 1's bullets (price on the page, form fields,
existing customers, qualified leads). Rewritten to post 2's own argument, the
cost of a slow page change:

```
Your landing page is your ad spend.

The ad buys the click. The page decides what it costs.

Before you blame the campaign, check:
• Price: can people see it without scrolling?
• Form: four fields or fewer?
• Button: does it say what happens, not just "Submit"?
• Changes: live in two days, not two weeks?

A two-week page fix means two weeks of ads on the wrong page.
The delay costs more than the change.
```

Worth carrying to posts 3 to 7: **each card's bullets must come from its own
post.** The same four checks on every card would make the series read as one
post repeated.

### LinkedIn

```
Most businesses have an ad budget and a website budget, and treat them as two
separate things.

The ad budget is monthly and someone watches it. The website budget was spent
once, a year and a half ago, and nobody has opened the file since.

Then every dirham of the campaign lands on that page.

An ad buys a click. The page decides what the click is worth: whether the price
is clear, whether the form can be finished on a phone, whether the visitor knows
in two seconds if this is for them.

Here is what a small page change usually looks like:

Day 1: someone spots that the form is too long.
Day 4: the developer schedules it.
Day 11: it goes live.

For all eleven days the campaign keeps spending, at full budget, on a page
everyone already agreed was wrong. That cost never appears on an invoice, so
nobody counts it.

The fixes are rarely redesigns. Price above the fold. Six form fields down to
three. A button that says what it does instead of "Submit". Each one takes
longer to schedule than to do.

If your page takes two weeks to change, you are paying for those two weeks in
ad spend.

Full breakdown, with a four-step check you can do on your phone today:
bilalshafqat.com/your-landing-page-is-part-of-your-ad-spend
```

### Instagram and Facebook

Instagram: swap the bio link to the post URL before posting. Facebook: put the
URL at the end instead of "link in bio".

```
An ad buys the click. Your landing page decides what that click costs.

When a simple form change takes eleven days to go live, the campaign does not
pause. It spends eleven days of budget on a page everyone already agreed was
wrong.

The fixes are small: price above the fold, fewer form fields, a button that says
what it does. Each takes longer to schedule than to do.

Full breakdown on the site, link in bio.

#PaidAds #LandingPage #DubaiMarketing
```

### X

```
An ad buys the click. The landing page decides what it costs you.

If a form change takes eleven days to go live, the campaign spends eleven days of budget on a page everyone agreed was wrong.

bilalshafqat.com/your-landing-page-is-part-of-your-ad-spend
```

### Threads

```
An ad buys the click. The landing page decides what it costs you.

If a form change takes eleven days to go live, the campaign spends eleven days of budget on a page everyone already agreed was wrong.

The fixes are small. Price above the fold. Fewer form fields. A button that says what it does. Each takes longer to schedule than to do.

bilalshafqat.com/your-landing-page-is-part-of-your-ad-spend
```

### Pinterest

Board: **Paid Ads & PPC**. Image: the pin card. Link: the full URL.

- **Title:** Landing Page vs Ad Spend: 5 Small Page Fixes That Matter
- **Description:** An ad buys the click. Your landing page decides what that
  click costs. Five small fixes that change your cost per enquiry: price above
  the fold, a shorter form, a button that says what it does, a lower-commitment
  option, and a separate route for existing customers. Practical paid ads advice
  for UAE businesses.

### Google Business Profile

Add update, link card, button **Learn more** to the full URL.

```
Your landing page is part of your ad spend.

An ad buys the click. The page decides what that click costs. When a simple page
change takes two weeks, the campaign keeps spending on the old page the whole
time.

The fixes are usually small: price above the fold, a shorter form, a clearer
button. Read the full breakdown and a four-step check you can do today.
```

---

## AI explainer series (drafted 2026-10-14)

Bilal's request, 2026-10-14: people are hungry to learn AI, so a visual
"X vs Y vs Z" explainer series, in the style of the RAG vs CAG vs KAG posts
doing well on LinkedIn. **Written from scratch, not adapted from anyone's
post.** Each topic sits where AI meets marketing, so the audience it builds
is the one that hires a digital marketer.

**Format.** One card (three columns, one line each) plus the text below.
Hook line, one paragraph per concept, a three-line summary, one question.
No statistics unless they are ours and checked.

**Avoid Unicode "bold" letters** (𝗟𝗶𝗸𝗲 𝘁𝗵𝗶𝘀) in the hook: screen readers
spell them out letter by letter and LinkedIn search can't read them. Plain
capitals or the card itself do the job.

### Why AI, and the angle that makes it ours

AI is the most discussed topic online, so posts about it travel. But generic
AI explainers are everywhere, and they attract people who want to learn AI,
not people who hire a marketer. **Every post is AI explained through
marketing and business:** what it means for getting found, getting leads and
spending ad budget. That keeps the reach and points it at buyers.

### Daily rhythm (Monday to Friday, UAE week)

| Day | Format | Card |
| --- | --- | --- |
| Mon | **X vs Y vs Z** explainer | Three columns, one line each |
| Tue | **Myth vs fact** | "Myth:" line, "Fact:" line, one proof point |
| Wed | **Workflow** (a prompt or process you can copy) | Numbered steps |
| Thu | **Marketing lesson** (the core series: ads, landing pages, leads) | Light card, checklist (like post 2) |
| Fri | **AI search for business** (how AI finds and recommends businesses) | Three columns or checklist |

Thursday keeps the paid-ads and landing-page series alive, so the profile
doesn't turn into an AI page. Weekends off.

### Rules

- **No invented numbers.** A statistic goes in only if it is ours and
  checked, or from a named source we can link.
- **No AI news we can't verify.** If a post depends on a new product or
  feature, check the maker's own announcement on the day.
- **One idea per post.** If it needs two cards, it is two posts.
- Every post ends with a question, and the link goes in the first comment.
- Card titles in plain text, never Unicode "bold" letters.

### First four weeks

| # | Day | Topic | Card summary |
| --- | --- | --- | --- |
| A1 | Mon | SEO vs AEO vs GEO | Rank it / Answer it / Get cited |
| A2 | Tue | Myth: "Google penalises AI content" | Fact: Google judges helpfulness, not who typed it; mass-produced filler is what gets hit |
| A3 | Wed | The 3-prompt ad brief | Paste the call notes / ask for the audience and objection / ask for 5 headlines |
| A4 | Thu | (marketing post 3) | |
| A5 | Fri | Why ChatGPT recommends your competitor | Consistent name / mentions elsewhere / pages it can read |
| A6 | Mon | Prompting vs RAG vs fine-tuning | Ask it / Give it your files / Retrain it |
| A7 | Tue | Myth: "AI will replace marketers" | Fact: it replaces tasks, not judgement about what to say and to whom |
| A8 | Wed | Turn one blog post into a week of posts | Summarise / reframe per platform / check every claim |
| A9 | Thu | (marketing post 4) | |
| A10 | Fri | AI Overviews vs ChatGPT search vs Perplexity | Where each one finds its answer |
| A11 | Mon | Chatbot vs AI assistant vs AI agent | Answers / Helps / Acts |
| A12 | Tue | Myth: "Longer prompts get better answers" | Fact: clearer prompts do; give context, an example and the format |
| A13 | Wed | A lead-reply assistant that doesn't embarrass you | Your FAQs in / tone rules / a human checks pricing |
| A14 | Thu | (marketing post 5) | |
| A15 | Fri | Schema vs llms.txt vs robots.txt | Explain it / Summarise it / Allow it (llms.txt is a proposal, say so) |
| A16 | Mon | Tokens vs context window vs memory | Why AI "forgets" your brief halfway through |
| A17 | Tue | Myth: "AI knows today's prices" | Fact: only what it was trained on or can look up |
| A18 | Wed | Three checks before you publish AI-written copy | Facts / numbers / claims you can't back |
| A19 | Thu | (marketing post 6) | |
| A20 | Fri | Smart bidding vs Performance Max vs Advantage+ | What the ad platforms' AI actually decides for you |

After four weeks, keep the topics whose posts got comments and saves, and
drop the rest. Comments and saves matter more than likes.

### Post A1: SEO vs AEO vs GEO

**Card:** three columns.
SEO: "Rank it" / the page wins the click.
AEO: "Answer it" / the page becomes the answer.
GEO: "Cite it" / the brand gets named by AI.
Footer: bilalshafqat.com

**LinkedIn text:**

```
SEO vs AEO vs GEO

Every search strategy now answers one question: when someone asks, does your business show up, get quoted, or get named?

SEO treats search as a list to rank in. Google reads your pages, judges how relevant and trusted they are, and places them among the results. The prize is the click. It still drives most website visits, but a ranking only pays off when someone chooses your link over the nine around it.

AEO treats search as a question to answer. More results now end before the click: a featured snippet, a voice assistant, an AI Overview at the top of Google. AEO is writing so your page becomes that answer: the question as a heading, a clear answer in the first two sentences, then the detail. The prize is being the answer, even when nobody clicks.

GEO treats search as a conversation to be part of. When someone asks ChatGPT, Gemini, Perplexity or Copilot "who should I hire for this in Dubai?", the assistant builds one answer from many sources and names a few businesses. GEO is making sure yours is one of them: pages AI crawlers can read, the same name and description everywhere, and other sites that mention you. The prize is being recommended.

Three approaches, three ways of being found:
Rank it → SEO
Answer it → AEO
Get cited → GEO

They are not three separate projects. They are three layers on the same foundation: clear pages, honest facts and a brand people talk about. Skip the first and the other two have nothing to stand on.

Which one is your business set up for today?

#SEO #AISearch #GEO #DigitalMarketing #Dubai
```

**Checks before posting.** Link in the first comment, not the post, to
`/services/seo` (the AEO and GEO work lives there). Run the text through
the em dash rule: none.

### Post A6: Prompting vs RAG vs fine-tuning

**Card:** three columns.
Prompting: "Ask it" / instructions in the message.
RAG: "Give it your files" / it looks things up first.
Fine-tuning: "Retrain it" / it learns a new habit.
Footer: bilalshafqat.com

**LinkedIn text:**

```
Prompting vs RAG vs fine-tuning

Every business using AI hits the same question: how do I make it answer like it knows my business?

Prompting is asking better. You put the instructions, the context and an example of a good answer into the message itself. Nothing to set up, nothing to pay for, and it solves most problems. The limit is that the AI only knows what it was trained on plus what you paste in.

RAG gives it your files. RAG stands for retrieval-augmented generation: the AI is connected to your documents, searches them when a question comes in, and answers from what it finds. Your price list, your FAQs, your policies. Update a document and the next answer changes. The limit: the answer is only as good as the documents and the search.

Fine-tuning retrains it. You show the model hundreds or thousands of examples until it picks up a habit: a tone, a format, a specialised task. It changes how the AI behaves, not what it knows today, so it is the wrong tool for prices or stock that change every week.

Three approaches, three different jobs:
Ask it → prompting
Give it your files → RAG
Retrain it → fine-tuning

For most businesses the order is simple. Start with better prompts. Add RAG when the AI needs your own facts. Fine-tune only when you have tried both and have the examples to prove you need it.

Which one is your team using today?

#AI #GenerativeAI #DigitalMarketing #Dubai
```

**Instagram caption:**

```
Prompting, RAG or fine-tuning? Three ways to make AI answer like it knows your business.

Ask it better. Give it your files. Retrain it.

Most businesses only ever need the first two. Swipe for the difference.

#AI #ChatGPT #DigitalMarketing #DubaiBusiness
```

---

## Post 3 (2026-10-15)

**Blog:** `/what-to-track-in-marketing-uae`, 888 words, on-page 86/100 for
"marketing metrics to track" (only the hook H1 misses, by design). Links to
`/services/crm-marketing-automation`, post 2 and post 1. Tags Digital
Marketing, Dubai (routes to the digital marketing service page).
Site card: `public/blog/what-to-track/card.jpg` ("Your CRM is the *only
honest* lead count."); feed, pin and story sizes in `.post-cards/what-to-track-*`.

Full URL: `https://bilalshafqat.com/what-to-track-in-marketing-uae`

### Card text (for Bilal's light-style design, 1080x1350)

```
Your CRM is the only honest lead count.

Ad platforms count clicks. Your CRM counts customers.

Before you trust the dashboard, check:
• Source: does every lead say which campaign it came from?
• Count: CRM total next to Meta + Google, side by side?
• Quality: is each lead marked qualified or not?
• Speed: was it answered within the hour?

Meta and Google can both claim the same lead.
Your CRM can't.
```

Alt text: Card reading "Your CRM is the only honest lead count." Four checks
before trusting the ad dashboard: lead source, CRM count against Meta and
Google, qualified or not, reply speed. By Bilal Shafqat, Digital Marketer.

### LinkedIn

```
Meta says 48 leads this month. Google says 31.

Add them up and it sounds like a good month. Then ask the sales team how many enquiries they actually spoke to.

The number is smaller. Sometimes much smaller.

Nobody is lying. Each platform counts a conversion by its own rules, and both are generous. Someone sees your Instagram ad on Monday and searches your name on Wednesday: Meta and Google can each claim that one enquiry. Add the dashboards together and you have counted one person twice.

A WhatsApp tap gets counted too. That is someone opening a chat, not someone starting a conversation.

The only count that cannot be double-claimed is the one in your CRM. So that is the one to run the business on:

Enquiries that reached the CRM, by source
Qualified enquiries
Cost per qualified enquiry
Time to first reply
Won deals, traced back to the campaign

This week, export last month's leads, put the number next to what Meta and Google reported, and divide your spend by the qualified ones. That is your real cost.

Full breakdown:
bilalshafqat.com/what-to-track-in-marketing-uae

#DigitalMarketing #CRM #Dubai
```

### Meta (Facebook, Instagram, Threads in one post; under 500 characters)

```
Meta says 48 leads. Google says 31. Your sales team spoke to far fewer.

Both platforms can claim the same enquiry, and a WhatsApp tap is not a conversation. The only count that can't be double-claimed is your CRM.

Track leads by source, qualified leads, cost per qualified lead and reply time.

Full breakdown: bilalshafqat.com/what-to-track-in-marketing-uae

#DigitalMarketing #CRM #DubaiBusiness #MarketingTips
```

Instagram: put the link in the bio. Facebook: button "Learn more" to the full URL.

### X

```
Meta and Google can both claim the same lead. Add the dashboards and you count one person twice.

Run the business on the number in your CRM.

bilalshafqat.com/what-to-track-in-marketing-uae

#DigitalMarketing #CRM
```

### Pinterest

Board: **Digital Marketing**. Image: the pin size (1000x1500).
- **Title:** Marketing Metrics to Track: Why Your CRM Beats the Ad Dashboard
- **Description:** Meta and Google count conversions by their own rules and
  often claim the same lead. The five marketing metrics a UAE business should
  track instead: leads by source, qualified leads, cost per qualified lead,
  reply time and won deals.

### Google Business Profile

Add update, button **Learn more** to the full URL.

```
Your CRM is the only honest lead count.

Meta and Google each count conversions by their own rules, and both can claim the same enquiry. Track leads by source, qualified leads, cost per qualified lead and reply time instead. Read the full breakdown.
```

### Medium

Weekly rhythm: not before 2026-10-21. Import from the URL. Title "Marketing
Metrics to Track: Your CRM Beats the Dashboard"; tags Digital Marketing,
Marketing Analytics, CRM, Lead Generation, Marketing Strategy. Rewrite the one
table as bold-label lines after import.

---

## Post 4 (2026-10-16): Google Tag Manager update

**Blog:** `/google-tag-manager-update-october-2026`, 846 words, dated
2026-10-16. Sources: Google's Tag Manager release notes, entries of
8 October 2026 ("Standardizing gtag('config') command behavior") and
12 October 2026 ("Optimizing Google Tag Manager containers"),
https://support.google.com/tagmanager/answer/4620708 . **Links to Post 3, so
publish both together.** Site card `public/blog/gtm-update/card.jpg`; all
sizes in `.post-cards/gtm-update-*`.

Full URL: `https://bilalshafqat.com/google-tag-manager-update-october-2026`

### Card text (light style, 1080x1350)

```
Google Tag Manager changed. Check your tracking.

Two updates in October. No new buttons. Your numbers can still move.

Before your next campaign, check:
• Snippets: GTM and gtag('config') on the same page?
• Triggers: any custom event set to fire on every event?
• Preview: does a gtag.config event fire a tag it shouldn't?
• Reports: conversions jumped after 8 October with no change in spend?

Tracking isn't set up once.
Platforms change it without asking.
```

Alt text: Card reading "Google Tag Manager changed. Check your tracking."
Four checks: GTM and gtag config on the same page, wildcard custom event
triggers, Preview mode, conversions after 8 October. By Bilal Shafqat,
Digital Marketer.

### LinkedIn

```
Google changed how Tag Manager works twice in one week this October.

No new buttons. No email to most account owners. But your tracking can report differently from 8 October without anyone touching it.

12 October: a Tag Manager container can now send data straight to GA4 and Google Ads without loading a separate gtag.js file. Less weight on the page your ad clicks land on. That part is good news.

8 October: every container now starts on load, and gtag('config') commands show up in the dataLayer as gtag.config events. If your container has custom event triggers set to fire on any event, they can now fire tags you never meant to fire. A conversion counted twice. A pixel event on page load.

Sites most at risk are the ones built in layers: a developer added the Google tag years ago, an agency added Tag Manager later, and both still run.

Four checks for this week:
Search your page source for gtag('config' and GTM- together
List every wildcard custom event trigger
Load a page in Preview and watch for gtag.config
Compare conversions before and after 8 October

Tracking is not set up once. Platforms change it without asking.

Full breakdown with the five checks:
bilalshafqat.com/google-tag-manager-update-october-2026

#GoogleTagManager #GA4 #DigitalMarketing
```

### Meta (Facebook, Instagram, Threads; under 500 characters)

```
Google changed how Tag Manager works in October, and your tracking can report differently without anyone touching it.

If your site runs Tag Manager and gtag('config') together, check your wildcard triggers. They can now fire tags you never meant to.

Five checks for this week in the full post: bilalshafqat.com/google-tag-manager-update-october-2026

#GoogleTagManager #GA4 #DigitalMarketing #DubaiBusiness
```

Instagram: link in bio. Facebook: button "Learn more" to the full URL.

### X

```
Google changed Tag Manager twice in October. If your site runs GTM and gtag('config') together, wildcard triggers can now fire tags you never meant to.

Five checks: bilalshafqat.com/google-tag-manager-update-october-2026

#GoogleTagManager #GA4
```

### Pinterest

Board **Digital Marketing**, pin size image.
- **Title:** Google Tag Manager Update October 2026: 5 Tracking Checks
- **Description:** Google changed how Tag Manager sends data and handles
  gtag config in October 2026. What changed, which sites it affects, and five
  checks to keep your conversion tracking accurate.

### Google Business Profile

Add update, button **Learn more** to the full URL.

```
Google Tag Manager changed in October 2026.

If your website runs Tag Manager alongside gtag config code, some triggers can now fire tags you never intended, and conversions can be counted twice. Read the five checks to do before your next campaign.
```

### Medium

Not before 2026-10-26 (weekly rhythm; post 3 goes first). Import from URL.
Title "Google Tag Manager Update October 2026: What to Check"; tags Google Tag
Manager, Google Analytics, Digital Marketing, Marketing Analytics, Conversion
Tracking.

---

## Google review request (drafted 2026-10-16, send when ready)

Get the link first: Google Business Profile, **Ask for reviews** (or "Get more
reviews"), copy the short review link. Send to past clients one by one on
WhatsApp, not as a broadcast.

**Google's rules (follow them):** no discounts, gifts or anything in return
for a review; ask everyone, not only clients you expect to be happy (no
"review gating"); never write or suggest the review text for them.

**WhatsApp message (personalise the first line each time):**

```
Hi [Name], hope you're well. It was great working with you on [project].

I'm building up my Google profile as a freelance digital marketer in Dubai, and a short review from you would really help other businesses decide whether to work with me.

If you have two minutes, here's the link: [review link]

A sentence or two about what we worked on and how it went is perfect. Thank you either way.

Bilal
```

**Follow-up (only once, after 5-7 days, if no reply):**

```
Hi [Name], just a gentle reminder about the review, only if you have a moment: [review link]. Thanks again.
```

Reply to every review within 48 hours (roadmap 398 §4).

---

## Post 5 draft (for Thursday 2026-10-22): Why your retargeting is burning budget

Not on the site yet (draft text only). Topic from roadmap 394, post 4:
"Audience built on a page that never segmented the traffic". Links to
`/services/facebook-ads`, `/your-landing-page-is-part-of-your-ad-spend`,
`/what-to-track-in-marketing-uae`. No statistics.

**Title (h1):** Your Retargeting Isn't Failing. It's Following the Wrong People.
**metaTitle:** Why Retargeting Ads Burn Budget (and the Fix)
**Description:** Retargeting usually shows ads to everyone who visited, including staff, job seekers and existing customers. How to build audiences that convert.

**Outline (850-1,000 words when written up):**
1. *Retargeting feels safe, and that's the problem.* "Show ads to people who
   already visited" sounds like the cheapest money in marketing. Default
   audiences are "all website visitors, last 30 days".
2. *Who is actually in "all visitors".* Staff checking the site, job
   seekers on the careers page, existing customers logging in or looking up
   contact details, competitors, bots, people who bounced in two seconds. The
   ad budget follows all of them equally.
3. *The page decides the audience.* If the site never separates intent
   (pricing page vs careers page vs a two-second bounce), the ad platform
   can't either. Segmenting starts on the page, not in Ads Manager.
4. *Five audiences worth paying for.* Viewed pricing or a project page;
   spent 30+ seconds or scrolled 50%; started the form but didn't submit;
   watched 50% of a video; engaged with a lead form but didn't finish. And
   exclude: existing leads and customers (CRM list), staff, careers-page
   visitors.
5. *Frequency and fatigue.* Cap frequency, rotate creative, and give each
   audience a different message (the pricing viewer needs an offer; the
   video viewer needs proof).
6. *What to do this week.* Open Ads Manager, find every retargeting
   audience, check what defines it, add the CRM exclusion list, and split one
   "all visitors" audience into two by intent.

**Card text (light style, 1080x1350):**

```
Your retargeting is following the wrong people.

"All website visitors" includes your staff, job seekers and existing customers.

Before you spend another dirham, check:
• Intent: retarget pricing and project page viewers, not everyone
• Exclude: current leads and customers from your CRM
• Exclude: staff and careers page visitors
• Message: a different ad for each audience

Retarget people who showed intent.
Not people who showed up.
```

Captions (LinkedIn, Meta, X, Pinterest, GBP) to write once the article is
approved and live.

---

## Article: How to choose a mobile app developer in Dubai (live 2026-10-16)

URL: `https://bilalshafqat.com/how-to-choose-a-mobile-app-developer-in-dubai`
Card: `public/blog/app-developer/card.jpg` ("Choose the developer *before the
features.*"); other sizes in `.post-cards/app-developer-*`. Ubersuggest
draft, rewritten (roadmap 412). Onpage 96 for "mobile app developer dubai".

### Card text (light style, 1080x1350)

```
Choose the developer before the features.

Most apps fail at the hiring decision, not the build.

Before you sign, check:
• Outcome: what must the app do for the business?
• Proof: a working app you can install, not only mock-ups
• Ownership: code, developer accounts and keys in your name
• CRM: how a lead in the app reaches your sales team

An app that doesn't feed your CRM
is a marketing dead end.
```

### LinkedIn

```
Most Dubai founders and property developers don't fail at building an app. They fail at choosing who builds it.

The wrong choice doesn't just cost money. It costs months of rebuild time, broken lead pipelines and an app that does nothing for the business.

Four checks before you sign with any mobile app developer:

Outcome first. Leads, qualified buyers, follow-up? An app without a commercial goal is an expense.

Working proof. A test build you can install on your own phone tells you more than any mock-up.

Ownership in writing. Source code, Apple and Google developer accounts, signing keys. All yours once you've paid.

CRM from day one. Every enquiry in the app should land in Zoho, HubSpot or Salesforce with its source attached.

And a small paid scoping task before the full build. It surfaces most problems while they're still cheap.

Full guide, with the costs that rarely appear in the first quote:
bilalshafqat.com/how-to-choose-a-mobile-app-developer-in-dubai

#MobileApps #Dubai #DigitalMarketing
```

### Meta (Facebook, Instagram, Threads; under 500 characters)

```
Most apps don't fail at the build. They fail at the hiring decision.

Before you sign with a mobile app developer in Dubai: define the business outcome, test a working build yourself, get the code and developer accounts in your name, and make sure every lead reaches your CRM.

Full guide: bilalshafqat.com/how-to-choose-a-mobile-app-developer-in-dubai

#MobileApps #DubaiBusiness #AppDevelopment #DigitalMarketing
```

### X

```
Most apps fail at the hiring decision, not the build.

Before you sign: outcome first, a working build you can install, code and accounts in your name, CRM from day one.

bilalshafqat.com/how-to-choose-a-mobile-app-developer-in-dubai

#MobileApps #Dubai
```

### Pinterest
- **Title:** How to Choose a Mobile App Developer in Dubai: 5 Checks
- **Description:** The brief, tech stack, hidden costs, UAE data rules, CRM
  integration and the red flags that tell you to walk away before signing with
  a mobile app developer in Dubai.

### Google Business Profile

```
Choosing a mobile app developer in Dubai? Check the business outcome, test a working build, get the code and developer accounts in your name, and make sure every lead reaches your CRM. Read the full guide.
```
