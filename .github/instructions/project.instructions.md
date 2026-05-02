---
description: "Use when working on this Astro Starlight blog — adding content, creating pages, writing components, or modifying content schemas. Covers link weeks, author profiles, docs structure, Astro patterns, and project conventions."
applyTo: "src/**"
---

# Syradar Blog — Project Conventions

## Tech Stack

- **Framework**: Astro with the Starlight integration
- **Package manager**: pnpm
- **Build check**: `astro check && astro build` (TypeScript errors block the build)
- **Base URL**: `/blog` (all internal links must include this prefix)

## Content Collections

Three collections defined in `src/content.config.ts`:

| Collection  | Loader               | Location                         |
| ----------- | -------------------- | -------------------------------- |
| `docs`      | Starlight docsLoader | `src/content/docs/**/*.{md,mdx}` |
| `authors`   | glob `**/*.yaml`     | `src/content/authors/`           |
| `linkWeeks` | glob `**/*.json`     | `src/content/links/`             |

## Link Week Files (`linkWeeks`)

### File naming

- Filename: `YYYY-wNN.json` (lowercase `w`) — e.g. `2026-w18.json`
- The `week` field inside uses uppercase `W`: `"2026-W18"`

### Required structure

```json
{
  "title": "Links for 2026 W18",
  "week": "2026-W18",
  "publishedAt": "2026-04-30",
  "links": []
}
```

### Link item schema

```json
{
  "title": "string (required)",
  "url": "https://... (required)",
  "category": "Frontend | Backend | Email | UX | Other",
  "tags": ["lowercase-kebab-tag"],
  "description": "optional string",
  "favorite": false,
  "ogImage": "optional string"
}
```

- `category` defaults to `"Other"` if omitted
- `tags` use proper display casing:
  - Proper nouns and brand names: `"TypeScript"`, `"macOS"`, `"GitHub"`
  - Technology acronyms: `"CSS"`, `"HTML"`, `"UX"`
  - CSS properties and technical terms: `"border-radius"`, `"scroll-driven"`, `"grid-layout"`
- `favorite` defaults to `false`; omit the field unless explicitly set to `true`
- Omit other optional fields (`description`, `ogImage`) rather than setting them to null or empty

### Category order (rendered in this order on the page)

`Frontend` → `Backend` → `Email` → `UX` → `Other`

### Authoring workflow

Links are collected via Safari on iPhone → saved to a GitHub Gist → title and tags are written manually. When adding links from a gist, preserve the original URL exactly and write a concise, descriptive title.

## Author Files (`authors`)

### File naming

- Filename: `{handle}.yaml` — e.g. `dannorth.yaml`, `theo.yaml`

### Schema

```yaml
name: "Full Name" # required
handle: "username" # optional
bio: "Short bio." # optional
profileImage: "../../assets/authors/{handle}.webp" # optional, relative path
website: "https://..." # optional URL
socialLinks: # optional
  twitter: "https://x.com/..."
  youtube: "https://..."
  github: "https://github.com/..."
platforms: # required, non-empty array
  - "YouTube" # YouTube | Blog | Article Writer
tags: # optional
  - "Conferences"
featuredVideos: [] # optional, list of URLs
featuredArticles: [] # optional, list of URLs
email: "..." # optional
```

- `platforms` is required and must be non-empty
- Profile images go in `src/assets/authors/` as `.webp` files

## Docs Files (`docs`)

- Starlight docs live in `src/content/docs/`
- Subdirectory structure maps to sidebar sections defined in `astro.config.mjs`
- Use `.md` for plain markdown, `.mdx` for files needing Astro components
- Sidebar sections auto-generate from directories; do not manually add sidebar entries unless adding a new top-level section

### Current sidebar sections and directories

| Label         | Directory        |
| ------------- | ---------------- |
| General       | `general/`       |
| JavaScript    | `js/`            |
| CSS           | `css/`           |
| Accessibility | `accessibility/` |
| Design        | `design/`        |
| Software      | `software/`      |

## Astro Pages

- All pages wrap content with `<StarlightPage frontmatter={{ title: "..." }}>` from `@astrojs/starlight/components/StarlightPage.astro`
- Dynamic routes (e.g. `[week].astro`) use `getStaticPaths()` with `getCollection()`
- Week slugs in URLs use lowercase: `week.data.week.toLowerCase()`

## Astro Components

- Use `import { Image } from "astro:assets"` for images — never raw `<img>` tags (except legacy commented-out code)
- Scoped styles use CSS nesting (`:where`, `.parent { .child {} }`)
- Define Props with an `interface Props {}` block in the frontmatter
- Use `getEntry("collection", id)` for single-entry lookups; `getCollection("collection")` for full collections
- Guard against missing entries: `{!entry ? null : <div>...</div>}`

## Styling

- Custom global styles in `src/styles/custom.css`
- Scoped styles (in `.astro` files) use `<style>` blocks — CSS variables and nesting are supported

## Internal Links

All internal hrefs must include the `/blog` base path (e.g. `/blog/authors`, `/blog/links/2026-w18`).
