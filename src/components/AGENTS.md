<INSTRUCTIONS>
## Component Ownership

- This tree owns reusable components and shared UI. Keep route-specific pieces
  with their route until they acquire an independent shared owner.
- OpenSpec owns cross-surface behavior; Storybook owns supported public APIs,
  variants and observable owner evidence; the nearest `AGENTS.md` owns topology.
  Start discovery and verification with [component contracts](../../docs/testing/component-contracts.md).
- Compose existing owners before adding a reusable component. Do not create a
  parallel control, overlay, feedback, layout, or component-family owner.
- Preserve public names during behavior-neutral moves. Treat a public rename as
  a separate migration with its affected contracts and verification.

## Discovery and extension boundary

- Read root and nearest ownership policy, then the relevant colocated Storybook
  contract and story. Use callable Storybook documentation when already available;
  do not install a service, guess an owner ID, or infer props from discovery alone.
  If unresolved, inspect catalogue candidates, the documented facade, then the
  minimum implementation source needed. Source exports and repository search
  route discovery; they do not establish public support.
- Inventory every interactive role before composing a form or settings surface:
  fields, uploads, disclosures, navigation and secondary actions. Native HTML is
  no exemption: `details`/`summary` must not duplicate the shared Accordion.
- Before adding a variant, compare the full supported contract, all current
  values and consumers for behavior, semantic purpose and complete visual
  signature. Reuse equivalent values; do not add product, section, route, brand
  or reference-specific aliases. A genuinely new value updates the contract,
  exhaustive teaching and consumers together. A requested global default belongs
  in the owner and its teaching, not compensating consumer styles.
- A wrapper must add distinct reusable behavior, not rename an owner or forward
  its API. Keep the smallest coherent stateful/browser boundary client-side and
  keep server-safe exports free of client-only dependency paths.
- Do not rebuild a complete owner from raw parts, expose private helpers, or add
  parallel component trees, overlays, registries or reference indexes. Report a
  missing boundary and obtain explicit extension authorization before adding it.
  Additive classes retain semantics, focus, slots and structural selectors;
  overriding owner geometry or styling indicates an API gap unless the user
  explicitly requests that departure.
- A public rename migrates consumers, profile inventories, catalogue contracts
  and verifiers together. Read only applicable family/child policies rather than
  loading unrelated component families.

## Directory Map

- `branding/`: brand identity.
- `composites/`: reusable compositions above primitives.
- `domain/`: reusable domain-level extensions for assembled projects.
- `mount/`: client-only application hosts.
- `ui/foundations/`: shared tokens and foundations.
- `ui/helpers/`: small component helpers.
- `ui/icons/`: icon rendering and registries.
- `ui/primitives/`: low-level reusable building blocks.
- `ui/input/`: complete form controls.
- `ui/misc/`: cross-cutting display and interaction helpers.
- `ui/motion/`: motion and scroll helpers.
- `ui/overlays/`: portal-backed overlays.
- `ui/time/`: date and relative-time presentation.
</INSTRUCTIONS>
