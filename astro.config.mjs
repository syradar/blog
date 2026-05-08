// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import icon from "astro-icon";
import starlightLinksValidator from "starlight-links-validator";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// https://astro.build/config
export default defineConfig({
	site: "https://syradar.github.io",
	base: "/blog",
	integrations: [
		icon(),
		starlight({
			title: "Syradar Blog",
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/syradar/blog",
				}
			],
			lastUpdated: true,
			credits: true,
			sidebar: [
				{
					label: "Link Collection",
					items: [
						{ label: "Link Collection", link: "/links/" },
						{ label: "Weekly Archive", link: "/links/weeks/" }
					]
				},
				{
					label: "General",
					items: [
						{ autogenerate: { directory: "general" } }
					],
				},
				{
					label: "JavaScript",
					items: [
						{ autogenerate: { directory: "js" } }
					],
				},
				{
					label: "CSS",
					items: [
						{ autogenerate: { directory: "css" } }
					],
				},
				{
					label: "Accessibility",
					items: [
						{ autogenerate: { directory: "accessibility" } }
					],
				},
				{
					label: "Design",
					items: [
						{ autogenerate: { directory: "design" } }
					],
				},
				{
					label: "Software",
					items: [
						{ autogenerate: { directory: "software" } }
					],
				},
				// {
				// 	label: "Authors",
				// 	link: "/authors",
				// },
			],
			plugins: [starlightLinksValidator({
				exclude: ["/", "/blog/links/", "/blog/links/weeks/"],
			})],
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
