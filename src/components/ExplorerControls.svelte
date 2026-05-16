<script lang="ts">
  import CategoryIcon from "./CategoryIcon.svelte";
  import {
    categoryColorTokens,
    linkCategories,
    type LinkCategory,
  } from "../lib/linkCategories";

  interface Props {
    facets: { tags: string[]; weeks: [string, string][] };
    onchange: () => void;
    q?: string;
    selectedCategories?: LinkCategory[];
    tag?: string;
    week?: string;
  }

  let {
    facets,
    onchange,
    q = $bindable(""),
    selectedCategories = $bindable<LinkCategory[]>([]),
    tag = $bindable(""),
    week = $bindable(""),
  }: Props = $props();

  let filtersOpen = $state(false);

  function toggleCategory(category: LinkCategory): void {
    selectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((value) => value !== category)
      : [...selectedCategories, category];
    onchange();
  }
</script>

<section class="controls not-content" aria-label="Links Explorer filters">
  <label class="control-search">
    <span>Search</span>
    <input
      id="q"
      name="q"
      type="search"
      placeholder="Search links"
      value={q}
      oninput={(event) => {
        q = (event.currentTarget as HTMLInputElement).value;
        onchange();
      }}
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

  <div
    id="filters-panel"
    class="filters-panel"
    class:is-open={filtersOpen}
    aria-hidden={filtersOpen ? "false" : "true"}
    inert={!filtersOpen}
  >
    <div class="filters-panel__content">
      <label class="control-tag">
        <span>Tag</span>
        <select
          id="tag"
          name="tag"
          value={tag}
          onchange={(event) => {
            tag = (event.currentTarget as HTMLSelectElement).value;
            onchange();
          }}
        >
          <option value="">All tags</option>
          {#each facets.tags as value (value)}
            <option value={value}>{value}</option>
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
              aria-pressed={isPressed ? "true" : "false"}
              style="--category-color: {color}"
              onclick={() => toggleCategory(category)}
            >
              <CategoryIcon {category} size="1.2rem" />
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
          value={week}
          onchange={(event) => {
            week = (event.currentTarget as HTMLSelectElement).value;
            onchange();
          }}
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

<style>
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

  @media (min-width: 30rem) {
    .category-buttons {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

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
  }
</style>
