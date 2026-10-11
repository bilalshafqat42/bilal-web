import Image from "next/image";
import type { StoryBlock, StoryImage } from "@/data/caseStudies";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";

/**
 * The case study body, rendered from an ordered list of blocks.
 *
 * One component so that every case study on the site reads the same way. Before
 * this, a project page was a wall of prose followed by a grid of thumbnails,
 * and the two never referred to each other: the paragraph explaining the floor
 * selector sat four screens above the picture of it.
 *
 * **This renders outside `site-container` on purpose.** A `full` block has to
 * reach the viewport edge, which it cannot do from inside a padded column, so
 * each block brings its own container instead of inheriting one.
 *
 * Three rules hold the design together across case studies:
 *
 *   - **Text sits in a reading measure, images do not.** Body copy is capped at
 *     68 characters; a full-bleed image is capped only by the viewport. Those
 *     are different jobs and a single max-width serves neither.
 *   - **Every image is capped at 88vh.** "Full bleed" on a 1920px screen means a
 *     1.19:1 board renders 1,600px tall, taller than the screen showing it, so
 *     the reader scrolls a wall. `object-contain` under a height cap fills the
 *     width when an image is wide enough and letterboxes when it is not, which
 *     is correct for both without cropping anyone's artwork.
 *   - **Captions are content.** They are the only extractable text attached to
 *     an image, so they carry what the picture is doing rather than naming it.
 */

function Caption({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <figcaption className="site-container mt-3.5 text-sm text-muted">
      {text}
    </figcaption>
  );
}

/** Edge to edge, height-capped. See the `88vh` note above. */
function FullImage({ image }: { image: StoryImage }) {
  return (
    <figure className="section-tight">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="100vw"
        className="max-h-[88vh] w-full object-contain"
      />
      <Caption text={image.caption} />
    </figure>
  );
}

/** Two images across, stacking on phones. Stacking rather than shrinking:
 *  two 1,600px boards halved on a 390px screen makes any type inside them
 *  unreadable, which defeats the point of showing the screen at all. */
function PairImages({ images }: { images: [StoryImage, StoryImage] }) {
  return (
    <div className="section-tight site-container grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
      {images.map((image) => (
        <figure key={image.src} className="overflow-hidden r-card surface-2">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 640px) 48vw, 92vw"
            className="w-full"
          />
          {image.caption ? (
            <figcaption className="border-t border-border px-4 py-3 text-xs text-muted">
              {image.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

function TextBlock({
  eyebrow,
  heading,
  paragraphs,
}: {
  eyebrow?: string;
  heading: string;
  paragraphs: string[];
}) {
  // Label column left, prose column right, matching the depth block the four
  // LEOS launches still use. A single 68ch measure left the right half of the
  // screen empty between two edge-to-edge images, which read as a mistake
  // rather than as white space. The prose keeps its own measure inside the
  // second column instead of stretching to the container edge.
  return (
    <div className="section-tight site-container">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-16">
        <div>
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          {/* `h2`, not `h3`. These are the page's top-level sections once the
              story replaces the old depth block, and a case study whose only
              headings are h3s cannot be navigated by heading. */}
          <h2 className={`t-h3 text-ink ${eyebrow ? "mt-3" : ""}`}>{heading}</h2>
        </div>
        <div className="space-y-5">
          {paragraphs.map((text) => (
            <p key={text.slice(0, 40)} className="max-w-[68ch] text-base leading-relaxed text-muted">
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CaseStudyStory({ story }: { story: StoryBlock[] }) {
  return (
    <section className="relative section">
      {story.map((block, i) => (
        // `Reveal` per block rather than per image: a `pair` animating as two
        // objects reads as two unrelated things arriving, which is the opposite
        // of what putting them side by side is for.
        <Reveal key={i} delay={0}>
          {block.type === "full" ? (
            <FullImage image={block.image} />
          ) : block.type === "pair" ? (
            <PairImages images={block.images} />
          ) : (
            <TextBlock
              eyebrow={block.eyebrow}
              heading={block.heading}
              paragraphs={block.paragraphs}
            />
          )}
        </Reveal>
      ))}
    </section>
  );
}
