<script lang="ts">
  import { onMount } from "svelte";
  import {
    createLinksIndex,
    searchLinks,
    type ExplorerFilters,
  } from "../lib/links-search";
  import { isLinkCategory, type LinkCategory } from "../lib/linkCategories";
  import type { LinksExplorerRecord } from "../lib/links-explorer";
  import ExplorerControls from "./ExplorerControls.svelte";
  import LinkCard from "./LinkCard.svelte";

  interface Props {
    records: LinksExplorerRecord[];
    facets: { tags: string[]; weeks: [string, string][] };
  }

  let { records, facets }: Props = $props();

  let q = $state("");
  let selectedCategories = $state<LinkCategory[]>([]);
  let tag = $state("");
  let week = $state("");
  let controlsDisabled = $state(false);

  let visibleIds = $state(new Set(records.map((record) => record.id)));
  let total = $state(records.length);
  let indexError = $state(false);

  let index: Awaited<ReturnType<typeof createLinksIndex>> | null = null;

  function getFilters(): ExplorerFilters {
    return { q: q.trim(), categories: selectedCategories, tag, week };
  }

  function toUrl(filters: ExplorerFilters): string {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    for (const category of filters.categories) {
      params.append("category", category);
    }
    if (filters.tag) params.set("tag", filters.tag);
    if (filters.week) params.set("week", filters.week);
    const query = params.toString();
    return query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;
  }

  async function applyFilters(updateUrl = true): Promise<void> {
    if (!index) {
      showRuntimeError();
      return;
    }

    try {
      const result = await searchLinks(index, records, getFilters());
      visibleIds = new Set(result.records.map((record) => record.id));
      total = result.total;
      indexError = false;

      if (updateUrl) {
        history.replaceState(null, "", toUrl(getFilters()));
      }
    } catch (error) {
      console.error("Links Explorer: failed to apply filters", error);
      showRuntimeError();
    }
  }

  function showRuntimeError(): void {
    indexError = true;
    visibleIds = new Set(records.map((record) => record.id));
    total = records.length;
    controlsDisabled = true;
  }

  function resetFilters(): void {
    q = "";
    selectedCategories = [];
    tag = "";
    week = "";
    void applyFilters();
  }

  function toggleCategory(category: LinkCategory): void {
    selectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((value) => value !== category)
      : [...selectedCategories, category];
  }

  function handleTagChipClick(nextTag: string): void {
    tag = tag === nextTag ? "" : nextTag;
    void applyFilters();
  }

  function handleCategoryChipClick(category: LinkCategory): void {
    toggleCategory(category);
    void applyFilters();
  }

  function syncFromUrl(): void {
    const params = new URLSearchParams(window.location.search);

    q = params.get("q") ?? "";
    selectedCategories = params
      .getAll("category")
      .filter((category): category is LinkCategory => isLinkCategory(category));
    tag = params.get("tag") ?? "";
    week = params.get("week") ?? "";
  }

  onMount(async () => {
    syncFromUrl();

    try {
      index = await createLinksIndex(records);
      controlsDisabled = false;
      await applyFilters(false);
    } catch (error) {
      console.error("Links Explorer: failed to initialize search index", error);
      showRuntimeError();
    }

    const handlePopstate = () => {
      syncFromUrl();
      void applyFilters(false);
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  });
</script>

<ExplorerControls
  {facets}
  {controlsDisabled}
  bind:q
  bind:selectedCategories
  bind:tag
  bind:week
  onchange={() => void applyFilters()}
/>

<div class="results-summary-container">
  <p class="results-summary">Showing {total} of {records.length} links.</p>

  <button
    id="reset-filters"
    type="button"
    class="control-reset"
    onclick={resetFilters}
  >
    Reset filters
  </button>
</div>

<ul class="cards-grid">
  {#each records as record (record.id)}
    {@const isVisible = visibleIds.has(record.id)}
    <li hidden={!isVisible} aria-hidden={isVisible ? "false" : "true"}>
      <LinkCard
        {record}
        oncategoryclick={handleCategoryChipClick}
        ontagclick={handleTagChipClick}
      />
    </li>
  {/each}
</ul>

{#if total === 0 && !indexError}
  <p class="empty-state">
    No links match your current filters. Try broadening your search or reset all
    filters.
  </p>
{/if}

{#if indexError}
  <p class="error-state" role="status" aria-live="polite">
    Search is temporarily unavailable. Showing all links. Please refresh the
    page.
  </p>
{/if}

<style>
  .results-summary-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem 0;
  }

  .results-summary {
    color: var(--sl-color-gray-2);
    font-size: 0.95rem;
  }

  #reset-filters {
    border-radius: 0.55rem;
    border: 1px solid var(--sl-color-red-low);
    background: var(--sl-color-bg);
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    font-weight: 600;
    color: var(--sl-color-red);
    margin: 0;
  }

  #reset-filters:hover {
    background: var(--sl-color-red-low);
    border-color: var(--sl-color-red);
    color: var(--sl-color-red-high);
  }

  .cards-grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.85rem;
    grid-template-columns: 1fr;
  }

  @starting-style {
    .cards-grid li {
      opacity: 0.25;
    }
  }

  .cards-grid li {
    margin: 0;
    display: grid;
    align-items: stretch;
    transition:
      opacity 150ms,
      display 150ms,
      overlay 150ms;
    transition-behavior: allow-discrete;
  }

  .cards-grid li[hidden] {
    opacity: 0.25;
    display: none !important;
  }

  @supports (grid-template-rows: subgrid) {
    .cards-grid {
      grid-auto-rows: auto auto;
    }

    .cards-grid li {
      grid-template-rows: subgrid;
      grid-row: span 2;
      align-items: normal;
    }
  }

  .empty-state {
    margin-top: 1rem;
    color: var(--sl-color-gray-2);
  }

  .error-state {
    margin-top: 1rem;
    color: var(--sl-color-orange-high, #c17a00);
    font-weight: 600;
  }

  @media (min-width: 40rem) {
    .cards-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 64rem) {
    .cards-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
