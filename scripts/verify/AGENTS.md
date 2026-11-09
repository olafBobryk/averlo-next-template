# Folder: `scripts/verify`

Executable repository verification entrypoints, one per `verify:*` npm script.
Run them through the [verify workflow](../../.specify/workflows/verify/README.md).

- Add a verifier as `verify-*.ts` or `verify-*.mjs` and expose it through a
  stable `verify:*` package script; keep script names stable when moving files.
- Resolve fixtures and sources from the repository root unless a verifier tests
  path-relative behaviour.
- Verifiers may read source text but never rewrite product source or generated
  profile output.
- Helpers shared with non-verification scripts live outside this folder.
- When a verifier path changes, update assembly ownership
  (`template/assembly/manifest.mjs`, `template/surfaces/`), profiles, package
  scripts and the docs that name it. Optional surfaces list their verifiers in
  `template/surfaces/`.
