import type {
	Organization,
	OrganizationMembership,
} from "@/lib/auth/contracts";

export type AccountEntity = {
	membership: OrganizationMembership;
	organization: Organization;
	user: {
		email: string;
		id: string;
		name: string;
		profilePictureUrl?: string;
	};
};
