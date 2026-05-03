# Agent Instructions

## Dev Server Isolation

- If available, use `$agent-dev-workflow` before starting dev servers, opening localhost, or running browser/Playwright verification.
- Do not run `next dev` or `npx next dev` directly in this repository.
- Use `npm run dev:agent` when browser testing as an agent.
- For Playwright, screenshots, or automated traversal, open the printed automation URL with `?motion=off&reveal=off`.
- Do not stop, kill, or reuse the user's `3000` dev server unless explicitly asked.
- `npm run dev` and `npm run dev:user` are reserved for the user's server. They try `http://localhost:3000` first, then fall forward through `3001-3010` before failing.
- Agent dev servers must use the isolated port and build directory chosen by `npm run dev:agent`.
- Do not edit generated `tsconfig.next-*.json` files; the dev server wrapper owns them.
