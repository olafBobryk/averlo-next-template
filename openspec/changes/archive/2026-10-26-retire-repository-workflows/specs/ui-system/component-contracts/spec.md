# Component contracts delta

## Purpose

Make supported shared UI behavior discoverable and faithful across runtime consumers, Storybook teaching and public catalogue/export projections.

## ADDED Requirements

### Requirement: Discoverable supported owner contract
Shared UI SHALL expose an intentional supported contract through its documented public owner and Storybook evidence. Source exports alone SHALL NOT imply public support. Consumers SHALL use the highest complete applicable owner without bypassing its semantics or focus behavior through styling.

#### Scenario: Choose a shared control
- **WHEN** a consumer needs behavior already covered by a complete supported owner
- **THEN** it uses that owner and its documented API rather than reconstructing the behavior from lower-level parts

### Requirement: Complete and neutral variant teaching
Public teaching SHALL cover each supported variant axis and meaningful interaction state with neutral reusable guidance. Adding or moving a public owner SHALL preserve useful existing teaching and migrate its consumers. Context-specific aliases SHALL NOT substitute for a genuinely reusable distinction.

#### Scenario: Add a supported owner variant
- **WHEN** an owner gains a public variant
- **THEN** its contract and teaching expose the complete supported choice and affected consumers remain consistent

### Requirement: Faithful public projections
Stories, catalogues and export previews SHALL project the same supported implementation and contract. Runtime code SHALL NOT depend on story or catalogue modules. Preview-specific shells and portals SHALL remain isolated, and deliberate reduced-profile omissions SHALL be represented accurately.

#### Scenario: Export a reduced-profile owner
- **WHEN** a generated profile supports fewer owner features
- **THEN** its catalogue and export teaching match those features without presenting unavailable variants

### Requirement: Native semantics remain mounted
Input and composite owners SHALL retain the real native or documented interaction owner responsible for value, keyboard, form and accessibility behavior. Decorative wrappers and specialized rendering SHALL NOT replace that owner with an inert imitation.

#### Scenario: Custom visual input presentation
- **WHEN** an input adds specialized visual presentation
- **THEN** the mounted interaction owner still supplies its supported value, keyboard, form and accessibility behavior

### Requirement: Stable public identity
Owner moves SHALL preserve public names unless an explicit migration changes them. A wrapper SHALL add distinct reusable behavior rather than rename an existing owner. Shared contract changes SHALL update teaching and consumers together.

#### Scenario: Move a shared component
- **WHEN** a supported owner changes source location without an API migration
- **THEN** consumers retain its public identity and teaching still resolves to the same supported behavior
