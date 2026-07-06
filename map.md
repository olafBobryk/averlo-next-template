# Orchestration Map: Template

Status: active

## Intent

Show the current template orchestration path. The checkout already exists and
the docked orchestration root is ready, so the visible path starts from that
baseline, sorts source material, then prepares reusable UI surfaces before
shell and page-system work. Reusable page implementation routing lives in a
floating template component until a concrete page packet chooses to instantiate
it.

## Start

- Start: `start`
- Starts: `static-page-implementation-strategy-template-start`

## Shape References

- `shapes/initialization.md`: first visible setup boundary for the existing
  template checkout and docked orchestration root.
- `shapes/source-inventory.md`: collects repo, sibling, cousin, and optional
  design-file source material before reusable UI decisions.
- `shapes/reusable-ui-surface-baseline.md`: maps reusable UI work into stable
  buckets and proves primitives, composites, markdown, and placeholder image
  fallbacks through the internal demo surface.
- `shapes/preview-delivery-baseline.md`: confirms the review deployment path,
  remote/upstream truth, and preview handoff contract before page-system
  workers branch.
- `shapes/template-shell-baseline.md`: records the existing marketing shell,
  route/link IDs, section identity, navigation contract, and shell review
  surfaces before page-system work.
- `shapes/metadata-seo-baseline.md`: records metadata, icons, manifest, route
  metadata, social preview, and verification ownership as a page-system
  infrastructure slice.
- `shapes/static-page-implementation-strategy-template.md`: floating reusable
  template route for future static page work: entry recommendation, optional
  section-defined contract, implementation pass, review routing, and pattern
  return.
- `shapes/first-static-page-implementation-build.md`: connected placeholder
  for the first concrete page build that will choose and instantiate the
  floating static-page template route later.

## Checkpoint References

- `checkpoints/start.md`: marks the existing checkout and orchestration root as
  ready.
- `checkpoints/documentation-baseline-ready-for-source-inventory.md`: marks the
  initialization/documentation baseline as ready for a source-inventory worker.
- `checkpoints/sources-ready-for-reusable-ui.md`: marks source collection and
  bucket classification as ready enough for reusable UI work.
- `checkpoints/reusable-ui-ready-for-page-systems.md`: marks the reusable UI
  baseline as ready for preview-delivery setup before page-system fanout.
- `checkpoints/preview-delivery-ready-for-page-systems.md`: marks the preview
  delivery contract as ready enough for page-system workers to branch.
- `checkpoints/shell-ready-for-page-systems.md`: marks the template shell
  contract as ready for page-system shapes.
- `checkpoints/metadata-seo-ready-for-page-systems.md`: marks metadata/SEO
  ownership as ready enough for page-system workers to consume.
- `checkpoints/first-static-page-instantiation-ready.md`: marks the connected
  first static page placeholder as ready for a future concrete page packet.
- `checkpoints/static-page-implementation-strategy-template-start.md`: floating
  visual start checkpoint for the reusable static-page implementation strategy
  template.
- `checkpoints/static-page-implementation-prep-mode-decision-template.md`:
  floating template decision for direct implementation or section-defined
  contract prep.
- `checkpoints/static-page-human-review-routing-decision-template.md`: floating
  template decision for single page review or parallel section review after
  implementation.

## Active Run References

- none

## Agent References

- none

## Trunk / Flow

- `start` -> `template-and-orchestration-baseline`: the map starts from the
  reached start checkpoint and lands in the current baseline node.
- `template-and-orchestration-baseline` -> `documentation-baseline-and-legacy-classification`:
  baseline truth precedes a light documentation sort before further scaffold
  direction.
- `documentation-baseline-and-legacy-classification` -> `documentation-baseline-ready-for-source-inventory`:
  initialization and documentation sorting pause at a steward checkpoint before
  source inventory begins.
- `documentation-baseline-ready-for-source-inventory` -> `project-source-collection`:
  the steward can stay at the checkpoint and send a source-inventory worker.
- `project-source-collection` -> `optional-figma-source-index`: collected
  sources include an explicit non-blocking design-file index pass.
- `optional-figma-source-index` -> `source-bucket-classification`: supplied or
  absent Figma evidence is known before source signals are bucketed.
- `source-bucket-classification` -> `design-system-port-mapping`: source
  buckets become concrete design-system mapping rows before UI work begins.
- `design-system-port-mapping` -> `sources-ready-for-reusable-ui`: mapped source
  evidence creates the handoff checkpoint into reusable UI work.
- `sources-ready-for-reusable-ui` -> `reusable-ui-bucket-map`: reusable UI work
  starts from the accepted source-bucket boundary.
- `reusable-ui-bucket-map` -> `design-system-port-execution-order`: UI bucket
  ownership is set before Figma design-system port execution begins.
- `design-system-port-execution-order` -> `foundations-and-primitives-baseline`:
  source evidence, mapping, and usage audit precede primitive review.
- `foundations-and-primitives-baseline` -> `composites-baseline`: reusable
  primitives precede reusable composites.
- `composites-baseline` -> `placeholder-image-fallbacks`: reusable composites
  precede source-agnostic placeholder image fallback decisions.
- `placeholder-image-fallbacks` -> `internal-demo-review-surface`: placeholder
  image fallback guidance is reviewed through the shared internal demo when
  coverage exists.
- `internal-demo-review-surface` -> `reusable-ui-ready-for-page-systems`: demo
  coverage creates the checkpoint for preview-delivery setup.
