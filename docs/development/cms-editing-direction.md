# Client editing: future direction

Status: parked (2026-11-09). Payload stays until it hurts; nothing here is
built or scheduled.

## Goal

A client edits their site from the page itself, with an agent that has the
page as context and full control over the content. Build none of it: use
existing software.

## Options

| Option | What it gives | Cost |
|---|---|---|
| Vercel Edit Mode (Content Link) | Click text on a preview deployment and the matching CMS field opens. Runs in the Vercel Toolbar or its browser extension. Payload is already supported. | Config only. Plan tier unclear: Vercel says Pro and Enterprise, Payload says Enterprise. |
| Sanity | Click-to-edit through the Presentation tool, an AI Content Agent that edits content, and an MCP server for our own agents. | A migration off Payload to a hosted CMS. |
| Builder.io | A visual editor with AI that edits pages directly. | Pages live in Builder, not in the repo, which is the opposite of Averlo. |
| Claude in Chrome on the Payload admin | Works today with nothing to build. | No guardrails, so not for clients. |

## Recommendation

1. Now: keep Payload and turn on Vercel Edit Mode for click-to-edit.
2. When Payload no longer fits: move to Sanity for the click-to-edit view, the Content Agent and the MCP server. Content stays structured, and the code stays in the repo.

Check current plans and pricing first; the AI details come from vendor pages
and third-party write-ups.

## Sources

- https://vercel.com/docs/edit-mode
- https://payloadcms.com/docs/integrations/vercel-visual-editing
- https://www.sanity.io/docs/visual-editing
- https://www.sanity.io/blog/introducing-presentation
- https://www.builder.io/c/docs/visual-editor-ai
