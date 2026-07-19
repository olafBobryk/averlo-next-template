import { Chip } from "@/components/ui/misc/Chip";
import { Card } from "@/components/ui/primitives/Card";
import { Text } from "@/components/ui/primitives/Text";
import { DashboardSection } from "../../_components/layout/DashboardSection";
import { requireDashboardCapability } from "../../_registry/access.server";

export default async function DashboardOrganizationMembersPage() {
	const { context } = await requireDashboardCapability("organization.read");
	return (
		<DashboardSection
			description={`Organization-scoped membership identities for ${context.organization.name}.`}
			title="Members"
		>
			<Card padding="none">
				<div className="flex items-center gap-4 px-4 py-4 sm:px-5">
					<div className="grid size-10 place-items-center rounded-full border border-border bg-muted font-semibold">
						{context.user.name.charAt(0).toUpperCase()}
					</div>
					<div className="min-w-0 flex-1">
						<Text as="div" variant="bodyStrong">
							{context.user.name}
						</Text>
						<Text as="div" tone="muted" variant="caption">
							{context.user.email}
						</Text>
					</div>
					<Chip className="capitalize">{context.membership.role}</Chip>
				</div>
			</Card>
		</DashboardSection>
	);
}
