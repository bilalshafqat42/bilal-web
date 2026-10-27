# Private assets

Files that belong to unpublished work and must not be served.

Everything in `public/` is reachable by direct URL, whether or not a page links
to it, and on Hostinger it is served straight from LiteSpeed, so no Next.js
redirect, rewrite or proxy rule can hide it. Audit of 2026-10-27 found the
files below public by direct link while their case studies were drafts and
their logos were not cleared (roadmap 416).

The paths mirror `public/`. To publish one, `git mv` it back to the same path
under `public/`, run `npm run image-variants`, and commit what it writes.

- `portfolio/4direction/`: 4Direction Developments draft case study
- `portfolio/aks-chemicals/`: AKS Chemicals draft case study
- `portfolio/refine/logo/`, `portfolio/tomorrow/logo/`: client logo row
  entries with `cleared: false` (src/components/portfolio/ClientLogoRow.tsx)

Draft case-study previews in `npm run dev` show these images as missing
until they are moved back.
