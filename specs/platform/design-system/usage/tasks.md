# Tasks: Design-system usage

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

- [ ] T001 [batch 2026-11-08] Register the GritQL plugins in `biome.json` `plugins` and run them in `npm run lint` (FR-007, SC-002). Rule tasks: `motion` T003–T004, `scroll` T003, `families/inputs` T004–T005.
- [ ] T002 [batch 2026-11-08] Tag every existing hit `// biome-ignore lint/plugin/<rule>: debt` (or an exception ID) so the lint passes and new hits fail.
- [ ] T003 [batch 2026-11-08] Once `MorphLabel`, `ScrollArea` and `useAnimated()` land, confirm every FR-006 owner path resolves (SC-001).
