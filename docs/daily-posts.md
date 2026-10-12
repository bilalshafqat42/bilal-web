# Daily posts — the template, and post 1

Roadmap 394. Seven posts, one a day, each shipped as a blog post here plus a
LinkedIn post and an Instagram carousel.

Post 1 below is the worked example. Posts 2 to 7 follow the same shape.

---

## The template

### Blog post

Lives in `src/data/blogPosts.json`. Shape:

| Field | Rule |
| --- | --- |
| `title` | The hook. This is the `h1`, and it is allowed to be a sentence |
| `metaTitle` | The search version, under 60 characters, keyword at the front |
| `description` | 120-160 characters **and** under 920px. Run `npm run serp` |
| `published` | One per day, in order |
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
