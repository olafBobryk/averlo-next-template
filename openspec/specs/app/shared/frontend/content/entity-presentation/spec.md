# entity-presentation Specification

## Purpose

Keep entity facts, identity, actions and collection meaning consistent across detail pages, collections, selectors and genuine tool presentations.

## Requirements

### Requirement: One consistent presentation vocabulary
The same entity SHALL present consistent identity, labels, fields, destinations, supported variants and commands across detail, collection, selector and tool surfaces. Provider data SHALL be adapted before presentation, and organization membership SHALL remain distinct from global identity under `app/shared/services/identity/access-and-membership`.

#### Scenario: Entity appears in a selector and detail
- **WHEN** a user selects an entity and opens its detail
- **THEN** the visible identity and destination correspond to the same entity contract

### Requirement: Authorized recoverable lifecycle
Entity mutations SHALL follow server authorization and `app/shared/data-lifecycle/action-behavior` for confirmation, reversible optimism and single completion navigation. Entity loading SHALL follow `app/shared/data-lifecycle/loading-state-behavior`. An entity family SHALL implement only its actual product needs rather than imply unsupported operations.

#### Scenario: Failed entity update
- **WHEN** a server rejects a proposed entity update
- **THEN** the prior visible entity state is recoverable and the UI does not imply an unsupported or completed operation

### Requirement: Collection pagination and overview continuation differ
A complete collection SHALL expose its actual paging behavior. An overview continuation SHALL navigate to the owning collection rather than imitate loaded collection pagination.

#### Scenario: Continue from an overview
- **WHEN** a user activates an overview's continuation
- **THEN** it opens the owning collection and does not falsely claim the overview is the complete paginated dataset

### Requirement: Tool presentation corresponds to execution
An entity tool presentation SHALL exist only for a genuine supported typed tool path. It SHALL preserve the entity's presentation contract and SHALL NOT imply execution from a decorative or disconnected example.

#### Scenario: Present an entity tool result
- **WHEN** an entity tool result is shown as an executable interaction
- **THEN** it corresponds to the actual supported tool path and consistent entity identity
