import { randomBytes, randomUUID } from "node:crypto";
import type {
	AdapterMethodAvailability,
	AuthIdentity,
	AuthSession,
	AuthUser,
	Organization,
	OrganizationInvitation,
	OrganizationMembership,
	ResolvedOrganizationContext,
	SessionResolution,
} from "./contracts";
import { AuthDomainError } from "./errors";

const sessionLifetimeMs = 8 * 60 * 60 * 1000;
const invitationLifetimeMs = 7 * 24 * 60 * 60 * 1000;

export const fixtureAuthMethods: AdapterMethodAvailability = {
	"password-sign-in": { available: true },
	"magic-link-sign-in": {
		available: false,
		reason: "The fixture adapter does not send email.",
	},
	"password-recovery": {
		available: false,
		reason: "The fixture adapter does not send recovery email.",
	},
	"password-update": {
		available: false,
		reason: "Fixture credentials reset whenever the server process resets.",
	},
	"identity-link": {
		available: false,
		reason: "No external identity provider is installed.",
	},
	"identity-unlink": { available: true },
};

export type FixtureCredential = {
	email: string;
	password: string;
	userId: string;
};

export type FixtureAuthState = {
	credentials: FixtureCredential[];
	identities: Map<string, AuthIdentity[]>;
	invitations: Map<string, OrganizationInvitation>;
	memberships: Map<string, OrganizationMembership>;
	organizations: Map<string, Organization>;
	sessions: Map<string, AuthSession>;
	users: Map<string, AuthUser>;
};

const initialUsers: AuthUser[] = [
	{
		id: "user-template-owner",
		name: "Template Operator",
		email: "operator@averlo.local",
		isBanned: false,
		identities: [],
	},
	{
		id: "user-multi-org",
		name: "Multi-org Reviewer",
		email: "multi@averlo.local",
		isBanned: false,
		identities: [],
	},
	{
		id: "user-invited",
		name: "Invited Teammate",
		email: "invitee@averlo.local",
		isBanned: false,
		identities: [],
	},
];

const initialOrganizations: Organization[] = [
	{
		id: "org-demo",
		name: "Demo organization",
		slug: "demo",
		mode: "singleton",
	},
	{
		id: "org-sandbox",
		name: "Product sandbox",
		slug: "sandbox",
		mode: "multi",
	},
];

const initialMemberships: OrganizationMembership[] = [
	{
		id: "membership-template-owner",
		organizationId: "org-demo",
		role: "owner",
		status: "active",
		userId: "user-template-owner",
	},
	{
		id: "membership-multi-demo",
		organizationId: "org-demo",
		role: "admin",
		status: "active",
		userId: "user-multi-org",
	},
	{
		id: "membership-multi-sandbox",
		organizationId: "org-sandbox",
		role: "owner",
		status: "active",
		userId: "user-multi-org",
	},
];

function buildIdentity(user: AuthUser): AuthIdentity {
	return {
		id: `identity-email-${user.id}`,
		kind: "email",
		label: user.email,
		provider: "password",
		verified: true,
	};
}

function copyUser(user: AuthUser, identities: readonly AuthIdentity[]) {
	return { ...user, identities: [...identities] };
}

function nowIso(now: Date) {
	return now.toISOString();
}

function opaqueSessionId() {
	return `${randomUUID()}.${randomBytes(24).toString("base64url")}`;
}

export function createFixtureAuthState(now = new Date()): FixtureAuthState {
	const identities = new Map(
		initialUsers.map((user) => [user.id, [buildIdentity(user)]]),
	);
	const users = new Map(
		initialUsers.map((user) => [
			user.id,
			copyUser(user, identities.get(user.id) ?? []),
		]),
	);
	const invitation: OrganizationInvitation = {
		id: "00000000-0000-4000-8000-000000000001",
		organizationId: "org-demo",
		email: "invitee@averlo.local",
		role: "member",
		tokenHash: "fixture-invitation-token",
		createdAt: nowIso(now),
		expiresAt: nowIso(new Date(now.getTime() + invitationLifetimeMs)),
		acceptedAt: null,
		revokedAt: null,
	};

	return {
		credentials: initialUsers.map((user) => ({
			email: user.email,
			password: "demo-password",
			userId: user.id,
		})),
		identities,
		invitations: new Map([[invitation.id, invitation]]),
		memberships: new Map(
			initialMemberships.map((membership) => [
				membership.id,
				{ ...membership },
			]),
		),
		organizations: new Map(
			initialOrganizations.map((organization) => [
				organization.id,
				{ ...organization },
			]),
		),
		sessions: new Map(),
		users,
	};
}

