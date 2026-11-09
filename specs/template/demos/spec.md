# Specification: Demo behaviour

**Spec path**: `specs/template/demos`

**Status**: Accepted, living

**Verified by**: [docs/testing/forms.md](../../../docs/testing/forms.md), [docs/testing/contact-delivery.md](../../../docs/testing/contact-delivery.md)

## Purpose

Keep the canonical template demonstrations truthful, resettable and isolated while allowing independently generated products to replace examples with real providers and persistence.

## Requirements

### FR-001: Resettable external-write-free fixtures

Fixture entities MUST remain resettable and MUST NOT perform external writes or imply durable production persistence.

**Scenario: Reset a fixture session**

- **When** a fixture session is reset after entity changes
- **Then** the fixture baseline returns without external provider writes

### FR-002: Guarded synthetic contact boundary

The public contact demo MUST validate email and message on the server and terminate honeypot submissions neutrally before further work. It MUST never deliver, persist or log submitted contact data and MUST identify itself as a demo before submission.

**Scenario: Honeypot hit**

- **When** a contact submission fills the hidden honeypot
- **Then** the server returns the same neutral demo result without running subsequent validation or delivery work

**Scenario: Public demo disclosure**

- **When** a user views or submits the contact form
- **Then** its copy makes clear that it sends no email and stores no submission

### FR-003: Truthful support and contact demo results

Fixture contact and support forms MUST retain their no-email behavior. Support success MUST clear its subject and message and identify the saved fixture request. Contact demo success MUST retain entered values and explicitly state that nothing was sent or stored.

**Scenario: Support fixture saved**

- **When** a valid support submission succeeds
- **Then** subject and message clear and one result identifies the saved fixture request without claiming email delivery

**Scenario: Contact demo accepted**

- **When** a valid contact demo submission succeeds
- **Then** entered values remain and the result explicitly states that nothing was sent or stored

### FR-004: Fixture authentication remains distinct

Fixture authentication MUST remain non-durable and MUST NOT imply a configured production provider. Unconfigured optional methods MUST NOT establish a session through an implied provider fallback.

**Scenario: Use fixture authentication**

- **When** a user signs in through the template fixture implementation
- **Then** the example does not imply durable authentication or a configured production identity provider

### FR-005: Fixture storage remains distinct

Fixture behavior MUST remain external-write-free and MUST NOT masquerade as durable storage.

**Scenario: No configured private storage adapter**

- **When** a template example lacks a configured private-file provider
- **Then** its fixture does not perform external storage writes or imply durable storage

### FR-006: Demonstrations are not a business

The canonical dashboard and fixtures MUST demonstrate reusable patterns, not a specific business.

### FR-007: Fixture authentication is a reference

The fixture authentication adapter MUST stay non-durable, keep opaque sessions in server memory, and remain a reference implementation, not a production persistence model (FR-004).

### Component export

### FR-008: Bare export hierarchy

The component export's visible hierarchy MUST be only section, group, owner label, owner description, state labels, bare component and whitespace. No site navigation, `Card`, `Panel`, `Divider`, borders, shadows or decorative export chrome.

### FR-009: Scoped previews

Export previews MUST stay inside `PortalScope`, keep preview ID scoping and project one authored axis at a time.

### FR-010: Export stage geometry

Standard export stages MUST be 640px; wide and overlay stages are 1248px inside a 1440px canvas with 96px side margins. An export-geometry change requires the component sweep (`npm run verify:component-sweep`).

### FR-011: The manifest projects installed contracts

The export manifest MUST project installed typed owner contracts (useful variants, states, compositions and failure cases). It never infers public support from arbitrary exports or fills an omitted profile feature from private identities, and it preserves the generated manifest order.

### FR-012: Keep useful demonstrations

A useful prior demonstration MUST be retained until equivalent lowest-owner teaching exists.
