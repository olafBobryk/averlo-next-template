# Product specs

Empty in the template. A generated project writes its real business
requirements here; the template never invents product specs.

- `domain/<entity>/`: business entities and their rules.
- `marketing/pages/<route>/`: one public page each, from the page-spec template.
- `dashboard/<area>/`: one dashboard area or page each, from the page-spec template.
- `integrations/<provider>/`: one external provider each.

Product specs refine the platform specs they build on. A product rule that
conflicts with a platform spec needs an explicit amendment to that spec.
