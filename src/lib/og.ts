import { getCollection, type CollectionEntry } from "astro:content"

import {
  formatPublishedDate,
  groupWeekSummariesByYear,
  type LinkWeekEntry,
} from "./link-weeks"

export type OgRouteEntry = {
  routePath: string
  imageKey: string
  title: string
  routeLabel: string
  description: string
  imageDescription: string
  imageAlt: string
  schemaType: "CollectionPage" | "AboutPage"
  datePublished?: string
  itemCount?: number
}

type OgData = {
  pages: Record<string, OgRouteEntry>
  byRoutePath: Map<string, OgRouteEntry>
}

const BASE_PATH = normalizeBasePath(import.meta.env.BASE_URL ?? "/")

let ogDataPromise: Promise<OgData> | undefined

export function getBasePath() {
  return BASE_PATH
}

export function normalizeRoutePath(path: string) {
  if (!path) {
    return "/"
  }

  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`
  const withoutTrailingSlash =
    withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, "") : withLeadingSlash

  return withoutTrailingSlash || "/"
}

export function withBasePath(path: string) {
  const normalizedPath = normalizeRoutePath(path)

  if (BASE_PATH === "/") {
    return normalizedPath
  }

  return normalizedPath === "/" ? BASE_PATH : `${BASE_PATH}${normalizedPath}`
}

export function getOgImagePath(routePath: string) {
  const imageKey = routePathToImageKey(routePath)
  return withBasePath(`/open-graph/${imageKey}.png`)
}

export async function getOgEntryForRoute(routePath: string) {
  const { byRoutePath } = await getOgData()
  return byRoutePath.get(normalizeRoutePath(routePath))
}

export async function getOgPages() {
  const { pages } = await getOgData()
  return pages
}

export async function getJsonLdForRoute(routePath: string, site: URL) {
  const { byRoutePath } = await getOgData()
  const normalizedRoutePath = normalizeRoutePath(routePath)
  const route = byRoutePath.get(normalizedRoutePath)

  if (!route) {
    return undefined
  }

  const canonicalUrl = new URL(withBasePath(route.routePath), site).toString()
  const imageUrl = new URL(getOgImagePath(route.routePath), site).toString()
  const breadcrumbItems = buildBreadcrumbItems(normalizedRoutePath, byRoutePath, site)

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.toString()}#website`,
        name: "Syradar Blog",
        url: site.toString(),
        description: "Curated web development resources, guides, and weekly link collections.",
        publisher: {
          "@type": "Organization",
          "@id": `${site.toString()}#organization`,
          name: "Syradar",
          url: site.toString(),
        },
        inLanguage: "en",
      },
      {
        "@type": route.schemaType,
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: route.title,
        description: route.description,
        isPartOf: {
          "@id": `${site.toString()}#website`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: imageUrl,
        },
        about: route.routeLabel,
        breadcrumb: {
          "@id": `${canonicalUrl}#breadcrumb`,
        },
        inLanguage: "en",
        ...(route.datePublished ? { datePublished: route.datePublished } : {}),
        ...(route.itemCount
          ? {
              mainEntity: {
                "@type": "ItemList",
                name: route.title,
                numberOfItems: route.itemCount,
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: breadcrumbItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      },
    ],
  }
}

async function getOgData() {
  ogDataPromise ??= buildOgData()
  return ogDataPromise
}

async function buildOgData(): Promise<OgData> {
  const [docsPages, linkWeeks] = await Promise.all([
    getCollection("docs"),
    getCollection("linkWeeks"),
  ])

  const entries = [
    ...buildDocsOgEntries(docsPages),
    ...buildCustomOgEntries(linkWeeks),
  ]

  return {
    pages: Object.fromEntries(entries.map((entry) => [entry.imageKey, entry])),
    byRoutePath: new Map(entries.map((entry) => [entry.routePath, entry])),
  }
}

function buildDocsOgEntries(docsPages: CollectionEntry<"docs">[]): OgRouteEntry[] {
  return docsPages.map((page) => {
    const routePath = docsSlugToRoutePath(page.id)
    const description = page.data.description?.trim() || "Curated web development resources."

    return createOgEntry({
      routePath,
      title: page.data.title,
      routeLabel: "Guide",
      description,
      imageDescription: `Guide • ${description}`,
      imageAlt: `${page.data.title} guide Open Graph image`,
      schemaType: "CollectionPage",
    })
  })
}

