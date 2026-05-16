<script lang="ts">
  import { onMount } from "svelte";
  import {
    createLinksIndex,
    searchLinks,
    type ExplorerFilters,
  } from "../lib/links-search";
  import {
    linkCategories,
    isLinkCategory,
    categoryColorTokens,
    type LinkCategory,
  } from "../lib/linkCategories";
  import type { LinksExplorerRecord } from "../lib/links-explorer";

  interface Props {
    records: LinksExplorerRecord[];
    facets: { tags: string[]; weeks: [string, string][] };
  }

  let { records, facets }: Props = $props();

  // Heroicons outline SVG paths (24px viewBox)
  const categoryIconPaths: Record<LinkCategory, string> = {
    Frontend:
      "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5",
    Backend:
      "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125",
    Email:
      "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75",
    UX: "M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42",
    Other:
      "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 8.25h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z",
  };

  // Filter state
  let q = $state("");
  let selectedCategories = $state<LinkCategory[]>([]);
  let tag = $state("");
  let week = $state("");
  let filtersOpen = $state(false);
  let controlsDisabled = $state(false);

  // Results state
  let visibleIds = $state(new Set(records.map((r) => r.id)));
  let total = $state(records.length);
  let indexError = $state(false);

  let index: Awaited<ReturnType<typeof createLinksIndex>> | null = null;

  function getFilters(): ExplorerFilters {
    return { q: q.trim(), categories: selectedCategories, tag, week };
  }

  function toUrl(filters: ExplorerFilters): string {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    for (const cat of filters.categories) params.append("category", cat);
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
      visibleIds = new Set(result.records.map((r) => r.id));
      total = result.total;
      indexError = false;
      if (updateUrl) {
        history.replaceState(null, "", toUrl(getFilters()));
      }
    } catch (e) {
      console.error("Links Explorer: failed to apply filters", e);
      showRuntimeError();
    }
  }

  function showRuntimeError(): void {
    indexError = true;
    visibleIds = new Set(records.map((r) => r.id));
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

  function toggleCategory(cat: LinkCategory): void {
    selectedCategories = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    void applyFilters();
  }

  function handleTagChipClick(t: string): void {
    tag = tag === t ? "" : t;
    void applyFilters();
  }

  function handleCategoryChipClick(cat: string): void {
    if (!isLinkCategory(cat)) return;
    toggleCategory(cat);
  }

  function syncFromUrl(): void {
    const params = new URLSearchParams(window.location.search);
    q = params.get("q") ?? "";
    selectedCategories = params
      .getAll("category")
      .filter(isLinkCategory) as LinkCategory[];
    tag = params.get("tag") ?? "";
    week = params.get("week") ?? "";
  }

  onMount(async () => {
    syncFromUrl();

    try {
      index = await createLinksIndex(records);
      controlsDisabled = false;
      await applyFilters(false);
    } catch (e) {
      console.error("Links Explorer: failed to initialize search index", e);
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

<section class="controls not-content" aria-label="Links Explorer filters">
  <label class="control-search">
    <span>Search</span>
    <input
      id="q"
      name="q"
      type="search"
      placeholder="Search links"
      bind:value={q}
      disabled={controlsDisabled}
      oninput={() => void applyFilters()}
    />
  </label>

  <button
    id="toggle-filters"
    type="button"
    aria-pressed={filtersOpen ? "true" : "false"}
    aria-expanded={filtersOpen ? "true" : "false"}
    aria-controls="filters-panel"
    onclick={() => (filtersOpen = !filtersOpen)}
  >
    Filters
  </button>

  <div id="filters-panel" class="filters-panel" class:is-open={filtersOpen}>
    <div class="filters-panel__content">
      <label class="control-tag">
        <span>Tag</span>
        <select
          id="tag"
          name="tag"
          bind:value={tag}
          disabled={controlsDisabled}
          onchange={() => void applyFilters()}
        >
          <option value="">All tags</option>
          {#each facets.tags as t (t)}
            <option value={t}>{t}</option>
          {/each}
        </select>
      </label>

      <fieldset class="category-filter-group control-categories">
        <legend>Categories</legend>
        <div class="category-buttons">
          {#each linkCategories as category (category)}
            {@const color = categoryColorTokens[category]}
            {@const isPressed = selectedCategories.includes(category)}
            {@const isOther = category === "Other"}
            <button
              type="button"
              class="category-button"
              class:is-other={isOther}
              data-category-button={category}
              aria-pressed={isPressed ? "true" : "false"}
              style="--category-color: {color}"
              disabled={controlsDisabled}
              onclick={() => toggleCategory(category)}
            >
              <span class="category-icon" title={category}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d={categoryIconPaths[category]}
                  />
                </svg>
              </span>
              <span class="label">{category}</span>
            </button>
          {/each}
        </div>
      </fieldset>

      <label class="control-week">
        <span>Week</span>
        <select
          id="week"
          name="week"
          bind:value={week}
          disabled={controlsDisabled}
          onchange={() => void applyFilters()}
        >
          <option value="">All weeks</option>
          {#each facets.weeks as [weekKey, weekTitle] (weekKey)}
            <option value={weekKey}>{weekTitle}</option>
          {/each}
        </select>
      </label>
    </div>
  </div>
</section>

<div class="results-summary-container">
  <p class="results-summary">
    Showing {total} of {records.length} links.
  </p>

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
    {@const categoryColor = categoryColorTokens[record.category]}
    <li hidden={!isVisible} aria-hidden={isVisible ? "false" : "true"}>
      <article
        class="link-card not-content"
        data-has-description={record.description ? "true" : "false"}
      >
        <h3 class="link-title">
          <a
            href={record.url}
            target="_blank"
            rel="noopener noreferrer"
          >{record.title}</a>
        </h3>

        {#if record.description}
          <p class="description">{record.description}</p>
        {/if}

        <div class="chips-container">
          <button
            type="button"
            class="category-chip"
            title="Filter by category: {record.category}"
            style="--category-color: {categoryColor}"
            onclick={() => handleCategoryChipClick(record.category)}
          >
            <span class="category-icon" title={record.category}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d={categoryIconPaths[record.category]}
                />
              </svg>
            </span>
            <span>{record.category}</span>
          </button>

          {#each record.tags as t (t)}
            <button
              type="button"
              class="tag-chip"
              title="Filter by tag: {t}"
              onclick={() => handleTagChipClick(t)}
            >
              {t}
            </button>
          {/each}
        </div>
      </article>
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
  /* ── Controls ── */
  .controls {
    display: grid;
    column-gap: 0.75rem;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    align-items: end;
    grid-template-areas:
      "search toggle-filters"
      "panel panel";
  }

  #toggle-filters {
    max-height: 46px;
  }

  #toggle-filters[aria-pressed="true"] {
    background: var(--sl-color-gray-5);
  }

  .filters-panel {
    grid-area: panel;
    display: grid;
    grid-template-rows: 0fr;
    overflow: hidden;
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

  .filters-panel.is-open {
    grid-template-rows: 1fr;
  }

  .filters-panel__content {
    display: grid;
    gap: 0.75rem;
    padding-block: 0.5rem;
    overflow: hidden;
    grid-template-areas:
      "tag week"
      "categories categories";
  }

  .controls label {
    display: grid;
    gap: 0.35rem;
  }

  .controls span {
    font-size: 0.9rem;
    color: var(--sl-color-gray-3);
    font-weight: 600;
  }

  .controls input,
  .controls select,
  .controls > button {
    min-height: 2.4rem;
    border-radius: 0.55rem;
    border: 1px solid var(--sl-color-gray-5);
    background: var(--sl-color-bg);
    color: var(--sl-color-text);
    padding: 0.5rem 0.7rem;
  }

  .controls > button {
    cursor: pointer;
    font-weight: 600;
  }

  .filters-panel__content > button {
    min-height: 2.4rem;
    border-radius: 0.55rem;
    border: 1px solid var(--sl-color-gray-5);
    background: var(--sl-color-bg);
    color: var(--sl-color-text);
    padding: 0.5rem 0.7rem;
    cursor: pointer;
    font-weight: 600;
  }

  .control-search {
    grid-area: search;
  }

  .control-tag {
    grid-area: tag;
  }

  .control-categories {
    grid-area: categories;
  }

  .control-week {
    grid-area: week;
  }

  /* ── Category filter buttons ── */
  .category-filter-group {
    margin: 0;
    border: 0;
    padding: 0;
    display: grid;
    gap: 0.45rem;
  }

  .category-filter-group legend {
    padding: 0;
    font-size: 0.9rem;
    color: var(--sl-color-gray-3);
    font-weight: 600;
  }

  .category-buttons {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: 4.35rem;
    gap: 0.5rem;
  }

  @media (min-width: 30rem) {
    .category-buttons {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .category-button {
    width: 100%;
    height: 100%;
    min-height: 0;
    min-width: 0;
    border-radius: 0.55rem;
    border: 1px solid
      color-mix(in oklab, var(--category-color), var(--sl-color-gray-5) 70%);
    background: color-mix(in oklab, var(--sl-color-bg), var(--category-color) 4%);
    color: var(--sl-color-text);
    padding: 0.45rem 0.7rem;
    margin: 0;
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 0.3rem;
    cursor: pointer;
    transition:
      background-color 140ms ease,
      border-color 140ms ease;
  }

  .category-button:hover {
    background: color-mix(
      in oklab,
      var(--sl-color-bg),
      var(--category-color) 8%
    );
  }

  .category-button[aria-pressed="true"] {
    background: color-mix(
      in oklab,
      var(--category-color),
      var(--sl-color-bg) 75%
    );
    border-color: color-mix(
      in oklab,
      var(--category-color),
      var(--sl-color-gray-5) 48%
    );
  }

  .category-button.is-other {
    border-color: color-mix(
      in oklab,
      var(--sl-color-gray),
      var(--sl-color-gray-4) 35%
    );
  }

  .category-button .label {
    font-size: 0.77rem;
    line-height: 1;
    text-align: center;
    color: var(--sl-color-gray-2);
    font-weight: 600;
  }

  /* ── Category icon ── */
  .category-icon {
    display: inline-grid;
    place-items: center;
  }

  .category-icon svg {
    width: 1.2rem;
    height: 1.2rem;
  }

  /* ── Results summary + reset ── */
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

  /* ── Cards grid ── */
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

  /* ── Link card ── */
  .link-card {
    position: relative;
    isolation: isolate;
    overflow: clip;
    display: grid;
    grid-template-rows: 1fr auto;
    gap: 0.75rem;
    margin: 0;
    height: 100%;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.75rem;
    padding: 1rem;
    background: color-mix(
      in oklab,
      var(--sl-color-bg),
      var(--sl-color-gray-6) 35%
    );
    cursor: pointer;
    transition: background-color 140ms ease;
  }

  .link-card[data-has-description="true"] {
    grid-template-rows: 1fr auto auto;
  }

  .link-card:hover {
    background: color-mix(
      in oklab,
      var(--sl-color-bg),
      var(--sl-color-gray-5) 15%
    );
  }

  .link-card:focus-within {
    outline: 2px solid var(--sl-color-accent);
    outline-offset: 2px;
  }

  .link-title {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.35;
  }

  .link-title a {
    position: static;
    color: var(--sl-color-white);
    text-decoration: none;
  }

  .link-title a::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: inherit;
  }

  .link-title a:hover,
  .link-title a:focus-visible {
    text-decoration: underline;
  }

  .description {
    margin: 0 0 0.25rem 0;
    color: var(--sl-color-gray-2);
    font-size: 0.88rem;
    line-height: 1.35;
  }

  .chips-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  /* Keep chip buttons above the stretched card link */
  .link-card :where(button) {
    position: relative;
    z-index: 3;
  }

  @supports (grid-template-rows: subgrid) {
    .link-card {
      grid-template-rows: subgrid;
      grid-row: span 2;
      height: auto;
      gap: 0.5rem;
    }
  }

  /* ── Category chip (on cards) ── */
  .category-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin: 0;
    border: 1px solid
      color-mix(in oklab, var(--category-color), var(--sl-color-gray-5) 62%);
    border-radius: 999px;
    padding-inline: 0.55rem;
    height: 1.5rem;
    justify-items: center;
    background: color-mix(in oklab, var(--sl-color-bg), var(--category-color) 10%);
    color: color-mix(in oklab, var(--category-color), var(--sl-color-white) 40%);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 140ms ease;
    user-select: auto;
  }

  .category-chip:hover,
  .category-chip:focus-visible {
    background: color-mix(
      in oklab,
      var(--sl-color-bg),
      var(--category-color) 16%
    );
    color: color-mix(in oklab, var(--category-color), var(--sl-color-white) 55%);
  }

  .category-chip:focus-visible {
    outline: 2px solid var(--sl-color-accent);
    outline-offset: 2px;
  }

  .category-chip .category-icon svg {
    width: 1rem;
    height: 1rem;
  }

  /* ── Tag chip (on cards) ── */
  .tag-chip {
    display: inline-flex;
    align-items: center;
    margin: 0;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 999px;
    padding-inline: 0.55rem;
    height: 1.5rem;
    justify-items: center;
    background: color-mix(in oklab, var(--sl-color-bg), var(--sl-color-gray-6) 22%);
    color: var(--sl-color-gray-2);
    font-size: 0.875rem;
    line-height: 1.2;
    font-weight: 500;
    cursor: pointer;
    transition: all 140ms ease;
    user-select: auto;
  }

  .tag-chip:hover,
  .tag-chip:focus-visible {
    background: color-mix(
      in oklab,
      var(--sl-color-bg),
      var(--sl-color-gray-5) 35%
    );
    color: var(--sl-color-gray-1);
    border-color: var(--sl-color-gray-4);
  }

  .tag-chip:focus-visible {
    outline: 2px solid var(--sl-color-accent);
    outline-offset: 2px;
  }

  /* ── States ── */
  .empty-state {
    margin-top: 1rem;
    color: var(--sl-color-gray-2);
  }

  .error-state {
    margin-top: 1rem;
    color: var(--sl-color-orange-high, #c17a00);
    font-weight: 600;
  }

  /* ── Responsive ── */
  @media (min-width: 40rem) {
    .controls {
      grid-template-columns: 1fr auto;
      grid-template-areas:
        "search toggle-filters"
        "panel panel";
      align-items: end;
    }

    .filters-panel__content {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-template-areas:
        "tag week"
        "categories categories";
      align-items: end;
    }

    .category-buttons {
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }

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
