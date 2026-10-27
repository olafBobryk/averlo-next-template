# Spec Delta

## Purpose

Provide a consistent, accessible submission and recovery contract for complete forms, verified against real client and server boundaries.

## ADDED Requirements

### Requirement: Accessible field feedback
Forms SHALL connect labels, required state, descriptions and validation errors to their actual controls. Invalid values SHALL produce inline field feedback instead of browser warning bubbles or transient notifications.

#### Scenario: Invalid submission
- **WHEN** a user submits missing or invalid required values
- **THEN** invalid controls expose their errors accessibly and submission does not reach the server

#### Scenario: Narrow viewport
- **WHEN** the form and its errors are displayed on a narrow viewport
- **THEN** controls, feedback and submit actions remain usable without horizontal overflow

### Requirement: Native keyboard submission
Forms SHALL use native form semantics, logical keyboard order and visible focus, and support keyboard submission through the same lifecycle as the submit button.

#### Scenario: Keyboard submit
- **WHEN** a user activates the submit action with the keyboard
- **THEN** the form starts its normal validated submission exactly once

### Requirement: Single pending submission
A form SHALL reject duplicate starts synchronously, expose pending state on its submit action without losing its accessible label, and disable conflicting actions until the operation settles.

#### Scenario: Repeated submission while pending
- **WHEN** repeated submit events occur before a delayed request settles
- **THEN** only one request starts and the submit action is busy and unavailable

### Requirement: Server authority
The server SHALL independently validate and normalize submitted values and enforce applicable authorization before performing a mutation. Client validation SHALL NOT be sufficient authority.

#### Scenario: Client validation bypass
- **WHEN** invalid values are sent directly to a submission endpoint
- **THEN** the server rejects them without performing the requested mutation

#### Scenario: Support organization authorization
- **WHEN** a support request names a membership outside the authenticated user's active memberships
- **THEN** the request is rejected without creating a support request

### Requirement: Recoverable submission failure
Recoverable operational failures SHALL appear once beside the affected form action, preserve non-sensitive values, unlock submission and permit retry. Field-specific server errors SHALL be associated with their fields.

#### Scenario: Failed request and retry
- **WHEN** a request fails and the user retries
- **THEN** non-sensitive entered values remain, one local operational error is shown, and retry follows the same pending rules

### Requirement: Explicit success behavior
Forms SHALL communicate one unambiguous result and retain values unless their specified success behavior requires clearing or navigation.

#### Scenario: Support fixture saved
- **WHEN** a valid support submission succeeds
- **THEN** subject and message clear and one result identifies the saved fixture request without claiming email delivery

#### Scenario: Contact demo accepted
- **WHEN** a valid contact demo submission succeeds
- **THEN** entered values remain and the result explicitly states that nothing was sent or stored

### Requirement: Authentication form recovery
Login SHALL preserve email and clear the password after server rejection, show an inline operational error, and maintain server-owned authentication and safe continuation behavior.

#### Scenario: Rejected credentials
- **WHEN** the server rejects login credentials
- **THEN** the email remains, the password clears, an inline error appears, and the user can retry

#### Scenario: Successful login
- **WHEN** valid credentials resolve an active organization
- **THEN** the user is redirected once to the validated local continuation

#### Scenario: Organization selection
- **WHEN** valid credentials require an organization choice
- **THEN** login continues to organization selection with its safe continuation retained

#### Scenario: Unsafe continuation
- **WHEN** a successful login includes an external continuation URL
- **THEN** navigation stays on the application's safe local fallback

### Requirement: Guarded synthetic contact boundary
The public contact demo SHALL validate email and message on the server and terminate honeypot submissions neutrally before further work. It SHALL never deliver, persist or log submitted contact data and SHALL identify itself as a demo before submission.

#### Scenario: Honeypot hit
- **WHEN** a contact submission fills the hidden honeypot
- **THEN** the server returns the same neutral demo result without running subsequent validation or delivery work

#### Scenario: Public demo disclosure
- **WHEN** a user views or submits the contact form
- **THEN** its copy makes clear that it sends no email and stores no submission

### Requirement: Independent profile inheritance
Generated projects SHALL inherit the maintained form contract and stock OpenSpec integration with tests for installed forms only, without template proposal history or references to omitted surfaces.

#### Scenario: Marketing project
- **WHEN** a marketing-only or thin-start project is assembled
- **THEN** contact verification is included and login/support test modules are omitted

#### Scenario: Application project
- **WHEN** an app-only project is assembled
- **THEN** login/support verification is included and contact implementation and test modules are omitted
