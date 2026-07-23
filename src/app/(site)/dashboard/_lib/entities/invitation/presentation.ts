import type { OrganizationInvitation } from "@/lib/auth/contracts";
import { formatMemberJoinedDate } from "../member/presentation";

export function getInvitationPresentation(
	invitation: OrganizationInvitation,
	now = new Date(),
) {
	const expired = new Date(invitation.expiresAt).getTime() <= now.getTime();
	return {
		emailLabel: invitation.email,
		expiresAtLabel: formatMemberJoinedDate(invitation.expiresAt),
		href: `/invitation?invitation=${encodeURIComponent(invitation.id)}&token=${encodeURIComponent(invitation.tokenHash)}&next=${encodeURIComponent("/dashboard")}`,
		id: invitation.id,
		roleLabel: invitation.role === "admin" ? "Admin" : "Member",
		sentAtLabel: formatMemberJoinedDate(invitation.createdAt),
		status: expired ? ("expired" as const) : ("pending" as const),
	};
}

export function isOrganizationInvitationPending(
	invitation: OrganizationInvitation,
	now = new Date(),
) {
	return (
		!invitation.acceptedAt &&
		!invitation.revokedAt &&
		getInvitationPresentation(invitation, now).status === "pending"
	);
}

export type InvitationPresentation = ReturnType<
	typeof getInvitationPresentation
>;
