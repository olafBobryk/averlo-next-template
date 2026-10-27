# route-enrichment Specification

## Purpose

Keep dashboard-specific navigation enrichment consistent with canonical shared destination identity under `app/shared/frontend/navigation/route-identity`.

## Requirements

### Requirement: Route enrichment preserves identity
Dashboard navigation, domain grouping, capability visibility and presentation enrichment SHALL preserve the canonical route identity rather than create competing destination definitions.

#### Scenario: Destination appears in multiple navigation surfaces
- **WHEN** the same installed route is offered in sidebar and command navigation
- **THEN** both resolve to the same identity and destination despite their different presentation
