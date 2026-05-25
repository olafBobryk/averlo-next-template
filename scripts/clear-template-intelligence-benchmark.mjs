#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const RUNS_PATH = path.join(
	ROOT,
	"docs/worklogs/template-intelligence-benchmark-runs.jsonl",
);

if (!process.argv.slice(2).includes("--yes")) {
	console.error(
		"Refusing to clear the benchmark run log without --yes. Example: npm run intelligence:record:clear -- --yes",
	);
	process.exit(1);
}

await fs.mkdir(path.dirname(RUNS_PATH), { recursive: true });
await fs.writeFile(RUNS_PATH, "", "utf8");

console.log(`Cleared ${path.relative(ROOT, RUNS_PATH)}.`);
