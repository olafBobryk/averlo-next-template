# Scroll Performance Benchmark

## Purpose

Track deterministic scroll-performance measurements on the dedicated internal
review surface without conflating benchmark history with public-page behavior.
Live measurement output belongs in local runtime files; the committed example
log remains schema reference only.

## Route

```text
/internal/scroll-performance?scenario=default
```

Available generic scenarios:

- `control`
- `default`
- `stress`

## Commands

Run a fast single measurement:

```bash
npm run build
npm run measure:scroll-performance -- --scenario default --output tmp/scroll-performance.json
```

Record the aggregate result:

```bash
npm run record:scroll-performance -- --input tmp/scroll-performance.json
```

Default local output:

```text
tmp/scroll-performance-runs.jsonl
```

Run a confirm pass:

```bash
npm run measure:scroll-performance -- --scenario default --runs 3 --output tmp/scroll-performance-confirm.json
```

Create a disposable autoresearch worktree:

```bash
npm run setup:scroll-performance-autoresearch -- --tag trial-01
```

Score the accepted baseline or one committed candidate inside the worktree:

```bash
npm run score:scroll-performance -- --tag trial-01
```

## Result Schema

Each recorded aggregate run stores:

- `p95_frame_ms`
- `p99_frame_ms`
- `frames_over_16_7ms`
- `frames_over_33ms`
- `long_task_ms`
- `script_ms`
- `layout_ms`
- `paint_ms`
- `scenario`
- `viewport`
- `commit`
- `status`
- `notes`

## V1 Keep Rule

- Fast pass: one run.
- Confirm pass: three runs.
- A kept result must improve at least one primary metric:
  - `p95_frame_ms`, or
  - `frames_over_33ms`
- If `p95_frame_ms` is the improved primary metric, `frames_over_33ms` must not
  regress by more than `1.0` averaged frame.
- If `frames_over_33ms` is the improved primary metric, `p95_frame_ms` must not
  regress by more than `0.5ms`.
- If both primary metrics improve, the result is eligible to keep without using
  the cross-metric tolerance.

## Prune Ownership

`npm run prune:template -- --no-scroll-performance` removes the internal route,
measurement scripts, benchmark docs, package scripts, and Playwright dependency.
The surface is separate from `--no-demo` so project instances can keep component
demos while dropping benchmark/autoresearch tooling.

Thin-start does not include this route by default. If a thin-start instance needs
scroll-performance tooling, add it intentionally after activation.

## Notes

- Scoring uses a production-like local build with `TEMPLATE_INTERNAL_ROUTES=1`.
- The benchmark surface is review infrastructure only; it does not authorize
  Home changes by itself.
- Manual visual QA may still use `?motion=off&reveal=off`, but the score runner
  measures without those overrides.
- Disposable loop runs keep `results.jsonl`, `latest-measurement.json`,
  `state.json`, and optional `run.log` under
  `tmp/scroll-performance-autoresearch/<tag>/`.
- The score loop resets discarded candidate commits in its disposable
  autoresearch worktree back to the accepted baseline. Do not run candidate
  scoring from a worktree that contains uncommitted or unrelated work.
