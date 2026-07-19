export type AuthIdentityKind = "email" | "oauth";

export type AuthIdentity = {
	id: string;
	kind: AuthIdentityKind;
	label: string;
	provider: string;
	verified: boolean;
};

export type AuthUser = {
	id: string;
	name: string;
	email: string;
	isBanned: boolean;
	profilePictureUrl?: string;
	identities: readonly AuthIdentity[];
};

export type Organization = {
	id: string;
	name: string;
	slug: string;
	mode: "singleton" | "multi";
};

export type MembershipRole = "owner" | "admin" | "member";

export type OrganizationMembership = {
	id: string;
	organizationId: string;
	role: MembershipRole;
	status: "active" | "revoked";
	userId: string;
};

export type OrganizationInvitation = {
	id: string;
	organizationId: string;
	email: string;
	role: Exclude<MembershipRole, "owner">;
	tokenHash: string;
	expiresAt: string;
	createdAt: string;
	acceptedAt: string | null;
	revokedAt: string | null;
};

export type AuthSession = {
	id: string;
	userId: string;
	selectedOrganizationId: string | null;
	createdAt: string;
	expiresAt: string;
};

export type AuthMethod =
	| "password-sign-in"
	| "magic-link-sign-in"
	| "password-recovery"
	| "password-update"
	| "identity-link"
	| "identity-unlink";

export type AdapterMethodAvailability = Record<
	AuthMethod,
	{ available: boolean; reason?: string }
>;

export type ResolvedOrganizationContext = {
	session: AuthSession;
	user: AuthUser;
	organization: Organization;
	membership: OrganizationMembership;
	memberships: readonly OrganizationMembership[];
};

export type SessionResolution =
	| { status: "anonymous" }
	| {
			status: "membership-required";
			session: AuthSession;
			user: AuthUser;
			memberships: readonly OrganizationMembership[];
	  }
	| {
			status: "organization-selection-required";
			session: AuthSession;
			user: AuthUser;
			memberships: readonly OrganizationMembership[];
	  }
	| ({ status: "resolved" } & ResolvedOrganizationContext);

export interface AuthAdapter {
	readonly id: string;
	readonly durability: "non-durable-fixture" | "durable";
	readonly methods: AdapterMethodAvailability;
	authenticatePassword(input: {
		email: string;
		password: string;
	}): Promise<AuthUser>;
	createSession(userId: string): Promise<AuthSession>;
	getSession(sessionId: string): Promise<AuthSession | null>;
	deleteSession(sessionId: string): Promise<void>;
	updateUser(
		userId: string,
		patch: Partial<Pick<AuthUser, "name" | "profilePictureUrl">>,
	): Promise<AuthUser>;
}

export interface OrganizationAdapter {
	resolveSession(sessionId: string | null): Promise<SessionResolution>;
	getOrganization(organizationId: string): Promise<Organization | null>;
	selectOrganization(
		sessionId: string,
		organizationId: string,
	): Promise<ResolvedOrganizationContext>;
	listMemberships(userId: string): Promise<readonly OrganizationMembership[]>;
}

export interface InvitationAdapter {
	previewInvitation(input: {
		invitationId: string;
		tokenHash: string;
	}): Promise<OrganizationInvitation>;
	acceptInvitation(input: {
		invitationId: string;
		tokenHash: string;
		userId: string;
	}): Promise<OrganizationMembership>;
	createInvitation(input: {
		organizationId: string;
		email: string;
		role: Exclude<MembershipRole, "owner">;
	}): Promise<OrganizationInvitation>;
}

export interface IdentityAdapter {
	removeIdentity(input: {
		identityId: string;
		userId: string;
	}): Promise<readonly AuthIdentity[]>;
}

export type ApplicationAdapters = {
	auth: AuthAdapter;
	organizations: OrganizationAdapter;
	invitations: InvitationAdapter;
	identities: IdentityAdapter;
};
