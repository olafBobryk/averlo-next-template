# Dashboard entity renderer policy

React renderers for dashboard entities, one folder per vertical (`account/`, `member/`, `organization/`, `record/`) plus shared `EntitySelector`, `EntityDeletion`, `EntityIdentity` and `DashboardEntityState`.

- Read `specs/platform/content/entities/spec.md` when changing entity presentation, `specs/platform/data/actions/spec.md` for mutations and deletion, and `specs/platform/data/loading/spec.md` for skeletons.
- Renderers receive ready presentation models or domain facts; they never fetch sessions, organizations, capabilities or persistence. Domain facts and presentation factories live in `../../_lib/entities/<entity>/`; routes and adapters own authorization at execution.
- Import the owning entity's presentation factory directly; no global renderer or presentation registry.
- Loading states are `Component.Skeleton` on their live component, with colocated owner stories.
- Entity selectors compose `EntitySelector`; each entity wrapper owns its presentation model and option renderer.
- Tool lifecycle chrome belongs to `src/components/domain/assistant/message/assistant/tool-call/ToolPresentationFrame.tsx`; an entity tool wrapper (only `record/` today) owns its factory and result renderer.
- Data tables compose `../data/DashboardTablePanel.tsx` and its `Skeleton`; prefer shared table, detail, property-list, Markdown, selector, More-menu, state, toast and modal owners over entity-local substitutes.
- Verification: [entity verification](../../../../../../docs/testing/entities.md).
