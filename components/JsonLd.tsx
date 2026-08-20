/**
 * Renders a JSON-LD block.
 *
 * Server component by design — the graph is static per page, so there is no
 * reason to ship it through the client bundle.
 *
 * JSON.stringify is safe for the values used here (all studio-controlled
 * strings, no user input). If a value ever originates from user content,
 * escape `<` to < before injecting it.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
