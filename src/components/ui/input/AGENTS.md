# Folder: `src/components/ui/input`

## Ownership

This family owns complete form controls composed from UI primitives.

## Public facade and dependency direction

- External consumers import supported inputs and public types from
  `@/components/ui/input`.
- The explicit root `index.ts` is the stable full-start boundary. External
  consumers must not deep-import implementation files.
- Input-family implementations import direct owners and sibling modules; they
  must not self-import through the public barrel.
- Full-start and thin-start maintain separate barrels. Thin-start intentionally
  exposes a smaller inventory.

## Structural invariants

- Complete fields compose `Field`; text-like controls compose `InputFrame`.
- Consumers use the complete supported input before `Field`, `InputFrame` or raw
  native parts. Lower-level composition is limited to an approved reusable input
  extension with an ownership reason; authorization to build a new owner does
  not make its private controls public. Exact supported APIs remain in Storybook.
- Labels, descriptions, messages, required state, IDs, `aria-describedby`, and
  `aria-invalid` stay connected to the real input rather than only a wrapper.
- Generated IDs fall back to `React.useId()` when neither `id` nor `name` owns
  the form identity.
- Native inputs remain mounted for choice, file, number, range, phone, and
  hidden form-output patterns.
- Component-owned skeletons reuse `InputSkeleton` for closed single-field
  geometry. Repeated choices, previews, canvases, and additional rows own only
  their distinct skeleton topology.
- Color inputs and the MDX editor remain full-start-only. DateRangeInput is
  full-start-only; DateInput and the shared calendar core remain available to
  thin-start.

Read the nearest child `AGENTS.md` for internal topology.

Complete forms follow [form behavior](../../../../openspec/specs/app/shared/data-lifecycle/form-behavior/spec.md)
and [form verification](../../../../docs/testing/forms.md). Apply submission
protection to public delivery, attachments or explicitly abuse-sensitive cases;
do not load contact credentials, recipients or deployment procedures for ordinary
form work. Native controls remain the mounted value, browser, keyboard, file and
accessibility owners under specialized presentation.
