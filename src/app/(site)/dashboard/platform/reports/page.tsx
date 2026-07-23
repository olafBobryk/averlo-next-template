import { DashboardSection } from "@/app/(site)/dashboard/_components/layout/DashboardSection";
import { requirePlatformAdmin } from "@/app/(site)/dashboard/_lib/platform/access.server";
import { listProductReports } from "@/app/(site)/dashboard/_lib/platform/fixtures.server";
import { PlatformReportsContent } from "./_components/PlatformReportsContent";

export default async function PlatformReportsPage() {
	await requirePlatformAdmin();
	return (
		<DashboardSection
			contentClassName="grid min-w-0 gap-5"
			description="Triage structured product feedback with its captured dashboard context."
			title="Reports"
		>
			<PlatformReportsContent reports={listProductReports()} />
		</DashboardSection>
	);
}
