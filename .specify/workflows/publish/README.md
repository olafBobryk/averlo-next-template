# Publish workflow

Publishes an initialized project to private GitLab and Vercel production. Only
when Olaf explicitly asks. Run from the template checkout; the preflight is
the read-only `create-averlo publish preflight` command
(`node packages/create-averlo/bin/create-averlo.mjs` here,
`npx --yes create-averlo` elsewhere). Steps: [workflow.yml](workflow.yml).

1. **Preflight.** `node packages/create-averlo/bin/create-averlo.mjs publish preflight --project <root>`
   reads the owner-only `~/.config/averlo/publish-project.json` and prints only
   non-secret targets. Stop if it is missing or invalid; never fall back to a
   personal namespace, GitHub or another team.
2. **Confirm all six targets** with Olaf at action time: GitLab host and
   namespace, private visibility, repository name, Vercel team, Vercel project
   name, production target. Before asking, check collisions without creating
   anything: `glab repo view <namespace>/<name>` and
   `vercel project inspect <name> --scope <team>`. Any existing project is a
   collision: stop and ask; never auto-suffix, attach, rename or transfer.
3. **Tooling.** Require `glab` and `vercel`. Authenticate GitLab with
   `glab auth login --hostname <host> --web --git-protocol <protocol> --use-keyring`;
   verify the namespace with `glab api` and the team with `vercel teams ls`.
   Never ask for a token in chat or print credential files.
4. **GitLab.** Require a clean schema-2 project on `main` with no remote and no
   `.vercel`. Rerun preflight, then
   `glab repo create <namespace>/<name> --private --defaultBranch main --skipGitInit`,
   add the configured remote, push `main` with upstream and verify URL,
   upstream, visibility and pushed SHA.
5. **Vercel** (after Olaf confirms production):
   `vercel project add`, `vercel link --yes --team --project --cwd`,
   `vercel git connect <gitlab-url>`, `vercel deploy --prod --yes`. Verify the
   deployment is ready, connected to the GitLab project, at the pushed commit,
   and that the production URL responds.
6. **Failures.** Keep resources already created; report their dashboard URLs
   and state. Never delete, rename or retry against another account. No custom
   domains, Payload activation or deploy hooks in this workflow.
