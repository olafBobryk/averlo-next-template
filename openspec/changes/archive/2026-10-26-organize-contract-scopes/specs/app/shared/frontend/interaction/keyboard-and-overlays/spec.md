## Purpose

Keep controls and layered interactions operable through accessible names, native or documented keyboard behavior, predictable focus and consistent dismissal.

## ADDED Requirements

### Requirement: Accessible control ownership
Interactive controls SHALL retain their semantics, accessible names and visible focus. Native keyboard behavior SHALL be preserved where applicable; composite controls and scoped shortcuts SHALL use their documented interaction contract. Decorative wrappers SHALL NOT introduce focus stops or replace the real interaction owner.

#### Scenario: Keyboard operation with decoration
- **WHEN** a user traverses and activates a control decorated by animation or additional wrappers
- **THEN** its name, visible focus and keyboard behavior remain available on the real control without duplicate stops

### Requirement: Focus entry and return
Opening a focused blocking interaction SHALL place focus according to its owner contract. Closing it SHALL restore focus to an appropriate available initiator or documented recovery target. Nested overlays SHALL preserve topmost focus and dismissal ownership.

#### Scenario: Close a nested dialog
- **WHEN** the topmost dialog closes while its parent interaction remains open
- **THEN** focus returns to the appropriate parent control and the parent is not dismissed by the same action

### Requirement: Consistent pending dismissal lock
A mutable blocking flow SHALL apply one pending close lock to Escape, backdrop, explicit close and every other dismissal path. Recoverable failure SHALL unlock the same flow in place. Scroll locking and stacking SHALL remain consistent with active blocking layers.

#### Scenario: Dismiss during a delayed confirmed mutation
- **WHEN** a mutable dialog is pending and the user tries each supported close path
- **THEN** every path observes the same lock and no conflicting dismissal occurs

#### Scenario: Failure unlocks recovery
- **WHEN** the pending mutation fails recoverably
- **THEN** its error appears in place, dismissal unlocks consistently and retry remains available

### Requirement: Blocking and anchored interaction roles
Nonblocking anchored interactions SHALL preserve their documented anchor, keyboard navigation and dismissal behavior. Focused blocking interactions SHALL provide their documented modal behavior rather than imitating it through visual surface styling alone.

#### Scenario: Open an anchored menu
- **WHEN** a user opens an anchored menu with the keyboard
- **THEN** its owner supplies navigation and dismissal without introducing an unrelated blocking dialog or independent focus system
