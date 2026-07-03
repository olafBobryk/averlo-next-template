# Codex Orchestration

Status: active pointer

This template uses Codex Orchestration with a docked orchestration root when a
project needs durable multi-agent projection state.

- Local orchestration root: `docs/orchestration/`
- Git branch: `orchestration`
- Remote: `https://github.com/olafBobryk/averlo-next-template.git`
- Dashboard source: select this product repo or `docs/orchestration/`

The `docs/orchestration/` directory is an ignored nested Git repo. It is the
steward-owned projection source of truth when initialized.

Template worktrees should not edit projection docs directly. Worker-local
orchestration notes are evidence only until the steward promotes accepted state
into the docked orchestration root.

Do not create a `.codex-orchestration/` tree in this repo. That legacy layout is
not the projection source for this template.
