#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
	appendExecutedBenchmarkRun,
	createExecutedBenchmarkRun,
} from "./lib/template-intelligence-benchmark.mjs";

function expectFailure(input, pattern) {
	assert.throws(() => createExecutedBenchmarkRun(input), pattern);
}

const base = {
	taskId: "verify-recording",
	taskName: "Verify deterministic benchmark recording",
	strategy: "TemplateMap",
	measurementSource: "command",
	sourceCommand: "verify:intelligence-benchmark",
	shellCommands: 2,
	semanticCalls: 0,
	outputBytes: 100,
};

const templateMapRun = createExecutedBenchmarkRun(base);
assert.equal(templateMapRun.schemaVersion, 3);
assert.equal(templateMapRun.recordKind, "executed-run");
assert.equal(templateMapRun.strategy, "TemplateMap");
assert.equal(templateMapRun.correctness, undefined);
assert.match(templateMapRun.runId, /^ti_[a-f0-9]{20}$/);

expectFailure(
	{ ...base, strategy: "TemplateSerena" },
	/at least one semantic call/,
);
expectFailure(
	{ ...base, strategy: "Control", semanticCalls: 1 },
	/cannot contain semantic calls/,
);
expectFailure(
	{
		...base,
		strategy: "Graphify",
		graphQueries: 0,
		buildSeconds: 1,
		querySeconds: 1,
	},
	/at least one successful graph query/,
);
expectFailure({ ...base, benchmarkMode: "triple-run" }, /runGroupId/);

const graphifyRun = createExecutedBenchmarkRun({
	...base,
	strategy: "Graphify",
	shellCommands: 2,
	graphQueries: 1,
	buildSeconds: 1,
	querySeconds: 1,
});
assert.equal(graphifyRun.lookupActions, 3);

const temporaryRoot = await fs.mkdtemp(
	path.join(os.tmpdir(), "averlo-intelligence-benchmark-"),
);
try {
	const first = await appendExecutedBenchmarkRun(templateMapRun, {
		root: temporaryRoot,
	});
	const second = await appendExecutedBenchmarkRun(templateMapRun, {
		root: temporaryRoot,
	});
	assert.equal(first.status, "recorded");
	assert.equal(second.status, "duplicate");

	const lines = (await fs.readFile(first.path, "utf8"))
		.split(/\r?\n/)
		.filter(Boolean);
	assert.equal(lines.length, 1);
	assert.equal(JSON.parse(lines[0]).runId, templateMapRun.runId);
} finally {
	await fs.rm(temporaryRoot, { recursive: true, force: true });
}

console.log(
	"Template Intelligence benchmark verification passed: schema validation, strategy evidence, optional annotations, locking, and idempotent append.",
);
