# Specification: Media delivery

**Spec path**: `specs/platform/content/media`

**Migrated from**: OpenSpec `app/shared/frontend/content/media-delivery` (origin/main `3fd01907`)

**Status**: Accepted, living

**Verified by**: `docs/testing/marketing-composition.md` when installed

## Purpose

Keep production media durable, accessible and responsive while preserving actual constituent assets and source-neutral rendering contracts.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, `WHEN`/`THEN` scenarios kept their wording, and capability references became tree paths. The meaning is unchanged.

### Session 2026-11-08 (AGENTS.md thinning)

- **Q: Which rules moved here when the `AGENTS.md` files were thinned?**
  - A: Behaviour rules from `src/lib/marketing-content/AGENTS.md` (origin/main `3fd01907`) with no other spec home. They are FR-005 to FR-008, with their meaning kept; durable constituent assets, source-neutral delivery, purposeful alt text, evidence-based preloading and named local exceptions were already FR-001 to FR-004.

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

### FR-005: Temporary design-tool assets become committed assets

Temporary design-tool assets MUST be downloaded into the owning committed asset boundary; the original URL is provenance only. Production MUST NOT render flattened frames, section captures, task artifacts or expiring Figma/MCP URLs.

### FR-006: Committed raster marketing assets

Committed raster marketing assets MUST use a static import with `next/image`, truthful intrinsic dimensions, responsive `sizes` and `placeholder="blur"` with the generated blur. A public-path string MUST NOT be used where a static import exists, and blur data is never fabricated. SVGs stay vectors, without raster blur.

### FR-007: Static and remote media branches

Decorative and brand imagery SHOULD default to committed presentation assets; editorial and product imagery may come from the configured source. The resolved static branch carries `StaticImageData`, the remote branch carries `src`, `width`, `height` and `blurDataURL`, and both carry alt text. Provider records MUST NOT reach renderers.

### FR-008: Narrow media exceptions

The annotation `averlo-media-exception-next-line <rule> -- <rationale>` exempts one reported rule once, on the next line, never a whole file, and is never used on ordinary imagery. Temporary URLs, reference captures and missing alt text are non-waivable. The media verifier rejects stale annotations.

### FR-009: Pre-captured decorative hero collage

The decorative home hero collage MUST be served as committed pre-captured images of the repository's own live specimens (one per hero breakpoint and app theme, empty alt) rather than assembled in the browser. This narrowly exempts it from the FR-001 and FR-005 capture prohibition; it never covers reference or design-tool captures. When the hero specimens change, `npm run hero:capture` MUST be rerun; `npm run verify:hero-capture` fails while the captures are stale.
