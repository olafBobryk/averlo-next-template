# Specification: Overlays family and keyboard behaviour

**Spec path**: `specs/platform/design-system/families/overlays`

**Migrated from**: OpenSpec `app/shared/frontend/interaction/keyboard-and-overlays` (origin/main `3fd01907`); the family API and the popover rules are new

**Status**: Accepted, living. The Dropdown engine, `presentation` and the toast cancel option are built in this batch; see `tasks.md`.

**Builds on**: `specs/platform/design-system/usage`, `specs/platform/design-system/motion`, `specs/platform/design-system/scroll`

**Verified by**: [docs/testing/interactions.md](../../../../../docs/testing/interactions.md), `npm run verify:modals`, and the stories listed under "Proof"

## Purpose

Keep controls and layered interactions operable through accessible names, native or documented keyboard behavior, predictable focus and consistent dismissal. One overlay system: `Dropdown` for anchored panels, the modal owners for blocking flows, `showToast` for transient outcomes, `Tooltip` and `Portal`.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only for FR-001 to FR-004: each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, and scenarios kept their wording.
- **Q: How does Dropdown stay on screen?**
  - A: Its engine moves to `@floating-ui/react-dom` (offset, flip, shift with `collisionPadding`, size for the height cap, autoUpdate) behind the existing public props (FR-005).
- **Q: Phones?**
  - A: A new `presentation="anchored" | "sheet" | "auto"`, default `auto`. The sheet is a full-width panel docked to the bottom edge, chosen only when the anchored panel cannot fit its minimum size in the available space; no device or breakpoint logic (FR-006).
- **Q: Toasts for long promises?**
  - A: The toast promise helper gains a cancel option (FR-009).

### Session 2026-11-08 (AGENTS.md thinning)

- **Q: Which rules moved here when the `AGENTS.md` files were thinned?**
  - A: Behaviour rules from `src/components/ui/overlays/AGENTS.md`, `src/components/ui/overlays/modal/AGENTS.md`, `src/components/ui/primitives/AGENTS.md`, `src/components/ui/foundations/AGENTS.md` (focus tokens) and `plugins/averlo/README.md` (origin/main `3fd01907`) with no other spec home. They are FR-010 to FR-014, with their meaning kept. The README called the compact-row frame "muted"; that variant is retired, so FR-010 names the default xxs `InputFrame`. Focus entry and return, the single pending close lock, anchored versus blocking roles and no second portal stack were already FR-001 to FR-004 and FR-008; the old minimum-width and opposite-edge positioning rule is superseded by FR-005 and FR-006.

## Requirements

### Keyboard and overlays (migrated)

### FR-001: Accessible control ownership

Interactive controls MUST retain their semantics, accessible names and visible focus. Native keyboard behavior MUST be preserved where applicable; composite controls and scoped shortcuts MUST use their documented interaction contract. Decorative wrappers MUST NOT introduce focus stops or replace the real interaction owner.

**Scenario: Keyboard operation with decoration**

- **When** a user traverses and activates a control decorated by animation or additional wrappers
- **Then** its name, visible focus and keyboard behavior remain available on the real control without duplicate stops

### FR-002: Focus entry and return

Opening a focused blocking interaction MUST place focus according to its owner contract. Closing it MUST restore focus to an appropriate available initiator or documented recovery target. Nested overlays MUST preserve topmost focus and dismissal ownership.

**Scenario: Close a nested dialog**

- **When** the topmost dialog closes while its parent interaction remains open
- **Then** focus returns to the appropriate parent control and the parent is not dismissed by the same action

### FR-003: Consistent pending dismissal lock

A mutable blocking flow MUST apply one pending close lock to Escape, backdrop, explicit close and every other dismissal path. Recoverable failure MUST unlock the same flow in place. Scroll locking and stacking MUST remain consistent with active blocking layers.

**Scenario: Dismiss during a delayed confirmed mutation**

- **When** a mutable dialog is pending and the user tries each supported close path
- **Then** every path observes the same lock and no conflicting dismissal occurs

**Scenario: Failure unlocks recovery**

- **When** the pending mutation fails recoverably
- **Then** its error appears in place, dismissal unlocks consistently and retry remains available

### FR-004: Blocking and anchored interaction roles

Nonblocking anchored interactions MUST preserve their documented anchor, keyboard navigation and dismissal behavior. Focused blocking interactions MUST provide their documented modal behavior rather than imitating it through visual surface styling alone.

**Scenario: Open an anchored menu**

- **When** a user opens an anchored menu with the keyboard
- **Then** its owner supplies navigation and dismissal without introducing an unrelated blocking dialog or independent focus system


### Popovers and the overlay system

### FR-005: Popovers never overflow the viewport

`Dropdown` panels MUST flip, shift and clamp inside `collisionPadding`, cap their height and scroll inside (through `ScrollArea`), follow the trigger while open, and close on Escape. Placement is computed by `@floating-ui/react-dom` inside the dropdown owner, behind the public `side`, `align`, `offset`, `collisionPadding`, `menuWidth`, `menuMinWidth` and `positionStrategy` props. No page-local placement, `focus-within:z-*` lifts or per-consumer sheet classes.

