#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
	appendJsonLine,
	DEFAULT_SCROLL_PERFORMANCE_RECORD_PATH,
	parseScrollPerformanceCandidate,
} from "./lib/scroll-performance.mjs";

function parseArgs(argv) {
	const flags = new Set();
	const values = new Map();

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (!arg.startsWith("--")) continue;
		if (!arg.includes("=") && (argv[index + 1]?.startsWith("--") ?? true)) {
			flags.add(arg.slice(2));
			continue;
		}

		const [key, inlineValue] = arg.slice(2).split("=");
		const nextValue = inlineValue ?? argv[index + 1];

		if (inlineValue === undefined) index += 1;
		values.set(key, nextValue);
	}

	return { flags, values };
}

function readString(values, key) {
	const value = values.get(key);
	return typeof value === "string" && value.trim() ? value.trim() : null;
}

function printUsage() {
	console.log(`Usage: npm run record:scroll-performance -- \\
  --input tmp/scroll-performance.json

Optional:
  --output tmp/scroll-performance-runs.jsonl
  --notes "Short note override"
`);
}

const args = parseArgs(process.argv.slice(2));
if (args.flags.has("help")) {
	printUsage();
	process.exit(0);
}

const values = args.values;
const inputPath = readString(values, "input");
if (!inputPath) {
	printUsage();
	process.exit(1);
}

const absoluteInput = path.isAbsolute(inputPath)
	? inputPath
	: path.join(process.cwd(), inputPath);
const raw = await fs.readFile(absoluteInput, "utf8");
const candidate = parseScrollPerformanceCandidate(JSON.parse(raw));

const notesOverride = readString(values, "notes");
const outputPath =
	readString(values, "output") ?? DEFAULT_SCROLL_PERFORMANCE_RECORD_PATH;
const absoluteOutput = path.isAbsolute(outputPath)
	? outputPath
	: path.join(process.cwd(), outputPath);
const run = {
	...candidate,
	notes: notesOverride ?? candidate.notes,
	recordedAt: new Date().toISOString(),
	schemaVersion: 1,
};

await appendJsonLine(absoluteOutput, run);

console.log(
	`Recorded ${run.status} ${run.target_path} scroll result in ${path.relative(process.cwd(), absoluteOutput)}.`,
);
