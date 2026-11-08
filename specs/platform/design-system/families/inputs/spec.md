# Specification: Inputs family

**Spec path**: `specs/platform/design-system/families/inputs`

**Created**: 2026-11-08 (new; form-input rules ported from a product site spec, rules only)

**Status**: Accepted, living. The `together` message and `autoGrow` are built in this batch; see `tasks.md`.

**Builds on**: `specs/platform/design-system/usage`, `specs/platform/design-system/families/presence`, `specs/platform/data/forms`

**Verified by**: the Storybook stories listed under "Proof"

## Purpose

Every form field is a `Field` around a `ui/input` owner, so labels, descriptions, messages, error look, keyboard, autocomplete and motion are the same everywhere. Behaviour of the whole form (validation, pending, retry) belongs to `specs/platform/data/forms`.

## Clarifications

### Session 2026-11-08

- **Q: How does a field message appear?**
  - A: Through `ContentPresence mode="together"`: height and fade at once, overflow visible, so a two-line error never clips. The old `max-h-*` clip goes. `message`, `tone` and `messageId` keep their meaning (F7).
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
- **F7 MUST: field messages never clip.** `Field` renders its message through `ContentPresence mode="together"` with its gap inside the box. A two-line error at 390 and 1440 is fully visible at rest (text height ≤ box height). `message`, `tone`, `messageId` and `disableMessage` keep their API.
- **F8 SHOULD: auto-growing textareas use `autoGrow`.** `TextAreaInput autoGrow` grows with content from its `rows` minimum and keeps its skeleton height parity; no page-local auto-grow scripts.
- **F9 MUST: skeleton parity.** Each input's `.Skeleton` matches its live geometry (`Field.Skeleton`, `InputFrame` skeletons).

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
