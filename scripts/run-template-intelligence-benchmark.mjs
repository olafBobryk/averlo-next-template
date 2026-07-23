#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import {
	appendExecutedBenchmarkRun,
	createExecutedBenchmarkRun,
	normalizeBenchmarkStrategy,
	VALID_STRATEGIES,
} from "./lib/template-intelligence-benchmark.mjs";

const ROOT = process.cwd();

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
	return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readNumber(values, key) {
	const value = readString(values, key);
	if (value === undefined) return undefined;
	const parsed = Number(value);
	if (!Number.isFinite(parsed) || parsed < 0) {
		throw new Error(`--${key} must be a non-negative number.`);
	}
	return parsed;
}

function readList(values, key) {
	const value = readString(values, key);
	if (!value) return [];
	return value
		.split(",")
		.map((entry) => entry.trim())
		.filter(Boolean);
}

function printUsage() {
	console.log(`Usage: npm run intelligence:benchmark -- \\
  --strategy Control|TemplateMap|TemplateSerena|Graphify \\
  --task-id T1 \\
  --task-name "Route architecture" \\
  --query "route architecture"

TemplateMap also requires --topics. TemplateSerena accepts the same --topics,
--serena-file, and --serena-symbol inputs as intelligence:hybrid. Graphify uses
--query for its graph query. Trusted Codex hooks record the surrounding turn.
Pass --output only for an intentional standalone executed-run record.

Optional:
  --scenario-id route-architecture
  --run-group-id route-bakeoff
  --benchmark-mode live-passive
  --task-class orientation
  --output tmp/intelligence-benchmark-smoke.jsonl
  --correctness 3
  --wrong-turns 0
  --notes "Optional post-hoc annotation"
`);
}

function run(command, args) {
	const startedAt = performance.now();
	const result = spawnSync(command, args, {
		cwd: ROOT,
		encoding: "utf8",
		stdio: ["ignore", "pipe", "pipe"],
		maxBuffer: 16 * 1024 * 1024,
	});
	const elapsedSeconds = (performance.now() - startedAt) / 1000;
	const output = [result.stdout, result.stderr].filter(Boolean).join("\n");
	if (output.trim())
		process.stdout.write(output.endsWith("\n") ? output : `${output}\n`);
	if (result.status !== 0) {
		throw new Error(
			`${command} ${args.join(" ")} failed with status ${result.status}.`,
		);
	}
	return { elapsedSeconds, output };
}

