<INSTRUCTIONS>
## Purpose
Centralize the demo catalog in a single source of truth and keep demo pages consistent, discoverable, and quick to extend.

## Source of Truth
- All demo content lives in `src/app/demo/content.tsx`.
- The page renderer and nav read from this content map; do not hand‑edit multiple page files.

## Content Schema (Required Fields)
Each entry in `demoPages` must include:
- `id`: unique, kebab‑case string (used for keys).
- `slug`: array of path segments (e.g., `["ui", "primitives"]`).
- `title`: page title.
- `description`: short page summary.
- `visibility` (optional): `"public"` or `"dev-only"`. Omit for normal pages.
- `groups`: array of groups.

Each `group` must include:
- `id`: unique within the page.
- `title`: group title.
- `description`: short group summary.
- `items`: array of demo items.
- `columns` (optional): grid class overrides (e.g., `"grid-cols-1 lg:grid-cols-2"`).

Each `item` must include:
- `id`: unique within the group.
- `name`: component or concept label shown on the card.
- `label`: short descriptor shown in the card header.
- `kind`: `"component"` or `"usage"`.
- `related` (optional): `{ uses: string[]; usedIn: string[] }`.
- `skeleton` (optional, component only): `{ name?, label?, className?, related?, Render }`.

For `kind: "component"`:
- Provide `Render()` returning the demo JSX.
- Keep any hooks inside the `Render` component.
- If the component exposes `.Skeleton`, add a `skeleton` entry so it appears in `/skeleton` compare view.

For `kind: "usage"`:
- Provide `snippet` (string) for the CopyField.

## Adding a New Demo
1. Add a new page or group in `demoPages`.
2. Add items using the same card types.
3. If needed, add new `relatedMap` entries to support “Uses / Used by”.
4. Keep slug segments aligned with the source folder being documented, usually `src/components` and, where relevant, shared utilities like `src/lib`.
5. For skeleton support, add a `skeleton` config and verify `/demo/**/skeleton`.
6. Use `visibility: "dev-only"` for playground pages such as `/demo/test`; they stay routable but are hidden from overview and sidebar in production.

## Demo Requirement
- New reusable features in `src/components` should normally add demo coverage in this file.
- New reusable features in `src/lib` should add demo coverage here when they have a public API, interactive behavior, or are intended for reuse by agents.
- A reusable feature is not considered documented until the demo content, usage snippet, and any required `relatedMap` entries are present together.

## Naming + Slugs
- `id`: kebab‑case.
- `slug`: mirror the components folder path.
- `title`: human‑readable (Title Case).
- `visibility`: prefer `"public"` unless the page is experimental or purely for local testing.

## Demo Idea (Structure Example)
```ts
{
  id: "ui-primitives",
  slug: ["ui", "primitives"],
  title: "UI Primitives",
  description: "Typography, buttons, layout",
  groups: [
    {
      id: "typography",
      title: "Typography",
      description: "Text variants",
      items: [
        {
          id: "text",
          kind: "component",
          name: "Text",
          label: "Typography variants",
          related: relatedMap.Text,
          Render() {
            return (
              <div className="flex flex-col gap-1">
                <Text as="h3" variant="headingXs">Heading XS</Text>
                <Text variant="body">Body text</Text>
              </div>
            );
          },
        },
        {
          id: "section-usage",
          kind: "usage",
          name: "Section",
          label: "Page section",
          snippet: "<Section><Section.Background>...</Section.Background>...</Section>",
        },
      ],
    },
  ],
}
```

## Skeleton View
- Any page with skeletons automatically has a `/demo/**/skeleton` view.
- Default demo pages do **not** show skeletons.
- Skeleton view renders paired cards (live + skeleton) for direct comparison.

## Production Visibility
- `visibility: "dev-only"` pages are hidden from the overview and sidebar when `process.env.NODE_ENV === "production"`.
- Dev-only pages still resolve directly by URL so they can be shared internally when needed.
</INSTRUCTIONS>
