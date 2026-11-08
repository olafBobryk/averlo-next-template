# Specification: Loading-state behaviour

**Spec path**: `specs/platform/data/loading`

**Migrated from**: OpenSpec `app/shared/data-lifecycle/loading-state-behavior` (origin/main `3fd01907`)

**Status**: Accepted, living

**Verified by**: [docs/testing/loading.md](../../../../docs/testing/loading.md)

## Purpose

Keep data-dependent regions understandable and usable while reading data, reserving appropriate space and providing clear completion or recovery. This is the read/presentation side of the data-lifecycle family; [`specs/platform/data/forms`](../forms/spec.md) owns form validation, pending submissions, submission feedback, retry, and success.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, `WHEN`/`THEN` scenarios kept their wording, and capability references became tree paths. The meaning is unchanged.

## Requirements

### FR-001: Preserve independent known content

Loading regions MUST preserve known headings, descriptions, navigation, and independent controls with their existing copy, destinations, visibility, and keyboard behavior. Loading MUST NOT unnecessarily replace them with placeholders.

**Scenario: Known navigation while a region loads**

- **When** a region's data is delayed but a navigation destination is already known
- **Then** the link remains visible, keyboard reachable, and navigable while the region loads

**Scenario: Independent draft during loading**

- **When** a neighboring region or operation is pending without depending on an editable draft
- **Then** the draft remains editable and survives the transition to ready content, while only dependent actions are gated

### FR-002: Dependency-scoped loading

Each independently fetched region MUST own its loading state. Only unknown data and actions whose labels, destinations, visibility, or availability depend on that data MUST be represented by loading placeholders or unavailable controls.

**Scenario: Independent regions**

- **When** one region is delayed while another region has usable content
- **Then** only the delayed region enters loading and the usable region stays available

**Scenario: No content to load**

- **When** a region has no existing content to fetch, such as a new conversation without message history
- **Then** it does not display placeholders implying that existing content is being retrieved

**Scenario: Data-dependent action**

- **When** an action needs unresolved data or permissions to determine its destination or availability
- **Then** it cannot execute until those dependencies resolve

### FR-003: Live and loading layout parity

Loading compositions MUST preserve the ready layout's hierarchy, child order, repeated structures, spacing, alignment, responsive behavior, height, radii, reserved borders, typography, truncation, and semantic accents. Ready content MUST replace its reserved region without unrelated layout changes.

**Scenario: Repeated content and narrow layout**

- **When** a table, list, or detail region changes between loading and ready at desktop or narrow width
- **Then** repeated rows, final borders, footers, wrapping, and always-present controls follow the same layout and fit the viewport

**Scenario: Known and unknown sizing copy**

- **When** a placeholder needs hidden sizing content
- **Then** known final copy is reused exactly and unknown copy uses realistic exemplars with equivalent length and wrapping

### FR-004: Inert visual placeholders

Visual loading placeholders MUST be non-interactive, non-selectable, and unavailable as accessible actions. They MUST preserve the established component presentation and MUST NOT introduce duplicate focus stops, action handlers, or repeated announcements.

**Scenario: Keyboard traversal during loading**

- **When** a user tabs through a loading composition
- **Then** focus reaches real available controls and skips every visual placeholder

**Scenario: Accessible loading feedback**

- **When** a region enters loading
- **Then** a concise region-owned status communicates progress without announcing each placeholder or hiding independent usable controls

### FR-005: Readable reduced-motion loading

Loading meaning MUST remain perceivable with reduced motion or animation fallback. Independent controls MUST remain readable, focusable, and operable. Motion MUST NOT gate semantic content or interaction.

**Scenario: Reduced motion**

- **When** a user requests reduced motion while a region is loading
- **Then** the region retains its reserved layout and loading meaning, and independent controls remain usable without requiring animation

### FR-006: Distinct region outcomes and recovery

Regions MUST distinguish idle content awaiting initiation from active loading, and settle into ready, empty, unavailable, recoverably failed, or fatal-prerequisite content appropriate to the result. Region failures MUST explain the affected content and offer retry when recovery is possible. Initial or region loading and failure MUST NOT be represented as transient mutation feedback.

**Scenario: Idle region**

- **When** a region is waiting for user initiation or a prerequisite before a read begins
- **Then** it communicates its idle state without implying that a request is already loading

**Scenario: Empty result**

- **When** a successful read returns no items
- **Then** the region displays its empty result rather than continuing to load or claiming a request failed

**Scenario: Recoverable read failure**

- **When** a region read fails recoverably
- **Then** one local failure state explains the affected content, preserves independent content, and retry can reach ready content

**Scenario: Unavailable prerequisite**

- **When** content cannot be read because a required capability or prerequisite is unavailable
- **Then** the region explains that limitation without an indefinite placeholder or a misleading success result

### FR-007: Distinguish reading from submission

Initial and region loading MUST remain distinct from a user-initiated pending action. Form submission lifecycle behavior MUST follow the sibling `specs/platform/data/forms` contract, without replacing the form or duplicating its pending/result feedback through region loading.

**Scenario: Form submission alongside readable content**

- **When** a form submits while other content is already available
- **Then** the submit action owns pending feedback under `specs/platform/data/forms` and unrelated content is not replaced by loading placeholders
