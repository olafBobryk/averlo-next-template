# Folder: `src/components/branding`

## Role
Brand identity primitives that should be reused anywhere the product mark or wordmark appears.

## Use This Folder When
- A page, header, footer, modal, or CTA needs the product logo.
- You need linked brand navigation back to home.
- You want consistent logo sizing, tone, and semantics.

## Prefer These Files
- `src/components/branding/Logo.tsx`: primary brand mark and wordmark component.

## Invariants
- Use `Logo` instead of rebuilding the brand with raw text or inline SVG in page code.
- Preserve semantic rendering. If the logo navigates, render it as a link or button through the component API instead of wrapping arbitrary markup.
- Keep logo usage visually consistent across header, footer, and other shell-level surfaces.
- If a brand mark becomes interactive, keyboard focus must remain visible through the underlying interactive element.

## How To Use It
- For global navigation or shell branding, prefer `Logo` directly.
- For layout-level brand presentation, compose `Logo` with `Button`, `Text`, or layout containers instead of cloning logo markup.
- If a new logo variant is needed, extend `Logo` centrally instead of branching brand markup in consuming components.

## Avoid
- Duplicating the logo asset or wordmark styling in page code.
- Adding page-specific focus or hover behavior that diverges from the shared component.
