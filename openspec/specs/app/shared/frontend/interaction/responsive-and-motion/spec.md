# responsive-and-motion Specification

## Purpose

Preserve essential content and user agency across viewport changes, motion preferences and animation fallback while avoiding unnecessary hidden expensive work.

## Requirements

### Requirement: Essential content survives responsive rendering
Primary copy, headings, navigation, essential controls and accessibility affordances SHALL remain available across supported viewport sizes and initial rendering. Responsive presentation SHALL NOT require a client-only breakpoint decision before essential content exists.

#### Scenario: Initial compact render
- **WHEN** a compact page initially renders before client breakpoint state resolves
- **THEN** primary content and essential accessible controls are already present and usable

### Requirement: Expensive hidden branches are bounded
Responsive implementations SHALL avoid mounting hidden expensive observers, media, canvas or duplicated decorative work when a deliberate branch can avoid that cost without withholding essential content. Lightweight layout and visibility changes SHALL preserve one coherent content model.

#### Scenario: Expensive desktop decoration on a phone
- **WHEN** the compact presentation excludes an expensive decorative branch
- **THEN** that work is not unnecessarily activated and essential content remains available

### Requirement: Motion does not gate agency
Reduced motion, motion-off and animation fallback SHALL leave content readable and real controls focusable and operable. Motion or conditional presence SHALL preserve control semantics, announcements and focus responsibilities with their interaction owners.

#### Scenario: Reduced motion during conditional content
- **WHEN** a user requests reduced motion while conditional content appears or disappears
- **THEN** the content settles readably and its controls remain usable without requiring animation completion

### Requirement: Motion has coherent ownership
Coordinated motion SHALL preserve a clear activation/progress owner and effect mapping without competing scheduling or reset behavior. Supported interruption, re-entry, resize and compact states SHALL settle into usable content according to the owning motion contract.

#### Scenario: Resize during playback
- **WHEN** the viewport changes or playback is interrupted
- **THEN** content and controls remain usable and competing animation/reset owners do not leave the surface stuck
