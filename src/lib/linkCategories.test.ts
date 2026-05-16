import { describe, expect, it } from "vitest"
import { categoryColorTokens, categoryIcons, isLinkCategory, linkCategories } from "./linkCategories"

describe("linkCategories", () => {
  it("accepts only known categories", () => {
    for (const category of linkCategories) {
      expect(isLinkCategory(category)).toBe(true)
    }

    expect(isLinkCategory("frontend")).toBe(false)
    expect(isLinkCategory("unknown")).toBe(false)
  })

  it("defines icon and color tokens for every category", () => {
    expect(Object.keys(categoryIcons).sort()).toEqual([...linkCategories].sort())
    expect(Object.keys(categoryColorTokens).sort()).toEqual([...linkCategories].sort())
  })
})