export function authenticateFixturePassword(
	state: FixtureAuthState,
	input: { email: string; password: string },
) {
	const email = input.email.trim().toLowerCase();
	const credential = state.credentials.find(
		(candidate) =>
			candidate.email === email && candidate.password === input.password,
	);
	const user = credential ? state.users.get(credential.userId) : null;
	if (!user || user.isBanned) {
		throw new AuthDomainError("invalid-credentials");
	}
	return copyUser(user, state.identities.get(user.id) ?? []);
}

export function createFixtureSession(
	state: FixtureAuthState,
	userId: string,
	now = new Date(),
) {
	if (!state.users.has(userId)) {
		throw new AuthDomainError("invalid-credentials");
	}

	const session: AuthSession = {
		id: opaqueSessionId(),
		userId,
		selectedOrganizationId: null,
		createdAt: nowIso(now),
		expiresAt: nowIso(new Date(now.getTime() + sessionLifetimeMs)),
	};
	state.sessions.set(session.id, session);
	return { ...session };
}

export function getFixtureSession(
	state: FixtureAuthState,
	sessionId: string,
	now = new Date(),
) {
	const session = state.sessions.get(sessionId);
	if (!session) return null;
	if (new Date(session.expiresAt).getTime() <= now.getTime()) {
		state.sessions.delete(sessionId);
		return null;
	}
	return { ...session };
}

export function listActiveFixtureMemberships(
	state: FixtureAuthState,
	userId: string,
) {
	return [...state.memberships.values()].filter(
		(membership) =>
			membership.userId === userId && membership.status === "active",
	);
}

function buildResolvedContext(
	state: FixtureAuthState,
	session: AuthSession,
	membership: OrganizationMembership,
): ResolvedOrganizationContext {
	const user = state.users.get(session.userId);
	const organization = state.organizations.get(membership.organizationId);
	if (!user || !organization) {
		throw new AuthDomainError("membership-required");
	}

	return {
		session: { ...session },
		user: copyUser(user, state.identities.get(user.id) ?? []),
		organization: { ...organization },
		membership: { ...membership },
		memberships: listActiveFixtureMemberships(state, user.id),
	};
}

export function resolveFixtureSession(
	state: FixtureAuthState,
	sessionId: string | null,
	now = new Date(),
): SessionResolution {
	if (!sessionId) return { status: "anonymous" };
	const session = getFixtureSession(state, sessionId, now);
	if (!session) return { status: "anonymous" };
	const user = state.users.get(session.userId);
	if (!user || user.isBanned) return { status: "anonymous" };

	const memberships = listActiveFixtureMemberships(state, user.id);
	const selectedMembership = memberships.find(
		(membership) =>
			membership.organizationId === session.selectedOrganizationId,
	);
	if (selectedMembership) {
		return {
			status: "resolved",
			...buildResolvedContext(state, session, selectedMembership),
		};
	}

	if (session.selectedOrganizationId) {
		session.selectedOrganizationId = null;
		state.sessions.set(session.id, session);
	}

	if (memberships.length === 1) {
		session.selectedOrganizationId = memberships[0].organizationId;
		state.sessions.set(session.id, session);
		return {
			status: "resolved",
			...buildResolvedContext(state, session, memberships[0]),
		};
	}

	if (memberships.length > 1) {
		return {
			status: "organization-selection-required",
			session: { ...session },
			user: copyUser(user, state.identities.get(user.id) ?? []),
			memberships,
		};
	}

	return {
		status: "membership-required",
		session: { ...session },
		user: copyUser(user, state.identities.get(user.id) ?? []),
		memberships: [],
	};
}

export function selectFixtureOrganization(
	state: FixtureAuthState,
	sessionId: string,
	organizationId: string,
) {
	const session = getFixtureSession(state, sessionId);
	if (!session) throw new AuthDomainError("session-required");
	const membership = listActiveFixtureMemberships(state, session.userId).find(
		(candidate) => candidate.organizationId === organizationId,
	);
	if (!membership) throw new AuthDomainError("membership-required");
	session.selectedOrganizationId = organizationId;
	state.sessions.set(session.id, session);
	return buildResolvedContext(state, session, membership);
}

