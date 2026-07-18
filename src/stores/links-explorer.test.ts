import { createPinia, setActivePinia } from "pinia"
import { beforeEach, describe, expect, it } from "vitest"
import type { LinksExplorerRecord } from "../lib/links-explorer"
import { buildLinksIndexSnapshot } from "../lib/links-search"
import { useLinksExplorerStore } from "./links-explorer"

const records: LinksExplorerRecord[] = [
  {
    id: "vue",
    title: "Vue state management",
    description: "Pinia patterns",
    url: "https://example.com/vue",
    category: "Frontend",
    tags: ["vue", "state"],
    weekKey: "2026-W29",
    weekTitle: "2026 W29",
    publishedAt: "2026-07-18T00:00:00.000Z",
    favorite: false,
  },
  {
    id: "api",
    title: "API design",
    description: "Backend patterns",
    url: "https://example.com/api",
    category: "Backend",
    tags: ["api"],
    weekKey: "2026-W28",
    weekTitle: "2026 W28",
    publishedAt: "2026-07-11T00:00:00.000Z",
    favorite: false,
  },
]

describe("Links Explorer store", () => {
  beforeEach(() => setActivePinia(createPinia()))

  it("hydrates valid view state from the URL", () => {
    const store = useLinksExplorerStore()

    store.hydrateFromSearch(
      "?q=pinia&category=Frontend&category=invalid&tag=vue&week=2026-W29&group=tag",
    )

    expect(store.q).toBe("pinia")
    expect(store.selectedCategories).toEqual(["Frontend"])
    expect(store.tag).toBe("vue")
    expect(store.week).toBe("2026-W29")
    expect(store.groupBy).toBe("tag")
  })

  it("loads the search index and derives filtered groups", async () => {
    const store = useLinksExplorerStore()
    const snapshot = await buildLinksIndexSnapshot(records)

    store.setQuery("Pinia")
    store.setGroupBy("tag")
    await store.initialize(records, snapshot)

    expect(store.effectiveRecords.map((record) => record.id)).toEqual(["vue"])
    expect(store.groupedRecords.map((group) => group.title)).toEqual(["state", "vue"])
  })

  it("preserves accordion state for filters and clears it for grouping changes", () => {
    const store = useLinksExplorerStore()

    store.setGroupBy("category")
    store.toggleSection("Frontend")
    store.setTag("vue")
    expect(store.openSections).toEqual(["Frontend"])

    store.hydrateFromSearch("?tag=state&group=category")
    expect(store.openSections).toEqual(["Frontend"])

    store.setGroupBy("week")
    expect(store.openSections).toEqual([])
  })
})
