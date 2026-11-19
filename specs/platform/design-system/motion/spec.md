# Specification: Motion and responsive rendering

**Spec path**: `specs/platform/design-system/motion`

**Status**: Accepted, living. Parts are built in this batch; see `tasks.md`.

**Builds on**: `specs/platform/design-system/usage`, `specs/platform/design-system/families/presence`, `specs/platform/design-system/families/buttons`, `specs/platform/data/loading`

**Verified by**: [docs/testing/interactions.md](../../../../docs/testing/interactions.md), `docs/operations/scroll-performance.md` when installed, and the Storybook play tests named per rule

## Purpose

Preserve essential content and user agency across viewport changes, motion preferences and animation fallback while avoiding unnecessary hidden expensive work. Every visible state change moves through one owner, on shared tokens, and snaps when motion is off.

This spec covers state-driven motion (presence, size, text, icon, button, loading). Scroll-driven and entrance choreography stays with the `ui/motion` source, effect and scheduler owners (FR-004).

## Clarifications

### Session 2026-11-08

- **Q: Which product-site rules come into the template?**
  - A: The universal (U), size (H), text (T), icon (I), button (B), loading (L) and responsive (R) rules, made generic. Form rules moved to `specs/platform/design-system/families/inputs` and popover rules to `.../families/overlays`. Booking and branding cases, site paths, exceptions and all values stay out; only rules are ported (constitution V).
- **Q: Which owner animates height in the template?**
  - A: The existing presence family (`ContentPresence`, private `DisclosurePresence`), not a new `Collapse`. It gains `mode`: the existing masked default and `sequenced` (H1).
- **Q: Do buttons morph by default?**
  - A: Yes. String-child changes render through `MorphLabel` and the width eases; `morph={false}` opts out. Loading keeps its fixed-width crossfade (B1).
- **Q: How does MorphLabel move?**
  - A: Sequenced, and no visible glyph is ever outside the box. Grow: width leads and the new text fades in once it fits. Shrink: the old text fades out first, then the width closes and the new text fades in. y ±0.4em with a 3px blur. IconSwap stays scale plus fade with no blur (T1, I1).
- **Q: Where do the token values live?**
  - A: Tokens are named by character, not by implementation: `snap`, `quick`, `smooth`, `gentle`, `slow`. They are retuned from first principles, with no values taken from other repos. Rules here name a step, never a number. Which UI uses which step is set by this spec, so all overlays stay consistent while a tooltip uses a smaller step (token table).
- **Q: Do small messages animate height and fade at once?**
  - A: No. With overflow visible, the text overlapped the next field mid-motion. Olaf chose "fade waits until it fits": the box grows first, the text fades in once there is room, and it is never clipped and never overlaps. `together` was dropped, so field messages use `sequenced` (H1).
- **Q: Spring or ease?**
  - A: Springs are the model (Olaf: "modeled by the real world"). Every JS-driven animation uses its step's spring; duration plus ease is only the matched CSS fallback where no JS runs (U5).
- **Q: Do section reveals use a duration?**
  - A: No. Section reveals (hero text, status page content, footer) are scroll-scrubbed: they follow scroll progress, reverse when scrolling back and have no duration. `slow` is used only for the at-load catch-up intro (FR-013) and for reveals with no scroll position, such as modal content (`reveal` source). Olaf chose to extend `MotionSource` rather than add a separate reveal facade or a marketing scroll-mode switch.
- **Q: What happens to a scroll reveal already on screen when the page loads?**
  - A: It catches up to its current scroll-progress state with a timed intro and stops exactly there: an item 50% through its range animates from 0 to 50%, never beyond and never below, then follows scroll. If scroll changes during the intro, it lands on the live progress (FR-013).
- **Q: Do scroll Sequence items move at a constant rate?**
  - A: No. With a linear slice per item, the hero headline, text and call to action each slid at constant speed, 0.18 s apart, which Olaf found awkward. Olaf chose "eased, tighter stagger": each item eases within its slice on the `slow` curve, during both the catch-up intro and the scroll scrub, while the Sequence clock stays linear. The hero's lines start 0.06 s apart; the 0.18 s default stays for other Sequences (FR-006, FR-013).

### Session 2026-11-19 (scroll reveals: intro × reach)

