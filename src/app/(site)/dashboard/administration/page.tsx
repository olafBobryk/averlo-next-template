import { Suspense } from "react";
import { applicationAdapters } from "@/lib/auth/server";
import { DashboardSection } from "../_components/layout/DashboardSection";
import { toOrganizationMemberEntity } from "../_lib/entities/member/domain";
import { requireDashboardCapability } from "../_registry/access.server";
import { AdministrationClient } from "./AdministrationClient";

export default async function DashboardAdministrationPage() {
	const { context } = await requireDashboardCapability("organization.manage");
	const [memberRecords, invitations] = await Promise.all([
		applicationAdapters.organizations.listOrganizationMembers(
			context.organization.id,
		),
		applicationAdapters.invitations.listInvitations(context.organization.id),
	]);
	return (
		<DashboardSection contentClassName="grid gap-5" title="Administration">
			<Suspense>
				<AdministrationClient
					actorMembershipId={context.membership.id}
					actorRole={context.membership.role}
					invitations={invitations.filter(
						(invitation) => !invitation.acceptedAt && !invitation.revokedAt,
					)}
					members={memberRecords.map(toOrganizationMemberEntity)}
					organizationName={context.organization.name}
				/>
			</Suspense>
		</DashboardSection>
	);
}
