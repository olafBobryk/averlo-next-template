## Purpose

Keep the canonical template demonstrations truthful, resettable and isolated while allowing independently generated products to replace examples with real providers and persistence.

## ADDED Requirements

### Requirement: Resettable external-write-free fixtures
Fixture entities SHALL remain resettable and SHALL NOT perform external writes or imply durable production persistence.

#### Scenario: Reset a fixture session
- **WHEN** a fixture session is reset after entity changes
- **THEN** the fixture baseline returns without external provider writes

### Requirement: Guarded synthetic contact boundary
The public contact demo SHALL validate email and message on the server and terminate honeypot submissions neutrally before further work. It SHALL never deliver, persist or log submitted contact data and SHALL identify itself as a demo before submission.

#### Scenario: Honeypot hit
- **WHEN** a contact submission fills the hidden honeypot
- **THEN** the server returns the same neutral demo result without running subsequent validation or delivery work

#### Scenario: Public demo disclosure
- **WHEN** a user views or submits the contact form
- **THEN** its copy makes clear that it sends no email and stores no submission

### Requirement: Truthful support and contact demo results
Fixture contact and support forms SHALL retain their no-email behavior. Support success SHALL clear its subject and message and identify the saved fixture request. Contact demo success SHALL retain entered values and explicitly state that nothing was sent or stored.

#### Scenario: Support fixture saved
- **WHEN** a valid support submission succeeds
- **THEN** subject and message clear and one result identifies the saved fixture request without claiming email delivery

#### Scenario: Contact demo accepted
- **WHEN** a valid contact demo submission succeeds
- **THEN** entered values remain and the result explicitly states that nothing was sent or stored

### Requirement: Fixture authentication remains distinct
Fixture authentication SHALL remain non-durable and SHALL NOT imply a configured production provider. Unconfigured optional methods SHALL NOT establish a session through an implied provider fallback.

#### Scenario: Use fixture authentication
- **WHEN** a user signs in through the template fixture implementation
- **THEN** the example does not imply durable authentication or a configured production identity provider

### Requirement: Fixture storage remains distinct
Fixture behavior SHALL remain external-write-free and SHALL NOT masquerade as durable storage.

#### Scenario: No configured private storage adapter
- **WHEN** a template example lacks a configured private-file provider
- **THEN** its fixture does not perform external storage writes or imply durable storage
