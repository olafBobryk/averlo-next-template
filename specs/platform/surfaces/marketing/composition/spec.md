# Specification: Marketing composition

**Spec path**: `specs/platform/surfaces/marketing/composition`

**Migrated from**: OpenSpec `app/marketing/composition/marketing-composition` (origin/main `3fd01907`)

**Status**: Accepted, living

**Verified by**: [docs/testing/marketing-composition.md](../../../../../docs/testing/marketing-composition.md)

## Purpose

Render public pages as ordered semantic content within a shared shell and retain stable boundaries for source-backed review and maintenance.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, `WHEN`/`THEN` scenarios kept their wording, and capability references became tree paths. The meaning is unchanged.

### Session 2026-11-08 (AGENTS.md thinning)

- **Q: Which rules moved here when the `AGENTS.md` files were thinned?**
  - A: Behaviour rules from `src/app/(site)/(marketing)/_components/AGENTS.md` and `src/lib/marketing-content/AGENTS.md` (origin/main `3fd01907`) with no other spec home. They are FR-005 to FR-014, with their meaning kept. Ordered semantic content, the shared shell and layout data, distinct review boundaries and the fidelity/reuse split were already FR-001 to FR-004.

## Requirements

### FR-001: Ordered semantic page content

Registered public content pages MUST render their normalized ordered sections through the marketing content contract. Sections MUST represent independently meaningful semantic regions with source-neutral authored fields rather than opaque whole-page payloads. Explicit utility-page exceptions MUST remain bounded to their purpose.

**Scenario: Render a multi-section public page**

- **When** an installed public content page is requested
- **Then** its registered ordered sections render through their corresponding owners and visible authored copy comes from the page data

### FR-002: Shared shell and navigation

Header, menus and footer MUST remain shared shell responsibilities using the same resolved layout data across desktop and compact presentations. Shell navigation MUST distinguish registered internal destinations from external links and supported fragments.

**Scenario: Compact shell navigation**

- **When** a public page changes to a compact viewport
- **Then** its shared shell preserves the same destination meaning and layout data without becoming a page-specific duplicate

### FR-003: Stable semantic review boundaries

Independently reviewed composition regions MUST retain stable semantic identities and review selectors. Content, shell and explicitly excluded regions MUST have distinct comparison boundaries; exclusions MUST NOT remove required production shell content.

**Scenario: Review content with an excluded approved header**

- **When** a source-backed content comparison excludes an already approved shared header
- **Then** content is compared within its declared boundary and the production header remains present and unchanged by that exclusion

### FR-004: Source fidelity and later reuse are distinct decisions

Source-backed composition MUST preserve approved hierarchy, assets, content boundaries and independent cases. Combining cases or changing shared owners for later reuse MUST require the applicable explicit systemization decision rather than being treated as a prerequisite for source fidelity.

**Scenario: Similar independent source cases**

- **When** two independent approved source cases resemble one another
- **Then** their distinct review boundaries remain until an explicit shared-owner decision authorizes consolidation

### FR-005: One shell across breakpoints

Header and footer behaviour MUST stay aligned across breakpoints. The marketing header uses grouped `menuGroups` and `searchGroups`, and desktop and compact search come from the same layout data. Localized routing, language switchers and brand-specific CTA treatments stay out of the template header unless added as explicit optional slots.

### FR-006: Shell regions and composition frames

Shell regions MUST NOT be hidden through route CSS, and a source footer MUST NOT be reproduced inside content blocks; shell media follows `specs/platform/content/media`. Keep stable header, content, footer and content-plus-footer composition frames. Review state and capture boundaries belong to `SiteShell`/Preview, never route CSS. Shell cases have no content-block or shared `Section` obligation.

### FR-007: The approved header is fixed during Compose

During Compose the approved header is immutable and excluded from source parity, but it stays on the production page. Editing, retheming or replacing it needs separately scoped non-Compose work. Source frames and local identity assets MUST NOT authorize changes to nested shared design-system owners.

### FR-008: Installed internal routes stay plain links

Navigation and CTA link data follows the exclusive `surfaceId` or `href` contract of `specs/platform/surfaces/marketing/pages` FR-002. Profile-installed internal routes MUST stay plain generated links outside content documents.

### FR-009: Blocks declare only what they render

A new section MUST declare only the data its renderer needs and preserve the `blockType` layout contract; there is no generic page builder.

### FR-010: One block is one reviewable section

One block MUST be one independently reviewable semantic/source section, not a page or arbitrary sibling bands; its subregions share its heading context and comparison selector. Every block declares meaningful source-neutral content/media beyond its ID and type, and visible copy and imagery come from fields, not the renderer.

### FR-011: The shared `Section` root is not replaced

Every renderer has exactly one shared `Section` semantic root (`specs/platform/surfaces/marketing/pages` FR-004); `Section.Background` owns full-bleed artwork and the documented foreground frame. Local wrappers MUST NOT replace them for pixel control.

### FR-012: Stable selectors only where needed

Renderers MUST preserve the registry section ID, block type and label attributes. Stable selectors are added only for a real comparison or interaction need, never as generated classes or copy, and a selector isolates its region without adjacent pixels.

### FR-013: Content renderers hold one section

A content renderer MUST NOT contain headers, footers, multiple source cases or the accumulated page. Temporary source-fidelity recipes stay renderer-local, not public owners, and product, campaign and Figma-node names never become block types or generic owners.

### FR-014: Distinct cases stay distinct

Distinct source and parity cases MUST stay distinct; a shared background or theme is no reason to merge them (FR-004). Decomposition and authority locks are owned by the Compose source-intake and Visual Parity focus-packet procedures.
