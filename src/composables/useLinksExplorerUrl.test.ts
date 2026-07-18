// @vitest-environment jsdom

import { createPinia, setActivePinia } from "pinia"
import { defineComponent } from "vue"
import { mount } from "@vue/test-utils"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createLinksExplorerUrl, useLinksExplorerUrlSync } from "./useLinksExplorerUrl"
import { useLinksExplorerStore } from "../stores/links-explorer"

describe("Links Explorer URL synchronization", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.history.replaceState(null, "", "/blog/links/")
  })

  it("serializes only shareable view state", () => {
    const store = useLinksExplorerStore()
    store.setQuery("vue state")
    store.toggleCategory("Frontend")
    store.setTag("pinia")
    store.setWeek("2026-W29")
    store.setGroupBy("tag")
    store.toggleSection("pinia")

    expect(createLinksExplorerUrl(store.getFilters(), store.groupBy, window.location)).toBe(
      "/blog/links/?q=vue+state&category=Frontend&tag=pinia&week=2026-W29&group=tag",
    )
  })

  it("replaces search history, pushes discrete changes, and handles popstate", async () => {
    const store = useLinksExplorerStore()
    const applyFilters = vi.spyOn(store, "applyFilters").mockResolvedValue()
    const pushState = vi.spyOn(window.history, "pushState")
    const replaceState = vi.spyOn(window.history, "replaceState")
    const wrapper = mount(
      defineComponent({
        setup() {
          useLinksExplorerUrlSync()
          return () => null
        },
      }),
    )

    store.setQuery("pinia")
    await vi.waitFor(() => expect(applyFilters).toHaveBeenCalledTimes(1))
    expect(replaceState).toHaveBeenLastCalledWith(null, "", "/blog/links/?q=pinia")

    store.setGroupBy("category")
    await vi.waitFor(() => expect(applyFilters).toHaveBeenCalledTimes(2))
    expect(pushState).toHaveBeenLastCalledWith(null, "", "/blog/links/?q=pinia&group=category")

    store.resetFilters()
    await vi.waitFor(() => expect(applyFilters).toHaveBeenCalledTimes(3))
    expect(pushState).toHaveBeenLastCalledWith(null, "", "/blog/links/")

    window.history.pushState(null, "", "/blog/links/?tag=vue&group=tag")
    window.dispatchEvent(new PopStateEvent("popstate"))
    await vi.waitFor(() => expect(applyFilters).toHaveBeenCalledTimes(4))
    expect(store.tag).toBe("vue")
    expect(store.groupBy).toBe("tag")

    wrapper.unmount()
  })
})
