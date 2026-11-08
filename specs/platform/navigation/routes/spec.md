# Specification: Route identity

**Spec path**: `specs/platform/navigation/routes`

**Migrated from**: OpenSpec `app/shared/frontend/navigation/route-identity` (origin/main `3fd01907`)

**Status**: Accepted, living

**Verified by**: [docs/testing/routes-and-metadata.md](../../../../docs/testing/routes-and-metadata.md)

## Purpose

Keep installed destinations, semantic ancestry and contextual navigation consistent across public, authentication and dashboard route families.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, `WHEN`/`THEN` scenarios kept their wording, and capability references became tree paths. The meaning is unchanged.

### Session 2026-11-08 (AGENTS.md thinning)

- **Q: Which rules moved here when the `AGENTS.md` files were thinned?**
  - A: Behaviour rules from `src/lib/surfaces/AGENTS.md` (origin/main `3fd01907`) with no other spec home. It is FR-004, with its meaning kept. One identity per destination, no parallel maps, semantic ancestry, contextual-command unregistration and closing command search before execution were already FR-001 to FR-003.

## Requirements

### FR-001: Canonical installed destinations

Each installed product route MUST have one canonical family identity and supported destination contract. Dynamic destinations MUST use their typed parameters. Internal development routes MUST remain distinct from product route identity. Omitted profile features MUST NOT appear as installed destinations.

**Scenario: Navigate to a dynamic detail**

- **When** navigation targets an installed detail with a resource identifier
- **Then** all participating surfaces derive the same supported destination from its canonical identity and parameters

### FR-002: Semantic ancestry and consistent vocabulary

Navigation, breadcrumbs, page headings, loading labels and contextual commands MUST use consistent destination vocabulary. Breadcrumbs MUST contain navigable semantic ancestors rather than filesystem parents or arbitrary cross-links, and the current destination MUST remain the page heading.

**Scenario: Detail outside a filesystem-shaped hierarchy**

- **When** a detail's semantic parent differs from its directory ancestry
- **Then** its trail uses the navigable semantic parent and does not invent intermediate breadcrumb destinations

### FR-003: Contextual actions follow the active surface

Surface-specific actions MUST be available only while their owning surface is active and MUST unregister on departure. Command search MUST close before executing an action or navigation. Action visibility MUST NOT replace server authorization under `specs/platform/services/identity`.

**Scenario: Leave a surface with contextual commands**

- **When** the active surface unmounts and another route opens
- **Then** its former contextual commands are no longer offered

### FR-004: Identity verification covers its edges

Route identity verification MUST cover dynamic-parameter escaping, exact and pattern lookup, and absent-profile boundaries.
