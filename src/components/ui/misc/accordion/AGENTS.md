# Folder: `src/components/ui/misc/accordion`

Component-owned implementation for the public `Accordion` composition.

## Read

- `specs/platform/design-system/families/presence/spec.md` when changing
  disclosure motion.
- Storybook owner stories for the `Accordion` API and defaults.

## Structure

- `Accordion.tsx` is the server-safe public owner inside this folder; do not
  make the entire public owner client-only.
- `AccordionClient.tsx` and `Accordion.shared.ts` are private implementation
  modules and use direct sibling imports.
- Compact and Card disclosure implementations remain under the `Accordion`
  namespace. Their animation delegates to the private motion/presence
  `DisclosurePresence` owner shared with controlled ContentPresence.
