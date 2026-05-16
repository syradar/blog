import { describe, expect, it } from "vitest"
import { formatPublishedDate, groupWeekSummariesByYear, summarizeWeek } from "./link-weeks"

type MockLink = {
  title: string
  url: string
  category: "Frontend" | "Backend" | "Email" | "UX" | "Other"
  tags: string[]
  description?: string
  favorite: boolean
}

function createWeek(week: string, publishedAt: string, links: MockLink[], id = week) {
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

describe("link-weeks", () => {
  it("summarizes a week with top categories and tags above threshold", () => {
    const week = createWeek("2026-W20", "2026-05-10", [
      { title: "A", url: "https://a.dev", category: "Frontend", tags: ["css", "ux"], favorite: false },
      { title: "B", url: "https://b.dev", category: "Frontend", tags: ["css"], favorite: false },
      { title: "C", url: "https://c.dev", category: "Backend", tags: ["node"], favorite: false },
      { title: "D", url: "https://d.dev", category: "Frontend", tags: ["css"], favorite: false },
      { title: "E", url: "https://e.dev", category: "Backend", tags: ["node"], favorite: false },
      { title: "F", url: "https://f.dev", category: "Backend", tags: ["node"], favorite: false },
    ])

    const summary = summarizeWeek(week)
    expect(summary.year).toBe("2026")
    expect(summary.totalLinks).toBe(6)
    expect(summary.topCategories).toEqual(["Backend", "Frontend"])
    expect(summary.topTags).toEqual(["css", "node"])
  })

  it("groups weekly summaries by year and sorts weeks by recency", () => {
    const grouped = groupWeekSummariesByYear([
      createWeek("2025-W52", "2025-12-28", [{ title: "A", url: "https://a.dev", category: "Other", tags: ["x"], favorite: false }]),
      createWeek("2026-W01", "2026-01-04", [{ title: "B", url: "https://b.dev", category: "Other", tags: ["x"], favorite: false }]),
      createWeek("2026-W02", "2026-01-11", [{ title: "C", url: "https://c.dev", category: "Other", tags: ["x"], favorite: false }]),
    ])

    expect(grouped.map((entry) => entry.year)).toEqual(["2026", "2025"])
    expect(grouped[0]?.weeks.map((week) => week.week.data.week)).toEqual(["2026-W02", "2026-W01"])
    expect(grouped[0]?.totalLinks).toBe(2)
    expect(grouped[1]?.totalLinks).toBe(1)
  })

  it("formats publish date in YYYY-MM-DD", () => {
    expect(formatPublishedDate(new Date("2026-05-16T12:34:56.000Z"))).toBe("2026-05-16")
  })
})
