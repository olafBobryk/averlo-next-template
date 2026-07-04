#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import process from "node:process";
import {
	DEFAULT_AUTORESEARCH_PASS_LIMIT,
	DEFAULT_SCROLL_PERFORMANCE_SCENARIO,
	ensureJsonLineFile,
	getAutoresearchBranchName,
	getAutoresearchWorktreePath,
	MUTABLE_SCOPE_ALLOWLIST,
	PRIMARY_METRIC_TOLERANCES,
	READ_ONLY_SCOPE,
	resolveAutoresearchRuntimePaths,
	SCROLL_PERFORMANCE_SCENARIOS,
	sanitizeTag,
	writeJsonFile,
} from "./_lib/scroll-performance-autoresearch.mjs";

function printUsage() {
	console.log(`Usage: npm run setup:scroll-performance-autoresearch -- --tag <tag> [options]

Options:
  --tag <tag>               Required run tag used for branch, worktree, and runtime files
  --passes 12               Candidate pass cap (default: ${DEFAULT_AUTORESEARCH_PASS_LIMIT})
  --allow-over-12           Required when --passes exceeds ${DEFAULT_AUTORESEARCH_PASS_LIMIT}
  --scenario default        Scenario to score in this worktree (default: ${DEFAULT_SCROLL_PERFORMANCE_SCENARIO})
                            Supported: control, default, stress
`);
}

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

		const [rawKey, inlineValue] = arg.slice(2).split("=");
		const nextValue = inlineValue ?? argv[index + 1];
		if (inlineValue === undefined) index += 1;
		values.set(rawKey.trim(), nextValue);
	}

	return { flags, values };
}

function readString(values, key) {
	const value = values.get(key);
	return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readPositiveInteger(values, key, fallback) {
	const raw = values.get(key);
	if (raw === undefined) return fallback;
	const parsed = Number.parseInt(String(raw), 10);
	if (!Number.isFinite(parsed) || parsed < 1) {
		throw new Error(`--${key} must be a positive integer.`);
	}
	return parsed;
}

function runCommand(command, args, { cwd, allowFailure = false } = {}) {
	const result = spawnSync(command, args, {
		cwd,
		encoding: "utf8",
		maxBuffer: 1024 * 1024 * 20,
	});

	if (result.status !== 0 && !allowFailure) {
		throw new Error(
			(result.stderr || result.stdout || `${command} ${args.join(" ")}`).trim(),
		);
	}

	return result;
}

function git(args, options = {}) {
	return runCommand("git", args, options);
}

function getRepoRoot(cwd) {
	return git(["rev-parse", "--show-toplevel"], { cwd }).stdout.trim();
}

function requireCleanWorkingTree(cwd) {
	const status = git(["status", "--short"], { cwd }).stdout.trim();
	if (status) {
		throw new Error(
			"Setup requires a clean working tree so the disposable branch starts from an accepted baseline commit.",
		);
	}
}

async function pathExists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	if (args.flags.has("help")) {
		printUsage();
		return;
	}

	const tag = sanitizeTag(readString(args.values, "tag"));
	const passLimit = readPositiveInteger(
		args.values,
		"passes",
		DEFAULT_AUTORESEARCH_PASS_LIMIT,
	);
	const scenario =
		readString(args.values, "scenario") ?? DEFAULT_SCROLL_PERFORMANCE_SCENARIO;

	if (!SCROLL_PERFORMANCE_SCENARIOS.has(scenario)) {
		throw new Error(
			`Unsupported scenario "${scenario}". Use control, default, or stress.`,
		);
	}

	if (
		passLimit > DEFAULT_AUTORESEARCH_PASS_LIMIT &&
		!args.flags.has("allow-over-12")
	) {
		throw new Error(
			`Pass counts above ${DEFAULT_AUTORESEARCH_PASS_LIMIT} require --allow-over-12.`,
		);
	}

	const repoRoot = getRepoRoot(process.cwd());
	requireCleanWorkingTree(repoRoot);

	const branchAtSetup = git(["branch", "--show-current"], {
		cwd: repoRoot,
	}).stdout.trim();
	if (!branchAtSetup) {
		throw new Error(
			"Setup requires a named branch checkout, not detached HEAD.",
		);
	}

	const acceptedHead = git(["rev-parse", "HEAD"], {
		cwd: repoRoot,
	}).stdout.trim();
	const acceptedCommit = git(["rev-parse", "--short", "HEAD"], {
		cwd: repoRoot,
	}).stdout.trim();
	const branchName = getAutoresearchBranchName(tag);
	const worktreePath = getAutoresearchWorktreePath({ cwd: repoRoot, tag });
	const runtimePaths = resolveAutoresearchRuntimePaths({
		cwd: worktreePath,
		tag,
	});

	if (
		git(["show-ref", "--verify", "--quiet", `refs/heads/${branchName}`], {
			allowFailure: true,
			cwd: repoRoot,
		}).status === 0
	) {
		throw new Error(`Branch ${branchName} already exists.`);
	}

	if (await pathExists(worktreePath)) {
		throw new Error(`Worktree path already exists: ${worktreePath}`);
	}

	git(["worktree", "add", "-b", branchName, worktreePath, "HEAD"], {
		cwd: repoRoot,
	});

	await ensureJsonLineFile(runtimePaths.resultsPath);
	await writeJsonFile(runtimePaths.statePath, {
		accepted: {
			commit: acceptedCommit,
			establishedAt: null,
			head: acceptedHead,
			label: "accepted harness baseline",
			metrics: null,
		},
		benchmark: {
			doc: "docs/worklogs/scroll-performance-benchmark.md",
			exampleLog: "docs/worklogs/scroll-performance-runs.example.jsonl",
			primaryMetricTolerances: PRIMARY_METRIC_TOLERANCES,
		},
		branch: branchName,
		completedPasses: 0,
		createdAt: new Date().toISOString(),
		lastDecision: null,
		mutableScopeAllowlist: MUTABLE_SCOPE_ALLOWLIST,
		passLimit,
		readOnlyScope: READ_ONLY_SCOPE,
		route: `/internal/scroll-performance?scenario=${scenario}`,
		scenario,
		schemaVersion: 1,
		source: {
			branch: branchAtSetup,
			commit: acceptedCommit,
			head: acceptedHead,
			repoRoot,
		},
		tag,
		worktreePath,
	});

	console.log(`Created ${branchName}`);
	console.log(`Worktree: ${worktreePath}`);
	console.log(`Runtime state: ${runtimePaths.statePath}`);
	console.log("Next:");
	console.log(`  cd ${worktreePath}`);
	console.log(`  npm run score:scroll-performance -- --tag ${tag}`);
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
