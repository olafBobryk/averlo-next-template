import { DashboardSection } from "@/app/(site)/dashboard/_components/layout/DashboardSection";
import { requirePlatformAdmin } from "@/app/(site)/dashboard/_lib/platform/access.server";
import { Icon } from "@/components/ui/icons/Icon";
import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";

export default async function PlatformPage() {
	await requirePlatformAdmin();
	return (
		<DashboardSection
			contentClassName="grid gap-4 md:grid-cols-2"
			description="Open internal platform support and report operations."
			title="Platform"
		>
			<Card>
				<Card.Header className="border-b">
					<Card.Title className="inline-flex items-center gap-2">
						<Icon name="mail" size="sm" />
						Inbox
					</Card.Title>
					<Card.Description>
						Review support requests submitted from dashboard support.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<Button
						href="/dashboard/platform/inbox"
						size="sm"
						variant="secondary"
					>
						Open inbox
					</Button>
				</Card.Content>
			</Card>
			<Card>
				<Card.Header className="border-b">
					<Card.Title className="inline-flex items-center gap-2">
						<Icon name="flag" size="sm" />
						Reports
					</Card.Title>
					<Card.Description>
						Review product reports captured from dashboard routes.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<Button
						href="/dashboard/platform/reports"
						size="sm"
						variant="secondary"
					>
						Open reports
					</Button>
				</Card.Content>
			</Card>
		</DashboardSection>
	);
}