- **Context.** The product site found three bugs that the template's scroll reveals share:
  - content reached only at the max scroll never fully revealed;
  - content on screen at load ran on separate clocks and stopped part-way, because the catch-up intro was capped by scroll progress;
  - a page's first content never transitioned in.
  Olaf fixed them on the product site with one always-live formula and asked for this backport. The 2026-11-08 answers on the catch-up intro and the linear Sequence slices are replaced. Their "eased" choice stays: each term eases on `slow`.
- **Q: Content you can reach only at the very bottom?**
  - A: it finishes at the max scroll. The reveal keeps its usual scrub length, shifted to end at the max scroll (V2).
- **Q: Content on screen at load?**
  - A: it plays one sequence in reading order and ends fully revealed (V3).
- **Q: A latch once the load sequence is done?**
  - A: "dont like the idea that there is a switch. should be a equation based both systems live all the time". This gives `reveal = intro(t) × reach(y)` (V1).
- **Q: Which items join the load sequence?**
  - A: items whose top is above the 95% line at entry (V3).
- **Q: Cards stacked in one column on phones?**
  - A: include them: each card reveals from its own position (V2).
- **Q: Dividers?**
  - A: a section's top rule draws in first, before its heading (V4).
- **Q: A reload from mid-page?**
  - A: leave it as is. Content above where the browser restores you shows final (V3).
- **Q: Nested reveal items?**
  - A: they share their parent's slot (V3).
- **Q: How does it land in the template (backport)?**
  - A: inside `MotionSource`: `Sequence mode="scroll"` and `MotionSource.Item` are rebuilt on `intro × reach`. There is still no separate reveal facade and no marketing scroll-mode switch. The scroll strategy's catch-up intro is removed (FR-006, FR-013).
