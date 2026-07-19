import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";
import { Text } from "@/components/ui/primitives/Text";
import { DashboardSurfaceCommands } from "../../_components/commands/DashboardSurfaceCommands";
import { DashboardSection } from "../../_components/layout/DashboardSection";
import { requireDashboardCapability } from "../../_registry/access.server";

export default async function DashboardRecordPage({
	params,
}: {
	params: Promise<{ recordId: string }>;
}) {
	const { recordId } = await params;
	const { capabilities, context } =
		await requireDashboardCapability("records.read");
	const title = decodeURIComponent(recordId)
		.split("-")
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(" ");
	return (
		<DashboardSection
			actions={
				capabilities.has("records.write") ? (
					<Button href={`?action=edit`} size="sm" variant="secondary">
						Edit record
					</Button>
				) : null
			}
			breadcrumbLabel={title}
			description={`Reference detail in ${context.organization.name}.`}
			title={title}
		>
			<DashboardSurfaceCommands
				commands={[
					{
						capability: "records.write",
						description: `Edit ${title}.`,
						href: `/dashboard/records/${recordId}?action=edit`,
						id: `record.${recordId}.edit`,
						keywords: ["change", "update"],
						label: "Edit record",
					},
				]}
				ownerId={`dashboard.record.${recordId}`}
			/>
			<Card>
				<Card.Header>
					<Card.Title>Record details</Card.Title>
					<Card.Description>
						C5 replaces this reference boundary with the documented entity
						presentation, Markdown, mutation, and deletion system.
					</Card.Description>
				</Card.Header>
				<Card.Content className="grid gap-4 sm:grid-cols-2">
					<div>
						<Text as="div" tone="muted" variant="caption">
							Record ID
						</Text>
						<Text as="div" variant="bodyStrong">
							{recordId}
						</Text>
					</div>
					<div>
						<Text as="div" tone="muted" variant="caption">
							Organization
						</Text>
						<Text as="div" variant="bodyStrong">
							{context.organization.name}
						</Text>
					</div>
				</Card.Content>
			</Card>
		</DashboardSection>
	);
}
