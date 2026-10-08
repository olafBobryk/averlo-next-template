# Assistant component ownership

- Keep the top-level Assistant facade limited to complete consumer-facing
  compositions. Message roles, response rendering, tool dispatch, lifecycle
  frames, and entity connectors remain private implementation families.
- Chat tool calls use compact per-call disclosures with arguments and actual output.
  Actionable approvals belong in the decision area above the composer.
- `ToolPresentationFrame` remains the owner for standalone entity tool presentations;
  do not import entity identity cards into chat output. Never add a tool wrapper
  without a real tool contract and execution path.
- Keep tool dispatch exhaustive over `AssistantToolName`. Add a typed branch
  when a real tool family is introduced; do not add a renderer registry or cast
  tool names and states into an entity contract.
- Do not export `ToolPresentationFrame` from the top-level Assistant facade.
