<script lang="ts">
  import CategoryIcon from "./CategoryIcon.svelte";
  import { categoryColorTokens, type LinkCategory } from "../lib/linkCategories";
  import type { LinksExplorerRecord } from "../lib/links-explorer";

  interface Props {
    record: LinksExplorerRecord;
    oncategoryclick?: (category: LinkCategory) => void;
    ontagclick?: (tag: string) => void;
  }

  let { record, oncategoryclick, ontagclick }: Props = $props();

  const categoryColor = $derived(categoryColorTokens[record.category]);
</script>

<article
  class="link-card not-content"
  data-has-description={record.description ? "true" : "false"}
>
  <h3 class="link-title">
    <a href={record.url} target="_blank" rel="noopener noreferrer">{record.title}</a>
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
      onclick={() => oncategoryclick?.(record.category)}
    >
      <CategoryIcon category={record.category} size="1rem" />
      <span>{record.category}</span>
    </button>

    {#each record.tags as tag (tag)}
      <button
        type="button"
        class="tag-chip"
        title="Filter by tag: {tag}"
        onclick={() => ontagclick?.(tag)}
      >
        {tag}
      </button>
    {/each}
  </div>
</article>

<style>
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
</style>
