# Testing workbench

`/internal/testing` is an instance-local, development-only workbench for validating a task in the real application shell.

- One temporary child route per focused change at `/internal/testing/<kebab-case-change>/`; delete it once the accepted implementation no longer needs it.
- Compose `InternalPage` and existing owners; no product navigation, catalogue contracts, shared APIs or generic component demos here.
- Data stays local and non-persistent. The proxy owns the production 404; never make a testing route reachable in production or link it from product content.
