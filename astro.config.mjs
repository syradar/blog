// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";

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
				// {
				// 	label: "Guides",
				// 	items: [
				// 		// Each item here is one entry in the navigation menu.
				// 		{ label: "Example Guide", slug: "guides/example" },
				// 	],
				// },
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
					label: "Fonts",
					autogenerate: { directory: "fonts" },
				},
				{
					label: "Software",
					autogenerate: { directory: "software" },
				},
			],
			plugins: [starlightLinksValidator()],
		}),
	],
});
