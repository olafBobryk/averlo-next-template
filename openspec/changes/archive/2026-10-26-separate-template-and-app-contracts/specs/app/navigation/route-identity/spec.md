## Purpose

Keep installed destinations, semantic ancestry and contextual navigation consistent across public, authentication and dashboard route families.

## ADDED Requirements

### Requirement: Canonical installed destinations
Each installed product route SHALL have one canonical family identity and supported destination contract. Dynamic destinations SHALL use their typed parameters. Internal development routes SHALL remain distinct from product route identity. Omitted profile features SHALL NOT appear as installed destinations.

#### Scenario: Navigate to a dynamic detail
- **WHEN** navigation targets an installed detail with a resource identifier
- **THEN** all participating surfaces derive the same supported destination from its canonical identity and parameters

### Requirement: Semantic ancestry and consistent vocabulary
Navigation, breadcrumbs, page headings, loading labels and contextual commands SHALL use consistent destination vocabulary. Breadcrumbs SHALL contain navigable semantic ancestors rather than filesystem parents or arbitrary cross-links, and the current destination SHALL remain the page heading.

#### Scenario: Detail outside a filesystem-shaped hierarchy
- **WHEN** a detail's semantic parent differs from its directory ancestry
- **THEN** its trail uses the navigable semantic parent and does not invent intermediate breadcrumb destinations

### Requirement: Contextual actions follow the active surface
Surface-specific actions SHALL be available only while their owning surface is active and SHALL unregister on departure. Command search SHALL close before executing an action or navigation. Action visibility SHALL NOT replace server authorization under `app/identity/access-and-membership`.

#### Scenario: Leave a surface with contextual commands
- **WHEN** the active surface unmounts and another route opens
- **THEN** its former contextual commands are no longer offered

### Requirement: Route enrichment preserves identity
Dashboard navigation, domain grouping, capability visibility and presentation enrichment SHALL preserve the canonical route identity rather than create competing destination definitions.

#### Scenario: Destination appears in multiple navigation surfaces
- **WHEN** the same installed route is offered in sidebar and command navigation
- **THEN** both resolve to the same identity and destination despite their different presentation
