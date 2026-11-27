# Tasks: Scroll containers

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

- [x] T001 [batch 2026-11-08] Build `ui/misc/ScrollArea.tsx` with stories, catalogue entry and play tests proving S1, S6, S7, S8b, S12 (SC-002).
- [x] T002 [batch 2026-11-08] Migrate every `ScrollBorders` user to `ScrollArea edgeStyle="border"` and retire `ScrollBorders` (S8b, SC-003).
- [x] T003 [batch 2026-11-08] Biome GritQL rule: no `overflow-*-auto` / `overflow-*-scroll` outside `ScrollArea`; existing hits tagged `debt` (S8, SC-001).
- [x] T004 Move remaining inner scrollers (dropdown panels, listbox lists, modal panels, filled `pre` blocks) inside `ScrollArea`, shrinking the `debt` list (S8). Done 2026-11-27: Dropdown panels and `Dropdown.Panel` (with `overlays` T005), the command palette results, composer picker listbox, workspace summary panel, tool output, message queue, error details `pre` and markdown code blocks. Proved by `UI/Primitives/Dropdown` `CappedPanelsScrollInside` and `Composites/Markdown` `CodeBlockScrollsInside`.
- [ ] T005 Move the last 11 `debt`-tagged scrollers inside `ScrollArea` so SC-001 holds (S8, Olaf 2026-11-27: "New template task"): the x-axis rows (`DashboardTablePanel` table and its skeleton, the markdown table, the `FileInput` file row, the `ComboboxMultiSelectInput` chip row), the app-shell scrollers (the dashboard sidebar body, the dashboard `main` in the `standard` and `wide` profiles), the assistant `Conversation` transcript, the `FileViewer` two-axis pan viewport, and the `surfaceStyles` `overflow="auto"` variant (removed: a filled surface never scrolls). A side with no edge draws no mask (S7, S9).