- `reusable-ui-ready-for-page-systems` -> `preview-remote-source-of-truth`:
  preview-delivery setup starts before the first page-system fanout.
- `preview-remote-source-of-truth` -> `production-preview-setup`: remote and
  upstream truth precedes preview deployment/linkage setup.
- `production-preview-setup` -> `preview-handoff-contract`: preview setup
  precedes the handoff contract for workers and human review.
- `preview-handoff-contract` -> `preview-delivery-ready-for-page-systems`:
  confirmed or gated preview delivery creates the first page-system fanout
  checkpoint.
- `preview-delivery-ready-for-page-systems` -> `shell-source-and-id-boundary`:
  the preview-delivery checkpoint can send a marketing shell worker.
- `preview-delivery-ready-for-page-systems` -> `static-page-template-instantiation-placeholder`:
  the preview-delivery checkpoint can send a first static page implementation
  worker to choose how to instantiate the floating template.
- `static-page-template-instantiation-placeholder` -> `first-static-page-instantiation-ready`:
  the placeholder closes at a checkpoint without choosing a concrete page.
- `preview-delivery-ready-for-page-systems` -> `metadata-source-discovery`:
  the preview-delivery checkpoint can send a metadata/SEO baseline worker in
  parallel with shell and first page work.
- `shell-source-and-id-boundary` -> `marketing-shell-structure-baseline`:
  existing IDs and source boundaries precede shell structure review.
- `marketing-shell-structure-baseline` -> `navigation-contract-baseline`: shell
  structure precedes navigation contract review.
- `navigation-contract-baseline` -> `shell-demo-review-surface`: navigation
  contract is verified through existing shell demo surfaces.
- `shell-demo-review-surface` -> `shell-ready-for-page-systems`: shell review
  creates the checkpoint for page-system work.
- `metadata-source-discovery` -> `favicon-and-app-icons`: metadata source truth
  precedes icon and manifest asset ownership.
- `favicon-and-app-icons` -> `global-default-metadata`: app icon and manifest
  decisions precede global metadata defaults.
- `global-default-metadata` -> `route-metadata-pattern`: global metadata
  defaults precede route-level metadata contracts.
- `route-metadata-pattern` -> `social-preview-metadata`: route metadata
  contracts precede social preview metadata decisions.
- `social-preview-metadata` -> `metadata-verification`: social preview source
  decisions precede metadata verification.
- `metadata-verification` -> `metadata-seo-ready-for-page-systems`: metadata
  verification creates the reusable metadata/SEO checkpoint.
- `static-page-implementation-strategy-template-start` -> `static-page-entry-recommendation-template`:
  floating template start edge for visually anchoring the reusable static page
  implementation strategy template.
- `static-page-entry-recommendation-template` -> `static-page-content-data-population-template`:
  floating template flow from entry recommendation into optional static
  content-data readiness before prep-mode decision.
- `static-page-content-data-population-template` -> `static-page-implementation-prep-mode-decision-template`:
  static content-data readiness feeds the human/steward prep-mode decision
  without choosing the final route.
- `static-page-implementation-prep-mode-decision-template` -> `static-page-implementation-pass-template`:
  floating template route for direct implementation when the human/steward
  accepts that prep mode.
- `static-page-implementation-prep-mode-decision-template` -> `static-page-section-defined-contract-template`:
  floating template route for section-defined contract prep when the
  human/steward accepts that prep mode.
- `static-page-section-defined-contract-template` -> `static-page-implementation-pass-template`:
  floating template flow from section-defined contract into the shared page
  implementation pass.
- `static-page-implementation-pass-template` -> `static-page-human-review-routing-decision-template`:
  floating template flow from implementation evidence to human review routing
  decision.
- `static-page-human-review-routing-decision-template` -> `static-page-single-page-review-template`:
  floating template route for one page-level human review packet.
- `static-page-human-review-routing-decision-template` -> `static-page-parallel-section-review-template`:
  floating template route for parallel section review packets after
  implementation.
- `static-page-single-page-review-template` -> `static-page-pattern-return-template`:
  floating template fan-in from single page review to route evidence and
  learning classification.
- `static-page-parallel-section-review-template` -> `static-page-pattern-return-template`:
  floating template fan-in from parallel section review to route evidence and
  learning classification.
- `static-page-pattern-return-template` -> `static-page-quality-harness-template`:
  optional terminal template step for running page-target quality or
  scroll-performance harnesses when the project keeps those tools.

## Intentional Disconnected Components

- Intentional: yes
- Notes: `static-page-implementation-strategy-template` is a floating reusable
  template component. The connected project path reaches only
  `first-static-page-instantiation-ready` until a concrete page build chooses
  and instantiates the template.

## Evidence

- Artifact: `README.md`
- Artifact: `AGENTS.md`
- Artifact: `docs/ORCHESTRATION.md`
- Artifact: `artifacts/documentation-inventory.md`
- Artifact: `artifacts/project-source-index.md`
- Artifact: `artifacts/figma-source-index.md`
- Artifact: `artifacts/source-bucket-classification.md`
- Artifact: `artifacts/design-system-port-mapping.md`
- Artifact: `artifacts/preview-delivery-contract.md`
- Artifact: `artifacts/template-shell-contract.md`
- Artifact: `artifacts/metadata-seo-contract.md`
- Artifact: `artifacts/static-page-doc-template-contract.md`
