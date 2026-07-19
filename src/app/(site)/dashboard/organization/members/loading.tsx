import { DashboardTablePanel } from "../../_components/data/DashboardTablePanel";
import { DashboardSection } from "../../_components/layout/DashboardSection";
import { memberColumnDefinitions } from "../../_lib/entities/member/presentation";

export default function DashboardMembersLoading() {
	return (
		<DashboardSection
			description="Organization-scoped membership identities."
			title="Members"
		>
			<DashboardTablePanel.Skeleton
				columns={memberColumnDefinitions.map((column) => ({
					id: column.id,
					label: column.label,
				}))}
				description="Loading organization members."
				title="Organization members"
			/>
		</DashboardSection>
	);
}
