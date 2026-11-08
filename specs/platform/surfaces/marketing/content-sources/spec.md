# Specification: Marketing content sources

**Spec path**: `specs/platform/surfaces/marketing/content-sources`

**Migrated from**: OpenSpec `app/marketing/content-sources/source-resolution` (origin/main `3fd01907`)

**Status**: Accepted, living

**Verified by**: [docs/testing/content-sources.md](../../../../../docs/testing/content-sources.md)

## Purpose

Keep marketing content source-neutral and predictable across static, guarded CMS-ready and explicitly activated authoritative CMS modes.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, `WHEN`/`THEN` scenarios kept their wording, and capability references became tree paths. The meaning is unchanged.

### Session 2026-11-08 (AGENTS.md thinning)

- **Q: Which rules moved here when the `AGENTS.md` files were thinned?**
  - A: Behaviour rules from `src/payload/AGENTS.md` and `src/lib/marketing-content/AGENTS.md` (origin/main `3fd01907`) with no other spec home. They are FR-005 to FR-008, with their meaning kept. Server normalization into one contract, the retained fallback baseline and fail-closed authoritative content were already FR-001 to FR-004.

## Requirements

### FR-001: Explicit source modes

Static mode MUST operate without a CMS runtime dependency. CMS-ready mode MUST keep admin and API routes unavailable with static fallback authoritative. CMS-powered mode MUST activate only after schema, service, seed, readback and parity gates succeed.

**Scenario: Unconfigured CMS-ready project**

- **When** a CMS-ready project has not completed activation
- **Then** guarded CMS entry points do not imply availability and public content continues through its permitted static fallback

### FR-002: One normalized frontend contract

Static and provider content MUST resolve on the server into the same source-neutral page, site-layout and section contracts. Provider-specific records and metadata MUST NOT require a second frontend layout implementation.

**Scenario: Switch an approved page source**

- **When** a page moves from static content to an activated provider source
- **Then** equivalent normalized content renders through the same frontend section and shell contracts

### FR-003: Preserve recovery data until verified activation

The static seed baseline and permitted recovery source MUST remain available until successful provider readback and parity verification establish activation.

**Scenario: Seed without successful readback**

- **When** provider seeding finishes but readback or parity fails
- **Then** activation is incomplete and the permitted recovery baseline is retained

### FR-004: Authoritative failure is not silent fallback

After a source is authoritative, missing, unpublished, invalid or failed authoritative content MUST follow its explicit unavailable/error behavior rather than silently substituting stale static content. Authentication MUST protect guarded authoring boundaries.

**Scenario: Unpublished authoritative document**

- **When** an activated authoritative page is unpublished or invalid
- **Then** its public response follows authoritative unavailability instead of quietly displaying the old static document

### FR-005: `MARKETING_CONTENT_SOURCE` gates provider reads

`MARKETING_CONTENT_SOURCE` MUST stay `fallback` until the published `site-layout` global and the marketing page documents pass seed and readback. Adapters read published content only when `MARKETING_CONTENT_SOURCE=payload`.

### FR-006: Verifiers gate activation; they do not activate

Seed and readback verifiers are activation gates, not permission to expose the disabled admin or API routes. A resolver or seed MUST NOT activate them.

### FR-007: Contracts extend deliberately

Frontend content contracts MUST be extended deliberately, with every selected source adapted. Activation MUST NOT introduce a CMS-specific frontend layout or replace the layout model.

### FR-008: Implementation never authorizes live resources

Schema, normalization, seed or activation work MUST NOT authorize live provisioning, credentials, deployment or production resource changes; Neon, Vercel Blob and Vercel environment or secret changes stay in their operational workflow. A passing fixture verifier grants no such permission.
