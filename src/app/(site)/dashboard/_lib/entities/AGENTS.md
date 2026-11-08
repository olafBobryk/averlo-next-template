# Dashboard entity contracts

Dashboard-owned entity verticals (`account/`, `invitation/`, `member/`, `organization/`, `record/`), each with `domain.ts` and `presentation.ts`.

- Read `specs/platform/content/entities/spec.md` (presentation), `specs/platform/data/actions/spec.md` (mutations), `specs/platform/data/loading/spec.md` (skeletons) and `specs/platform/services/identity/spec.md` (identity vs membership) when changing an entity.
- Four dependency layers, in this direction: serializable domain facts and mutation inputs (`domain.ts`) → React-free, fetch-free presentation factories (`presentation.ts`) → ready-model renderers and skeletons in `../../_components/entities/` → route/server adapters that resolve session, organization, authorization and persistence.
- Import owning presentation factories directly. No global entity barrel, renderer registry, presentation namespace or cross-product entity map.
- An entity implements only the surfaces it needs (profile, compact, actor, avatar, list, table, detail, selector, Command-K, Markdown mention, empty, skeleton); consumers reuse its definitions instead of copying labels or variants. New renderers stay under the owning entity.
- Fixture-only support and report domains live in `../platform/`; shared lifecycle helpers in `../entity-lifecycle.ts`; presentation contracts in `../presentation/`.
- The member and record verticals are optional reference examples.
- Run `npm run verify:frontend-entities` after changing an entity contract, renderer or canonical path. Verification: [entity verification](../../../../../../docs/testing/entities.md).
