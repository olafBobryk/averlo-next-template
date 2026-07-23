#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { getLocalBenchmarkRunsPath } from "./lib/template-intelligence-benchmark.mjs";

const ROOT = process.cwd();
const RUNS_PATH = getLocalBenchmarkRunsPath(ROOT);
const args = new Set(process.argv.slice(2));

if (!args.has("--yes") || !args.has("--executed-runs")) {
	console.error(
		"Refusing to clear local explicit benchmark data. Use: npm run intelligence:record:clear -- --executed-runs --yes",
	);
	process.exit(1);
}

const raw = await fs.readFile(RUNS_PATH, "utf8").catch(() => "");
const preserved = [];
let removedCount = 0;

for (const line of raw.split(/\r?\n/)) {
	if (!line.trim()) continue;
	try {
		const record = JSON.parse(line);
		if (record.schemaVersion === 3 && record.recordKind === "executed-run") {
			removedCount += 1;
			continue;
		}
	} catch {
		// Preserve malformed or unknown history instead of deleting it implicitly.
	}
	preserved.push(line);
}

await fs.mkdir(path.dirname(RUNS_PATH), { recursive: true });
await fs.writeFile(
	RUNS_PATH,
	preserved.length > 0 ? `${preserved.join("\n")}\n` : "",
	"utf8",
);

console.log(
	`Removed ${removedCount} explicit run${removedCount === 1 ? "" : "s"} from ${path.relative(ROOT, RUNS_PATH)} and preserved ${preserved.length} unknown record${preserved.length === 1 ? "" : "s"}.`,
);
