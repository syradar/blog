import type { CollectionEntry } from "astro:content";
import type { LinkCategory } from "./linkCategories";

export type LinkWeekEntry = CollectionEntry<"linkWeeks">;

export type LinksExplorerRecord = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: LinkCategory;
  tags: string[];
  weekKey: string;
  weekTitle: string;
  publishedAt: string;
  favorite: boolean;
};

export function sortLinksExplorerRecords(
  records: LinksExplorerRecord[],
): LinksExplorerRecord[] {
  return [...records].sort((a, b) => {
    const dateOrder =
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

    if (dateOrder !== 0) {
      return dateOrder;
    }

    return a.id.localeCompare(b.id);
  });
}

export function toLinksExplorerRecords(
  linkWeeks: LinkWeekEntry[],
): LinksExplorerRecord[] {
  const seenIds = new Map<string, number>();

  const flattened = linkWeeks.flatMap((week) => {
    const weekKey = week.data.week;
    const weekTitle = week.data.week.replace("-", " ");
    const publishedAt = week.data.publishedAt.toISOString();
    const entryKey = week.id;

    return week.data.links.map((link, index) => {
      const baseId = `${entryKey}-${index}`;
      const collisions = seenIds.get(baseId) ?? 0;
      seenIds.set(baseId, collisions + 1);

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
      };
    });
  });

  return sortLinksExplorerRecords(flattened);
}

export function getFacetOptions(records: LinksExplorerRecord[]) {
  const categories = new Set<string>();
  const tags = new Set<string>();
  const weeks = new Map<string, string>();

  for (const record of records) {
    categories.add(record.category);

    for (const tag of record.tags) {
      tags.add(tag);
    }

    weeks.set(record.weekKey, record.weekTitle);
  }

  return {
    categories: [...categories].sort((a, b) => a.localeCompare(b)),
    tags: [...tags].sort((a, b) => a.localeCompare(b)),
    weeks: [...weeks.entries()].sort((a, b) => b[0].localeCompare(a[0])),
  };
}
