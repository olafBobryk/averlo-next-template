# Folder: `src/components/ui/input`

This family owns complete form controls composed from UI primitives.

## Read

- `specs/platform/design-system/families/inputs/spec.md` for input API, defaults
  and which owner to use; Storybook stories for exact APIs.
- `specs/platform/data/forms/spec.md` and
  [form verification](../../../../docs/testing/forms.md) for complete forms.
- `specs/platform/services/delivery/spec.md` only for public delivery,
  attachments or explicitly abuse-sensitive forms.
- The nearest child `AGENTS.md` for internal topology.

## Public facade and dependency direction

- External consumers import supported inputs and public types from
  `@/components/ui/input`. The explicit root `index.ts` is the stable full-start
  boundary; no deep imports of implementation files.
- Input-family implementations import direct owners and sibling modules, never
  the public barrel.
- Full start and thin start keep separate barrels; thin start exposes a smaller
  inventory.

## Structure

- Complete fields compose `Field`; text-like controls compose `InputFrame`.
- Native inputs stay mounted for choice, file, number, range, phone and hidden
  form-output patterns.
- Component-owned skeletons reuse `InputSkeleton` for closed single-field
  geometry; repeated choices, previews, canvases and extra rows own only their
  distinct skeleton topology.
- Full-start-only: color inputs and `DateRangeInput`. `DateInput` and the shared
  calendar core are available to thin start. (The MDX editor is full-start-only
  too but lives in `src/components/composites/markdown`.)
