## MODIFIED Requirements

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

## ADDED Requirements

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
