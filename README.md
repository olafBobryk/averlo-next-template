# Webvizion Website Template

This repository is the base template for building Webvizion websites.

It provides:
- a Next.js app-router foundation
- a shared component library under `src/components`
- a centralized demo/catalog system under `src/app/demo`
- reusable UI, motion, overlay, and feedback patterns for Webvizion site builds

## What This Project Is For

Use this template when starting or extending a Webvizion website.

It is intended to give Webvizion projects:
- a consistent component and layout system
- reusable interaction patterns instead of page-local UI
- a demo environment for documenting and testing components
- a shared baseline for future site work

## Getting Started

Run the development server:

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Key Areas

- `src/app`: application routes, layouts, and pages
- `src/app/demo`: internal component demo and documentation system
- `src/components`: shared Webvizion UI library
- `src/lib`: reusable non-UI utilities such as API, feedback, and mocks

## Demo System

The component demo system lives under `src/app/demo`.

It is useful for:
- browsing available UI primitives and higher-level components
- validating interaction states and variants
- documenting reusable patterns for future Webvizion websites

Most demo content is centralized in `src/app/demo/content.tsx`.

## Development Notes

- Prefer extending the shared component system instead of building page-local one-off UI.
- Check the nearest `AGENTS.md` file before adding new reusable features.
- Keep demos and documentation updated when shared components change.

## Deployment

This project is designed to be deployed as a Webvizion website, typically on Vercel.
