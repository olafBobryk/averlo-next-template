# Artifact: Project Source Index

Status: active

Guide: ../_guides/artifacts/artifact.md

## Intent

Record the source material available to template scaffold and reusable UI work.

## Artifact Type

doc

## Reference

- `artifacts/project-source-index.md`

## Applies To

- `project-source-collection`: source input ledger for the source-inventory
  shape.
- `source-bucket-classification`: upstream evidence for bucket decisions.

## Evidence Role

source

## Source Rows

| Source ID | Source Type | Path Or Link | Evidence Role | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `template-agents` | repo-doc | `AGENTS.md` | agent rules | active | Current template operating guidance. |
| `template-readme` | repo-doc | `README.md` | project overview | active | Current public template overview. |
| `template-components-guidance` | repo-doc | `src/components/AGENTS.md` | UI ownership | active | Defines reusable component workflow and buckets. |
| `template-composites-guidance` | repo-doc | `src/components/composites/AGENTS.md` | composite ownership | active | Defines composites as source-agnostic reusable surfaces. |
| `template-markdown-guidance` | repo-doc | `src/components/composites/markdown/AGENTS.md` | markdown composite | active | Defines markdown renderer scope. |
| `template-internal-demo` | current-code | `src/app/(site)/(marketing)/internal/demo/content.tsx` | review surface | active | Reusable UI demo surface. |
| `sibling-cousin-evidence` | external-evidence | source projects named by maintainer | comparison | available-as-needed | Use only for generic reusable lessons. |
| `figma-source` | design-link | `artifacts/figma-source-index.md` | optional source | not-supplied | No Figma file is required for this template scaffold. |

## Notes

- Source rows may inform scaffold direction only after bucket classification.
- Product-specific names, route copy, assets, local runtime state, and commits
  should stay out of generic scaffold rows unless a later artifact explicitly
  needs evidence.
