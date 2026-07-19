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
			description="A product-ready organization boundary with settings, commands, and deterministic review states."
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
					// prune:dashboard.reference-entities:start
					{
						description:
							"Review the copyable live and skeleton entity presentation contracts.",
						href: "/dashboard/reference/entities",
						id: "overview.entity-reference",
						keywords: ["entity", "presentation", "skeleton", "reference"],
						label: "Open entity reference",
					},
					// prune:dashboard.reference-entities:end
				]}
				ownerId="dashboard.overview"
			/>
			<div className="grid gap-4 md:grid-cols-2">
				{/* prune:dashboard.reference-entities:start */}
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
				{/* prune:dashboard.reference-entities:end */}
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
				{/* prune:dashboard.reference-entities:start */}
				<Card>
					<Card.Header>
						<Card.Title>Entity presentation reference</Card.Title>
						<Card.Description>
							Compare live member and record surfaces with their component-owned
							skeletons, then copy the direct-import ownership pattern.
						</Card.Description>
					</Card.Header>
					<Card.Content className="mt-auto">
						<Button
							href="/dashboard/reference/entities"
							size="sm"
							variant="secondary"
						>
							Open reference
						</Button>
					</Card.Content>
				</Card>
				{/* prune:dashboard.reference-entities:end */}
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
