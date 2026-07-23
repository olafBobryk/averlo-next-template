import assert from "node:assert/strict";
import type { ReferenceMember } from "../src/app/(site)/dashboard/_lib/entities/member/domain";
import {
	getMemberInitials,
	getMemberPresentation,
	memberColumnDefinitions,
} from "../src/app/(site)/dashboard/_lib/entities/member/presentation";
import { toOrganizationEntity } from "../src/app/(site)/dashboard/_lib/entities/organization/domain";
import { getOrganizationPresentation } from "../src/app/(site)/dashboard/_lib/entities/organization/presentation";
import {
	getRecordPresentation,
	recordColumnDefinitions,
} from "../src/app/(site)/dashboard/_lib/entities/record/presentation";
import {
	createReferenceRecord,
	deleteReferenceRecord,
	getReferenceRecord,
	listReferenceRecords,
	resetReferenceRecordFixtureState,
	updateReferenceRecord,
} from "../src/app/(site)/dashboard/_lib/fixtures/reference-records.core";

const member: ReferenceMember = {
	createdAt: "2026-01-12T08:00:00.000Z",
	id: "membership-policy-example",
	organizationId: "org-demo",
	role: "owner",
	user: {
		email: "owner@example.com",
		id: "user-policy-example",
		name: "Example Owner",
		profilePictureUrl: null,
	},
};

const memberView = getMemberPresentation(member);
assert.equal(memberView.displayLabel, "Example Owner");
assert.equal(memberView.initials, "EO");
assert.equal(
	getMemberInitials({ ...member, user: { ...member.user, name: null } }),
	"OW",
);
assert.equal(memberColumnDefinitions.length, 3);
assert.ok(memberView.href.endsWith(member.id));

const organizationView = getOrganizationPresentation(
	toOrganizationEntity(
		{
			id: "org-policy-example",
			mode: "multi",
			name: "Example Organization",
			profilePictureUrl: undefined,
			slug: "example",
		},
		"owner",
	),
);
assert.equal(organizationView.displayLabel, "Example Organization");
assert.equal(organizationView.initials, "EO");
assert.equal(organizationView.secondaryLabel, "example · Owner");
assert.equal(organizationView.avatarUrl, null);
assert.match(organizationView.searchText, /Example Organization example Owner/);

resetReferenceRecordFixtureState();
assert.equal(listReferenceRecords("org-demo").length, 3);
assert.equal(listReferenceRecords("org-sandbox").length, 1);
assert.equal(getReferenceRecord("org-sandbox", "north-star"), null);

const created = createReferenceRecord("org-demo", {
	title: "  Policy   example  ",
});
assert.equal(created.ok, true);
if (!created.ok) throw new Error("Expected reference record creation to pass.");
assert.equal(created.record.title, "Policy example");
assert.equal(getRecordPresentation(created.record).statusLabel, "Draft");
assert.equal(recordColumnDefinitions.length, 3);

const failedUpdate = updateReferenceRecord(
	"org-demo",
	created.record.id,
	{ title: "Changed" },
	{ simulateFailure: true },
);
assert.equal(failedUpdate.ok, false);
assert.equal(
	getReferenceRecord("org-demo", created.record.id)?.title,
	"Policy example",
);

const failedDelete = deleteReferenceRecord("org-demo", created.record.id, {
	simulateFailure: true,
});
assert.equal(failedDelete.ok, false);
assert.ok(getReferenceRecord("org-demo", created.record.id));
assert.equal(deleteReferenceRecord("org-demo", created.record.id).ok, true);
assert.equal(getReferenceRecord("org-demo", created.record.id), null);

resetReferenceRecordFixtureState();
assert.equal(listReferenceRecords("org-demo").length, 3);
console.log("Reference entity presentation and fixture verification passed.");
