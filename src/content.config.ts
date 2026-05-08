import { docsLoader } from "@astrojs/starlight/loaders"
import { docsSchema } from "@astrojs/starlight/schema"
import { glob } from "astro/loaders"
import { z } from "astro/zod"
import { defineCollection } from "astro:content"

const authors = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/authors" }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1, "Name is required"), // Author's full name
      handle: z.string().optional(),
      bio: z.string().optional(), // Short biography or description
      profileImage: image().optional(),
      website: z.url().optional(), // Personal website or blog
      socialLinks: z
        .object({
          // Social media links (optional)
          twitter: z.url().optional(),
          youtube: z.url().optional(), // For YouTubers
          github: z.url().optional(),
        })
        .optional(),
      platforms: z.array(z.enum(["YouTube", "Blog", "Article Writer"])).nonempty(), // Specify the platforms the author contributes to
      featuredVideos: z.array(z.url()).optional(), // YouTube specific: list of featured videos
      featuredArticles: z.array(z.url()).optional(), // List of featured articles or blog posts
      email: z.email().optional(), // Contact email (optional)
      tags: z.array(z.string()).optional(), // Tags/Keywords associated with the author or their work
    }),
})

const linkWeeks = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/content/links",
  }),
  schema: z.object({
    title: z.string(),
    week: z.string().regex(/^\d{4}-W\d{2}$/, {
      message: "Week must be in format YYYY-W## (e.g. 2026-W17)",
    }),
    publishedAt: z.coerce.date(),
    links: z.array(
      z.object({
        title: z.string(),
        url: z.url(),
        description: z.string().optional(),
        tags: z.array(z.string()).default([]),
        category: z.enum(["Frontend", "Backend", "Email", "UX", "Other"]).default("Other"),
        favorite: z.boolean().default(false),
        ogImage: z.string().optional(),
      }),
    ),
  }),
})

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  authors: authors,
  linkWeeks: linkWeeks,
}
