"use client";
import { RecordStatusChip } from "@/app/(site)/dashboard/_components/entities/record/RecordStatusChip";
// Native specimen adapted from @/app/(site)/dashboard/_components/entities/record/RecordStatusChip.catalog.
import { recordStatusPresentation } from "@/app/(site)/dashboard/_lib/entities/record/presentation";

const statuses = ["active", "archived", "draft", "review"] as const;
function CatalogPreview() {
	const render = () => (
		<div className="flex flex-wrap items-center gap-3">
			{statuses.map((status) => (
				<RecordStatusChip
					key={status}
					label={recordStatusPresentation[status].shortLabel}
					tone={recordStatusPresentation[status].tone}
				/>
			))}
			<RecordStatusChip.Skeleton />
		</div>
	);
	return render();
}
export default CatalogPreview;
