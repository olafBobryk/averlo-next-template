# Specs

Living Spec Kit specs. The folder path is the spec's identity: there are no
feature numbers. Each folder has a `spec.md`; `plan.md` and `tasks.md` exist
only while there is open work. Principles live in
[`.specify/memory/constitution.md`](../.specify/memory/constitution.md); the
procedure for writing a spec lives in `.specify/workflows/write-spec/`.

## Map

```
specs/
  platform/                         reusable, product-neutral; selected parts copy to clones
    design-system/
      usage/                        which owner for which pattern; never re-implement
      motion/                       every visible change animated; responsive rendering
      scroll/                       inner scrollers, ScrollArea; the exceptions register
      families/
        inputs/                     Field, InputFrame, ui/input owners
        buttons/                    Button, ArrowAction, copy actions
        presence/                   ContentPresence, MorphLabel, IconSwap, feedback presence
        overlays/                   Dropdown, Listbox, modals, toasts; keyboard and focus
    content/
      hierarchy/                    grouping, context, alignment, legible colour
      entities/                     entity presentation across detail, collection, selector
      media/                        durable, accessible, responsive media
    navigation/
      routes/                       installed destinations, ancestry, contextual actions
      metadata/                     private titles, canonical and social metadata
    data/
      forms/                        form submission and recovery
      loading/                      initial and region loading
      actions/                      non-form mutations
    services/
      identity/                     sessions, organizations, platform access
      files/                        private file access
      delivery/                     contact delivery and submission protection
      transport/                    API client outcomes
    surfaces/
      marketing/
        composition/                ordered sections inside the shared shell
        content-sources/            static, CMS-ready and CMS-powered sources
        metadata/                   public titles and metadata
        pages/                      how to build any public page
      dashboard/
        navigation/                 route enrichment
        shell/                      shell geometry, sidebar, toolbar, commands
        pages/                      how to build any dashboard page
  template/                         canonical-only; never copied to clones
    assembly/                       project assembly
    demos/                          demo fixtures
    hero-collage/                   home hero collage reflects stack, skills, workflows
  product/                          empty here; a project's own specs
```

## Where a new spec goes

1. **Is it a change to something that already has a spec?** Amend that spec
   (see below). This is the usual case.
2. **Is it reusable and product-neutral?** A new folder under `platform/`,
   next to its closest sibling.
3. **Is it about the template machinery itself?** `template/`.
4. **Is it a real product rule?** `product/`, in a generated project only:
   `domain/<entity>`, `marketing/pages/<route>`, `dashboard/<area>`,
   `integrations/<provider>`. Pages use
   [`.specify/templates/page-spec-template.md`](../.specify/templates/page-spec-template.md).

A new folder needs a genuinely new capability. A sibling folder, a similar
name, or a new screen does not count.

## How to amend a spec

1. Add a `### Session YYYY-MM-DD` under `## Clarifications` with the questions
   and Olaf's answers, naming the requirement IDs each answer changes.
2. Change or add requirements. Published IDs stay stable; a retired ID is
   never reused.
3. Add the work to `tasks.md` (create `plan.md`/`tasks.md` if the folder has
   none). Remove both again once the work is done and proved.

Spec Kit's scripts take the folder from `SPECIFY_FEATURE_DIRECTORY` or the
gitignored `.specify/feature.json`, for example:

```sh
SPECIFY_FEATURE_DIRECTORY=specs/platform/design-system/motion \
  .specify/scripts/bash/setup-plan.sh --json
```

## How clones receive specs

A generated project receives `.specify/` and the `platform/` specs its profile
selects, plus an empty `product/` skeleton. It never receives `template/`.
After generation the copies are the project's own: it amends them freely, and
it is never forced to pull later template changes. Bringing a project's
improvement back into the template is a backport, which records the source
repository and commit in its PR.
