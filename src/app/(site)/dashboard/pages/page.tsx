import { DashboardSection } from "../_components/layout/DashboardSection";
import { DashboardPagesContent } from "./_components/DashboardPagesContent";

export default function DashboardPagesPage() {
	return (
		<DashboardSection
			title="All pages"
			description="Choose which pages appear in your sidebar."
			contentClassName="flex flex-col gap-6"
		>
			<DashboardPagesContent />
		</DashboardSection>
	);
}
