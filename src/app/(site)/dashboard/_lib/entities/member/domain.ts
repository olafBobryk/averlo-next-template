import type { MembershipRole } from "@/lib/auth/contracts";

/** Global identity. Product adapters may source this from any auth provider. */
export type ReferenceUser = {
	email: string;
	id: string;
	name: string | null;
	profilePictureUrl: string | null;
};

/** Organization-scoped identity. Roles never live on the global user. */
export type ReferenceMember = {
	createdAt: string;
	id: string;
	organizationId: string;
	role: MembershipRole;
	user: ReferenceUser;
};
