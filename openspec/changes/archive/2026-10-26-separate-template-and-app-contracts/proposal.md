# Proposal

## Why

Generated apps currently inherit template demonstration and fixture guarantees mixed into otherwise reusable behavior. Explicit ownership must let product apps retain useful contracts without requiring production entities to reset or prohibiting real persistence and delivery.

## What Changes

- **BREAKING:** retire the eighteen unprefixed capability identities in favor of `app/<family>/<capability>`; preserve reusable requirements and scenarios with corrected references.
- Keep `template/project-assembly` and introduce `template/demo-behavior`. Move fixture-only requirements and scenarios to the demo capability, and assembly/inheritance requirements to project assembly.
- Explicitly select applicable app contracts in positive assembly; exclude the entire template spec namespace and history from generated projects. Keep independent app-owned copies and stock OpenSpec integration.
- Update canonical/generated instructions, config, procedures and operational consumers without adding a routing skill, custom schema, runtime feature or automatic spec generation.
- Retain current demos and their browser tests; moving policy does not silently implement production providers or remove honest demo disclosures.

## Capabilities

### New Capabilities

- `app/content/marketing-composition`: Existing reusable marketing-composition behavior, separated from template-only guarantees.
- `app/content/media-delivery`: Existing reusable media-delivery behavior, separated from template-only guarantees.
- `app/content/source-resolution`: Existing reusable source-resolution behavior, separated from template-only guarantees.
- `app/data-lifecycle/action-behavior`: Existing reusable action-behavior behavior, separated from template-only guarantees.
- `app/data-lifecycle/form-behavior`: Existing reusable form-behavior behavior, separated from template-only guarantees.
- `app/data-lifecycle/loading-state-behavior`: Existing reusable loading-state-behavior behavior, separated from template-only guarantees.
- `app/delivery/contact-delivery`: Existing reusable contact-delivery behavior, separated from template-only guarantees.
- `app/delivery/submission-protection`: Existing reusable submission-protection behavior, separated from template-only guarantees.
- `app/domain/entity-presentation`: Existing reusable entity-presentation behavior, separated from template-only guarantees.
- `app/experience/content-hierarchy`: Existing reusable content-hierarchy behavior, separated from template-only guarantees.
- `app/identity/access-and-membership`: Existing reusable access-and-membership behavior, separated from template-only guarantees.
- `app/identity/private-file-access`: Existing reusable private-file-access behavior, separated from template-only guarantees.
- `app/integration/api-transport`: Existing reusable api-transport behavior, separated from template-only guarantees.
- `app/interaction/keyboard-and-overlays`: Existing reusable keyboard-and-overlays behavior, separated from template-only guarantees.
- `app/interaction/responsive-and-motion`: Existing reusable responsive-and-motion behavior, separated from template-only guarantees.
- `app/navigation/document-metadata`: Existing reusable document-metadata behavior, separated from template-only guarantees.
- `app/navigation/route-identity`: Existing reusable route-identity behavior, separated from template-only guarantees.
- `app/ui-system/component-contracts`: Existing reusable component-contracts behavior, separated from template-only guarantees.
- `template/demo-behavior`: Truthful, isolated and resettable template demonstrations, including contact/support results and unavailable provider examples.

### Modified Capabilities

- `content/marketing-composition`: Retire this identity after relocating every applicable clause to its app or template owner.
- `content/media-delivery`: Retire this identity after relocating every applicable clause to its app or template owner.
- `content/source-resolution`: Retire this identity after relocating every applicable clause to its app or template owner.
- `data-lifecycle/action-behavior`: Retire this identity after relocating every applicable clause to its app or template owner.
- `data-lifecycle/form-behavior`: Retire this identity after relocating every applicable clause to its app or template owner.
- `data-lifecycle/loading-state-behavior`: Retire this identity after relocating every applicable clause to its app or template owner.
- `delivery/contact-delivery`: Retire this identity after relocating every applicable clause to its app or template owner.
- `delivery/submission-protection`: Retire this identity after relocating every applicable clause to its app or template owner.
- `domain/entity-presentation`: Retire this identity after relocating every applicable clause to its app or template owner.
- `experience/content-hierarchy`: Retire this identity after relocating every applicable clause to its app or template owner.
- `identity/access-and-membership`: Retire this identity after relocating every applicable clause to its app or template owner.
- `identity/private-file-access`: Retire this identity after relocating every applicable clause to its app or template owner.
- `integration/api-transport`: Retire this identity after relocating every applicable clause to its app or template owner.
- `interaction/keyboard-and-overlays`: Retire this identity after relocating every applicable clause to its app or template owner.
- `interaction/responsive-and-motion`: Retire this identity after relocating every applicable clause to its app or template owner.
- `navigation/document-metadata`: Retire this identity after relocating every applicable clause to its app or template owner.
- `navigation/route-identity`: Retire this identity after relocating every applicable clause to its app or template owner.
- `ui-system/component-contracts`: Retire this identity after relocating every applicable clause to its app or template owner.
- `template/project-assembly`: Explicit app-contract inheritance and template-contract exclusion, including moved form/loading profile-verification obligations.

## Impact

Maintained specs, root and nearest instructions, OpenSpec configuration, canonical verification docs, four operational skills and their reference tests, positive assembly manifests/surfaces/profile inventories and generated instructions/checks. Runtime demo behavior is unchanged. The separately authorized Next.js upgrade is completed independently and verified with build/type/form/loading coverage; it is not a new behavior requirement here.
