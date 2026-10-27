# Content hierarchy delta

## Purpose

Make content grouping, context and emphasis understandable across application surfaces without freezing component APIs or prescribing a new button-variant policy.

## ADDED Requirements

### Requirement: Coherent grouping and surface meaning
Content SHALL be grouped by a coherent task or identity rather than putting every property in an independent surface. Persistent chrome, page content, cohesive cards and temporary floating content SHALL retain their distinct roles. Visual elevation SHALL NOT change semantic ownership.

#### Scenario: Present related record properties
- **WHEN** a detail presents multiple properties of one coherent record group
- **THEN** grouping communicates that relationship without introducing independent cards merely for spacing

### Requirement: Context is useful and not duplicated
Headings, labels and descriptions SHALL communicate distinct useful context. A group SHALL NOT repeat the same heading outside and inside its card. Permission, warning, count and other meaningful context SHALL remain present when redundant introductory copy is removed.

#### Scenario: Group with an external heading
- **WHEN** a card belongs to an already titled content section
- **THEN** the card does not repeat the section title and meaningful warnings or counts remain available

### Requirement: Shared alignment preserves usable controls
Related content headings, actions and surfaces SHALL follow their owning layout's shared gutters and alignment. Compact edge alignment SHALL preserve focus indicators, nonconflicting hit areas and control geometry rather than globally shrinking controls or adding compensating page offsets.

#### Scenario: Align a section action at a surface edge
- **WHEN** a compact action aligns with its neighboring content
- **THEN** its focus and activation area remain usable and do not overlap a neighboring control

### Requirement: Semantic color and identity remain legible
Foreground and fill roles SHALL remain distinct and readable on their actual composited surface, meeting applicable contrast requirements: 4.5:1 for normal text and 3:1 where applicable to large text or meaningful graphics. Decorative fills SHALL NOT be treated as meaningful graphics. Name-based identity colors SHALL NOT imply status, and static identity presentation SHALL NOT imply an active pressed state.

#### Scenario: Name-based avatar on a tinted surface
- **WHEN** an avatar uses a stable identity tint
- **THEN** its foreground remains readable and the tint does not falsely communicate status or interaction state
