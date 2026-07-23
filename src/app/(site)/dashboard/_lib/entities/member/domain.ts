import type { MembershipRole, OrganizationMember } from "@/lib/auth/contracts";

/** Global identity. Product adapters may source this from any auth provider. */
export type MemberUser = {
	email: string;
	id: string;
	name: string | null;
	profilePictureUrl: string | null;
};

/** Organization-scoped identity. Roles never live on the global user. */
export type OrganizationMemberEntity = {
	createdAt: string;
	id: string;
	organizationId: string;
	role: MembershipRole;
	user: MemberUser;
};

export type ReferenceMember = OrganizationMemberEntity;

export function toOrganizationMemberEntity(
	record: OrganizationMember,
): OrganizationMemberEntity {
	return {
		createdAt: record.membership.createdAt,
		id: record.membership.id,
		organizationId: record.membership.organizationId,
		role: record.membership.role,
		user: {
			email: record.user.email,
			id: record.user.id,
			name: record.user.name,
			profilePictureUrl: record.user.profilePictureUrl ?? null,
		},
	};
}
