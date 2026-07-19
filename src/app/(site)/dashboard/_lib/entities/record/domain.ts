export type ReferenceRecordStatus = "active" | "archived" | "draft" | "review";

export type ReferenceRecordProperty = {
	id: string;
	label: string;
	value: string;
};

export type ReferenceRecord = {
	archivedAt: string | null;
	createdAt: string;
	descriptionMarkdown: string;
	id: string;
	organizationId: string;
	ownerMemberId: string | null;
	properties: readonly ReferenceRecordProperty[];
	slug: string;
	status: ReferenceRecordStatus;
	title: string;
	updatedAt: string;
};

export type ReferenceRecordCreateInput = {
	descriptionMarkdown?: string;
	ownerMemberId?: string | null;
	status?: Exclude<ReferenceRecordStatus, "archived">;
	title: string;
};

export type ReferenceRecordUpdateInput = Partial<
	Pick<
		ReferenceRecord,
		| "archivedAt"
		| "descriptionMarkdown"
		| "ownerMemberId"
		| "properties"
		| "status"
		| "title"
	>
>;
