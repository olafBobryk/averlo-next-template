# Create-project workflow

Creates an independent project with the published `create-averlo` initializer.
Template only: it runs before a project exists. Steps:
[workflow.yml](workflow.yml).

1. Collect four answers: destination directory (lowercase npm-compatible
   basename, must not exist), profile (`full`, `app-only`, `marketing-only`,
   `thin-start`), content (`static` or `payload-ready`; `app-only` is `static`
   only) and whether to install dependencies (default yes). The CLI rejects
   unsupported combinations itself; never offer `--force`.
2. Requirements: Node.js 20.9+, Git with `git init -b`, a configured Git author.
3. Run it from the directory that will contain the project:

   ```sh
   specify workflow run <template>/.specify/workflows/create-project/workflow.yml \
     -i directory=<dir> -i profile=<profile> -i content=<content> [-i install=no]
   ```

   or the two commands directly:

   ```sh
   npx --yes create-averlo <dir> --profile <profile> --content <content> [--no-install]
   npx --yes create-averlo verify <dir> --profile <profile> --content <content> [--no-install]
   ```

   `create-averlo verify` checks the package name, the schema-2 receipt,
   `PRODUCT.md`/`AGENTS.md`/`docs/README.md`/`.specify/`/`specs/`, the lockfile
   and dependency state, and git (`main`, one commit, clean, no remote).
4. If verification fails, report the exact mismatch. Do not repair it by
   copying template files or adding a remote.
5. Hand off the absolute path, profile, content, pinned template commit,
   install state and `cd <path> && npm run dev` (`npm install` first for a
   lockfile-only project). Publishing is a separate, explicitly requested
   [publish](../publish/README.md) run.
