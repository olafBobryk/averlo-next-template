import assert from "node:assert/strict";
import {
	getSafeContinuationPath,
	withSafeContinuation,
} from "../src/lib/auth/continuation";
import { AuthDomainError } from "../src/lib/auth/errors";
import {
	acceptFixtureInvitation,
	authenticateFixturePassword,
	createFixtureAuthState,
	createFixtureInvitation,
	createFixtureSession,
	fixtureAuthMethods,
	previewFixtureInvitation,
	removeFixtureIdentity,
	resolveFixtureSession,
	selectFixtureOrganization,
} from "../src/lib/auth/fixture-core";
import { privateFilePolicy } from "../src/lib/auth/private-files";

function expectCode(action: () => unknown, code: string) {
	assert.throws(action, (error) => {
		return error instanceof AuthDomainError && error.code === code;
	});
}

assert.equal(
	getSafeContinuationPath("/dashboard/records?view=all"),
	"/dashboard/records?view=all",
);
assert.equal(getSafeContinuationPath("https://attacker.example"), "/dashboard");
assert.equal(getSafeContinuationPath("//attacker.example"), "/dashboard");
assert.equal(getSafeContinuationPath("/\\attacker.example"), "/dashboard");
assert.equal(
	withSafeContinuation(
		"/select-organization",
		"/dashboard/settings?motion=off&reveal=off",
	),
	"/select-organization?next=%2Fdashboard%2Fsettings%3Fmotion%3Doff%26reveal%3Doff&motion=off&reveal=off",
);

const singletonState = createFixtureAuthState();
const singletonUser = authenticateFixturePassword(singletonState, {
	email: "operator@averlo.local",
	password: "demo-password",
});
const singletonSession = createFixtureSession(singletonState, singletonUser.id);
const singletonResolution = resolveFixtureSession(
	singletonState,
	singletonSession.id,
);
assert.equal(singletonResolution.status, "resolved");
if (singletonResolution.status === "resolved") {
	assert.equal(singletonResolution.organization.id, "org-demo");
	assert.equal(singletonResolution.session.selectedOrganizationId, "org-demo");
}

const multiState = createFixtureAuthState();
const multiUser = authenticateFixturePassword(multiState, {
	email: "multi@averlo.local",
	password: "demo-password",
});
const multiSession = createFixtureSession(multiState, multiUser.id);
assert.equal(
	resolveFixtureSession(multiState, multiSession.id).status,
	"organization-selection-required",
);
const selected = selectFixtureOrganization(
	multiState,
	multiSession.id,
	"org-sandbox",
);
assert.equal(selected.organization.id, "org-sandbox");
const selectedMembership = [...multiState.memberships.values()].find(
	(membership) =>
		membership.userId === multiUser.id &&
		membership.organizationId === "org-sandbox",
);
assert.ok(selectedMembership);
selectedMembership.status = "revoked";
multiState.memberships.set(selectedMembership.id, selectedMembership);
const afterRevocation = resolveFixtureSession(multiState, multiSession.id);
assert.equal(afterRevocation.status, "resolved");
if (afterRevocation.status === "resolved") {
	assert.equal(afterRevocation.organization.id, "org-demo");
}

const invitationState = createFixtureAuthState(
	new Date("2026-07-19T12:00:00Z"),
);
const fixtureInvitation = [...invitationState.invitations.values()][0];
const beforePreview = fixtureInvitation.acceptedAt;
previewFixtureInvitation(
	invitationState,
	{
		invitationId: fixtureInvitation.id,
		tokenHash: fixtureInvitation.tokenHash,
	},
	new Date("2026-07-19T12:01:00Z"),
);
assert.equal(
	invitationState.invitations.get(fixtureInvitation.id)?.acceptedAt,
	beforePreview,
);
expectCode(
	() =>
		acceptFixtureInvitation(
			invitationState,
			{
				invitationId: fixtureInvitation.id,
				tokenHash: fixtureInvitation.tokenHash,
				userId: "user-template-owner",
			},
			new Date("2026-07-19T12:02:00Z"),
		),
	"invitation-recipient-mismatch",
);
acceptFixtureInvitation(
	invitationState,
	{
		invitationId: fixtureInvitation.id,
		tokenHash: fixtureInvitation.tokenHash,
		userId: "user-invited",
	},
	new Date("2026-07-19T12:03:00Z"),
);
expectCode(
	() =>
		acceptFixtureInvitation(
			invitationState,
			{
				invitationId: fixtureInvitation.id,
				tokenHash: fixtureInvitation.tokenHash,
				userId: "user-invited",
			},
			new Date("2026-07-19T12:04:00Z"),
		),
	"invitation-accepted",
);

const reinviteState = createFixtureAuthState();
const priorInvite = [...reinviteState.invitations.values()][0];
const replacement = createFixtureInvitation(reinviteState, {
	organizationId: priorInvite.organizationId,
	email: priorInvite.email,
	role: "admin",
});
assert.ok(reinviteState.invitations.get(priorInvite.id)?.revokedAt);
assert.equal(replacement.revokedAt, null);
expectCode(
	() =>
		previewFixtureInvitation(reinviteState, {
			invitationId: priorInvite.id,
			tokenHash: priorInvite.tokenHash,
		}),
	"invitation-revoked",
);

const expiredState = createFixtureAuthState(new Date("2026-01-01T00:00:00Z"));
const expiredInvite = [...expiredState.invitations.values()][0];
expectCode(
	() =>
		previewFixtureInvitation(
			expiredState,
			{
				invitationId: expiredInvite.id,
				tokenHash: expiredInvite.tokenHash,
			},
			new Date("2026-02-01T00:00:00Z"),
		),
	"invitation-expired",
);

const identityState = createFixtureAuthState();
const onlyIdentity = identityState.identities.get("user-template-owner")?.[0];
assert.ok(onlyIdentity);
expectCode(
	() =>
		removeFixtureIdentity(identityState, {
			identityId: onlyIdentity.id,
			userId: "user-template-owner",
		}),
	"identity-last-viable",
);

assert.equal(fixtureAuthMethods["magic-link-sign-in"].available, false);
assert.equal(fixtureAuthMethods["password-recovery"].available, false);
assert.ok(privateFilePolicy.signedAccessLifetimeSeconds <= 5 * 60);
assert.ok(privateFilePolicy.maxBytes > 0);

console.log("Auth and organization fixture verification passed.");
