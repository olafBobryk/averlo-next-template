# Dashboard entity contracts

## Ownership

- Keep global account identity separate from organization-scoped membership facts.
- Domain modules own serializable facts and mutation inputs. Presentation factories derive labels, fields, columns, URLs, semantic variants, and commands without React or data fetching.
- Renderers consume ready presentation models. Routes and adapters resolve sessions, organizations, capabilities, persistence, and mutation.
- Import owning presentation factories directly. Do not add a global entity barrel, renderer registry, or presentation namespace.
- The reference member and record verticals are optional examples, not a framework every product must retain.
- Keep four distinct layers: serializable domain facts/mutation inputs; React-free,
  fetch-free presentation factories; ready-model renderers and owned skeletons;
  route/server adapters for session, organization, authorization and persistence.
  Do not add cross-product entity maps, a presentation namespace or an optional
  entity framework. Client visibility never replaces execution authorization.
- Fixture/report domains stay explicit and resettable, with no external writes
  or implied durable production persistence unless that persistence is explicitly
  introduced through its owning boundary.

## Reuse

- An entity implements only the profile, compact, actor, avatar, list, table, detail, selector, Command-K, Markdown mention, empty, and skeleton surfaces it actually needs.
- Reuse the owning definitions wherever those surfaces appear. New renderers remain under their owning entity.
- Run `npm run verify:frontend-entities` after changing an entity contract,
  renderer, or canonical path.

## Behavioral contracts and evidence

Follow [entity presentation](../../../../../../openspec/specs/app/shared/frontend/content/entity-presentation/spec.md),
[action behavior](../../../../../../openspec/specs/app/shared/data-lifecycle/action-behavior/spec.md),
[loading behavior](../../../../../../openspec/specs/app/shared/data-lifecycle/loading-state-behavior/spec.md)
and [access and membership](../../../../../../openspec/specs/app/shared/services/identity/access-and-membership/spec.md).
Use [entity verification](../../../../../../docs/testing/entities.md); load assistant
or Markdown policy only when the selected entity actually uses those surfaces.
