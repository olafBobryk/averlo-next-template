# Workpiece: Design System Port Execution Order

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Apply the Figma Design System Port workflow after source mapping and before
primitive implementation.

## Acceptance

- Design-system work follows this order: evidence, mapping table, usage audit,
  tokens, primitives, consumers, demos, docs.
- Figma layer names remain visual labels; component APIs use stable code names.
- Existing component usage is audited before variant or prop changes.
- Review surfaces are updated after reusable code changes.

## Tests

- Check `artifacts/design-system-port-mapping.md` exists before this workpiece
  is considered ready.
- Check component API changes reference a usage audit in return evidence.
- Run lint/build and inspect the internal demo route for any later code packet.

## Artifacts

- `artifacts/design-system-port-mapping.md`
- `src/components/AGENTS.md`
- `src/app/(site)/(marketing)/internal/demo/content.tsx`

## Commit Evidence

- none

## Notes

- Use `$figma-design-system-port` when a supplied Figma frame is the source for
  repo-level tokens, typography, primitives, or component APIs.
