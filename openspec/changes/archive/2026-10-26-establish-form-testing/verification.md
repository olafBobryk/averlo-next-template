# Pilot verification — 2026-10-26

OpenSpec 1.15.0, standard Codex core integration, built-in `spec-driven` schema.
The six stock skills were compared byte-for-byte with a fresh CLI initialization.
No skill instructions were changed. No routing skill or custom schema was added.

## Browser acceptance

All **20 form/viewport combinations**, containing **112 scenario groups**, passed in Chromium.
Each form runs at 1280 × 900 and 390 × 844 with fresh sessions and fixture data.

| Workspace | Installed forms | Passed combinations |
| --- | --- | ---: |
| Canonical template | Login, support, contact | 6 |
| Generated full / static | Login, support, contact | 6 |
| Generated thin-start / static | Contact | 2 |
| Generated app-only / static | Login, support | 4 |
| Generated marketing-only / static | Contact | 2 |

Coverage includes accessible field feedback, native keyboard submission, same-turn
repeated submits, held requests, one operational error, value preservation, retry
and real success. Real server submissions independently cover invalid fields,
login action validation bypass, rejected credentials/password clearing, safe
continuation, organization selection, support authorization/cooldown and malformed
payloads, and contact honeypot/disclosure. Interception supplies only deterministic
delayed/failing requests; successful submissions use the actual backend.

The generated projects were reassembled from canonical source, given independent
Git contexts, and tested through repository Preview wrappers. Early simultaneous
cold previews timed out and some emitted invalid CSS. Fresh isolated contexts and
sequential runs passed. A first type check before Next generated its image typings
failed in marketing projects; the normal builds generated them and final type
checks passed. These initial attempts were not counted as passing evidence.

Machine-readable results and command logs are retained under ignored output:
[combined results](../../../../test-results/forms/pilot-results.json),
[canonical results](../../../../test-results/forms/results.json),
[command logs](../../../../test-results/forms/logs).

## Static and assembly acceptance

- Passed root `typecheck`, production `build`, `verify:auth`,
  `verify:mutation-policy`, `verify:marketing`, and `verify:skill-references`.
- Passed scoped Biome checks for 28 changed code/config files.
- Passed final type checks and production builds in all four generated projects.
- All seven profile/content combinations materialized and passed route-surface
  checks. Creation safety and assembly ownership guards passed.
- Generated stock skills, config, maintained spec, procedure and runner matched
  their canonical copies. Applicable form modules matched selected surfaces;
  template change history and unrelated agent files were absent.
- OpenSpec discovered `form-behavior` (9 requirements); strict validation passed
  for both the pilot change and maintained spec before archive. The delta's
  requirements and scenarios match the synced main spec.

Assembly repairs needed for runtime verification retained the thin contact input
closure and canonical InputFrame, updated thin input call sites, retained missing
hero/image dependencies without adding omitted surfaces, and removed imports of
unselected dashboard loading views. Previously unclassified documentation received
explicit template-only or assistant ownership.

## Existing failures outside this pilot

- The complete `verify:profiles` command exits nonzero when its optional assistant
  fixture reaches `src/components/domain/assistant/upload-tiles.test.tsx:9`
  (`lint/suspicious/noExportsInTest`). Default profile assembly checks pass.
- Strict thin-start API review reports the existing deprecated property in
  `src/components/ui/motion/presence/ContentPresence.tsx:14`. The new contact
  dependencies produce no imports outside its allowlist.
- Whole-repository lint reports 36 errors and 29 warnings in the existing dirty
  checkout. Scoped checks pass. Unrelated source and lint findings were preserved.

## OpenSpec observations

Stock discovery, repo context, apply/archive guidance, and sync support this pilot.
The stock `references` feature targets spec stores rather than local file routing.
Implicit topic selection in a fresh agent session remains unproven; a routing skill,
reference index or custom schema still requires a separate decision. Generated
projects own independent copies and inherit no template proposal history.

## Review

The retained canonical Preview is `http://localhost:3079`.
Contact, login, and authenticated support were reviewed in the browser. The contact
review image is retained in ignored output. Test-only generated previews were
stopped after verification; the canonical preview remains available.

The completed pilot was archived on 2026-10-26 after all 9 tasks were checked.
The main spec had already been synced and compared exactly with the delta; archive
therefore skipped reapplying the same additions. Post-archive strict validation
checks the maintained specification.
