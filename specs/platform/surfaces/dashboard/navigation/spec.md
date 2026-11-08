# Specification: Dashboard route enrichment

**Spec path**: `specs/platform/surfaces/dashboard/navigation`

**Migrated from**: OpenSpec `app/dashboard/navigation/route-enrichment` (origin/main `3fd01907`)

**Status**: Accepted, living

**Verified by**: [docs/testing/routes-and-metadata.md](../../../../../docs/testing/routes-and-metadata.md)

## Purpose

Keep dashboard-specific navigation enrichment consistent with canonical shared destination identity under `specs/platform/navigation/routes`.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, `WHEN`/`THEN` scenarios kept their wording, and capability references became tree paths. The meaning is unchanged.

## Requirements

### FR-001: Route enrichment preserves identity

Dashboard navigation, domain grouping, capability visibility and presentation enrichment MUST preserve the canonical route identity rather than create competing destination definitions.

**Scenario: Destination appears in multiple navigation surfaces**

- **When** the same installed route is offered in sidebar and command navigation
- **Then** both resolve to the same identity and destination despite their different presentation
