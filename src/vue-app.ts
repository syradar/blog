import { createPinia } from "pinia"
import type { App } from "vue"

const pinia = createPinia()

export default function setup(app: App): void {
  app.use(pinia)
}
