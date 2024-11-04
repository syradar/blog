// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// https://astro.build/config
export default defineConfig({
	site: "https://syradar.github.io",
	base: "/blog",
	integrations: [
		starlight({
			title: "Syradar Blog",
			social: {
				github: "https://github.com/syradar/blog",
			},
			sidebar: [
				{
					label: "General",
					autogenerate: { directory: "general" },
				},
				{
					label: "JavaScript",
					autogenerate: { directory: "js" },
				},
				{
					label: "CSS",
					autogenerate: { directory: "css" },
				},
				{
					label: "Accessibility",
					autogenerate: { directory: "accessibility" },
				},
				{
					label: "Design",
					autogenerate: { directory: "design" },
				},
				{
					label: "Software",
					autogenerate: { directory: "software" },
				},
			],
			plugins: [starlightLinksValidator()],
			customCss: [
				// Relative path to your custom CSS file
				"./src/styles/custom.css",
			],
		}),
	],
	markdown: {
		rehypePlugins: [
			rehypeSlug,
			[
				rehypeAutolinkHeadings,
				{
					behavior: "wrap",
					content: {
						type: "raw",
						value: `<span aria-hidden="true">#</span>`,
					},
					headingProperties: {
						className: ["anchor"],
					},
					properties: {
						className: ["anchor-link"],
					},
				},
			],
		],
	},
});
