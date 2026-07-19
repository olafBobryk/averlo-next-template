import { Chip } from "@/components/ui/misc/Chip";
import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";
import { Text } from "@/components/ui/primitives/Text";
import { DashboardSection } from "../_components/layout/DashboardSection";
import { requireDashboardCapability } from "../_registry/access.server";

export default async function DashboardOrganizationPage() {
	const { capabilities, context } =
		await requireDashboardCapability("organization.read");
	return (
		<DashboardSection
			actions={
				capabilities.has("organization.manage") ? (
					<Button href="/dashboard/organization/settings" size="sm">
						Organization settings
					</Button>
				) : null
			}
			description="The active organization remains the authorization and persistence boundary even in singleton mode."
			title={context.organization.name}
		>
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<Card.Header>
						<Card.Title>Organization context</Card.Title>
						<Card.Description>
							Resolved on the server before every dashboard request.
						</Card.Description>
					</Card.Header>
					<Card.Content className="grid gap-4">
						<div className="flex items-center justify-between gap-3">
							<Text tone="muted">Mode</Text>
							<Chip className="capitalize">{context.organization.mode}</Chip>
						</div>
						<div className="flex items-center justify-between gap-3">
							<Text tone="muted">Your role</Text>
							<Chip className="capitalize">{context.membership.role}</Chip>
						</div>
					</Card.Content>
				</Card>
				{/* prune:dashboard.reference-entities:start */}
				<Card>
					<Card.Header>
						<Card.Title>Members</Card.Title>
						<Card.Description>
							Use the member surface for identity and organization access.
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<Button
							href="/dashboard/organization/members"
							size="sm"
							variant="secondary"
						>
							Open members
						</Button>
					</Card.Content>
				</Card>
				{/* prune:dashboard.reference-entities:end */}
			</div>
		</DashboardSection>
	);
}
