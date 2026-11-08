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
