# Specification: Content hierarchy

**Spec path**: `specs/platform/content/hierarchy`

**Migrated from**: OpenSpec `app/shared/frontend/content/content-hierarchy` (origin/main `3fd01907`)

**Status**: Accepted, living

**Verified by**: [docs/testing/component-contracts.md](../../../../docs/testing/component-contracts.md)

## Purpose

Make content grouping, context and emphasis understandable across application surfaces without freezing component APIs or prescribing a new button-variant policy.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, `WHEN`/`THEN` scenarios kept their wording, and capability references became tree paths. The meaning is unchanged.

### Session 2026-11-08 (AGENTS.md thinning)

- **Q: Which rules moved here when the `AGENTS.md` files were thinned?**
  - A: Behaviour rules from `plugins/averlo/README.md`, `src/app/(site)/(dev)/internal/AGENTS.md`, `src/components/ui/misc/AGENTS.md` and `src/components/ui/primitives/surfaces/AGENTS.md` (origin/main `3fd01907`), as FR-005 to FR-013 with their meaning kept. The two `Card.Header` wordings (internal pages and surfaces) are reconciled into FR-006. Grouping, unduplicated context, shared gutters and contrast were already FR-001 to FR-004.

## Requirements

### FR-001: Coherent grouping and surface meaning

Content MUST be grouped by a coherent task or identity rather than putting every property in an independent surface. Persistent chrome, page content, cohesive cards and temporary floating content MUST retain their distinct roles. Visual elevation MUST NOT change semantic ownership.

**Scenario: Present related record properties**

- **When** a detail presents multiple properties of one coherent record group
- **Then** grouping communicates that relationship without introducing independent cards merely for spacing

### FR-002: Context is useful and not duplicated

Headings, labels and descriptions MUST communicate distinct useful context. A group MUST NOT repeat the same heading outside and inside its card. Permission, warning, count and other meaningful context MUST remain present when redundant introductory copy is removed.

**Scenario: Group with an external heading**

- **When** a card belongs to an already titled content section
- **Then** the card does not repeat the section title and meaningful warnings or counts remain available

### FR-003: Shared alignment preserves usable controls

Related content headings, actions and surfaces MUST follow their owning layout's shared gutters and alignment. Compact edge alignment MUST preserve focus indicators, nonconflicting hit areas and control geometry rather than globally shrinking controls or adding compensating page offsets.

**Scenario: Align a section action at a surface edge**

- **When** a compact action aligns with its neighboring content
- **Then** its focus and activation area remain usable and do not overlap a neighboring control

### FR-004: Semantic color and identity remain legible

Foreground and fill roles MUST remain distinct and readable on their actual composited surface, meeting applicable contrast requirements: 4.5:1 for normal text and 3:1 where applicable to large text or meaningful graphics. Decorative fills MUST NOT be treated as meaningful graphics. Name-based identity colors MUST NOT imply status, and static identity presentation MUST NOT imply an active pressed state.

**Scenario: Name-based avatar on a tinted surface**

- **When** an avatar uses a stable identity tint
- **Then** its foreground remains readable and the tint does not falsely communicate status or interaction state

### FR-005: Sections on the canvas, one card per group

Page hierarchy SHOULD use `ContentSection`: section headings, descriptions and actions sit on the canvas outside cards, and one `Card` encloses each cohesive group of properties or controls beneath its heading (organization settings: two sections, two property cards). Content MUST NOT get a card per field, and group boundaries MUST NOT be removed.

### FR-006: Card headers are optional and identify an item

`Card.Header` is optional. It MUST be added only when a distinct title, description or action labels the content below, carrying the identity and highest-priority information of a self-contained item, and it MUST NOT repeat the section title. Simple links, metrics, notices and preview stages stay headerless.

### FR-007: Section headings use text alone

Content-section headings MUST NOT carry decorative leading icons, in application sections, loading states, catalogue previews or Storybook examples. Hierarchy comes from heading text and spacing.

### FR-008: Prefer subtraction

A page MUST have one page heading and no repeated descriptions. Card-in-Card is used only when the inner card is the demonstrated component, and no wrapper exists only to add another border.

### FR-009: Preview stages and internal pages use shared primitives

Generic preview canvases and visual test stages MUST use `Panel` rather than recreating surface background, border, radius, padding or shadow with raw utilities. Component demos may keep component-owned geometry, but their surrounding frames use shared design-system primitives. Internal pages use `InternalPage`/`InternalPageHeader` so header offset, section padding, width and heading rhythm stay aligned.

### FR-010: Colour is validated in both themes

Semantic ink and tinted controls MUST be checked in light and dark on `Surface`, `Card` and `Float`, including hover and pressed backgrounds. Avatar initials need 4.5:1; meaningful icons and control boundaries keep their FR-004 contrast.

### FR-011: Identity tints and chips

`Chip` soft fills MUST resolve against the inherited `--ui-surface-color`. Profile pictures use the shared primary, success, warning, danger and violet set with the default static `Chip` tint; the same full name selects the same accent everywhere, initials and size never change it, and `helperIndex` applies only without a name. Profile-picture stacks own overlap clipping and z-order without surface-coloured rings. `Chip` owns label capitalization through its `capitalize` utility; callers pass original labels without casing styles and never change stored values. Callers own no replacement background recipes.

### FR-012: Card chrome and interaction

`Card` header and footer separators MUST inherit the root outline colour, and Card tables use the shared subtle border recipe for outline, header separator, row dividers and footer separator. `Card` owns the opt-in `interactive` hover fill: a control inside an interactive Card is a bare semantic control so hovers do not stack, and Card interaction styling is disabled while the control is disabled.

### FR-013: Surface ownership stays closed

Section-background owners MUST provide context and selective descendant styling only, never `Panel`/`Card`/`Float` radius, elevation, fill or slots. Stable layout or reveal wrappers may keep transparent borders (removed only with geometry proof); gradient borders keep outer border and inner fill as separate wrappers with aligned radii. Semantic accents use the closed shared surface contract; feature code MUST NOT imitate its internal slots, inspection attributes, recipes or tokens.
