# Positive project assembly

Template-only engine behind `npm run create:project` and `create-averlo`.

- Read `specs/template/assembly/spec.md` before changing what a generated
  project receives; verify with `npm run verify:profiles`
  ([procedure](../docs/operations/project-assembly.md)).
- `manifest.mjs` classifies every source path, document, script and package as
  generated, core, surface-owned (`template-surfaces/`), profile-owned
  (`template-profiles/`) or template-only. Unclassified entries fail closed.
- `assembler.mjs` copies the selected plan and writes the generated root files
  (`AGENTS.md`, `PRODUCT.md`, `README.md`, `WORKFLOWS.md`, `docs/README.md`).
  `project-files.mjs` renders central config; `capabilities/` maps opt-in
  capabilities to surfaces.
- `thin-start-src-files.json` is the positive thin-start `src/` inventory;
  regenerate it with `scripts/generate-template-assembly-inventory.mjs`.
- Shared source stays canonical; profile-only replacements live in
  `template-profiles/<profile>/overrides/`. Never embed source in renderer
  strings or edit a materialized workspace.
- A schema-v2 `.template-profile.json` marks a generated project. Without it,
  the canonical template is identified by package name `averlo-next-template`
  plus `template-assembly/` and `template-profiles/`.
- `notes/` holds dated backport records, not policy.
