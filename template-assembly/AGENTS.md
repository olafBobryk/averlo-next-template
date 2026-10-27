# Positive project assembly

- `create:project` positively selects a route profile, content mode, and explicit opt-in capabilities. Do not restore exclusion flags, in-place mutation, or a second project-creation engine.
- Every source path, document, package, script, generated file, and surface has explicit core, surface, profile, or template-only ownership. Unclassified entries fail closed.
- Generated projects contain selected project code and a schema-v2 receipt, never template profiles, inventories, or creation machinery. Missing receipt capabilities normalize to `[]`; later capability markers remain outside the immutable receipt.
- Shared source is canonical. Profile-specific replacements are explicit file-backed overrides; never embed component or application source in renderer strings.
- Generated workspaces are disposable one-way outputs. Edit canonical source or an owned override, then reassemble.
- Keep generated routes, API exports, configuration, package state, documentation ownership, and the receipt derived from the same selected surfaces.
- Update manifests, inventories, source owners, project renderers, and verification together. Run `npm run verify:profiles`; use strict thin-start API review when its contract changes.

## Repository mode and propagation

- A schema-v2 `.template-profile.json` identifies an independent generated instance.
  Without that receipt, canonical-template identity requires package name
  `averlo-next-template` and both `template-assembly/` and `template-profiles/`.
  Do not infer template ownership from similar paths alone.
- Trace only a changed owner's proven assembly, profile, override, inventory or
  public-export edges. Canonical identity does not justify inspecting every profile
  or imply that assembler maintenance was requested. Preserve intentional omissions;
  do not widen a thin API to accommodate canonical implementation details.
- Maintain canonical assembly and demo contracts under `openspec/specs/template/assembly/`
  and `openspec/specs/template/demonstrations/`.
  Generate project-owned OpenSpec configuration and copy explicitly owned applicable
  `openspec/specs/app/` behavior and verification independently. Exclude every template
  contract and all change history; never impose canonical demo results on production apps. Shared
  dependency contracts can travel without installing optional features. Explicit
  ownership selects shared media for every profile, marketing source/public-metadata
  contracts only with marketing, and route enrichment only with dashboard. Shared
  entity/file/delivery contracts retain their conditional surface owners despite
  folder placement. Reserve `product/` for a generated project's independently
  authored business rules; generate no placeholder contract. Conditional shared
  requirements apply only to actual installed uses. Do not copy template
  history, reconciliation evidence, plugin sources or unrelated agent files.
- Regenerate derived inventories/projections from their owning commands. After
  propagation, run the ordinary focused behavior checks as well as assembly checks,
  and report actual output edges and omissions rather than obsolete router labels.
