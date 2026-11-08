---
name: create-project
description: Create a new independent Averlo project with the public create-averlo npm initializer, choose an explicit profile and content mode, and verify the generated documentation, dependency state, and remote-free Git repository. Use when starting, bootstrapping, or initializing an Averlo-derived application instead of cloning or copying the template repository.
---

# Create Project

The canonical procedure is the template's Spec Kit workflow
`.specify/workflows/create-project/` (`README.md` for the steps, `workflow.yml`
to run them) in [averlo-next-template](https://github.com/olafBobryk/averlo-next-template/tree/main/.specify/workflows/create-project).
Read it from a local template checkout when one exists, otherwise from GitHub,
and follow it. Its core is two commands:

```sh
npx --yes create-averlo <project-directory> --profile <profile> --content <content> [--no-install]
npx --yes create-averlo verify <project-directory> --profile <profile> --content <content> [--no-install]
```

Do not clone or copy the template, add a remote or offer `--force`. Publishing
is a separate, explicitly requested `$averlo:publish-project` run.
