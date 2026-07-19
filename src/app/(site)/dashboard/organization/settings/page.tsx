import { TextInput } from "@/components/ui/input/TextInput";
import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";
import { StatusMessage } from "@/components/ui/primitives/StatusMessage";
import { DashboardSection } from "../../_components/layout/DashboardSection";
import { requireDashboardCapability } from "../../_registry/access.server";

export default async function DashboardOrganizationSettingsPage() {
	const { context } = await requireDashboardCapability("organization.manage");
	return (
		<DashboardSection
			description="Provider-neutral organization identity and product defaults."
			title="Organization settings"
		>
			<Card>
				<Card.Header>
					<Card.Title>Organization identity</Card.Title>
					<Card.Description>
						The fixture adapter resets these values with the server process.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<form className="grid gap-4">
						<TextInput
							defaultValue={context.organization.name}
							label="Name"
							name="organizationName"
						/>
						<TextInput
							defaultValue={context.organization.slug}
							label="Slug"
							name="organizationSlug"
						/>
						<div>
							<Button disabled size="sm" type="submit">
								Save organization
							</Button>
						</div>
					</form>
				</Card.Content>
			</Card>
			<StatusMessage className="mt-4" tone="info">
				The reference UI is ready; a durable organization adapter must own the
				mutation.
			</StatusMessage>
		</DashboardSection>
	);
}
