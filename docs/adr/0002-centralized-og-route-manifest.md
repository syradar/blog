# Centralize OG image generation in one route manifest

Open Graph coverage for this site applies to all canonical `/blog` pages, including Starlight docs, the Links Explorer, the Weeks Archive, Year Archive pages, Link Week pages, and the Authors page. We will generate those images through a single `astro-og-canvas` endpoint backed by one centralized route manifest so custom Astro pages and Starlight content share the same source of truth for image paths and route-specific card text.

## Considered Options

- **Per-page OG configuration (rejected):** This would split metadata responsibility across Starlight docs and custom Astro routes, making it easier for image URLs and card text to drift.
- **Generic site card for every route (rejected):** This is simpler, but it throws away route-specific context that already exists in the site's vocabulary and page data.

## Consequences

The codebase needs a small shared metadata layer that can enumerate every canonical route and derive the title, description, and OG image path for each one. Both the OG image endpoint and page `<head>` metadata should read from that shared layer rather than recomputing route data independently.
