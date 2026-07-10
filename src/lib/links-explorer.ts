import type { CollectionEntry } from "astro:content"
import { linkCategories, type LinkCategory } from "./linkCategories"

export type LinkWeekEntry = CollectionEntry<"linkWeeks">
export type LinksGroupBy = "none" | "category" | "tag" | "week"

export type LinksExplorerRecord = {
  id: string
  title: string
  description: string
  url: string
  category: LinkCategory
  tags: string[]
  weekKey: string
  weekTitle: string
  publishedAt: string
  favorite: boolean
}

export type LinksExplorerGroup = {
  key: string
  title: string
  count: number
  records: LinksExplorerRecord[]
}

export const UNTITLED_TAG_GROUP = "Untagged"

export function isLinksGroupBy(value: string): value is LinksGroupBy {
  return value === "none" || value === "category" || value === "tag" || value === "week"
}

export function sortLinksExplorerRecords(records: LinksExplorerRecord[]): LinksExplorerRecord[] {
  return [...records].sort((a, b) => {
    const dateOrder = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()

    if (dateOrder !== 0) {
      return dateOrder
    }

    return a.id.localeCompare(b.id)
  })
}

export function toLinksExplorerRecords(linkWeeks: LinkWeekEntry[]): LinksExplorerRecord[] {
  const seenIds = new Map<string, number>()

  const flattened = linkWeeks.flatMap((week) => {
    const weekKey = week.data.week
    const weekTitle = week.data.week.replace("-", " ")
    const publishedAt = week.data.publishedAt.toISOString()
    const entryKey = week.id

    return week.data.links.map((link, index) => {
      const baseId = `${entryKey}-${index}`
      const collisions = seenIds.get(baseId) ?? 0
      seenIds.set(baseId, collisions + 1)

      return {
        id: collisions === 0 ? baseId : `${baseId}-${collisions + 1}`,
        title: link.title,
        description: link.description ?? "",
        url: link.url,
        category: link.category,
        tags: [...link.tags],
        weekKey,
        weekTitle,
        publishedAt,
        favorite: link.favorite,
      }
    })
  })

  return sortLinksExplorerRecords(flattened)
}

export function getFacetOptions(records: LinksExplorerRecord[]) {
  const categories = new Set<string>()
  const tags = new Set<string>()
  const weeks = new Map<string, string>()

  for (const record of records) {
    categories.add(record.category)

    for (const tag of record.tags) {
      tags.add(tag)
    }

    weeks.set(record.weekKey, record.weekTitle)
  }

  return {
    categories: [...categories].sort((a, b) => a.localeCompare(b)),
    tags: [...tags].sort((a, b) => a.localeCompare(b)),
    weeks: [...weeks.entries()].sort((a, b) => b[0].localeCompare(a[0])),
  }
}

export function groupLinksExplorerRecords(
  records: LinksExplorerRecord[],
  groupBy: LinksGroupBy,
): LinksExplorerGroup[] {
  if (groupBy === "none") {
    return []
  }

  if (groupBy === "category") {
    return linkCategories
      .map((category) => {
        const groupRecords = records.filter((record) => record.category === category)
        return {
          key: category,
          title: category,
          count: groupRecords.length,
          records: groupRecords,
        }
      })
      .filter((group) => group.count > 0)
  }

  if (groupBy === "week") {
    const groups = new Map<string, LinksExplorerGroup>()

    for (const record of records) {
      const existing = groups.get(record.weekKey)

      if (existing) {
        existing.records.push(record)
        existing.count += 1
        continue
      }

      groups.set(record.weekKey, {
        key: record.weekKey,
        title: record.weekTitle,
        count: 1,
        records: [record],
      })
    }

    return [...groups.values()].sort((a, b) => b.key.localeCompare(a.key))
  }

  const groups = new Map<string, LinksExplorerGroup>()

  for (const record of records) {
    const tags = record.tags.length > 0 ? record.tags : [UNTITLED_TAG_GROUP]

    for (const tag of tags) {
      const existing = groups.get(tag)

      if (existing) {
        existing.records.push(record)
        existing.count += 1
        continue
      }

      groups.set(tag, {
        key: tag,
        title: tag,
        count: 1,
        records: [record],
      })
    }
  }

  return [...groups.values()].sort((a, b) => a.title.localeCompare(b.title))
}
