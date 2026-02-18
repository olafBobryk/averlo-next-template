<INSTRUCTIONS>
## Purpose
These instructions guide agents working on UI components under `src/components/ui`.
Keep components consistent, flexible, and reusable across the app while centralizing shared logic.

## Principles (Versatility + Centralization)
- **Build from each other:** Start with primitives and compose upward. Prefer extending existing components over introducing new one-offs.
- **Centralize rules:** Shared sizes, tones, and motion belong in `cva` variants or `foundations/` utilities, not duplicated strings.
- **Design for extension:** Expose `className` and structural slots; keep props stable and additive so components remain versatile.
- **Avoid tight coupling:** Components should be app-agnostic unless placed in `misc/` or a clearly domain-specific folder.

## Programming Standards
- **Class precedence:** Always merge class names as `clsx(variantClasses, className)` so `className` wins.
- **Variants:** Use `cva` for variants; keep sizes/tones aligned across components.
- **Composition over duplication:** Build specialized components by composing base ones (e.g., `IconButton` wraps `Button`).
- **Slots for exceptions:** Prefer slot/compound patterns for one-off internal overrides instead of new components.
- **No hardcoded fonts:** Components should use `Text` variants or `font-body`/`font-heading` utilities.
- **Motion utilities:** Use `motion-micro`, `motion-interactive`, `motion-component`, `motion-macro` with Tailwind `transition` utilities.
- **Motion + springs:** Tailwind motion utilities are the default for CSS transitions. Use `foundations/spring.ts` presets only for `motion/react` (layout/expand) so it builds on — not replaces — the motion system.
- **Inputs:** Use `InputFrame` for the shell and `inputVariants` (or `inputSizeClasses`) on the input element so padding lives on the input, not the frame.
- **Input IDs:** Always fall back to `React.useId()` when `id`/`name` aren’t provided so labels remain accessible.
- **Input a11y wiring:** Always wire `aria-describedby` and `aria-invalid` on the actual input element. Field error messages must be `aria-live`/`role="alert"` when tone is error.
- **Listbox a11y:** For listbox-style components, set `role="listbox"` plus `aria-multiselectable` when relevant, and ensure each option reflects `aria-selected`. Non-native option wrappers must include `aria-disabled` when disabled.
- **Keyboard activation:** Custom choice inputs should keep native Space behavior and explicitly support Enter activation (via `ChoiceField`).
- **Autocomplete:** Expose/forward `autoComplete` and `inputMode` where applicable (Email defaults to `autoComplete="email"`).
- **Button icon a11y:** If a button has visible text or an explicit aria label, icons should be `aria-hidden` so their titles aren’t announced. Icon-only buttons should provide an accessible name (aria-label or icon title).
- **Icon swapping:** Use `helpers/IconSwap.tsx` when toggling between icons (e.g., accordion plus/minus, password eye). It supports size, rotation via active/inactive classes, and multiple icons via `items` + `activeIndex`.

## Structure
- **`foundations/`**: shared TS-only utilities (`focus`, `spring`, `polymorphic`, `iconMap`).
- **`primitives/`**: small building blocks (Button, Text, Icon, InputFrame, Field, Panel).
- **`input/`**: form inputs composed from primitives.
- **`overlays/`**: portal-based UI (Dropdown, ToastHost, ModalHost).
- **`helpers/`**: composable helpers (IconSwap, motion helpers).
- **`misc/`**: composables that don’t fit inputs/overlays.
- **`motion/`**: motion-related utilities and hooks.
- **`time/`**: time/date-related UI helpers.

## How It Works (Fonts + Motion)
- **Fonts:** Only two fonts are expected: body + heading.
  - Body: `--font-body` → `font-body` utility.
  - Headings: use `Text` variants (`heading*`) backed by `--font-heading` → `font-heading` utility.
  - Use `Text` variants for typography; do not hardcode `font-family`.
  - Devs can change fonts by updating the global CSS variables.
- **Motion:** Use the utility classes defined in global CSS:
  - `motion-micro`: tiny interactions (icons, subtle hovers).
  - `motion-interactive`: buttons, toggles, active states.
  - `motion-component`: component expand/collapse, panel transitions.
  - `motion-macro`: large UI transitions (drawers, modals, layout shifts).
  - Motion overrides: Wrap the app with `SettingsProvider` (`ui/foundations/settingsContext.tsx`) to allow a `motionDisabled` toggle. `useMotionAllowed` respects this context.

