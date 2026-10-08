import { Button } from "@/components/ui/primitives/Button";
import { ContentSection } from "@/components/ui/primitives/surfaces";
import { hrefFor } from "@/lib/routes";
import { DashboardSection } from "../../_components/layout/DashboardSection";
import { PlatformOverviewLoading } from "./PlatformRouteLoading";

export function PlatformSurface() {
	return (
		<DashboardSection
			contentClassName="grid gap-4 md:grid-cols-2"
			title="Platform"
		>
			<ContentSection>
				<ContentSection.Heading
					description="Review support requests submitted from dashboard support."
					title="Inbox"
				/>
				<ContentSection.Content>
					<Button
						href={hrefFor("dashboard.platform.inbox")}
						size="sm"
						variant="secondary"
					>
						Open inbox
					</Button>
				</ContentSection.Content>
			</ContentSection>
			<ContentSection>
				<ContentSection.Heading
					description="Review product reports captured from dashboard routes."
					title="Reports"
				/>
				<ContentSection.Content>
					<Button
						href={hrefFor("dashboard.platform.reports")}
						size="sm"
						variant="secondary"
					>
						Open reports
					</Button>
				</ContentSection.Content>
			</ContentSection>
		</DashboardSection>
	);
}

export function PlatformSurfaceSkeleton() {
	return <PlatformOverviewLoading />;
}
