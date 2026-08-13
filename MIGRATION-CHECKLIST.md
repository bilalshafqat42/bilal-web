# Migration checklist — WordPress → Next.js (bilalshafqat.com)

Everything below is about **not losing the SEO you already have**. The build work is done;
this is the cutover procedure.

Current live site: WordPress + Rank Math, **88 indexed URLs**.
New app: all 88 URLs resolve (83 serve content directly, 5 redirect to a relevant equivalent).

---

## Before you switch the domain

- [ ] **Back up the WordPress site completely** — database + `wp-content`. Do not skip this.
      If anything goes wrong, this is the only way back.
- [ ] **Export Search Console data first**: Performance → Pages → last 12 months → Export.
      This is your before/after benchmark. You cannot get this retroactively.
- [ ] **Confirm which pages actually earn traffic** in that export. If a page is in the top 10
      and isn't in the preserved list below, tell me before launch.
- [ ] Note current totals so you can compare later: 33 organic visits/mo, 90 keywords,
      23 backlinks, On-Page score 80 (from Ubersuggest, 2026-08-13).
- [ ] Deploy the Next.js app to a **staging URL first** (e.g. Vercel preview) and click through
      10–15 of the migrated blog posts to sanity-check images and code blocks.

## What's preserved (already built and verified)

| Content | Count | How |
|---|---|---|
| Blog posts | 52 | Same URLs, same titles, same meta descriptions, full content + images |
| Category archives | 20 | Same nested URLs (`/category/react-js/redux/` etc.) |
| Pages served directly | 11 | `/`, `/services/`, `/portfolio/`, `/blog/`, `/about-me/`, `/contact-us/`, `/privacy-policy/`, `/training/`, 3 course pages |
| Pages 301-redirected | 5 | See below |
| Images | 330 | Downloaded into `public/wp-content/uploads/…` so the original paths still work |

**The 5 redirects** (all land on a topically relevant page, not the homepage):

| Old URL | Redirects to |
|---|---|
| `/ui-ux-design/` | `/services/design-content-conversion/#ui-ux-design` |
| `/web-design/` | `/services/design-content-conversion/#web-design` |
| `/web-development/` | `/services/website-app-development/#website-design-development` |
| `/web-application-development/` | `/services/website-app-development/#custom-marketing-tools-calculators` |
| `/card/` | `/contact-us/` |

Old Rank Math sitemaps (`/sitemap_index.xml`, `/post-sitemap.xml`, `/page-sitemap.xml`,
`/category-sitemap.xml`) also redirect to the new `/sitemap.xml`.

## Launch day

- [ ] Deploy the Next.js app to production.
- [ ] **Do not delete the WordPress install for at least 30 days.** Park it somewhere you can
      still reach (a subdomain or a local copy) in case something needs re-checking.
- [ ] Confirm HTTPS works and `http://` and `www.` both redirect to `https://bilalshafqat.com`.
- [ ] Spot-check these URLs live, in this order:
      - [ ] `https://bilalshafqat.com/` (homepage)
      - [ ] `https://bilalshafqat.com/react-usememo-hook-explained/` (a post, check images load)
      - [ ] `https://bilalshafqat.com/blog/`
      - [ ] `https://bilalshafqat.com/category/react-js/react-hooks/`
      - [ ] `https://bilalshafqat.com/services/paid-marketing/`
      - [ ] `https://bilalshafqat.com/sitemap.xml`
      - [ ] `https://bilalshafqat.com/robots.txt`
      - [ ] `https://bilalshafqat.com/ui-ux-design/` (should 301, not 404)

## Immediately after launch

- [ ] **Search Console → Sitemaps**: submit `https://bilalshafqat.com/sitemap.xml`.
      Leave the old `sitemap_index.xml` entry alone; it now redirects.
- [ ] **Search Console → URL Inspection**: request indexing for the homepage, `/blog/`,
      and `/services/`. This nudges Google to recrawl sooner.
- [ ] **Bing Webmaster Tools**: submit the same sitemap.
- [ ] Check **Search Console → Pages** after 48h for a spike in "Not found (404)".
      A few is normal; a lot means something's wrong — send me the list.
- [ ] Update the sitemap URL in Ubersuggest so its site audit tracks the new structure.

## First 30 days

- [ ] Watch **Search Console → Performance** weekly. A dip of 10–20% in the first 2–4 weeks is
      normal while Google recrawls. A drop that keeps going after 4 weeks is not — flag it.
- [ ] Watch **Coverage/Pages** for crawl errors.
- [ ] Don't change URLs again during this window. Let it settle first.

---

## Things that need your input (not blockers, but worth fixing)

1. **The two dev course pages were byte-identical on the old site.** `/react-js-development-course/`
   and `/frontend-development-course/` had the exact same content, which is duplicate content and
   splits their ranking. I've written them as genuinely different pages (React-specific vs.
   frontend fundamentals) — please read both and correct anything that isn't accurate.

2. **Copy-paste errors in the old course pages, now removed.** Both dev course pages contained
   graphic-design copy ("Adobe Illustrator, Photoshop… Basic Graphic Designing") that clearly
   belonged on the design course. Typos too ("IIntroduction", "Additionallay"). Not carried over.

3. **Stale pricing removed.** The graphic design course listed "Course Fee: 20,000 PKR" and
   "Enrollment Deadline: 15 April 2024". Both are out of date, and PKR pricing sits oddly on a
   Dubai business. Send me current figures and I'll add them back.

4. **Experience count.** The old `/about-me/` said "12+ years"; the new site says 15. I used 15
   to match the rest of the site — confirm that's right.

5. **The old site's `/training/` page referenced "KEY2CODE SOFTWARE HOUSE"** as the provider.
   I've written the new page under your own name. Confirm that's correct.

6. **Positioning gap, worth thinking about.** The old site ranked as a *full-stack developer and
   UI/UX designer*; the new one positions you as a *senior paid-marketing partner*. The blog is
   what earns your organic traffic, and it's all developer content. Keeping it is the right call
   (it's real proof for the Website & App Development and UI/UX pillars), but expect the keywords
   you rank for to stay developer-flavoured until you publish marketing content too.

---

## If traffic drops badly

1. Check Search Console → Pages for 404s first. That's the usual cause.
2. Compare against `seo-migration-inventory.md` — every old URL is listed there with its
   original title and meta description.
3. The WordPress backup is your rollback. That's why step one is not to delete it.
