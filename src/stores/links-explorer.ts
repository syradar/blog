import type { RawData } from "@orama/orama"
import { defineStore } from "pinia"
import { computed, shallowRef } from "vue"
import { isLinkCategory, type LinkCategory } from "../lib/linkCategories"
import {
  groupLinksExplorerRecords,
  isLinksGroupBy,
  type LinksExplorerRecord,
  type LinksGroupBy,
} from "../lib/links-explorer"
import { loadLinksIndex, searchLinks, type ExplorerFilters } from "../lib/links-search"

export const useLinksExplorerStore = defineStore("links-explorer", () => {
  const records = shallowRef<LinksExplorerRecord[]>([])
  const q = shallowRef("")
  const selectedCategories = shallowRef<LinkCategory[]>([])
  const tag = shallowRef("")
  const week = shallowRef("")
  const groupBy = shallowRef<LinksGroupBy>("none")
  const visibleRecords = shallowRef<LinksExplorerRecord[]>([])
  const total = shallowRef(0)
  const hasAppliedFilters = shallowRef(false)
  const indexError = shallowRef(false)
  const openSections = shallowRef<string[]>([])

  const recordsTotal = computed(() => records.value.length)
  const effectiveRecords = computed(() =>
    hasAppliedFilters.value ? visibleRecords.value : records.value,
  )
  const effectiveTotal = computed(() =>
    hasAppliedFilters.value ? total.value : recordsTotal.value,
  )
  const groupedRecords = computed(() =>
    groupLinksExplorerRecords(effectiveRecords.value, groupBy.value),
  )

  let index: ReturnType<typeof loadLinksIndex> | null = null
  let latestSearch = 0

  function getFilters(): ExplorerFilters {
    return {
      q: q.value.trim(),
      categories: selectedCategories.value,
      tag: tag.value,
      week: week.value,
    }
  }

  function hydrateFromSearch(search: string): void {
    const params = new URLSearchParams(search)
    const nextGroup = params.get("group") ?? ""
    const hydratedGroup = isLinksGroupBy(nextGroup) ? nextGroup : "none"

    q.value = params.get("q") ?? ""
    selectedCategories.value = params
      .getAll("category")
      .filter((category): category is LinkCategory => isLinkCategory(category))
    tag.value = params.get("tag") ?? ""
    week.value = params.get("week") ?? ""
    if (groupBy.value !== hydratedGroup) {
      openSections.value = []
      groupBy.value = hydratedGroup
    }
  }

  function primeRecords(nextRecords: LinksExplorerRecord[]): void {
    records.value = nextRecords
  }

  async function initialize(nextRecords: LinksExplorerRecord[], snapshot: RawData): Promise<void> {
    primeRecords(nextRecords)

    try {
      index = loadLinksIndex(snapshot)
      await applyFilters()
    } catch (error) {
      console.error("Links Explorer: failed to initialize search index", error)
      showRuntimeError()
    }
  }

  async function applyFilters(): Promise<void> {
    if (!index) {
      showRuntimeError()
      return
    }

    const searchId = ++latestSearch

    try {
      const result = await searchLinks(index, records.value, getFilters())

      if (searchId !== latestSearch) return

      visibleRecords.value = result.records
      total.value = result.total
      hasAppliedFilters.value = true
      indexError.value = false
    } catch (error) {
      console.error("Links Explorer: failed to apply filters", error)
      showRuntimeError()
    }
  }

  function showRuntimeError(): void {
    latestSearch += 1
    indexError.value = true
    q.value = ""
    selectedCategories.value = []
    tag.value = ""
    week.value = ""
    groupBy.value = "none"
    openSections.value = []
    visibleRecords.value = records.value
    total.value = recordsTotal.value
    hasAppliedFilters.value = true
  }

  function resetFilters(): void {
    q.value = ""
    selectedCategories.value = []
    tag.value = ""
    week.value = ""
    groupBy.value = "none"
    openSections.value = []
  }

  function setQuery(value: string): void {
    q.value = value
  }

  function toggleCategory(category: LinkCategory): void {
    selectedCategories.value = selectedCategories.value.includes(category)
      ? selectedCategories.value.filter((value) => value !== category)
      : [...selectedCategories.value, category]
  }

  function setTag(value: string): void {
    tag.value = value
  }

  function toggleTag(value: string): void {
    tag.value = tag.value === value ? "" : value
  }

  function setWeek(value: string): void {
    week.value = value
  }

  function setGroupBy(value: LinksGroupBy): void {
    if (groupBy.value !== value) {
      openSections.value = []
      groupBy.value = value
    }
  }

  function toggleSection(key: string): void {
    openSections.value = openSections.value.includes(key)
      ? openSections.value.filter((value) => value !== key)
      : [...openSections.value, key]
  }

  return {
    records,
    q,
    selectedCategories,
    tag,
    week,
    groupBy,
    visibleRecords,
    total,
    hasAppliedFilters,
    indexError,
    openSections,
    recordsTotal,
    effectiveRecords,
    effectiveTotal,
    groupedRecords,
    getFilters,
    hydrateFromSearch,
    primeRecords,
    initialize,
    applyFilters,
    resetFilters,
    setQuery,
    toggleCategory,
    setTag,
    toggleTag,
    setWeek,
    setGroupBy,
    toggleSection,
  }
})
