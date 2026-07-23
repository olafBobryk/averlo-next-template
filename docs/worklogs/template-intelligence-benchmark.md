# Repo Intelligence Recording

## Purpose

Capture how Codex actually navigates this repository without asking the worker
to run or annotate a second recording command.

The recording system keeps three sources separate:

- Automatic Codex hook events are ignored local telemetry.
- The tracked run log contains 34 curated legacy observations with provenance.
- The example run log contains placeholder visual fixtures only.

None of these sources supports automatic correctness or strategy-ranking
claims.

## Automatic collection

Codex discovers the committed `.codex/hooks.json` in a trusted project. One
privacy-safe command hook handles `SessionStart`, `UserPromptSubmit`,
`PostToolUse`, `SubagentStart`, `SubagentStop`, and `Stop`.

The recorder appends schema-v1 `codex-hook-event` rows to:

```text
.template-intelligence/codex-turn-events.jsonl
```

The file is ignored by Git and written with owner-only permissions. A short
file lock prevents concurrent hooks from corrupting JSONL rows. Stable event
identifiers allow the reader to deduplicate retried turn, tool, and subagent
events.

The hook records only:

- session and turn identifiers;
- recording timestamps, model, permission mode, and lifecycle source;
- normalized local tool category and derived activity signals;
- repository-relative paths parsed from `apply_patch`;
- subagent identifier and type.

It never persists prompt text, shell commands, tool inputs or responses,
transcripts, assistant messages, environment values, or absolute paths. Errors
emit one payload-free diagnostic and exit successfully so recording cannot
block Codex.

Codex requires the exact project hook definition to be reviewed and trusted.
Use `/hooks` when a hook is awaiting review. Official behavior is documented
in the [Codex Hooks guide](https://learn.chatgpt.com/docs/hooks).

## Turn aggregation

Events are grouped by `sessionId` and `turnId`.

- A turn with both `UserPromptSubmit` and `Stop` is complete.
- A start without a stop remains open.
- A stop or tool event without a start remains partial.
- Tool and subagent counts cover supported local hook paths only. Hosted tools
  that bypass local hooks are not included.

Observed paths are derived without worker annotation:

- `Control`: no Template Intelligence, Serena, or Graphify signal.
- `TemplateMap`: Template Intelligence generation or query only.
- `TemplateSerena`: Template Intelligence plus Serena.
- `Graphify`: Graphify without another intelligence engine.
- `Serena-only`: Serena without Template Intelligence.
- `Mixed`: Graphify combined with Template Intelligence or Serena.

Direct search is retained as an activity signal but does not turn an otherwise
observed intelligence path into `Mixed`.

## Explicit maintainer utilities

`npm run intelligence:benchmark`, `npm run intelligence:hybrid`, and
`npm run intelligence:record` remain available for compatibility and
intentional experiments. They do not modify curated history by default.
Pass `--output <path>` when an explicit standalone schema-v3 record is
required.

Without `--output`, the surrounding trusted Codex turn is the recording source.
The standalone recorder defaults to the ignored local path
`.template-intelligence/explicit-benchmark-runs.jsonl`.

Clear ignored explicit records with:

```bash
npm run intelligence:record:clear -- --executed-runs --yes
```

This command never clears curated legacy history or automatic turn events.

## Historical cleanup

The tracked file
`docs/worklogs/template-intelligence-benchmark-runs.jsonl` contains exactly 34
legacy observations:

- 26 rows from the current template history, with the introducing commit
  recovered from Git blame;
- eight unique rows recovered from
  `c4f5771bcca9abc4daafb7d40eeb7b1c80226732`.

Each row preserves its original project, task identity, strategy, metrics, and
notes while adding `evidenceClass`, `evidenceQuality`, `sourceRepository`,
and `sourceCommit`.

Copied Inference rows are duplicates and are not added. The Inference Graphify
policy row is not an executed run. Averlo Rebrand example metrics remain visual
fixtures and are not benchmark history.

## Review surface

The local recording and curated history are available at:

```text
/internal/intelligence?view=benchmarks
```

Use `example=on` only for visual fixture review. The real view shows recent
automatic turns and a separate curated legacy count; it does not render
cross-strategy rankings.
