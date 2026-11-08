# Backport workflow

"I like what a child project did; bring it into the template." Template only.
A procedure, not a spec: there is no spec per run. Children are never forced to
pull template changes. Steps: [workflow.yml](workflow.yml).

1. **Pin the source.** Record the child repository and the commit SHA that holds
   the change. Read it without checking it out in the template:
   `git -C <child> diff <base>..<sha> -- <paths>` and
   `git -C <child> show <sha>:<path>`.
2. **Classify every hunk** as port, adapt, skip or defer, and agree the list
   with Olaf:
   - Port **rules** and reusable behaviour. Never port the child's values
     (tokens, durations, copy, branding), its code style or product domains.
   - A product section, branded composition or route block is not a candidate
     unless Olaf names it.
   - Map each port to an existing template owner; a new owner needs a spec.
3. **Specs first.** Amend the owner specs through the
   [write-spec workflow](../write-spec/README.md); the Clarifications session
   cites the source repo and SHA.
4. **Port** on the integration branch through the main workflow (subagents own
   disjoint files). For approved Storybook candidates, the scanner finds them:
   `node plugins/averlo/skills/storybook-backport/scripts/scan-story-backports.mjs scan --workspace <bounded-parent> --template .`
   (see `plugins/averlo/skills/storybook-backport/SKILL.md` for the tag
   lifecycle).
5. **Check.** `npm run verify:static`, the changed owners' suites,
   `npm run verify:profiles` if assembly is touched, Storybook for components.
6. **PR.** One PR whose body records `Backport from <repo>@<sha>` and the
   port/adapt/skip/defer list. Optionally add a dated record under
   `docs/operations/`.
