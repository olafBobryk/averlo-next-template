# Folder: `src/components/composites/markdown`

## Role
Reusable markdown rendering surfaces that compose design-system primitives into content-authored pages or sections.

## Use This Folder When
- A page or internal fixture needs markdown rendered through `Text`, `Button`, and shared focus conventions.
- Markdown should remain a plain content string rather than a CMS-shaped page record.
- A small custom directive is needed without introducing route-specific registries.

## Current Contract
- `MarkdownRenderer` accepts only `{ markdown, className? }`.
- Metadata, route titles, and page chrome do not belong in this renderer.
- Supported custom directive:
  - `::button[Label]{href=/path variant=primary size=md}`

## Invariants
- Keep markdown output grounded in design-system primitives.
- Keep custom directives self-contained and generic.
- Validate directive props before passing them into design-system components.
- Do not expose arbitrary `className`, JSX, HTML passthrough, data registries, or product-specific card directives through markdown.
- Keep this composite thin-start compatible; if it imports a design-system helper, make sure the thin-start API review explicitly allows that helper.
