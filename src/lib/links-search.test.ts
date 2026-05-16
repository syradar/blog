import { describe, expect, it } from "vitest"
import { createLinksIndex, normalizeFilters, searchLinks } from "./links-search"
import type { LinksExplorerRecord } from "./links-explorer"

const records: LinksExplorerRecord[] = [
  {
    id: "2026-w20-0",
    title: "Modern CSS Patterns",
    description: "Layout and animation ideas",
    url: "https://example.dev/css",
    category: "Frontend",
    tags: ["css", "animation"],
    weekKey: "2026-W20",
    weekTitle: "2026 W20",
    publishedAt: "2026-05-10T00:00:00.000Z",
    favorite: false,
  },
  {
    id: "2026-w19-0",
    title: "API Design for Backends",
    description: "Robust service boundaries",
    url: "https://example.dev/api",
    category: "Backend",
    tags: ["node", "api"],
    weekKey: "2026-W19",
    weekTitle: "2026 W19",
    publishedAt: "2026-05-03T00:00:00.000Z",
    favorite: true,
  },
  {
    id: "2026-w20-1",
    title: "CSS Grid Cheatsheet",
    description: "Quick reference",
    url: "https://example.dev/grid",
    category: "Frontend",
    tags: ["css"],
    weekKey: "2026-W20",
    weekTitle: "2026 W20",
    publishedAt: "2026-05-10T00:00:00.000Z",
    favorite: false,
  },
]

describe("links-search", () => {
  it("normalizes missing and whitespace values", () => {
    expect(normalizeFilters({ q: "  css  " })).toEqual({
      q: "css",
      categories: [],
      tag: "",
      week: "",
    })
  })

  it("searches with text query and applies category facets", async () => {
    const index = await createLinksIndex(records)
    const result = await searchLinks(index, records, { q: "css", categories: ["Frontend"] })
    expect(result.total).toBe(2)
    expect(result.records.map((record) => record.id).sort()).toEqual(["2026-w20-0", "2026-w20-1"])
    expect(result.records.every((record) => record.category === "Frontend")).toBe(true)
  })

  it("searches with text query and applies tag and week facets", async () => {
    const index = await createLinksIndex(records)
    const result = await searchLinks(index, records, { q: "css", tag: "animation", week: "2026-W20" })
    expect(result.total).toBe(1)
    expect(result.records[0]?.id).toBe("2026-w20-0")
  })

  it("filters and sorts by recency when no text query is provided", async () => {
    const index = await createLinksIndex(records)
    const result = await searchLinks(index, records, { categories: ["Frontend"] })
    expect(result.records.map((record) => record.id)).toEqual(["2026-w20-0", "2026-w20-1"])
    expect(result.total).toBe(2)
  })

  it("returns no records when no hit matches filters", async () => {
    const index = await createLinksIndex(records)
    const result = await searchLinks(index, records, { q: "backend", week: "2026-W20" })
    expect(result).toEqual({ records: [], total: 0 })
  })
})
