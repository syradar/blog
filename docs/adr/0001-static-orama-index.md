# Pre-build the Orama search index at SSR time

The Links Explorer search index is built once at SSR/build time using Orama's `save` API and passed to the client as an inline prop (`indexSnapshot`). The browser calls `load` to restore the index synchronously — no tokenisation or document insertion happens in the browser.

## Considered Options

- **Runtime creation (rejected):** `createLinksIndex(records)` ran in the browser on every page load, inserting and tokenising all records. This was slow and unnecessary since the data is static.
- **Separate JSON asset (rejected):** The snapshot could be served as a separate fetched file for independent caching, but the Links page data changes whenever a new link week is published, making separate caching moot. Inline is simpler and avoids an extra network round-trip.

## Consequences

`buildLinksIndexSnapshot` must be called in `index.astro` frontmatter (SSR/build time only). `loadLinksIndex` is the only index initialisation path in the browser — there is no runtime fallback to `createLinksIndex`.
