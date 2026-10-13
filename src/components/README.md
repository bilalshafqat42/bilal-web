# Components

Grouped by role. Import with the alias, e.g. `@/components/ui/CtaButton`.

| Folder | What lives there |
| --- | --- |
| `layout/` | Site chrome on every page: header (`Nav`, `NavBar`, `ServiceRail`), footer (`Footer`, `FooterWordmark`), page openers and breadcrumbs, spotlight search, cookie banner. |
| `forms/` | Anything that collects input or books a call: contact form, inline and popup lead forms, appointment booking and the Cal.com embed, consent reset. |
| `portfolio/` | Case studies and proof of work: grids, showcase, story blocks, device frames, lightbox, client logos and wordmarks, discipline pages, proof links. |
| `article/` | Blog list and article pages: body renderer, contents list, side rail, share row, further reading. |
| `home/` | Sections used only on the homepage: hero, parallax, about split, capability ledger, rotating statement, results, compact process, home FAQ. |
| `sections/` | Full-width sections shared by several pages: contact band, engagement models, the process timeline, who I work with. |
| `seo/` | Structured data (`JsonLd`, `StructuredData`) and tracking (`Analytics`, `MetaPixel`, `TrackView`). |
| `ui/` | Small primitives used everywhere: buttons, eyebrow, surface, tag, section heading, reveal, FAQ list, social and WhatsApp links. |

Rules of thumb:

- A component used on one page type goes in that page type's folder.
- A component used by many page types goes in `sections/` (big) or `ui/` (small).
- A `"use client"` file must not import `@/data/pillars`, `@/data/serviceCategories`
  or `@/data/serviceDepth`. Pass the labels it needs as props from the server page.
