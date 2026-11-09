# Specification: Dashboard route enrichment

**Spec path**: `specs/platform/surfaces/dashboard/navigation`

**Status**: Accepted, living

**Verified by**: [docs/testing/routes-and-metadata.md](../../../../../docs/testing/routes-and-metadata.md)

## Purpose

Keep dashboard-specific navigation enrichment consistent with canonical shared destination identity under `specs/platform/navigation/routes`.

## Requirements

### FR-001: Route enrichment preserves identity

Dashboard navigation, domain grouping, capability visibility and presentation enrichment MUST preserve the canonical route identity rather than create competing destination definitions.

**Scenario: Destination appears in multiple navigation surfaces**

- **When** the same installed route is offered in sidebar and command navigation
- **Then** both resolve to the same identity and destination despite their different presentation

### FR-002: Domain reporting is observed activity

Dashboard domain reporting MUST derive from relative edited paths and is observed activity only, never proof that a domain was inspected or corrected.

### FR-003: What dashboard metadata adds

Dashboard metadata MUST enrich the shared identity with labels, descriptions, icons, capabilities, layout width, navigation placement, parent hierarchy, domain ownership and source roots, and commands. Marketing and authentication surfaces do not inherit dashboard information architecture.

### FR-004: Only product destinations are surfaces

Summaries, filters, helper UI, repeated renderings, nested actions and developer routes MUST NOT be registered as peer product surfaces.

### FR-005: Contextual actions belong to their surface

A contextual action MUST belong to its canonical surface; a modal-backed command requires an exposed owning action API (`specs/platform/surfaces/dashboard/shell` FR-008).
