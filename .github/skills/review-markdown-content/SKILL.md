---
name: review-markdown-content
description: "Review and improve markdown content files in src/content/docs/. Use when asked to review, audit, improve, or polish markdown pages — checking writing quality, link formatting, frontmatter, structure, and consistency with project conventions."
argument-hint: "optional: path or glob to scope the review (e.g. src/content/docs/css/)"
---

# Review Markdown Content

Reviews `src/content/docs/**/*.md` files for quality and consistency, then proposes targeted improvements.

## What to Review

### Frontmatter

- `title`: short, titlecase, no trailing punctuation
- `description`: one sentence, no trailing period, under 160 chars

### Links

- Format: `[Title](URL)` — no bare URLs
- Author attribution: append `by Author Name` after the closing paren when the author is known but not in the title
- Descriptions: add a brief inline description after `: ` when the link title alone is ambiguous
- Trailing slashes: remove from link URLs unless they affect routing
- Vadim Kravcenko / grouped authors: use a nested list (see `career.md` pattern)

### Writing

- No first-person ("I", "my") in descriptions or section intros — use neutral or second-person voice
- Section headings: titlecase `##` headings; sentence-case `###` and deeper
- No orphan links at the top of a file before any heading (move them under a relevant `##`)

### Structure

- Files with more than ~10 items should use `##` sections
- Sections should be ordered: general concept → tooling → reference/deep dives
- Index files (`index.md`) should have a 1–2 sentence intro below the frontmatter before any list

## Procedure

1. **Identify scope** — if an argument was given, restrict to that path; otherwise review all files under `src/content/docs/`
2. **Read the files** — use `view` to read each file
3. **Check each criterion above** — flag every violation with file path and line number
4. **Propose concrete edits** — for each issue, show the original and improved text
5. **Apply on approval** — once the user confirms, apply edits using the `edit` tool
6. **Validate** — run `astro check` to confirm no build errors were introduced

## Examples of Common Fixes

**Orphan link before first heading** (`layout.md` line 6):

```
# Before
- [Rebuilding a featured news section…](https://…): By Ahmad Shadeed.

# After (move under a relevant section, or add a heading)
## General
- [Rebuilding a featured news section with modern CSS: Vox news](https://…) by Ahmad Shadeed
```

**First-person in section intro** (`career.md` line 8):

```
# Before
Articles and writers that I have found useful for advancing as a developer…

# After
Articles and writers useful for advancing as a developer…
```

**Missing description for ambiguous link**:

```
# Before
- [The Seven Levels of Busy](https://…)

# After
- [The Seven Levels of Busy](https://…): On recognizing and escaping chronic overcommitment.
```
