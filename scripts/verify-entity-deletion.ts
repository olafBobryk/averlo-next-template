import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
	deleteReferenceRecord,
	getReferenceRecord,
	resetReferenceRecordFixtureState,
} from "../src/app/(site)/dashboard/_lib/fixtures/reference-records.core";

resetReferenceRecordFixtureState();
const before = getReferenceRecord("org-demo", "north-star");
assert.ok(before);
assert.equal(
	deleteReferenceRecord("org-demo", "north-star", { simulateFailure: true }).ok,
	false,
);
assert.deepEqual(getReferenceRecord("org-demo", "north-star"), before);

const source = readFileSync(
	resolve(
		process.cwd(),
		"src/app/(site)/dashboard/_components/entities/EntityDeletion.tsx",
	),
	"utf8",
);
for (const contract of [
	"onOptimisticDelete?.()",
	"onRollback?.()",
	"return false",
	"details: definition.impacts",
	"warning: definition.warning",
]) {
	assert.ok(
		source.includes(contract),
		`Missing deletion contract: ${contract}`,
	);
}
console.log("Entity deletion failure and rollback verification passed.");
