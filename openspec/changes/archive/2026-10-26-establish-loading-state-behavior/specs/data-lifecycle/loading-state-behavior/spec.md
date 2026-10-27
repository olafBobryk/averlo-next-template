# Spec Delta

## Purpose

Keep data-dependent regions understandable and usable while reading data, reserving appropriate space and providing clear completion or recovery. This is the read/presentation side of the data-lifecycle family; [form-behavior](../form-behavior/spec.md) owns form validation, pending submissions, submission feedback, retry, and success.

## ADDED Requirements

### Requirement: Preserve independent known content
Loading regions SHALL preserve known headings, descriptions, navigation, and independent controls with their existing copy, destinations, visibility, and keyboard behavior. Loading SHALL NOT unnecessarily replace them with placeholders.

#### Scenario: Known navigation while a region loads
- **WHEN** a region's data is delayed but a navigation destination is already known
- **THEN** the link remains visible, keyboard reachable, and navigable while the region loads

#### Scenario: Independent draft during loading
- **WHEN** a neighboring region or operation is pending without depending on an editable draft
- **THEN** the draft remains editable and survives the transition to ready content, while only dependent actions are gated

### Requirement: Dependency-scoped loading
Each independently fetched region SHALL own its loading state. Only unknown data and actions whose labels, destinations, visibility, or availability depend on that data SHALL be represented by loading placeholders or unavailable controls.

#### Scenario: Independent regions
- **WHEN** one region is delayed while another region has usable content
- **THEN** only the delayed region enters loading and the usable region stays available

#### Scenario: No content to load
- **WHEN** a region has no existing content to fetch, such as a new conversation without message history
- **THEN** it does not display placeholders implying that existing content is being retrieved

#### Scenario: Data-dependent action
- **WHEN** an action needs unresolved data or permissions to determine its destination or availability
- **THEN** it cannot execute until those dependencies resolve

### Requirement: Live and loading layout parity
Loading compositions SHALL preserve the ready layout's hierarchy, child order, repeated structures, spacing, alignment, responsive behavior, height, radii, reserved borders, typography, truncation, and semantic accents. Ready content SHALL replace its reserved region without unrelated layout changes.

#### Scenario: Repeated content and narrow layout
- **WHEN** a table, list, or detail region changes between loading and ready at desktop or narrow width
- **THEN** repeated rows, final borders, footers, wrapping, and always-present controls follow the same layout and fit the viewport

#### Scenario: Known and unknown sizing copy
- **WHEN** a placeholder needs hidden sizing content
- **THEN** known final copy is reused exactly and unknown copy uses realistic exemplars with equivalent length and wrapping

### Requirement: Inert visual placeholders
Visual loading placeholders SHALL be non-interactive, non-selectable, and unavailable as accessible actions. They SHALL preserve the established component presentation and SHALL NOT introduce duplicate focus stops, action handlers, or repeated announcements.

#### Scenario: Keyboard traversal during loading
- **WHEN** a user tabs through a loading composition
- **THEN** focus reaches real available controls and skips every visual placeholder

#### Scenario: Accessible loading feedback
- **WHEN** a region enters loading
- **THEN** a concise region-owned status communicates progress without announcing each placeholder or hiding independent usable controls

### Requirement: Readable reduced-motion loading
Loading meaning SHALL remain perceivable with reduced motion or animation fallback. Independent controls SHALL remain readable, focusable, and operable. Motion SHALL NOT gate semantic content or interaction.

#### Scenario: Reduced motion
- **WHEN** a user requests reduced motion while a region is loading
- **THEN** the region retains its reserved layout and loading meaning, and independent controls remain usable without requiring animation

### Requirement: Distinct region outcomes and recovery
Regions SHALL distinguish idle content awaiting initiation from active loading, and settle into ready, empty, unavailable, recoverably failed, or fatal-prerequisite content appropriate to the result. Region failures SHALL explain the affected content and offer retry when recovery is possible. Initial or region loading and failure SHALL NOT be represented as transient mutation feedback.

#### Scenario: Idle region
- **WHEN** a region is waiting for user initiation or a prerequisite before a read begins
- **THEN** it communicates its idle state without implying that a request is already loading

#### Scenario: Empty result
- **WHEN** a successful read returns no items
- **THEN** the region displays its empty result rather than continuing to load or claiming a request failed

#### Scenario: Recoverable read failure
- **WHEN** a region read fails recoverably
- **THEN** one local failure state explains the affected content, preserves independent content, and retry can reach ready content

#### Scenario: Unavailable prerequisite
- **WHEN** content cannot be read because a required capability or prerequisite is unavailable
- **THEN** the region explains that limitation without an indefinite placeholder or a misleading success result

### Requirement: Distinguish reading from submission
Initial and region loading SHALL remain distinct from a user-initiated pending action. Form submission lifecycle behavior SHALL follow the sibling form-behavior contract, without replacing the form or duplicating its pending/result feedback through region loading.

#### Scenario: Form submission alongside readable content
- **WHEN** a form submits while other content is already available
- **THEN** the submit action owns pending feedback under form-behavior and unrelated content is not replaced by loading placeholders

### Requirement: Independent loading contract inheritance
Generated projects SHALL inherit this maintained contract and verification procedure independently, without template change history. Executable pilot cases SHALL cover installed surfaces only and SHALL NOT retain references to omitted application areas.

#### Scenario: Profile-selected coverage
- **WHEN** a project is assembled with or without dashboard routes
- **THEN** its loading tests match its installed surfaces and omitted dashboard/authentication cases are not imported or executed
