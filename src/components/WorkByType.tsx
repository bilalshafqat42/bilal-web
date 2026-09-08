import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal, { RevealStagger, RevealItem } from "./Reveal";
import { clients } from "@/data/caseStudies";

/**
 * Everything, browsed by deliverable type rather than by client.
 *
 * `/portfolio` already lists clients and narrative case studies. This is the
 * other axis a buyer actually uses: someone who needs a landing page wants to
 * see landing pages, not to read three engagements and work out which one
 * contained one.
 *
 * Every item is derived from `caseStudies.ts`. Nothing here is a parallel list,
 * which matters because the alt text and captions in that file are the accurate
 * ones — a second copy would drift the moment either was edited.
 *
 * Counts are computed, not written. A hard-coded "12 pieces of social creative"
 * becomes a lie the first time an item is added or removed.
 *
 * Groups render only when they hold something. There is no empty "Video" or
 * "Branding" heading, because a category with nothing under it advertises the
 * gap rather than the work.
 */
type Item = {
  key: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  label: string;
  meta: string;
  href: string;
};

/** Landscape page captures. Cropped to the top: these are tall scrolls, and a
 *  centre crop of a 1:5 capture shows a meaningless middle slice. */
function websiteItems(): Item[] {
  const out: Item[] = [];
  for (const c of clients) {
    if (c.website) {
      out.push({
        key: `${c.slug}-site`,
        src: c.website.capture.src,
        width: c.website.capture.width,
        height: c.website.capture.height,
        alt: c.website.capture.alt,
        label: `${c.name} — corporate website`,
        meta: "Corporate website",
        href: `/portfolio/${c.slug}`,
      });
    }
    for (const p of c.projects) {
      if (!p.landingPage) continue;
      out.push({
        key: `${p.slug}-desktop`,
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
  }
  return out;
}

/** Square creative, from the client-level brand gallery and any per-project
 *  campaign galleries. */
function socialItems(): Item[] {
  const out: Item[] = [];
  for (const c of clients) {
    const galleries: { g: NonNullable<typeof c.brandSocial>; label: string; href: string }[] = [];
    if (c.brandSocial) {
      galleries.push({ g: c.brandSocial, label: `${c.name} — brand`, href: `/portfolio/${c.slug}` });
    }
    for (const p of c.projects) {
      if (p.gallery) {
        galleries.push({ g: p.gallery, label: p.name, href: `/portfolio/${c.slug}/${p.slug}` });
      }
    }
    for (const { g, label, href } of galleries) {
      for (const item of g.items) {
        out.push({
          key: `${g.basePath}/${item.file}`,
          src: `${g.basePath}/${item.file}.avif`,
          width: g.width,
          height: g.height,
          alt: item.alt,
          label,
          meta: item.caption,
          href,
        });
      }
    }
  }
  return out;
}

function WebsiteGrid({ items }: { items: Item[] }) {
  return (
    <RevealStagger className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
      {items.map((it) => (
        <RevealItem key={it.key}>
          <Link
            href={it.href}
            className="card-hover group block overflow-hidden rounded-2xl border border-border bg-surface/40"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={it.src}
                alt={it.alt}
                fill
                sizes="(min-width: 640px) 45vw, 92vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex items-start justify-between gap-3 border-t border-border px-5 py-4">
              <span>
                <span className="block text-sm font-semibold text-ink">{it.label}</span>
                <span className="mt-0.5 block text-xs text-muted">{it.meta}</span>
              </span>
              <ArrowUpRight size={15} className="mt-0.5 shrink-0 text-muted transition-colors group-hover:text-gold" />
            </div>
          </Link>
        </RevealItem>
      ))}
    </RevealStagger>
  );
}

function SocialGrid({ items }: { items: Item[] }) {
  return (
    <RevealStagger className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {items.map((it) => (
        <RevealItem key={it.key}>
          <Link
            href={it.href}
            className="card-hover group block overflow-hidden rounded-2xl border border-border bg-surface/40"
          >
            <Image
              src={it.src}
              alt={it.alt}
              width={it.width}
              height={it.height}
              sizes="(min-width: 1024px) 300px, 45vw"
              className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted">{it.meta}</p>
          </Link>
        </RevealItem>
      ))}
    </RevealStagger>
  );
}

export default function WorkByType() {
  const websites = websiteItems();
  const social = socialItems();
  const apps = clients.filter((c) => c.mobileApp);

  return (
    <section id="all-work" className="relative scroll-mt-28 py-24 sm:py-32">
      <div className="site-container">
        <SectionHeading
          align="left"
          eyebrow="Browse Everything"
          title="All the work, by"
          highlight="what it is"
          description="The same projects grouped by deliverable rather than by client, for anyone who arrived looking for one specific thing."
        />

        {websites.length > 0 ? (
          <div className="mt-16">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-4">
              <h3 className="text-2xl font-semibold tracking-tight text-ink">Websites &amp; landing pages</h3>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                {websites.length} captures
              </span>
            </div>
            <WebsiteGrid items={websites} />
          </div>
        ) : null}

        {social.length > 0 ? (
          <div className="mt-20">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-4">
              <h3 className="text-2xl font-semibold tracking-tight text-ink">Social &amp; campaign creative</h3>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                {social.length} pieces
              </span>
            </div>
            <SocialGrid items={social} />
          </div>
        ) : null}

        {apps.length > 0 ? (
          <div className="mt-20">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-4">
              <h3 className="text-2xl font-semibold tracking-tight text-ink">Mobile apps</h3>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                {apps.length === 1 ? "1 app" : `${apps.length} apps`}
              </span>
            </div>
            {/* The composite, not the individual screens. Those already appear
                on the client page, and repeating them here would be the fourth
                showing of the same four images. */}
            <RevealStagger className="mt-8 grid grid-cols-1 gap-5">
              {apps.map((c) => (
                <RevealItem key={c.slug}>
                  <Link
                    href={`/portfolio/${c.slug}`}
                    className="card-hover group block overflow-hidden rounded-2xl border border-border bg-surface/40"
                  >
                    {c.mobileApp?.lead ? (
                      <Image
                        src={c.mobileApp.lead.src}
                        alt={c.mobileApp.lead.alt}
                        width={c.mobileApp.lead.width}
                        height={c.mobileApp.lead.height}
                        sizes="(min-width: 1024px) 1100px, 100vw"
                        className="h-auto w-full"
                      />
                    ) : null}
                    <div className="flex items-start justify-between gap-3 border-t border-border px-5 py-4">
                      <span>
                        <span className="block text-sm font-semibold text-ink">
                          {c.name} — {c.mobileApp?.screens.length} screens
                        </span>
                        <span className="mt-0.5 block text-xs text-muted">
                          React Native, iOS and Android from one codebase
                        </span>
                      </span>
                      <ArrowUpRight size={15} className="mt-0.5 shrink-0 text-muted transition-colors group-hover:text-gold" />
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        ) : null}

        {/* Said plainly rather than implied by absence. A visitor who counts
            three categories and wonders where branding and video went is
            better served by an answer than by silence. */}
        <Reveal>
          <p className="mt-16 max-w-2xl text-sm leading-relaxed text-muted">
            Branding, video and print work exists but is not published here yet — those assets are
            still being collected from past engagements.{" "}
            <Link href="/appointment" className="text-gold underline underline-offset-4 hover:opacity-80">
              Ask me for examples
            </Link>{" "}
            and I will send what is relevant to your project.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
