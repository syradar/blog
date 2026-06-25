import { defineRouteMiddleware } from "@astrojs/starlight/route-data"

import {
  getJsonLdForRoute,
  getOgEntryForRoute,
  getOgImagePath,
  normalizeRoutePath,
} from "./lib/og"

type HeadEntry = {
  tag: string
  attrs?: Record<string, string | boolean | undefined> | undefined
  content?: string | undefined
}

export const onRequest = defineRouteMiddleware(async (context, next) => {
  const routePath = normalizeRoutePath(context.url.pathname)
  const ogEntry = await getOgEntryForRoute(routePath)

  if (ogEntry && context.site) {
    const imageUrl = new URL(getOgImagePath(ogEntry.routePath), context.site).toString()
    const head = context.locals.starlightRoute.head
    const jsonLd = await getJsonLdForRoute(routePath, context.site)

    appendMetaTag(head, "name", "description", ogEntry.description)
    appendMetaTag(head, "property", "og:description", ogEntry.description)
    appendMetaTag(head, "name", "twitter:description", ogEntry.description)
    appendMetaTag(head, "property", "og:image", imageUrl)
    appendMetaTag(head, "property", "og:image:alt", ogEntry.imageAlt)
    appendMetaTag(head, "name", "twitter:image", imageUrl)
    appendMetaTag(head, "name", "twitter:image:alt", ogEntry.imageAlt)

    if (jsonLd && !head.some((entry) => entry.tag === "script" && entry.attrs?.type === "application/ld+json")) {
      head.push({
        tag: "script",
        attrs: { type: "application/ld+json" },
        content: JSON.stringify(jsonLd),
      })
    }
  }

  await next()
})

function appendMetaTag(
  head: HeadEntry[],
  attributeName: "name" | "property",
  attributeValue: string,
  content: string,
) {
  const existingTag = head.find(
    (entry: HeadEntry) =>
      entry.tag === "meta" &&
      entry.attrs?.[attributeName] === attributeValue,
  )

  if (existingTag) {
    if (existingTag.attrs) {
      existingTag.attrs.content = content
    }
    return
  }

  head.push({
    tag: "meta",
    attrs: {
      [attributeName]: attributeValue,
      content,
    },
  })
}
