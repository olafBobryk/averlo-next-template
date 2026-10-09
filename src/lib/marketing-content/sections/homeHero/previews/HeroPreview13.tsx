"use client";
import { RecordToolCall } from "@/app/(site)/dashboard/_components/entities/record/RecordToolCall";
// Native specimen adapted from @/app/(site)/dashboard/_components/entities/record/RecordToolCall.catalog.
import { getRecordToolPresentation } from "@/app/(site)/dashboard/_lib/entities/record/presentation";

const completed = getRecordToolPresentation({
	input: { id: "north-star" },
	output: {
		record: {
			id: "north-star",
			slug: "north-star",
			status: "active",
			title: "North star",
			url: "/dashboard/records/north-star",
		},
	},
	state: "completed",
	toolName: "record_get",
});
function CatalogPreview() {
	const render = () => (
		<div className="grid gap-6">
			<RecordToolCall presentation={completed} />
			<RecordToolCall.Skeleton />
		</div>
	);
	return render();
}
export default CatalogPreview;
