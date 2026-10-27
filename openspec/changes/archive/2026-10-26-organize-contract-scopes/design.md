# Design

## Context

See proposal.md for the motivation and capability list. Twenty maintained contracts are selected through explicit core/surface ownership; live docs and operational workflows refer to their current identities. The generated-profile reference scanner assumes a fixed path depth. Historical archives document previous migrations and retain their original paths.

## Goals / Non-Goals

**Goals:** One canonical home per behavior, clear scope selection, preserved obligations and self-contained independent generated projects.

**Non-Goals:** Runtime changes, feature installation from folder membership, a parent policy spec, a capability index, a routing skill, a custom schema, fixture policy in product contracts, or manufactured product requirements.

## Decisions

### Scope first, responsibility second

Use template/assembly/project-assembly and template/demonstrations/demo-behavior for canonical-only guarantees. Reusable app contracts have shared/, marketing/ and dashboard/ scopes. Shared frontend groups supported components, interaction, navigation and presentation content. Shared services group identity, files, delivery and transport. Shared data-lifecycle retains entire form, action and read lifecycles across client/server. This avoids splitting complete user operations merely by implementation layer.

The exact twenty relocations and two extractions are in migration-map.json. It is change-local reconciliation evidence, not a maintained routing index.

### Split mixed requirements without duplicating policy

Move Route enrichment preserves identity and its scenario from shared route-identity into dashboard/navigation/route-enrichment. The first three route requirements stay shared.

Split Family title and indexing policy into Private title and indexing policy (dashboard, auth and development title/indexing sentences) in shared document-metadata and Public title policy (public home and other title sentence) in marketing public-document-metadata. Decompose its mixed scenario into explicit private and public scenarios; neither outcome is lost. Move Metadata and body share authoritative content and its scenario wholly into public-document-metadata, which depends on marketing source-resolution. Shared canonical destination consistency and centrally derived app identity remain shared. The public spec refers to shared metadata rather than redefining it.

All other requirement bodies and scenarios remain unchanged except scoped reference normalization. Product requirements remain distinct from reusable behavior even when they concern UI. Reserve product/ for a generated project's own business capabilities; describe this in existing guidance, but create no empty spec, parent requirement or invented domain.

### Discovery uses existing entry points

Keep stock list/show/change operations and stock integration instructions unchanged. Update root and nearest AGENTS, PRODUCT, README and supported config context to explain the scope axes. Start with the changed surface, read only relevant shared dependencies and existing product capabilities, and read template contracts only for actual canonical template/demo/assembly work. Families organize capabilities and do not imply reading siblings. Product business rules refine generic implementation contracts; any incompatible obligation needs an explicit spec change, not silent precedence. Procedures retain execution instructions and WORKFLOWS remains names-only.

### Explicit assembly selection remains authoritative

Update proven manifest/surface/renderer/inventory edges. Shared media-delivery becomes core because its semantics cover media outside marketing. Marketing source-resolution and new public-document-metadata become marketing-selected. New route-enrichment is dashboard-selected. Entity presentation, private file access and configured contact delivery retain their current conditional surface selection despite living under shared/. Folder placement does not install routes/providers or otherwise widen feature support.

Expected selected app counts are full 20, app-only 16, marketing-only and thin-start 17. Generated projects receive only selected independent app copies and project-owned guidance/config. No template contracts, template product specs, source baseline, reconciliation evidence or change history is copied. Newly authored product contracts belong to the independent project.

Core routes/metadata verification guidance names optional surface-specific IDs conditionally rather than linking to absent files. Selected maintained spec references must resolve independently. Replace fixed-depth matching with variable-depth capability matching plus explicit scope validation; retain negative coverage for stale identities, missing dependencies, template/history leakage, conflicting ownership and shared-copy mutation.

## Risks / Trade-offs

- A relocation can drop clauses or break deep relative references → snapshot all original full texts and hashes before sync, audit exact normalized requirements/scenarios, explicitly reconcile the one mixed scenario decomposition, and check live/generated reference closure.
- A taxonomy can be mistaken for implicit inheritance → preserve explicit positive ownership and verify exact expected sets for every profile.
- Existing repo-wide failures can obscure a docs/assembly migration → run focused reference/workflow/assembly checks and report pre-existing unrelated failures separately; do not repair unrelated runtime code.
- Deep paths cost readability → keep cohesive capability leaf names and avoid extra product domain levels until a project has real business requirements.

## Migration Plan

1. Prepare/validate standard change artifacts and immutable baseline; enable supported capability retirement.
2. Sync added capabilities and retire all twenty old identities after verifying safe retirement and preserving source recovery evidence.
3. In parallel update live guidance/references and assembly selection/verifiers. Regenerate inventories from owners.
4. Prove clause conservation, main/change strict validation, discovery, reference closure and all seven supported source-only assembly combinations; run focused workflow/reference regression checks and applicable assembly creation checks.
5. Archive only after completed tasks and evidence. Keep historical archives unchanged. Rollback the migration's own changed files from captured original sources and explicit mapping; do not reset the dirty worktree.
