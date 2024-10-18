import { defineCollection, z } from "astro:content";
import { docsSchema } from "@astrojs/starlight/schema";

const authors = defineCollection({
	type: "data",
	schema: ({ image }) =>
		z.object({
			name: z.string().min(1, "Name is required"), // Author's full name
			handle: z.string().optional(),
			bio: z.string().optional(), // Short biography or description
			profileImage: image().optional(),
			website: z.string().url().optional(), // Personal website or blog
			socialLinks: z
				.object({
					// Social media links (optional)
					twitter: z.string().url().optional(),
					youtube: z.string().url().optional(), // For YouTubers
					github: z.string().url().optional(),
				})
				.optional(),
			platforms: z
				.array(z.enum(["YouTube", "Blog", "Article Writer"]))
				.nonempty(), // Specify the platforms the author contributes to
			featuredVideos: z.array(z.string().url()).optional(), // YouTube specific: list of featured videos
			featuredArticles: z.array(z.string().url()).optional(), // List of featured articles or blog posts
			email: z.string().email().optional(), // Contact email (optional)
			tags: z.array(z.string()).optional(), // Tags/Keywords associated with the author or their work
		}),
});

export const collections = {
	docs: defineCollection({ schema: docsSchema() }),
	authors: authors,
};
