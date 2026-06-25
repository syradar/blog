import { OGImageRoute } from "astro-og-canvas"

import { getOgPages } from "../../lib/og"

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages: await getOgPages(),
  getImageOptions: (_, page) => ({
    title: page.title,
    description: page.imageDescription,
    fonts: ["./src/assets/fonts/MonaSansVF.ttf"],
    bgGradient: [
      [15, 23, 42],
      [30, 41, 59],
      [71, 85, 105],
    ],
    border: {
      color: [148, 163, 184],
      width: 14,
      side: "block-end",
    },
    font: {
      title: {
        families: ["Mona Sans VF"],
        size: 76,
        lineHeight: 1.1,
        weight: "Bold",
      },
      description: {
        families: ["Mona Sans VF"],
        size: 34,
        lineHeight: 1.35,
        color: [226, 232, 240],
      },
    },
  }),
})
