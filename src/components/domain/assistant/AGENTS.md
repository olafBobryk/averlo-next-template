# Folder: `src/components/domain/assistant`

Assistant component ownership.

## Structure

- The top-level Assistant facade exports only complete consumer-facing
  compositions. Message roles, response rendering, tool dispatch, lifecycle
  frames and entity connectors are private implementation families.
- `ToolPresentationFrame` owns standalone entity tool presentations and is not
  exported from the top-level facade; chat output does not import entity identity
  cards.
- Tool dispatch stays exhaustive over `AssistantToolName`: add a typed branch for
  a real tool family; no renderer registry and no casting tool names or states
  into an entity contract. Never add a tool wrapper without a real tool contract
  and execution path.
