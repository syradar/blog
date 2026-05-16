import { describe, expect, it } from "vitest"
import { getFacetOptions, sortLinksExplorerRecords, toLinksExplorerRecords } from "./links-explorer"

function createWeek(
  id: string,
  week: string,
  publishedAt: string,
  links: Array<{
    title: string
    url: string
    category: "Frontend" | "Backend" | "Email" | "UX" | "Other"
    tags: string[]
    description?: string
    favorite: boolean
  }>,
) {
  return {
    id,
    data: {
      week,
      title: `Links for ${week}`,
      publishedAt: new Date(publishedAt),
      links,
    },
  } as any
}

describe("links-explorer", () => {
  it("sorts records by recency then id", () => {
    const sorted = sortLinksExplorerRecords([
      {
        id: "b",
        title: "B",
        description: "",
        url: "https://b.dev",
        category: "Frontend",
        tags: [],
        weekKey: "2026-W20",
        weekTitle: "2026 W20",
        publishedAt: "2026-05-01T00:00:00.000Z",
        favorite: false,
      },
      {
        id: "a",
        title: "A",
        description: "",
        url: "https://a.dev",
        category: "Frontend",
        tags: [],
        weekKey: "2026-W20",
        weekTitle: "2026 W20",
        publishedAt: "2026-05-01T00:00:00.000Z",
        favorite: false,
      },
      {
        id: "z",
        title: "Z",
        description: "",
        url: "https://z.dev",
        category: "Frontend",
        tags: [],
        weekKey: "2026-W21",
        weekTitle: "2026 W21",
        publishedAt: "2026-05-08T00:00:00.000Z",
        favorite: false,
      },
    ])

    expect(sorted.map((record) => record.id)).toEqual(["z", "a", "b"])
  })

  it("flattens week entries and fills defaults", () => {
    const records = toLinksExplorerRecords([
      createWeek("2026-w20", "2026-W20", "2026-05-10", [
        {
          title: "Link",
          url: "https://example.dev",
          category: "Frontend",
          tags: ["css"],
          favorite: false,
        },
      ]),
    ])

    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      id: "2026-w20-0",
      title: "Link",
      description: "",
      weekKey: "2026-W20",
      weekTitle: "2026 W20",
      publishedAt: "2026-05-10T00:00:00.000Z",
    })
  })

  it("creates unique ids when flattened ids collide", () => {
    const weekA = createWeek("dup", "2026-W20", "2026-05-10", [
      { title: "A", url: "https://a.dev", category: "Other", tags: [], favorite: false },
    ])
    const weekB = createWeek("dup", "2026-W21", "2026-05-11", [
      { title: "B", url: "https://b.dev", category: "Other", tags: [], favorite: false },
    ])

    const ids = toLinksExplorerRecords([weekA, weekB]).map((record) => record.id)
    expect(ids).toContain("dup-0")
    expect(ids).toContain("dup-0-2")
  })

  it("returns sorted facet options", () => {
    const options = getFacetOptions([
      {
        id: "1",
        title: "A",
        description: "",
        url: "https://a.dev",
        category: "Backend",
        tags: ["node", "api"],
        weekKey: "2026-W19",
        weekTitle: "2026 W19",
        publishedAt: "2026-05-03T00:00:00.000Z",
        favorite: false,
      },
      {
        id: "2",
        title: "B",
        description: "",
        url: "https://b.dev",
        category: "Frontend",
        tags: ["css", "api"],
        weekKey: "2026-W20",
        weekTitle: "2026 W20",
        publishedAt: "2026-05-10T00:00:00.000Z",
        favorite: false,
      },
    ])

    expect(options.categories).toEqual(["Backend", "Frontend"])
    expect(options.tags).toEqual(["api", "css", "node"])
    expect(options.weeks).toEqual([
      ["2026-W20", "2026 W20"],
      ["2026-W19", "2026 W19"],
    ])
  })
})
