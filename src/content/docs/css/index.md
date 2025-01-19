---
title: CSS
description: Explore essential CSS resources, from layout techniques to modern features and performance tips.
---

- [What you need to know about modern CSS](https://frontendmasters.com/blog/what-you-need-to-know-about-modern-css-spring-2024-edition/)
- [The Undeniable Utility Of CSS :has](https://www.joshwcomeau.com/css/has/)
- [@property: Next-gen CSS variables now with universal browser support](https://web.dev/blog/at-property-baseline)
- [Animated multiline link underlines](https://dannyguo.medium.com/animated-multiline-link-underlines-with-css-abe07f3d6aee): Like used here on this site together with [automatic heading anchor links](/blog/software/astro/).
- [Drawing made in pure CSS](https://github.com/cyanharlow/purecss-francine)

## New and old pseudo selectors

[List of all pseudo selectors on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)

| Pseudo selectors                                                                    | Explanation                                                                                                       | Can I Use                                                            |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [`:is()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:is)                     | Takes a list of selectors and applies the styles to any element matching one or more of the selectors.            | [caniuse: :is()](https://caniuse.com/css-matches-pseudo)             |
| [`:where()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:where)               | Similarly to `:is()`, but with zero specificity.                                                                  | [caniuse: :where()](https://caniuse.com/mdn-css_selectors_where)     |
| [`:not()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:not)                   | Excludes elements that match a specified selector.                                                                | [caniuse: :not()](https://caniuse.com/mdn-css_selectors_not)         |
| [`:has()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)                   | Parent selector that matches based on child elements.                                                             | [caniuse: :has()](https://caniuse.com/css-has)                       |
| [`:empty`](https://developer.mozilla.org/en-US/docs/Web/CSS/:empty)                 | Targets elements that do not have any children, including text nodes.                                             | [caniuse: :empty](https://caniuse.com/mdn-css_selectors_empty)       |
| [`:focus-visible`](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible) | Applies styles to elements when they gain focus, but only if the focus was visible like with keyboard navigation. | [caniuse: :focus-visible](https://caniuse.com/css-focus-visible)     |
| [`:focus-within`](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-within)   | Applies styles to an element if any of its descendants have focus.                                                | [caniuse: :focus-within](https://caniuse.com/css-focus-within)       |
| [`::backdrop`](https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop)         | Allows styling the background layer of elements like `<dialog>` or fullscreen elements.                           | [caniuse: :backdrop](https://caniuse.com/mdn-css_selectors_backdrop) |
