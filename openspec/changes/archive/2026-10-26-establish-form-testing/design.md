# Design

## Context

See proposal.md for motivation. Login currently redirects on rejected server actions; support uses client state as its pending guard and displays two success toasts. Contact is a placeholder. The repository already owns Playwright and isolated preview wrappers; assembly is positive and fail-closed.

## Goals / Non-Goals

**Goals:** Preserve server-owned auth, reuse UI owners, exercise complete forms, and carry the contract into independent projects.

**Non-Goals:** A universal form engine, input sweep, real delivery, deployment, custom OpenSpec schemas or new routing skills.

## Decisions

- Keep login's server action with a serializable field/operational error result and server redirects on success. A client form owns controlled values, an immediate ref guard and pending state. This preserves authentication ownership instead of replacing it with a client-only mock.
- Keep route-specific validation beside each form; share only each form's client/server validation rules, not a new framework. Use native forms with noValidate and accessible shared input errors.
- Contact uses a clearly labeled synthetic POST endpoint with email/message validation and the existing honeypot helper. It has no provider, persistence or new throttling threshold.
- Support retains existing authorization and cooldown policy, gains field-specific server feedback and a ref guard, and uses one success toast.
- Use programmatic Playwright from a stable verify:forms entrypoint with explicit form modules and a few shared assertions. Real requests test server behavior; interception supplies deterministic pending/failure scenarios. The verifier accepts only a loopback URL, checks installed surfaces against source ownership, and fails if an expected surface is unavailable.
- Copy the six unmodified generated OpenSpec skills, maintained specs and local config through explicit assembly ownership. Keep changes/ and all unrelated .agents files template-only. The generic spec describes conditional forms; profile-specific test modules are positively selected. No generated-project connection to this template is retained.
- Keep local repo context in OpenSpec context and operation guidance. Its references field is for stores, not a local file map. Evaluate implicit routing separately after evidence from the pilot.

## Risks / Trade-offs

- Existing dirty files may contain unrelated work → edit only the approved scope and report baseline failures separately.
- Auth sessions and support cooldowns are process-local → use fresh browser contexts and the same real server for each scenario.
- Production contact demo could be mistaken for delivery → explicit pre-submit and result wording; no provider adapter exists.
- Browser-only interception could hide backend defects → include direct invalid/unauthorized requests and real success submissions.

## Migration Plan

Initialize OpenSpec, author the pilot artifacts, implement and verify the forms and assembly, then sync/archive only after the actual acceptance checks pass. Existing workflow form references link to the maintained spec. Generated projects inherit specs and empty change history, never this pilot's archive.
