# Tasks: Scroll containers

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

- [ ] T001 [batch 2026-11-08] Build `ui/misc/ScrollArea.tsx` with stories, catalogue entry and play tests proving S1, S6, S7, S8b, S12 (SC-002).
- [ ] T002 [batch 2026-11-08] Migrate every `ScrollBorders` user to `ScrollArea edgeStyle="border"` and retire `ScrollBorders` (S8b, SC-003).
- [ ] T003 [batch 2026-11-08] Biome GritQL rule: no `overflow-*-auto` / `overflow-*-scroll` outside `ScrollArea`; existing hits tagged `debt` (S8, SC-001).
- [ ] T004 Move remaining inner scrollers (dropdown panels, listbox lists, modal panels, filled `pre` blocks) inside `ScrollArea`, shrinking the `debt` list (S8). Not in this batch.
