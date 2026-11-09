# Specification: Inputs family

**Spec path**: `specs/platform/design-system/families/inputs`

**Created**: 2026-11-08

**Status**: Accepted, living. The `sequenced` message and `autoGrow` are built in this batch; see `tasks.md`.

**Builds on**: `specs/platform/design-system/usage`, `specs/platform/design-system/families/presence`, `specs/platform/data/forms`

**Verified by**: the Storybook stories listed under "Proof"

## Purpose

Every form field is a `Field` around a `ui/input` owner, so labels, descriptions, messages, error look, keyboard, autocomplete and motion are the same everywhere. Behaviour of the whole form (validation, pending, retry) belongs to `specs/platform/data/forms`.

## Clarifications

### Session 2026-11-08

- **Q: How does a field message appear?**
  - A: Through `ContentPresence mode="sequenced"`: the box grows first and the text fades in once it fits, so a message is never clipped and never overlaps the next field (Olaf, 8 November: "fade waits until it fits"). The old `max-h-*` clip goes. `message`, `tone` and `messageId` keep their meaning (F7).
- **Q: Does the textarea grow with its content?**
  - A: As an opt-in `autoGrow` prop on `TextAreaInput`; the default stays `rows`-based and resizable (F8).

## API and defaults

| Owner | Key props | Defaults |
|---|---|---|
| `Field` (`ui/primitives/Field`) | `label`, `description`, `message`, `tone: "default" \| "error" \| "success"`, `required`, `inputId`, `descriptionId`, `messageId`, `disableMessage`, `labelAction`; `Field.Skeleton` | `tone="default"`; an `error` message is announced |
| `InputFrame` (`ui/primitives/InputFrame`) | `size: "xxs" \| "xs" \| "sm" \| "md" \| "lg"`, `variant: "default" \| "strong"`, `presentation`, `tone` | `size="sm"`, `variant="default"` (soft, shadowless in light mode) |
| `TextInput`, `EmailInput`, `PasswordInput`, `PhoneInput`, `TextAreaInput` (`ui/input/text`) | `label`, `description`, `value`/`defaultValue`, `onChange`, `error`, `validate`, `required`, `disabled`, `size`; `TextInput` adds `copy`; `TextAreaInput` adds `rows` and (this batch) `autoGrow` | `TextAreaInput rows={3}`, resizable |
| Selection, choice, numeric, date, colour, file, editable inputs (`ui/input/*`) | per owner story | per owner story |
| `SpamProtectionFields` | honeypot fields for exposed public forms | hidden from people and assistive tech |

## Requirements

- **F1 MUST: every field goes through `Field` plus a `ui/input` control.** No `Field` + `InputFrame` + raw `<input>` in feature code; lint flags raw `<input>`/`<textarea>` outside `ui/input` owners.
- **F2 MUST: the error look and motion come from `Field` only.** No `text-danger` or `border-danger` in feature code; lint flags them outside `Field` and the feedback owners.
- **F3 MUST: phone inputs use the tel keyboard** through `PhoneInput` (`type="tel"`, `inputMode="tel"`, tel autocomplete, country picker).
- **F4 MUST: inputs are 16px or larger below `md`,** so iOS does not zoom on focus. The default `sm` size meets this; a smaller size on a phone-reachable form needs a stated reason.
- **F5 MUST: the right keyboard and autocomplete.** Email: `EmailInput` (`type="email"`, email autocomplete); name: `autoComplete="name"`; numbers: `inputMode="numeric"`; URLs: `type="url"`.
- **F6 MUST: forms are real forms.** `<form>` with native submission, a synchronous double-submit guard, and `loading` on the submit `Button` (`specs/platform/data/forms`).
- **F7 MUST: field messages never clip.** `Field` renders its message through `ContentPresence mode="sequenced"` with its gap inside the box. At 390 and 1440, no frame shows a visible (opacity > 0.05) message clipped by its box or overlapping the next field, and a two-line error is fully visible at rest. `message`, `tone`, `messageId` and `disableMessage` keep their API.
- **F8 SHOULD: auto-growing textareas use `autoGrow`.** `TextAreaInput autoGrow` grows with content from its `rows` minimum and keeps its skeleton height parity; no page-local auto-grow scripts.
- **F9 MUST: skeleton parity.** Each input's `.Skeleton` matches its live geometry (`Field.Skeleton`, `InputFrame` skeletons).
- **F10 MUST: the complete input first.** Consumers use the complete supported input before `Field`, `InputFrame` or raw native parts. Lower-level composition is only for an approved reusable input extension with an ownership reason, and authorization to build a new owner does not make its private controls public.
- **F11 MUST: relationships reach the real input.** Labels, descriptions, messages, required state, IDs, `aria-describedby` and `aria-invalid` connect to the real input, not only a wrapper (`specs/platform/data/forms` FR-001). Generated IDs fall back to `React.useId()` when neither `id` nor `name` owns the form identity.
- **F12 MUST: choice indicators are integer-aligned and borderless.** Default radio and checkbox are 22px with 12px marks at 5px insets; the compact checkbox is 18px with a 12px mark at 3px; the default toggle is 42x26px with a 22x18px thumb at 4px; the compact toggle centres the scaled default indicator in a 34x20px slot.
- **F13 MUST: choice marks never transform.** Selection and hover change radio and checkbox marks through colour and opacity only, so artwork does not drift through subpixel scaling.
- **F14 MUST: editable fields keep their geometry.** Display and edit states do not shift (`InputFrame` stays mounted), and pending and error state stay inside the existing `Field` topology.
- **F15 MUST: the editable file rail's add tile has a solid border.**
- **F16 MUST: one input chrome.** `InputFrame` and `Dropdown` own compact input chrome and inset menu styling. Composers share the `InputFrame` fill and shadow of ordinary inputs and search; a presentation may change geometry, never fork the background. In light mode the default chrome is soft and shadowless, dark default chrome is unchanged, and `strong` gives a heavier frame.

## Proof

| Rule | Story (Storybook title / export) | Status |
|---|---|---|
| F1, F2, F7 | `UI/Primitives/Field` `LabelDescriptionAndErrorRelationships`, `SuccessAndLabelAction` | exists; F7 adds a two-line error play test at 390 and 1440 (this batch) |
| F3 | `UI/Input/Text/PhoneInput` `PhoneContract` | exists |
| F5 | `UI/Input/Text/EmailInput` `EmailContract`, `UI/Input/Text/TextInput` `FieldContract` | exists |
| F8 | `UI/Input/Text/TextAreaInput` `TextareaContract` plus an `autoGrow` story | `autoGrow` story this batch |
| F9 | `SkeletonParity` stories across `UI/Input/*`, `UI/Primitives/Field` `SkeletonParity`, `UI/Primitives/InputFrame` `DisabledAndSkeletonParity` | exists |
| F6 | `UI/Overlays/Modal Forms` `OrderedStepSubmission`, [docs/testing/forms.md](../../../../../docs/testing/forms.md) | exists |
| F1, F2 (lint) | Biome GritQL rules for raw inputs and danger classes | this batch |
