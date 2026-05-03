# Folder: `src/components/ui/input`

## Role
Ready-made form controls composed from the primitives. This folder should be the default destination for form UX before building anything custom.

## Use This Folder When
- A page needs a text, email, password, phone, numeric, selectable, combobox, date range, signature, radio, checkbox, or toggle input.
- You want consistent validation, focus, shell styling, and accessibility wiring.
- The goal is to get close to standard product UX by using proven controls instead of custom page code.

## Choose The Highest-Level Match First
- `src/components/ui/input/TextInput.tsx`: plain single-line text entry.
- `src/components/ui/input/EditableTextInput.tsx`: inline display-to-edit text control for rename/title flows.
- `src/components/ui/input/EmailInput.tsx`: email entry with email-centric defaults.
- `src/components/ui/input/PasswordInput.tsx`: password entry with built-in visibility toggle and optional strength meter.
- `src/components/ui/input/ProfilePictureInput.tsx`: image picker for profile/avatar flows with preview, type validation, and remove action.
- `src/components/ui/input/TextAreaInput.tsx`: multi-line text input.
- `src/components/ui/input/NumberInput.tsx`: typed numeric entry.
- `src/components/ui/input/UnitNumberInput.tsx`: numeric entry with a fixed unit.
- `src/components/ui/input/SliderInput.tsx`: range-style numeric selection.
- `src/components/ui/input/PhoneInput.tsx`: phone input with country-aware UX.
- `src/components/ui/input/SelectInput.tsx`: searchable single-select dropdown.
- `src/components/ui/input/ComboboxTextInput.tsx`: text-driven combobox.
- `src/components/ui/input/ComboboxMultiSelectInput.tsx`: multi-select combobox.
- `src/components/ui/input/DateRangeInput.tsx`: date-range presets plus custom range entry; exported as `DateRangeInput`.
- `src/components/ui/input/SignaturePad.tsx`: signature capture.
- `src/components/ui/input/SpamProtectionFields.tsx`: hidden honeypot field for form submissions.
- `src/components/ui/input/RadioInput.tsx`: radio group built on the shared choice system.
- `src/components/ui/input/MultiselectInput.tsx`: checkbox group built on the shared choice system.
- `src/components/ui/input/ToggleInput.tsx`: toggle-style group built on the shared choice system.

## Invariants
- Prefer a complete input from this folder before composing a fresh control from primitives.
- Form fields should continue to route label, description, required state, and message handling through `Field`.
- Text-like controls should continue to route shell styling through `InputFrame`.
- If an input needs copy-to-clipboard affordances, use `useCopyAction` rather than duplicating clipboard or toast logic.
- The focus invariant is non-negotiable:
  - Keyboard users must see visible focus on the field shell and on the actual interactive control.
  - New input work should reuse the focus tokens already wired into `InputFrame` and the choice indicators.
  - Do not suppress native focus without preserving a visible replacement.
- IDs should fall back to `React.useId()` when `id` or `name` is missing.
- `aria-describedby` and `aria-invalid` should stay attached to the real input element, not only the wrapper.
- Use existing conventions before inventing custom ones. Examples:
  - Sign-up or reset-password flows should usually use `PasswordInput` with `showStrength`.
  - Password visibility toggling should come from `PasswordInput`, not a page-specific eye button.
  - Searchable selection should start with `SelectInput` or a combobox variant, not a custom dropdown.
  - Country or dialing-code UX should start with `PhoneInput`.
- Submission UX should stay form-native and accessible:
  - Use real `<form>` elements with `onSubmit`.
  - Guard against double submit by returning early when `loading` is already true.
  - Set `loading` on the submit button and disable other conflicting actions while the request is in flight.
  - Do not auto-clear the form after submit unless the product explicitly wants that behavior.

## Page-Level Usage Guidance
- **Login form:** usually `EmailInput` plus `PasswordInput` without strength meter.
- **Sign-up form:** usually `EmailInput` plus `PasswordInput showStrength`.
- **Profile or settings form:** start with `ProfilePictureInput`, `TextInput`, `EmailInput`, `PhoneInput`, `SelectInput`, and `ToggleInput` before creating bespoke controls.
- **Filter bars and dashboards:** use `SelectInput`, `ComboboxTextInput`, `ComboboxMultiSelectInput`, and `DateRangeInput` before ad hoc filter UIs.
- **Preference selection:** use `RadioInput`, `MultiselectInput`, or `ToggleInput` so focus, semantics, and indicators stay consistent.

## Submission And Feedback Pattern
- Use `showToast.promise` for user-initiated async submissions such as save, apply, submit, retry, or manual refresh.
- Map toast success and error copy to server messages when available.
- Keep toast copy short, neutral, and server-driven when possible.
- Use inline validation through `Field` messages for invalid form data instead of validation toasts.
- For initial page loads, use skeletons or inline loading states instead of a loading toast.

## How To Extend Safely
- If the needed UX is text-like, begin from an existing text-like input and preserve `Field` plus `InputFrame` structure.
- If the needed UX is inline renaming or title editing, use `EditableTextInput` before creating a page-local edit/display toggle.
- If the needed UX is choice-based, extend the choice subsystem in `choice/` rather than building a new label-plus-hidden-input pattern.
- If the needed UX opens a menu, see whether `SelectInput`, `ComboboxTextInput`, or `ComboboxMultiSelectInput` already covers it before touching `Dropdown` directly.

## Avoid
- Page-local password fields with custom show or hide logic.
- Raw searchable dropdowns or listbox implementations in feature code.
- Directly styling inputs in ways that bypass `InputFrame` and shared focus handling.
- Handling submissions from click handlers alone when a real form would solve the same job.

## See Also
- `src/components/ui/input/choice/AGENTS.md`
- `src/components/ui/input/files/AGENTS.md`
- `src/components/ui/primitives/AGENTS.md`
- `src/components/ui/overlays/toast/AGENTS.md`
