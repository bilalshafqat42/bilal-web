import { graph, jsonLdSafe } from "@/lib/schema";

/**
 * Renders one `<script type="application/ld+json">` containing a single
 * `@graph`.
 *
 * A server component, so the markup is in the initial HTML — which matters,
 * because a crawler that does not execute JavaScript has to see it.
 *
 * `dangerouslySetInnerHTML` is required here: React escapes `<` and `&` inside
 * a text child, which corrupts JSON-LD. `jsonLdSafe` does the escaping that
 * still has to happen, and lives in `@/lib/schema` because twelve page
 * templates render their own `<script>` tag and need the same treatment.
 */
export default function JsonLd({ nodes }: { nodes: object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdSafe(graph(nodes)) }}
    />
  );
}
