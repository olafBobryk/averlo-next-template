# Workpiece: Optional Figma Source Index

Status: planned

Role: template

Guide: ../_guides/artifacts/workpiece.md

## Intent

Record Figma file or node sources when a project supplies them, while keeping
the source-inventory path usable when no Figma file exists.

## Acceptance

- `artifacts/figma-source-index.md` contains supplied Figma rows or a clear
  `No Figma source supplied` row.
- Figma rows are evidence rows, not automatic implementation authority.
- Missing Figma evidence does not block source-bucket classification.

## Tests

- Check the Figma artifact exists.
- Check absence of Figma source is represented as `not-supplied`, not as a
  failed graph state.
- Run the shape-strategy adapter against `docs/orchestration`.

## Artifacts

- `artifacts/figma-source-index.md`
- `artifacts/project-source-index.md`

## Commit Evidence

- none

## Notes

- Use design-file details only when supplied by the project or discovered in
  accepted source material.
