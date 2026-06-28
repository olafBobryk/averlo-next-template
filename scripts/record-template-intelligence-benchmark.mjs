#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const VALID_STRATEGIES = new Set([
	"Hybrid",
	"TemplateIntelligence",
	"Serena",
	"Control",
]);
const RUNS_PATH = path.join(
	ROOT,
	"docs/worklogs/template-intelligence-benchmark-runs.jsonl",
);

function parseArgs(argv) {
	const values = new Map();

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (!arg.startsWith("--")) continue;

		const [key, inlineValue] = arg.slice(2).split("=");
		const nextValue = inlineValue ?? argv[index + 1];

		if (inlineValue === undefined) index += 1;
		values.set(key, nextValue);
	}

	return values;
}

function readString(values, key) {
	const value = values.get(key);
	return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readNumber(values, key, fallback = 0) {
	const value = values.get(key);
	if (value === undefined) return fallback;

	const parsed = Number(value);
	if (!Number.isFinite(parsed) || parsed < 0) {
		throw new Error(`--${key} must be a non-negative number.`);
	}

	return parsed;
}

function printUsage() {
	console.log(`Usage: npm run intelligence:record -- \\
  --task-id T1 \\
  --task-name "Route architecture" \\
  --strategy Hybrid \\
  --shell-commands 15 \\
  --semantic-calls 0 \\
  --correctness 3

Optional:
  --date YYYY-MM-DD
  --elapsed-seconds 120
  --wrong-turns 1
  --generated-artifact-mistakes 0
  --notes "Short note"
`);
}

const values = parseArgs(process.argv.slice(2));
const taskId = readString(values, "task-id");
const taskName = readString(values, "task-name");
const strategy = readString(values, "strategy");

if (!taskId || !taskName || !strategy) {
	printUsage();
	process.exit(1);
}

const shellCommands = readNumber(values, "shell-commands");
const semanticCalls = readNumber(values, "semantic-calls");
const correctness = readNumber(values, "correctness");

if (!VALID_STRATEGIES.has(strategy)) {
	throw new Error(
		`--strategy must be one of: ${Array.from(VALID_STRATEGIES).join(", ")}.`,
	);
}

if (strategy === "Hybrid" && semanticCalls === 0) {
	throw new Error(
		"--strategy Hybrid requires --semantic-calls greater than 0. Use --strategy TemplateIntelligence for task-map-only runs.",
	);
}

if (correctness > 3) {
	throw new Error("--correctness must be between 0 and 3.");
}

const run = {
	schemaVersion: 1,
	date: readString(values, "date") ?? new Date().toISOString().slice(0, 10),
	project: "averlo-next-template",
	taskId,
	taskName,
	strategy,
	shellCommands,
	semanticCalls,
	lookupActions: readNumber(
		values,
		"lookup-actions",
		shellCommands + semanticCalls,
	),
	correctness,
};

const elapsedSeconds = readNumber(values, "elapsed-seconds", -1);
if (elapsedSeconds >= 0) run.elapsedSeconds = elapsedSeconds;

const wrongTurns = readNumber(values, "wrong-turns", -1);
if (wrongTurns >= 0) run.wrongTurns = wrongTurns;

const generatedArtifactMistakes = readNumber(
	values,
	"generated-artifact-mistakes",
	-1,
);
if (generatedArtifactMistakes >= 0) {
	run.generatedArtifactMistakes = generatedArtifactMistakes;
}

const notes = readString(values, "notes");
if (notes) run.notes = notes;

await fs.mkdir(path.dirname(RUNS_PATH), { recursive: true });
await fs.appendFile(RUNS_PATH, `${JSON.stringify(run)}\n`, "utf8");

console.log(
	`Recorded ${run.strategy} ${run.taskId} in ${path.relative(ROOT, RUNS_PATH)}.`,
);
