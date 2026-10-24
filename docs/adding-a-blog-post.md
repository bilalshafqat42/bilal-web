# Adding a blog post

Each article is one file: `src/content/blog/<slug>.json`.
`src/content/blog/index.ts` lists them in display order, newest first. That
list decides the `/blog` pages, the related posts and the sitemap.

## Steps

1. Scaffold it:

   ```
   node scripts/new-post.mjs <slug>
   ```

   This writes the JSON file with `TODO` placeholders and adds the post to the
   top of `index.ts`. `published` and `updatedAt` are set to today (Dubai
   time). Use `--date YYYY-MM-DD` to set another date.

2. Fill in the file. Field rules are in `docs/daily-posts.md` (title,
   metaTitle, description, tags, image, blocks). Block types are defined in
   `src/data/blogPosts.ts`.

   Tags decide the post's topic (Marketing, Development, Design, AI & Tools)
   through `src/data/blogTopics.ts`. A new tag must be added there. For a
   news piece tied to a dated event, add `"kind": "News"`; otherwise the label
   is Tip (under 600 body words, a read of three minutes or less) or Guide.
   The rule is `kindOf` in the same file.

3. Check it:

   ```
   npm run related-check
   ```

   It tells you the correct `words` value if yours is wrong, and fails on an
   empty heading, a ragged table, a file missing from `index.ts`, a bad date,
   or a slug that matches a top-level route in `src/app`.

4. Measure the rendered page once it is live:
   `npm run onpage -- "https://bilalshafqat.com/<slug>" "<keyword>"` and
   `npm run serp -- /<slug>`. With no arguments, both measure their usual
   page lists, which do not include a new article.

## Slugs

Articles live at the root (`/my-post`, not `/blog/my-post`). A static route
with the same name wins, so the article would never show. That means any
top-level folder in `src/app`, or a folder directly inside a route group such
as `src/app/(marketing)/`, since a `(group)` adds nothing to the URL.
`[dynamic]`, `_private` and `@slot` folders do not count. The scaffold and
`related-check` both refuse a clashing slug, using the same list
(`scripts/lib/routes.mjs`).

Never rename a slug once it is live. It is the URL.

## Dates

| Field | Meaning |
| --- | --- |
| `published` | The day it went live. Shown on the page, in RSS and as `datePublished` |
| `updatedAt` | The last day the words changed. Used for the sitemap `lastmod` and `dateModified` |

When you change an article's content, set `updatedAt` to today. Leave it alone
for a typo fix. `updatedAt` can never be earlier than `published`.

## Order

New posts go at the top of the list in `index.ts`. Order is the list order, not
a sort by date, because several posts share a date. Moving a line in that list
moves the post on `/blog` and changes its related posts.
