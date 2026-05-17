<INSTRUCTIONS>
## Scope
These instructions guide agents working anywhere under `src/components`.
The goal is not just to document the library, but to push implementation work toward existing components, existing UX conventions, and existing accessibility behavior before adding anything new.

## Primary Goal
Use as much of this component library as possible before inventing new UI.
Agents should assume that a matching component probably already exists and should search this tree before building custom controls, wrappers, overlays, feedback patterns, or layout widgets.

## Default Workflow
1. Identify the UX pattern first, not the page-specific styling.
2. Find the closest existing component in `primitives/`, `input/`, `misc/`, `overlays/`, or `domain/`.
3. Compose upward from library pieces instead of creating one-off page components.
4. Only introduce new components when the behavior cannot be expressed by extending the library without harming reuse.
5. When a page needs a familiar UX convention, prefer the built-in implementation even if a custom version seems faster.

## New Feature Workflow
For any new reusable UI-library feature:
1. Implement the feature in its canonical source folder under `src/components`.
2. Update exports, types, and related consumers only where needed to make the public surface coherent.
3. Add a focused demo in `src/app/(site)/(marketing)/(internal)/demo/content.tsx` with at least one live example.
4. Add at least one usage snippet in the demo so adoption is copyable.
5. Update the nearest folder `AGENTS.md` with what the feature is for, when to use it, and any new invariants.
6. If the feature changes shared library conventions, also update this file so the workflow is visible at the top of the component tree.
7. Run checks on the touched files before considering the feature complete.

## Invariants
- **Library-first invariant:** Never start from raw HTML if a library component already covers the pattern. Search here first.
- **Composition invariant:** Prefer `Text`, `Button`, `Panel`, `Field`, `InputFrame`, `Dropdown`, `Listbox`, `PasswordInput`, `SelectInput`, `ModalShell`, `ToastHost`, and other existing building blocks before introducing bespoke UI.
- **Focus invariant:** Every interactive control must preserve visible keyboard focus using the shared focus tokens from `ui/foundations/focus.ts`. Do not invent ad hoc focus rings, remove outlines without replacement, or move focus styling away from the real interactive element.
- **Form invariant:** Labels, descriptions, errors, required state, IDs, and `aria-describedby` should flow through `Field` plus the relevant input component instead of page-local markup.
- **Input shell invariant:** Text-like controls should use `InputFrame` for the shell and `inputVariants` or `inputSizeClasses` for the actual input element. Padding belongs on the input, not the wrapper.
- **Typography invariant:** Use `Text` variants or the shared font utilities. Do not hardcode font families in component-level UI.
- **Motion invariant:** CSS motion utilities are the default. Use `motion/react` only where the library already does or where layout/reveal motion truly needs it. Respect reduced motion via `useMotionAllowed`.
  - For entrance reveals, prefer the canonical scheduler in `RevealRoot` / `RevealItem`. Use `RevealGroup` plus `RevealGroupItem` when a section should enter as one root-scheduled boundary with local child stagger. Marketing pages already provide a route-level `RevealRoot`; isolated surfaces can rely on the local fallback or add a scoped root.
  - For screenshot scripts and AI traversal, disable reveal motion at the root with the motion setting or a URL override such as `?motion=off` / `?reveal=off`; disabled roots render reveal content visible immediately.
  - For load-aware media reveals, prefer `RevealImage` with scheduler gates, `waitFor`, and `unlockStage` instead of page-local image-loading animation code.
  - For multi-step choreography across intro completion, media reveal, and later copy or accents, prefer `MotionScene` over page-local booleans and ad hoc callback chains.
- **Overlay invariant:** Use the existing portal and host model for modals, dropdowns, and toasts. Do not create page-local overlay stacks.
- **Skeleton invariant:** If a component ships with a skeleton, prefer `Component.Skeleton` over custom placeholders. Keep skeleton sizing driven by real content where possible.
- **Naming invariant:** When documenting or extending components, use real file paths and real export names so agents can find the correct file quickly.
- **React Compiler invariant:** Avoid `useCallback`, `useMemo`, and similar memoization wrappers unless they are strictly necessary for correctness or measurable performance. Prefer plain functions and values.

## UX Convention Map
Use these defaults unless product requirements explicitly say otherwise.

- **Auth forms:** Use `EmailInput` and `PasswordInput`.
  - Sign-up and password creation flows should usually enable `showStrength` on `PasswordInput`.
  - Sign-in flows usually keep `showStrength={false}`.
  - Password visibility toggling should use the built-in `PasswordInput`, not a custom eye button.