function buildCustomOgEntries(linkWeeks: LinkWeekEntry[]): OgRouteEntry[] {
  const sortedWeeks = [...linkWeeks].sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  )
  const groupedByYear = groupWeekSummariesByYear(linkWeeks)
  const totalLinks = linkWeeks.reduce((sum, week) => sum + week.data.links.length, 0)

  return [
    createOgEntry({
      routePath: "/links",
      title: "Link Collection",
      routeLabel: "Links Explorer",
      description: `Search and filter ${totalLinks} curated links across ${linkWeeks.length} Link Weeks.`,
      imageDescription: `Links Explorer • Search and filter ${totalLinks} curated links across ${linkWeeks.length} Link Weeks.`,
      imageAlt: "Links Explorer Open Graph image",
      schemaType: "CollectionPage",
      itemCount: totalLinks,
    }),
    createOgEntry({
      routePath: "/links/weeks",
      title: "Weekly Archive",
      routeLabel: "Weeks Archive",
      description: `Browse ${linkWeeks.length} Link Weeks across ${groupedByYear.length} years.`,
      imageDescription: `Weeks Archive • Browse ${linkWeeks.length} Link Weeks across ${groupedByYear.length} years.`,
      imageAlt: "Weeks Archive Open Graph image",
      schemaType: "CollectionPage",
      itemCount: linkWeeks.length,
    }),
    ...groupedByYear.map((group) =>
      createOgEntry({
        routePath: `/links/weeks/${group.year}`,
        title: `Weekly Links: ${group.year}`,
        routeLabel: "Year Archive",
        description: `${group.weeks.length} weeks and ${group.totalLinks} curated links from ${group.year}.`,
        imageDescription: `Year Archive • ${group.weeks.length} weeks • ${group.totalLinks} links`,
        imageAlt: `${group.year} year archive Open Graph image`,
        schemaType: "CollectionPage",
        itemCount: group.weeks.length,
      }),
    ),
    ...sortedWeeks.map((week) =>
      createOgEntry({
        routePath: `/links/${week.data.week.toLowerCase()}`,
        title: week.data.title,
        routeLabel: "Link Week",
        description: `${week.data.links.length} curated links published on ${formatPublishedDate(week.data.publishedAt)}.`,
        imageDescription: `Link Week • ${formatPublishedDate(week.data.publishedAt)} • ${week.data.links.length} links`,
        imageAlt: `${week.data.title} Open Graph image`,
        schemaType: "CollectionPage",
        datePublished: formatPublishedDate(week.data.publishedAt),
        itemCount: week.data.links.length,
      }),
    ),
    createOgEntry({
      routePath: "/authors",
      title: "Authors",
      routeLabel: "Authors",
      description: "People and sources featured across this curated web development resource collection.",
      imageDescription:
        "Authors • People and sources featured across this curated web development resource collection.",
      imageAlt: "Authors Open Graph image",
      schemaType: "AboutPage",
      itemCount: 2,
    }),
  ]
}

function createOgEntry(input: Omit<OgRouteEntry, "imageKey" | "routePath"> & { routePath: string }) {
  const routePath = normalizeRoutePath(input.routePath)

  return {
    ...input,
    routePath,
    imageKey: routePathToImageKey(routePath),
  }
}

function docsSlugToRoutePath(slug: string) {
  const normalizedSlug = slug
    .replace(/^\/+|\/+$/g, "")
    .replace(/\/index$/, "")

  return normalizedSlug === "" || normalizedSlug === "index"
    ? "/"
    : normalizeRoutePath(`/${normalizedSlug}`)
}

function routePathToImageKey(routePath: string) {
  const normalizedPath = normalizeRoutePath(routePath)

  if (normalizedPath === "/") {
    return "index"
  }

  return normalizedPath.slice(1)
}

function normalizeBasePath(basePath: string) {
  const normalized = normalizeRoutePath(basePath)
  return normalized === "/" ? "/" : normalized.replace(/\/+$/, "")
}

function buildBreadcrumbItems(
  routePath: string,
  byRoutePath: Map<string, OgRouteEntry>,
  site: URL,
) {
  const breadcrumbPaths = routePath === "/" ? ["/"] : ["/", ...parentPathsForRoute(routePath), routePath]

  return breadcrumbPaths.map((path) => {
    const entry = byRoutePath.get(path)

    return {
      name: entry?.title ?? fallbackBreadcrumbLabel(path),
      url: new URL(withBasePath(path), site).toString(),
    }
  })
}

function parentPathsForRoute(routePath: string) {
  const segments = routePath.split("/").filter(Boolean)
  const parents: string[] = []

  for (let index = 0; index < segments.length - 1; index += 1) {
    parents.push(`/${segments.slice(0, index + 1).join("/")}`)
  }

  return parents
}

function fallbackBreadcrumbLabel(routePath: string) {
  const segment = routePath.split("/").filter(Boolean).at(-1) ?? ""
  return segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}