function extractSuggestedFiles(output) {
	const matches = output.matchAll(
		/(?:^|[\s"'`])((?:[\w@.-]+\/)+[\w@().[\]-]+\.[a-z0-9]+)(?=$|[\s:"'`,)\]])/gim,
	);
	return [...new Set([...matches].map((match) => match[1]))].slice(0, 100);
}

function stripStrategyArgs(argv) {
	const forwarded = [];
	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (arg === "--strategy") {
			index += 1;
			continue;
		}
		if (arg.startsWith("--strategy=")) continue;
		if (arg === "--query") {
			index += 1;
			continue;
		}
		if (arg.startsWith("--query=")) continue;
		forwarded.push(arg);
	}
	return forwarded;
}

const argv = process.argv.slice(2);
const values = parseArgs(argv);
const strategy = normalizeBenchmarkStrategy(readString(values, "strategy"));
const taskId = readString(values, "task-id");
const taskName = readString(values, "task-name");

if (!strategy || !VALID_STRATEGIES.has(strategy) || !taskId || !taskName) {
	printUsage();
	process.exit(1);
}

if (strategy === "TemplateSerena") {
	const result = spawnSync(
		process.execPath,
		[
			"scripts/run-template-intelligence-hybrid.mjs",
			...stripStrategyArgs(argv),
		],
		{ cwd: ROOT, stdio: "inherit" },
	);
	process.exit(result.status ?? 1);
}

const query = readString(values, "query");
const topics = readList(values, "topics");
const common = {
	taskId,
	taskName,
	strategy,
	benchmarkMode: readString(values, "benchmark-mode") ?? "live-passive",
	measurementSource: "command",
	sourceCommand: "intelligence:benchmark",
	scenarioId: readString(values, "scenario-id"),
	runGroupId: readString(values, "run-group-id"),
	taskClass: readString(values, "task-class"),
	date: readString(values, "date"),
	correctness: readNumber(values, "correctness"),
	wrongTurns: readNumber(values, "wrong-turns"),
	generatedArtifactMistakes: readNumber(values, "generated-artifact-mistakes"),
	resolution: readString(values, "resolution"),
	notes: readString(values, "notes"),
};

let measurement;

if (strategy === "Control") {
	if (!query) throw new Error("Control requires --query.");
	const terms = query.split(/\s+/).filter(Boolean);
	const args = [
		"-l",
		"-i",
		"--hidden",
		"--glob",
		"!.git/**",
		"--glob",
		"!.next*/**",
		"--glob",
		"!node_modules/**",
		"--glob",
		"!.template-intelligence/**",
		...terms.flatMap((term) => ["-e", term]),
		".",
	];
	const result = run("rg", args);
	measurement = {
		...common,
		shellCommands: 1,
		semanticCalls: 0,
		outputBytes: Buffer.byteLength(result.output),
		querySeconds: result.elapsedSeconds,
		elapsedSeconds: result.elapsedSeconds,
		suggestedFiles: result.output
			.split(/\r?\n/)
			.map((entry) => entry.replace(/^\.\//, "").trim())
			.filter(Boolean)
			.slice(0, 100),
	};
} else if (strategy === "TemplateMap") {
	if (topics.length === 0) throw new Error("TemplateMap requires --topics.");
	const startedAt = performance.now();
	const generate = run("npm", ["run", "intelligence:generate"]);
	const queryResults = topics.map((topic) =>
		run("npm", ["run", "intelligence:query", "--", topic]),
	);
	const output = [
		generate.output,
		...queryResults.map((result) => result.output),
	].join("\n");
	measurement = {
		...common,
		shellCommands: 1 + topics.length,
		semanticCalls: 0,
		outputBytes: Buffer.byteLength(output),
		querySeconds: queryResults.reduce(
			(total, result) => total + result.elapsedSeconds,
			0,
		),
		elapsedSeconds: (performance.now() - startedAt) / 1000,
		suggestedFiles: extractSuggestedFiles(output),
	};
} else {
	if (!query) throw new Error("Graphify requires --query.");
	const startedAt = performance.now();
	const build = run("uvx", [
		"--from",
		"graphifyy",
		"graphify",
		".",
		"--no-viz",
	]);
	const graphQuery = run("uvx", [
		"--from",
		"graphifyy",
		"graphify",
		"query",
		query,
	]);
	measurement = {
		...common,
		shellCommands: 2,
		semanticCalls: 0,
		graphQueries: 1,
		buildSeconds: build.elapsedSeconds,
		querySeconds: graphQuery.elapsedSeconds,
		outputBytes: Buffer.byteLength(graphQuery.output),
		elapsedSeconds: (performance.now() - startedAt) / 1000,
		suggestedFiles: extractSuggestedFiles(graphQuery.output),
	};
}

const benchmarkRun = createExecutedBenchmarkRun(measurement);
const outputPath = readString(values, "output");
if (outputPath) {
	const result = await appendExecutedBenchmarkRun(benchmarkRun, {
		root: ROOT,
		outputPath,
	});
	console.log(
		`${result.status === "duplicate" ? "Already recorded" : "Recorded"} ${benchmarkRun.strategy} ${benchmarkRun.taskId} in ${path.relative(ROOT, result.path)} (${benchmarkRun.runId}).`,
	);
} else {
	console.log(
		`Completed ${benchmarkRun.strategy} ${benchmarkRun.taskId}. No explicit run file was written; trusted Codex hooks record the surrounding turn automatically. Pass --output for an intentional standalone record.`,
	);
}