- **Searchable selection:** Use `SelectInput`, `ComboboxTextInput`, or `ComboboxMultiSelectInput` before building a custom searchable menu.
- **Phone numbers:** Use `PhoneInput` instead of a plain text input plus manual country code UI.
- **Numeric entry:** Use `NumberInput`, `UnitNumberInput`, or `SliderInput` depending on whether the value is typed, unit-bound, or range-like.
- **Choice groups:** Use `RadioInput`, `MultiselectInput`, or `ToggleInput`, which already route through the choice system and focus behavior.
- **Date range filtering:** Use `DateRangeInput` from `ui/input/DateRangeInput.tsx` before creating ad hoc preset filters.
- **File workflows:** Use `FileUploadInput`, `FileGallery`, and `FilePreview` before custom upload tiles.
- **Copy actions:** Use `CopyField` instead of wiring clipboard actions by hand.
- **Async states:** Use `Loader`, `SuspenseBoundary`, `ErrorState`, and `IdleState` before custom loading or empty-state wrappers.
- **Toasts:** Use `showToast` with `ToastHost` for async mutation feedback, but not for initial page-load loading. Toast titles are built in; pass `{ title }` or promise title options when flow-specific titles are needed.
- **Confirmation flows:** Use `useConfirmationModal` before creating page-specific confirm dialogs. The shared confirmation modal is part of the Halo primitives and should cover standard destructive or confirm-before-action flows.
- **Image inspection:** Use `InspectableImage` or `useImageInspectModal` for click-to-enlarge image behavior.
- **Image reveal choreography:** Use `RevealImage` when an image needs a loading fallback, reveal animation, or should gate later reveal content.
- **Segmented options:** Use `SegmentedControl` before rolling custom pill selectors.
- **Disclosure content:** Use `Accordion` before building new expand/collapse rows.

## App Standards To Preserve
- **Transparent gradient-border wrappers:** When reusing a transparent gradient-border treatment, keep wrapper and inner surface responsibilities separate.
  - Apply the border effect to a wrapper element.
  - Keep the wrapper background transparent so the border treatment can render independently.
  - Keep the inner panel itself transparent and apply interior fills separately, for example `bg-linear-to-b from-surface to-transparent`.
- **Radius plus transparency:** When using transparent panels, keep wrapper and panel radii aligned, such as `rounded-t-3xl` on both layers when that is the chosen radius token.
- **Form submission:** Prefer real `<form>` elements with `onSubmit` so Enter-to-submit and accessibility work naturally.
- **Toast usage:** Do not show toast notifications for initial page loads. Use skeletons or inline loading states first, then use toast-wrapped requests for explicit user actions like submit, apply, refresh, or retry.
- **SVG casing:** Inline SVG in JSX or TSX must use camelCase attribute names such as `clipPath`, `strokeWidth`, `colorInterpolationFilters`, `stopColor`, `stopOpacity`, and `maskType`.
- **Redirects:** Use `redirect()` for redirects. For auth guards, do not leave the UI blank on `401` or `403`; redirect to `/login` instead of returning `null` or stalling on a permanent loading state.

## Directory Map
- `branding/`: brand identity primitives such as `Logo`.
- `domain/`: reusable domain-level widgets such as shared search surfaces.
- `mount/`: client-only mounts for modal and toast hosts.
- `ui/foundations/`: focus, motion, settings, and shared CSS tokens.
- `ui/helpers/`: small helpers such as `IconSwap`.
- `ui/icons/`: icon rendering and registry infrastructure.
- `ui/primitives/`: the first place to look for reusable building blocks.
- `ui/input/`: ready-made form controls built from the primitives.
- `ui/misc/`: cross-cutting UX components that do not fit input or overlay categories.
- `ui/motion/`: reveal and scroll-driven helpers.
- `ui/overlays/`: portal-backed UI including modals and toasts.
- `ui/time/`: centralized date and relative-time presentation.

## What Agents Should Avoid
- Building raw buttons, inputs, labels, dropdowns, dialogs, or toasts when a library component already exists.
- Creating page-local password toggles, custom strength meters, or custom confirmation dialogs.
- Repeating focus classes instead of using the focus tokens.
- Re-implementing common UX patterns with slight stylistic changes that could be handled by props, variants, or composition.
- Editing multiple folders for one feature before checking whether a higher-level existing component already solves it.
- Using toasts as a substitute for initial-load skeletons or inline field validation.
- Memoizing ordinary component-local functions by default.

## Documentation Strategy
Each folder-level `AGENTS.md` should answer four questions quickly:
- What belongs here?
- When should an agent use this folder?
- What invariants must remain true?
- Which existing component is the preferred starting point?

Reusable features are not complete until implementation, demo coverage, and documentation all exist together.

## Folder Index
- `src/components/branding/AGENTS.md`
- `src/components/domain/AGENTS.md`
- `src/components/domain/search/AGENTS.md`
- `src/components/mount/AGENTS.md`
- `src/components/ui/AGENTS.md`
- `src/components/ui/foundations/AGENTS.md`
- `src/components/ui/helpers/AGENTS.md`
- `src/components/ui/icons/AGENTS.md`
- `src/components/ui/primitives/AGENTS.md`
- `src/components/ui/input/AGENTS.md`
- `src/components/ui/input/choice/AGENTS.md`
- `src/components/ui/input/files/AGENTS.md`
- `src/components/ui/misc/AGENTS.md`
- `src/components/ui/misc/state/AGENTS.md`
- `src/components/ui/motion/AGENTS.md`
- `src/components/ui/overlays/AGENTS.md`
- `src/components/ui/overlays/modal/AGENTS.md`
- `src/components/ui/overlays/toast/AGENTS.md`
- `src/components/ui/time/AGENTS.md`
</INSTRUCTIONS>
