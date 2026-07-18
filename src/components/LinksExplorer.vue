<script setup lang="ts">
import type { RawData } from "@orama/orama"
import { storeToRefs } from "pinia"
import { onMounted } from "vue"
import { useLinksExplorerUrlSync } from "../composables/useLinksExplorerUrl"
import type { LinksExplorerRecord } from "../lib/links-explorer"
import { useLinksExplorerStore } from "../stores/links-explorer"
import ExplorerControls from "./ExplorerControls.vue"
import LinkCard from "./LinkCard.vue"

const props = defineProps<{
  records: LinksExplorerRecord[]
  facets: { tags: string[]; weeks: [string, string][] }
  indexSnapshot: RawData
}>()

const store = useLinksExplorerStore()
store.primeRecords(props.records)
const {
  q,
  selectedCategories,
  tag,
  week,
  groupBy,
  effectiveRecords,
  effectiveTotal,
  recordsTotal,
  groupedRecords,
  hasAppliedFilters,
  total,
  indexError,
  openSections,
} = storeToRefs(store)
useLinksExplorerUrlSync()

function toGroupPanelId(key: string): string {
  return `group-panel-${encodeURIComponent(key)}`
}

onMounted(async () => {
  store.hydrateFromSearch(window.location.search)
  await store.initialize(props.records, props.indexSnapshot)
})
</script>

<template>
  <div class="links-explorer">
    <ExplorerControls
      :facets="facets"
      :disabled="indexError"
      :q="q"
      :selected-categories="selectedCategories"
      :tag="tag"
      :week="week"
      :group-by="groupBy"
      @query-change="store.setQuery"
      @category-toggle="store.toggleCategory"
      @tag-change="store.setTag"
      @week-change="store.setWeek"
      @group-change="store.setGroupBy"
    />

    <div class="results-summary-container">
      <p class="results-summary">Showing {{ effectiveTotal }} of {{ recordsTotal }} links.</p>

      <button
        id="reset-filters"
        type="button"
        class="control-reset"
        :disabled="indexError"
        @click="store.resetFilters"
      >
        Reset filters
      </button>
    </div>

    <ul v-if="groupBy === 'none'" class="cards-grid">
      <li v-for="record in effectiveRecords" :key="record.id">
        <LinkCard
          :record="record"
          @category-click="store.toggleCategory"
          @tag-click="store.toggleTag"
        />
      </li>
    </ul>

    <div v-else class="grouped-results">
      <section v-for="group in groupedRecords" :key="group.key" class="group-accordion">
        <button
          type="button"
          class="group-accordion__toggle"
          :aria-expanded="openSections.includes(group.key)"
          :aria-controls="toGroupPanelId(group.key)"
          @click="store.toggleSection(group.key)"
        >
          <span>{{ group.title }} ({{ group.count }})</span>
        </button>

        <div
          :id="toGroupPanelId(group.key)"
          class="group-accordion__panel"
          :class="{ 'is-open': openSections.includes(group.key) }"
        >
          <div class="group-accordion__content">
            <ul class="cards-grid cards-grid--grouped">
              <li v-for="record in group.records" :key="`${group.key}:${record.id}`">
                <LinkCard
                  :record="record"
                  @category-click="store.toggleCategory"
                  @tag-click="store.toggleTag"
                />
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>

    <p v-if="hasAppliedFilters && total === 0 && !indexError" class="empty-state">
      No links match your current filters. Try broadening your search or reset all filters.
    </p>

    <p v-if="indexError" class="error-state" role="status" aria-live="polite">
      Search is temporarily unavailable. Showing all links. Please refresh the page.
    </p>
  </div>
</template>

<style scoped>
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
