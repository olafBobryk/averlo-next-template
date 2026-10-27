## Purpose

Materialize independent projects from explicit positive ownership while preserving selected profile boundaries and excluding template-only machinery.

## ADDED Requirements

### Requirement: Positive output ownership
Generated files, scripts, dependencies and instructions SHALL have explicit assembly owners. Overlapping or missing ownership SHALL fail verification rather than silently select a copy. Source-bearing output SHALL remain file-backed rather than hidden in generated source strings.

#### Scenario: Conflicting output owners
- **WHEN** two assembly owners claim an incompatible destination
- **THEN** assembly verification rejects the conflict instead of producing an arbitrary project

### Requirement: Profiles preserve intentional boundaries
Selected profiles SHALL include their supported contracts and omit unsupported features, routes, dependencies, scripts and teaching. Full and thin-start differences SHALL remain intentional, with overrides limited to material boundaries rather than mirrored canonical source.

#### Scenario: Marketing-only assembly
- **WHEN** a marketing-only project is generated
- **THEN** its output includes applicable public-site contracts and verification without implying absent dashboard capabilities

### Requirement: Independent applicable policy and evidence
Generated projects SHALL receive independent stock OpenSpec integration, project-owned configuration, explicitly selected applicable app contracts and verification procedures/tests. Template contracts, change history, unrelated agent files and generator-only policy SHALL remain excluded. Installed-feature-dependent coverage SHALL match the generated surface.

#### Scenario: Modify a generated specification
- **WHEN** a generated project changes an applicable copied specification
- **THEN** it changes its own copy without mutating the template or another generated project

#### Scenario: Template contracts are excluded
- **WHEN** any supported profile is assembled
- **THEN** its maintained specs contain only explicitly selected app contracts, no template contracts or unprefixed legacy identities, and all app references resolve independently

#### Scenario: Production behavior replaces an example
- **WHEN** an independent app replaces demonstration entities, authentication, storage or contact handling with an authorized real implementation
- **THEN** its inherited app contracts permit real persistence and configured delivery without requiring resettable production entities or unconditional no-delivery behavior

### Requirement: Propagation follows proven ownership
Template changes SHALL propagate only through established assembly edges. Inventories and generated projections SHALL be regenerated from their owners. Instance work SHALL NOT acquire template machinery merely because it shares runtime paths or names.

#### Scenario: Update a canonical shared owner
- **WHEN** a canonical template owner changes
- **THEN** applicable generated outputs follow its established assembly edge while intentional profile omissions remain intact

### Requirement: Independent profile inheritance
Generated projects SHALL inherit the maintained app form contract and stock OpenSpec integration with tests for installed forms only, without template proposal history or references to omitted surfaces.

#### Scenario: Marketing project
- **WHEN** a marketing-only or thin-start project is assembled
- **THEN** contact verification is included and login/support test modules are omitted

#### Scenario: Application project
- **WHEN** an app-only project is assembled
- **THEN** login/support verification is included and contact implementation and test modules are omitted

### Requirement: Independent loading contract inheritance
Generated projects SHALL inherit the maintained app loading contract and verification procedure independently, without template change history. Executable pilot cases SHALL cover installed surfaces only and SHALL NOT retain references to omitted application areas.

#### Scenario: Profile-selected coverage
- **WHEN** a project is assembled with or without dashboard routes
- **THEN** its loading tests match its installed surfaces and omitted dashboard/authentication cases are not imported or executed
