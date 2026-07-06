# Artifact: Source Bucket Classification

Status: active

Guide: ../_guides/artifacts/artifact.md

## Intent

Map source signals into reusable UI ownership buckets before implementation
work starts.

## Artifact Type

doc

## Reference

- `artifacts/source-bucket-classification.md`

## Applies To

- `source-bucket-classification`: bucket decisions from collected sources.
- `reusable-ui-bucket-map`: accepted input for reusable UI baseline work.
- `design-system-port-mapping`: bucket input for source-to-component rows.
- `composites-baseline`: markdown renderer bucket ownership.

## Evidence Role

decision-support

## Accepted Buckets

- `foundations`
- `primitives`
- `input`
- `misc`
- `overlays`
- `motion`
- `composites`
- `domain`
- `route-local`
- `skip`

## Classification Rows

| Signal | Source | Bucket | Status | Next Action |
| --- | --- | --- | --- | --- |
| Component workflow guidance | `src/components/AGENTS.md` | foundations | active | Use as top-level UI ownership rule. |
| Base UI controls | `src/components/ui/AGENTS.md` | primitives | active | Review tokens, text, button, field, panel, section, and icon surfaces here. |
| Choice and form controls | `src/components/ui/input/**` | input | active | Keep form controls under the input bucket. |
| Feedback and state helpers | `src/components/ui/misc/**` | misc | active | Keep reusable state surfaces outside route code. |
| Modal and toast hosts | `src/components/ui/overlays/**` | overlays | active | Keep portal-backed surfaces in overlay ownership. |
| Reveal and scroll helpers | `src/components/ui/motion/**` | motion | active | Keep reusable motion separate from page choreography. |
| Markdown renderer | `src/components/composites/markdown/**` | composites | active | Treat markdown rendering as a reusable composite. |
| Placeholder image fallbacks | reusable UI fallback guidance | composites | planned | Keep temporary image placeholders reusable while final imagery stays page/source-owned. |
| Route search or caller-data widgets | `src/components/domain/**` | domain | active | Keep data-source agnostic domain widgets here. |
| Page shell and route wrappers | route folders | route-local | gated | Keep outside shared UI until accepted as reusable. |
| Product-specific source copy or assets | source projects | skip | skipped | Do not import into template scaffold by default. |

## Notes

- Bucket rows point to ownership and next reading paths; they do not authorize
  implementation by themselves.
- Source-backed UI work should become a mapping row in
  `artifacts/design-system-port-mapping.md` before token, primitive, consumer,
  demo, or docs changes begin.
