import { clients } from "@/data/caseStudies";

/**
 * Single derivation of every portfolio artefact from `caseStudies.ts`.
 *
 * Extracted from `WorkByType` when the discipline pages were added, because two
 * places now need the same lists. A second copy would drift the moment either
 * was edited, and the alt text and captions in the case study data are the
 * accurate ones.
 *
 * `kind` is the axis the discipline pages filter on. It describes what the
 * artefact IS, not which service produced it — one capture legitimately answers
 * both "web design" and "web development", and pretending otherwise is how a
 * portfolio ends up with five pages showing the same picture.
 */
export type ItemKind =
  | "site-desktop"
  | "site-mobile"
  | "app-screen"
  | "social";

export type Item = {
  key: string;
  kind: ItemKind;
  src: string;
  width: number;
  height: number;
  alt: string;
  /** What the piece is part of — a development, a client, an app. */
  label: string;
  /** What the piece is. */
  meta: string;
  href: string;
};

export function allItems(): Item[] {
  const out: Item[] = [];

  for (const c of clients) {
    if (c.website) {
      out.push({
        key: `${c.slug}-site`,
        kind: "site-desktop",
        src: c.website.capture.src,
        width: c.website.capture.width,
        height: c.website.capture.height,
        alt: c.website.capture.alt,
        label: `${c.name} — corporate website`,
        meta: "Corporate website",
        href: `/portfolio/${c.slug}`,
      });
    }

    if (c.mobileApp) {
      for (const s of c.mobileApp.screens) {
        out.push({
          key: `${c.slug}-app-${s.key}`,
          kind: "app-screen",
          src: s.capture.src,
          width: s.capture.width,
          height: s.capture.height,
          alt: s.capture.alt,
          // The screen name belongs in `meta`, not in `label`. All five screens
          // share one href, so the mega menu collapses them to a single
          // sub-link and takes its text from `label` — with the screen name in
          // there, that link read "LEOS Developments app — Sign in" and looked
          // like it went to one screen rather than to the app.
          label: `${c.name} app`,
          meta: `${s.label} — ${s.tag}`,
          href: `/portfolio/${c.slug}/mobile-app#screens`,
        });
      }
    }

    if (c.brandSocial) {
      for (const item of c.brandSocial.items) {
        out.push({
          key: `${c.brandSocial.basePath}/${item.file}`,
          kind: "social",
          src: `${c.brandSocial.basePath}/${item.file}.avif`,
          width: c.brandSocial.width,
          height: c.brandSocial.height,
          alt: item.alt,
          label: `${c.name} — brand`,
          meta: item.caption,
          href: `/portfolio/${c.slug}`,
        });
      }
    }

    for (const p of c.projects) {
      if (p.landingPage) {
        out.push({
          key: `${p.slug}-desktop`,
          kind: "site-desktop",
          src: p.landingPage.capture.src,
          width: p.landingPage.capture.width,
          height: p.landingPage.capture.height,
          alt: p.landingPage.capture.alt,
          label: p.name,
          meta: "Launch landing page",
          href: `/portfolio/${c.slug}/${p.slug}`,
        });
        if (p.landingPage.mobileCapture) {
          out.push({
            key: `${p.slug}-mobile`,
            kind: "site-mobile",
            src: p.landingPage.mobileCapture.src,
            width: p.landingPage.mobileCapture.width,
            height: p.landingPage.mobileCapture.height,
            alt: p.landingPage.mobileCapture.alt,
            label: p.name,
            meta: "Mobile landing page",
            href: `/portfolio/${c.slug}/${p.slug}`,
          });
        }
      }
      if (p.gallery) {
        for (const item of p.gallery.items) {
          out.push({
            key: `${p.gallery.basePath}/${item.file}`,
            kind: "social",
            src: `${p.gallery.basePath}/${item.file}.avif`,
            width: p.gallery.width,
            height: p.gallery.height,
            alt: item.alt,
            label: p.name,
            meta: item.caption,
            href: `/portfolio/${c.slug}/${p.slug}`,
          });
        }
      }
    }
  }

  return out;
}

export function itemsOfKind(...kinds: ItemKind[]): Item[] {
  return allItems().filter((i) => kinds.includes(i.kind));
}
