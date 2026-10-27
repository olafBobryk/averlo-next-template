# Proposal

## Why

The current app namespace mixes general frontend rules, cross-boundary lifecycle guarantees, service behavior and surface-specific policy. Distinct shared, marketing, dashboard and product scopes make applicability clear without duplicating contracts or allowing template fixture rules to constrain independent products.

## What Changes

- **BREAKING**: Relocate current capability identities under template/assembly, template/demonstrations, app/shared, app/marketing and app/dashboard; update all live consumers and explicit assembly selections together.
- Extract dashboard route enrichment and public metadata requirements from mixed shared capabilities, preserving every existing behavioral guarantee and scenario meaning.
- Keep shared data-lifecycle capabilities intact across client/server responsibilities. Reserve product/ for independently authored business capabilities without creating placeholder specifications.
- Retain stock discovery and integration; explain relevant surface, shared dependency and product selection in existing agent guidance, with no routing skill, index or custom schema.
- Make media a selected shared dependency and marketing content-source/public metadata policy surface-selected. Folder location never installs a feature.
- Prove conservation, reference closure and positive selection across supported generated profiles.

## Capabilities

### New Capabilities
- `app/marketing/composition/marketing-composition`: Preserve the existing marketing-composition contract in its approved scope.
- `app/shared/frontend/content/media-delivery`: Preserve the existing media-delivery contract in its approved scope.
- `app/marketing/content-sources/source-resolution`: Preserve the existing source-resolution contract in its approved scope.
- `app/shared/data-lifecycle/action-behavior`: Preserve the existing action-behavior contract in its approved scope.
- `app/shared/data-lifecycle/form-behavior`: Preserve the existing form-behavior contract in its approved scope.
- `app/shared/data-lifecycle/loading-state-behavior`: Preserve the existing loading-state-behavior contract in its approved scope.
- `app/shared/services/delivery/contact-delivery`: Preserve the existing contact-delivery contract in its approved scope.
- `app/shared/services/delivery/submission-protection`: Preserve the existing submission-protection contract in its approved scope.
- `app/shared/frontend/content/entity-presentation`: Preserve the existing entity-presentation contract in its approved scope.
- `app/shared/frontend/content/content-hierarchy`: Preserve the existing content-hierarchy contract in its approved scope.
- `app/shared/services/identity/access-and-membership`: Preserve the existing access-and-membership contract in its approved scope.
- `app/shared/services/files/private-file-access`: Preserve the existing private-file-access contract in its approved scope.
- `app/shared/services/transport/api-transport`: Preserve the existing api-transport contract in its approved scope.
- `app/shared/frontend/interaction/keyboard-and-overlays`: Preserve the existing keyboard-and-overlays contract in its approved scope.
- `app/shared/frontend/interaction/responsive-and-motion`: Preserve the existing responsive-and-motion contract in its approved scope.
- `app/shared/frontend/navigation/document-metadata`: Preserve the existing document-metadata contract in its approved scope.
- `app/shared/frontend/navigation/route-identity`: Preserve the existing route-identity contract in its approved scope.
- `app/shared/frontend/components/component-contracts`: Preserve the existing component-contracts contract in its approved scope.
- `template/demonstrations/demo-behavior`: Preserve the existing demo-behavior contract in its approved scope.
- `template/assembly/project-assembly`: Preserve the existing project-assembly contract in its approved scope.
- `app/marketing/metadata/public-document-metadata`: Public title policy and authoritative body/metadata consistency extracted from document-metadata.
- `app/dashboard/navigation/route-enrichment`: Dashboard enrichment preserves shared canonical destination identities.

### Modified Capabilities
- `app/content/marketing-composition`: Retire this identity after requirement-conserving relocation or extraction.
- `app/content/media-delivery`: Retire this identity after requirement-conserving relocation or extraction.
- `app/content/source-resolution`: Retire this identity after requirement-conserving relocation or extraction.
- `app/data-lifecycle/action-behavior`: Retire this identity after requirement-conserving relocation or extraction.
- `app/data-lifecycle/form-behavior`: Retire this identity after requirement-conserving relocation or extraction.
- `app/data-lifecycle/loading-state-behavior`: Retire this identity after requirement-conserving relocation or extraction.
- `app/delivery/contact-delivery`: Retire this identity after requirement-conserving relocation or extraction.
- `app/delivery/submission-protection`: Retire this identity after requirement-conserving relocation or extraction.
- `app/domain/entity-presentation`: Retire this identity after requirement-conserving relocation or extraction.
- `app/experience/content-hierarchy`: Retire this identity after requirement-conserving relocation or extraction.
- `app/identity/access-and-membership`: Retire this identity after requirement-conserving relocation or extraction.
- `app/identity/private-file-access`: Retire this identity after requirement-conserving relocation or extraction.
- `app/integration/api-transport`: Retire this identity after requirement-conserving relocation or extraction.
- `app/interaction/keyboard-and-overlays`: Retire this identity after requirement-conserving relocation or extraction.
- `app/interaction/responsive-and-motion`: Retire this identity after requirement-conserving relocation or extraction.
- `app/navigation/document-metadata`: Retire this identity after requirement-conserving relocation or extraction.
- `app/navigation/route-identity`: Retire this identity after requirement-conserving relocation or extraction.
- `app/ui-system/component-contracts`: Retire this identity after requirement-conserving relocation or extraction.
- `template/demo-behavior`: Retire this identity after requirement-conserving relocation or extraction.
- `template/project-assembly`: Retire this identity after requirement-conserving relocation or extraction.

## Impact

Maintained spec identities, live instructions/procedures/operational plugin references, positive assembly manifests, generated guidance/configuration and focused verification tests. Runtime UI and business behavior do not change. Historical archives retain their original identities. Existing product requirements and product source are not invented or generated.
