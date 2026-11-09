# Averlo Codex plugin

## Repository contracts and operational workflows

Behaviour belongs to the target repository's Spec Kit specs: read its
`specs/README.md` map, then the owner spec of the changed surface, its shared
`specs/platform/` dependencies and any existing `specs/product/` requirements.
Principles live in `.specify/memory/constitution.md`; spec changes go through
`.specify/workflows/write-spec/`. Nearest AGENTS owns structure, Storybook owns
supported component APIs/defaults, and the procedures linked through WORKFLOWS
own execution and verification. Resolve repository paths from that
repository's root, never from this plugin installation. `specs/template/`
applies only to canonical template work and never reaches generated projects.
Do not invent product specs, load ambient siblings or infer feature
installation from folders; a conflict with a shared rule needs an explicit spec
change.

`$averlo:create-project` and `$averlo:publish-project` are short pointers to
the template's Spec Kit workflows (`.specify/workflows/create-project/` and
`publish/`). `$averlo:visual-parity` is a standalone screenshot-comparison
skill. Composition, systemization, backports and contact delivery are Spec Kit
workflows in the target repository (`.specify/workflows/compose/`,
`systemize/`, `backport/`, `contact-delivery/`), not plugin skills.

UI guidance (assistant, dashboard shell, dropdowns, surfaces, icons, file
inspection) lives in the target's specs and Storybook owners, not here.

## Authored source

`plugins/averlo/` is the sole authored source for this plugin. The local
marketplace declaration in `.agents/plugins/marketplace.json` resolves directly
to this directory.

Installed plugin copies, cache entries, and temporary marketplace material are
installation artifacts. Do not edit or synchronize them. Make every change to
plugin metadata, skills, agents, references, scripts, and tests in this
directory, then reinstall or republish the plugin when a consumer needs the
updated version.
