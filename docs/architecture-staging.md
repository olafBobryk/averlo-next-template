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
- Full start's live source is the canonical shared source rather than being materialized from a separate package.
- Thin start references canonical shared files through its profile manifest.
- Only genuine thin-specific replacements are stored as separate, real source files outside the full-start import graph.
- One authoritative profile manifest declares shared inclusions, file-backed overrides, removals, dependencies, retained routes and scripts, public API allowances, and required validations.
- Generator reporting and API review derive from the authoritative profile manifest rather than maintaining parallel configuration lists.

## Thin-start materialization

- The thin-start generator is a materializer: it selects shared files, applies explicit file-backed overrides, removes excluded surfaces, and adjusts profile dependencies.
- Component source code must not live inside generator strings.
- Review allowlists validate the materialized output; they do not serve as component source definitions.
- Routine thin-start development materializes into an ignored, isolated profile workspace that can run beside the canonical full-start preview.
- Previewing thin start must not rewrite the canonical checkout.
- In-place materialization is reserved for creating a new template instance.
- Materialized thin-start workspaces are disposable and must not be edited directly.
- Changes are made in canonical shared source or explicit thin override files, then the materialized workspace is refreshed.

## Profile parity gate

- Architecture-significant shared-system changes can be reviewed against full-start and thin-start previews produced from the same commit.
- Both profiles receive type, build, and smoke verification.
- Both profiles receive public API-surface review and a small visual route matrix.

## Full-start dashboard role

- The full-start dashboard is a first-class, product-neutral reference application rather than an empty shell.
- It demonstrates a coherent dashboard system across navigation, overview, list, detail, and settings surfaces.
- It demonstrates responsive behavior and loading, empty, and error states.
- Detailed route, content, data, and component boundaries remain to be decided.
