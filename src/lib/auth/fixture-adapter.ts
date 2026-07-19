import "server-only";

import type {
	ApplicationAdapters,
	AuthUser,
	OrganizationInvitation,
} from "./contracts";
import {
	acceptFixtureInvitation,
	authenticateFixturePassword,
	createFixtureAuthState,
	createFixtureInvitation,
	createFixtureSession,
	type FixtureAuthState,
	fixtureAuthMethods,
	getFixtureSession,
	listActiveFixtureMemberships,
	previewFixtureInvitation,
	removeFixtureIdentity,
	resolveFixtureSession,
	selectFixtureOrganization,
	updateFixtureUser,
} from "./fixture-core";

declare global {
	var __averloFixtureAuthState: FixtureAuthState | undefined;
}

export function getFixtureAuthState() {
	globalThis.__averloFixtureAuthState ??= createFixtureAuthState();
	return globalThis.__averloFixtureAuthState;
}

export function resetFixtureAuthState() {
	globalThis.__averloFixtureAuthState = createFixtureAuthState();
	return globalThis.__averloFixtureAuthState;
}

export const fixtureAdapters: ApplicationAdapters = {
	auth: {
		id: "fixture",
		durability: "non-durable-fixture",
		methods: fixtureAuthMethods,
		async authenticatePassword(input) {
			return authenticateFixturePassword(getFixtureAuthState(), input);
		},
		async createSession(userId) {
			return createFixtureSession(getFixtureAuthState(), userId);
		},
		async getSession(sessionId) {
			return getFixtureSession(getFixtureAuthState(), sessionId);
		},
		async deleteSession(sessionId) {
			getFixtureAuthState().sessions.delete(sessionId);
		},
		async updateUser(
			userId,
			patch: Partial<Pick<AuthUser, "name" | "profilePictureUrl">>,
		) {
			return updateFixtureUser(getFixtureAuthState(), userId, patch);
		},
	},
	organizations: {
		async resolveSession(sessionId) {
			return resolveFixtureSession(getFixtureAuthState(), sessionId);
		},
		async getOrganization(organizationId) {
			return getFixtureAuthState().organizations.get(organizationId) ?? null;
		},
		async selectOrganization(sessionId, organizationId) {
			return selectFixtureOrganization(
				getFixtureAuthState(),
				sessionId,
				organizationId,
			);
		},
		async listMemberships(userId) {
			return listActiveFixtureMemberships(getFixtureAuthState(), userId);
		},
	},
	invitations: {
		async previewInvitation(input) {
			return previewFixtureInvitation(getFixtureAuthState(), input);
		},
		async acceptInvitation(input) {
			return acceptFixtureInvitation(getFixtureAuthState(), input);
		},
		async createInvitation(
			input: Pick<OrganizationInvitation, "email" | "organizationId" | "role">,
		) {
			return createFixtureInvitation(getFixtureAuthState(), input);
		},
	},
	identities: {
		async removeIdentity(input) {
			return removeFixtureIdentity(getFixtureAuthState(), input);
		},
	},
};
