# Contract split reconciliation

Independent audit of the nineteen exact captured baselines in [source-baseline.json](source-baseline.json), the approved [design](design.md), all replacement/retirement deltas, and the synchronized maintained contracts. All original requirements, normative sentences and scenarios have an identified owner. No lost clause or scenario was found.

## Scope and verification

The baseline contains **87 requirements, 200 normative sentences and 108 scenarios**. The maintained result is eighteen app capabilities and two template capabilities. SHA-256 checks match all nineteen captured texts. Each of the eighteen retirement deltas lists exactly its old requirements with Reason and Migration metadata; the old maintained identities are absent. Every app delta requirement body matches its maintained replacement. Maintained app references and relative Markdown links resolve. All 200 receipt links/anchors resolve, both template delta bodies match maintained requirements, and a fresh strict validation passes all twenty maintained specs plus the change (21/21).

The ignored machine receipt `test-results/spec-ownership/clause-audit.json` records every original normative sentence and scenario, destination text, exact/semantic disposition, baseline hashes and maintained hashes. Its companion audit script reproduces those checks. This receipt checks text and ownership; it does not claim generated assembly or browser execution. Root integration owns those checks and the separately verified Next16.4.3 build/type/form/loading evidence.

## Ownership decisions

- Form server authority, validation, keyboard behavior, synchronous duplicate prevention, pending feedback, recoverable failure, password clearing, safe continuation and all generic success behavior remain app policy. The former support-membership scenario now applies to all submissions; support therefore still rejects unauthorized membership without creating a request.
- Support subject/message clearing and truthful saved-fixture identification, contact value retention and explicit no-send/no-store success, neutral honeypot short-circuiting, pre-submit disclosure and no logging remain template demo guarantees. The exact original success/honeypot/disclosure scenarios are retained there.
- Entity reset/external-write restrictions and fixture authentication/storage truthfulness move to the template demo owner. Configured-provider authorization, private references, bounded URLs, replacement and cleanup remain app policy.
- Form/loading independent integration, procedures, history exclusions and profile-selected verification move to template assembly. Positive file ownership, intentional profiles and propagation remain unchanged there.
- The delivery missing-configuration scenario still mandates unavailable, so it cannot report a fixture success as successful delivery. Configured delivery, privacy, recipient normalization and failure recovery remain valid app contracts.
- Injected test transports remain a testing seam in the app API contract; that clause does not ban real transports. Motion reset ownership and retained drafts/values are behavior rules, not fixture reset/persistence restrictions.

## Complete requirement and scenario map

Links target this change's deltas and remain portable when archived. Unchanged assembly requirements link to the captured baseline because a MODIFIED delta intentionally contains only changed requirements. All other links target exact requirement/scenario anchors.

