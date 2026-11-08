# Specification: Buttons family

**Spec path**: `specs/platform/design-system/families/buttons`

**Created**: 2026-11-08 (new)

**Status**: Accepted, living. The default morph is built in this batch; see `tasks.md`.

**Builds on**: `specs/platform/design-system/motion` (B1, B2, T1, I1), `specs/platform/design-system/families/presence`

**Verified by**: the Storybook stories listed under "Proof"

## Purpose

One `Button` owns every clickable action and button-like link: its variant, size, icons, loading state and, from this batch, its label and width morph. Callers never animate a button's parts.

## Clarifications

### Session 2026-11-08

- **Q: Do buttons morph by default?**
  - A: Yes. When string `children` change, the label renders through `MorphLabel` and the width eases on the disclosure spring. `morph={false}` opts out. Loading keeps today's fixed-width crossfade to the spinner (BT3).

### Session 2026-11-08 (AGENTS.md thinning)

- **Q: Which rules moved here when the `AGENTS.md` files were thinned?**
  - A: Behaviour rules from `plugins/averlo/README.md` (origin/main `3fd01907`) with no other spec home. Bare treatment is BT7. BT4 now also says no detached loading label, so only the clicked action shows loading.

## API and defaults

| Prop | Values | Default |
|---|---|---|
| `variant` | `primary`, `secondary`, `ghost`, `bare`, `link`, `inverse` | `secondary` |
| `tone` | `default`, `danger`, `warning` | `default` |
| `size` | `none`, `xxs`, `xs`, `compact`, `sm`, `md`, `lg`, `xl`, `chip`, `icon`, `icon-sm` | `md` |
| `shape` | `standard`, `round`, `square` | `standard` |
| `radius` | `pill`, `sm` | per size |
| `align` | `left`, `center`, `between` | `center` |
| `hitArea` | `none`, `touch` | `none` |
| `leadingIcon`, `trailingIcon`, `iconSize` | icon props | none |
| `loading` | boolean | undefined (no loading slot) |
| `href` | renders an anchor with button styling | none |
| `morph` (this batch) | boolean | `true` |
| `Button.Skeleton` | same geometry props | matches live geometry |

Related owners: `ArrowAction` (arrow call-to-action), `useCopyAction` (copy with feedback).

## Requirements

- **BT1 MUST: one owner.** Actions and button-like links use `Button` (or `buttonStyles` inside an owner that cannot render `Button`). No page-local button styling.
- **BT2 MUST: no new variants or sizes without a stated reason** (motion B2, usage FR-008).
- **BT3 MUST: buttons morph between states.** String-child changes render through `MorphLabel` and the width eases; icon changes go through `IconSwap`. The button keeps its place. `morph={false}` opts out for fixed-width layouts. `loading` keeps its dimensions and accessible label, crossfading the content to the spinner. No ternary between two `<Button>`s and no width-animating wrapper.
- **BT4 MUST: pending state belongs to the activated action.** `loading` sets `aria-busy` and disables the button; conflicting siblings are unavailable without their own spinners or a detached loading label (`specs/platform/data/actions` FR-001, `specs/platform/data/forms` FR-003).
- **BT5 MUST: snaps when motion is off.** Morph and crossfade snap under reduced motion and `?motion=off`.
- **BT6 MUST: skeleton parity.** `Button.Skeleton` matches the live geometry for every size.
- **BT7 MUST: bare where hover stays transparent.** Disclosure arrows, contextual ellipsis triggers and copy controls use the `bare` treatment and stay transparent on hover.

## Proof

| Rule | Story (`UI/Primitives/Button` export) | Status |
|---|---|---|
| BT1, BT2 | `ActionHierarchy`, `DestructiveMeaning`, `SizesAndIcons`, `CompletePalette`, `ButtonLikeLink` | exists |
| BT3 | a label-change morph story with a play test that no glyph is outside the box and width settles to the new label; `morph={false}` story | this batch |
| BT4 | `AsyncStateParity`, `DisabledAndLoading`, `InteractionContract` | exists |
| BT5 | morph story under `?motion=off` | this batch |
| BT6 | `GeometryAndSkeletons`, `TransparentSkeletons` | exists |
