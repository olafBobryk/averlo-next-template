import { randomUUID } from "node:crypto";
import type {
	ReferenceRecord,
	ReferenceRecordCreateInput,
	ReferenceRecordProperty,
	ReferenceRecordUpdateInput,
} from "../entities/record/domain";

export type ReferenceRecordMutationResult =
	| {
			fieldErrors?: { title?: string };
			message: string;
			ok: false;
	  }
	| { message: string; ok: true; record: ReferenceRecord };

type ReferenceRecordFixtureState = Map<string, Map<string, ReferenceRecord>>;

declare global {
	var __averloReferenceRecordState: ReferenceRecordFixtureState | undefined;
}

const defaultDescription =
	"## Product-ready reference\n\nThis organization-scoped record demonstrates shared presentation, Markdown editing, mutations, and deletion without prescribing a product domain.";

const seedRecords: readonly ReferenceRecord[] = [
	{
		archivedAt: null,
		createdAt: "2026-01-18T09:00:00.000Z",
		descriptionMarkdown: defaultDescription,
		id: "north-star",
		organizationId: "org-demo",
		ownerMemberId: "membership-template-owner",
		properties: [
			{ id: "audience", label: "Audience", value: "Product team" },
			{ id: "cadence", label: "Review cadence", value: "Monthly" },
		],
		slug: "north-star",
		status: "active",
		title: "North star",
		updatedAt: "2026-07-18T13:30:00.000Z",
	},
	{
		archivedAt: null,
		createdAt: "2026-03-10T11:30:00.000Z",
		descriptionMarkdown:
			"## Launch brief\n\nUse the editor to replace this fixture description and mention an organization member.",
		id: "launch-brief",
		organizationId: "org-demo",
		ownerMemberId: "membership-multi-demo",
		properties: [{ id: "channel", label: "Primary channel", value: "Web" }],
		slug: "launch-brief",
		status: "draft",
		title: "Launch brief",
		updatedAt: "2026-07-17T16:10:00.000Z",
	},
	{
		archivedAt: null,
		createdAt: "2026-04-02T14:00:00.000Z",
		descriptionMarkdown:
			"## Customer notes\n\nA neutral fixture for reviewing the table, detail, and deletion lifecycle.",
		id: "customer-notes",
		organizationId: "org-demo",
		ownerMemberId: null,
		properties: [],
		slug: "customer-notes",
		status: "review",
		title: "Customer notes",
		updatedAt: "2026-07-16T08:45:00.000Z",
	},
	{
		archivedAt: null,
		createdAt: "2026-05-21T10:00:00.000Z",
		descriptionMarkdown:
			"## Sandbox record\n\nThis record proves fixture state remains organization scoped.",
		id: "sandbox-reference",
		organizationId: "org-sandbox",
		ownerMemberId: "membership-multi-sandbox",
		properties: [],
		slug: "sandbox-reference",
		status: "active",
		title: "Sandbox reference",
		updatedAt: "2026-07-15T12:00:00.000Z",
	},
];

function cloneProperties(properties: readonly ReferenceRecordProperty[]) {
	return properties.map((property) => ({ ...property }));
}

function cloneRecord(record: ReferenceRecord): ReferenceRecord {
	return { ...record, properties: cloneProperties(record.properties) };
}

function createReferenceRecordFixtureState() {
	const state: ReferenceRecordFixtureState = new Map();
	for (const record of seedRecords) {
		const organizationRecords = state.get(record.organizationId) ?? new Map();
		organizationRecords.set(record.id, cloneRecord(record));
		state.set(record.organizationId, organizationRecords);
	}
	return state;
}

function getReferenceRecordFixtureState() {
	globalThis.__averloReferenceRecordState ??=
		createReferenceRecordFixtureState();
	return globalThis.__averloReferenceRecordState;
}

function getOrganizationRecords(organizationId: string) {
	const state = getReferenceRecordFixtureState();
	const records =
		state.get(organizationId) ?? new Map<string, ReferenceRecord>();
	state.set(organizationId, records);
	return records;
}

function normalizeTitle(title: string) {
	return title.trim().replace(/\s+/g, " ");
}

function slugify(title: string) {
	return (
		title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "") || "record"
	);
}

function uniqueSlug(
	records: ReadonlyMap<string, ReferenceRecord>,
	title: string,
	ignoreId?: string,
) {
	const base = slugify(title);
	const used = new Set(
		[...records.values()]
			.filter((record) => record.id !== ignoreId)
			.map((record) => record.slug),
	);
	if (!used.has(base)) return base;
	let suffix = 2;
	while (used.has(`${base}-${suffix}`)) suffix += 1;
	return `${base}-${suffix}`;
}

