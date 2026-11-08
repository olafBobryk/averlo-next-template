# Specification: Media delivery

**Spec path**: `specs/platform/content/media`

**Migrated from**: OpenSpec `app/shared/frontend/content/media-delivery` (origin/main `3fd01907`)

**Status**: Accepted, living

**Verified by**: [docs/testing/marketing-composition.md](../../../../docs/testing/marketing-composition.md)

## Purpose

Keep production media durable, accessible and responsive while preserving actual constituent assets and source-neutral rendering contracts.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, `WHEN`/`THEN` scenarios kept their wording, and capability references became tree paths. The meaning is unchanged.

## Requirements

### FR-001: Durable constituent assets

Production rendering MUST use durable constituent assets rather than expiring design URLs or flattened captures of a reference composition. Supplied source assets MUST preserve their intended bytes and role unless an explicit asset transformation is authorized.

**Scenario: Expiring reference asset**

- **When** a reference supplies a temporary asset URL
- **Then** production uses the durable approved asset rather than depending on the expiring URL

### FR-002: Source-neutral image delivery

Editorial media MUST resolve into the supported frontend media contract with truthful dimensions and alternative text. Committed static raster media MUST use the owning optimized-image defaults, responsive sizing and supported blur behavior; SVG media MUST retain its appropriate vector treatment without invented blur data.

**Scenario: Render provider and static media**

- **When** equivalent editorial media comes from a static source or a provider
- **Then** each renders through the supported media owner with truthful dimensions, sizing and accessibility information

### FR-003: Alternative text follows purpose

Content media MUST have appropriate authored alternative text. Empty alternative text MUST be used only for genuinely decorative media; presentation assets MUST NOT replace readable semantic content.

**Scenario: Decorative and informative images**

- **When** a region contains decorative artwork and an informative image
- **Then** decorative artwork avoids redundant announcements and the informative image exposes its meaningful alternative

### FR-004: Delivery cost follows evidence

Media loading MUST follow its owner defaults. Preloading MUST be reserved for a proven critical image. Any permitted local exception MUST name its specific rule and rationale at the owning use and MUST NOT authorize expiring production URLs or flattened reference captures.

**Scenario: Add a local delivery exception**

- **When** a specific media use cannot follow an otherwise applicable default
- **Then** its documented exception covers only that use and rule while the durable-asset constraints remain intact
