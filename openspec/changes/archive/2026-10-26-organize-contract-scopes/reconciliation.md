# Scope migration reconciliation

Independent audit of the immutable [full-text baseline](source-baseline.json), approved [migration map](migration-map.json), [design](design.md), all forty-two addition/retirement deltas, and the synchronized maintained contracts. No lost obligation, duplicate policy owner or invented product capability was found.

## Conservation proof

**All 90 original requirements, 203 requirement-body sentences and 113 scenarios are accounted for.** The result contains 22 capabilities, 91 requirements, the same 203 requirement-body sentences, and 114 scenarios. One requirement and one mixed scenario are decomposed into private/public metadata owners; nothing else is added or removed.

After normalizing only the twenty approved capability references, the multiset of every requirement-body sentence is exactly equal before and after migration. Each original sentence maps to exactly one expected owner, including all three sentences of the split title requirement. This checks conservation and guards against copying the same policy into both shared and surface-specific owners. All other scenarios are verbatim after reference relocation; the one mixed title scenario maps to its two explicit replacements below.

All twenty captured baseline text hashes verify. All twenty previous identities are absent, their retirement deltas name exactly their original requirements with Reason/Migration metadata, and the stock retirement marker is enabled. All twenty-two added delta requirement/scenario bodies equal maintained copies. The maintained set is exactly the twenty relocations and two approved extractions; no product capability exists. Maintained inline spec references and relative Markdown links resolve. Fresh strict validation passes all twenty-two specs plus this change (23/23).

The ignored evidence files are `test-results/contract-scopes/source-baseline.json`, `clause-audit.json`, `audit.py` and `strict-validation.json`. The clause receipt records original/destination text, every sentence, every scenario, hashes and exactness checks. Assembly and live-consumer results belong to the integration evidence; this audit does not claim runtime execution or a new installation.

## The two mixed-spec extractions

### Public and private metadata

- The original title requirement's first sentence (dashboard/authentication route-first titles and noindex/nofollow) and third sentence (private route-first development metadata) remain shared under Private title and indexing policy. Its second sentence (public app-first titles, home app-name-only) moves verbatim to marketing Public title policy.
- The old Private and public page titles scenario carried two outcomes in one example. Private page title and indexing preserves the private order/indexing outcome; Public page titles preserves public ordering and makes the already-required home exception explicit. Their example conditions cover the original authentication/public example without installing any route. The private example illustrates the pre-existing private metadata intent; it adds no new privacy or indexing requirement.
- Metadata and body share authoritative content and its scenario move wholly to marketing, with only the source-resolution reference updated. Shared canonical/robots/social destination policy, query exclusion, code-owned utility metadata and central app identity remain verbatim shared. Their conditional public-route example does not install a public surface.

### Dashboard route enrichment

The final route-identity requirement and its sidebar/command scenario move verbatim to dashboard route-enrichment. The first three route requirements and scenarios remain shared. The dashboard purpose points to the shared identity owner without repeating its requirements.

## Scope and applicability

All other bodies and scenarios preserve their exact behavior. Complete data lifecycles remain intact across client/server boundaries. Template demo no-email/no-storage/reset guarantees remain solely template-owned; configured delivery, storage authorization and injectable test transports are unchanged reusable app contracts. Reserving product/ does not create an empty specification or business policy.

Capability folders express organization, not feature installation. The approved design intentionally selects shared media for core use and keeps marketing source-resolution/public metadata and dashboard enrichment surface-selected. Conditional entity, private-file and configured delivery coverage does not become an unconditional route/provider requirement merely because its owner moved under shared/. Generated exact-set and negative dependency checks remain assembly integration responsibilities.

## Complete requirement and scenario map

Links target change-local delta anchors and remain portable on archive. Each requirement row accounts for every sentence in that body; the ignored clause receipt supplies the per-sentence destination.

