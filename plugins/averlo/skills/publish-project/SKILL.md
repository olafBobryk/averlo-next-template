---
name: publish-project
description: Publish a verified local Averlo project to configured private GitLab ownership and a configured Vercel production team, with explicit target confirmation, collision checks, Git/Vercel verification, and safe partial-failure reporting. Use only when the user explicitly asks to create the remote repository, connect Vercel, deploy production, or make an initialized Averlo project live.
---

# Publish Project

The canonical procedure is the template's Spec Kit workflow
`.specify/workflows/publish/` (`README.md` for the steps and confirmations,
`workflow.yml` for the gates) in [averlo-next-template](https://github.com/olafBobryk/averlo-next-template/tree/main/.specify/workflows/publish).
Read it from a local template checkout when one exists, otherwise from GitHub,
and follow it exactly. It starts with the read-only preflight, which reads the
owner-only `~/.config/averlo/publish-project.json` and prints only non-secret
targets:

```sh
npx --yes create-averlo publish preflight --project <project-root>
```

Every external write waits for Olaf's explicit confirmation of all six targets
(GitLab host and namespace, private visibility, repository name, Vercel team,
Vercel project, production target). Stop on any collision; never request a
token in chat, print credentials or fall back to another account.
