# Main thread workflow

Read by the main thread only: the agent talking to Olaf. Subagents never read
this file; they follow their brief, `AGENTS.md`, the constitution and the specs
named in the brief. The step outline lives in [workflow.yml](workflow.yml); this
file holds the judgment.

## 1. Route the request

| Request | Route |
| --- | --- |
| A question, review or explanation | Answer directly. No branch, no spec. |
| A narrow fix to behaviour a spec already states | Lighter path: fix it on a branch with a focused regression check; skip steps 2–3. |
| A new feature or a changed rule | Steps 2–8. |
| "Bring X from project Y into the template" | The template's `backport` workflow, then steps 4–8. |
| A new project, publishing a project | The template's `create-project` or `publish` workflow. |
| A create-averlo release (template only) | Merging to `main` publishes it; see `docs/development/workflow.md`. |

Never split work into separate threads or sessions on your own. You may propose
a split; it happens only when Olaf decides.

## 2. Grill and write the spec

For a new feature, grill Olaf until every open question has an answer, then run
the [write-spec workflow](../write-spec/README.md). It amends the owner spec
(found through `specs/README.md`) or, for a genuinely new capability, creates a
folder in the right tree path. Code starts only after Olaf has approved the
spec, plan and tasks.

## 3. One integration branch, one worktree per subagent

- Cut one integration branch per batch, `feat/<batch>`, from `origin/main`,
  in its own worktree under `../.worktrees/<repo>/`.
- Split `tasks.md` into subagent units that own **disjoint files**. Two
  subagents never edit the same file; a shared file has one owner and the
  others hand it their changes in their report.
- Each subagent gets its own worktree and branch cut from the integration
  branch, commits there, and never pushes, merges or edits another worktree.
- Run independent subagents in parallel. Merge their branches into the
  integration branch in the order the plan names (dependencies first); resolve
  conflicts yourself.

### Subagent brief template

```text
Goal: <one sentence, the outcome, not the steps>
Spec: specs/<path>/spec.md (requirements <IDs>), tasks <T0NN–T0NN>
Worktree: <absolute path> on branch <branch>, cut from feat/<batch>
You own: <files/globs>. Do not touch anything else; <other agents> own <files>.
Read first: AGENTS.md, the nearest AGENTS.md for each owned folder, the spec above.
Done when: <observable result>; <checks that must pass>; committed on <branch>.
Report (≤200 words): what changed (paths), checks run with pass/fail, what is
not verified, anything that needs a spec change, commit SHAs.
```

## 4. Local review

- Start previews only through the repo wrappers (`npm run dev` picks an isolated
  port and build directory; `npm run storybook:preview` reuses the checkout's
  Storybook) or the `$preview` skill when it is installed.
- Load every changed route or story yourself before calling it live. Give Olaf
  the verified links (route URLs, Storybook story URLs) plus clickable changed
  files. If no preview runs, say so and link the files.

## 5. Checks

Before every push, run `npm run check:push` on the integration branch: lint,
typecheck, unit tests and the Storybook tests related to the files changed
since `origin/main` (set `CHECK_BASE`, e.g. `CHECK_BASE=main`, in a
project without that remote). Never push while it is unfinished or failing. A
subagent's own passing check does not prove the integrated branch passes.

The full Storybook suite, the production build and the rest of the
[verify workflow](../verify/README.md) run in CI (free on this public repo).
Run one of them locally only when a change needs it before review: the feature
suites a changed spec names, or `profiles` and `create-averlo` when assembly,
specs or `.specify/` change.

## 6. One PR per batch

Push the integration branch and open one PR with `gh pr create`. Never merge
unless Olaf asked. The body states the spec paths changed, the checks run (local
vs CI), the preview links, unresolved items and, for a backport, the source
repo and SHA.

## 7. Report

Lead with the PR link and the verified preview links. Then: what changed, checks
with results, and **what is not verified** (say it plainly; never imply a check
ran). Keep it short.

## 8. Merge order

When several PRs are open, merge in dependency order: specs and `.specify/`
first, then shared owners (`src/components/ui/**`), then surfaces, then
assembly and docs. Rebase later PRs after each merge and rerun their checks.
