import { create, search, upsert } from "@orama/orama";
import type { LinkCategory } from "./linkCategories";
import type { LinksExplorerRecord } from "./links-explorer";

export type ExplorerFilters = {
  q: string;
  categories: LinkCategory[];
  tag: string;
  week: string;
};

export type LinksSearchRecord = LinksExplorerRecord & {
  publishedAtTimestamp: number;
};

export type SearchLinksResult = {
  records: LinksExplorerRecord[];
  total: number;
};

export function normalizeFilters(
  input: Partial<ExplorerFilters>,
): ExplorerFilters {
  return {
    q: (input.q ?? "").trim(),
    categories: (input.categories ?? []).filter(Boolean),
    tag: input.tag ?? "",
    week: input.week ?? "",
  };
}

export async function createLinksIndex(records: LinksExplorerRecord[]) {
  const db = create({
    schema: {
      id: "string",
      title: "string",
      description: "string",
      url: "string",
      category: "string",
      tags: "string[]",
      weekKey: "string",
      weekTitle: "string",
      publishedAt: "number",
      favorite: "boolean",
    },
  });

  for (const record of records) {
    await upsert(db, {
      ...record,
      publishedAt: new Date(record.publishedAt).getTime(),
    });
  }

  return db;
}

function matchesFacet(
  record: LinksExplorerRecord,
  filters: ExplorerFilters,
): boolean {
  if (
    filters.categories.length > 0 &&
    !filters.categories.includes(record.category)
  ) {
    return false;
  }

  if (filters.tag && !record.tags.includes(filters.tag)) {
    return false;
  }

  if (filters.week && record.weekKey !== filters.week) {
    return false;
  }

  return true;
}

function applyRecencySort(
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

export async function searchLinks(
  db: Awaited<ReturnType<typeof createLinksIndex>>,
  records: LinksExplorerRecord[],
  rawFilters: Partial<ExplorerFilters>,
): Promise<SearchLinksResult> {
  const filters = normalizeFilters(rawFilters);

  if (filters.q) {
    const textResult = (await search(db, {
      term: filters.q,
      properties: [
        "title",
        "description",
        "category",
        "tags",
        "weekTitle",
        "weekKey",
      ],
      tolerance: 1,
      limit: records.length,
    })) as { hits: Array<{ id: string | number }> };

    const byId = new Map(records.map((record) => [record.id, record]));
    const filtered = textResult.hits
      .map((hit: { id: string | number }) => byId.get(String(hit.id)))
      .filter(
        (
          record: LinksExplorerRecord | undefined,
        ): record is LinksExplorerRecord => Boolean(record),
      )
      .filter((record: LinksExplorerRecord) => matchesFacet(record, filters));

    return {
      records: filtered,
      total: filtered.length,
    };
  }

  const filtered = applyRecencySort(
    records.filter((record) => matchesFacet(record, filters)),
  );

  return {
    records: filtered,
    total: filtered.length,
  };
}