### app/content/marketing-composition

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| Ordered semantic page content | [app/marketing/composition/marketing-composition: Ordered semantic page content](specs/app/marketing/composition/marketing-composition/spec.md#requirement-ordered-semantic-page-content) | Verbatim body after reference relocation. |
| Shared shell and navigation | [app/marketing/composition/marketing-composition: Shared shell and navigation](specs/app/marketing/composition/marketing-composition/spec.md#requirement-shared-shell-and-navigation) | Verbatim body after reference relocation. |
| Stable semantic review boundaries | [app/marketing/composition/marketing-composition: Stable semantic review boundaries](specs/app/marketing/composition/marketing-composition/spec.md#requirement-stable-semantic-review-boundaries) | Verbatim body after reference relocation. |
| Source fidelity and later reuse are distinct decisions | [app/marketing/composition/marketing-composition: Source fidelity and later reuse are distinct decisions](specs/app/marketing/composition/marketing-composition/spec.md#requirement-source-fidelity-and-later-reuse-are-distinct-decisions) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| Ordered semantic page content / Render a multi-section public page | [app/marketing/composition/marketing-composition: Render a multi-section public page](specs/app/marketing/composition/marketing-composition/spec.md#scenario-render-a-multi-section-public-page) | verbatim after reference relocation |
| Shared shell and navigation / Compact shell navigation | [app/marketing/composition/marketing-composition: Compact shell navigation](specs/app/marketing/composition/marketing-composition/spec.md#scenario-compact-shell-navigation) | verbatim after reference relocation |
| Stable semantic review boundaries / Review content with an excluded approved header | [app/marketing/composition/marketing-composition: Review content with an excluded approved header](specs/app/marketing/composition/marketing-composition/spec.md#scenario-review-content-with-an-excluded-approved-header) | verbatim after reference relocation |
| Source fidelity and later reuse are distinct decisions / Similar independent source cases | [app/marketing/composition/marketing-composition: Similar independent source cases](specs/app/marketing/composition/marketing-composition/spec.md#scenario-similar-independent-source-cases) | verbatim after reference relocation |

### app/content/media-delivery

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| Durable constituent assets | [app/shared/frontend/content/media-delivery: Durable constituent assets](specs/app/shared/frontend/content/media-delivery/spec.md#requirement-durable-constituent-assets) | Verbatim body after reference relocation. |
| Source-neutral image delivery | [app/shared/frontend/content/media-delivery: Source-neutral image delivery](specs/app/shared/frontend/content/media-delivery/spec.md#requirement-source-neutral-image-delivery) | Verbatim body after reference relocation. |
| Alternative text follows purpose | [app/shared/frontend/content/media-delivery: Alternative text follows purpose](specs/app/shared/frontend/content/media-delivery/spec.md#requirement-alternative-text-follows-purpose) | Verbatim body after reference relocation. |
| Delivery cost follows evidence | [app/shared/frontend/content/media-delivery: Delivery cost follows evidence](specs/app/shared/frontend/content/media-delivery/spec.md#requirement-delivery-cost-follows-evidence) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| Durable constituent assets / Expiring reference asset | [app/shared/frontend/content/media-delivery: Expiring reference asset](specs/app/shared/frontend/content/media-delivery/spec.md#scenario-expiring-reference-asset) | verbatim after reference relocation |
| Source-neutral image delivery / Render provider and static media | [app/shared/frontend/content/media-delivery: Render provider and static media](specs/app/shared/frontend/content/media-delivery/spec.md#scenario-render-provider-and-static-media) | verbatim after reference relocation |
| Alternative text follows purpose / Decorative and informative images | [app/shared/frontend/content/media-delivery: Decorative and informative images](specs/app/shared/frontend/content/media-delivery/spec.md#scenario-decorative-and-informative-images) | verbatim after reference relocation |
| Delivery cost follows evidence / Add a local delivery exception | [app/shared/frontend/content/media-delivery: Add a local delivery exception](specs/app/shared/frontend/content/media-delivery/spec.md#scenario-add-a-local-delivery-exception) | verbatim after reference relocation |

### app/content/source-resolution

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| Explicit source modes | [app/marketing/content-sources/source-resolution: Explicit source modes](specs/app/marketing/content-sources/source-resolution/spec.md#requirement-explicit-source-modes) | Verbatim body after reference relocation. |
| One normalized frontend contract | [app/marketing/content-sources/source-resolution: One normalized frontend contract](specs/app/marketing/content-sources/source-resolution/spec.md#requirement-one-normalized-frontend-contract) | Verbatim body after reference relocation. |
| Preserve recovery data until verified activation | [app/marketing/content-sources/source-resolution: Preserve recovery data until verified activation](specs/app/marketing/content-sources/source-resolution/spec.md#requirement-preserve-recovery-data-until-verified-activation) | Verbatim body after reference relocation. |
| Authoritative failure is not silent fallback | [app/marketing/content-sources/source-resolution: Authoritative failure is not silent fallback](specs/app/marketing/content-sources/source-resolution/spec.md#requirement-authoritative-failure-is-not-silent-fallback) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| Explicit source modes / Unconfigured CMS-ready project | [app/marketing/content-sources/source-resolution: Unconfigured CMS-ready project](specs/app/marketing/content-sources/source-resolution/spec.md#scenario-unconfigured-cms-ready-project) | verbatim after reference relocation |
| One normalized frontend contract / Switch an approved page source | [app/marketing/content-sources/source-resolution: Switch an approved page source](specs/app/marketing/content-sources/source-resolution/spec.md#scenario-switch-an-approved-page-source) | verbatim after reference relocation |
| Preserve recovery data until verified activation / Seed without successful readback | [app/marketing/content-sources/source-resolution: Seed without successful readback](specs/app/marketing/content-sources/source-resolution/spec.md#scenario-seed-without-successful-readback) | verbatim after reference relocation |
| Authoritative failure is not silent fallback / Unpublished authoritative document | [app/marketing/content-sources/source-resolution: Unpublished authoritative document](specs/app/marketing/content-sources/source-resolution/spec.md#scenario-unpublished-authoritative-document) | verbatim after reference relocation |

### app/data-lifecycle/action-behavior

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| One pending action owner | [app/shared/data-lifecycle/action-behavior: One pending action owner](specs/app/shared/data-lifecycle/action-behavior/spec.md#requirement-one-pending-action-owner) | Verbatim body after reference relocation. |
| Feedback follows ownership and lifetime | [app/shared/data-lifecycle/action-behavior: Feedback follows ownership and lifetime](specs/app/shared/data-lifecycle/action-behavior/spec.md#requirement-feedback-follows-ownership-and-lifetime) | Verbatim body after reference relocation. |
| Outcome channels remain specific | [app/shared/data-lifecycle/action-behavior: Outcome channels remain specific](specs/app/shared/data-lifecycle/action-behavior/spec.md#requirement-outcome-channels-remain-specific) | Verbatim body after reference relocation. |
| Destructive intent and reversible optimism | [app/shared/data-lifecycle/action-behavior: Destructive intent and reversible optimism](specs/app/shared/data-lifecycle/action-behavior/spec.md#requirement-destructive-intent-and-reversible-optimism) | Verbatim body after reference relocation. |
| Single completion navigation | [app/shared/data-lifecycle/action-behavior: Single completion navigation](specs/app/shared/data-lifecycle/action-behavior/spec.md#requirement-single-completion-navigation) | Verbatim body after reference relocation. |
| Active send cancellation remains available | [app/shared/data-lifecycle/action-behavior: Active send cancellation remains available](specs/app/shared/data-lifecycle/action-behavior/spec.md#requirement-active-send-cancellation-remains-available) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| One pending action owner / Rapid action group activation | [app/shared/data-lifecycle/action-behavior: Rapid action group activation](specs/app/shared/data-lifecycle/action-behavior/spec.md#scenario-rapid-action-group-activation) | verbatim after reference relocation |
| Feedback follows ownership and lifetime / Recoverable mutation failure | [app/shared/data-lifecycle/action-behavior: Recoverable mutation failure](specs/app/shared/data-lifecycle/action-behavior/spec.md#scenario-recoverable-mutation-failure) | verbatim after reference relocation |
| Feedback follows ownership and lifetime / Durable completion instructions | [app/shared/data-lifecycle/action-behavior: Durable completion instructions](specs/app/shared/data-lifecycle/action-behavior/spec.md#scenario-durable-completion-instructions) | verbatim after reference relocation |
| Outcome channels remain specific / Persistent read-only access | [app/shared/data-lifecycle/action-behavior: Persistent read-only access](specs/app/shared/data-lifecycle/action-behavior/spec.md#scenario-persistent-read-only-access) | verbatim after reference relocation |
| Destructive intent and reversible optimism / Failed optimistic update | [app/shared/data-lifecycle/action-behavior: Failed optimistic update](specs/app/shared/data-lifecycle/action-behavior/spec.md#scenario-failed-optimistic-update) | verbatim after reference relocation |
| Destructive intent and reversible optimism / Cancel destructive confirmation | [app/shared/data-lifecycle/action-behavior: Cancel destructive confirmation](specs/app/shared/data-lifecycle/action-behavior/spec.md#scenario-cancel-destructive-confirmation) | verbatim after reference relocation |
| Single completion navigation / Delete an open detail | [app/shared/data-lifecycle/action-behavior: Delete an open detail](specs/app/shared/data-lifecycle/action-behavior/spec.md#scenario-delete-an-open-detail) | verbatim after reference relocation |
| Active send cancellation remains available / Cancel an active run | [app/shared/data-lifecycle/action-behavior: Cancel an active run](specs/app/shared/data-lifecycle/action-behavior/spec.md#scenario-cancel-an-active-run) | verbatim after reference relocation |

### app/data-lifecycle/form-behavior

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| Accessible field feedback | [app/shared/data-lifecycle/form-behavior: Accessible field feedback](specs/app/shared/data-lifecycle/form-behavior/spec.md#requirement-accessible-field-feedback) | Verbatim body after reference relocation. |
| Native keyboard submission | [app/shared/data-lifecycle/form-behavior: Native keyboard submission](specs/app/shared/data-lifecycle/form-behavior/spec.md#requirement-native-keyboard-submission) | Verbatim body after reference relocation. |
| Single pending submission | [app/shared/data-lifecycle/form-behavior: Single pending submission](specs/app/shared/data-lifecycle/form-behavior/spec.md#requirement-single-pending-submission) | Verbatim body after reference relocation. |
| Server authority | [app/shared/data-lifecycle/form-behavior: Server authority](specs/app/shared/data-lifecycle/form-behavior/spec.md#requirement-server-authority) | Verbatim body after reference relocation. |
| Recoverable submission failure | [app/shared/data-lifecycle/form-behavior: Recoverable submission failure](specs/app/shared/data-lifecycle/form-behavior/spec.md#requirement-recoverable-submission-failure) | Verbatim body after reference relocation. |
| Explicit success behavior | [app/shared/data-lifecycle/form-behavior: Explicit success behavior](specs/app/shared/data-lifecycle/form-behavior/spec.md#requirement-explicit-success-behavior) | Verbatim body after reference relocation. |
| Authentication form recovery | [app/shared/data-lifecycle/form-behavior: Authentication form recovery](specs/app/shared/data-lifecycle/form-behavior/spec.md#requirement-authentication-form-recovery) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| Accessible field feedback / Invalid submission | [app/shared/data-lifecycle/form-behavior: Invalid submission](specs/app/shared/data-lifecycle/form-behavior/spec.md#scenario-invalid-submission) | verbatim after reference relocation |
| Accessible field feedback / Narrow viewport | [app/shared/data-lifecycle/form-behavior: Narrow viewport](specs/app/shared/data-lifecycle/form-behavior/spec.md#scenario-narrow-viewport) | verbatim after reference relocation |
| Native keyboard submission / Keyboard submit | [app/shared/data-lifecycle/form-behavior: Keyboard submit](specs/app/shared/data-lifecycle/form-behavior/spec.md#scenario-keyboard-submit) | verbatim after reference relocation |
| Single pending submission / Repeated submission while pending | [app/shared/data-lifecycle/form-behavior: Repeated submission while pending](specs/app/shared/data-lifecycle/form-behavior/spec.md#scenario-repeated-submission-while-pending) | verbatim after reference relocation |
| Server authority / Client validation bypass | [app/shared/data-lifecycle/form-behavior: Client validation bypass](specs/app/shared/data-lifecycle/form-behavior/spec.md#scenario-client-validation-bypass) | verbatim after reference relocation |
| Server authority / Organization authorization | [app/shared/data-lifecycle/form-behavior: Organization authorization](specs/app/shared/data-lifecycle/form-behavior/spec.md#scenario-organization-authorization) | verbatim after reference relocation |
| Recoverable submission failure / Failed request and retry | [app/shared/data-lifecycle/form-behavior: Failed request and retry](specs/app/shared/data-lifecycle/form-behavior/spec.md#scenario-failed-request-and-retry) | verbatim after reference relocation |
| Explicit success behavior / Successful form submission | [app/shared/data-lifecycle/form-behavior: Successful form submission](specs/app/shared/data-lifecycle/form-behavior/spec.md#scenario-successful-form-submission) | verbatim after reference relocation |
| Authentication form recovery / Rejected credentials | [app/shared/data-lifecycle/form-behavior: Rejected credentials](specs/app/shared/data-lifecycle/form-behavior/spec.md#scenario-rejected-credentials) | verbatim after reference relocation |
| Authentication form recovery / Successful login | [app/shared/data-lifecycle/form-behavior: Successful login](specs/app/shared/data-lifecycle/form-behavior/spec.md#scenario-successful-login) | verbatim after reference relocation |
| Authentication form recovery / Organization selection | [app/shared/data-lifecycle/form-behavior: Organization selection](specs/app/shared/data-lifecycle/form-behavior/spec.md#scenario-organization-selection) | verbatim after reference relocation |
| Authentication form recovery / Unsafe continuation | [app/shared/data-lifecycle/form-behavior: Unsafe continuation](specs/app/shared/data-lifecycle/form-behavior/spec.md#scenario-unsafe-continuation) | verbatim after reference relocation |

### app/data-lifecycle/loading-state-behavior

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| Preserve independent known content | [app/shared/data-lifecycle/loading-state-behavior: Preserve independent known content](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#requirement-preserve-independent-known-content) | Verbatim body after reference relocation. |
| Dependency-scoped loading | [app/shared/data-lifecycle/loading-state-behavior: Dependency-scoped loading](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#requirement-dependency-scoped-loading) | Verbatim body after reference relocation. |
| Live and loading layout parity | [app/shared/data-lifecycle/loading-state-behavior: Live and loading layout parity](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#requirement-live-and-loading-layout-parity) | Verbatim body after reference relocation. |
| Inert visual placeholders | [app/shared/data-lifecycle/loading-state-behavior: Inert visual placeholders](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#requirement-inert-visual-placeholders) | Verbatim body after reference relocation. |
| Readable reduced-motion loading | [app/shared/data-lifecycle/loading-state-behavior: Readable reduced-motion loading](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#requirement-readable-reduced-motion-loading) | Verbatim body after reference relocation. |
| Distinct region outcomes and recovery | [app/shared/data-lifecycle/loading-state-behavior: Distinct region outcomes and recovery](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#requirement-distinct-region-outcomes-and-recovery) | Verbatim body after reference relocation. |
| Distinguish reading from submission | [app/shared/data-lifecycle/loading-state-behavior: Distinguish reading from submission](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#requirement-distinguish-reading-from-submission) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| Preserve independent known content / Known navigation while a region loads | [app/shared/data-lifecycle/loading-state-behavior: Known navigation while a region loads](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#scenario-known-navigation-while-a-region-loads) | verbatim after reference relocation |
| Preserve independent known content / Independent draft during loading | [app/shared/data-lifecycle/loading-state-behavior: Independent draft during loading](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#scenario-independent-draft-during-loading) | verbatim after reference relocation |
| Dependency-scoped loading / Independent regions | [app/shared/data-lifecycle/loading-state-behavior: Independent regions](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#scenario-independent-regions) | verbatim after reference relocation |
| Dependency-scoped loading / No content to load | [app/shared/data-lifecycle/loading-state-behavior: No content to load](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#scenario-no-content-to-load) | verbatim after reference relocation |
| Dependency-scoped loading / Data-dependent action | [app/shared/data-lifecycle/loading-state-behavior: Data-dependent action](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#scenario-data-dependent-action) | verbatim after reference relocation |
| Live and loading layout parity / Repeated content and narrow layout | [app/shared/data-lifecycle/loading-state-behavior: Repeated content and narrow layout](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#scenario-repeated-content-and-narrow-layout) | verbatim after reference relocation |
| Live and loading layout parity / Known and unknown sizing copy | [app/shared/data-lifecycle/loading-state-behavior: Known and unknown sizing copy](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#scenario-known-and-unknown-sizing-copy) | verbatim after reference relocation |
| Inert visual placeholders / Keyboard traversal during loading | [app/shared/data-lifecycle/loading-state-behavior: Keyboard traversal during loading](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#scenario-keyboard-traversal-during-loading) | verbatim after reference relocation |
| Inert visual placeholders / Accessible loading feedback | [app/shared/data-lifecycle/loading-state-behavior: Accessible loading feedback](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#scenario-accessible-loading-feedback) | verbatim after reference relocation |
| Readable reduced-motion loading / Reduced motion | [app/shared/data-lifecycle/loading-state-behavior: Reduced motion](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#scenario-reduced-motion) | verbatim after reference relocation |
| Distinct region outcomes and recovery / Idle region | [app/shared/data-lifecycle/loading-state-behavior: Idle region](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#scenario-idle-region) | verbatim after reference relocation |
| Distinct region outcomes and recovery / Empty result | [app/shared/data-lifecycle/loading-state-behavior: Empty result](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#scenario-empty-result) | verbatim after reference relocation |
| Distinct region outcomes and recovery / Recoverable read failure | [app/shared/data-lifecycle/loading-state-behavior: Recoverable read failure](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#scenario-recoverable-read-failure) | verbatim after reference relocation |
| Distinct region outcomes and recovery / Unavailable prerequisite | [app/shared/data-lifecycle/loading-state-behavior: Unavailable prerequisite](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#scenario-unavailable-prerequisite) | verbatim after reference relocation |
| Distinguish reading from submission / Form submission alongside readable content | [app/shared/data-lifecycle/loading-state-behavior: Form submission alongside readable content](specs/app/shared/data-lifecycle/loading-state-behavior/spec.md#scenario-form-submission-alongside-readable-content) | verbatim after reference relocation |

### app/delivery/contact-delivery

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| Delivery is explicitly configured and server-owned | [app/shared/services/delivery/contact-delivery: Delivery is explicitly configured and server-owned](specs/app/shared/services/delivery/contact-delivery/spec.md#requirement-delivery-is-explicitly-configured-and-server-owned) | Verbatim body after reference relocation. |
| Recipient-independent message content | [app/shared/services/delivery/contact-delivery: Recipient-independent message content](specs/app/shared/services/delivery/contact-delivery/spec.md#requirement-recipient-independent-message-content) | Verbatim body after reference relocation. |
| Truthful private delivery outcomes | [app/shared/services/delivery/contact-delivery: Truthful private delivery outcomes](specs/app/shared/services/delivery/contact-delivery/spec.md#requirement-truthful-private-delivery-outcomes) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| Delivery is explicitly configured and server-owned / Delivery configuration missing | [app/shared/services/delivery/contact-delivery: Delivery configuration missing](specs/app/shared/services/delivery/contact-delivery/spec.md#scenario-delivery-configuration-missing) | verbatim after reference relocation |
| Recipient-independent message content / Multiple configured recipients | [app/shared/services/delivery/contact-delivery: Multiple configured recipients](specs/app/shared/services/delivery/contact-delivery/spec.md#scenario-multiple-configured-recipients) | verbatim after reference relocation |
| Truthful private delivery outcomes / Provider rejects delivery | [app/shared/services/delivery/contact-delivery: Provider rejects delivery](specs/app/shared/services/delivery/contact-delivery/spec.md#scenario-provider-rejects-delivery) | verbatim after reference relocation |

### app/delivery/submission-protection

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| Apply guards at exposed boundaries | [app/shared/services/delivery/submission-protection: Apply guards at exposed boundaries](specs/app/shared/services/delivery/submission-protection/spec.md#requirement-apply-guards-at-exposed-boundaries) | Verbatim body after reference relocation. |
| Honeypot responses remain neutral | [app/shared/services/delivery/submission-protection: Honeypot responses remain neutral](specs/app/shared/services/delivery/submission-protection/spec.md#requirement-honeypot-responses-remain-neutral) | Verbatim body after reference relocation. |
| Server-owned attachment validation | [app/shared/services/delivery/submission-protection: Server-owned attachment validation](specs/app/shared/services/delivery/submission-protection/spec.md#requirement-server-owned-attachment-validation) | Verbatim body after reference relocation. |
| Policy-owned throttling and private diagnostics | [app/shared/services/delivery/submission-protection: Policy-owned throttling and private diagnostics](specs/app/shared/services/delivery/submission-protection/spec.md#requirement-policy-owned-throttling-and-private-diagnostics) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| Apply guards at exposed boundaries / Guarded public submission | [app/shared/services/delivery/submission-protection: Guarded public submission](specs/app/shared/services/delivery/submission-protection/spec.md#scenario-guarded-public-submission) | verbatim after reference relocation |
| Honeypot responses remain neutral / Filled hidden field | [app/shared/services/delivery/submission-protection: Filled hidden field](specs/app/shared/services/delivery/submission-protection/spec.md#scenario-filled-hidden-field) | verbatim after reference relocation |
| Server-owned attachment validation / Bypass client file validation | [app/shared/services/delivery/submission-protection: Bypass client file validation](specs/app/shared/services/delivery/submission-protection/spec.md#scenario-bypass-client-file-validation) | verbatim after reference relocation |
| Policy-owned throttling and private diagnostics / Existing cooldown is active | [app/shared/services/delivery/submission-protection: Existing cooldown is active](specs/app/shared/services/delivery/submission-protection/spec.md#scenario-existing-cooldown-is-active) | verbatim after reference relocation |

### app/domain/entity-presentation

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| One consistent presentation vocabulary | [app/shared/frontend/content/entity-presentation: One consistent presentation vocabulary](specs/app/shared/frontend/content/entity-presentation/spec.md#requirement-one-consistent-presentation-vocabulary) | Verbatim body after reference relocation. |
| Authorized recoverable lifecycle | [app/shared/frontend/content/entity-presentation: Authorized recoverable lifecycle](specs/app/shared/frontend/content/entity-presentation/spec.md#requirement-authorized-recoverable-lifecycle) | Verbatim body after reference relocation. |
| Collection pagination and overview continuation differ | [app/shared/frontend/content/entity-presentation: Collection pagination and overview continuation differ](specs/app/shared/frontend/content/entity-presentation/spec.md#requirement-collection-pagination-and-overview-continuation-differ) | Verbatim body after reference relocation. |
| Tool presentation corresponds to execution | [app/shared/frontend/content/entity-presentation: Tool presentation corresponds to execution](specs/app/shared/frontend/content/entity-presentation/spec.md#requirement-tool-presentation-corresponds-to-execution) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| One consistent presentation vocabulary / Entity appears in a selector and detail | [app/shared/frontend/content/entity-presentation: Entity appears in a selector and detail](specs/app/shared/frontend/content/entity-presentation/spec.md#scenario-entity-appears-in-a-selector-and-detail) | verbatim after reference relocation |
| Authorized recoverable lifecycle / Failed entity update | [app/shared/frontend/content/entity-presentation: Failed entity update](specs/app/shared/frontend/content/entity-presentation/spec.md#scenario-failed-entity-update) | verbatim after reference relocation |
| Collection pagination and overview continuation differ / Continue from an overview | [app/shared/frontend/content/entity-presentation: Continue from an overview](specs/app/shared/frontend/content/entity-presentation/spec.md#scenario-continue-from-an-overview) | verbatim after reference relocation |
| Tool presentation corresponds to execution / Present an entity tool result | [app/shared/frontend/content/entity-presentation: Present an entity tool result](specs/app/shared/frontend/content/entity-presentation/spec.md#scenario-present-an-entity-tool-result) | verbatim after reference relocation |

### app/experience/content-hierarchy

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| Coherent grouping and surface meaning | [app/shared/frontend/content/content-hierarchy: Coherent grouping and surface meaning](specs/app/shared/frontend/content/content-hierarchy/spec.md#requirement-coherent-grouping-and-surface-meaning) | Verbatim body after reference relocation. |
| Context is useful and not duplicated | [app/shared/frontend/content/content-hierarchy: Context is useful and not duplicated](specs/app/shared/frontend/content/content-hierarchy/spec.md#requirement-context-is-useful-and-not-duplicated) | Verbatim body after reference relocation. |
| Shared alignment preserves usable controls | [app/shared/frontend/content/content-hierarchy: Shared alignment preserves usable controls](specs/app/shared/frontend/content/content-hierarchy/spec.md#requirement-shared-alignment-preserves-usable-controls) | Verbatim body after reference relocation. |
| Semantic color and identity remain legible | [app/shared/frontend/content/content-hierarchy: Semantic color and identity remain legible](specs/app/shared/frontend/content/content-hierarchy/spec.md#requirement-semantic-color-and-identity-remain-legible) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| Coherent grouping and surface meaning / Present related record properties | [app/shared/frontend/content/content-hierarchy: Present related record properties](specs/app/shared/frontend/content/content-hierarchy/spec.md#scenario-present-related-record-properties) | verbatim after reference relocation |
| Context is useful and not duplicated / Group with an external heading | [app/shared/frontend/content/content-hierarchy: Group with an external heading](specs/app/shared/frontend/content/content-hierarchy/spec.md#scenario-group-with-an-external-heading) | verbatim after reference relocation |
| Shared alignment preserves usable controls / Align a section action at a surface edge | [app/shared/frontend/content/content-hierarchy: Align a section action at a surface edge](specs/app/shared/frontend/content/content-hierarchy/spec.md#scenario-align-a-section-action-at-a-surface-edge) | verbatim after reference relocation |
| Semantic color and identity remain legible / Name-based avatar on a tinted surface | [app/shared/frontend/content/content-hierarchy: Name-based avatar on a tinted surface](specs/app/shared/frontend/content/content-hierarchy/spec.md#scenario-name-based-avatar-on-a-tinted-surface) | verbatim after reference relocation |

### app/identity/access-and-membership

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| Server authorization at every protected boundary | [app/shared/services/identity/access-and-membership: Server authorization at every protected boundary](specs/app/shared/services/identity/access-and-membership/spec.md#requirement-server-authorization-at-every-protected-boundary) | Verbatim body after reference relocation. |
| Access denial remains usable | [app/shared/services/identity/access-and-membership: Access denial remains usable](specs/app/shared/services/identity/access-and-membership/spec.md#requirement-access-denial-remains-usable) | Verbatim body after reference relocation. |
| Safe continuations and explicit authentication methods | [app/shared/services/identity/access-and-membership: Safe continuations and explicit authentication methods](specs/app/shared/services/identity/access-and-membership/spec.md#requirement-safe-continuations-and-explicit-authentication-methods) | Verbatim body after reference relocation. |
| Invitation acceptance is deliberate and bounded | [app/shared/services/identity/access-and-membership: Invitation acceptance is deliberate and bounded](specs/app/shared/services/identity/access-and-membership/spec.md#requirement-invitation-acceptance-is-deliberate-and-bounded) | Verbatim body after reference relocation. |
| Retain a verified sign-in identity | [app/shared/services/identity/access-and-membership: Retain a verified sign-in identity](specs/app/shared/services/identity/access-and-membership/spec.md#requirement-retain-a-verified-sign-in-identity) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| Server authorization at every protected boundary / Stale organization context | [app/shared/services/identity/access-and-membership: Stale organization context](specs/app/shared/services/identity/access-and-membership/spec.md#scenario-stale-organization-context) | verbatim after reference relocation |
| Access denial remains usable / Access expires during a protected read | [app/shared/services/identity/access-and-membership: Access expires during a protected read](specs/app/shared/services/identity/access-and-membership/spec.md#scenario-access-expires-during-a-protected-read) | verbatim after reference relocation |
| Safe continuations and explicit authentication methods / Unsafe continuation | [app/shared/services/identity/access-and-membership: Unsafe continuation](specs/app/shared/services/identity/access-and-membership/spec.md#scenario-unsafe-continuation) | verbatim after reference relocation |
| Safe continuations and explicit authentication methods / Unconfigured optional method | [app/shared/services/identity/access-and-membership: Unconfigured optional method](specs/app/shared/services/identity/access-and-membership/spec.md#scenario-unconfigured-optional-method) | verbatim after reference relocation |
| Invitation acceptance is deliberate and bounded / View and accept an invitation | [app/shared/services/identity/access-and-membership: View and accept an invitation](specs/app/shared/services/identity/access-and-membership/spec.md#scenario-view-and-accept-an-invitation) | verbatim after reference relocation |
| Invitation acceptance is deliberate and bounded / Reuse a replaced invitation | [app/shared/services/identity/access-and-membership: Reuse a replaced invitation](specs/app/shared/services/identity/access-and-membership/spec.md#scenario-reuse-a-replaced-invitation) | verbatim after reference relocation |
| Retain a verified sign-in identity / Remove the last verified identity | [app/shared/services/identity/access-and-membership: Remove the last verified identity](specs/app/shared/services/identity/access-and-membership/spec.md#scenario-remove-the-last-verified-identity) | verbatim after reference relocation |

### app/identity/private-file-access

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| Authorize file lifecycle boundaries | [app/shared/services/files/private-file-access: Authorize file lifecycle boundaries](specs/app/shared/services/files/private-file-access/spec.md#requirement-authorize-file-lifecycle-boundaries) | Verbatim body after reference relocation. |
| Opaque references and bounded access | [app/shared/services/files/private-file-access: Opaque references and bounded access](specs/app/shared/services/files/private-file-access/spec.md#requirement-opaque-references-and-bounded-access) | Verbatim body after reference relocation. |
| Explicit replacement and cleanup | [app/shared/services/files/private-file-access: Explicit replacement and cleanup](specs/app/shared/services/files/private-file-access/spec.md#requirement-explicit-replacement-and-cleanup) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| Authorize file lifecycle boundaries / Resolve another organization's file | [app/shared/services/files/private-file-access: Resolve another organization's file](specs/app/shared/services/files/private-file-access/spec.md#scenario-resolve-another-organizations-file) | verbatim after reference relocation |
| Opaque references and bounded access / Open an authorized private file | [app/shared/services/files/private-file-access: Open an authorized private file](specs/app/shared/services/files/private-file-access/spec.md#scenario-open-an-authorized-private-file) | verbatim after reference relocation |
| Explicit replacement and cleanup / Replace a private asset | [app/shared/services/files/private-file-access: Replace a private asset](specs/app/shared/services/files/private-file-access/spec.md#scenario-replace-a-private-asset) | verbatim after reference relocation |

### app/integration/api-transport

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| Consistent request outcomes | [app/shared/services/transport/api-transport: Consistent request outcomes](specs/app/shared/services/transport/api-transport/spec.md#requirement-consistent-request-outcomes) | Verbatim body after reference relocation. |
| Replaceable transport with identical behavior | [app/shared/services/transport/api-transport: Replaceable transport with identical behavior](specs/app/shared/services/transport/api-transport/spec.md#requirement-replaceable-transport-with-identical-behavior) | Verbatim body after reference relocation. |
| Secrets and feedback remain with their owners | [app/shared/services/transport/api-transport: Secrets and feedback remain with their owners](specs/app/shared/services/transport/api-transport/spec.md#requirement-secrets-and-feedback-remain-with-their-owners) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| Consistent request outcomes / Rejected API response | [app/shared/services/transport/api-transport: Rejected API response](specs/app/shared/services/transport/api-transport/spec.md#scenario-rejected-api-response) | verbatim after reference relocation |
| Replaceable transport with identical behavior / Inject a failed transport | [app/shared/services/transport/api-transport: Inject a failed transport](specs/app/shared/services/transport/api-transport/spec.md#scenario-inject-a-failed-transport) | verbatim after reference relocation |
| Secrets and feedback remain with their owners / Provider failure reaches a client | [app/shared/services/transport/api-transport: Provider failure reaches a client](specs/app/shared/services/transport/api-transport/spec.md#scenario-provider-failure-reaches-a-client) | verbatim after reference relocation |

### app/interaction/keyboard-and-overlays

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| Accessible control ownership | [app/shared/frontend/interaction/keyboard-and-overlays: Accessible control ownership](specs/app/shared/frontend/interaction/keyboard-and-overlays/spec.md#requirement-accessible-control-ownership) | Verbatim body after reference relocation. |
| Focus entry and return | [app/shared/frontend/interaction/keyboard-and-overlays: Focus entry and return](specs/app/shared/frontend/interaction/keyboard-and-overlays/spec.md#requirement-focus-entry-and-return) | Verbatim body after reference relocation. |
| Consistent pending dismissal lock | [app/shared/frontend/interaction/keyboard-and-overlays: Consistent pending dismissal lock](specs/app/shared/frontend/interaction/keyboard-and-overlays/spec.md#requirement-consistent-pending-dismissal-lock) | Verbatim body after reference relocation. |
| Blocking and anchored interaction roles | [app/shared/frontend/interaction/keyboard-and-overlays: Blocking and anchored interaction roles](specs/app/shared/frontend/interaction/keyboard-and-overlays/spec.md#requirement-blocking-and-anchored-interaction-roles) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| Accessible control ownership / Keyboard operation with decoration | [app/shared/frontend/interaction/keyboard-and-overlays: Keyboard operation with decoration](specs/app/shared/frontend/interaction/keyboard-and-overlays/spec.md#scenario-keyboard-operation-with-decoration) | verbatim after reference relocation |
| Focus entry and return / Close a nested dialog | [app/shared/frontend/interaction/keyboard-and-overlays: Close a nested dialog](specs/app/shared/frontend/interaction/keyboard-and-overlays/spec.md#scenario-close-a-nested-dialog) | verbatim after reference relocation |
| Consistent pending dismissal lock / Dismiss during a delayed confirmed mutation | [app/shared/frontend/interaction/keyboard-and-overlays: Dismiss during a delayed confirmed mutation](specs/app/shared/frontend/interaction/keyboard-and-overlays/spec.md#scenario-dismiss-during-a-delayed-confirmed-mutation) | verbatim after reference relocation |
| Consistent pending dismissal lock / Failure unlocks recovery | [app/shared/frontend/interaction/keyboard-and-overlays: Failure unlocks recovery](specs/app/shared/frontend/interaction/keyboard-and-overlays/spec.md#scenario-failure-unlocks-recovery) | verbatim after reference relocation |
| Blocking and anchored interaction roles / Open an anchored menu | [app/shared/frontend/interaction/keyboard-and-overlays: Open an anchored menu](specs/app/shared/frontend/interaction/keyboard-and-overlays/spec.md#scenario-open-an-anchored-menu) | verbatim after reference relocation |

### app/interaction/responsive-and-motion

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| Essential content survives responsive rendering | [app/shared/frontend/interaction/responsive-and-motion: Essential content survives responsive rendering](specs/app/shared/frontend/interaction/responsive-and-motion/spec.md#requirement-essential-content-survives-responsive-rendering) | Verbatim body after reference relocation. |
| Expensive hidden branches are bounded | [app/shared/frontend/interaction/responsive-and-motion: Expensive hidden branches are bounded](specs/app/shared/frontend/interaction/responsive-and-motion/spec.md#requirement-expensive-hidden-branches-are-bounded) | Verbatim body after reference relocation. |
| Motion does not gate agency | [app/shared/frontend/interaction/responsive-and-motion: Motion does not gate agency](specs/app/shared/frontend/interaction/responsive-and-motion/spec.md#requirement-motion-does-not-gate-agency) | Verbatim body after reference relocation. |
| Motion has coherent ownership | [app/shared/frontend/interaction/responsive-and-motion: Motion has coherent ownership](specs/app/shared/frontend/interaction/responsive-and-motion/spec.md#requirement-motion-has-coherent-ownership) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| Essential content survives responsive rendering / Initial compact render | [app/shared/frontend/interaction/responsive-and-motion: Initial compact render](specs/app/shared/frontend/interaction/responsive-and-motion/spec.md#scenario-initial-compact-render) | verbatim after reference relocation |
| Expensive hidden branches are bounded / Expensive desktop decoration on a phone | [app/shared/frontend/interaction/responsive-and-motion: Expensive desktop decoration on a phone](specs/app/shared/frontend/interaction/responsive-and-motion/spec.md#scenario-expensive-desktop-decoration-on-a-phone) | verbatim after reference relocation |
| Motion does not gate agency / Reduced motion during conditional content | [app/shared/frontend/interaction/responsive-and-motion: Reduced motion during conditional content](specs/app/shared/frontend/interaction/responsive-and-motion/spec.md#scenario-reduced-motion-during-conditional-content) | verbatim after reference relocation |
| Motion has coherent ownership / Resize during playback | [app/shared/frontend/interaction/responsive-and-motion: Resize during playback](specs/app/shared/frontend/interaction/responsive-and-motion/spec.md#scenario-resize-during-playback) | verbatim after reference relocation |

### app/navigation/document-metadata

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| Family title and indexing policy | [app/shared/frontend/navigation/document-metadata: Private title and indexing policy](specs/app/shared/frontend/navigation/document-metadata/spec.md#requirement-private-title-and-indexing-policy); [app/marketing/metadata/public-document-metadata: Public title policy](specs/app/marketing/metadata/public-document-metadata/spec.md#requirement-public-title-policy) | Three original sentences partition verbatim: private first/third, public second. |
| Canonical destination consistency | [app/shared/frontend/navigation/document-metadata: Canonical destination consistency](specs/app/shared/frontend/navigation/document-metadata/spec.md#requirement-canonical-destination-consistency) | Verbatim body after reference relocation. |
| Metadata and body share authoritative content | [app/marketing/metadata/public-document-metadata: Metadata and body share authoritative content](specs/app/marketing/metadata/public-document-metadata/spec.md#requirement-metadata-and-body-share-authoritative-content) | Verbatim body after reference relocation. |
| App identity is centrally derived | [app/shared/frontend/navigation/document-metadata: App identity is centrally derived](specs/app/shared/frontend/navigation/document-metadata/spec.md#requirement-app-identity-is-centrally-derived) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| Family title and indexing policy / Private and public page titles | [app/shared/frontend/navigation/document-metadata: Private page title and indexing](specs/app/shared/frontend/navigation/document-metadata/spec.md#scenario-private-page-title-and-indexing); [app/marketing/metadata/public-document-metadata: Public page titles](specs/app/marketing/metadata/public-document-metadata/spec.md#scenario-public-page-titles) | decomposed without loss: private title order and noindex/nofollow; public app-first title order and home app-only exception |
| Canonical destination consistency / Public route with incidental query parameters | [app/shared/frontend/navigation/document-metadata: Public route with incidental query parameters](specs/app/shared/frontend/navigation/document-metadata/spec.md#scenario-public-route-with-incidental-query-parameters) | verbatim after reference relocation |
| Metadata and body share authoritative content / Authoritative content changes during a request | [app/marketing/metadata/public-document-metadata: Authoritative content changes during a request](specs/app/marketing/metadata/public-document-metadata/spec.md#scenario-authoritative-content-changes-during-a-request) | verbatim after reference relocation |
| App identity is centrally derived / Shared app name changes | [app/shared/frontend/navigation/document-metadata: Shared app name changes](specs/app/shared/frontend/navigation/document-metadata/spec.md#scenario-shared-app-name-changes) | verbatim after reference relocation |

### app/navigation/route-identity

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| Canonical installed destinations | [app/shared/frontend/navigation/route-identity: Canonical installed destinations](specs/app/shared/frontend/navigation/route-identity/spec.md#requirement-canonical-installed-destinations) | Verbatim body after reference relocation. |
| Semantic ancestry and consistent vocabulary | [app/shared/frontend/navigation/route-identity: Semantic ancestry and consistent vocabulary](specs/app/shared/frontend/navigation/route-identity/spec.md#requirement-semantic-ancestry-and-consistent-vocabulary) | Verbatim body after reference relocation. |
| Contextual actions follow the active surface | [app/shared/frontend/navigation/route-identity: Contextual actions follow the active surface](specs/app/shared/frontend/navigation/route-identity/spec.md#requirement-contextual-actions-follow-the-active-surface) | Verbatim body after reference relocation. |
| Route enrichment preserves identity | [app/dashboard/navigation/route-enrichment: Route enrichment preserves identity](specs/app/dashboard/navigation/route-enrichment/spec.md#requirement-route-enrichment-preserves-identity) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| Canonical installed destinations / Navigate to a dynamic detail | [app/shared/frontend/navigation/route-identity: Navigate to a dynamic detail](specs/app/shared/frontend/navigation/route-identity/spec.md#scenario-navigate-to-a-dynamic-detail) | verbatim after reference relocation |
| Semantic ancestry and consistent vocabulary / Detail outside a filesystem-shaped hierarchy | [app/shared/frontend/navigation/route-identity: Detail outside a filesystem-shaped hierarchy](specs/app/shared/frontend/navigation/route-identity/spec.md#scenario-detail-outside-a-filesystem-shaped-hierarchy) | verbatim after reference relocation |
| Contextual actions follow the active surface / Leave a surface with contextual commands | [app/shared/frontend/navigation/route-identity: Leave a surface with contextual commands](specs/app/shared/frontend/navigation/route-identity/spec.md#scenario-leave-a-surface-with-contextual-commands) | verbatim after reference relocation |
| Route enrichment preserves identity / Destination appears in multiple navigation surfaces | [app/dashboard/navigation/route-enrichment: Destination appears in multiple navigation surfaces](specs/app/dashboard/navigation/route-enrichment/spec.md#scenario-destination-appears-in-multiple-navigation-surfaces) | verbatim after reference relocation |

### app/ui-system/component-contracts

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| Discoverable supported owner contract | [app/shared/frontend/components/component-contracts: Discoverable supported owner contract](specs/app/shared/frontend/components/component-contracts/spec.md#requirement-discoverable-supported-owner-contract) | Verbatim body after reference relocation. |
| Complete and neutral variant teaching | [app/shared/frontend/components/component-contracts: Complete and neutral variant teaching](specs/app/shared/frontend/components/component-contracts/spec.md#requirement-complete-and-neutral-variant-teaching) | Verbatim body after reference relocation. |
| Faithful public projections | [app/shared/frontend/components/component-contracts: Faithful public projections](specs/app/shared/frontend/components/component-contracts/spec.md#requirement-faithful-public-projections) | Verbatim body after reference relocation. |
| Native semantics remain mounted | [app/shared/frontend/components/component-contracts: Native semantics remain mounted](specs/app/shared/frontend/components/component-contracts/spec.md#requirement-native-semantics-remain-mounted) | Verbatim body after reference relocation. |
| Stable public identity | [app/shared/frontend/components/component-contracts: Stable public identity](specs/app/shared/frontend/components/component-contracts/spec.md#requirement-stable-public-identity) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| Discoverable supported owner contract / Choose a shared control | [app/shared/frontend/components/component-contracts: Choose a shared control](specs/app/shared/frontend/components/component-contracts/spec.md#scenario-choose-a-shared-control) | verbatim after reference relocation |
| Complete and neutral variant teaching / Add a supported owner variant | [app/shared/frontend/components/component-contracts: Add a supported owner variant](specs/app/shared/frontend/components/component-contracts/spec.md#scenario-add-a-supported-owner-variant) | verbatim after reference relocation |
| Faithful public projections / Export a reduced-profile owner | [app/shared/frontend/components/component-contracts: Export a reduced-profile owner](specs/app/shared/frontend/components/component-contracts/spec.md#scenario-export-a-reduced-profile-owner) | verbatim after reference relocation |
| Native semantics remain mounted / Custom visual input presentation | [app/shared/frontend/components/component-contracts: Custom visual input presentation](specs/app/shared/frontend/components/component-contracts/spec.md#scenario-custom-visual-input-presentation) | verbatim after reference relocation |
| Stable public identity / Move a shared component | [app/shared/frontend/components/component-contracts: Move a shared component](specs/app/shared/frontend/components/component-contracts/spec.md#scenario-move-a-shared-component) | verbatim after reference relocation |

### template/demo-behavior

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| Resettable external-write-free fixtures | [template/demonstrations/demo-behavior: Resettable external-write-free fixtures](specs/template/demonstrations/demo-behavior/spec.md#requirement-resettable-external-write-free-fixtures) | Verbatim body after reference relocation. |
| Guarded synthetic contact boundary | [template/demonstrations/demo-behavior: Guarded synthetic contact boundary](specs/template/demonstrations/demo-behavior/spec.md#requirement-guarded-synthetic-contact-boundary) | Verbatim body after reference relocation. |
| Truthful support and contact demo results | [template/demonstrations/demo-behavior: Truthful support and contact demo results](specs/template/demonstrations/demo-behavior/spec.md#requirement-truthful-support-and-contact-demo-results) | Verbatim body after reference relocation. |
| Fixture authentication remains distinct | [template/demonstrations/demo-behavior: Fixture authentication remains distinct](specs/template/demonstrations/demo-behavior/spec.md#requirement-fixture-authentication-remains-distinct) | Verbatim body after reference relocation. |
| Fixture storage remains distinct | [template/demonstrations/demo-behavior: Fixture storage remains distinct](specs/template/demonstrations/demo-behavior/spec.md#requirement-fixture-storage-remains-distinct) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| Resettable external-write-free fixtures / Reset a fixture session | [template/demonstrations/demo-behavior: Reset a fixture session](specs/template/demonstrations/demo-behavior/spec.md#scenario-reset-a-fixture-session) | verbatim after reference relocation |
| Guarded synthetic contact boundary / Honeypot hit | [template/demonstrations/demo-behavior: Honeypot hit](specs/template/demonstrations/demo-behavior/spec.md#scenario-honeypot-hit) | verbatim after reference relocation |
| Guarded synthetic contact boundary / Public demo disclosure | [template/demonstrations/demo-behavior: Public demo disclosure](specs/template/demonstrations/demo-behavior/spec.md#scenario-public-demo-disclosure) | verbatim after reference relocation |
| Truthful support and contact demo results / Support fixture saved | [template/demonstrations/demo-behavior: Support fixture saved](specs/template/demonstrations/demo-behavior/spec.md#scenario-support-fixture-saved) | verbatim after reference relocation |
| Truthful support and contact demo results / Contact demo accepted | [template/demonstrations/demo-behavior: Contact demo accepted](specs/template/demonstrations/demo-behavior/spec.md#scenario-contact-demo-accepted) | verbatim after reference relocation |
| Fixture authentication remains distinct / Use fixture authentication | [template/demonstrations/demo-behavior: Use fixture authentication](specs/template/demonstrations/demo-behavior/spec.md#scenario-use-fixture-authentication) | verbatim after reference relocation |
| Fixture storage remains distinct / No configured private storage adapter | [template/demonstrations/demo-behavior: No configured private storage adapter](specs/template/demonstrations/demo-behavior/spec.md#scenario-no-configured-private-storage-adapter) | verbatim after reference relocation |

### template/project-assembly

| Original requirement | Canonical destination | Disposition |
| --- | --- | --- |
| Positive output ownership | [template/assembly/project-assembly: Positive output ownership](specs/template/assembly/project-assembly/spec.md#requirement-positive-output-ownership) | Verbatim body after reference relocation. |
| Profiles preserve intentional boundaries | [template/assembly/project-assembly: Profiles preserve intentional boundaries](specs/template/assembly/project-assembly/spec.md#requirement-profiles-preserve-intentional-boundaries) | Verbatim body after reference relocation. |
| Independent applicable policy and evidence | [template/assembly/project-assembly: Independent applicable policy and evidence](specs/template/assembly/project-assembly/spec.md#requirement-independent-applicable-policy-and-evidence) | Verbatim body after reference relocation. |
| Propagation follows proven ownership | [template/assembly/project-assembly: Propagation follows proven ownership](specs/template/assembly/project-assembly/spec.md#requirement-propagation-follows-proven-ownership) | Verbatim body after reference relocation. |
| Independent profile inheritance | [template/assembly/project-assembly: Independent profile inheritance](specs/template/assembly/project-assembly/spec.md#requirement-independent-profile-inheritance) | Verbatim body after reference relocation. |
| Independent loading contract inheritance | [template/assembly/project-assembly: Independent loading contract inheritance](specs/template/assembly/project-assembly/spec.md#requirement-independent-loading-contract-inheritance) | Verbatim body after reference relocation. |

| Original scenario | Canonical destination | Disposition |
| --- | --- | --- |
| Positive output ownership / Conflicting output owners | [template/assembly/project-assembly: Conflicting output owners](specs/template/assembly/project-assembly/spec.md#scenario-conflicting-output-owners) | verbatim after reference relocation |
| Profiles preserve intentional boundaries / Marketing-only assembly | [template/assembly/project-assembly: Marketing-only assembly](specs/template/assembly/project-assembly/spec.md#scenario-marketing-only-assembly) | verbatim after reference relocation |
| Independent applicable policy and evidence / Modify a generated specification | [template/assembly/project-assembly: Modify a generated specification](specs/template/assembly/project-assembly/spec.md#scenario-modify-a-generated-specification) | verbatim after reference relocation |
| Independent applicable policy and evidence / Template contracts are excluded | [template/assembly/project-assembly: Template contracts are excluded](specs/template/assembly/project-assembly/spec.md#scenario-template-contracts-are-excluded) | verbatim after reference relocation |
| Independent applicable policy and evidence / Production behavior replaces an example | [template/assembly/project-assembly: Production behavior replaces an example](specs/template/assembly/project-assembly/spec.md#scenario-production-behavior-replaces-an-example) | verbatim after reference relocation |
| Propagation follows proven ownership / Update a canonical shared owner | [template/assembly/project-assembly: Update a canonical shared owner](specs/template/assembly/project-assembly/spec.md#scenario-update-a-canonical-shared-owner) | verbatim after reference relocation |
| Independent profile inheritance / Marketing project | [template/assembly/project-assembly: Marketing project](specs/template/assembly/project-assembly/spec.md#scenario-marketing-project) | verbatim after reference relocation |
| Independent profile inheritance / Application project | [template/assembly/project-assembly: Application project](specs/template/assembly/project-assembly/spec.md#scenario-application-project) | verbatim after reference relocation |
| Independent loading contract inheritance / Profile-selected coverage | [template/assembly/project-assembly: Profile-selected coverage](specs/template/assembly/project-assembly/spec.md#scenario-profile-selected-coverage) | verbatim after reference relocation |
