# Architecture Staging

Accepted but not yet consolidated architecture decisions for the Averlo full-start and thin-start profiles.

## Template relationship and convergence scope

- Full start remains the canonical broad template system.
- Inference Console is a design reference, not a general component donor or runtime/source dependency.
- Initial primitive convergence is limited to the `Panel` foundation and semantic `Card` system.

## Panel and Card contract

- `Panel` is the non-semantic surface primitive.
- `Card` is a structured content pattern built on `Panel`, with header, title, description, action, content, and footer slots.
- `Panel` owns background, border, radius, shadow, overflow, width, padding, basic display and gap, polymorphic element selection, and ref forwarding.
- `Panel` does not own responsive columns or card-specific structure. Responsive composition belongs to layout components or caller-supplied classes.
- `Card` fixes sensible surface defaults and owns density through a small size contract.
- Card slots own their internal spacing and typography.
- `Card` may expose bounded escape hatches such as overflow, shadow, semantic accent, and caller-supplied classes, but it does not pass through every `Panel` layout property.
- The shared semantic accent vocabulary is `neutral`, `info`, `success`, `warning`, and `danger`.
- Surface and card-slot accents use the same semantic accent system.
- Arbitrary hexadecimal accents and separate translucent-versus-solid public modes stay outside the shared primitive contract unless a later dashboard requirement demonstrates that they are necessary.
- Full start and thin start both expose `Panel` and `Card` through the same implementation.
- Thin start remains smaller by excluding higher-level surfaces rather than hiding a foundational primitive used by `Card`.
- Card slots must be used under a real `Card` root. Consumers must not place card slots under a raw `Panel` by imitating Card data attributes.
- Overlays that need Card structure should use `Card` as their root; overlays with materially different structure should define overlay-owned slots.

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
