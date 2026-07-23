import { Icon } from "@/components/ui/icons/Icon";
import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";
import { DashboardSection } from "./_components/layout/DashboardSection";
import { requireDashboardCapability } from "./_registry/access.server";

export default async function DashboardPage() {
	await requireDashboardCapability("dashboard.view");
	return (
		<DashboardSection
			contentClassName="grid gap-4"
			description="Quick access to your organization, records, and account settings."
			title="Overview"
		>
			<Card>
				<Card.Header className="border-b">
					<Card.Title className="inline-flex items-center gap-2">
						<Icon name="building" size="sm" />
						Organization
					</Card.Title>
					<Card.Description>
						Review members, roles, and organization administration.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<Button href="/dashboard/organization" size="sm" variant="secondary">
						Open organization
					</Button>
				</Card.Content>
			</Card>

			{/* prune:dashboard.reference-entities:start */}
			<Card>
				<Card.Header className="border-b">
					<Card.Title className="inline-flex items-center gap-2">
						<Icon name="database" size="sm" />
						Records
					</Card.Title>
					<Card.Description>
						Browse and manage records for the active organization.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<Button href="/dashboard/records" size="sm" variant="secondary">
						Open records
					</Button>
				</Card.Content>
			</Card>
			{/* prune:dashboard.reference-entities:end */}

			<Card>
				<Card.Header className="border-b">
					<Card.Title className="inline-flex items-center gap-2">
						<Icon name="gear" size="sm" />
						Account
					</Card.Title>
					<Card.Description>
						Manage your profile, security, and accessibility preferences.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<Button href="/dashboard/settings" size="sm" variant="secondary">
						Open account settings
					</Button>
				</Card.Content>
			</Card>
		</DashboardSection>
	);
}
