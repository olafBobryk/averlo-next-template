# Dashboard registry policy

- Canonical dashboard path and matching data derive from
  `src/config/surfaces/dashboard.ts`; dashboard navigation, ancestor trails,
  layout width, capability checks, and static commands compose that route data
  with dashboard-owned metadata in `surfaceRegistry.ts`.
- New surfaces declare their route once in the Dashboard route registry and
  their parent, sidebar tier, required capability, layout width, dashboard
  domain area, optional non-route source roots, and commands once in the
  matching dashboard metadata entry.
- Adding, moving, or removing a dashboard destination in a template instance
  requires updating its canonical registry entry in the same change. Standard
  verification discovers unregistered pages and stale registered routes.
- Dashboard domain reporting is derived from relative edited paths. Treat it as
  observed activity only, never proof that a domain was inspected or corrected.
- Capability-hidden destinations must also be denied by their server page; UI
  visibility alone is not authorization.
- Contextual commands register through the shell-owned command provider and must
  unregister when their owning surface unmounts.
- Keep product-specific entities and their presentation below the dashboard
  route boundary. Do not create a global entity renderer or presentation map.
- Platform management is a separate dashboard-owned access axis. Never infer
  `platformRole` from organization owner or administrator membership; keep its
  `/dashboard/platform` routes in this registry and the shared dashboard shell.
- Entity paths, dependency layers, examples, and selection contracts are defined in
  `src/app/(site)/dashboard/_lib/entities/AGENTS.md`; registry entries expose routes but do not own
  entity presentation.

## Identity, hierarchy and commands

- Behavioral authority is `openspec/specs/app/shared/frontend/navigation/route-identity/spec.md`
  and dashboard-specific `openspec/specs/app/dashboard/navigation/route-enrichment/spec.md`;
  use `docs/testing/routes-and-metadata.md` for verification. Read only the
  changed family registry, route shape and affected consumers.
- Shared identity owns canonical family-prefixed IDs, hrefs, exact/pattern
  matching and typed dynamic parameters. Dashboard metadata enriches that
  identity with labels, descriptions, icons, capabilities, layout width,
  navigation placement, parent hierarchy, domain ownership/source roots and
  commands; marketing/auth do not inherit dashboard information architecture.
- Parentage is semantic information architecture, never directory nesting or
  cross-link history. Reuse vocabulary across navigation, ancestor trails,
  headings, loading, commands and domain reports. Top-level routes have no
  ancestor trail; nested trails contain only navigable registered ancestors and
  the page heading names the current destination.
- Do not create competing route maps or register summaries, filters, helper UI,
  repeated renderings, nested actions or developer routes as peer product
  surfaces. Internal developer routes remain outside product identity.
- Contextual actions belong to their canonical surface and exposed owning API.
  Registration returns cleanup on unmount; close command search before navigation
  or execution. Modal-backed commands require an exposed owning action API.
  Visibility never substitutes for server denial, including the platform axis.
- Browser metadata belongs to shared family factories, not dashboard enrichment
  or page-local copies of registry labels. See `src/config/AGENTS.md`.
