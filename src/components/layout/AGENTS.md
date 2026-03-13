# Folder: `src/components/layout`

## Role
App-shell assemblies for site-wide structure. These are larger than primitives and should represent reusable layout conventions, not one-off page sections.

## Use This Folder When
- You are working on global navigation, global footer content, or shared shell structure.
- You need a header or footer that should remain consistent across routes.
- The work belongs to app chrome rather than a page-specific content block.

## Prefer These Files
- `src/components/layout/header/Header.tsx`: default responsive header entry point.
- `src/components/layout/footer/Footer.tsx`: site-wide footer assembly.

## Invariants
- Use `Header` and `Footer` for shell-level UI before creating route-local header or footer variants.
- Shared shell pieces should compose `Logo`, `Button`, `Text`, and overlay helpers instead of duplicating lower-level behavior.
- Responsive behavior should remain centralized. Avoid splitting desktop and mobile shell logic across unrelated files.
- Keyboard focus must remain visible on all shell actions, especially nav links, CTA buttons, and mobile menu triggers.
- If navigation structure changes, keep desktop and mobile representations aligned.

## How To Use It
- Use `Header` as the default import for page or app layouts.
- Use `Footer` for the standard closing site section.
- If a shell behavior differs by breakpoint, prefer extending the existing header or footer components instead of creating a parallel shell.

## Avoid
- Building ad hoc headers inside pages when the global shell should handle the job.
- Recreating logo, CTA, or mobile-menu behavior outside the layout system.
- Duplicating focus and modal behavior already handled in the header subcomponents.

## See Also
- `src/components/layout/header/AGENTS.md`
- `src/components/layout/footer/AGENTS.md`
- `src/components/branding/AGENTS.md`
