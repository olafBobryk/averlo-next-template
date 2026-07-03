#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ORCHESTRATION_ROOT_RELATIVE = "docs/orchestration";
const TOOL_RELATIVE = "docs/orchestration/_tools/orchestration.mjs";
const cwd = process.env.INIT_CWD
	? path.resolve(process.env.INIT_CWD)
	: process.cwd();
const shimProductRoot = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);
const candidates = candidateProductRoots(cwd, shimProductRoot);
const productRoot = candidates.find((candidate) =>
	existsSync(path.join(candidate, TOOL_RELATIVE)),
);

if (!productRoot) {
	console.error(
		"No docked orchestration CLI found in this checkout or sibling Git worktrees.",
	);
	console.error(
		"Run update:orchestration-cli from the dashboard repo against the product main checkout.",
	);
	process.exit(1);
}

const tool = path.join(productRoot, TOOL_RELATIVE);
const orchestrationRoot = path.join(productRoot, ORCHESTRATION_ROOT_RELATIVE);
const result = spawnSync(process.execPath, [tool, ...process.argv.slice(2)], {
	cwd,
	env: {
		...process.env,
		ORCHESTRATION_ROOT: orchestrationRoot,
	},
	stdio: "inherit",
});

process.exit(result.status ?? 1);

function candidateProductRoots(startCwd, fallbackRoot) {
	const roots = [];
	addRoot(roots, gitOutput(startCwd, ["rev-parse", "--show-toplevel"]));
	addRoot(roots, fallbackRoot);

	const currentRoot = roots[0] ?? startCwd;
	const worktreeOutput = gitOutput(currentRoot, [
		"worktree",
		"list",
		"--porcelain",
	]);
	for (const match of worktreeOutput.matchAll(/^worktree (.+)$/gm)) {
		addRoot(roots, match[1]);
	}

	return roots;
}

function addRoot(roots, value) {
	const resolved = value ? path.resolve(value.trim()) : null;
	if (resolved && !roots.includes(resolved)) {
		roots.push(resolved);
	}
}

function gitOutput(cwdValue, args) {
	try {
		return execFileSync("git", args, {
			cwd: cwdValue,
			encoding: "utf8",
			stdio: ["ignore", "pipe", "ignore"],
		}).trim();
	} catch {
		return "";
	}
}
