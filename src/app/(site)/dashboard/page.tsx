import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";
import { Text } from "@/components/ui/primitives/Text";
import { DashboardSurfaceCommands } from "./_components/commands/DashboardSurfaceCommands";
import { DashboardSection } from "./_components/layout/DashboardSection";
import { requireDashboardCapability } from "./_registry/access.server";

export default async function DashboardPage() {
	const { context } = await requireDashboardCapability("dashboard.view");
	return (
		<DashboardSection
			description="A product-ready organization boundary with reference records, members, settings, commands, and deterministic review states."
			title={context.organization.name}
		>
			<DashboardSurfaceCommands
				commands={[
					{
						description:
							"Review the active organization and its membership context.",
						href: "/dashboard/organization",
						id: "overview.organization",
						keywords: ["team", "company", "workspace"],
						label: "Open organization",
					},
				]}
				ownerId="dashboard.overview"
			/>
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<Card.Header>
						<Card.Title>Reference records</Card.Title>
						<Card.Description>
							A neutral entity collection ready to rename and connect to a real
							adapter.
						</Card.Description>
					</Card.Header>
					<Card.Content className="mt-auto">
						<Button href="/dashboard/records" size="sm" variant="primary">
							Open records
						</Button>
					</Card.Content>
				</Card>
				<Card>
					<Card.Header>
						<Card.Title>Organization</Card.Title>
						<Card.Description>
							{context.memberships.length === 1
								? "Singleton mode keeps switching out of the way while preserving the organization boundary."
								: `${context.memberships.length} organizations are available to this account.`}
						</Card.Description>
					</Card.Header>
					<Card.Content className="mt-auto">
						<Button
							href="/dashboard/organization"
							size="sm"
							variant="secondary"
						>
							Review organization
						</Button>
					</Card.Content>
				</Card>
			</div>
			<Card className="mt-4" padding="md">
				<Text as="h2" variant="headingSm">
					Template contract
				</Text>
				<Text tone="muted" variant="support">
					Navigation, breadcrumbs, Command-K, layout width, and capability
					visibility now resolve from the dashboard-owned surface registry.
				</Text>
			</Card>
		</DashboardSection>
	);
}
