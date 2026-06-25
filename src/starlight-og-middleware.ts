import { defineRouteMiddleware } from "@astrojs/starlight/route-data"

import {
  buildHeadForRoute,
  normalizeRoutePath,
} from "./lib/og"

export const onRequest = defineRouteMiddleware(async (context, next) => {
  const site = context.site
  const routePath = normalizeRoutePath(context.url.pathname)
  const head = context.locals.starlightRoute.head

  if (site) {
    for (const entry of await buildHeadForRoute(routePath, site)) {
      if (entry.tag === "meta") {
        const attributeName = "name" in (entry.attrs ?? {}) ? "name" : "property"
        const attributeValue = entry.attrs?.[attributeName]
        const content = typeof entry.attrs?.content === "string" ? entry.attrs.content : undefined

        if (attributeValue && content) {
          appendMetaTag(head, attributeName, String(attributeValue), content)
        }
        continue
      }

      if (
        entry.tag === "script" &&
        entry.attrs?.type === "application/ld+json" &&
        !head.some(
          (existingEntry) =>
            existingEntry.tag === "script" &&
            existingEntry.attrs?.type === "application/ld+json",
        )
      ) {
        head.push(entry)
      }
    }
  }

  await next()
})

function appendMetaTag(
  entries: App.Locals["starlightRoute"]["head"],
  attributeName: "name" | "property",
  attributeValue: string,
  content: string,
) {
  const existingTag = entries.find(
    (entry) => entry.tag === "meta" && entry.attrs?.[attributeName] === attributeValue,
  )

  if (existingTag?.attrs) {
    existingTag.attrs.content = content
    return
  }

  entries.push({
    tag: "meta",
    attrs: {
      [attributeName]: attributeValue,
      content,
    },
  })
}
