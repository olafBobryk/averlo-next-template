# Verify keyboard, overlays and responsive motion

Behavior lives in [keyboard and overlays](../../openspec/specs/app/shared/frontend/interaction/keyboard-and-overlays/spec.md)
and [responsive and motion](../../openspec/specs/app/shared/frontend/interaction/responsive-and-motion/spec.md).
Nearest [motion](../../src/components/ui/motion/AGENTS.md),
[overlay](../../src/components/ui/overlays/AGENTS.md), modal and primitive policy
owns dependencies; exact props, source/effect families and variants stay in owner
Storybook contracts. Read those policies only when applicable, not every family
for a CSS change. Loading placeholders remain non-interactive under the separate
[loading procedure](loading.md).

## Run interaction verification

```sh
npm run verify:modals
```

Run affected owner Storybook interactions using [component verification](component-contracts.md).
Useful existing cases include Modal hosted focus, pending lock and drawer trap;
Dropdown recursive menus, ordering/selection/dismissal, controlled panels and
screen-edge alignment; ContentPresence interruption, motion-off, reduced motion
and Accordion parity. These are owner evidence, not a claim that every application
overlay or responsive branch has been tested.

## Blocking and anchored overlays

Obtain a verified automation URL through Preview. Traverse the real control using
the keyboard: check accessible name, visible focus, native activation, documented
composite navigation and scoped shortcuts. Animation/decorative wrappers must not
create focus stops or replace the real control. Check entry focus, Tab/Shift-Tab,
all documented dismissal paths and return to an available initiator/recovery target.

For nesting, open a child interaction and verify only the top layer receives focus
and dismissal. Closing it returns focus to its parent without dismissing that
parent; body scroll remains locked until the last blocking owner closes and then
restores. Delay a real mutable flow and try Escape, backdrop, header close,
footer cancel, programmatic close and step changes where supported: every path
uses the central pending lock. Returned and thrown failures unlock in place with
local recovery; success observes [action completion](actions.md).

For anchored nonblocking Dropdown, check anchor placement, edge fallback, keyboard
navigation, selection and dismissal without introducing a blocking modal, separate
portal/focus system or page-level override. Shared hosts own stacking and locking.

## Responsive and motion matrix

Review affected desktop and narrow widths through managed Preview breakpoint
review when layout materially changes or a heavy branch is added. Verify primary
copy, headings, navigation, essential controls and accessibility in initial HTML
before client breakpoint state resolves. Use CSS for lightweight layout/visibility;
client branches only avoid hidden expensive observers, runtime/media/canvas or
duplicated decoration without withholding essential content. Inspect activation
or requests to demonstrate avoided hidden work, not just a screenshot.

Exercise normal, reduced, motion-off and fallback states, interrupted playback,
resize and supported re-entry. Content remains readable; real controls remain
focusable and operable without waiting for motion. Check one shared provider/
scheduler, source-owned activation/progress/reset, effect-owned visual mapping/
internal phasing, and shared timing/spring owners. ContentPresence owns measured
normal-flow size/optional gap, independently of viewport reveal; interaction owners
still own trigger, focus and announcements. No page-local schedulers, reveal
observers, reset/timing families, global shortcut listeners or focus overrides.
Keep JSX SVG attributes camelCase. Add memoization only for correctness or measured
benefit; ordinary interaction review does not require a scroll benchmark.

## Evidence and repair

Record owners, widths, motion modes, outcomes and skipped paths under ignored
`test-results/`. Fix clear semantic defects directly. Seek direction before
altering established contrast, spacing, typography, layout or focus styling merely
because a broad audit suggests a different design. Use the existing
`docs/operations/scroll-performance.md`, when installed, only for measured cost work.
