// @vitest-environment jsdom

import { mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"
import ExplorerControls from "./ExplorerControls.vue"

function mountControls() {
  return mount(ExplorerControls, {
    props: {
      facets: {
        tags: ["pinia", "vue"],
        weeks: [["2026-W29", "2026 W29"]],
      },
      q: "",
      selectedCategories: [],
      tag: "",
      week: "",
      groupBy: "none",
    },
  })
}

describe("ExplorerControls", () => {
  it("keeps advanced filters collapsed by default", () => {
    const wrapper = mountControls()

    expect(wrapper.get("#toggle-filters").attributes("aria-expanded")).toBe("false")
    expect(wrapper.get("#filters-panel").attributes()).toHaveProperty("inert")
  })

  it("opens when URL-backed view state becomes active", async () => {
    const wrapper = mountControls()

    await wrapper.setProps({ tag: "vue" })

    expect(wrapper.get("#toggle-filters").attributes("aria-expanded")).toBe("true")
    expect(wrapper.get("#filters-panel").attributes("aria-hidden")).toBe("false")
  })

  it("emits user intents without owning explorer state", async () => {
    const wrapper = mountControls()

    await wrapper.get("#q").setValue("pinia")
    await wrapper.get("#toggle-filters").trigger("click")
    await wrapper.get("#tag").setValue("vue")
    await wrapper.get("#groupBy").setValue("category")
    await wrapper.findAll(".category-button")[0]?.trigger("click")

    expect(wrapper.emitted("queryChange")?.[0]).toEqual(["pinia"])
    expect(wrapper.emitted("tagChange")?.[0]).toEqual(["vue"])
    expect(wrapper.emitted("groupChange")?.[0]).toEqual(["category"])
    expect(wrapper.emitted("categoryToggle")?.[0]).toEqual(["Frontend"])
  })
})
