# Design

## Context

The existing form contract has nine requirements and seventeen scenarios. Loading rules live in `loading-parity.md` plus fetched-region guidance in `action-lifecycle.md`. The current auth loading views replace known links with inert button skeletons. Dashboard loading owners preserve static headings but put entire compositions inside a live status region. Dashboard debug states already offer deterministic loading/empty/error/unavailable views; the error view's retry currently has no behavior. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:** Preserve the complete contract during relocation; define a cohesive loading capability; repair and verify representative auth and records surfaces; retain independent generated projects.

**Non-Goals:** A parent requirements document, custom schema/inheritance, universal data fetching framework, changes to authentication/authorization or persistence, and an exhaustive application audit.

## Decisions

- Use native nested capability paths under `data-lifecycle/`. The user explicitly selected this family organization. A flat layout was considered and rejected; a normative umbrella spec would repeat independently owned requirements.
- Move forms by adding its complete unchanged requirements at the new path and retiring the old capability with explicit migration deltas. Before retirement, compare the old and new requirement sections byte-for-byte. Keep the prior archive immutable and update every current reference, generated instruction, and assembly expectation.
- Preserve form submission semantics solely in the forms contract; non-form actions remain under action lifecycle. Loading owns reads, region state, independence, geometry and accessible progress. Put bidirectional family links in the purposes; no automatic inheritance or routing layer is introduced.
- Keep owner APIs and internal topology in Storybook/AGENTS. Replace migrated workflow requirements with spec links and retain operational discovery, owner selection, comparison procedure and verifier instructions. Preserve a clause-to-requirement migration map in verification evidence.
- Use existing auth loading views and dashboard forced-state owners. Keep known links live, reduce progress announcements to a concise status, and repair the existing error retry. Do not add a provider, endpoint, or general data framework solely for testing.
- Follow the existing Playwright verifier conventions: accept the verified loopback Preview URL, isolate contexts, use synthetic fixture sessions, test desktop/narrow widths, record failures under ignored test output. Exercise real ready routes and controlled delayed navigation; use existing debug facilities for repeatable loading/outcome review. Report deterministic review states separately from genuine backend failures.
- A lightweight auth review path may reuse its actual loading owner through the existing authenticated skeleton-reference surface rather than adding a production-visible force-loading switch. Pair this owner review with real auth route navigation.
- Shared Skeleton shimmer is an explicitly approved implementation choice. It is tested at its Storybook owner with its static opt-out and reduced-motion suppression, and is deliberately absent from normative loading requirements.
- Positive assembly copies both contracts and the procedure. Select runtime cases through installed dashboard surfaces; marketing-only/thin projects omit dashboard case imports. Preserve the six stock skills and exclude template change history.

## Risks / Trade-offs

- Broad existing dirty state can break unrelated checks → record baseline failures, limit repairs to the selected pilot, and preserve unrelated edits.
- Forced review states do not prove server failure handling → identify their evidence limits and also exercise actual ready routes and delayed navigation boundaries.
- Fixture tables contain variable content → compare stable structural landmarks and documented exemplar geometry, with screenshots for visual review rather than requiring unknown text to match.
- Spec relocation can silently lose scenarios or links → require byte equality for the complete requirement section, current-reference checks, strict OpenSpec validation, and generated-project assertions before archive.

## Migration Plan

1. Complete and validate change artifacts, implement selected loading fixes and verification.
2. Sync the two family capabilities and prove the form requirement section is unchanged before retiring the flat path.
3. Update current references, assembly ownership and generated instructions; run focused root and representative full/thin/app/marketing assembly checks.
4. Record evidence and remaining baseline failures, then archive the completed change. No deployment is involved. Rollback restores the old path and its current references without altering the historical archive.
