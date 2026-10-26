import { publishedClients } from "@/data/caseStudies";

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

/**
 * The generic name for what a piece IS, independent of who it was for.
 *
 * Added when the mega menu's sub-links were client names. With one client in
 * the data, "LEOS Developments" and "Cavendish Square" appeared under every
 * discipline and the menu read as a real-estate-only portfolio — which is the
 * opposite of what a menu is for. These are the labels a buyer scans for, and
 * they stay the same however many clients or sectors are behind them.
 */
export type Deliverable =
  | "Corporate websites"
  | "Landing pages"
  | "Mobile layouts"
  | "App screens"
  | "Brand creative"
  | "Campaign creative";

export type Item = {
  key: string;
  kind: ItemKind;
  deliverable: Deliverable;
  /** Who and what the piece belongs to. Carried so a case study page can ask
   *  "which disciplines went into this engagement" and get an answer derived
   *  from its own captures rather than from a hand-kept list. */
  clientSlug: string;
  projectSlug?: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  /** What the piece is part of — a development, a client, an app. */
  label: string;
  /** What the piece is. */
  meta: string;
  href: string;
  /** Service pages this piece is proof for beyond its discipline, carried
   *  from `Gallery.alsoProves`. Only read by the service page proof block. */
  alsoProves?: string[];
  /** The set the piece belongs to, by its heading on the case study ("Meta
   *  campaign creatives"). Names the pictures on a service page's proof card. */
  group?: string;
};

export function allItems(): Item[] {
  const out: Item[] = [];

  for (const c of publishedClients()) {
    if (c.website) {
      out.push({
        key: `${c.slug}-site`,
        kind: "site-desktop",
        deliverable: "Corporate websites",
        clientSlug: c.slug,
        src: c.website.capture.src,
        width: c.website.capture.width,
        height: c.website.capture.height,
        alt: c.website.capture.alt,
        label: `${c.name}: corporate website`,
        meta: "Corporate website",
        href: `/portfolio/${c.slug}`,
      });
      if (c.website.mobileCapture) {
        out.push({
          key: `${c.slug}-site-mobile`,
          kind: "site-mobile",
          deliverable: "Mobile layouts",
          clientSlug: c.slug,
          src: c.website.mobileCapture.src,
          width: c.website.mobileCapture.width,
          height: c.website.mobileCapture.height,
          alt: c.website.mobileCapture.alt,
          label: `${c.name}: website on mobile`,
          meta: "Mobile website",
          href: `/portfolio/${c.slug}`,
        });
      }
    }

    if (c.mobileApp) {
      for (const s of c.mobileApp.screens) {
        out.push({
          key: `${c.slug}-app-${s.key}`,
          kind: "app-screen",
          deliverable: "App screens",
          clientSlug: c.slug,
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
          meta: `${s.label}: ${s.tag}`,
          href: `/portfolio/${c.slug}/mobile-app#screens`,
        });
      }
    }

    // An app shown as a design and prototype (Texdale Field). App screens like
    // the LEOS ones, but the label says what they are, so nobody on a
    // discipline page takes a prototype for a released app.
    if (c.appDesign) {
      const g = c.appDesign;
      for (const item of g.items) {
        out.push({
          key: `${g.basePath}/${item.file}`,
          kind: "app-screen",
          deliverable: "App screens",
          clientSlug: c.slug,
          src: `${g.basePath}/${item.file}.${g.ext ?? "avif"}`,
          width: g.width,
          height: g.height,
          alt: item.alt,
          label: `${g.name} app: design and prototype`,
          meta: item.caption,
          href: `/portfolio/${c.slug}#mobile-app`,
        });
      }
    }

    // Both social galleries feed the discipline pages. Splitting the one grid
    // into branding and designs must not drop four pieces off /portfolio/
    // social-media-marketing, which iterating only `brandSocial` would do.
    for (const social of [c.brandSocial, c.socialDesigns]) {
      if (!social) continue;
      for (const item of social.items) {
        out.push({
          key: `${social.basePath}/${item.file}`,
          kind: "social",
          deliverable: "Brand creative",
          clientSlug: c.slug,
          src: `${social.basePath}/${item.file}.avif`,
          width: social.width,
          height: social.height,
          alt: item.alt,
          label: `${c.name}: brand`,
          meta: item.caption,
          href: `/portfolio/${c.slug}`,
          alsoProves: social.alsoProves,
          group: social.heading,
        });
      }
    }

    for (const p of c.projects) {
      if (p.landingPage) {
        out.push({
          key: `${p.slug}-desktop`,
          kind: "site-desktop",
          deliverable: "Landing pages",
          clientSlug: c.slug,
          projectSlug: p.slug,
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
            deliverable: "Mobile layouts",
            clientSlug: c.slug,
            projectSlug: p.slug,
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
            deliverable: "Campaign creative",
            clientSlug: c.slug,
            projectSlug: p.slug,
            src: `${p.gallery.basePath}/${item.file}.${p.gallery.ext ?? "avif"}`,
            width: p.gallery.width,
            height: p.gallery.height,
            alt: item.alt,
            label: p.name,
            meta: item.caption,
            href: `/portfolio/${c.slug}/${p.slug}`,
          });
        }
      }
      // Story images feed the discipline pages the same way gallery items do,
      // but as `app-screen` rather than `social`. The gallery branch hardcodes
      // "Campaign creative", which was already a stretch for a carousel slide
      // and is simply wrong for a screen out of an application.
      if (p.story) {
        for (const block of p.story) {
          const images =
            block.type === "full" ? [block.image] : block.type === "pair" ? block.images : [];
          for (const image of images) {
            out.push({
              key: image.src,
              kind: "app-screen",
              deliverable: "App screens",
              clientSlug: c.slug,
              projectSlug: p.slug,
              src: image.src,
              width: image.width,
              height: image.height,
              alt: image.alt,
              label: p.name,
              meta: image.caption ?? p.name,
              href: `/portfolio/${c.slug}/${p.slug}`,
            });
          }
        }
      }
    }
  }

  return out;
}

export function itemsOfKind(...kinds: ItemKind[]): Item[] {
  return allItems().filter((i) => kinds.includes(i.kind));
}

/** Anchor id for a deliverable section, shared by the menu's sub-links and the
 *  headings they point at. One function so they cannot disagree. */
export function deliverableAnchor(d: Deliverable): string {
  return d.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/** Deliverable groups within a set of items, in the order the deliverable type
 *  is declared, so section order is stable rather than data-order dependent. */
const ORDER: Deliverable[] = [
  "Corporate websites",
  "Landing pages",
  "Mobile layouts",
  "App screens",
  "Brand creative",
  "Campaign creative",
];

export function groupByDeliverable(items: Item[]): { deliverable: Deliverable; items: Item[] }[] {
  return ORDER.map((d) => ({ deliverable: d, items: items.filter((i) => i.deliverable === d) })).filter(
    (g) => g.items.length > 0
  );
}
