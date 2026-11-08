# Folder: `src/components/branding`

This folder owns the product mark and wordmark implementation.

## Structure

- `Logo` is the single owner of brand SVG geometry, wordmark styling, sizing and
  tone variants; consumers do not branch them. Extend `Logo` for a reusable brand
  variant instead of adding a second logo implementation or duplicating assets.
- `Logo` owns its semantic rendering and interaction state; do not wrap it in
  another interactive element.
