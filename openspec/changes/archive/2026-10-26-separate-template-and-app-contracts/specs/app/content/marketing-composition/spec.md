## Purpose

Render public pages as ordered semantic content within a shared shell and retain stable boundaries for source-backed review and maintenance.

## ADDED Requirements

### Requirement: Ordered semantic page content
Registered public content pages SHALL render their normalized ordered sections through the marketing content contract. Sections SHALL represent independently meaningful semantic regions with source-neutral authored fields rather than opaque whole-page payloads. Explicit utility-page exceptions SHALL remain bounded to their purpose.

#### Scenario: Render a multi-section public page
- **WHEN** an installed public content page is requested
- **THEN** its registered ordered sections render through their corresponding owners and visible authored copy comes from the page data

### Requirement: Shared shell and navigation
Header, menus and footer SHALL remain shared shell responsibilities using the same resolved layout data across desktop and compact presentations. Shell navigation SHALL distinguish registered internal destinations from external links and supported fragments.

#### Scenario: Compact shell navigation
- **WHEN** a public page changes to a compact viewport
- **THEN** its shared shell preserves the same destination meaning and layout data without becoming a page-specific duplicate

### Requirement: Stable semantic review boundaries
Independently reviewed composition regions SHALL retain stable semantic identities and review selectors. Content, shell and explicitly excluded regions SHALL have distinct comparison boundaries; exclusions SHALL NOT remove required production shell content.

#### Scenario: Review content with an excluded approved header
- **WHEN** a source-backed content comparison excludes an already approved shared header
- **THEN** content is compared within its declared boundary and the production header remains present and unchanged by that exclusion

### Requirement: Source fidelity and later reuse are distinct decisions
Source-backed composition SHALL preserve approved hierarchy, assets, content boundaries and independent cases. Combining cases or changing shared owners for later reuse SHALL require the applicable explicit systemization decision rather than being treated as a prerequisite for source fidelity.

#### Scenario: Similar independent source cases
- **WHEN** two independent approved source cases resemble one another
- **THEN** their distinct review boundaries remain until an explicit shared-owner decision authorizes consolidation
