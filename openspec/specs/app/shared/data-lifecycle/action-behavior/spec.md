# action-behavior Specification

## Purpose

Make non-form state changes understandable, recoverable and safe across action groups. Form submissions remain owned by app/shared/data-lifecycle/form-behavior and initial reads by app/shared/data-lifecycle/loading-state-behavior.

## Requirements

### Requirement: One pending action owner
A non-form mutation SHALL reject duplicate starts synchronously, preserve the activated action's dimensions and accessible label, and expose pending feedback on that action alone. Conflicting sibling actions SHALL be unavailable without additional spinners until settlement. Settlement SHALL clear the pending identity and allow supported recovery.

#### Scenario: Rapid action group activation
- **WHEN** a user activates an action repeatedly and then activates a conflicting sibling while its request is delayed
- **THEN** one mutation starts, only the chosen action is busy, and the conflicting action cannot start

### Requirement: Feedback follows ownership and lifetime
An action result SHALL have one primary feedback channel matching its meaning: local recoverable failure, persistent usable-context notice, transient discrete outcome, or durable replacement instructions. Coexisting channels SHALL communicate distinct information without repeating the same result. Field validation and initial read failures SHALL remain with their separate owners.

#### Scenario: Recoverable mutation failure
- **WHEN** an action fails while surrounding content remains usable
- **THEN** one local accessible error explains recovery, retained values match the recovery copy, and retry follows the same pending guard

#### Scenario: Durable completion instructions
- **WHEN** successful completion requires instructions that remain useful after transient feedback disappears
- **THEN** those instructions remain in content rather than existing only in a notification

### Requirement: Outcome channels remain specific
Recoverable action failures SHALL remain beside the affected action. Successful saves and discrete completed actions SHALL use the shared transient outcome channel. Persistent service failure, expired access and read-only access SHALL explain unavailable actions as persistent context rather than masquerading as a local mutation result. Healthy pages SHALL NOT gain notices solely to demonstrate them.

#### Scenario: Persistent read-only access
- **WHEN** available content is read-only and its mutation controls are unavailable
- **THEN** persistent nearby context explains that limitation without presenting an invented failed mutation

### Requirement: Destructive intent and reversible optimism
Destructive or explicitly confirmation-required mutations SHALL require confirmation before execution. Optimistic presentation SHALL be reversible on returned or thrown failure and SHALL NOT leave a failed change presented as committed. Authorization SHALL be enforced again at execution.

#### Scenario: Failed optimistic update
- **WHEN** an optimistic mutation is rejected or throws
- **THEN** the prior visible state is restored, durable state is unchanged, and the user can recover in place

#### Scenario: Cancel destructive confirmation
- **WHEN** a user cancels the confirmation for a destructive change
- **THEN** the mutation does not execute

### Requirement: Single completion navigation
Successful mutation navigation SHALL occur once without a redundant refresh. Detail deletion SHALL leave the deleted destination through replacement navigation; collection completion SHALL follow its owning collection's refresh behavior.

#### Scenario: Delete an open detail
- **WHEN** confirmed deletion of the currently open entity succeeds
- **THEN** navigation replaces that detail once and does not refresh or revisit the deleted route as completion work

### Requirement: Active send cancellation remains available
Pending sends SHALL retain their initiating action owner and an active cancellable run SHALL keep its cancellation control available. Neighboring loading SHALL preserve independently editable drafts under the loading contract.

#### Scenario: Cancel an active run
- **WHEN** a run is active while another content region loads
- **THEN** the user can still invoke cancellation and edit any independent retained draft