- **Q: Entry timing in the template?**
  - A: each item's entrance plays over `slow`, eased on `slow`. The step to the next item is its Sequence's `stagger` (the hero's 0.06 s, otherwise 0.18 s), and 0.18 s between Sequences (V3).
- **Q: The footer's own offset?**
  - A: drop it; V2 finishes the footer at the max scroll. The footer's static top border becomes the drawn divider, first in its Sequence (V4).

### Session 2026-11-09 (animate skill retired)

- **Q: What replaces the retired `$averlo:animate` skill?**
  - A: Nothing separate. Olaf: the skills "never worked" and forced too much. A composed surface takes its motion from this spec's "Which UI uses which step" usage map while it is built. The still-valid animate rules are FR-014 (settled motion equals the motion-off render) and FR-015 (reuse an approved composition before adding choreography). Motion theses, endpoint-parity packets and backport-candidate tagging were dropped.

## Requirements

Rule IDs (U0, H1, …) are stable and are cited by tests and lint rules. Each rule names its one owner.

### Responsive and motion ownership (migrated)

### FR-001: Essential content survives responsive rendering

Primary copy, headings, navigation, essential controls and accessibility affordances MUST remain available across supported viewport sizes and initial rendering. Responsive presentation MUST NOT require a client-only breakpoint decision before essential content exists.

**Scenario: Initial compact render**

- **When** a compact page initially renders before client breakpoint state resolves
- **Then** primary content and essential accessible controls are already present and usable

### FR-002: Expensive hidden branches are bounded

Responsive implementations MUST avoid mounting hidden expensive observers, media, canvas or duplicated decorative work when a deliberate branch can avoid that cost without withholding essential content. Lightweight layout and visibility changes MUST preserve one coherent content model.

**Scenario: Expensive desktop decoration on a phone**

- **When** the compact presentation excludes an expensive decorative branch
- **Then** that work is not unnecessarily activated and essential content remains available

### FR-003: Motion does not gate agency

Reduced motion, motion-off and animation fallback MUST leave content readable and real controls focusable and operable. Motion or conditional presence MUST preserve control semantics, announcements and focus responsibilities with their interaction owners.

**Scenario: Reduced motion during conditional content**

- **When** a user requests reduced motion while conditional content appears or disappears
- **Then** the content settles readably and its controls remain usable without requiring animation completion

### FR-004: Motion has coherent ownership

Coordinated motion MUST preserve a clear activation/progress owner and effect mapping without competing scheduling or reset behavior. Supported interruption, re-entry, resize and compact states MUST settle into usable content according to the owning motion contract.

**Scenario: Resize during playback**

- **When** the viewport changes or playback is interrupted
- **Then** content and controls remain usable and competing animation/reset owners do not leave the surface stuck

### Drivers, schedulers and owners

### FR-005: One driver choice, made centrally

Hybrid MUST be the default driver and Motion the maintained fallback; effects and product call sites never select drivers. In hybrid, GSAP drives reveal, in-view and scroll-linked progress and Motion drives direct interaction sources (hover, boolean state). Effects stay driver-agnostic on the shared scalar progress contract.

### FR-006: One scheduler; sources own reveal

There MUST be one global scheduler (the site `MotionProvider`), with no page-local or nested global schedulers. `MotionSource.Sequence` enters its nearest scheduler once and owns relative descendant reveal batching. Viewport re-entry reset is owned by the scheduler and source through shared progress; effects never install reveal observers or reset themselves. `MotionSource.Sequence mode="scroll"` instead owns its items' scroll reveals and does not enter the scheduler: each `MotionSource.Item` shows `ease_slow(intro) × ease_slow(reach)` (V1–V3). `intro` comes from the one page-wide entry sequence (`source/entrySequence.ts`), and `reach` from the Sequence's measured item positions (`source/scrollReach.ts`). Both read the window scroll position directly rather than through a driver; the entry intro plays on the driver's progress clock (GSAP in hybrid). A call site may tighten `stagger` for lines read as one block.

### FR-007: `CounterpartReveal` ownership

`CounterpartReveal` MUST own coincident base and counterpart geometry, decorative duplicate semantics, measured anchor alignment and reversible mask selection. Callers own the two treatments, the marked anchor and a declarative circle, swipe or grid strategy; strategies never own content.

### FR-008: Motion wrappers keep the real owner

Interaction wrappers MUST preserve the real owner and never create duplicate focus stops; the `owner-hover` owner keeps semantics, accessible naming and visible focus. Decorative `ArrowAction` instances never enter the accessibility tree. Labeled divider content is never scaled.

### FR-009: CSS interactions stay CSS

Ordinary CSS interactions MUST NOT take a `motion/react` dependency just to use a spring; they use their step's CSS fallback (U5). Transitions and springs keep their token mapping, with no hardcoded page-local timing systems (U1).

### FR-010: Theme switching is atomic

Theme switching MUST be an atomic two-frame CSS-transition transaction. It never stops, restarts or remounts animations, loaders or motion timelines.

### FR-011: Surface tints are preserved

Surface tint recipes MUST preserve their interpolation space, tint strength and underlying surface, including inherited `--ui-surface-color` ownership.

### FR-012: Memoization needs a reason

Motion code SHOULD memoize only for correctness or a measured performance benefit.

### FR-013: Scroll reveals finish

A scroll reveal MUST follow V1–V3. Content on screen at entry plays the entry sequence and ends fully revealed. Every other item scrubs from its own position and finishes by the max scroll at the latest. `ready={false}` holds a Sequence hidden, and a Sequence that persists across client navigation (the footer) joins the new route's entry sequence. Reduced motion and `?motion=off` render every item fully shown (V5). Scroll sources that are not reveals (parallax, text shift) render their current pose at once, with no intro. The 2026-11-08 catch-up intro, which scaled live scroll progress, is retired.

**Scenario: On screen at load**

- **When** a Sequence's items are above the 95% line as the page loads
- **Then** they play in reading order, each over `slow`, `stagger` apart, and end fully revealed without any scrolling

**Scenario: The page ends first**

- **When** an item's usual end line lies past the max scroll
- **Then** its Sequence shifts earlier by one shared amount, so the item finishes exactly at the max scroll with its usual scrub length

Verified by the `ScrollRevealScrub`, `ScrollRevealEntrySequence`, `ScrollRevealEntryNeverFadesBack`, `ScrollRevealFinishesAtMaxScroll`, `ScrollSequenceStacked`, `ScrollSequenceRowStagger` and `ScrollRevealMotionOff` MotionSource stories (the scrub and entry sequence in both drivers), and by `source/scrollReach.test.ts` (`npm run test:motion`).

### FR-014: Settled motion equals the motion-off render

Motion MUST NOT change a surface's resting state: the settled motion-on render, the reduced-motion render and the `?motion=off` render of a surface are the same. A composed surface is compared with its source at `?motion=off`.

### FR-015: Reuse approved choreography first

A surface's motion MUST reuse an existing Storybook composition whose `parameters.motionComposition` is `status: "approved"` when its static hierarchy, roles and order match, and otherwise the smallest set of existing `MotionSource`/`MotionEffect` owners. New coordinated choreography is a new item under `specs/platform/design-system/usage` FR-022; no local scheduler, observer, reset system or timing family is added (FR-006).

### U: Universal

- **U0 MUST: every visible change is animated.** Presence, size, position, text, icon, colour, and loading-to-loaded changes move. A change snaps only under U3 or on first paint (U4). Entrances follow V.
- **U1 MUST: tokens, never literals.** Durations, easings and springs come from `ui/foundations/motionTiming.ts`, `spring.ts` and the `motion-*` CSS classes and variables. Feature code names a step; literal durations, easings and springs outside the token files fail lint (`tasks.md`).
- **U2 MUST: reuse the owners in `specs/platform/design-system/usage`.** A new variant, size, component or icon is listed in its PR with a reason (constitution III).
- **U3 MUST: reduced motion animates nothing, fades included.**
  - JS gate: `useAnimated()`, a thin wrapper that is exactly `useMotionAllowed(true) && !useMotionDisableOverride()` with no new logic. New code uses it; existing inline gates are equivalent.
  - CSS gate: `@media (prefers-reduced-motion: reduce)` plus `html[data-motion-override="off"]`.
  - Reveal and source code keeps its own gate, because it also reads the reveal root.
  - The owner gates itself; callers never pass a "no transition" class to make an owner snap.
- **U4 MUST: no motion on first paint or on restore for state.** `AnimatePresence initial={false}`; restored drafts, server values and UI state render final.
  - Entrance choreography is the one exception, and V3 owns it: on a load, content on screen plays the entry sequence. Content above a restored scroll position renders final.
- **U5 MUST: springs first.** Every JS-driven animation (size, position, scale, presence and opacity) uses its step's spring. A step's duration and ease are its matched CSS fallback, used only where no JS runs (hover, press, focus, colour).
- **U6 MUST: one owner per animated element.** A component animates its own parts and callers do not animate the same property (`Button` owns its label, icon and width).
- **U7 MUST: interrupt and retarget, never queue.** A new change retargets from the on-screen value. Presence `sequenced` and `MorphLabel` are the deliberate sequences, and both retarget when interrupted.
- **U8 MUST: motion never gates access, and focus rings are never clipped at rest.**
- **U9 SHOULD: never animate opacity or filter on an ancestor of a `backdrop-filter` element.**

### H: Size changes

- **H1 MUST: the frame animates its real height; the content only fades.** Content sits at its final layout from the first frame and is never scaled or re-wrapped mid-animation. Owner: `ContentPresence` (`ui/motion/presence/`), whose `mode` picks the behaviour:

  | `mode` | Use for | Behaviour |
  |---|---|---|
  | default (masked) | existing consumers, accordions, queued content | measured spring size, content opaque throughout, a soft clipping edge only while moving, visible overflow at rest; no mask at all when motion is off |
  | `sequenced` | field errors, limits and notes, plus follow-up fields, sections and list rows | open: the height leads, and the content fades in once the box fits it. Close: the content fades out, then the height collapses. Content is clipped only while fully transparent; a visible glyph is never clipped and never overlaps a sibling |

  Field messages use `smooth`; larger content uses `smooth` or `gentle` by distance. Consumers never add their own sequential fades: they choose a mode.
- **H2 MUST: the animated box owns its gap.** Spacing next to conditional content goes inside the presence box (`gapBefore`/`gapAfter` or inner padding), never on a parent `gap-*`.
- **H3 MUST: one technique per dimension.** Height goes through `ContentPresence`; width through `MorphLabel` for labels, `Button` for buttons (B1), and otherwise `ContentPresence axis="x"`. No `grid-rows-[0fr]`, `interpolate-size`, `max-h-*` tricks or ad hoc `height: "auto"` in feature code; lint flags new ones.
- **H4 MUST: moves translate.** Use `layout="position"`; plain stretching `layout` is not used for size.

### T: Text

- **T1 MUST: text that changes in place morphs, never jumps.** Owner: `MorphLabel` (`ui/helpers/MorphLabel.tsx`, one string child).
  - Grow: the width leads; the new text fades in once it fits (about 60% of the width progress).
  - Shrink: the old text fades out first, then the width closes; the new text fades in.
  - Text moves y ±0.4em with a 3px blur on `quick`; the width uses `smooth`.
  - No opaque glyph is ever outside the box. Reduced motion and `?motion=off` snap.
  - No page-local `AnimatePresence mode="wait"` text swaps and no second text-swap component.
- **T2 MUST: never blank between two texts.** Shown text stays until the new text is known.
- **T3 SHOULD: numbers keep their width.** Tabular figures, and `MotionEffect.Number` for counted values.
- **T4 MUST: assistive tech reads the final text once.** Outgoing copies are `aria-hidden`.

### I: Icons

- **I1 MUST: an icon that changes with state goes through `IconSwap`** (`ui/helpers/IconSwap.tsx`): copy/check, plus/minus, menu/close, sun/moon. Scale and opacity on `snap`, no blur. IconSwap gates reduced motion internally, and offers `<IconSwap swapKey={k}>{child}</IconSwap>` beside `items`/`activeIndex`. No `copied ? <Check/> : <Copy/>` ternaries and no hand-stacked icons.
- **I2 MUST: the accessible name stays on the control,** never on the swapping icon.

### B: Buttons

- **B1 MUST: buttons morph between states.** When string `children` change, `Button` renders them through `MorphLabel` and eases its width; icons swap through `IconSwap`. The button keeps its place. `morph={false}` opts out (fixed-width grids). Loading keeps the fixed-width crossfade to the spinner. No ternary between two `<Button>`s and no wrapper whose width animates under `overflow-hidden`.
- **B2 MUST: no new variants or sizes without a stated reason** (U2).

### L: Loading, lists and stability

- **L1 MUST: follow the skeleton strategy.**
  1. Initial loads use skeletons or inline loading, never a toast (`specs/platform/data/loading`).
  2. A component's own `Component.Skeleton` beats a custom placeholder.
  3. Sizing comes from real or exemplar content passed as `Skeleton` children, so nothing shifts when data lands.
  4. Fixed copy stays live; only loaded data becomes a skeleton.
  5. One fill and one page-wide shimmer clock: every shimmer shares one sweep, and the sweep stops under reduced motion or `data-motion-override="off"`. `animation="static"` opts out.
  6. `radius` matches the shape the skeleton stands in for (`radius="full"` for pills and circles); no new skeleton kinds.
- **L2 MUST: the layout does not jump when content swaps.** Skeleton to content, text to text, errors, and lists that fill or empty resize through `ContentPresence`, `MorphLabel` or a real-content skeleton.
- **L3 SHOULD: no skeleton flash after content.** A refetch keeps shown content until new data lands.
- **L4 MUST: lists that change.** Items are keyed by their own id, never by index; items enter by `ContentPresence mode="sequenced"`; leaving items fade where they stood; remaining items translate (H4); an empty state enters like an item.
- **L5 SHOULD: items entering together stagger their fade only, with no nudge,** through the `MotionSource` sequence owner.

### V: Scroll reveals (entrances)

- **V1 MUST: a scroll reveal shows `reveal = intro(t) × reach(y)`, and both terms are live all the time.**
  - There is no flag, latch or mode switch between a timed intro and scroll.
  - `intro(t)` is the item's slot in the page's entry sequence (V3). It is 1 for every item not on screen at entry.
  - `reach(y)` is scroll progress from the item's own position (V2).
  - Each term eases on the `slow` curve.
  - Primitive: `MotionSource.Sequence mode="scroll"` + `MotionSource.Item` (`source/MotionSourceSequence.tsx`), with `source/entrySequence.ts` (intro) and `source/scrollReach.ts` (reach).
  - Don't: cap an intro by raw scroll progress. The old `progress = scroll × intro` left content on screen at load stuck part-way.
- **V2 MUST: every reveal can finish.**
  - Each item scrubs from its own start line over the Sequence offset's length (default `["start 95%", "start 55%"]`).
  - Items in one grid row split the row's range with the Sequence's `stagger`. Items stacked in one column each use their own position.
  - When the page can't scroll far enough, the whole Sequence shifts earlier by one shared amount. The last item then finishes exactly at the max scroll, and the length and stagger stay.
  - Don't: a per-section offset to make a footer finish.
- **V3 MUST: content on screen at entry plays one sequence.**
  - An item is in the sequence when its top is above 95% of the viewport at the entry scroll: the hash target's position, or the restored scroll position.
  - The items play in reading order once the app is ready. Each plays over `slow`, eased on `slow`. The next item starts its Sequence's `stagger` later, or 0.18 s later when it belongs to another Sequence.
  - An item nested inside another sequenced item shares its parent's slot.
  - Such an item is reached (`reach = 1`). Scroll only grows from there, so it never fades back.
  - Items above a restored scroll position are reached too, and render final.
- **V4 SHOULD: a section's top rule is a drawn divider,** not a static `border-t`: `MotionEffect.Divider` in the first `MotionSource.Item` of the section's Sequence, so it plays before the heading. The footer's top rule is the first case.
- **V5 MUST: reduced motion, `?motion=off` and `?reveal=off` show every reveal final (U3).**

### R: Responsive and verification

- **R1 MUST: CSS decides the look; `useTailwindBreakpoints` decides only whether expensive work mounts** (FR-001, FR-002).
- **R2 MUST: verify at 390 and 1440 wide with motion on and with `?motion=off`.**

## Token table

Values live in `ui/foundations/motionTiming.ts`, `spring.ts` and `library.css` (`motion-<step>` classes, `--motion-<step>-duration` and `--motion-<step>-ease`). Each spring settles within 1% in about its step's duration, and each ease is fitted to its spring, so the CSS fallback looks the same. Mass is 1. `snap`, `quick` and `smooth` are critically damped; `gentle` and `slow` are slightly overdamped. Nothing bounces. Approved by Olaf on 8 November 2026 from the side-by-side demo.

| Step | Duration | Ease (CSS fallback) | Spring stiffness / damping / mass | Replaces |
|---|---|---|---|---|
| `snap` | 100ms | `cubic-bezier(0.22, 0.16, 0.18, 1)` | 4560 / 135 / 1 | feedback, micro |
| `quick` | 160ms | `cubic-bezier(0.22, 0.16, 0.18, 1)` | 1760 / 84 / 1 | interaction, interactive |
| `smooth` | 240ms | `cubic-bezier(0.22, 0.16, 0.18, 1)` | 780 / 56 / 1 | disclosure, component, scroll |
| `gentle` | 360ms | `cubic-bezier(0.22, 0.24, 0.14, 1)` | 500 / 49 / 1 | overlay, macro |
| `slow` | 560ms | `cubic-bezier(0.18, 0.2, 0.12, 1)` | 290 / 42 / 1 | reveal, grand, ambient, decorative |

Which UI uses which step:

| UI | Step |
|---|---|
| press, hover, colour, focus ring, chevron, checkbox tick, icon swap | `snap` |
| tooltip, label swap (each phase), chips, scroll-edge fade | `quick` |
| menus, popovers, select and combobox lists, command palette, field messages, presence size, button width | `smooth` |
| dialogs, sheets, drawers, backdrops, carousel slides, full-width header menu panel | `gentle` |
| scroll-reveal entrance and scrub curve (V1, V3), reveals with no scroll position (modal content), loading screen, image crossfade | `slow` |

Icon keyframe values (spin, ring) stay outside the steps.

## Exceptions

Knowing breaks of a rule here are recorded in the one design-system exceptions register in [`specs/platform/design-system/scroll`](../scroll/spec.md#exceptions-register), with an `E-00N` ID cited at the exempted line.

## Success Criteria

- **SC-001**: Lint reports no motion-literal or height-technique violation beyond `debt`-tagged and E-ID-tagged lines, and the `debt` count only shrinks.
- **SC-002**: The presence, MorphLabel, IconSwap and Button stories named in the family specs pass their play tests at 390 and 1440, with motion on and off.
- **SC-003**: Every owner named in this spec resolves to a file.
