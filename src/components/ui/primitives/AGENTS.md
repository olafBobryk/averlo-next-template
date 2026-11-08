# Folder: `src/components/ui/primitives`

The lowest-level reusable UI components.

## Read

- `specs/platform/design-system/usage/spec.md` when choosing or extending an
  owner.
- `specs/platform/design-system/families/{inputs,buttons,presence,overlays}/spec.md`
  when changing InputFrame/Field, Button, feedback presence or Dropdown/Listbox.
- Storybook owner stories for component APIs and defaults; a primitive is
  public only through its Storybook owner contract and documented facade.

## Structure

- Higher-level UI may compose primitives; primitives must not depend on
  complete inputs, overlays, composites, domain components or routes.
- Keep component-owned skeleton imports server-safe. Split client behavior from
  shared types and skeleton exports when needed to protect a server boundary.
- Surface structure, chrome, elevation, slot topology and inspection attributes
  belong to `surfaces/AGENTS.md` and its facade.
- Dropdown positioning, controller, collection semantics and shared class
  recipes stay in their internal owners under `dropdown/`; consumers do not fork
  or expose their raw pieces. Recursive Dropdown and Listbox branches render
  portal-backed sibling surfaces beside the parent row.
- Button visual recipes are private shared implementation used by canonical and
  thin-start renderers (`template-profiles/thin-start/overrides/`); overrides do
  not fork their tokens or geometry.
- Feedback presence composes the motion presence family (`../motion/presence/`).
- Composite keyboard navigation and scoped shortcuts stay with their owner.