**Scenario: Trigger near the bottom edge**

- **When** a menu opens from a trigger with too little room below
- **Then** it flips or shifts to stay fully inside the collision padding and scrolls inside when capped

### FR-006: Presentation follows available space

`presentation` MUST accept `"anchored"`, `"sheet"` and `"auto"` (default). `auto` renders the anchored panel unless it cannot fit its minimum size in the available space, then a full-width sheet docked to the bottom edge. The decision uses measured space only, never device or breakpoint detection.

**Scenario: Narrow viewport with a wide menu**

- **When** the anchored panel's minimum width does not fit the viewport
- **Then** `auto` presents the sheet, and widening the viewport returns to the anchored panel

### FR-007: Menus move on the disclosure moment and snap when motion is off

Dropdown entry and exit MUST use the disclosure moment with a small y nudge, and MUST snap under reduced motion and `?motion=off` (motion U3).

**Scenario: Motion off**

- **When** a menu opens with `?motion=off`
- **Then** it appears in its final position without transition

### FR-008: One overlay system

Blocking flows MUST use `useModal`/`ModalForm`/`ModalCard`, confirmation MUST use `useConfirmationModal`, transient outcomes MUST use `showToast` with the single `ToastHost`, and portals MUST use `Portal`. Feature code does not build a second focus, scroll-lock, dismissal or portal stack.

**Scenario: Confirm a destructive action**

- **When** a feature needs confirmation before a delete
- **Then** it uses `useConfirmationModal`, which owns focus, pending lock and dismissal

### FR-009: Toast promises can be cancelled

`showToast.promise` MUST accept an optional cancel option that dismisses the pending toast without showing success or error.

**Scenario: User cancels a long run**

- **When** the caller cancels the promise it passed to `showToast.promise`
- **Then** the loading toast is dismissed and no success or error toast follows

### Menu composition, surfaces and focus

### FR-010: Dropdown separation and mixed rows

Dropdown separation MUST use independent `Divider`s: full width between major content blocks, inset between action groups, and never a separator border on an interactive row. Mixed controls and actions use `Dropdown.Menu` custom control entries; a consumer never rebuilds the list. A compact row that needs a hover background pairs a default-variant xxs `InputFrame` with xs `ghost` buttons.

### FR-011: Overlay fills

`Float` MUST use a distinct raised fill; modals keep the `Card` fill at overlay elevation.

### FR-012: Stacked modals

The modal shell MUST own the topmost focus context and a reference-counted body scroll lock across stacked modals. Modal step state MUST NOT submit early.

### FR-013: Recursive menus keep a flat DOM

Recursive `Dropdown`/`Listbox` MUST preserve the exact flat DOM when no option has children. Navigation, active descendant, focus return and dismissal stay with the owning cascade level.

### FR-014: Focus and keyboard are never forked

Shared focus tokens MUST NOT be weakened. Consumers never override visible focus globally, install duplicate global shortcut listeners or fork composite keyboard behaviour.

## API and defaults

| Owner | Key props | Defaults |
|---|---|---|
| `Dropdown` (`ui/primitives/dropdown`) | `renderTrigger`, `renderMenu`, `side`, `align`, `offset`, `collisionPadding`, `menuWidth`, `menuMinWidth`, `positionStrategy`, `portalTargetId`, `open`, `onOpenChange`, `openOnHover`, `pinOnClick`, `autoFocusMenu`, `disabled`; `presentation` (this batch); compounds `Menu`, `Listbox`, `Panel` | per owner story; `presentation="auto"` |
| `Listbox` (`ui/primitives/Listbox`) | selection, keyboard navigation | |
| Modals (`ui/overlays/modal`) | `useModal`, `useConfirmationModal`, `ModalForm`, `ModalCard`, `ModalShell` | |
| `showToast` (`src/lib/feedback`) | `success`, `error`, `info`, `loading`, `dismiss`, `promise` (+ cancel, this batch) | |
| `Tooltip`, `Portal` | per owner story | |

## Proof

| Rule | Story (Storybook title / export) | Status |
|---|---|---|
| FR-001, FR-004 | `UI/Primitives/Dropdown` `MenuOrderingSelectionAndDismissal`, `RecursiveMenu`, `RecursivePointerOwnership`, `ControlRowsHoverAndDismissal`; `UI/Primitives/Listbox` `KeyboardSelection`, `RecursiveKeyboardNavigation` | exists |
| FR-002 | `UI/Overlays/Modal` `HostedFocusAndDismissal`, `NestedFocusAndScroll` | exists |
| FR-003 | `UI/Overlays/Modal` `SubmissionCloseLock`; `UI/Overlays/ConfirmationModal` `RecoverableFailureAndRetry` | exists |
| FR-005 | `UI/Primitives/Dropdown` `ScreenEdgeAlignment` plus flip/shift/height-cap play tests on the floating-ui engine | engine this batch |
| FR-006 | Dropdown `presentation` stories (anchored, sheet, auto at 390 and 1440) | this batch |
| FR-007 | Dropdown story under `?motion=off` | this batch |
| FR-009 | `UI/Overlays/Toast` `PromiseLifecycle` plus a cancel case | this batch |
