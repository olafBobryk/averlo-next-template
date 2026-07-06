# Agent: <name>

Status: active | in_progress | paused | returned | accepted | planned | idle | retired

Guide: ../_guides/artifacts/agent.md

## Role

steward | worker | reviewer | observer

## Mode

subagent | visible-thread | steward | worker | reviewer

## Parent Agent

- Agent: `<agent-id>` | none

## Authority

writing | non-writing | review-only | unknown

## Intent

<What this agent exists to do in the orchestration graph.>

## Active Shape References

- `<shape-id>`: <why this agent is attached to the shape>

## Active Run References

- `<run-id>`: <what this agent is doing in the run>

## Current Position

- Node: `<node-id>` | none
- Marker: `<marker-id>` | none

## Runtime Identity

- Thread: <current thread id or link>
- Codex agent: <agent id, worker name, or none>
- Worktree: <path or none>
- Branch: <branch or none>
- HEAD: <commit or none>
- Preview: <url or none>

## Attention

State: info | attention | blocked | failed
Title: <short event title, or remove this section>
Body: <one or two sentence reason this agent needs attention>
Targets:
- Thread: `<thread id>`
- Run: `runs/<run>.md`
- Node: `<node-id>`
- Preview: `<url>`

## Evidence

- <thread id, worktree, local run/agent doc, commit, handoff, return note, screenshot, preview, or doc>
