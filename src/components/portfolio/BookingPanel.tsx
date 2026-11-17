import Reveal from "@/components/ui/Reveal";
import CtaButton from "@/components/ui/CtaButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { bookingHref, consultLabel } from "@/data/consult";

/**
 * A booking panel inside a case study, worded for one service.
 *
 * Added 2026-11-16 on the Texdale page, straight after the slides, and made a
 * component on 2026-11-17 when the same panel was needed on the Texdale
 * sub-pages. The button says which consultation it books ("Book a free website
 * consultation") and opens /appointment with that service pre-selected; the
 * second button goes to the service page itself. Type and buttons are the
 * site's own (`t-h3`, `CtaButton`, `SecondaryButton`), so it reads as part of
 * the page rather than as a banner.
 */
export default function BookingPanel({
  heading,
  body,
  service,
}: {
  heading: string;
  body: string;
  /** A service slug, as in src/data/consult.ts. */
  service: string;
}) {
  return (
    <section className="relative section-tight">
      <div className="site-container">
        <Reveal>
          <div className="flex flex-col gap-6 r-panel surface-2 px-7 py-9 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <h2 className="t-h3 text-ink">{heading}</h2>
              <p className="mt-3 text-base leading-relaxed text-muted">{body}</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-4">
              <CtaButton href={bookingHref(service)}>{consultLabel(service)}</CtaButton>
              <SecondaryButton href={`/services/${service}`}>About this service</SecondaryButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
