import { describe, expect, it } from "vitest"
import {
  getFacetOptions,
  groupLinksExplorerRecords,
  isLinksGroupBy,
  sortLinksExplorerRecords,
  toLinksExplorerRecords,
  UNTITLED_TAG_GROUP,
} from "./links-explorer"

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
  type LinkWeekInput = Parameters<typeof toLinksExplorerRecords>[0][number]

  return {
    id,
    data: {
      week,
      title: `Links for ${week}`,
      publishedAt: new Date(publishedAt),
      links,
    },
  } as LinkWeekInput
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

  it("sorts by id when publish dates are identical", () => {
    const sorted = sortLinksExplorerRecords([
      {
        id: "c",
        title: "C",
        description: "",
        url: "https://c.dev",
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
    ])

    expect(sorted.map((record) => record.id)).toEqual(["a", "b", "c"])
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

  it("accepts only known group modes", () => {
    expect(isLinksGroupBy("none")).toBe(true)
    expect(isLinksGroupBy("category")).toBe(true)
    expect(isLinksGroupBy("tag")).toBe(true)
    expect(isLinksGroupBy("week")).toBe(true)
    expect(isLinksGroupBy("tags")).toBe(false)
  })

  it("groups records by category using canonical category order", () => {
    const groups = groupLinksExplorerRecords([
      {
        id: "1",
        title: "A",
        description: "",
        url: "https://a.dev",
        category: "Backend",
        tags: ["api"],
        weekKey: "2026-W20",
        weekTitle: "2026 W20",
        publishedAt: "2026-05-10T00:00:00.000Z",
        favorite: false,
      },
      {
        id: "2",
        title: "B",
        description: "",
        url: "https://b.dev",
        category: "Frontend",
        tags: ["css"],
        weekKey: "2026-W19",
        weekTitle: "2026 W19",
        publishedAt: "2026-05-03T00:00:00.000Z",
        favorite: false,
      },
    ], "category")

    expect(groups.map((group) => group.title)).toEqual(["Frontend", "Backend"])
    expect(groups.map((group) => group.count)).toEqual([1, 1])
  })

  it("duplicates records across tag groups and adds untagged fallback", () => {
    const groups = groupLinksExplorerRecords([
      {
        id: "1",
        title: "A",
        description: "",
        url: "https://a.dev",
        category: "Frontend",
        tags: ["animation", "css"],
        weekKey: "2026-W20",
        weekTitle: "2026 W20",
        publishedAt: "2026-05-10T00:00:00.000Z",
        favorite: false,
      },
      {
        id: "2",
        title: "B",
        description: "",
        url: "https://b.dev",
        category: "Other",
        tags: [],
        weekKey: "2026-W19",
        weekTitle: "2026 W19",
        publishedAt: "2026-05-03T00:00:00.000Z",
        favorite: false,
      },
    ], "tag")

    expect(groups.map((group) => group.title)).toEqual(["animation", "css", UNTITLED_TAG_GROUP])
    expect(groups.find((group) => group.title === "animation")?.records.map((record) => record.id)).toEqual(["1"])
    expect(groups.find((group) => group.title === "css")?.records.map((record) => record.id)).toEqual(["1"])
    expect(groups.find((group) => group.title === UNTITLED_TAG_GROUP)?.records.map((record) => record.id)).toEqual(["2"])
  })

  it("groups weeks in descending week order", () => {
    const groups = groupLinksExplorerRecords([
      {
        id: "1",
        title: "A",
        description: "",
        url: "https://a.dev",
        category: "Frontend",
        tags: ["css"],
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
        tags: ["css"],
        weekKey: "2026-W20",
        weekTitle: "2026 W20",
        publishedAt: "2026-05-10T00:00:00.000Z",
        favorite: false,
      },
    ], "week")

    expect(groups.map((group) => group.title)).toEqual(["2026 W20", "2026 W19"])
  })
})
