# Architecture Staging

Accepted but not yet consolidated architecture decisions for the Averlo full-start and thin-start profiles.

## Template relationship and convergence scope

- Full start remains the canonical broad template system.
- Inference Console is a design reference, not a general component donor or runtime/source dependency.
- Initial primitive convergence is limited to the `Panel` foundation and semantic `Card` system.
- The exact `Panel` and `Card` responsibilities, APIs, variants, and profile exposure remain unresolved and require a dedicated architecture decision.

## Shared profile invariant

- Components present in both full start and thin start should normally share one implementation and visual contract.
- A profile-specific implementation is allowed only as an explicit, intentional profile override.

## Filesystem-backed template profiles

- Full start and thin start use layered, filesystem-backed profile sources.
- Shared components remain canonical rather than being duplicated into complete full-start and thin-start source trees.
- Thin start is defined through a declarative profile manifest.
- Only genuine thin-specific replacements are stored as separate, real source files.

## Thin-start materialization

- The thin-start generator is a materializer: it selects shared files, applies explicit file-backed overrides, removes excluded surfaces, and adjusts profile dependencies.
- Component source code must not live inside generator strings.
- Review allowlists validate the materialized output; they do not serve as component source definitions.

## Full-start dashboard role

- The full-start dashboard is a first-class, product-neutral reference application rather than an empty shell.
- It demonstrates a coherent dashboard system across navigation, overview, list, detail, and settings surfaces.
- It demonstrates responsive behavior and loading, empty, and error states.
- Detailed route, content, data, and component boundaries remain to be decided.
