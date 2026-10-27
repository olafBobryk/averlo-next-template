# Averlo Next Template

## Purpose

Averlo is a reusable Next.js App Router foundation for materializing independent
product projects from explicit route profiles and content modes. It provides a
coherent starting architecture without turning the generated project into a
copy of the template repository.

## Intended users

Averlo is for product teams and developers who want an established application
shell, design system, marketing contract, authentication boundary, and dashboard
reference while retaining ownership of their product's domain and experience.

## Product boundaries

- The canonical template stays product-neutral. Its dashboard and fixtures
  demonstrate reusable application patterns rather than a specific business.
- Generated projects are independent, one-way starting points. Their product
  purpose, users, outcomes, and requirements belong in their own `PRODUCT.md`.
- Profiles positively select the surfaces and content infrastructure included in
  a project; omitted template machinery and surfaces are not latent features.
- Frontend marketing contracts remain source-neutral so projects can change
  content providers without replacing their rendering architecture.

`README.md` owns setup and repository orientation. OpenSpec owns maintained
behavior contracts; nearest `AGENTS.md` owns structural policy, Storybook owns
component APIs, and canonical procedures and verification commands own execution.
The optional Averlo plugin supplies explicitly selected operational workflows.

Application contracts under `openspec/specs/app/` describe reusable behavior.
Its shared frontend, service and complete data-lifecycle contracts support
surface-specific marketing and dashboard policy. Template contracts under
`openspec/specs/template/` own canonical assembly and demonstration obligations.
Both apply here; independent projects inherit only explicitly selected app
contracts as their own copies. Demo no-delivery, reset and non-durability rules
describe examples, not a prohibition on authorized providers or persistence.

The `product/` root is reserved for an independent project's actual business
requirements. Create those contracts only when real product requirements exist,
not as generated placeholders. Business rules refine compatible shared contracts;
a conflict requires an explicit specification change rather than a silent
override. Discover capabilities with `openspec list --specs`, then use
`openspec show <capability-id> --type spec` for the changed surface, relevant
shared dependencies and existing product contracts. Template contracts apply only
to actual canonical work; sibling folders do not imply additional scope.
