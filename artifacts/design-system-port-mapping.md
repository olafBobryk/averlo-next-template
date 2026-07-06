# Artifact: Design System Port Mapping

Status: active

Guide: ../_guides/artifacts/artifact.md

## Intent

Record the bridge from source evidence to stable component IDs, explicit
variants, review surfaces, and design-system port execution.

## Artifact Type

doc

## Reference

- `artifacts/design-system-port-mapping.md`

## Applies To

- `design-system-port-mapping`: source-to-component mapping table.
- `design-system-port-execution-order`: required input before implementation
  order begins.
- `foundations-and-primitives-baseline`: component and variant targets.
- `composites-baseline`: reusable composite targets.

## Evidence Role

decision-support

## Operating Rules

- Source IDs are evidence handles; component IDs are code handles.
- Figma layer names are visual labels, not final API names.
- Component variants should be explicit props when source evidence needs stable
  review buckets.
- A mapping row does not authorize implementation until the relevant packet is
  accepted.
- When Figma is supplied, use `$figma-design-system-port` for the port order:
  evidence, mapping table, usage audit, tokens, primitives, consumers, demos,
  docs.

## Mapping Columns

| Column | Meaning |
| --- | --- |
| Source ID | Stable source handle from `project-source-index.md` or `figma-source-index.md`. |
| Figma Node | Optional file or node ID; use `not-supplied` when absent. |
| Observed Pattern | Human-readable UI signal from the source. |
| Bucket | Accepted ownership bucket. |
| Component ID | Stable code concept, such as `ui.primitives.Button`. |
| Explicit Variants | Props or variant names that make the component reviewable. |
| Review Surface | Internal route or demo surface that should show the component. |
| Decision | `adopt`, `adapt`, `defer`, `gate`, or `skip`. |
| Next Action | What the next implementation packet should do. |

## Current Mapping Rows

| Source ID | Figma Node | Observed Pattern | Bucket | Component ID | Explicit Variants | Review Surface | Decision | Next Action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `template-components-guidance` | not-supplied | Library-first component ownership | foundations | `components.library` | bucket ownership | `/internal/demo` | adopt | Keep as top-level reusable UI rule. |
| `template-components-guidance` | not-supplied | Button-like actions and links | primitives | `ui.primitives.Button` | `variant`, `size`, `radius`, `align`, icons | `/internal/demo/ui/primitives` | adopt | Audit usage before changing variants. |
| `template-components-guidance` | not-supplied | Typography roles | primitives | `ui.primitives.Text` | `variant`, `tone`, `theme`, `interactive` | `/internal/demo/ui/primitives` | adopt | Audit usage before adding or removing text variants. |
| `template-components-guidance` | not-supplied | Field labels, descriptions, errors | primitives | `ui.primitives.Field` | label, description, error, required | `/internal/demo/ui/input` | adopt | Keep input wrappers routed through `Field`. |
| `template-components-guidance` | not-supplied | Input shell styling | primitives | `ui.primitives.InputFrame` | frame variant and size props | `/internal/demo/ui/input` | adopt | Keep text-like controls on shared input shells. |
| `template-components-guidance` | not-supplied | Choice controls | input | `ui.input.choice` | selected, disabled, tone, option IDs | `/internal/demo/ui/input/choice` | adopt | Preserve explicit choice states in demos. |
| `template-markdown-guidance` | not-supplied | Markdown rendered through design-system primitives | composites | `ui.composites.MarkdownRenderer` | `::button` directive `variant` and `size` | `/internal/demo/composites/markdown` | adopt | Keep markdown as a composite, not a page-system shape. |
| `sibling-cousin-evidence` | not-supplied | Stable component IDs and explicit visual variants | all reusable buckets | `source-mapped.component` | component-specific variant props | bucket-specific demo route | adapt | Use this naming discipline when adding source-backed rows. |
| `figma-source` | not-supplied | Optional design-system frame evidence | all reusable buckets | `figma-mapped.component` | source-backed variant props | bucket-specific demo route | gate | When supplied, add node rows before implementation. |

## Execution Order

1. Evidence: confirm source rows and collect Figma context, screenshot,
   metadata, and variables when available.
2. Mapping table: map source examples to buckets, stable component IDs, explicit
   variants, and review surfaces.
3. Usage audit: search current component usage before changing APIs.
4. Tokens: update shared color, spacing, radius, typography, or motion tokens
   first when accepted.
5. Primitives: update canonical primitives and input shells next.
6. Consumers: migrate callers after the primitive contract is stable.
7. Demos: update internal demo or review surfaces with mapped states.
8. Docs: update nearby `AGENTS.md`, orchestration artifacts, and any port notes.

## Notes

- Use `$figma-frame-visual-diff` only when a specific component or frame needs
  stricter screenshot parity evidence.
- This artifact is intentionally source-generic until a project supplies a
  concrete design file.
