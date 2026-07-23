# Dashboard registry policy

- Dashboard navigation, ancestor trails, layout width, capability checks, and
  static commands derive from `surfaceRegistry.ts`. Do not mirror dashboard
  routes in the global marketing route registry.
- New surfaces declare their route, parent, sidebar tier, required capability,
  layout width, and commands in one registry entry.
- Capability-hidden destinations must also be denied by their server page; UI
  visibility alone is not authorization.
- Contextual commands register through the shell-owned command provider and must
  unregister when their owning surface unmounts.
- Keep product-specific entities and their presentation below the dashboard
  route boundary. Do not create a global entity renderer or presentation map.
- Platform management is a separate dashboard-pruned access axis. Never infer
  `platformRole` from organization owner or administrator membership; keep its
  `/dashboard/platform` routes in this registry and the shared dashboard shell.
- Entity paths, dependency layers, examples, and pruning contracts are defined in
  `docs/frontend-entity-policy.md`; registry entries expose routes but do not own
  entity presentation.
