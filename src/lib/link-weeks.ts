import type { CollectionEntry } from "astro:content";

export type LinkWeekEntry = CollectionEntry<"linkWeeks">;

export type RankedItem = {
  name: string;
  count: number;
};

export type WeekSummary = {
  week: LinkWeekEntry;
  year: string;
  totalLinks: number;
  topCategories: string[];
  topTags: string[];
};

export type YearSummary = {
  year: string;
  weeks: WeekSummary[];
  totalLinks: number;
};

function rankItems(items: string[], limit = 3, minimumCount = 3): RankedItem[] {
  const counts = new Map<string, number>();

  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }

  return [...counts.entries()]
    .filter(([, count]) => count >= minimumCount)
    .sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }
      return a[0].localeCompare(b[0]);
    })
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

export function summarizeWeek(week: LinkWeekEntry): WeekSummary {
  const year = week.data.week.slice(0, 4);
  const links = week.data.links;

  return {
    week,
    year,
    totalLinks: links.length,
    topCategories: rankItems(links.map((link) => link.category)).map(
      (item) => item.name,
    ),
    topTags: rankItems(links.flatMap((link) => link.tags)).map(
      (item) => item.name,
    ),
  };
}

export function groupWeekSummariesByYear(
  linkWeeks: LinkWeekEntry[],
): YearSummary[] {
  const sortedWeeks = [...linkWeeks].sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );

  const grouped = new Map<string, YearSummary>();

  for (const week of sortedWeeks) {
    const summary = summarizeWeek(week);
    const existing = grouped.get(summary.year);

    if (existing) {
      existing.weeks.push(summary);
      existing.totalLinks += summary.totalLinks;
      continue;
    }

    grouped.set(summary.year, {
      year: summary.year,
      weeks: [summary],
      totalLinks: summary.totalLinks,
    });
  }

  return [...grouped.values()].sort((a, b) => b.year.localeCompare(a.year));
}

export function formatPublishedDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
