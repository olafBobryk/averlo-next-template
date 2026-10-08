# create-averlo

Create an independent Averlo project from a pinned template profile.

```sh
npx create-averlo my-project --profile thin-start --content static
```

The initializer fetches the exact template commit associated with its package
version, assembles the selected profile, installs dependencies, and creates a
fresh local Git repository on `main`. It never copies or assigns the template
repository remote.

## Options

```text
create-averlo <project-directory> [options]

--profile <id>      full, app-only, marketing-only, or thin-start
--content <mode>    static or payload-ready; defaults to the profile setting
--no-install        Generate the lockfile without installing dependencies
--help              Show command help
--version           Show the package version
```

Interactive terminals prompt for a missing project directory, profile, and
content choice. Agents and other non-interactive callers must provide the
directory and profile explicitly.

Generated repositories have no remote. Add one later with the normal Git or
GitHub workflow for the project that will own it.

## Publishing

Every push to `main` runs `publish-create-averlo.yml`. It prepares the next npm
patch version from a clean committed template, verifies all profiles and an
installed generated project, publishes through npm trusted publishing, checks
public project creation, and records a GitHub release. Publishing is serialized;
queued pushes use the newest `main`. A rerun skips publishing when npm already
points to that commit. `workflow_dispatch` provides a manual retry.

Package versions are assigned in a disposable publication directory. The source
checkout stays clean, the pinned template commit remains fetchable, and release
version changes do not create a commit/publish loop. The published npm version
can therefore be newer than the source package manifest.

Configure the npm trusted publisher for `olafBobryk/averlo-next-template`, workflow
`publish-create-averlo.yml`, with publishing allowed. No long-lived npm token is
required. A failed workflow means npm remains on the previous released template;
check Actions rather than waiting for propagation.

Explicit `create-averlo-v*` GitHub releases still support manually chosen package
versions matching the committed manifest. Use `npx create-averlo@latest` to request
the latest published generator, or pin an exact version for reproducibility.

Generated projects are independent snapshots; publishing a newer generator does
not update existing projects. Local uncommitted template changes are not released.
