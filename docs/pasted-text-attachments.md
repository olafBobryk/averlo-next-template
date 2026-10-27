# Long text in the assistant composer

Pasting at least 2,000 Unicode characters creates a UTF-8 text attachment through the existing file intake callback. Short text remains inline, clipboard files take priority, and disabled attachment controls leave text pasting intact. The existing draft stays unchanged. The attachment uses the normal file preview/removal rail; Restore into message returns its exact content without removing existing draft text. Failed or rejected file admission retains restoration, so pasted text is recoverable.

Examples: a short question remains inline; a 2,000-character client handoff becomes a previewable `Pasted text … .txt`; a 1,999-character Unicode passage stays inline. `src/components/domain/assistant/pasted-text.test.ts` covers the boundary and exact bytes. This is shared UI behavior, with no Bob-specific data, route, provider or storage dependency.
