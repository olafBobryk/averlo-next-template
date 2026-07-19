import { DashboardTablePanel } from "../_components/data/DashboardTablePanel";
import { DashboardPageHeader } from "../_components/layout/DashboardPageHeader";
import { recordColumnDefinitions } from "../_lib/entities/record/presentation";

export default function DashboardRecordsLoading() {
	return (
		<div aria-busy="true" className="grid gap-5" role="status">
			<DashboardPageHeader.Skeleton />
			<DashboardTablePanel.Skeleton
				columns={[
					...recordColumnDefinitions.map((column) => ({
						id: column.id,
						label: column.label,
					})),
					{ id: "actions", label: "Actions" },
				]}
				description="Organization-scoped reference records."
				title="Records"
			/>
		</div>
	);
}
