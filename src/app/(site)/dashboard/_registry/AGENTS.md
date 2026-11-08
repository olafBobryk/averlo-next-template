# Dashboard registry policy

Dashboard-owned enrichment of canonical route identity: navigation, ancestry, layout width, capabilities and static commands.

- Read `specs/platform/navigation/routes/spec.md` and `specs/platform/surfaces/dashboard/navigation/spec.md` when adding, moving or removing a destination; verification is `docs/testing/routes-and-metadata.md`.
- Canonical paths and matching derive from `src/config/surfaces/dashboard.ts`. `surfaceRegistry.ts` adds, once per destination: parent, sidebar tier, required capability, layout width, domain area, optional non-route source roots and commands. Do not create competing route maps.
- A destination change updates its registry entry in the same change; standard verification discovers unregistered pages and stale entries.
- `access.server.ts` is server-only capability resolution; `debug.ts` holds debug wiring.
- Contextual commands register through the shell-owned provider in `../_components/commands/`.
- `/dashboard/platform` routes stay in this registry and the shared dashboard shell.
- Entity presentation is owned by `src/app/(site)/dashboard/_lib/entities/AGENTS.md`; registry entries expose routes only. Browser metadata belongs to the shared family factories (`src/config/AGENTS.md`), not to registry labels.
