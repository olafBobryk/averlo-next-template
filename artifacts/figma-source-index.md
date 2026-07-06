# Artifact: Figma Source Index

Status: active

Guide: ../_guides/artifacts/artifact.md

## Intent

Record Figma file or node sources when supplied, while keeping the source
inventory path usable without Figma.

## Artifact Type

doc

## Reference

- `artifacts/figma-source-index.md`

## Applies To

- `optional-figma-source-index`: optional design-file source ledger.
- `source-bucket-classification`: design evidence when supplied.
- `design-system-port-mapping`: optional Figma node evidence for mapping rows.

## Evidence Role

source

## Figma Source Rows

| Source ID | File Or Node Label | URL | Node ID | Read Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `figma-not-supplied` | No Figma source supplied | none | not-supplied | not-supplied | Continue from repo, sibling, cousin, and current-code evidence. |

## Notes

- Figma evidence is optional unless a future project explicitly supplies and
  requires it.
- A supplied file or node should be added here before deriving UI buckets or
  component mapping rows from design evidence.
- When a source is supplied, record whether design context, screenshot,
  metadata, and variables were captured before implementation.
