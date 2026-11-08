# Specification: Action behaviour

**Spec path**: `specs/platform/data/actions`

**Migrated from**: OpenSpec `app/shared/data-lifecycle/action-behavior` (origin/main `3fd01907`)

**Status**: Accepted, living

**Verified by**: [docs/testing/actions.md](../../../../docs/testing/actions.md)

## Purpose

Make non-form state changes understandable, recoverable and safe across action groups. Form submissions remain owned by `specs/platform/data/forms` and initial reads by `specs/platform/data/loading`.

## Clarifications

### Session 2026-11-08

- **Q: What changed in the move from OpenSpec to Spec Kit?**
  - A: Format only. Each OpenSpec requirement became an FR ID in its original order, `SHALL` became `MUST`, `WHEN`/`THEN` scenarios kept their wording, and capability references became tree paths. The meaning is unchanged.

### Session 2026-11-08 (AGENTS.md thinning)

- **Q: Which rules moved here when the `AGENTS.md` files were thinned?**
  - A: Behaviour rules from `src/app/(site)/dashboard/_components/entities/AGENTS.md` and `src/lib/feedback/AGENTS.md` (origin/main `3fd01907`) with no other spec home. They are FR-007 to FR-010, with their meaning kept. The pending owner, channel ownership, durable success instructions, confirmation, optimistic rollback, single replacement navigation and active-send cancellation were already FR-001 to FR-006.

## Requirements

### FR-001: One pending action owner

A non-form mutation MUST reject duplicate starts synchronously, preserve the activated action's dimensions and accessible label, and expose pending feedback on that action alone. Conflicting sibling actions MUST be unavailable without additional spinners until settlement. Settlement MUST clear the pending identity and allow supported recovery.

**Scenario: Rapid action group activation**

- **When** a user activates an action repeatedly and then activates a conflicting sibling while its request is delayed
- **Then** one mutation starts, only the chosen action is busy, and the conflicting action cannot start

### FR-002: Feedback follows ownership and lifetime

An action result MUST have one primary feedback channel matching its meaning: local recoverable failure, persistent usable-context notice, transient discrete outcome, or durable replacement instructions. Coexisting channels MUST communicate distinct information without repeating the same result. Field validation and initial read failures MUST remain with their separate owners.

**Scenario: Recoverable mutation failure**

- **When** an action fails while surrounding content remains usable
- **Then** one local accessible error explains recovery, retained values match the recovery copy, and retry follows the same pending guard

**Scenario: Durable completion instructions**

- **When** successful completion requires instructions that remain useful after transient feedback disappears
- **Then** those instructions remain in content rather than existing only in a notification

### FR-003: Outcome channels remain specific

Recoverable action failures MUST remain beside the affected action. Successful saves and discrete completed actions MUST use the shared transient outcome channel. Persistent service failure, expired access and read-only access MUST explain unavailable actions as persistent context rather than masquerading as a local mutation result. Healthy pages MUST NOT gain notices solely to demonstrate them.

**Scenario: Persistent read-only access**

- **When** available content is read-only and its mutation controls are unavailable
- **Then** persistent nearby context explains that limitation without presenting an invented failed mutation

### FR-004: Destructive intent and reversible optimism

Destructive or explicitly confirmation-required mutations MUST require confirmation before execution. Optimistic presentation MUST be reversible on returned or thrown failure and MUST NOT leave a failed change presented as committed. Authorization MUST be enforced again at execution.

**Scenario: Failed optimistic update**

- **When** an optimistic mutation is rejected or throws
- **Then** the prior visible state is restored, durable state is unchanged, and the user can recover in place

**Scenario: Cancel destructive confirmation**

- **When** a user cancels the confirmation for a destructive change
- **Then** the mutation does not execute

### FR-005: Single completion navigation

Successful mutation navigation MUST occur once without a redundant refresh. Detail deletion MUST leave the deleted destination through replacement navigation; collection completion MUST follow its owning collection's refresh behavior.

**Scenario: Delete an open detail**

- **When** confirmed deletion of the currently open entity succeeds
- **Then** navigation replaces that detail once and does not refresh or revisit the deleted route as completion work

### FR-006: Active send cancellation remains available

Pending sends MUST retain their initiating action owner and an active cancellable run MUST keep its cancellation control available. Neighboring loading MUST preserve independently editable drafts under the loading contract.

**Scenario: Cancel an active run**

- **When** a run is active while another content region loads
- **Then** the user can still invoke cancellation and edit any independent retained draft

### FR-007: Failed confirmation stays open

Entity deletion MUST use the shared confirmation primitive, with impacts and warnings where useful. A failed confirmation returns `false` to stay open and preserves its input, selection and the last durable state.

**Scenario: Deletion fails inside the confirmation**

- **When** a confirmed deletion is rejected or throws
- **Then** the confirmation stays open with its input and selection, and the last durable state is still shown

### FR-008: Deletion declares its completion

Deletion completion MUST declare `refresh` for collection actions or `navigate` for detail exits. Navigation owns exactly one push or replacement and never refreshes the deleted detail route.

### FR-009: InlineError presentation follows its container

`InlineError` MUST use card presentation for a standalone page or composer failure and inline presentation inside an already bounded surface. Composer-adjacent approval, queue and error surfaces keep the shared `Card` fill and elevation.

### FR-010: One feedback system

Collection completion MUST follow its collection owner. Feature code MUST NOT add local confirmations, notification hosts or parallel feedback systems; force-review states use the same owners.