function failure(
	message: string,
	fieldErrors?: { title?: string },
): ReferenceRecordMutationResult {
	return { fieldErrors, message, ok: false };
}

function shouldSimulateFailure(simulateFailure?: boolean) {
	return simulateFailure === true;
}

export function listReferenceRecords(
	organizationId: string,
	options: { includeArchived?: boolean } = {},
) {
	return [...getOrganizationRecords(organizationId).values()]
		.filter((record) => options.includeArchived || record.status !== "archived")
		.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
		.map(cloneRecord);
}

export function getReferenceRecord(organizationId: string, recordId: string) {
	const record = getOrganizationRecords(organizationId).get(recordId);
	return record ? cloneRecord(record) : null;
}

export function createReferenceRecord(
	organizationId: string,
	input: ReferenceRecordCreateInput,
	options: { simulateFailure?: boolean } = {},
): ReferenceRecordMutationResult {
	if (shouldSimulateFailure(options.simulateFailure)) {
		return failure("Simulated fixture failure. No record was created.", {
			title: "The fixture rejected this title. Your value was kept.",
		});
	}
	const title = normalizeTitle(input.title);
	if (title.length < 2)
		return failure("Enter a record title.", {
			title: "Enter a record title.",
		});
	if (title.length > 100)
		return failure("Keep the title under 100 characters.", {
			title: "Keep the title under 100 characters.",
		});
	const records = getOrganizationRecords(organizationId);
	const now = new Date().toISOString();
	const record: ReferenceRecord = {
		archivedAt: null,
		createdAt: now,
		descriptionMarkdown: input.descriptionMarkdown?.trim() ?? "",
		id: `record-${randomUUID()}`,
		organizationId,
		ownerMemberId: input.ownerMemberId ?? null,
		properties: [],
		slug: uniqueSlug(records, title),
		status: input.status ?? "draft",
		title,
		updatedAt: now,
	};
	records.set(record.id, record);
	return {
		message: `Created ${record.title}.`,
		ok: true,
		record: cloneRecord(record),
	};
}

export function updateReferenceRecord(
	organizationId: string,
	recordId: string,
	patch: ReferenceRecordUpdateInput,
	options: { simulateFailure?: boolean } = {},
): ReferenceRecordMutationResult {
	if (shouldSimulateFailure(options.simulateFailure)) {
		return failure(
			"Simulated fixture failure. Your previous values were kept.",
			{ title: "The fixture rejected this title. Your value was kept." },
		);
	}
	const records = getOrganizationRecords(organizationId);
	const current = records.get(recordId);
	if (!current) return failure("The record is no longer available.");
	const title =
		patch.title === undefined ? current.title : normalizeTitle(patch.title);
	if (title.length < 2)
		return failure("Enter a record title.", {
			title: "Enter a record title.",
		});
	const next: ReferenceRecord = {
		...current,
		...patch,
		properties: patch.properties
			? cloneProperties(patch.properties)
			: cloneProperties(current.properties),
		slug:
			title === current.title
				? current.slug
				: uniqueSlug(records, title, current.id),
		title,
		updatedAt: new Date().toISOString(),
	};
	if (next.status !== "archived") next.archivedAt = null;
	records.set(recordId, next);
	return {
		message: `Saved ${next.title}.`,
		ok: true,
		record: cloneRecord(next),
	};
}

export function archiveReferenceRecord(
	organizationId: string,
	recordId: string,
	options: { simulateFailure?: boolean } = {},
) {
	return updateReferenceRecord(
		organizationId,
		recordId,
		{ archivedAt: new Date().toISOString(), status: "archived" },
		options,
	);
}

export function deleteReferenceRecord(
	organizationId: string,
	recordId: string,
	options: { simulateFailure?: boolean } = {},
): ReferenceRecordMutationResult {
	if (shouldSimulateFailure(options.simulateFailure)) {
		return failure("Simulated fixture failure. The record was restored.");
	}
	const records = getOrganizationRecords(organizationId);
	const record = records.get(recordId);
	if (!record) return failure("The record is no longer available.");
	records.delete(recordId);
	return {
		message: `Deleted ${record.title}.`,
		ok: true,
		record: cloneRecord(record),
	};
}

export function resetReferenceRecordFixtureState() {
	globalThis.__averloReferenceRecordState = createReferenceRecordFixtureState();
}
