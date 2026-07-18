import { onBeforeUnmount, onMounted } from "vue"
import type { LinksGroupBy } from "../lib/links-explorer"
import type { ExplorerFilters } from "../lib/links-search"
import { useLinksExplorerStore } from "../stores/links-explorer"

export type HistoryUpdate = "push" | "replace"

const historyUpdates: Record<string, HistoryUpdate> = {
  resetFilters: "push",
  setGroupBy: "push",
  setQuery: "replace",
  setTag: "push",
  setWeek: "push",
  toggleCategory: "push",
  toggleTag: "push",
}

export function createLinksExplorerUrl(
  filters: ExplorerFilters,
  groupBy: LinksGroupBy,
  location: Location,
): string {
  const params = new URLSearchParams()

  if (filters.q) params.set("q", filters.q)

  for (const category of filters.categories) {
    params.append("category", category)
  }

  if (filters.tag) params.set("tag", filters.tag)
  if (filters.week) params.set("week", filters.week)
  if (groupBy !== "none") params.set("group", groupBy)

  const query = params.toString()
  return query ? `${location.pathname}?${query}` : location.pathname
}

export function useLinksExplorerUrlSync(): void {
  const store = useLinksExplorerStore()

  function writeHistory(mode: HistoryUpdate): void {
    const url = createLinksExplorerUrl(store.getFilters(), store.groupBy, window.location)

    if (mode === "push") {
      window.history.pushState(null, "", url)
      return
    }

    window.history.replaceState(null, "", url)
  }

  async function handlePopstate(): Promise<void> {
    store.hydrateFromSearch(window.location.search)
    await store.applyFilters()
  }

  const unsubscribe = store.$onAction(({ name, after }) => {
    const historyUpdate = historyUpdates[name]

    if (!historyUpdate) return

    after(() => {
      writeHistory(historyUpdate)
      void store.applyFilters()
    })
  })

  onMounted(() => window.addEventListener("popstate", handlePopstate))
  onBeforeUnmount(() => {
    unsubscribe()
    window.removeEventListener("popstate", handlePopstate)
  })
}
