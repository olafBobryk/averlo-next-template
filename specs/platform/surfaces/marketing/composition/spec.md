# Specification: Marketing composition

**Spec path**: `specs/platform/surfaces/marketing/composition`

**Status**: Accepted, living

**Verified by**: [docs/testing/marketing-composition.md](../../../../../docs/testing/marketing-composition.md)

## Purpose

Render public pages as ordered semantic content within a shared shell and retain stable boundaries for source-backed review and maintenance.

## Clarifications

### Session 2026-11-09 (compose skill retired)

- **Q: Where do the still-valid rules of the retired `$averlo:compose` skill go?**
  - A: Olaf: the old compose, animate and systemize skills "never worked" and forced too much. Only rules move here: native text and semantics (FR-015), supplied fonts and exact assets (FR-016) and source provenance (FR-017). FR-004, FR-007 and FR-014 now point at the compose workflow (`.specify/workflows/compose/`) and the design-system usage levels instead of the skills. The per-section procedure, Figma connector identity, Agent Space rules, focus packets and continuation rules were dropped.

## Requirements

### FR-001: Ordered semantic page content

Registered public content pages MUST render their normalized ordered sections through the marketing content contract. Sections MUST represent independently meaningful semantic regions with source-neutral authored fields rather than opaque whole-page payloads. Explicit utility-page exceptions MUST remain bounded to their purpose.

**Scenario: Render a multi-section public page**

- **When** an installed public content page is requested
- **Then** its registered ordered sections render through their corresponding owners and visible authored copy comes from the page data

### FR-002: Shared shell and navigation

Header, menus and footer MUST remain shared shell responsibilities using the same resolved layout data across desktop and compact presentations. Shell navigation MUST distinguish registered internal destinations from external links and supported fragments. Shell navigation links (header menu items, footer links) use the `bare` Button variant.

**Scenario: Compact shell navigation**

- **When** a public page changes to a compact viewport
- **Then** its shared shell preserves the same destination meaning and layout data without becoming a page-specific duplicate

### FR-003: Stable semantic review boundaries

Independently reviewed composition regions MUST retain stable semantic identities and review selectors. Content, shell and explicitly excluded regions MUST have distinct comparison boundaries; exclusions MUST NOT remove required production shell content.

**Scenario: Review content with an excluded approved header**

- **When** a source-backed content comparison excludes an already approved shared header
- **Then** content is compared within its declared boundary and the production header remains present and unchanged by that exclusion

### FR-004: Source fidelity and later reuse are distinct decisions

Source-backed composition MUST preserve approved hierarchy, assets, content boundaries and independent cases. Combining cases or changing shared owners for later reuse MUST require Olaf's sign-off on a level 3–5 row (`specs/platform/design-system/usage` FR-021) rather than being treated as a prerequisite for source fidelity.

**Scenario: Similar independent source cases**

- **When** two independent approved source cases resemble one another
- **Then** their distinct review boundaries remain until an explicit shared-owner decision authorizes consolidation

### FR-005: One shell across breakpoints

Header and footer behaviour MUST stay aligned across breakpoints. The marketing header uses grouped `menuGroups` and `searchGroups`, and desktop and compact search come from the same layout data. Localized routing, language switchers and brand-specific CTA treatments stay out of the template header unless added as explicit optional slots.

### FR-006: Shell regions and composition frames

Shell regions MUST NOT be hidden through route CSS, and a source footer MUST NOT be reproduced inside content blocks; shell media follows `specs/platform/content/media`. Keep stable header, content, footer and content-plus-footer composition frames. Review state and capture boundaries belong to `SiteShell`/Preview, never route CSS. Shell cases have no content-block or shared `Section` obligation.

### FR-007: The approved header is fixed during compose

During the compose workflow the approved header is immutable and excluded from source parity, but it stays on the production page. Editing, retheming or replacing it needs separately scoped work outside compose. Source frames and local identity assets MUST NOT authorize changes to nested shared design-system owners.

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

Distinct source and parity cases MUST stay distinct; a shared background or theme is no reason to merge them (FR-004). Each content case maps to one authoritative source section frame; when that frame or its bounds are ambiguous, the work pauses rather than substituting the page frame. The procedure is `.specify/workflows/compose/`.

### FR-015: Built natively

Source-backed sections MUST be built from real selectable text, semantic controls, responsive layout and exact copy. A source screenshot, section export or reconstructed frame is evidence only; rendering it as product UI is invalid whatever its pixel score (`specs/platform/content/media` FR-001).

### FR-016: Supplied fonts and exact assets

Fonts and constituent assets MUST be supplied (by the repository, the source file, a caller-supplied path or a configured shared library) before a section is built. A missing licensed font or asset is waited for, never silently substituted, borrowed from another project or rasterised. Each supplied font face loads under one evidenced CSS weight with font synthesis off. Vector logos and marks are exported as SVG with their geometry and `viewBox` kept, never redrawn or replaced with text.

### FR-017: Source provenance

An external design source MUST be recorded in `PRODUCT.md` under `## Product sources`: source, authority, focus and supplied material. Workflow progress and conversion status are never recorded there.
