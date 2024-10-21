---
title: Exciting CSS updates since 2020
description: An overview of modern CSS added from 2020 onwards, including nesting, layers and more.
sidebar:
  label: Updates since 2020
---

## Colors

### OKLAB and OKLCH

> Use OKLCH, it has nicer colors and beautiful gradients.

`oklch()` is a new way to define CSS colors. In oklch(L C H ) or oklch(L C H / a), each item corresponds as follows:

- `L` is perceived lightness (0%-100%). “Perceived” means that it has consistent lightness for our eyes, unlike L in hsl().
- `C` is chroma, from gray to the most saturated color.
- `H` is the hue angle (0-360).
- `a` is opacity (0-1 or 0-100%).

#### Documentation on OKLCH

- [OKLCH Color Picker & Converter](https://oklch.com/#70,0.1,296,100)
- [OKLCH in CSS: why we moved from RGB and HSL](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl): By Evil Martians.
- [LCH is the best color space!](https://atmos.style/blog/lch-color-space): By Atmos.
- [Falling For Oklch: A Love Story Of Color Spaces](https://www.smashingmagazine.com/2023/08/oklch-color-spaces-gamuts-css/), Gamuts, And CSS: By Smashing Magazine.
- [oklch() on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch)
- [oklab() on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklab)
- [A perceptual color space for image processing](https://bottosson.github.io/posts/oklab/): By the creator of OKLAB, Björn Ottosson.
- [caniuse: oklch()](https://caniuse.com/mdn-css_types_color_oklch)

### New color functions

- [color-mix() on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix): "Takes two color values and returns the result of mixing them in a given colorspace by a given amount."
- [color() on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color): "Allows a color to be specified in a particular, specified color space rather than the implicit sRGB color space."

## text-wrap: balance

> Text is wrapped in a way that best balances the number of characters on each line, enhancing layout quality and legibility.

- [text-wrap: balance](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap#balance)

## Cascade Layers

Cascade layers allow controlling the specificity and order of rule sets across stylesheets.

- [@layer on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- [Cascade Layers on CSS Tricks](https://css-tricks.com/css-cascade-layers/)
- [Getting Started With CSS Cascade Layers](https://www.smashingmagazine.com/2022/01/introduction-css-cascade-layers/)
- [Hello, CSS Cascade Layers](https://ishadeed.com/article/cascade-layers/): By Ahmad Shadeed.
- [caniuse: Cascade Layers](https://caniuse.com/css-cascade-layers)

## CSS Subgrid

CSS subgrid allows a child grid to inherit the column and row definitions of its parent grid, making it easier to align nested grid items consistently with the parent layout. It helps maintain a cohesive design structure without redefining grid tracks in the child elements.

- [Subgrid on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid)
- [CSS subgrid](https://web.dev/articles/css-subgrid): By web.dev.
- [caniuse: CSS Subgrid](https://caniuse.com/css-subgrid)

Related 📚 [CSS Grid on this blog](/blog/css/layout/#css-grid)

## CSS Nesting

> One of our favorite CSS preprocessor features is now built into the language: nesting style rules.

- [Using CSS nesting on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting)
- [CSS Nesting](https://developer.chrome.com/docs/css-ui/css-nesting): By the Chrome team.
- [Nesting selector on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Nesting_selector)
- [Nesting Layers](https://www.builder.io/blog/css-2024-nesting-layers-container-queries): By builder.io.
- [caniuse: CSS Nesting](https://caniuse.com/css-nesting)

## CSS Masking and Clipping

Both are used to hide parts of elements and show other parts.

> Masks are images; Clips are paths.

- [Clipping and Masking in CSS](https://css-tricks.com/clipping-masking-css/): By CSS Tricks.
- [CSS Masking Module Level 1](https://www.w3.org/TR/css-masking-1/?spm=a2c65.11461447.0.0.31375290nsms75)

<!-- 
## Logical properties

Block-start, block-end, inline-start, inline-end
Logical properties and values use the abstract terms block and inline to describe the direction in which they flow. The physical meaning of these terms depends on the writing mode.

<https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values>

## Hex with alpha

# RRGGBBAA - specify alpha in 8 digit 'hex' mode

color: #ff0000cc;

<https://developer.mozilla.org/en-US/docs/Web/CSS/hex-color>

## More math functions

- min()
- max()
- clamp()
- sin()
- cos()

<https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Functions/Using_CSS_math_functions>

## aspect-ratio

<https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio>

## Container Queries

<https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries>

## Scroll snap

<https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap>

## New Viewport Units

- Small viewport (svh/svw) : takes the address bar and the toolbar into consideration
- Large viewport (lvh/lvw) : doesn’t take the address bar and the toolbar into consideration
- Dynamic viewport (dvh/dvw) : adapts its value when the toolbars are visible or/and when they are not.

<https://web.dev/blog/viewport-units>

## Accent-color Property

<https://developer.mozilla.org/en-US/docs/Web/CSS/accent-color>

## nth-of syntax

<https://developer.chrome.com/docs/css-ui/css-nth-child-of-s>

 -->