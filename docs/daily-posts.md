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
