# Responsive Rendering

Use CSS for presentation. Use JavaScript breakpoints only when the hidden branch
would still do meaningful work.

## Default: Tailwind Responsive Classes

Use Tailwind breakpoint utilities for visual differences:

- layout, spacing, alignment, sizing, and order changes
- showing or hiding lightweight markup
- swapping text alignment, columns, grids, or navigation placement
- preserving semantic content for SEO and accessibility

Tailwind classes such as `hidden`, `md:block`, `lg:grid`, and `xl:flex` are the
right default because they keep the implementation simple and avoid client-only
rendering decisions.

```tsx
<div className="hidden lg:grid lg:grid-cols-3">
	<FeatureCards />
</div>
```

This hides the element visually below `lg`, but React still renders and hydrates
the subtree.

## Use `useTailwindBreakpoints` For Expensive Branches

Use `useTailwindBreakpoints` when a hidden responsive branch would still mount
expensive React work:

- animation scenes, parallax, marquee loops, or scroll observers
- canvas, WebGL, Rive, video, or media-heavy visuals
- duplicated decorative DOM used only to fill a viewport
- browser-only measurements or resize-dependent setup
- components that register listeners, observers, timers, or motion values

```tsx
const isXlUp = useIsXlUp();

return (
	<section>
		{isXlUp ? <DesktopAnimationScene /> : null}
		<MobileContent />
	</section>
);
```

This prevents the expensive branch from existing on smaller screens instead of
only hiding it.

## Caveats

- `useTailwindBreakpoints` is client-only and must be used inside client
  components.
- Breakpoint values are false before the first client effect, so gated content
  can be absent on the initial render.
- Do not gate SEO-critical content, primary page copy, headings, or essential
  accessibility affordances behind client-only breakpoint checks.
- Prefer Tailwind when the branch is lightweight or when first-render stability
  matters more than avoiding hidden work.

## Rule Of Thumb

CSS controls how things look at each breakpoint. JavaScript controls whether
expensive work exists at all.
