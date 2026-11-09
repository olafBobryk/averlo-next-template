# Implementation Plan: Design-system usage

**Spec**: [spec.md](./spec.md) | **Batch**: 2026-11-08

## Summary

Enforce FR-006 to FR-008 where a machine can: Biome GritQL plugins registered in `biome.json` `plugins`, one rule file per check, each owned by the spec that states the rule. Existing hits are tagged `debt` (or an exception ID from the register in `specs/platform/design-system/scroll`) so new hits fail.

## Rules and owners

| Rule | Owning spec |
|---|---|
| Motion literals outside token files | `motion` U1 |
| Height tricks (`max-h-*`, `grid-rows-[0fr]`, `interpolate-size`) | `motion` H3 |
| Ad hoc `overflow-*-auto|scroll` outside `ScrollArea` | `scroll` S8 |
| Raw `<input>` / `<textarea>` outside `ui/input` owners | `families/inputs` F1 |
| `text-danger` / `border-danger` outside `Field` and feedback owners | `families/inputs` F2 |

## Technical Context

- **Tooling**: Biome 2 GritQL plugins (`biome.json` `plugins`); `npm run lint` runs `biome check`; GitHub Actions runs lint on PRs (this batch).
- **Constraint**: ignores cite `debt` or `E-00N`; the `debt` count only shrinks.
