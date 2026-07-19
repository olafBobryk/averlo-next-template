import { Chip } from "@/components/ui/misc/Chip";
import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";
import { Text } from "@/components/ui/primitives/Text";
import { DashboardSurfaceCommands } from "../_components/commands/DashboardSurfaceCommands";
import { DashboardSection } from "../_components/layout/DashboardSection";
import { requireDashboardCapability } from "../_registry/access.server";

const previewRecords = [
	{ id: "north-star", name: "North star", status: "Active" },
	{ id: "launch-brief", name: "Launch brief", status: "Draft" },
	{ id: "customer-notes", name: "Customer notes", status: "Review" },
] as const;

export default async function DashboardRecordsPage() {
	const { capabilities, context } =
		await requireDashboardCapability("records.read");
	return (
		<DashboardSection
			actions={
				capabilities.has("records.write") ? (
					<Button href="/dashboard/records?action=create" size="sm">
						New record
					</Button>
				) : null
			}
			description={`Organization-scoped reference entities for ${context.organization.name}.`}
			title="Records"
		>
			<DashboardSurfaceCommands
				commands={[
					{
						capability: "records.write",
						description: "Start a new organization-scoped record.",
						href: "/dashboard/records?action=create",
						id: "records.context.create",
						keywords: ["new", "add"],
						label: "Create record",
					},
				]}
				ownerId="dashboard.records"
			/>
			<Card padding="none">
				<div className="divide-y divide-border">
					{previewRecords.map((record) => (
						<div
							className="flex items-center gap-4 px-4 py-3 sm:px-5"
							key={record.id}
						>
							<div className="min-w-0 flex-1">
								<Text as="div" variant="bodyStrong">
									{record.name}
								</Text>
								<Text as="div" tone="muted" variant="caption">
									{record.id}
								</Text>
							</div>
							<Chip>{record.status}</Chip>
							<Button
								href={`/dashboard/records/${record.id}`}
								size="sm"
								variant="ghost"
							>
								Open
							</Button>
						</div>
					))}
				</div>
			</Card>
		</DashboardSection>
	);
}
