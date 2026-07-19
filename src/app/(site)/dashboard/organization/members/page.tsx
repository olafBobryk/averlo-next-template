import { Icon } from "@/components/ui/icons/Icon";
import { DashboardEntityCommands } from "../../_components/commands/DashboardEntityCommands";
import { DashboardTablePanel } from "../../_components/data/DashboardTablePanel";
import { DashboardEntityState } from "../../_components/entities/DashboardEntityState";
import { MemberIdentity } from "../../_components/entities/member/MemberIdentity";
import { MemberRoleChip } from "../../_components/entities/member/MemberRoleChip";
import { DashboardSection } from "../../_components/layout/DashboardSection";
import {
	getMemberCommand,
	getMemberPresentation,
	memberColumnDefinitions,
	memberPresentationDefinition,
} from "../../_lib/entities/member/presentation";
import { listReferenceMembers } from "../../_lib/fixtures/reference-members.server";
import { requireDashboardCapability } from "../../_registry/access.server";

export default async function DashboardOrganizationMembersPage() {
	const { context } = await requireDashboardCapability("organization.read");
	const members = listReferenceMembers(context.organization.id);
	const presentations = members.map(getMemberPresentation);
	return (
		<DashboardSection
			description={`Organization-scoped membership identities for ${context.organization.name}.`}
			title="Members"
		>
			<DashboardEntityCommands
				commands={presentations.map(getMemberCommand)}
				ownerId="dashboard.organization.members.entities"
			/>
			<DashboardTablePanel
				columns={[
					{
						header: memberColumnDefinitions[0].label,
						id: memberColumnDefinitions[0].id,
						render: (member) => (
							<MemberIdentity
								href
								presentation={getMemberPresentation(member)}
								variant="compact"
							/>
						),
					},
					{
						header: memberColumnDefinitions[1].label,
						id: memberColumnDefinitions[1].id,
						render: (member) => {
							const role = getMemberPresentation(member).role;
							return (
								<MemberRoleChip label={role.shortLabel} tone={role.tone} />
							);
						},
						rowLink: false,
					},
					{
						header: memberColumnDefinitions[2].label,
						id: memberColumnDefinitions[2].id,
						render: (member) => getMemberPresentation(member).joinedAtLabel,
					},
				]}
				description="The global user and organization membership remain separate inputs."
				emptyState={
					<DashboardEntityState
						description={memberPresentationDefinition.emptyState.description}
						iconName={memberPresentationDefinition.emptyState.icon}
						title={memberPresentationDefinition.emptyState.title}
					/>
				}
				getRowAriaLabel={(member) =>
					`Open ${getMemberPresentation(member).displayLabel}`
				}
				getRowHref={(member) => getMemberPresentation(member).href}
				getRowKey={(member) => member.id}
				icon={<Icon name={memberPresentationDefinition.icon} size="sm" />}
				id="organization-members"
				rows={members}
				title={memberPresentationDefinition.nouns.plural}
			/>
		</DashboardSection>
	);
}
