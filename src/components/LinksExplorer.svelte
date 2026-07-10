<script lang="ts">
  import type { RawData } from "@orama/orama";
  import { onMount } from "svelte";
  import { isLinkCategory, type LinkCategory } from "../lib/linkCategories";
  import {
    groupLinksExplorerRecords,
    isLinksGroupBy,
    type LinksExplorerRecord,
    type LinksGroupBy,
  } from "../lib/links-explorer";
  import {
    loadLinksIndex,
    searchLinks,
    type ExplorerFilters,
  } from "../lib/links-search";
  import ExplorerControls from "./ExplorerControls.svelte";
  import LinkCard from "./LinkCard.svelte";

  interface Props {
    records: LinksExplorerRecord[];
    facets: { tags: string[]; weeks: [string, string][] };
    indexSnapshot: RawData;
  }

  let { records, facets, indexSnapshot }: Props = $props();

  let q = $state("");
  let selectedCategories = $state<LinkCategory[]>([]);
  let tag = $state("");
  let week = $state("");
  let groupBy = $state<LinksGroupBy>("none");

  const recordsTotal = $derived(records.length);

  let visibleRecords = $state<LinksExplorerRecord[]>([]);
  let total = $state(0);
  let hasAppliedFilters = $state(false);
  let indexError = $state(false);
  let openSections = $state<string[]>([]);
  let previousGroupBy = $state<LinksGroupBy>("none");

  const effectiveRecords = $derived(hasAppliedFilters ? visibleRecords : records);
  const effectiveTotal = $derived(hasAppliedFilters ? total : recordsTotal);
  const groupedRecords = $derived(groupLinksExplorerRecords(effectiveRecords, groupBy));

  let index: ReturnType<typeof loadLinksIndex> | null = null;

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
    if (groupBy !== "none") params.set("group", groupBy);

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

    const filters = getFilters();

    try {
      const result = await searchLinks(index, records, filters);
      visibleRecords = result.records;
      total = result.total;
      hasAppliedFilters = true;
      indexError = false;

      if (updateUrl) {
        history.replaceState(null, "", toUrl(filters));
      }
    } catch (error) {
      console.error("Links Explorer: failed to apply filters", error);
      showRuntimeError();
    }
  }

  function showRuntimeError(): void {
    indexError = true;
    q = "";
    selectedCategories = [];
    tag = "";
    week = "";
    groupBy = "none";
    visibleRecords = records;
    total = recordsTotal;
    hasAppliedFilters = true;
  }

  function resetFilters(): void {
    q = "";
    selectedCategories = [];
    tag = "";
    week = "";
    groupBy = "none";
    openSections = [];
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

  function toggleSection(key: string): void {
    openSections = openSections.includes(key)
      ? openSections.filter((value) => value !== key)
      : [...openSections, key];
  }

  function toGroupPanelId(key: string): string {
    return `group-panel-${encodeURIComponent(key)}`
  }

  function syncFromUrl(): void {
    const params = new URLSearchParams(window.location.search);
    const nextGroup = params.get("group") ?? "";

    q = params.get("q") ?? "";
    selectedCategories = params
      .getAll("category")
      .filter((category): category is LinkCategory => isLinkCategory(category));
    tag = params.get("tag") ?? "";
    week = params.get("week") ?? "";
    groupBy = isLinksGroupBy(nextGroup) ? nextGroup : "none";
    openSections = [];
  }

  $effect(() => {
    if (groupBy !== previousGroupBy) {
      openSections = [];
      previousGroupBy = groupBy;
    }
  });

  onMount(() => {
    syncFromUrl();

    const handlePopstate = () => {
      syncFromUrl();
      void applyFilters(false);
    };

    window.addEventListener("popstate", handlePopstate);

    void (async () => {
      try {
        index = loadLinksIndex(indexSnapshot);
        await applyFilters(false);
      } catch (error) {
        console.error("Links Explorer: failed to initialize search index", error);
        showRuntimeError();
      }
    })();

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  });
</script>

<ExplorerControls
  {facets}
  disabled={indexError}
  bind:q
  bind:selectedCategories
  bind:tag
  bind:week
  bind:groupBy
  onchange={() => void applyFilters()}
/>

<div class="results-summary-container">
  <p class="results-summary">
    Showing {effectiveTotal} of {recordsTotal} links.
  </p>

  <button
    id="reset-filters"
    type="button"
    class="control-reset"
    disabled={indexError}
    onclick={resetFilters}
  >
    Reset filters
  </button>
</div>

{#if groupBy === "none"}
  <ul class="cards-grid">
    {#each effectiveRecords as record (record.id)}
      <li>
        <LinkCard
          {record}
          oncategoryclick={handleCategoryChipClick}
          ontagclick={handleTagChipClick}
        />
      </li>
    {/each}
  </ul>
{:else}
  <div class="grouped-results">
    {#each groupedRecords as group (group.key)}
      {@const isOpen = openSections.includes(group.key)}
      <section class="group-accordion">
        <button
          type="button"
          class="group-accordion__toggle"
          aria-expanded={isOpen ? "true" : "false"}
          aria-controls={toGroupPanelId(group.key)}
          onclick={() => toggleSection(group.key)}
        >
          <span>{group.title} ({group.count})</span>
        </button>

        <div
          id={toGroupPanelId(group.key)}
          class="group-accordion__panel"
          class:is-open={isOpen}
        >
          <div class="group-accordion__content">
            <ul class="cards-grid cards-grid--grouped">
              {#each group.records as record (`${group.key}:${record.id}`)}
                <li>
                  <LinkCard
                    {record}
                    oncategoryclick={handleCategoryChipClick}
                    ontagclick={handleTagChipClick}
                  />
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </section>
    {/each}
  </div>
{/if}

{#if hasAppliedFilters && total === 0 && !indexError}
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

  .cards-grid--grouped {
    margin: 0;
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

  .grouped-results {
    display: grid;
    gap: 0.25rem;
  }

  .group-accordion {
    border: 0;
    background: transparent;
  }

  .group-accordion__toggle {
    width: 100%;
    border: 0;
    background: transparent;
    color: var(--sl-color-white);
    padding: 1rem 0 0.8rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
    border-bottom: 1px solid var(--sl-color-gray-5);
  }

  .group-accordion__toggle::after {
    content: "+";
    color: var(--sl-color-gray-2);
    font-size: 1.15rem;
    line-height: 1;
  }

  .group-accordion__toggle[aria-expanded="true"]::after {
    content: "\2212";
  }

  .group-accordion__panel {
    display: grid;
    grid-template-rows: 0fr;
    overflow: hidden;
    min-height: 0;
    transition: grid-template-rows 0.4s;
    will-change: grid-template-rows;
    transition-timing-function: linear(
      0,
      0.013 1%,
      0.051 2.2%,
      0.404 9.8%,
      0.51 12.6%,
      0.602 15.5%,
      0.683 18.7%,
      0.754 22.2%,
      0.813 26%,
      0.861 30.2%,
      0.9 34.8%,
      0.931 40%,
      0.972 52.7%,
      0.992 70.2%,
      1
    );
  }

  .group-accordion__panel.is-open {
    grid-template-rows: 1fr;
  }

  .group-accordion__content {
    overflow: hidden;
    min-height: 0;
    padding: 0;
  }

  .group-accordion__panel.is-open .group-accordion__content {
    padding: 0.9rem 0 1rem;
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
