# Folder: `src/components/composites/markdown`

## Role
Reusable markdown rendering surfaces that compose design-system primitives into content-authored pages or sections.

## Use This Folder When
- A page or internal fixture needs markdown rendered through `Text`, `Button`, and shared focus conventions.
- Markdown should remain a plain content string rather than a CMS-shaped page record.
- A small custom directive is needed without introducing route-specific registries.

## Current Contract
- `MarkdownRenderer` accepts markdown, optional class styling, and an optional generic mention resolver.
- `MarkdownEditor` is a controlled full-start editor with rich/source modes and optional mentions; `MarkdownEditorModalForm` is the dashboard-ready modal composition.
- Metadata, route titles, and page chrome do not belong in this renderer.
- Supported custom directive:
  - `::button[Label]{href=/path variant=primary size=md}`

## Invariants
- Keep markdown output grounded in design-system primitives.
- Keep custom directives self-contained and generic.
- Validate directive props before passing them into design-system components.
- Do not expose arbitrary `className`, JSX, HTML passthrough, data registries, or product-specific card directives through markdown.
- Keep `MarkdownRenderer` thin-start compatible; if it imports a design-system helper, make sure the thin-start API review explicitly allows that helper.
- Keep `MarkdownEditor`, its MDXEditor dependency, editor CSS, and modal editing composition full-start-only. The thin profile must export only the renderer.
- `MarkdownEditorModalForm` uses the shared modal submission contract so pending saves reject duplicate submit and lock conflicting dismissal. Callers continue to own persistence and result feedback.
- Mention rendering remains presentation-only: route/adapters resolve entity data, and the renderer/editor must not fetch.
