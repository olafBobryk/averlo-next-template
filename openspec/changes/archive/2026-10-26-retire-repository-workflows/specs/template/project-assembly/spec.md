# Project assembly delta

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
Generated projects SHALL receive independent applicable OpenSpec integration, configuration, maintained specs and verification procedures/tests. Template change history, unrelated agent files and generator-only policy SHALL remain excluded. Installed-feature-dependent coverage SHALL match the generated surface.

#### Scenario: Modify a generated specification
- **WHEN** a generated project changes an applicable copied specification
- **THEN** it changes its own copy without mutating the template or another generated project

### Requirement: Propagation follows proven ownership
Template changes SHALL propagate only through established assembly edges. Inventories and generated projections SHALL be regenerated from their owners. Instance work SHALL NOT acquire template machinery merely because it shares runtime paths or names.

#### Scenario: Update a canonical shared owner
- **WHEN** a canonical template owner changes
- **THEN** applicable generated outputs follow its established assembly edge while intentional profile omissions remain intact
