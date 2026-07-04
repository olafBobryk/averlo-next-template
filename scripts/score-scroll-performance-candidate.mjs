#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
	appendJsonLine,
	decideScrollPerformanceKeep,
	getUnauthorizedPaths,
	parseScrollPerformanceCandidate,
	readJsonFile,
	resolveAutoresearchRuntimePaths,
	sanitizeTag,
	summarizeScrollPerformanceResult,
	writeJsonFile,
} from "./_lib/scroll-performance-autoresearch.mjs";

function printUsage() {
	console.log(`Usage: npm run score:scroll-performance -- --tag <tag> [options]

Options:
  --tag <tag>        Required runtime tag created by setup
  --runs 1|3         Fast or confirm measurement run count (default: 1)
  --label "note"     Optional candidate label; defaults to the current commit subject
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

function readRunCount(values) {
	const raw = readString(values, "runs");
	if (!raw) return 1;
	const parsed = Number.parseInt(raw, 10);
	if (parsed !== 1 && parsed !== 3) {
		throw new Error("--runs must be 1 or 3.");
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
			"Scoring requires a clean worktree state. Commit the candidate change first.",
		);
	}
}

async function runAndCapture(command, args, { cwd, label, logLines }) {
	const result = runCommand(command, args, { cwd });
	logLines.push(`$ ${label}`);
	logLines.push((result.stdout || "").trim());
	if (result.stderr?.trim()) {
		logLines.push(result.stderr.trim());
	}
	return result;
}

async function scoreMeasurement({
	cwd,
	label,
	logLines,
	runCount,
	runtimePaths,
	scenario,
}) {
	await runAndCapture("npm", ["run", "build"], {
		cwd,
		label: "npm run build",
		logLines,
	});

	await runAndCapture(
		process.execPath,
		[
			"scripts/measure-scroll-performance.mjs",
			"--scenario",
			scenario,
			"--runs",
			String(runCount),
			"--output",
			runtimePaths.latestMeasurementPath,
			"--notes",
			label,
		],
		{
			cwd,
			label: `node scripts/measure-scroll-performance.mjs --scenario ${scenario} --runs ${runCount} --output ${runtimePaths.latestMeasurementPath} --notes "${label}"`,
			logLines,
		},
	);

	return parseScrollPerformanceCandidate(
		await readJsonFile(runtimePaths.latestMeasurementPath),
	);
}

async function writeRunLog(runtimePaths, logLines) {
	await fs.mkdir(path.dirname(runtimePaths.runLogPath), { recursive: true });
	await fs.writeFile(
		runtimePaths.runLogPath,
		`${logLines.filter(Boolean).join("\n\n")}\n`,
		"utf8",
	);
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	if (args.flags.has("help")) {
		printUsage();
		return;
	}

	const tag = sanitizeTag(readString(args.values, "tag"));
	const runCount = readRunCount(args.values);
	const repoRoot = getRepoRoot(process.cwd());
	const runtimePaths = resolveAutoresearchRuntimePaths({ cwd: repoRoot, tag });
	const state = await readJsonFile(runtimePaths.statePath);
	const currentBranch = git(["branch", "--show-current"], {
		cwd: repoRoot,
	}).stdout.trim();

	if (currentBranch !== state.branch) {
		throw new Error(
			`This worktree is on ${currentBranch || "detached HEAD"}, but state expects ${state.branch}.`,
		);
	}

	requireCleanWorkingTree(repoRoot);

	const currentHead = git(["rev-parse", "HEAD"], {
		cwd: repoRoot,
	}).stdout.trim();
	const currentCommit = git(["rev-parse", "--short", "HEAD"], {
		cwd: repoRoot,
	}).stdout.trim();
	const commitLabel =
		readString(args.values, "label") ??
		git(["log", "-1", "--pretty=%s"], { cwd: repoRoot }).stdout.trim() ??
		currentCommit;
	const logLines = [
		`# ${new Date().toISOString()} scroll autoresearch score`,
		`tag: ${tag}`,
		`branch: ${currentBranch}`,
		`head: ${currentHead}`,
	];

	if (state.accepted.metrics === null) {
		if (currentHead !== state.accepted.head) {
			throw new Error(
				"Baseline scoring must run at the accepted setup commit before any candidate commits.",
			);
		}

		const aggregate = await scoreMeasurement({
			cwd: repoRoot,
			label: commitLabel,
			logLines,
			runCount,
			runtimePaths,
			scenario: state.scenario,
		});
		const recordedAt = new Date().toISOString();
		await appendJsonLine(runtimePaths.resultsPath, {
			aggregate,
			branch: currentBranch,
			candidate_commit: currentCommit,
			candidate_head: currentHead,
			decision: "baseline",
			label: commitLabel,
			pass: 0,
			recordedAt,
			runs: runCount,
			schemaVersion: 1,
			tag,
		});

		state.accepted = {
			...state.accepted,
			establishedAt: recordedAt,
			label: commitLabel,
			metrics: aggregate,
		};
		state.lastDecision = {
			at: recordedAt,
			decision: "baseline",
			label: commitLabel,
			result: aggregate,
		};
		await writeJsonFile(runtimePaths.statePath, state);
		logLines.push(
			`Baseline established: ${summarizeScrollPerformanceResult(aggregate)}`,
		);
		await writeRunLog(runtimePaths, logLines);
		console.log(
			`Established baseline ${currentCommit}: ${summarizeScrollPerformanceResult(aggregate)}.`,
		);
		return;
	}

	const nextPass = Number(state.completedPasses ?? 0) + 1;
	if (nextPass > Number(state.passLimit ?? 0)) {
		throw new Error(
			`Pass limit reached (${state.passLimit}). Create a new tagged worktree to continue.`,
		);
	}

	const commitsAhead = Number.parseInt(
		git(["rev-list", "--count", `${state.accepted.head}..HEAD`], {
			cwd: repoRoot,
		}).stdout.trim(),
		10,
	);
	if (commitsAhead !== 1) {
		throw new Error(
			`Expected exactly one committed candidate ahead of ${state.accepted.commit}; found ${commitsAhead}.`,
		);
	}

	const changedFiles = git(
		["diff", "--name-only", `${state.accepted.head}..HEAD`],
		{
			cwd: repoRoot,
		},
	)
		.stdout.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);
	const unauthorizedPaths = getUnauthorizedPaths(changedFiles);
	if (unauthorizedPaths.length > 0) {
		throw new Error(
			`Candidate touched files outside the mutable allowlist:\n${unauthorizedPaths.join("\n")}`,
		);
	}

	const aggregate = await scoreMeasurement({
		cwd: repoRoot,
		label: commitLabel,
		logLines,
		runCount,
		runtimePaths,
		scenario: state.scenario,
	});
	const decision = decideScrollPerformanceKeep({
		accepted: state.accepted.metrics,
		candidate: aggregate,
	});
	const recordedAt = new Date().toISOString();

	await appendJsonLine(runtimePaths.resultsPath, {
		accepted_before: {
			commit: state.accepted.commit,
			head: state.accepted.head,
			metrics: state.accepted.metrics,
		},
		aggregate,
		branch: currentBranch,
		candidate_commit: currentCommit,
		candidate_head: currentHead,
		changed_files: changedFiles,
		decision: decision.keep ? "keep" : "discard",
		deltas: decision.deltas,
		label: commitLabel,
		pass: nextPass,
		primary_metric: decision.primaryMetric,
		reason: decision.reason,
		recordedAt,
		runs: runCount,
		schemaVersion: 1,
		tag,
	});

	state.completedPasses = nextPass;
	state.lastDecision = {
		at: recordedAt,
		decision: decision.keep ? "keep" : "discard",
		deltas: decision.deltas,
		label: commitLabel,
		pass: nextPass,
		primaryMetric: decision.primaryMetric,
		reason: decision.reason,
		result: aggregate,
	};

	if (decision.keep) {
		state.accepted = {
			commit: currentCommit,
			establishedAt: recordedAt,
			head: currentHead,
			label: commitLabel,
			metrics: aggregate,
		};
		logLines.push("Decision: KEEP");
		logLines.push(decision.reason);
		await writeJsonFile(runtimePaths.statePath, state);
		await writeRunLog(runtimePaths, logLines);
		console.log(`KEPT ${currentCommit}: ${decision.reason}`);
		console.log(`Accepted baseline is now ${currentCommit}.`);
		return;
	}

	git(["reset", "--hard", state.accepted.head], { cwd: repoRoot });
	logLines.push("Decision: DISCARD");
	logLines.push(decision.reason);
	await writeJsonFile(runtimePaths.statePath, state);
	await writeRunLog(runtimePaths, logLines);
	console.log(`DISCARDED ${currentCommit}: ${decision.reason}`);
	console.log(`Reset branch back to ${state.accepted.commit}.`);
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
