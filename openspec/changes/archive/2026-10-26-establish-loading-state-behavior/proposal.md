# Proposal

## Why

Loading behavior is currently scattered through repository workflow prose, while complete forms already have a maintained behavioral specification. Group their independent contracts under a data-lifecycle family and migrate loading rules without losing the established form scenarios.

## What Changes

- Introduce `data-lifecycle/loading-state-behavior` for known-content preservation, data-dependent placeholders, layout parity, accessible loading, and distinct terminal region states.
- Relocate `form-behavior` to `data-lifecycle/form-behavior`, retaining every requirement and scenario verbatim. Update live references and generated instructions; preserve archived change history.
- Use cross-references to separate read/region loading from pending form submissions. The parent folder is organizational and contains no duplicate requirements or custom inheritance mechanism.
- Exercise authentication and record list/detail surfaces at desktop and narrow widths, repair violations found in that pilot, and propagate applicable procedures and verification through positive assembly.
- Make the shared Skeleton component shimmer by default, preserving its static opt-out and reduced-motion behavior. Remove obsolete static-default guidance. This is an implementation change, not a new normative shimmer requirement.

## Capabilities

### New Capabilities

- `data-lifecycle/loading-state-behavior`: presentation and recovery of data-dependent region states while keeping independent content usable.
- `data-lifecycle/form-behavior`: unchanged complete-form requirements relocated into the approved family.

### Modified Capabilities

- `form-behavior`: retire the old path only after its entire contract is preserved at `data-lifecycle/form-behavior` and all current references are updated.

## Impact

OpenSpec artifacts and repository references, selected auth/dashboard loading owners, shared Skeleton, browser verification and its procedure, and assembly ownership/instructions. Existing component APIs, structural policies, route authorization, fixture-only behavior, and stock OpenSpec integrations remain with their current owners. No provider integration, universal data framework, custom schema, app-wide redesign, or exhaustive loading audit is included.
