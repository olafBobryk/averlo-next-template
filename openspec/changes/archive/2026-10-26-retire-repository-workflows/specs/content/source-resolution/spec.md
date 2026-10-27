# Content source resolution delta

## Purpose

Keep marketing content source-neutral and predictable across static, guarded CMS-ready and explicitly activated authoritative CMS modes.

## ADDED Requirements

### Requirement: Explicit source modes
Static mode SHALL operate without a CMS runtime dependency. CMS-ready mode SHALL keep admin and API routes unavailable with static fallback authoritative. CMS-powered mode SHALL activate only after schema, service, seed, readback and parity gates succeed.

#### Scenario: Unconfigured CMS-ready project
- **WHEN** a CMS-ready project has not completed activation
- **THEN** guarded CMS entry points do not imply availability and public content continues through its permitted static fallback

### Requirement: One normalized frontend contract
Static and provider content SHALL resolve on the server into the same source-neutral page, site-layout and section contracts. Provider-specific records and metadata SHALL NOT require a second frontend layout implementation.

#### Scenario: Switch an approved page source
- **WHEN** a page moves from static content to an activated provider source
- **THEN** equivalent normalized content renders through the same frontend section and shell contracts

### Requirement: Preserve recovery data until verified activation
The static seed baseline and permitted recovery source SHALL remain available until successful provider readback and parity verification establish activation.

#### Scenario: Seed without successful readback
- **WHEN** provider seeding finishes but readback or parity fails
- **THEN** activation is incomplete and the permitted recovery baseline is retained

### Requirement: Authoritative failure is not silent fallback
After a source is authoritative, missing, unpublished, invalid or failed authoritative content SHALL follow its explicit unavailable/error behavior rather than silently substituting stale static content. Authentication SHALL protect guarded authoring boundaries.

#### Scenario: Unpublished authoritative document
- **WHEN** an activated authoritative page is unpublished or invalid
- **THEN** its public response follows authoritative unavailability instead of quietly displaying the old static document
