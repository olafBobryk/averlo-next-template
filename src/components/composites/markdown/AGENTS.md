# Folder: `src/components/composites/markdown`

This folder owns reusable Markdown rendering, authoring, loading and modal-form
composition.

## Read

- `specs/platform/design-system/usage/spec.md` for what Markdown may and may not
  expose; Storybook stories for the `Markdown` API.

## Public and profile boundary

- The namespace facade is `src/components/composites/markdown/index.ts`; family
  internals import direct owners and do not create a runtime namespace.
- Full start exposes editing and rendering: `Markdown.Editor`, its MDXEditor
  dependency, editor CSS and modal editing composition are full-start-only.
- Thin start exports only `Markdown.Render`. If `Markdown.Render` imports a
  design-system helper, the thin-start API review must explicitly allow it.

## Structure

- ReactMarkdown owns completed rendering. Streamdown is a private parser used
  only by `Markdown.Render streaming`; both engines consume the same component
  map, remark transforms, density, wrapper and semantic variant.
- Streamdown controls, icons, caret, animations, plugins, component types and
  package classes stay out of the public API; do not import its animation
  stylesheet.
- Renderer and editor authored content share the `.markdown-content` contract.
- Custom directives stay self-contained and generic, and validate their props
  before passing them to design-system components.
- Source mode lives inside the editor; neither it nor toolbar collapse may create
  a second editor or repair surface.
- Mention rendering is presentation-only: routes/adapters resolve entity data;
  the renderer and editor never fetch.