## Component Coverage (UI)
- **`Button` (`ui/primitives/Button.tsx`)**
  - Variants, sizes, and alignment are standardized via `cva`.
  - Icons should be optional and animation-friendly; keep icon rendering centralized.
  - Loading should disable interaction and show the correct visual state.
  - Links: `href` or `as` switches to anchor semantics.
- **`Text` (`ui/primitives/Text.tsx`)**
  - Use for typography; avoid hardcoded `font-*`.
- **`Icon` (`ui/icons/Icon.tsx`)**
  - `name`, `size` (`sm|md|lg`), `animate` to enable hover/active motion styles.
- **`IconSwap` (`ui/helpers/IconSwap.tsx`)**
  - Standardizes icon transitions; use `items` + `activeIndex`.
  - Each item can have `activeClassName`/`inactiveClassName` for rotation/scale.
  - Supports `size` and custom `transitionClassName`.
- **`InputFrame` (`ui/primitives/InputFrame.tsx`)**
  - Shell component that provides tone/size/disabled styling and slots: `start`, `end`.
  - Use `inputVariants(...)` on the `<input>` for padding/size.
- **`Field` (`ui/primitives/Field.tsx`)**
  - Handles label/description/message with `tone` (`default|error|success`).
  - Use `inputId`, `descriptionId`, `messageId` for accessibility.
  - Error messages announce via `aria-live` (`role="alert"` when tone is error).
- **Inputs (`ui/input/*`)**
  - Inputs should be composed from `InputFrame` + `Field`.
  - Validation should be opt-out friendly (e.g., `validate={undefined}` disables defaults).
  - Combobox and select inputs should route menu styling through centralized helpers.
- **`SegmentedControl` (`ui/misc/SegmentedControl.tsx`)**
  - Controlled `value` / `onChange`.
  - Layouts: `equal` (default), `auto`, `columns`.
  - `roundedFull` for pill radius; options support `leadingIcon`/`trailingIcon`/`icon`.
  - `disableWhenReducedMotion` toggles the animated pill via `useMotionAllowed`.
- **`Accordion` (`ui/misc/Accordion.tsx`)**
  - Controlled or uncontrolled: `open`, `defaultOpen`, `onOpenChange`.
  - Uses `IconSwap` for plus/minus; content animates via `motion/react`.
- **`CopyField` (`ui/misc/CopyField.tsx`)**
  - Copy-to-clipboard wrapper on `Button`.
  - Props: `value`, optional `display`, `textVariant`, `onCopy`, `copiedDurationMs`, `loading`.
- **`ToastHost` + `showToast` (`ui/overlays/toast/*`)**
  - Mount `ToastHost` once (portal-based). Use `showToast.success/error/loading/dismiss/promise`.
  - `showToast.loading` returns an id; `dismiss(id)` removes it; `promise` updates from loading → success/error.
  - `disableWhenReducedMotion` disables toast animations via `useMotionAllowed`.
- **`Dropdown` (`ui/primitives/Dropdown.tsx`)**
  - Render-prop API: `renderTrigger` + `renderMenu`.
  - Supports hover + pin, positioning, and `menuWidth="trigger"`.
  - `disableWhenReducedMotion` disables the menu animation via `useMotionAllowed`.
- **`ModalHost` + modal helpers (`ui/overlays/modal/*` + `src/lib/modal.ts`)**
  - Mount `ModalHost` once (portal-based).
  - Focus should remain trapped in the top-most modal; `Escape` closes only the top-most modal.

## Component + Skeleton Export Pattern
- Components that ship a skeleton should export it via a static property:
  - Example: `export const OnlineIndicator = Object.assign(OnlineIndicatorRoot, { Skeleton: OnlineIndicatorSkeleton })`
  - Usage: `<OnlineIndicator.Skeleton />`
- Keep the skeleton implementation **in the same file** as the component.
- The goal is a consistent, discoverable API: `Component` + `Component.Skeleton`.

## Skeleton Sizing Rules
- The `Skeleton` primitive accepts optional `children`.
- When children are provided, they render invisibly (`opacity: 0`, no pointer events) to **drive the exact size** of the skeleton.
- Prefer sizing via real content and component variants instead of hardcoded widths/heights.

## Recommended Usage
- For text: use `Text.Skeleton` with the same `variant`/`as` as the real text.
- For composite components: pass sub‑skeletons as children (e.g., `UserInlineProfile.Skeleton` with `OnlineIndicator.Skeleton`).
</INSTRUCTIONS>
