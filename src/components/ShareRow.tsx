"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { LinkedinIcon, WhatsAppIcon, XIcon } from "@/components/SocialLinks";

/**
 * Share links for an article.
 *
 * **Placed at the end of the body, not above it.** Sharing is something people
 * do once they have read the thing. A bar between the h1 and the first
 * paragraph asks for an endorsement of an article nobody has read yet, and on
 * this site it would also push the keyword-carrying opening further down the
 * page, on mobile, where there is already nothing above the fold worth tapping.
 *
 * **No share counts.** A count is social proof when it is high and the opposite
 * when it is low, and this site's articles will read "1" for a long time. The
 * number also has to come from somewhere, which means a third-party request on
 * every article load.
 *
 * **No AddThis, ShareThis or similar.** Those load third-party JavaScript, set
 * cookies this site's consent banner would then have to account for under the
 * UAE PDPL, and cost Lighthouse points on a site that currently scores 100.
 * Every link below is a plain URL. Nothing is fetched and nothing is tracked.
 *
 * **WhatsApp first.** Generic share widgets put it last or leave it out. This
 * site's own copy says WhatsApp is the default business channel across the UAE,
 * and a technical article passed between two people here goes through WhatsApp
 * far more often than through X.
 *
 * **The native sheet where it exists.** `navigator.share` opens the operating
 * system's own share sheet, which offers every app the person actually has
 * rather than the four somebody chose for them. It is only available over HTTPS
 * and mostly on mobile, so the explicit buttons stay as the fallback and the
 * button that triggers it only renders once the browser has confirmed support.
 */

type Props = {
  /** Absolute URL. Built on the server so it is right in the markup. */
  url: string;
  title: string;
};

export default function ShareRow({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  // Resolved after mount: `navigator.share` cannot be read while rendering on
  // the server, and rendering the button unconditionally would show a control
  // that does nothing on most desktops.
  const [canShare, setCanShare] = useState(false);

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const links = [
    {
      name: "WhatsApp",
      // `text=` carries both, because WhatsApp has no separate title field.
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      Icon: WhatsAppIcon,
    },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: LinkedinIcon },
    { name: "X", href: `https://x.com/intent/tweet?url=${u}&text=${t}`, Icon: XIcon },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access is refused in some embedded browsers. Silence is the
      // right behaviour: the three links beside it still work.
    }
  }

  return (
    <div
      // `ref` rather than an effect: this runs once, on the element the browser
      // has already created, and avoids a second render pass on every article.
      ref={() => setCanShare(typeof navigator !== "undefined" && !!navigator.share)}
      className="mt-14 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-border pt-7"
    >
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted/70">
        Share this
      </span>

      <div className="flex flex-wrap items-center gap-2">
        {links.map(({ name, href, Icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            // `noopener` closes the tabnabbing hole that `target="_blank"`
            // opens. `nofollow` because these are outbound share endpoints, not
            // endorsements.
            rel="noopener noreferrer nofollow"
            aria-label={`Share on ${name}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-gold/40 hover:text-ink"
          >
            <Icon />
          </a>
        ))}

        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Link copied" : "Copy link"}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-4 text-sm text-muted transition-colors hover:border-gold/40 hover:text-ink"
        >
          {copied ? <Check size={15} className="text-gold" /> : <Link2 size={15} />}
          {copied ? "Copied" : "Copy link"}
        </button>

        {canShare ? (
          <button
            type="button"
            onClick={() => navigator.share({ title, url }).catch(() => {})}
            aria-label="Share"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-4 text-sm text-muted transition-colors hover:border-gold/40 hover:text-ink"
          >
            <Share2 size={15} /> More
          </button>
        ) : null}
      </div>
    </div>
  );
}
