import type {
	MembershipRole,
	Organization,
	OrganizationInvitation,
	OrganizationMembership,
	PlatformRole,
} from "@/lib/auth/contracts";

export type SessionUser = {
	id: string;
	name: string;
	email: string;
	role: "owner" | "member" | "admin";
	isBanned: boolean;
	platformRole: PlatformRole | null;
	profilePictureUrl?: string;
};

type SessionResponse = {
	user: SessionUser | null;
	status?:
		| "anonymous"
		| "membership-required"
		| "organization-selection-required"
		| "resolved";
};

type LoginOptions = {
	banned?: boolean;
};

type LogoutResponse = {
	message: string;
};

export type PasswordRecoveryResponse = {
	delivery: "email" | "local";
	message: string;
	previewUrl?: string;
};

let cachedUser: SessionUser | null = null;

export class AuthApiError extends Error {
	readonly code?: string;

	constructor(message: string, code?: string) {
		super(message);
		this.name = "AuthApiError";
		this.code = code;
	}
}

async function readJson<T>(response: Response): Promise<T> {
	const body = (await response.json()) as T & {
		code?: string;
		message?: string;
	};
	if (!response.ok) {
		throw new AuthApiError(
			body.message ?? "The authentication request failed.",
			body.code,
		);
	}
	return body;
}

export async function fetchSession(): Promise<SessionResponse> {
	const response = await fetch("/api/auth/session", {
		cache: "no-store",
		credentials: "same-origin",
	});
	const body = await readJson<SessionResponse>(response);
	cachedUser = body.user;
	return body;
}

export async function login(
	options?: LoginOptions,
): Promise<SessionResponse & { message: string }> {
	const response = await fetch("/api/auth/login", {
		method: "POST",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			email: options?.banned
				? "restricted@averlo.local"
				: "operator@averlo.local",
			password: "demo-password",
		}),
	});
	const body = await readJson<SessionResponse>(response);
	cachedUser = body.user;
	return { ...body, message: "Signed in to the dashboard template." };
}

export async function logout(): Promise<LogoutResponse> {
	const response = await fetch("/api/auth/logout", {
		method: "POST",
		credentials: "same-origin",
	});
	cachedUser = null;
	return readJson<LogoutResponse>(response);
}

export async function requestPasswordRecovery(email: string) {
	const response = await fetch("/api/auth/password-recovery", {
		method: "POST",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ email }),
	});
	return readJson<PasswordRecoveryResponse>(response);
}

export async function resetPassword(input: {
	password: string;
	token: string;
}) {
	const response = await fetch("/api/auth/reset-password", {
		method: "POST",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(input),
	});
	return readJson<{ message: string }>(response);
}

export async function selectOrganization(organizationId: string) {
	const response = await fetch("/api/auth/organization", {
		method: "POST",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ organizationId }),
	});
	await readJson(response);
}

export type OrganizationUpdateInput = {
	name?: string;
	profilePictureUrl?: string | null;
	slug?: string;
};

export async function updateOrganization(input: OrganizationUpdateInput) {
	const response = await fetch("/api/auth/organization", {
		method: "PATCH",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(input),
	});
	const result = await readJson<{ organization: Organization }>(response);
	return result.organization;
}

async function administrationRequest<T>(path: string, init: RequestInit) {
	const response = await fetch(path, {
		...init,
		credentials: "same-origin",
		headers: { "content-type": "application/json", ...init.headers },
	});
	return readJson<T>(response);
}

export async function createOrganizationInvitation(input: {
	email: string;
	role: Exclude<MembershipRole, "owner">;
}) {
	return administrationRequest<{ invitation: OrganizationInvitation }>(
		"/api/auth/administration/invitations",
		{ method: "POST", body: JSON.stringify(input) },
	);
}

export async function refreshOrganizationInvitation(invitationId: string) {
	return administrationRequest<{ invitation: OrganizationInvitation }>(
		`/api/auth/administration/invitations/${encodeURIComponent(invitationId)}`,
		{ method: "PATCH", body: "{}" },
	);
}

export async function revokeOrganizationInvitation(invitationId: string) {
	return administrationRequest<{ invitation: OrganizationInvitation }>(
		`/api/auth/administration/invitations/${encodeURIComponent(invitationId)}`,
		{ method: "DELETE" },
	);
}

export async function updateOrganizationMembershipRole(
	membershipId: string,
	role: Exclude<MembershipRole, "owner">,
) {
	return administrationRequest<{ membership: OrganizationMembership }>(
		`/api/auth/administration/memberships/${encodeURIComponent(membershipId)}`,
		{
			method: "PATCH",
			body: JSON.stringify({ action: "change-role", role }),
		},
	);
}

export async function transferOrganizationOwnership(membershipId: string) {
	return administrationRequest<{
		currentOwner: OrganizationMembership;
		newOwner: OrganizationMembership;
	}>(
		`/api/auth/administration/memberships/${encodeURIComponent(membershipId)}`,
		{
			method: "PATCH",
			body: JSON.stringify({ action: "transfer-ownership" }),
		},
	);
}

export async function removeOrganizationMembership(membershipId: string) {
	return administrationRequest<{ membership: OrganizationMembership }>(
		`/api/auth/administration/memberships/${encodeURIComponent(membershipId)}`,
		{ method: "DELETE" },
	);
}

export function updateStoredSessionUser(
	patch: Partial<SessionUser>,
): SessionUser | null {
	const current = cachedUser;
	if (!current) return null;

	const nextUser = { ...current, ...patch };
	cachedUser = nextUser;
	void updateSessionUser(patch).catch(() => undefined);
	return nextUser;
}

export async function updateSessionUser(patch: Partial<SessionUser>) {
	const payload: Record<string, unknown> = { ...patch };
	if (
		Object.hasOwn(patch, "profilePictureUrl") &&
		patch.profilePictureUrl === undefined
	) {
		payload.profilePictureUrl = null;
	}
	const response = await fetch("/api/auth/session", {
		method: "PATCH",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(payload),
	});
	const result = await readJson<{ user: SessionUser }>(response);
	cachedUser = result.user;
	return result.user;
}
