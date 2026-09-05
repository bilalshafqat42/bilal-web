import { graph } from "@/lib/schema";

/**
 * Renders one `<script type="application/ld+json">` containing a single
 * `@graph`.
 *
 * A server component, so the markup is in the initial HTML — which matters,
 * because a crawler that does not execute JavaScript has to see it.
 *
 * `dangerouslySetInnerHTML` is required here: React escapes `<` and `&` inside
 * a text child, which corrupts JSON-LD. The content is built from typed objects
 * in `@/lib/schema`, never from user input, so there is nothing to inject.
 */
export default function JsonLd({ nodes }: { nodes: object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph(nodes)) }}
    />
  );
}