### content/marketing-composition

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| Ordered semantic page content | [app/content/marketing-composition: Ordered semantic page content](specs/app/content/marketing-composition/spec.md#requirement-ordered-semantic-page-content) | Verbatim, apart from app namespace references. |
| Shared shell and navigation | [app/content/marketing-composition: Shared shell and navigation](specs/app/content/marketing-composition/spec.md#requirement-shared-shell-and-navigation) | Verbatim, apart from app namespace references. |
| Stable semantic review boundaries | [app/content/marketing-composition: Stable semantic review boundaries](specs/app/content/marketing-composition/spec.md#requirement-stable-semantic-review-boundaries) | Verbatim, apart from app namespace references. |
| Source fidelity and later reuse are distinct decisions | [app/content/marketing-composition: Source fidelity and later reuse are distinct decisions](specs/app/content/marketing-composition/spec.md#requirement-source-fidelity-and-later-reuse-are-distinct-decisions) | Verbatim, apart from app namespace references. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| Ordered semantic page content / Render a multi-section public page | [app/content/marketing-composition: Render a multi-section public page](specs/app/content/marketing-composition/spec.md#scenario-render-a-multi-section-public-page) | Verbatim. |
| Shared shell and navigation / Compact shell navigation | [app/content/marketing-composition: Compact shell navigation](specs/app/content/marketing-composition/spec.md#scenario-compact-shell-navigation) | Verbatim. |
| Stable semantic review boundaries / Review content with an excluded approved header | [app/content/marketing-composition: Review content with an excluded approved header](specs/app/content/marketing-composition/spec.md#scenario-review-content-with-an-excluded-approved-header) | Verbatim. |
| Source fidelity and later reuse are distinct decisions / Similar independent source cases | [app/content/marketing-composition: Similar independent source cases](specs/app/content/marketing-composition/spec.md#scenario-similar-independent-source-cases) | Verbatim. |

### content/media-delivery

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| Durable constituent assets | [app/content/media-delivery: Durable constituent assets](specs/app/content/media-delivery/spec.md#requirement-durable-constituent-assets) | Verbatim, apart from app namespace references. |
| Source-neutral image delivery | [app/content/media-delivery: Source-neutral image delivery](specs/app/content/media-delivery/spec.md#requirement-source-neutral-image-delivery) | Verbatim, apart from app namespace references. |
| Alternative text follows purpose | [app/content/media-delivery: Alternative text follows purpose](specs/app/content/media-delivery/spec.md#requirement-alternative-text-follows-purpose) | Verbatim, apart from app namespace references. |
| Delivery cost follows evidence | [app/content/media-delivery: Delivery cost follows evidence](specs/app/content/media-delivery/spec.md#requirement-delivery-cost-follows-evidence) | Verbatim, apart from app namespace references. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| Durable constituent assets / Expiring reference asset | [app/content/media-delivery: Expiring reference asset](specs/app/content/media-delivery/spec.md#scenario-expiring-reference-asset) | Verbatim. |
| Source-neutral image delivery / Render provider and static media | [app/content/media-delivery: Render provider and static media](specs/app/content/media-delivery/spec.md#scenario-render-provider-and-static-media) | Verbatim. |
| Alternative text follows purpose / Decorative and informative images | [app/content/media-delivery: Decorative and informative images](specs/app/content/media-delivery/spec.md#scenario-decorative-and-informative-images) | Verbatim. |
| Delivery cost follows evidence / Add a local delivery exception | [app/content/media-delivery: Add a local delivery exception](specs/app/content/media-delivery/spec.md#scenario-add-a-local-delivery-exception) | Verbatim. |

### content/source-resolution

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| Explicit source modes | [app/content/source-resolution: Explicit source modes](specs/app/content/source-resolution/spec.md#requirement-explicit-source-modes) | Verbatim, apart from app namespace references. |
| One normalized frontend contract | [app/content/source-resolution: One normalized frontend contract](specs/app/content/source-resolution/spec.md#requirement-one-normalized-frontend-contract) | Verbatim, apart from app namespace references. |
| Preserve recovery data until verified activation | [app/content/source-resolution: Preserve recovery data until verified activation](specs/app/content/source-resolution/spec.md#requirement-preserve-recovery-data-until-verified-activation) | Verbatim, apart from app namespace references. |
| Authoritative failure is not silent fallback | [app/content/source-resolution: Authoritative failure is not silent fallback](specs/app/content/source-resolution/spec.md#requirement-authoritative-failure-is-not-silent-fallback) | Verbatim, apart from app namespace references. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| Explicit source modes / Unconfigured CMS-ready project | [app/content/source-resolution: Unconfigured CMS-ready project](specs/app/content/source-resolution/spec.md#scenario-unconfigured-cms-ready-project) | Verbatim. |
| One normalized frontend contract / Switch an approved page source | [app/content/source-resolution: Switch an approved page source](specs/app/content/source-resolution/spec.md#scenario-switch-an-approved-page-source) | Verbatim. |
| Preserve recovery data until verified activation / Seed without successful readback | [app/content/source-resolution: Seed without successful readback](specs/app/content/source-resolution/spec.md#scenario-seed-without-successful-readback) | Verbatim. |
| Authoritative failure is not silent fallback / Unpublished authoritative document | [app/content/source-resolution: Unpublished authoritative document](specs/app/content/source-resolution/spec.md#scenario-unpublished-authoritative-document) | Verbatim. |

### data-lifecycle/action-behavior

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| One pending action owner | [app/data-lifecycle/action-behavior: One pending action owner](specs/app/data-lifecycle/action-behavior/spec.md#requirement-one-pending-action-owner) | Verbatim, apart from app namespace references. |
| Feedback follows ownership and lifetime | [app/data-lifecycle/action-behavior: Feedback follows ownership and lifetime](specs/app/data-lifecycle/action-behavior/spec.md#requirement-feedback-follows-ownership-and-lifetime) | Verbatim, apart from app namespace references. |
| Outcome channels remain specific | [app/data-lifecycle/action-behavior: Outcome channels remain specific](specs/app/data-lifecycle/action-behavior/spec.md#requirement-outcome-channels-remain-specific) | Verbatim, apart from app namespace references. |
| Destructive intent and reversible optimism | [app/data-lifecycle/action-behavior: Destructive intent and reversible optimism](specs/app/data-lifecycle/action-behavior/spec.md#requirement-destructive-intent-and-reversible-optimism) | Verbatim, apart from app namespace references. |
| Single completion navigation | [app/data-lifecycle/action-behavior: Single completion navigation](specs/app/data-lifecycle/action-behavior/spec.md#requirement-single-completion-navigation) | Verbatim, apart from app namespace references. |
| Active send cancellation remains available | [app/data-lifecycle/action-behavior: Active send cancellation remains available](specs/app/data-lifecycle/action-behavior/spec.md#requirement-active-send-cancellation-remains-available) | Verbatim, apart from app namespace references. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| One pending action owner / Rapid action group activation | [app/data-lifecycle/action-behavior: Rapid action group activation](specs/app/data-lifecycle/action-behavior/spec.md#scenario-rapid-action-group-activation) | Verbatim. |
| Feedback follows ownership and lifetime / Recoverable mutation failure | [app/data-lifecycle/action-behavior: Recoverable mutation failure](specs/app/data-lifecycle/action-behavior/spec.md#scenario-recoverable-mutation-failure) | Verbatim. |
| Feedback follows ownership and lifetime / Durable completion instructions | [app/data-lifecycle/action-behavior: Durable completion instructions](specs/app/data-lifecycle/action-behavior/spec.md#scenario-durable-completion-instructions) | Verbatim. |
| Outcome channels remain specific / Persistent read-only access | [app/data-lifecycle/action-behavior: Persistent read-only access](specs/app/data-lifecycle/action-behavior/spec.md#scenario-persistent-read-only-access) | Verbatim. |
| Destructive intent and reversible optimism / Failed optimistic update | [app/data-lifecycle/action-behavior: Failed optimistic update](specs/app/data-lifecycle/action-behavior/spec.md#scenario-failed-optimistic-update) | Verbatim. |
| Destructive intent and reversible optimism / Cancel destructive confirmation | [app/data-lifecycle/action-behavior: Cancel destructive confirmation](specs/app/data-lifecycle/action-behavior/spec.md#scenario-cancel-destructive-confirmation) | Verbatim. |
| Single completion navigation / Delete an open detail | [app/data-lifecycle/action-behavior: Delete an open detail](specs/app/data-lifecycle/action-behavior/spec.md#scenario-delete-an-open-detail) | Verbatim. |
| Active send cancellation remains available / Cancel an active run | [app/data-lifecycle/action-behavior: Cancel an active run](specs/app/data-lifecycle/action-behavior/spec.md#scenario-cancel-an-active-run) | Verbatim. |

### data-lifecycle/form-behavior

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| Accessible field feedback | [app/data-lifecycle/form-behavior: Accessible field feedback](specs/app/data-lifecycle/form-behavior/spec.md#requirement-accessible-field-feedback) | Verbatim, apart from app namespace references. |
| Native keyboard submission | [app/data-lifecycle/form-behavior: Native keyboard submission](specs/app/data-lifecycle/form-behavior/spec.md#requirement-native-keyboard-submission) | Verbatim, apart from app namespace references. |
| Single pending submission | [app/data-lifecycle/form-behavior: Single pending submission](specs/app/data-lifecycle/form-behavior/spec.md#requirement-single-pending-submission) | Verbatim, apart from app namespace references. |
| Server authority | [app/data-lifecycle/form-behavior: Server authority](specs/app/data-lifecycle/form-behavior/spec.md#requirement-server-authority) | Verbatim, apart from app namespace references. |
| Recoverable submission failure | [app/data-lifecycle/form-behavior: Recoverable submission failure](specs/app/data-lifecycle/form-behavior/spec.md#requirement-recoverable-submission-failure) | Verbatim, apart from app namespace references. |
| Explicit success behavior | [app/data-lifecycle/form-behavior: Explicit success behavior](specs/app/data-lifecycle/form-behavior/spec.md#requirement-explicit-success-behavior) | Verbatim, apart from app namespace references. |
| Authentication form recovery | [app/data-lifecycle/form-behavior: Authentication form recovery](specs/app/data-lifecycle/form-behavior/spec.md#requirement-authentication-form-recovery) | Verbatim, apart from app namespace references. |
| Guarded synthetic contact boundary | [template/demo-behavior: Guarded synthetic contact boundary](specs/template/demo-behavior/spec.md#requirement-guarded-synthetic-contact-boundary) | Verbatim, apart from app namespace references. |
| Independent profile inheritance | [template/project-assembly: Independent profile inheritance](specs/template/project-assembly/spec.md#requirement-independent-profile-inheritance) | Only clarifies the inherited form contract as app-owned; independent stock integration, installed-form-only tests, history exclusion and omitted-surface exclusion remain. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| Accessible field feedback / Invalid submission | [app/data-lifecycle/form-behavior: Invalid submission](specs/app/data-lifecycle/form-behavior/spec.md#scenario-invalid-submission) | Verbatim. |
| Accessible field feedback / Narrow viewport | [app/data-lifecycle/form-behavior: Narrow viewport](specs/app/data-lifecycle/form-behavior/spec.md#scenario-narrow-viewport) | Verbatim. |
| Native keyboard submission / Keyboard submit | [app/data-lifecycle/form-behavior: Keyboard submit](specs/app/data-lifecycle/form-behavior/spec.md#scenario-keyboard-submit) | Verbatim. |
| Single pending submission / Repeated submission while pending | [app/data-lifecycle/form-behavior: Repeated submission while pending](specs/app/data-lifecycle/form-behavior/spec.md#scenario-repeated-submission-while-pending) | Verbatim. |
| Server authority / Client validation bypass | [app/data-lifecycle/form-behavior: Client validation bypass](specs/app/data-lifecycle/form-behavior/spec.md#scenario-client-validation-bypass) | Verbatim. |
| Server authority / Support organization authorization | [app/data-lifecycle/form-behavior: Organization authorization](specs/app/data-lifecycle/form-behavior/spec.md#scenario-organization-authorization) | Generalized to all submissions: support is included; invalid membership is rejected before the requested mutation (therefore no support request is created). |
| Recoverable submission failure / Failed request and retry | [app/data-lifecycle/form-behavior: Failed request and retry](specs/app/data-lifecycle/form-behavior/spec.md#scenario-failed-request-and-retry) | Verbatim. |
| Explicit success behavior / Support fixture saved | [template/demo-behavior: Support fixture saved](specs/template/demo-behavior/spec.md#scenario-support-fixture-saved) | Verbatim. |
| Explicit success behavior / Contact demo accepted | [template/demo-behavior: Contact demo accepted](specs/template/demo-behavior/spec.md#scenario-contact-demo-accepted) | Verbatim. |
| Authentication form recovery / Rejected credentials | [app/data-lifecycle/form-behavior: Rejected credentials](specs/app/data-lifecycle/form-behavior/spec.md#scenario-rejected-credentials) | Verbatim. |
| Authentication form recovery / Successful login | [app/data-lifecycle/form-behavior: Successful login](specs/app/data-lifecycle/form-behavior/spec.md#scenario-successful-login) | Verbatim. |
| Authentication form recovery / Organization selection | [app/data-lifecycle/form-behavior: Organization selection](specs/app/data-lifecycle/form-behavior/spec.md#scenario-organization-selection) | Verbatim. |
| Authentication form recovery / Unsafe continuation | [app/data-lifecycle/form-behavior: Unsafe continuation](specs/app/data-lifecycle/form-behavior/spec.md#scenario-unsafe-continuation) | Verbatim. |
| Guarded synthetic contact boundary / Honeypot hit | [template/demo-behavior: Honeypot hit](specs/template/demo-behavior/spec.md#scenario-honeypot-hit) | Verbatim. |
| Guarded synthetic contact boundary / Public demo disclosure | [template/demo-behavior: Public demo disclosure](specs/template/demo-behavior/spec.md#scenario-public-demo-disclosure) | Verbatim. |
| Independent profile inheritance / Marketing project | [template/project-assembly: Marketing project](specs/template/project-assembly/spec.md#scenario-marketing-project) | Verbatim. |
| Independent profile inheritance / Application project | [template/project-assembly: Application project](specs/template/project-assembly/spec.md#scenario-application-project) | Verbatim. |

### data-lifecycle/loading-state-behavior

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| Preserve independent known content | [app/data-lifecycle/loading-state-behavior: Preserve independent known content](specs/app/data-lifecycle/loading-state-behavior/spec.md#requirement-preserve-independent-known-content) | Verbatim, apart from app namespace references. |
| Dependency-scoped loading | [app/data-lifecycle/loading-state-behavior: Dependency-scoped loading](specs/app/data-lifecycle/loading-state-behavior/spec.md#requirement-dependency-scoped-loading) | Verbatim, apart from app namespace references. |
| Live and loading layout parity | [app/data-lifecycle/loading-state-behavior: Live and loading layout parity](specs/app/data-lifecycle/loading-state-behavior/spec.md#requirement-live-and-loading-layout-parity) | Verbatim, apart from app namespace references. |
| Inert visual placeholders | [app/data-lifecycle/loading-state-behavior: Inert visual placeholders](specs/app/data-lifecycle/loading-state-behavior/spec.md#requirement-inert-visual-placeholders) | Verbatim, apart from app namespace references. |
| Readable reduced-motion loading | [app/data-lifecycle/loading-state-behavior: Readable reduced-motion loading](specs/app/data-lifecycle/loading-state-behavior/spec.md#requirement-readable-reduced-motion-loading) | Verbatim, apart from app namespace references. |
| Distinct region outcomes and recovery | [app/data-lifecycle/loading-state-behavior: Distinct region outcomes and recovery](specs/app/data-lifecycle/loading-state-behavior/spec.md#requirement-distinct-region-outcomes-and-recovery) | Verbatim, apart from app namespace references. |
| Distinguish reading from submission | [app/data-lifecycle/loading-state-behavior: Distinguish reading from submission](specs/app/data-lifecycle/loading-state-behavior/spec.md#requirement-distinguish-reading-from-submission) | Verbatim, apart from app namespace references. |
| Independent loading contract inheritance | [template/project-assembly: Independent loading contract inheritance](specs/template/project-assembly/spec.md#requirement-independent-loading-contract-inheritance) | The deictic this maintained contract becomes the maintained app loading contract; independent procedure, history exclusion and installed-surface-only cases remain. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| Preserve independent known content / Known navigation while a region loads | [app/data-lifecycle/loading-state-behavior: Known navigation while a region loads](specs/app/data-lifecycle/loading-state-behavior/spec.md#scenario-known-navigation-while-a-region-loads) | Verbatim. |
| Preserve independent known content / Independent draft during loading | [app/data-lifecycle/loading-state-behavior: Independent draft during loading](specs/app/data-lifecycle/loading-state-behavior/spec.md#scenario-independent-draft-during-loading) | Verbatim. |
| Dependency-scoped loading / Independent regions | [app/data-lifecycle/loading-state-behavior: Independent regions](specs/app/data-lifecycle/loading-state-behavior/spec.md#scenario-independent-regions) | Verbatim. |
| Dependency-scoped loading / No content to load | [app/data-lifecycle/loading-state-behavior: No content to load](specs/app/data-lifecycle/loading-state-behavior/spec.md#scenario-no-content-to-load) | Verbatim. |
| Dependency-scoped loading / Data-dependent action | [app/data-lifecycle/loading-state-behavior: Data-dependent action](specs/app/data-lifecycle/loading-state-behavior/spec.md#scenario-data-dependent-action) | Verbatim. |
| Live and loading layout parity / Repeated content and narrow layout | [app/data-lifecycle/loading-state-behavior: Repeated content and narrow layout](specs/app/data-lifecycle/loading-state-behavior/spec.md#scenario-repeated-content-and-narrow-layout) | Verbatim. |
| Live and loading layout parity / Known and unknown sizing copy | [app/data-lifecycle/loading-state-behavior: Known and unknown sizing copy](specs/app/data-lifecycle/loading-state-behavior/spec.md#scenario-known-and-unknown-sizing-copy) | Verbatim. |
| Inert visual placeholders / Keyboard traversal during loading | [app/data-lifecycle/loading-state-behavior: Keyboard traversal during loading](specs/app/data-lifecycle/loading-state-behavior/spec.md#scenario-keyboard-traversal-during-loading) | Verbatim. |
| Inert visual placeholders / Accessible loading feedback | [app/data-lifecycle/loading-state-behavior: Accessible loading feedback](specs/app/data-lifecycle/loading-state-behavior/spec.md#scenario-accessible-loading-feedback) | Verbatim. |
| Readable reduced-motion loading / Reduced motion | [app/data-lifecycle/loading-state-behavior: Reduced motion](specs/app/data-lifecycle/loading-state-behavior/spec.md#scenario-reduced-motion) | Verbatim. |
| Distinct region outcomes and recovery / Idle region | [app/data-lifecycle/loading-state-behavior: Idle region](specs/app/data-lifecycle/loading-state-behavior/spec.md#scenario-idle-region) | Verbatim. |
| Distinct region outcomes and recovery / Empty result | [app/data-lifecycle/loading-state-behavior: Empty result](specs/app/data-lifecycle/loading-state-behavior/spec.md#scenario-empty-result) | Verbatim. |
| Distinct region outcomes and recovery / Recoverable read failure | [app/data-lifecycle/loading-state-behavior: Recoverable read failure](specs/app/data-lifecycle/loading-state-behavior/spec.md#scenario-recoverable-read-failure) | Verbatim. |
| Distinct region outcomes and recovery / Unavailable prerequisite | [app/data-lifecycle/loading-state-behavior: Unavailable prerequisite](specs/app/data-lifecycle/loading-state-behavior/spec.md#scenario-unavailable-prerequisite) | Verbatim. |
| Distinguish reading from submission / Form submission alongside readable content | [app/data-lifecycle/loading-state-behavior: Form submission alongside readable content](specs/app/data-lifecycle/loading-state-behavior/spec.md#scenario-form-submission-alongside-readable-content) | Verbatim. |
| Independent loading contract inheritance / Profile-selected coverage | [template/project-assembly: Profile-selected coverage](specs/template/project-assembly/spec.md#scenario-profile-selected-coverage) | Verbatim. |

### delivery/contact-delivery

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| Delivery is explicitly configured and server-owned | [app/delivery/contact-delivery: Delivery is explicitly configured and server-owned](specs/app/delivery/contact-delivery/spec.md#requirement-delivery-is-explicitly-configured-and-server-owned); [template/demo-behavior: Truthful support and contact demo results](specs/template/demo-behavior/spec.md#requirement-truthful-support-and-contact-demo-results) | Server normalization/validation/guards, server-owned recipients/credentials and mandatory unavailable configuration outcome remain exact in app. Fixture no-email moves to demo (without the obsolete form-owner reference). |
| Recipient-independent message content | [app/delivery/contact-delivery: Recipient-independent message content](specs/app/delivery/contact-delivery/spec.md#requirement-recipient-independent-message-content) | Verbatim, apart from app namespace references. |
| Truthful private delivery outcomes | [app/delivery/contact-delivery: Truthful private delivery outcomes](specs/app/delivery/contact-delivery/spec.md#requirement-truthful-private-delivery-outcomes) | Verbatim, apart from app namespace references. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| Delivery is explicitly configured and server-owned / Delivery configuration missing | [app/delivery/contact-delivery: Delivery configuration missing](specs/app/delivery/contact-delivery/spec.md#scenario-delivery-configuration-missing) | Still requires an unavailable result and forbids implying delivery success; mandatory unavailability rules out reporting fixture success as the delivery outcome. |
| Recipient-independent message content / Multiple configured recipients | [app/delivery/contact-delivery: Multiple configured recipients](specs/app/delivery/contact-delivery/spec.md#scenario-multiple-configured-recipients) | Verbatim. |
| Truthful private delivery outcomes / Provider rejects delivery | [app/delivery/contact-delivery: Provider rejects delivery](specs/app/delivery/contact-delivery/spec.md#scenario-provider-rejects-delivery) | Verbatim. |

### delivery/submission-protection

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| Apply guards at exposed boundaries | [app/delivery/submission-protection: Apply guards at exposed boundaries](specs/app/delivery/submission-protection/spec.md#requirement-apply-guards-at-exposed-boundaries) | Verbatim, apart from app namespace references. |
| Honeypot responses remain neutral | [app/delivery/submission-protection: Honeypot responses remain neutral](specs/app/delivery/submission-protection/spec.md#requirement-honeypot-responses-remain-neutral) | Verbatim, apart from app namespace references. |
| Server-owned attachment validation | [app/delivery/submission-protection: Server-owned attachment validation](specs/app/delivery/submission-protection/spec.md#requirement-server-owned-attachment-validation) | Verbatim, apart from app namespace references. |
| Policy-owned throttling and private diagnostics | [app/delivery/submission-protection: Policy-owned throttling and private diagnostics](specs/app/delivery/submission-protection/spec.md#requirement-policy-owned-throttling-and-private-diagnostics) | Verbatim, apart from app namespace references. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| Apply guards at exposed boundaries / Guarded public submission | [app/delivery/submission-protection: Guarded public submission](specs/app/delivery/submission-protection/spec.md#scenario-guarded-public-submission) | Verbatim. |
| Honeypot responses remain neutral / Filled hidden field | [app/delivery/submission-protection: Filled hidden field](specs/app/delivery/submission-protection/spec.md#scenario-filled-hidden-field) | Verbatim. |
| Server-owned attachment validation / Bypass client file validation | [app/delivery/submission-protection: Bypass client file validation](specs/app/delivery/submission-protection/spec.md#scenario-bypass-client-file-validation) | Verbatim. |
| Policy-owned throttling and private diagnostics / Existing cooldown is active | [app/delivery/submission-protection: Existing cooldown is active](specs/app/delivery/submission-protection/spec.md#scenario-existing-cooldown-is-active) | Verbatim. |

### domain/entity-presentation

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| One consistent presentation vocabulary | [app/domain/entity-presentation: One consistent presentation vocabulary](specs/app/domain/entity-presentation/spec.md#requirement-one-consistent-presentation-vocabulary) | Verbatim, apart from app namespace references. |
| Authorized recoverable lifecycle | [app/domain/entity-presentation: Authorized recoverable lifecycle](specs/app/domain/entity-presentation/spec.md#requirement-authorized-recoverable-lifecycle) | Verbatim, apart from app namespace references. |
| Resettable external-write-free fixtures | [template/demo-behavior: Resettable external-write-free fixtures](specs/template/demo-behavior/spec.md#requirement-resettable-external-write-free-fixtures) | Verbatim, apart from app namespace references. |
| Collection pagination and overview continuation differ | [app/domain/entity-presentation: Collection pagination and overview continuation differ](specs/app/domain/entity-presentation/spec.md#requirement-collection-pagination-and-overview-continuation-differ) | Verbatim, apart from app namespace references. |
| Tool presentation corresponds to execution | [app/domain/entity-presentation: Tool presentation corresponds to execution](specs/app/domain/entity-presentation/spec.md#requirement-tool-presentation-corresponds-to-execution) | Verbatim, apart from app namespace references. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| One consistent presentation vocabulary / Entity appears in a selector and detail | [app/domain/entity-presentation: Entity appears in a selector and detail](specs/app/domain/entity-presentation/spec.md#scenario-entity-appears-in-a-selector-and-detail) | Verbatim. |
| Authorized recoverable lifecycle / Failed entity update | [app/domain/entity-presentation: Failed entity update](specs/app/domain/entity-presentation/spec.md#scenario-failed-entity-update) | Verbatim. |
| Resettable external-write-free fixtures / Reset a fixture session | [template/demo-behavior: Reset a fixture session](specs/template/demo-behavior/spec.md#scenario-reset-a-fixture-session) | Verbatim. |
| Collection pagination and overview continuation differ / Continue from an overview | [app/domain/entity-presentation: Continue from an overview](specs/app/domain/entity-presentation/spec.md#scenario-continue-from-an-overview) | Verbatim. |
| Tool presentation corresponds to execution / Present an entity tool result | [app/domain/entity-presentation: Present an entity tool result](specs/app/domain/entity-presentation/spec.md#scenario-present-an-entity-tool-result) | Verbatim. |

### experience/content-hierarchy

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| Coherent grouping and surface meaning | [app/experience/content-hierarchy: Coherent grouping and surface meaning](specs/app/experience/content-hierarchy/spec.md#requirement-coherent-grouping-and-surface-meaning) | Verbatim, apart from app namespace references. |
| Context is useful and not duplicated | [app/experience/content-hierarchy: Context is useful and not duplicated](specs/app/experience/content-hierarchy/spec.md#requirement-context-is-useful-and-not-duplicated) | Verbatim, apart from app namespace references. |
| Shared alignment preserves usable controls | [app/experience/content-hierarchy: Shared alignment preserves usable controls](specs/app/experience/content-hierarchy/spec.md#requirement-shared-alignment-preserves-usable-controls) | Verbatim, apart from app namespace references. |
| Semantic color and identity remain legible | [app/experience/content-hierarchy: Semantic color and identity remain legible](specs/app/experience/content-hierarchy/spec.md#requirement-semantic-color-and-identity-remain-legible) | Verbatim, apart from app namespace references. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| Coherent grouping and surface meaning / Present related record properties | [app/experience/content-hierarchy: Present related record properties](specs/app/experience/content-hierarchy/spec.md#scenario-present-related-record-properties) | Verbatim. |
| Context is useful and not duplicated / Group with an external heading | [app/experience/content-hierarchy: Group with an external heading](specs/app/experience/content-hierarchy/spec.md#scenario-group-with-an-external-heading) | Verbatim. |
| Shared alignment preserves usable controls / Align a section action at a surface edge | [app/experience/content-hierarchy: Align a section action at a surface edge](specs/app/experience/content-hierarchy/spec.md#scenario-align-a-section-action-at-a-surface-edge) | Verbatim. |
| Semantic color and identity remain legible / Name-based avatar on a tinted surface | [app/experience/content-hierarchy: Name-based avatar on a tinted surface](specs/app/experience/content-hierarchy/spec.md#scenario-name-based-avatar-on-a-tinted-surface) | Verbatim. |

### identity/access-and-membership

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| Server authorization at every protected boundary | [app/identity/access-and-membership: Server authorization at every protected boundary](specs/app/identity/access-and-membership/spec.md#requirement-server-authorization-at-every-protected-boundary) | Verbatim, apart from app namespace references. |
| Access denial remains usable | [app/identity/access-and-membership: Access denial remains usable](specs/app/identity/access-and-membership/spec.md#requirement-access-denial-remains-usable) | Verbatim, apart from app namespace references. |
| Safe continuations and explicit authentication methods | [app/identity/access-and-membership: Safe continuations and explicit authentication methods](specs/app/identity/access-and-membership/spec.md#requirement-safe-continuations-and-explicit-authentication-methods); [template/demo-behavior: Fixture authentication remains distinct](specs/template/demo-behavior/spec.md#requirement-fixture-authentication-remains-distinct) | The safe-continuation and explicitly configured optional-method sentences remain exact in app. The non-durable fixture/provider-truthfulness sentence moves verbatim to demo. |
| Invitation acceptance is deliberate and bounded | [app/identity/access-and-membership: Invitation acceptance is deliberate and bounded](specs/app/identity/access-and-membership/spec.md#requirement-invitation-acceptance-is-deliberate-and-bounded) | Verbatim, apart from app namespace references. |
| Retain a verified sign-in identity | [app/identity/access-and-membership: Retain a verified sign-in identity](specs/app/identity/access-and-membership/spec.md#requirement-retain-a-verified-sign-in-identity) | Verbatim, apart from app namespace references. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| Server authorization at every protected boundary / Stale organization context | [app/identity/access-and-membership: Stale organization context](specs/app/identity/access-and-membership/spec.md#scenario-stale-organization-context) | Verbatim. |
| Access denial remains usable / Access expires during a protected read | [app/identity/access-and-membership: Access expires during a protected read](specs/app/identity/access-and-membership/spec.md#scenario-access-expires-during-a-protected-read) | Verbatim. |
| Safe continuations and explicit authentication methods / Unsafe continuation | [app/identity/access-and-membership: Unsafe continuation](specs/app/identity/access-and-membership/spec.md#scenario-unsafe-continuation) | Verbatim. |
| Safe continuations and explicit authentication methods / Unconfigured optional method | [app/identity/access-and-membership: Unconfigured optional method](specs/app/identity/access-and-membership/spec.md#scenario-unconfigured-optional-method) | Verbatim. |
| Invitation acceptance is deliberate and bounded / View and accept an invitation | [app/identity/access-and-membership: View and accept an invitation](specs/app/identity/access-and-membership/spec.md#scenario-view-and-accept-an-invitation) | Verbatim. |
| Invitation acceptance is deliberate and bounded / Reuse a replaced invitation | [app/identity/access-and-membership: Reuse a replaced invitation](specs/app/identity/access-and-membership/spec.md#scenario-reuse-a-replaced-invitation) | Verbatim. |
| Retain a verified sign-in identity / Remove the last verified identity | [app/identity/access-and-membership: Remove the last verified identity](specs/app/identity/access-and-membership/spec.md#scenario-remove-the-last-verified-identity) | Verbatim. |

### identity/private-file-access

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| Authorize file lifecycle boundaries | [app/identity/private-file-access: Authorize file lifecycle boundaries](specs/app/identity/private-file-access/spec.md#requirement-authorize-file-lifecycle-boundaries) | Verbatim, apart from app namespace references. |
| Opaque references and bounded access | [app/identity/private-file-access: Opaque references and bounded access](specs/app/identity/private-file-access/spec.md#requirement-opaque-references-and-bounded-access) | Verbatim, apart from app namespace references. |
| Explicit replacement and cleanup | [app/identity/private-file-access: Explicit replacement and cleanup](specs/app/identity/private-file-access/spec.md#requirement-explicit-replacement-and-cleanup); [template/demo-behavior: Fixture storage remains distinct](specs/template/demo-behavior/spec.md#requirement-fixture-storage-remains-distinct) | Configured replacement/deletion/cleanup sentence remains exact in app. The external-write-free/not-durable fixture sentence moves verbatim to demo. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| Authorize file lifecycle boundaries / Resolve another organization's file | [app/identity/private-file-access: Resolve another organization's file](specs/app/identity/private-file-access/spec.md#scenario-resolve-another-organizations-file) | Verbatim. |
| Opaque references and bounded access / Open an authorized private file | [app/identity/private-file-access: Open an authorized private file](specs/app/identity/private-file-access/spec.md#scenario-open-an-authorized-private-file) | Verbatim. |
| Explicit replacement and cleanup / Replace a private asset | [app/identity/private-file-access: Replace a private asset](specs/app/identity/private-file-access/spec.md#scenario-replace-a-private-asset) | Verbatim. |

### integration/api-transport

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| Consistent request outcomes | [app/integration/api-transport: Consistent request outcomes](specs/app/integration/api-transport/spec.md#requirement-consistent-request-outcomes) | Verbatim, apart from app namespace references. |
| Replaceable transport with identical behavior | [app/integration/api-transport: Replaceable transport with identical behavior](specs/app/integration/api-transport/spec.md#requirement-replaceable-transport-with-identical-behavior) | Verbatim, apart from app namespace references. |
| Secrets and feedback remain with their owners | [app/integration/api-transport: Secrets and feedback remain with their owners](specs/app/integration/api-transport/spec.md#requirement-secrets-and-feedback-remain-with-their-owners) | Verbatim, apart from app namespace references. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| Consistent request outcomes / Rejected API response | [app/integration/api-transport: Rejected API response](specs/app/integration/api-transport/spec.md#scenario-rejected-api-response) | Verbatim. |
| Replaceable transport with identical behavior / Inject a failed transport | [app/integration/api-transport: Inject a failed transport](specs/app/integration/api-transport/spec.md#scenario-inject-a-failed-transport) | Verbatim. |
| Secrets and feedback remain with their owners / Provider failure reaches a client | [app/integration/api-transport: Provider failure reaches a client](specs/app/integration/api-transport/spec.md#scenario-provider-failure-reaches-a-client) | Verbatim. |

### interaction/keyboard-and-overlays

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| Accessible control ownership | [app/interaction/keyboard-and-overlays: Accessible control ownership](specs/app/interaction/keyboard-and-overlays/spec.md#requirement-accessible-control-ownership) | Verbatim, apart from app namespace references. |
| Focus entry and return | [app/interaction/keyboard-and-overlays: Focus entry and return](specs/app/interaction/keyboard-and-overlays/spec.md#requirement-focus-entry-and-return) | Verbatim, apart from app namespace references. |
| Consistent pending dismissal lock | [app/interaction/keyboard-and-overlays: Consistent pending dismissal lock](specs/app/interaction/keyboard-and-overlays/spec.md#requirement-consistent-pending-dismissal-lock) | Verbatim, apart from app namespace references. |
| Blocking and anchored interaction roles | [app/interaction/keyboard-and-overlays: Blocking and anchored interaction roles](specs/app/interaction/keyboard-and-overlays/spec.md#requirement-blocking-and-anchored-interaction-roles) | Verbatim, apart from app namespace references. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| Accessible control ownership / Keyboard operation with decoration | [app/interaction/keyboard-and-overlays: Keyboard operation with decoration](specs/app/interaction/keyboard-and-overlays/spec.md#scenario-keyboard-operation-with-decoration) | Verbatim. |
| Focus entry and return / Close a nested dialog | [app/interaction/keyboard-and-overlays: Close a nested dialog](specs/app/interaction/keyboard-and-overlays/spec.md#scenario-close-a-nested-dialog) | Verbatim. |
| Consistent pending dismissal lock / Dismiss during a delayed confirmed mutation | [app/interaction/keyboard-and-overlays: Dismiss during a delayed confirmed mutation](specs/app/interaction/keyboard-and-overlays/spec.md#scenario-dismiss-during-a-delayed-confirmed-mutation) | Verbatim. |
| Consistent pending dismissal lock / Failure unlocks recovery | [app/interaction/keyboard-and-overlays: Failure unlocks recovery](specs/app/interaction/keyboard-and-overlays/spec.md#scenario-failure-unlocks-recovery) | Verbatim. |
| Blocking and anchored interaction roles / Open an anchored menu | [app/interaction/keyboard-and-overlays: Open an anchored menu](specs/app/interaction/keyboard-and-overlays/spec.md#scenario-open-an-anchored-menu) | Verbatim. |

### interaction/responsive-and-motion

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| Essential content survives responsive rendering | [app/interaction/responsive-and-motion: Essential content survives responsive rendering](specs/app/interaction/responsive-and-motion/spec.md#requirement-essential-content-survives-responsive-rendering) | Verbatim, apart from app namespace references. |
| Expensive hidden branches are bounded | [app/interaction/responsive-and-motion: Expensive hidden branches are bounded](specs/app/interaction/responsive-and-motion/spec.md#requirement-expensive-hidden-branches-are-bounded) | Verbatim, apart from app namespace references. |
| Motion does not gate agency | [app/interaction/responsive-and-motion: Motion does not gate agency](specs/app/interaction/responsive-and-motion/spec.md#requirement-motion-does-not-gate-agency) | Verbatim, apart from app namespace references. |
| Motion has coherent ownership | [app/interaction/responsive-and-motion: Motion has coherent ownership](specs/app/interaction/responsive-and-motion/spec.md#requirement-motion-has-coherent-ownership) | Verbatim, apart from app namespace references. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| Essential content survives responsive rendering / Initial compact render | [app/interaction/responsive-and-motion: Initial compact render](specs/app/interaction/responsive-and-motion/spec.md#scenario-initial-compact-render) | Verbatim. |
| Expensive hidden branches are bounded / Expensive desktop decoration on a phone | [app/interaction/responsive-and-motion: Expensive desktop decoration on a phone](specs/app/interaction/responsive-and-motion/spec.md#scenario-expensive-desktop-decoration-on-a-phone) | Verbatim. |
| Motion does not gate agency / Reduced motion during conditional content | [app/interaction/responsive-and-motion: Reduced motion during conditional content](specs/app/interaction/responsive-and-motion/spec.md#scenario-reduced-motion-during-conditional-content) | Verbatim. |
| Motion has coherent ownership / Resize during playback | [app/interaction/responsive-and-motion: Resize during playback](specs/app/interaction/responsive-and-motion/spec.md#scenario-resize-during-playback) | Verbatim. |

### navigation/document-metadata

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| Family title and indexing policy | [app/navigation/document-metadata: Family title and indexing policy](specs/app/navigation/document-metadata/spec.md#requirement-family-title-and-indexing-policy) | Verbatim, apart from app namespace references. |
| Canonical destination consistency | [app/navigation/document-metadata: Canonical destination consistency](specs/app/navigation/document-metadata/spec.md#requirement-canonical-destination-consistency) | Verbatim, apart from app namespace references. |
| Metadata and body share authoritative content | [app/navigation/document-metadata: Metadata and body share authoritative content](specs/app/navigation/document-metadata/spec.md#requirement-metadata-and-body-share-authoritative-content) | Verbatim, apart from app namespace references. |
| App identity is centrally derived | [app/navigation/document-metadata: App identity is centrally derived](specs/app/navigation/document-metadata/spec.md#requirement-app-identity-is-centrally-derived) | Verbatim, apart from app namespace references. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| Family title and indexing policy / Private and public page titles | [app/navigation/document-metadata: Private and public page titles](specs/app/navigation/document-metadata/spec.md#scenario-private-and-public-page-titles) | Verbatim. |
| Canonical destination consistency / Public route with incidental query parameters | [app/navigation/document-metadata: Public route with incidental query parameters](specs/app/navigation/document-metadata/spec.md#scenario-public-route-with-incidental-query-parameters) | Verbatim. |
| Metadata and body share authoritative content / Authoritative content changes during a request | [app/navigation/document-metadata: Authoritative content changes during a request](specs/app/navigation/document-metadata/spec.md#scenario-authoritative-content-changes-during-a-request) | Verbatim. |
| App identity is centrally derived / Shared app name changes | [app/navigation/document-metadata: Shared app name changes](specs/app/navigation/document-metadata/spec.md#scenario-shared-app-name-changes) | Verbatim. |

### navigation/route-identity

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| Canonical installed destinations | [app/navigation/route-identity: Canonical installed destinations](specs/app/navigation/route-identity/spec.md#requirement-canonical-installed-destinations) | Verbatim, apart from app namespace references. |
| Semantic ancestry and consistent vocabulary | [app/navigation/route-identity: Semantic ancestry and consistent vocabulary](specs/app/navigation/route-identity/spec.md#requirement-semantic-ancestry-and-consistent-vocabulary) | Verbatim, apart from app namespace references. |
| Contextual actions follow the active surface | [app/navigation/route-identity: Contextual actions follow the active surface](specs/app/navigation/route-identity/spec.md#requirement-contextual-actions-follow-the-active-surface) | Verbatim, apart from app namespace references. |
| Route enrichment preserves identity | [app/navigation/route-identity: Route enrichment preserves identity](specs/app/navigation/route-identity/spec.md#requirement-route-enrichment-preserves-identity) | Verbatim, apart from app namespace references. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| Canonical installed destinations / Navigate to a dynamic detail | [app/navigation/route-identity: Navigate to a dynamic detail](specs/app/navigation/route-identity/spec.md#scenario-navigate-to-a-dynamic-detail) | Verbatim. |
| Semantic ancestry and consistent vocabulary / Detail outside a filesystem-shaped hierarchy | [app/navigation/route-identity: Detail outside a filesystem-shaped hierarchy](specs/app/navigation/route-identity/spec.md#scenario-detail-outside-a-filesystem-shaped-hierarchy) | Verbatim. |
| Contextual actions follow the active surface / Leave a surface with contextual commands | [app/navigation/route-identity: Leave a surface with contextual commands](specs/app/navigation/route-identity/spec.md#scenario-leave-a-surface-with-contextual-commands) | Verbatim. |
| Route enrichment preserves identity / Destination appears in multiple navigation surfaces | [app/navigation/route-identity: Destination appears in multiple navigation surfaces](specs/app/navigation/route-identity/spec.md#scenario-destination-appears-in-multiple-navigation-surfaces) | Verbatim. |

### template/project-assembly

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| Positive output ownership | [template/project-assembly: Positive output ownership](source-baseline.json) | Verbatim, apart from app namespace references. |
| Profiles preserve intentional boundaries | [template/project-assembly: Profiles preserve intentional boundaries](source-baseline.json) | Verbatim, apart from app namespace references. |
| Independent applicable policy and evidence | [template/project-assembly: Independent applicable policy and evidence](specs/template/project-assembly/spec.md#requirement-independent-applicable-policy-and-evidence) | Preserves independent integration, configuration, applicable maintained contracts, procedures/tests, exclusions and installed-feature coverage; explicitly narrows inherited specs to app and excludes template contracts. |
| Propagation follows proven ownership | [template/project-assembly: Propagation follows proven ownership](source-baseline.json) | Verbatim, apart from app namespace references. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| Positive output ownership / Conflicting output owners | [template/project-assembly: Conflicting output owners](source-baseline.json) | Verbatim. |
| Profiles preserve intentional boundaries / Marketing-only assembly | [template/project-assembly: Marketing-only assembly](source-baseline.json) | Verbatim. |
| Independent applicable policy and evidence / Modify a generated specification | [template/project-assembly: Modify a generated specification](specs/template/project-assembly/spec.md#scenario-modify-a-generated-specification) | Verbatim. |
| Propagation follows proven ownership / Update a canonical shared owner | [template/project-assembly: Update a canonical shared owner](source-baseline.json) | Verbatim. |

### ui-system/component-contracts

| Baseline requirement | Retained or extracted owner | Disposition |
| --- | --- | --- |
| Discoverable supported owner contract | [app/ui-system/component-contracts: Discoverable supported owner contract](specs/app/ui-system/component-contracts/spec.md#requirement-discoverable-supported-owner-contract) | Verbatim, apart from app namespace references. |
| Complete and neutral variant teaching | [app/ui-system/component-contracts: Complete and neutral variant teaching](specs/app/ui-system/component-contracts/spec.md#requirement-complete-and-neutral-variant-teaching) | Verbatim, apart from app namespace references. |
| Faithful public projections | [app/ui-system/component-contracts: Faithful public projections](specs/app/ui-system/component-contracts/spec.md#requirement-faithful-public-projections) | Verbatim, apart from app namespace references. |
| Native semantics remain mounted | [app/ui-system/component-contracts: Native semantics remain mounted](specs/app/ui-system/component-contracts/spec.md#requirement-native-semantics-remain-mounted) | Verbatim, apart from app namespace references. |
| Stable public identity | [app/ui-system/component-contracts: Stable public identity](specs/app/ui-system/component-contracts/spec.md#requirement-stable-public-identity) | Verbatim, apart from app namespace references. |

| Baseline scenario | Destination | Disposition |
| --- | --- | --- |
| Discoverable supported owner contract / Choose a shared control | [app/ui-system/component-contracts: Choose a shared control](specs/app/ui-system/component-contracts/spec.md#scenario-choose-a-shared-control) | Verbatim. |
| Complete and neutral variant teaching / Add a supported owner variant | [app/ui-system/component-contracts: Add a supported owner variant](specs/app/ui-system/component-contracts/spec.md#scenario-add-a-supported-owner-variant) | Verbatim. |
| Faithful public projections / Export a reduced-profile owner | [app/ui-system/component-contracts: Export a reduced-profile owner](specs/app/ui-system/component-contracts/spec.md#scenario-export-a-reduced-profile-owner) | Verbatim. |
| Native semantics remain mounted / Custom visual input presentation | [app/ui-system/component-contracts: Custom visual input presentation](specs/app/ui-system/component-contracts/spec.md#scenario-custom-visual-input-presentation) | Verbatim. |
| Stable public identity / Move a shared component | [app/ui-system/component-contracts: Move a shared component](specs/app/ui-system/component-contracts/spec.md#scenario-move-a-shared-component) | Verbatim. |

## Limits

This audit does not change runtime behavior, provision storage or delivery, validate a live provider, or assert new generated installations. It found no unresolved conservation gap. Template demo guarantees intentionally do not propagate as product bans; installed example procedures/tests can continue verifying the actual examples until a product replaces them.
