# Media delivery delta

## Purpose

Keep production media durable, accessible and responsive while preserving actual constituent assets and source-neutral rendering contracts.

## ADDED Requirements

### Requirement: Durable constituent assets
Production rendering SHALL use durable constituent assets rather than expiring design URLs or flattened captures of a reference composition. Supplied source assets SHALL preserve their intended bytes and role unless an explicit asset transformation is authorized.

#### Scenario: Expiring reference asset
- **WHEN** a reference supplies a temporary asset URL
- **THEN** production uses the durable approved asset rather than depending on the expiring URL

### Requirement: Source-neutral image delivery
Editorial media SHALL resolve into the supported frontend media contract with truthful dimensions and alternative text. Committed static raster media SHALL use the owning optimized-image defaults, responsive sizing and supported blur behavior; SVG media SHALL retain its appropriate vector treatment without invented blur data.

#### Scenario: Render provider and static media
- **WHEN** equivalent editorial media comes from a static source or a provider
- **THEN** each renders through the supported media owner with truthful dimensions, sizing and accessibility information

### Requirement: Alternative text follows purpose
Content media SHALL have appropriate authored alternative text. Empty alternative text SHALL be used only for genuinely decorative media; presentation assets SHALL NOT replace readable semantic content.

#### Scenario: Decorative and informative images
- **WHEN** a region contains decorative artwork and an informative image
- **THEN** decorative artwork avoids redundant announcements and the informative image exposes its meaningful alternative

### Requirement: Delivery cost follows evidence
Media loading SHALL follow its owner defaults. Preloading SHALL be reserved for a proven critical image. Any permitted local exception SHALL name its specific rule and rationale at the owning use and SHALL NOT authorize expiring production URLs or flattened reference captures.

#### Scenario: Add a local delivery exception
- **WHEN** a specific media use cannot follow an otherwise applicable default
- **THEN** its documented exception covers only that use and rule while the durable-asset constraints remain intact
