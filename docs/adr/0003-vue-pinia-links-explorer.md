# Use Vue and Pinia for the Links Explorer island

The **Links Explorer** will use a Vue 3 island with a Pinia store installed globally through Astro's Vue app entrypoint. Feature components and composables resolve the store from the active Pinia instance. Pinia owns the explorer's filters, search results, grouping, and ephemeral accordion state. The page URL remains the canonical source for shareable view state: search query, categories, tag, week, and grouping mode. Browser Back and Forward navigation rehydrates Pinia from that URL.

Search input updates replace the current history entry so typing does not flood browser history. Discrete category, tag, week, grouping, and reset changes create history entries. Accordion state is not serialized and resets to collapsed when the grouping mode changes.

## Considered Options

- **Keep Svelte (rejected):** Maintaining two component frameworks is unnecessary because the Links Explorer is the repository's only Svelte surface.
- **Keep all state only in Pinia (rejected):** Refreshing or sharing a filtered Links Explorer would lose the selected view.
- **Add Vue Router (rejected):** The island does not own routes; the browser History API is sufficient for one Astro page.

## Consequences

The Astro project depends on Vue, Pinia, and the Astro Vue integration, while Svelte and its Astro integration are removed. Pure presentation components continue to emit typed user intents, and their container updates the global store directly. A dedicated composable observes semantic Pinia actions and applies URL, History API, and search side effects. Focused Vitest and Vue Test Utils tests cover the store, URL synchronization, and component contracts.
