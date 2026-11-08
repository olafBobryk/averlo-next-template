# Specification: Scroll containers

**Spec path**: `specs/platform/design-system/scroll`

**Created**: 2026-11-08 (new; rules ported from a product site's scroll-container rules, rules only)

**Status**: Accepted, living. `ScrollArea` is built in this batch; see `tasks.md`.

**Builds on**: `specs/platform/design-system/usage`, `specs/platform/design-system/motion`

**Verified by**: `UI/Misc/ScrollArea` Storybook play tests (this batch), [docs/operations/scroll-performance.md](../../../../docs/operations/scroll-performance.md)

## Purpose

Inner scrollers run to their real visible edge, fade content under that edge, contain overscroll and never shift layout. One owner, `ScrollArea`, does all of it, so no feature code hand-rolls overflow, masks or scroll borders. This spec also holds the design-system exceptions register.

## Clarifications

### Session 2026-11-08

- **Q: CSS utilities or a component?**
  - A: One `ScrollArea` component (`ui/misc/ScrollArea.tsx`) (S8).
- **Q: What happens to `ScrollBorders`?**
  - A: `ScrollArea` absorbs it as `edgeStyle="border"`, keeping its behaviour but drawing the rule without changing layout; `ScrollBorders` retires and its users migrate (S8b).
- **Q: Which product-site rules stay out?**
  - A: The menu-search result cap and the pricing-carousel exception are product decisions and stay with that product. The rules below are generic.
- **Q: Scrollbar colours?**
  - A: From theme tokens; hidden only on carousels and tab rows (S13).

## Requirements

Rule IDs are stable and are cited by tests and lint rules.

- **S1 MUST: an inner scroller runs to the next visible edge.** On each side, every gap up to that edge becomes the scroller's own padding. Nothing sits between the scroller and the edge: no flex `gap`, margin or container padding. Content at rest sits where it did before.
- **S2 MUST: know what an edge is.** An edge is a container's stroke, a sibling's visible surface (a fill, stroke or glass: a search field, a divider, a sticky bar), or a control that stays put. Plain headings are content and scroll inside.
- **S3 MUST: the two sides can differ.** `edgeStart`/`edgeEnd`, or `edge` for both. Each value is the gap that side absorbs: the surface's own padding or the gap to the edge. There is no global default and no new token.
- **S4 MUST: the rule covers inner scrollers only.** It applies to scrollers inside a card, modal, menu, popover or overlay. Page-level content scrolls with the page and has no mask; page carousels follow S11.
- **S5 MUST: never a gap outside.** No positive margin on the scroll axis; a negative margin may reach over a container's padding. A `gap` beside the scroller becomes its padding.
- **S6 MUST: the rule holds at every height.** The scroller runs edge to edge before it overflows too. Check at rest, with one item, at max height, and at both ends.
- **S7 MUST: by default, content fades under the edge.** A mask gradient over exactly that side's padding, shown only while content is hidden past that edge. Content at rest is never faded.
- **S8 MUST: `ScrollArea` is the only way.** Every inner scroller is a `ScrollArea` (`ui/misc/ScrollArea.tsx`). It owns the axis (`axis="y" | "x"`), the edge padding it absorbs (`edge`, `edgeStart`, `edgeEnd`) with a mask of the same size, the edge treatment (`edgeStyle="fade" | "border"`), overscroll containment (S12), the scrollbar treatment (`scrollbar="auto" | "hidden"`, S13) and the optional back-to-top control (`showBackToTop`). A surface with its own border or fill (menu, popover, listbox, modal panel, pill track, `pre`) stays fixed and puts a `ScrollArea` inside it, so the fade never touches the border or fill. No feature code sets `overflow-*-auto` or `overflow-*-scroll`; lint flags new ones.
- **S8b MUST: `ScrollArea` absorbs `ScrollBorders`.** `edgeStyle="border"` shows an inset rule at a side only while content is hidden past that side, drawn as an overlay (pseudo-element or inset shadow) so it never changes the box or shifts layout. `ScrollBorders` retires as a separate component.
- **S9 MUST: know the mask's limits.** The mask is not motion, so reduced motion changes nothing. Print removes it. A child that paints into the padding at rest, such as a focus ring, needs room inside the content. A mask removes the backdrop blur of glass inside it (motion U9).
- **S10 SHOULD: a scrolling tab row keeps the active item in view,** with the indicator inside the scroller.
- **S11 MUST: page-level carousels bleed.** A horizontal carousel in page content runs to the viewport edge; the page gutter becomes its padding with matching `scroll-padding` so snap lines up with the gutter; the next card peeks; horizontal overscroll is contained; no fade (S4); the scrollbar is hidden.
- **S12 MUST: inner scrollers contain overscroll.** `ScrollArea` sets `overscroll-contain` on its axis.
- **S13 MUST: scrollbars take their colours from theme tokens.** Scrollbars are hidden only on carousels (S11) and tab rows (S10), through `scrollbar="hidden"`.

## Exceptions register

This is the one register for the design-system specs (`usage`, `motion`, `scroll`, `families/*`). Any place that knowingly breaks a MUST or SHOULD in them is listed here with a stable ID (`E-001`, `E-002`, …). Each row gives:

- the rule it breaks;
- exactly where (file and component);
- why;
- who decided, and when;
- the condition under which it is revisited.

An exception exists only once it has a row. The code carries `// spec exception E-00N` at the exempted line, and any lint ignore cites the same ID (`// biome-ignore lint/plugin/<rule>: E-00N`). An existing violation still to migrate is tagged `debt` instead (`// biome-ignore lint/plugin/<rule>: debt`); `debt` may only shrink. IDs are never reused. Deleting the code, or the revisit condition coming true, removes the row.

| ID | Rule broken | Where | Why | Decided by / when | Revisit when |
|---|---|---|---|---|---|

The register starts empty in the template. A generated project keeps its own register.

## Success Criteria

- **SC-001**: Every inner scroller in `src/` is a `ScrollArea`; lint reports no new `overflow-*-auto|scroll` outside it.
- **SC-002**: `ScrollArea` stories prove S1, S6, S7, S8b and S12 with play tests at 390 and 1440: the edge rule never shifts layout (box size identical with and without overflow), the mask appears only while content is hidden past an edge, and print styles remove it.
- **SC-003**: No `ScrollBorders` import remains.
