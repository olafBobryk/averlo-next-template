import { getMemberIdentityPresentation } from "../entities/member/presentation";
import { getOrganizationPresentation } from "../entities/organization/presentation";
import type {
	PlatformActorSnapshot,
	ProductReport,
	SupportRequest,
} from "./contracts";

export function getPlatformMemberPresentation(actor: PlatformActorSnapshot) {
	return getMemberIdentityPresentation({
		id: actor.membershipId,
		organizationId: actor.organizationId,
		role: actor.role,
		user: {
			email: actor.email,
			id: actor.userId,
			name: actor.name,
			profilePictureUrl: actor.profilePictureUrl,
		},
	});
}

export function getPlatformOrganizationPresentation(
	actor: PlatformActorSnapshot,
) {
	return getOrganizationPresentation({
		id: actor.organizationId,
		name: actor.organizationName,
		profilePictureUrl: actor.organizationProfilePictureUrl,
		role: actor.role,
		slug: actor.organizationSlug,
	});
}

export type PlatformManagedItem = SupportRequest | ProductReport;
