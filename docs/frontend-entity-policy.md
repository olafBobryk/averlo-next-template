# Frontend entity policy

This repository keeps entity presentation inside the dashboard product boundary.
The reference member and record verticals are examples to rename or prune, not a
global framework that every product must retain.

<!-- entity-contract:policy-version=1 -->
<!-- entity-contract:foundation=src/app/(site)/dashboard/_lib/presentation/contracts.ts -->
<!-- entity-contract:member-domain=src/app/(site)/dashboard/_lib/entities/member/domain.ts -->
<!-- entity-contract:member-presentation=src/app/(site)/dashboard/_lib/entities/member/presentation.ts -->
<!-- entity-contract:record-domain=src/app/(site)/dashboard/_lib/entities/record/domain.ts -->
<!-- entity-contract:record-presentation=src/app/(site)/dashboard/_lib/entities/record/presentation.ts -->
<!-- entity-contract:reference-demo=src/app/(site)/dashboard/reference/entities/page.tsx -->
<!-- entity-contract:prune-flag=--no-dashboard-reference-entities -->

## Dependency layers

1. Domain files contain serializable entity facts and mutation inputs. They do
   not import React, routes, adapters, or presentation components.
2. Presentation factories turn domain facts into labels, variants, fields,
   columns, URLs, and Command-K entries. They remain React-free and fetch-free.
3. Renderers consume ready presentation models. They can compose shared UI but
   never load sessions, organizations, permissions, persistence, or remote data.
4. Routes and adapters resolve the session and organization, authorize access,
   load and mutate data, and then pass resolved models into renderers.

Keep global users separate from organization memberships. A membership may add
role, organization, and joined-at facts without duplicating the underlying user.

## Required surfaces

An entity vertical should define only the surfaces its product needs. The
reference vertical demonstrates profile, compact, actor, avatar, list, table,
detail, selector, Command-K, Markdown mention, empty, and skeleton states. New
renderers belong under the entity that owns them rather than in a global renderer
or presentation registry.

Every reusable visual surface that can appear while data loads owns a
`Component.Skeleton` namespace. The live and skeleton versions must be shown
together on the dashboard entity reference route so geometry can be reviewed.

Mutations are route- or adapter-owned. Optimistic UI must preserve a rollback
path, failures must leave durable state unchanged, and destructive actions use
the shared confirmation system. Returning `false` from confirmation keeps the
modal open so the failure remains actionable.

## Agent workflow

Before adding an entity:

1. Read this policy and the nearest dashboard `AGENTS.md` files.
2. Search for existing domain, presentation, table, detail, command, deletion,
   empty, and skeleton contracts.
3. Add a vertical-owned domain and presentation factory; import it directly.
4. Add a live-versus-skeleton example and a copyable direct-import snippet.
5. Run `npm run verify:frontend-entities` and the normal type/build gates.

Repository policy wins over user-level skills. A discovery skill may recommend
focused vertical skills, but it must not invoke them automatically or replace
these local contracts.
