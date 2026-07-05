#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const STRATEGY_ALIASES = new Map([["Hybrid", "TemplateSerena"]]);
const VALID_STRATEGIES = new Set(["Control", "TemplateSerena", "Graphify"]);
const VALID_BENCHMARK_MODES = new Set([
	"live-passive",
	"shadow-replay",
	"triple-run",
]);
const VALID_RESOLUTIONS = new Set(["promote", "hold", "inconclusive"]);
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
		const currentValue = values.get(key);
		if (currentValue === undefined) {
			values.set(key, nextValue);
		} else if (Array.isArray(currentValue)) {
			currentValue.push(nextValue);
		} else {
			values.set(key, [currentValue, nextValue]);
		}
	}

	return values;
}

function readString(values, key) {
	const value = values.get(key);
	if (Array.isArray(value)) {
		const lastValue = value.at(-1);
		return typeof lastValue === "string" && lastValue.trim()
			? lastValue.trim()
			: null;
	}
	return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readStringList(values, key) {
	const value = values.get(key);
	if (value === undefined) return [];

	const valuesToRead = Array.isArray(value) ? value : [value];
	return valuesToRead
		.flatMap((entry) => String(entry).split(","))
		.map((entry) => entry.trim())
		.filter(Boolean);
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
  --strategy TemplateSerena \\
  --shell-commands 15 \\
  --semantic-calls 2 \\
  --correctness 3

Optional:
  --date YYYY-MM-DD
  --benchmark-mode live-passive
  --task-class implementation
  --resolution inconclusive
  --output tmp/intelligence-benchmark-smoke.jsonl
  --elapsed-seconds 120
  --setup-seconds 0
  --build-seconds 0
  --query-seconds 0
  --output-bytes 0
  --suggested-files "src/app/page.tsx,src/config/routes.ts"
  --actual-files src/app/page.tsx
  --wrong-turns 1
  --generated-artifact-mistakes 0
  --notes "Short note"
`);
}

const values = parseArgs(process.argv.slice(2));
const taskId = readString(values, "task-id");
const taskName = readString(values, "task-name");
const inputStrategy = readString(values, "strategy");
const strategy = STRATEGY_ALIASES.get(inputStrategy) ?? inputStrategy;

if (!taskId || !taskName || !inputStrategy) {
	printUsage();
	process.exit(1);
}

const shellCommands = readNumber(values, "shell-commands");
const semanticCalls = readNumber(values, "semantic-calls");
const correctness = readNumber(values, "correctness");
const benchmarkMode = readString(values, "benchmark-mode") ?? "live-passive";
const resolution = readString(values, "resolution") ?? "inconclusive";
const outputPath = readString(values, "output");

if (!VALID_STRATEGIES.has(strategy)) {
	throw new Error(
		`--strategy must be one of: ${Array.from(VALID_STRATEGIES).join(", ")}. Legacy --strategy Hybrid is accepted as TemplateSerena.`,
	);
}

if (strategy === "TemplateSerena" && semanticCalls === 0) {
	throw new Error(
		"--strategy TemplateSerena requires --semantic-calls greater than 0. Use --strategy Control for no-intelligence baselines.",
	);
}

if (!VALID_BENCHMARK_MODES.has(benchmarkMode)) {
	throw new Error(
		`--benchmark-mode must be one of: ${Array.from(VALID_BENCHMARK_MODES).join(", ")}.`,
	);
}

if (!VALID_RESOLUTIONS.has(resolution)) {
	throw new Error(
		`--resolution must be one of: ${Array.from(VALID_RESOLUTIONS).join(", ")}.`,
	);
}

if (correctness > 3) {
	throw new Error("--correctness must be between 0 and 3.");
}

const run = {
	schemaVersion: 2,
	date: readString(values, "date") ?? new Date().toISOString().slice(0, 10),
	project: "averlo-next-template",
	taskId,
	taskName,
	strategy,
	benchmarkMode,
	shellCommands,
	semanticCalls,
	lookupActions: readNumber(
		values,
		"lookup-actions",
		shellCommands + semanticCalls,
	),
	correctness,
	resolution,
};

if (inputStrategy !== strategy) run.legacyStrategy = inputStrategy;

const stringFields = [
	"run-group-id",
	"task-class",
	"before-commit",
	"after-commit",
];
for (const field of stringFields) {
	const value = readString(values, field);
	if (!value) continue;

	const camelCaseField = field.replace(/-([a-z])/g, (_, letter) =>
		letter.toUpperCase(),
	);
	run[camelCaseField] = value;
}

const optionalNumberFields = [
	"setup-seconds",
	"build-seconds",
	"query-seconds",
	"output-bytes",
	"graph-nodes",
	"graph-edges",
	"graph-queries",
];
for (const field of optionalNumberFields) {
	const value = readNumber(values, field, -1);
	if (value < 0) continue;

	const camelCaseField = field.replace(/-([a-z])/g, (_, letter) =>
		letter.toUpperCase(),
	);
	run[camelCaseField] = value;
}

const listFields = [
	"suggested-files",
	"actual-files",
	"missed-files",
	"unnecessary-files",
	"fallbacks-used",
];
for (const field of listFields) {
	const list = readStringList(values, field);
	if (list.length === 0) continue;

	const camelCaseField = field.replace(/-([a-z])/g, (_, letter) =>
		letter.toUpperCase(),
	);
	run[camelCaseField] = list;
}

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

const runsPath = outputPath ? path.resolve(ROOT, outputPath) : RUNS_PATH;

await fs.mkdir(path.dirname(runsPath), { recursive: true });
await fs.appendFile(runsPath, `${JSON.stringify(run)}\n`, "utf8");

console.log(
	`Recorded ${run.strategy} ${run.taskId} in ${path.relative(ROOT, runsPath)}.`,
);
