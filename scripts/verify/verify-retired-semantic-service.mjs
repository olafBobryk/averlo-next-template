#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const verifierPath = "scripts/verify/verify-retired-semantic-service.mjs";
const historicalRunsPath =
	"docs/benchmarks/history/template-intelligence-runs.jsonl";
const repositoryFootprintHistoryPath =
	"src/app/(site)/(marketing)/repository-footprint/_data/repository-footprint.json";
const retiredServiceName = "serena";
// Match service tokens, including connector names, rather than incidental
// substrings in third-party identifiers such as PDF.js Hebrew glyph names.
const retiredServiceToken = new RegExp(
	`(^|[^a-z0-9])${retiredServiceName}([^a-z0-9]|$)`,
	"i",
);

const output = execFileSync(
	"rg",
	[
		"--files",
		"--hidden",
		"--no-ignore",
		"--glob",
		"!.git/**",
		"--glob",
		"!**/node_modules/**",
		"--glob",
		"!**/.next*/**",
	],
	{ cwd: root, encoding: "utf8" },
);
const paths = output.split(/\r?\n/).filter(Boolean).sort();
const directories = execFileSync(
	"find",
	[
		".",
		"-type",
		"d",
		"-name",
		".git",
		"-prune",
		"-o",
		"-type",
		"d",
		"-name",
		"node_modules",
		"-prune",
		"-o",
		"-type",
		"d",
		"-name",
		".next*",
		"-prune",
		"-o",
		"-type",
		"d",
		"-print",
	],
	{ cwd: root, encoding: "utf8" },
)
	.split(/\r?\n/)
	.filter(Boolean)
	.map((entry) => entry.replace(/^\.\//, ""))
	.filter((entry) => entry !== ".")
	.sort();
const violations = [];

for (const directory of directories) {
	if (directory.toLowerCase().includes(retiredServiceName)) {
		violations.push(`directory: ${directory}`);
	}
}

for (const relativePath of paths) {
	const filePath = path.join(root, relativePath);
	const content = await fs.readFile(filePath, "utf8").catch(() => null);
	if (content === null) continue;

	if (
		relativePath !== verifierPath &&
		relativePath.toLowerCase().includes(retiredServiceName)
	) {
		violations.push(`path: ${relativePath}`);
	}

	if (
		relativePath === verifierPath ||
		relativePath === historicalRunsPath ||
		relativePath === repositoryFootprintHistoryPath
	) {
		continue;
	}

	if (retiredServiceToken.test(content)) {
		violations.push(`content: ${relativePath}`);
	}
}

if (violations.length > 0) {
	throw new Error(
		`Retired semantic-service references found outside historical benchmark runs:\n${violations.join("\n")}`,
	);
}

console.log(
	"Retired semantic-service verification passed: no live filenames or source references remain; historical benchmark runs are preserved.",
);
