---
name: storybook-backport
description: Create reusable Storybook stories inside Averlo-derived product instances, track each story's candidate/approval/ported status inline, scan a bounded workspace for approved stories, and adapt the smallest reusable story and component changes back into the canonical Averlo Next template. Use for instance-to-template Storybook backports, story portability reviews, backport status transitions, or discovery of reusable UI evidence across Averlo projects.
---

# Storybook Backport

Move reusable UI evidence from product instances into the canonical template without creating a reverse-sync system or central ledger.

## Authorship

`plugins/averlo/` is the sole authored source for this workflow and every
other Averlo Next plugin asset. Installed copies and cache entries are
installation artifacts: update this source, then reinstall or republish rather
than editing or synchronizing a copy.

## Required companions

1. Read the target repository's `AGENTS.md`, nearest `AGENTS.md` files and the
   owner specs (`specs/README.md`) before creating or editing a story or UI.
   Use `$storybook:stories` when it is installed.
2. Classify every selected change as port, adapt, skip or defer; the template's
   backport workflow owns that procedure.
3. Use the repository's preview wrappers (or `$preview` when installed) for
   visual candidate review and visual backport evidence.

Read [references/story-metadata.md](references/story-metadata.md) before adding or changing backport metadata.

## Choose the mode

- **Instance mode:** create or revise a local story and prepare it for template review.
- **Template mode:** discover approved stories beneath an explicit workspace root and pull a selected story into the canonical template.

Never scan `/`, the home directory, or an inferred broad root. Never persist a workspace registry.

## Review candidates and approve a batch

Opening the template worktree, running discovery, and preparing previews do not
require candidate approval. Approval selects the exact story state that may
move from the instance into the template; it is not permission to import every
candidate.

Apply an eligibility gate before adding or reviewing candidate metadata. A
normal product section, branded composition, route block, instance shell,
client asset, or product-specific story is ordinary Storybook evidence by
default, even when it is well factored or repeated. Do not enroll it merely
because it could be generalized. A candidate must isolate a specific reusable
behavior and map it to an existing product-neutral template owner. If it would
introduce a new component family or carry instance branding, product copy, or
page composition into the template, leave it outside the lifecycle unless the
user explicitly nominates that exact story for backport review.

Before changing status or template code, present each proposed candidate in
this order:

1. Canonical story ID and source export.
2. Change: the reusable behavior that would enter the template.
3. Decision: port, adapt, skip, or defer, with the intended template owner.
4. Visual impact: yes or no.
5. Before -> after: observable behavior and appearance, including "no intended visual change" when applicable.
6. Exclusions and minimum dependencies.
7. Verification and the direct review surface when available.

Group candidates only when they share an owner, dependency, or one coherent
behavioral concern. Ask for approval of the exact ordered IDs in the proposed
batch; do not substitute adjacent candidates after approval. For a visual
candidate, capture a verified preview before mutation to preserve the current
target state, then capture it again after implementation against the same story and
comparable viewport. Non-visual candidates still require the packet, but not
invented visual evidence.

## Instance mode

1. Confirm Storybook 10.5 or newer is installed.
2. Follow the Storybook writing workflow and use documented public component owners.
3. Apply the eligibility gate above. Only then add the story-level
   `backport-candidate` tag and literal `parameters.backport` object. Do not
   mark ordinary product sections or adjacent stories.
4. Run the local Storybook interaction and accessibility checks. Use a direct
   Storybook preview when a visual decision needs human review.
5. Keep the story as a candidate until a human explicitly approves it.
6. On approval, compute the normalized story fingerprint:

   ```sh
   node <skill-path>/scripts/scan-story-backports.mjs fingerprint \
     --template <instance-root> \
     --story <absolute-story-path> \
     --export <story-export>
   ```

7. Change the tag to `backport-approved` and store that fingerprint. Re-run the scanner and story checks.

Editing an approved or ported story invalidates its fingerprint. Return it to candidate or approve the new fingerprint deliberately.

## Template mode

The canonical procedure is the template's Spec Kit backport workflow,
`.specify/workflows/backport/` (`README.md`, `workflow.yml`): pin the source
repository and SHA, classify, amend the owner specs, port rules rather than
values, and record the source in the PR. Within it, discover approved stories
with this skill's scanner:

```sh
node <skill-path>/scripts/scan-story-backports.mjs scan \
  --workspace <bounded-parent-directory> \
  --template <template-root>
```

Only `backport-approved` entries are eligible; stop and ask when two approved
stories target the same canonical story ID. Port the story plus the smallest
shared component/catalogue change, regenerate catalogues in the template, set
the target to `backport-canonical` with source repository, story ID and
fingerprint, and only after the template checks pass change the source tag to
`backport-ported`.

## Scanner contract

- Metadata must be inline object/array/string/number literals. Spreads, computed properties, helper calls, and dynamic status tags are invalid.
- Participating stories carry exactly one supported status tag.
- A schema-v2 `.template-profile.json` receipt establishes verified template lineage. Missing receipts are allowed but reported as unverified legacy lineage.
- Scanner conflicts and validation errors are blocking. Human output is the default; JSON is deterministic and contains no timestamps.
- Ordinary stories with neither a backport status tag nor `parameters.backport` remain outside the workflow.

## Completion report

Report the source and target story paths, status transition, fingerprint,
port/adapt/skip decisions, verification results, and any direct Storybook preview used. Do not create a
separate run ledger.
