/**
 * Server-rendered JSON-LD. Emitted in the initial HTML (not via JS) so
 * crawlers and answer engines read it on first fetch. The inline
 * <script type="application/ld+json"> relies on the intentional
 * 'unsafe-inline' in script-src (documented in next.config.js / CLAUDE.md);
 * it carries no executable code.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
