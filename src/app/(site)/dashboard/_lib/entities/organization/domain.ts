import type { MembershipRole, Organization } from "@/lib/auth/contracts";

export type OrganizationEntity = {
	id: string;
	name: string;
	profilePictureUrl: string | null;
	role: MembershipRole | null;
	slug: string;
};

export function toOrganizationEntity(
	organization: Organization,
	role?: MembershipRole | null,
): OrganizationEntity {
	return {
		id: organization.id,
		name: organization.name,
		profilePictureUrl: organization.profilePictureUrl?.trim() || null,
		role: role ?? null,
		slug: organization.slug,
	};
}
