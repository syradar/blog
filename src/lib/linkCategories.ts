export const linkCategories = ["Frontend", "Backend", "Email", "UX", "Other"] as const

export type LinkCategory = (typeof linkCategories)[number]

export const categoryIcons: Record<LinkCategory, string> = {
  Frontend: "heroicons:code-bracket",
  Backend: "heroicons:circle-stack",
  Email: "heroicons:envelope",
  UX: "heroicons:paint-brush",
  Other: "heroicons:squares-2x2",
}

export const categoryColorTokens: Record<LinkCategory, string> = {
  Frontend: "var(--sl-color-blue)",
  Backend: "var(--sl-color-green)",
  Email: "var(--sl-color-orange)",
  UX: "var(--sl-color-purple)",
  Other: "var(--sl-color-gray-1)",
}

export function isLinkCategory(value: string): value is LinkCategory {
  return (linkCategories as readonly string[]).includes(value)
}
