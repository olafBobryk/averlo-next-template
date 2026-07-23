import { Icon } from "@/components/ui/icons/Icon";
import { Chip } from "@/components/ui/misc/Chip";
import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";
import { DashboardDetailField } from "../_components/detail/DashboardDetailField";
import { OrganizationIdentity } from "../_components/entities/organization/OrganizationIdentity";
import {
	DashboardFooterNote,
	DashboardFooterNoteLink,
} from "../_components/layout/DashboardFooterNote";
import { DashboardSection } from "../_components/layout/DashboardSection";
import { memberRolePresentation } from "../_lib/entities/member/presentation";
import { toOrganizationEntity } from "../_lib/entities/organization/domain";
import { getOrganizationPresentation } from "../_lib/entities/organization/presentation";
import { requireDashboardCapability } from "../_registry/access.server";

export default async function DashboardOrganizationPage() {
	const { capabilities, context } =
		await requireDashboardCapability("organization.read");
	const presentation = getOrganizationPresentation(
		toOrganizationEntity(context.organization, context.membership.role),
	);
	const canManage = capabilities.has("organization.manage");
	const rolePresentation = memberRolePresentation[context.membership.role];

	return (
		<DashboardSection
			actions={
				canManage ? (
					<Button
						href="/dashboard/organization/settings"
						size="sm"
						variant="primary"
					>
						Organization settings
					</Button>
				) : null
			}
			contentClassName="grid gap-5"
			title="Organization"
		>
			<Card>
				<Card.Header className="border-b">
					<Card.Title className="inline-flex items-center gap-2">
						<Icon className="text-muted-foreground" name="building" size="sm" />
						Organization identity
					</Card.Title>
					<Card.Description>
						The active organization for this dashboard session.
					</Card.Description>
				</Card.Header>
				<Card.Content className="grid gap-5">
					<OrganizationIdentity avatarSize="xl" presentation={presentation} />
					<dl className="grid gap-4 border-t border-border/70 pt-5 sm:grid-cols-2">
						<DashboardDetailField
							icon={<Icon name="building" size="sm" />}
							label="Name"
							value={context.organization.name}
						/>
						<DashboardDetailField
							copyLabel="Copy organization slug"
							copyValue={context.organization.slug}
							icon={<Icon name="at" size="sm" />}
							label="Slug"
							value={context.organization.slug}
						/>
						<DashboardDetailField
							icon={<Icon name="shield" size="sm" />}
							label="Your role"
							value={
								<Chip color={rolePresentation.tone}>
									{rolePresentation.shortLabel}
								</Chip>
							}
						/>
						<DashboardDetailField
							icon={<Icon name="users" size="sm" />}
							label="Organization mode"
							value={
								context.organization.mode === "multi"
									? "Multi-organization"
									: "Single organization"
							}
						/>
					</dl>
				</Card.Content>
			</Card>

			<DashboardFooterNote>
				Looking for account preferences?{" "}
				<DashboardFooterNoteLink href="/dashboard/settings">
					Open Account settings
				</DashboardFooterNoteLink>
				.
			</DashboardFooterNote>
		</DashboardSection>
	);
}
