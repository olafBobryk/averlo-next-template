# Folder: `src/components/ui/misc/accordion`

## Role

Component-owned implementation for the public `Accordion` composition.

## Public Surface

- External consumers import `Accordion` and its public types from `@/components/ui/misc`.
- `Accordion.tsx` is the public owner inside this folder.
- `AccordionClient.tsx` and `Accordion.shared.ts` are private implementation modules and use direct sibling imports.

## Invariants

- Preserve the server-safe public entry and skeleton boundary; do not make the entire public owner client-only.
- Keep compact and Card disclosure variants under the `Accordion` namespace.
- Preserve live/skeleton geometry and shared Card, Button, Text, icon, focus, and motion conventions.
