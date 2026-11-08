# Specification: Project assembly

**Spec path**: `specs/template/assembly`

**Migrated from**: OpenSpec `template/assembly/project-assembly` (origin/main `3fd01907`)

**Status**: Accepted, living. Canonical-only: never copied into a generated project.

**Verified by**: [docs/operations/project-assembly.md](../../../docs/operations/project-assembly.md)

## Purpose

Materialize independent projects from explicit positive ownership while preserving selected profile boundaries and excluding template-only machinery.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format, plus one decided substitution. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, and scenarios kept their wording. Olaf decided on 8 November 2026 that Spec Kit replaces OpenSpec entirely, so "stock OpenSpec integration" now reads "stock Spec Kit integration (`.specify/`)", "app contracts" now reads "platform specs" (`specs/platform/**`), "template contracts" means `specs/template/**`, and "proposal history" means template change history (FR-003, FR-005).
- **Q: What does a generated project receive?**
  - A: The selected `specs/platform/**` specs, `.specify/` (constitution, templates, scripts, workflows, integrations) and an empty `specs/product/` skeleton. Never `specs/template/**`. Clones are never forced to pull later template changes (FR-003, FR-004).

## Requirements

### FR-001: Positive output ownership

Generated files, scripts, dependencies and instructions MUST have explicit assembly owners. Overlapping or missing ownership MUST fail verification rather than silently select a copy. Source-bearing output MUST remain file-backed rather than hidden in generated source strings.

**Scenario: Conflicting output owners**

- **When** two assembly owners claim an incompatible destination
- **Then** assembly verification rejects the conflict instead of producing an arbitrary project

### FR-002: Profiles preserve intentional boundaries

Selected profiles MUST include their supported contracts and omit unsupported features, routes, dependencies, scripts and teaching. Full and thin-start differences MUST remain intentional, with overrides limited to material boundaries rather than mirrored canonical source.

**Scenario: Marketing-only assembly**

- **When** a marketing-only project is generated
- **Then** its output includes applicable public-site contracts and verification without implying absent dashboard capabilities

### FR-003: Independent applicable policy and evidence

Generated projects MUST receive independent stock Spec Kit integration (`.specify/`), project-owned configuration, explicitly selected applicable platform specs (`specs/platform/**`) and verification procedures/tests. Template specs (`specs/template/**`), change history, unrelated agent files and generator-only policy MUST remain excluded. Installed-feature-dependent coverage MUST match the generated surface.

**Scenario: Modify a generated specification**

- **When** a generated project changes an applicable copied specification
- **Then** it changes its own copy without mutating the template or another generated project

**Scenario: Template contracts are excluded**

- **When** any supported profile is assembled
- **Then** its maintained specs contain only explicitly selected platform specs, no template specs or unprefixed legacy identities, and all platform spec references resolve independently

**Scenario: Production behavior replaces an example**

- **When** an independent app replaces demonstration entities, authentication, storage or contact handling with an authorized real implementation
- **Then** its inherited platform specs permit real persistence and configured delivery without requiring resettable production entities or unconditional no-delivery behavior

### FR-004: Propagation follows proven ownership

Template changes MUST propagate only through established assembly edges. Inventories and generated projections MUST be regenerated from their owners. Instance work MUST NOT acquire template machinery merely because it shares runtime paths or names.

**Scenario: Update a canonical shared owner**

- **When** a canonical template owner changes
- **Then** applicable generated outputs follow its established assembly edge while intentional profile omissions remain intact

### FR-005: Independent profile inheritance

Generated projects MUST inherit the maintained `specs/platform/data/forms` contract and stock Spec Kit integration (`.specify/`) with tests for installed forms only, without template change history or references to omitted surfaces.

**Scenario: Marketing project**

- **When** a marketing-only or thin-start project is assembled
- **Then** contact verification is included and login/support test modules are omitted

**Scenario: Application project**

- **When** an app-only project is assembled
- **Then** login/support verification is included and contact implementation and test modules are omitted

### FR-006: Independent loading contract inheritance

Generated projects MUST inherit the maintained `specs/platform/data/loading` contract and verification procedure independently, without template change history. Executable pilot cases MUST cover installed surfaces only and MUST NOT retain references to omitted application areas.

**Scenario: Profile-selected coverage**

- **When** a project is assembled with or without dashboard routes
- **Then** its loading tests match its installed surfaces and omitted dashboard/authentication cases are not imported or executed

