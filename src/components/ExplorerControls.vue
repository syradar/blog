<script setup lang="ts">
import { computed, shallowRef, watch } from "vue"
import { categoryColorTokens, linkCategories, type LinkCategory } from "../lib/linkCategories"
import type { LinksGroupBy } from "../lib/links-explorer"
import CategoryIcon from "./CategoryIcon.vue"

const props = withDefaults(
  defineProps<{
    facets: { tags: string[]; weeks: [string, string][] }
    disabled?: boolean
    q: string
    selectedCategories: LinkCategory[]
    tag: string
    week: string
    groupBy: LinksGroupBy
  }>(),
  { disabled: false },
)

const emit = defineEmits<{
  queryChange: [value: string]
  categoryToggle: [category: LinkCategory]
  tagChange: [value: string]
  weekChange: [value: string]
  groupChange: [value: LinksGroupBy]
}>()

const filtersOpen = shallowRef(false)
const hasActiveViewState = computed(
  () =>
    Boolean(props.q) ||
    props.selectedCategories.length > 0 ||
    Boolean(props.tag) ||
    Boolean(props.week) ||
    props.groupBy !== "none",
)

watch(
  hasActiveViewState,
  (isActive) => {
    if (isActive) filtersOpen.value = true
  },
  { immediate: true },
)

function inputValue(event: Event): string {
  return (event.currentTarget as HTMLInputElement | HTMLSelectElement).value
}
</script>

<template>
  <section class="controls not-content" aria-label="Links Explorer filters">
    <label class="control-search">
      <span>Search</span>
      <input
        id="q"
        name="q"
        type="search"
        placeholder="Search links"
        :disabled="disabled"
        :value="q"
        @input="emit('queryChange', inputValue($event))"
      />
    </label>

    <button
      id="toggle-filters"
      type="button"
      :aria-pressed="filtersOpen"
      :aria-expanded="filtersOpen"
      aria-controls="filters-panel"
      :disabled="disabled"
      @click="filtersOpen = !filtersOpen"
    >
      Filters
    </button>

    <div
      id="filters-panel"
      class="filters-panel"
      :class="{ 'is-open': filtersOpen }"
      :aria-hidden="!filtersOpen"
      :inert="!filtersOpen"
    >
      <div class="filters-panel__content">
        <label class="control-tag">
          <span>Tag</span>
          <select
            id="tag"
            name="tag"
            :disabled="disabled"
            :value="tag"
            @change="emit('tagChange', inputValue($event))"
          >
            <option value="">All tags</option>
            <option v-for="value in facets.tags" :key="value" :value="value">
              {{ value }}
            </option>
          </select>
        </label>

        <fieldset class="category-filter-group control-categories">
          <legend>Categories</legend>
          <div class="category-buttons">
            <button
              v-for="category in linkCategories"
              :key="category"
              type="button"
              class="category-button"
              :class="{ 'is-other': category === 'Other' }"
              :disabled="disabled"
              :aria-pressed="selectedCategories.includes(category)"
              :style="{ '--category-color': categoryColorTokens[category] }"
              @click="emit('categoryToggle', category)"
            >
              <CategoryIcon :category="category" size="1.2rem" />
              <span class="label">{{ category }}</span>
            </button>
          </div>
        </fieldset>

        <label class="control-week">
          <span>Week</span>
          <select
            id="week"
            name="week"
            :disabled="disabled"
            :value="week"
            @change="emit('weekChange', inputValue($event))"
          >
            <option value="">All weeks</option>
            <option v-for="[weekKey, weekTitle] in facets.weeks" :key="weekKey" :value="weekKey">
              {{ weekTitle }}
            </option>
          </select>
        </label>

        <label class="control-group">
          <span>Group by</span>
          <select
            id="groupBy"
            name="groupBy"
            :disabled="disabled"
            :value="groupBy"
            @change="emit('groupChange', inputValue($event) as LinksGroupBy)"
          >
            <option value="none">None</option>
            <option value="category">Category</option>
            <option value="tag">Tag</option>
            <option value="week">Week</option>
          </select>
        </label>
      </div>
    </div>
  </section>
</template>

<style scoped>
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

.filters-panel.is-open {
  grid-template-rows: 1fr;
}

.filters-panel__content {
  display: grid;
  gap: 0.75rem;
  padding-block: 0;
  overflow: hidden;
  min-height: 0;
  grid-template-areas:
    "tag week"
    "group group"
    "categories categories";
}

.filters-panel.is-open .filters-panel__content {
  padding-block: 0.5rem;
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

.control-group {
  grid-area: group;
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
  border: 1px solid color-mix(in oklab, var(--category-color), var(--sl-color-gray-5) 70%);
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
  background: color-mix(in oklab, var(--sl-color-bg), var(--category-color) 8%);
}

.category-button[aria-pressed="true"] {
  background: color-mix(in oklab, var(--category-color), var(--sl-color-bg) 75%);
  border-color: color-mix(in oklab, var(--category-color), var(--sl-color-gray-5) 48%);
}

.category-button.is-other {
  border-color: color-mix(in oklab, var(--sl-color-gray), var(--sl-color-gray-4) 35%);
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
  .filters-panel__content {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-areas:
      "tag week"
      "group group"
      "categories categories";
    align-items: end;
  }

  .category-buttons {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}
</style>
