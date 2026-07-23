import { DashboardSection } from "@/app/(site)/dashboard/_components/layout/DashboardSection";
import { requirePlatformAdmin } from "@/app/(site)/dashboard/_lib/platform/access.server";
import { listSupportRequests } from "@/app/(site)/dashboard/_lib/platform/fixtures.server";
import { PlatformInboxContent } from "./_components/PlatformInboxContent";

export default async function PlatformInboxPage() {
	await requirePlatformAdmin();
	return (
		<DashboardSection
			contentClassName="grid min-w-0 gap-5"
			description="Review fixture-only support requests submitted from authenticated dashboards."
			title="Inbox"
		>
			<PlatformInboxContent requests={listSupportRequests()} />
		</DashboardSection>
	);
}
