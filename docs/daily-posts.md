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
