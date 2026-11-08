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

### Session 2026-11-08 (AGENTS.md thinning)

- **Q: Which rules moved here when the `AGENTS.md` files were thinned?**
  - A: Behaviour rules from root `AGENTS.md`, `PRODUCT.md`, `template-assembly/AGENTS.md`, `template-profiles/thin-start/AGENTS.md` and `src/app/(site)/(dev)/internal/AGENTS.md` (origin/main `3fd01907`) with no other spec home. They are FR-007 to FR-016, with their meaning kept; FR-007 states the Spec Kit delivery set that replaces "stock OpenSpec integration". Demo reset, no-delivery and non-durability describing canonical examples rather than prohibiting real persistence was already FR-003.

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

### FR-007: What a generated project receives

A generated project MUST receive the selected `specs/platform/**` folders, `specs/README.md`, the `specs/product/` skeleton and `.specify/` (constitution, templates, scripts, the main, write-spec and verify workflows, and the Spec Kit skills). It MUST NOT receive `specs/template/`, the create-project or backport workflows, or any plugin.

### FR-008: Specs follow their surface

Ownership MUST select shared media for every profile; marketing content sources, public metadata, composition and pages only with marketing; and dashboard navigation, shell and pages plus entities and files only with the dashboard.

### FR-009: Positive selection only

`create:project` MUST positively select the profile, content mode and opt-in capabilities. There are no exclusion flags, no in-place mutation and no second creation engine.

### FR-010: The receipt is immutable

Missing receipt capabilities MUST normalize to `[]`; later capability markers stay outside the immutable receipt.

### FR-011: One selection drives every output

Generated routes, API exports, configuration, package state, docs ownership and the receipt MUST derive from the same selected surfaces.

### FR-012: Trace only proven edges

Propagation work MUST trace only a changed owner's proven assembly, profile, override, inventory and export edges; canonical identity alone does not justify inspecting every profile. Intentional omissions are preserved, and the thin API is not widened for canonical implementation details.

### FR-013: Report what propagated

After propagation, the focused behaviour checks plus the assembly checks MUST run, and the report names the actual output edges and omissions.

### FR-014: Thin start

Thin start MUST keep `Markdown.Render`, the retained component family entries and their public types while excluding the editor, dashboard, broad helper and unselected surface dependencies. It supports `static` and `payload-ready` content modes and defaults to `payload-ready`.

### FR-015: Internal layout without marketing

`defaultSiteLayout` MUST stay valid in profiles without marketing: optional links derive from the installed app surface registry and the generated internal-route map, and fail closed when a destination is absent.

### FR-016: Internal tree under marketing

In profiles with marketing, the internal tree MUST be relocated beneath `(marketing)` so the marketing layout owns its shell.
