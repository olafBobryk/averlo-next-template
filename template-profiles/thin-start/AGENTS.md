# Thin-start profile ownership

- `manifest.mjs` is authoritative for content modes, selected surfaces, scripts,
  packages, source inventory, overrides, API review and verification.
- Shared files come from canonical source. Genuine thin-only code lives in
  `overrides/`; never duplicate shared implementation into an override.
- The source inventory (`template-assembly/thin-start-src-files.json`) is
  positive and fail-closed; add a path, including a local `AGENTS.md`, only when
  the profile owns the code it governs.
- After changing the profile boundary, verify both content modes with
  `npm run verify:profiles` and `npm run review:thin-start-api -- --strict`.
