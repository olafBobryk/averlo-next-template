# Specification: Building marketing pages

**Spec path**: `specs/platform/surfaces/marketing/pages`

**Created**: 2026-11-08 (new; generic rules gathered from the marketing route and content `AGENTS.md` files)

**Status**: Accepted, living

**Builds on**: `specs/platform/surfaces/marketing/{composition,content-sources,metadata}`, `specs/platform/design-system/usage`, `specs/platform/design-system/motion`, `specs/platform/content/media`, `specs/platform/navigation/routes`

**Verified by**: `npm run verify:marketing`, [docs/testing/marketing-composition.md](../../../../../docs/testing/marketing-composition.md), each page's characterisation test

## Purpose

How to add any public page so it fits the shared shell, renders from source-neutral content, uses the design system, and is proved by a test. A real page's own spec lives in a project's `specs/product/marketing/pages/<route>/`, written from `.specify/templates/page-spec-template.md`; it refines these rules and never repeats them.

## Clarifications

### Session 2026-11-08

- **Q: Where does a new page's spec go?**
  - A: In the project's `specs/product/marketing/pages/<route>/spec.md`, from the page-spec template. The template itself ships no product pages (constitution VII).

## Requirements

### FR-001: One page spec per page, from the template

A new public page MUST have a page spec written from `.specify/templates/page-spec-template.md` before code: purpose, audience, route, sections and their owners, content source, states, motion notes, metadata, acceptance at 390 and 1440, and its characterisation test.

### FR-002: Registered route, one identity

The page MUST be declared once in the marketing route family registry and reached through its surface ID (`specs/platform/navigation/routes`). Navigation and CTA data use exactly one of `surfaceId` (installed marketing/auth destinations) or `href` (external URLs, fragments, generated internal links).

### FR-003: Pages render ordered sections

The route page MUST resolve its document on the server and delegate its `layout` to the section renderer registry; it does not import or compose section renderers directly. Each section is one independently meaningful semantic region with source-neutral fields (`specs/platform/surfaces/marketing/composition` FR-001).

### FR-004: Section renderer shape

Each registered `blockType` MUST own one renderer at `sections/**/<blockType>/<PascalBlockType>Section.tsx` with exactly one shared `Section` semantic root (`Section.Background` for full-bleed artwork). Folder and renderer names describe content structure, never a product, brand, campaign or design-tool node. Only the registered renderer uses the `*Section` name; supporting components are colocated under the leaf folder.

### FR-005: Composed from the design system

Sections MUST be composed from the owners in `specs/platform/design-system/usage`, styled with Tailwind classes. No page-level or global CSS for a section; a colocated CSS module needs a selector or keyframe rationale Tailwind cannot express. A new owner or variant needs a stated reason.

### FR-006: Shared shell untouched

The page MUST NOT copy, hide or restyle the shared header, menu, footer or scroll lifecycle, and MUST NOT reproduce a footer inside content (`specs/platform/surfaces/marketing/composition` FR-002).

### FR-007: Content from the document, not the renderer

Visible copy and imagery MUST come from the page document's fields, not hardcoded in the renderer. Media follows `specs/platform/content/media` (durable constituent assets, truthful dimensions, purposeful alt text).

### FR-008: States and motion are explicit

Every data-dependent region MUST define loading, empty and error states per `specs/platform/data/loading`, and every visible change MUST follow `specs/platform/design-system/motion` (entrances through the `ui/motion` source owners, snapping under `?motion=off`).

### FR-009: Metadata from the same read

Title, description, canonical and social metadata MUST follow `specs/platform/surfaces/marketing/metadata` and `specs/platform/navigation/metadata`, from the same document read as the body.

### FR-010: Proved at 390 and 1440

A Playwright characterisation test MUST cover each section rendering, each state, the primary CTA destination and the metadata at 390 and 1440 wide, with no horizontal scroll and essential content present on first render (`specs/platform/design-system/motion` FR-001).

## Success Criteria

- **SC-001**: `npm run verify:marketing` passes with the new page registered.
- **SC-002**: The page's characterisation test passes at 390 and 1440.
