#!/usr/bin/env node

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { thinStartProfile } from "../template-profiles/thin-start/manifest.mjs";

const root = process.cwd();
const pruneSource = readFileSync(`${root}/scripts/prune-template.mjs`, "utf8");
assert.ok(pruneSource.includes('id: "dashboard.reference-entities"'));
assert.ok(pruneSource.includes('flag: "--no-dashboard-reference-entities"'));
assert.ok(thinStartProfile.surfaces.remove.includes("dashboard"));
assert.ok(
	thinStartProfile.surfaces.remove.includes("dashboard.reference-entities"),
);
assert.ok(
	thinStartProfile.packageChanges.scripts.remove.includes(
		"verify:frontend-entities",
	),
);

for (const flags of [
	["--no-dashboard-reference-entities", "--dry-run"],
	["--no-dashboard", "--dry-run"],
	["--no-dashboard", "--no-payload", "--dry-run"],
]) {
	const result = spawnSync("node", ["scripts/prune-template.mjs", ...flags], {
		cwd: root,
		encoding: "utf8",
	});
	assert.equal(
		result.status,
		0,
		`Prune dry-run failed for ${flags.join(" ")}: ${result.stderr}`,
	);
	assert.ok(result.stdout.includes("Dry run complete. No files were changed."));
}

console.log("Dashboard, child-surface, and static prune dry-runs passed.");
