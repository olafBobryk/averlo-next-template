"use client";
// Native specimen adapted from @/app/(site)/dashboard/_components/entities/record/RecordSelector.catalog.
import { useState } from "react";
import { RecordSelector } from "@/app/(site)/dashboard/_components/entities/record/RecordSelector";
import { getRecordPresentation } from "@/app/(site)/dashboard/_lib/entities/record/presentation";

const records = [
	["North star", "north-star", "active"],
	["Launch brief", "launch-brief", "review"],
	["Working notes", "working-notes", "draft"],
].map(([title, slug, status], index) =>
	getRecordPresentation({
		archivedAt: null,
		createdAt: "2026-01-12T08:00:00.000Z",
		descriptionMarkdown: "",
		id: `record-story-${index}`,
		organizationId: "organization-story",
		ownerMemberId: null,
		properties: [],
		slug,
		status: status as "active" | "draft" | "review",
		title,
		updatedAt: "2026-08-01T08:00:00.000Z",
	}),
);
function ControlledRecordSelector() {
	const [value, setValue] = useState<string | null>(records[0].id);
	return (
		<div className="w-80">
			<RecordSelector onChange={setValue} records={records} value={value} />
		</div>
	);
}
function CatalogPreview() {
	const render = () => <ControlledRecordSelector />;
	return render();
}
export default CatalogPreview;
