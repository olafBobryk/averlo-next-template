import { applicationAdapters } from "@/lib/auth/server";
import { DashboardSection } from "../../_components/layout/DashboardSection";
import { isOrganizationInvitationPending } from "../../_lib/entities/invitation/presentation";
import { requireDashboardCapability } from "../../_registry/access.server";
import { OrganizationSettingsSection } from "./_components/OrganizationSettingsSection";

export default async function DashboardOrganizationSettingsPage() {
	const { context } = await requireDashboardCapability("organization.manage");
	const [members, invitations] = await Promise.all([
		applicationAdapters.organizations.listOrganizationMembers(
			context.organization.id,
		),
		applicationAdapters.invitations.listInvitations(context.organization.id),
	]);
	const now = new Date();
	const pendingInvitationCount = invitations.filter((invitation) =>
		isOrganizationInvitationPending(invitation, now),
	).length;

	return (
		<DashboardSection
			contentClassName="grid gap-5"
			title="Organization settings"
		>
			<OrganizationSettingsSection
				activeMemberCount={members.length}
				pendingInvitationCount={pendingInvitationCount}
			/>
		</DashboardSection>
	);
}
