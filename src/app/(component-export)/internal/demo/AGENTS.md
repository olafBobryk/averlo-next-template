# Component Export Surface

`/internal/demo` is a shell-free application projection of the generated component catalogue manifest; Storybook renders the same shared surface for Figma capture.

- Read `specs/template/demos/spec.md` and `specs/platform/design-system/usage/spec.md` when changing what the export shows.
- Application code never imports Storybook, CSF or `.stories` modules.
- The projection lives in `src/lib/component-catalog/` (`ComponentExportSurface.tsx`, `exportSections.ts`, generated `componentCatalog.generated.ts`). Section mapping has one owner, `exportSections.ts`; do not add a second registry or hand-maintained inventory.
- Keep catalogue types and projection helpers separate from owner content; never import private implementation identities from owners.
- Verification: [component verification](../../../../../docs/testing/component-contracts.md).