export function updateFixtureUser(
	state: FixtureAuthState,
	userId: string,
	patch: Partial<Pick<AuthUser, "name" | "profilePictureUrl">>,
) {
	const user = state.users.get(userId);
	if (!user) throw new AuthDomainError("session-required");
	const next = {
		...user,
		name: patch.name?.trim() || user.name,
		profilePictureUrl: Object.hasOwn(patch, "profilePictureUrl")
			? patch.profilePictureUrl
			: user.profilePictureUrl,
	};
	state.users.set(userId, next);
	return copyUser(next, state.identities.get(userId) ?? []);
}

function validateFixtureInvitation(
	state: FixtureAuthState,
	input: { invitationId: string; tokenHash: string },
	now = new Date(),
) {
	const invitation = state.invitations.get(input.invitationId);
	if (!invitation || invitation.tokenHash !== input.tokenHash) {
		throw new AuthDomainError("invitation-invalid");
	}
	if (invitation.revokedAt) {
		throw new AuthDomainError("invitation-revoked");
	}
	if (invitation.acceptedAt) {
		throw new AuthDomainError("invitation-accepted");
	}
	if (new Date(invitation.expiresAt).getTime() <= now.getTime()) {
		throw new AuthDomainError("invitation-expired");
	}
	return invitation;
}

export function previewFixtureInvitation(
	state: FixtureAuthState,
	input: { invitationId: string; tokenHash: string },
	now = new Date(),
) {
	return { ...validateFixtureInvitation(state, input, now) };
}

export function acceptFixtureInvitation(
	state: FixtureAuthState,
	input: { invitationId: string; tokenHash: string; userId: string },
	now = new Date(),
) {
	const invitation = validateFixtureInvitation(state, input, now);
	const user = state.users.get(input.userId);
	if (!user) throw new AuthDomainError("session-required");
	if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
		throw new AuthDomainError("invitation-recipient-mismatch");
	}

	const existing = [...state.memberships.values()].find(
		(membership) =>
			membership.userId === user.id &&
			membership.organizationId === invitation.organizationId,
	);
	const membership: OrganizationMembership = existing
		? { ...existing, role: invitation.role, status: "active" }
		: {
				id: `membership-${randomUUID()}`,
				organizationId: invitation.organizationId,
				role: invitation.role,
				status: "active",
				userId: user.id,
			};

	// This synchronous state transition is the fixture adapter's atomic boundary.
	state.memberships.set(membership.id, membership);
	state.invitations.set(invitation.id, {
		...invitation,
		acceptedAt: nowIso(now),
	});
	return { ...membership };
}

export function createFixtureInvitation(
	state: FixtureAuthState,
	input: Pick<OrganizationInvitation, "email" | "organizationId" | "role">,
	now = new Date(),
) {
	const email = input.email.trim().toLowerCase();
	for (const [id, invitation] of state.invitations) {
		if (
			invitation.email.toLowerCase() === email &&
			invitation.organizationId === input.organizationId &&
			!invitation.acceptedAt &&
			!invitation.revokedAt
		) {
			state.invitations.set(id, {
				...invitation,
				revokedAt: nowIso(now),
			});
		}
	}

	const invitation: OrganizationInvitation = {
		id: randomUUID(),
		organizationId: input.organizationId,
		email,
		role: input.role,
		tokenHash: randomBytes(24).toString("base64url"),
		createdAt: nowIso(now),
		expiresAt: nowIso(new Date(now.getTime() + invitationLifetimeMs)),
		acceptedAt: null,
		revokedAt: null,
	};
	state.invitations.set(invitation.id, invitation);
	return { ...invitation };
}

export function removeFixtureIdentity(
	state: FixtureAuthState,
	input: { identityId: string; userId: string },
) {
	const identities = state.identities.get(input.userId) ?? [];
	const identity = identities.find(
		(candidate) => candidate.id === input.identityId,
	);
	if (!identity) return [...identities];
	const viable = identities.filter((candidate) => candidate.verified);
	if (identity.verified && viable.length <= 1) {
		throw new AuthDomainError("identity-last-viable");
	}
	const next = identities.filter(
		(candidate) => candidate.id !== input.identityId,
	);
	state.identities.set(input.userId, next);
	const user = state.users.get(input.userId);
	if (user) state.users.set(user.id, copyUser(user, next));
	return [...next];
}
