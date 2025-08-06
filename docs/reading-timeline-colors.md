# Reading Timeline Palette

The `ReadingTimeline` component uses the accessible `schemeTableau10` palette from
[d3-scale-chromatic](https://github.com/d3/d3-scale-chromatic). The palette provides ten
color-blind friendly hues which are assigned to book titles in the order they appear.
If more than ten titles are supplied, the colors repeat.

For additional accessibility the component exposes a `colorBlindFriendly` prop. When enabled,
legend swatches receive alternating stripe patterns to help distinguish titles even when colors
repeat or are hard to perceive. Use it like:

```jsx
<ReadingTimeline sessions={sessions} colorBlindFriendly />
```

Patterns are implemented with CSS `repeating-linear-gradient` backgrounds and cycle through a
set of diagonal and horizontal stripes.
