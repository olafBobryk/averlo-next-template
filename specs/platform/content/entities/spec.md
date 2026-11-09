# Specification: Entity presentation

**Spec path**: `specs/platform/content/entities`

**Status**: Accepted, living

**Verified by**: [docs/testing/entities.md](../../../../docs/testing/entities.md)

## Purpose

Keep entity facts, identity, actions and collection meaning consistent across detail pages, collections, selectors and genuine tool presentations.

## Requirements

### FR-001: One consistent presentation vocabulary

The same entity MUST present consistent identity, labels, fields, destinations, supported variants and commands across detail, collection, selector and tool surfaces. Provider data MUST be adapted before presentation, and organization membership MUST remain distinct from global identity under `specs/platform/services/identity`.

**Scenario: Entity appears in a selector and detail**

- **When** a user selects an entity and opens its detail
- **Then** the visible identity and destination correspond to the same entity contract

### FR-002: Authorized recoverable lifecycle

Entity mutations MUST follow server authorization and `specs/platform/data/actions` for confirmation, reversible optimism and single completion navigation. Entity loading MUST follow `specs/platform/data/loading`. An entity family MUST implement only its actual product needs rather than imply unsupported operations.

**Scenario: Failed entity update**

- **When** a server rejects a proposed entity update
- **Then** the prior visible entity state is recoverable and the UI does not imply an unsupported or completed operation

### FR-003: Collection pagination and overview continuation differ

A complete collection MUST expose its actual paging behavior. An overview continuation MUST navigate to the owning collection rather than imitate loaded collection pagination.

**Scenario: Continue from an overview**

- **When** a user activates an overview's continuation
- **Then** it opens the owning collection and does not falsely claim the overview is the complete paginated dataset

### FR-004: Tool presentation corresponds to execution

An entity tool presentation MUST exist only for a genuine supported typed tool path. It MUST preserve the entity's presentation contract and MUST NOT imply execution from a decorative or disconnected example.

**Scenario: Present an entity tool result**

- **When** an entity tool result is shown as an executable interaction
- **Then** it corresponds to the actual supported tool path and consistent entity identity
