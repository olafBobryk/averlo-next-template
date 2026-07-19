export type SessionUser = {
	id: string;
	name: string;
	email: string;
	role: "owner" | "member" | "admin";
	isBanned: boolean;
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

let cachedUser: SessionUser | null = null;

async function readJson<T>(response: Response): Promise<T> {
	const body = (await response.json()) as T & { message?: string };
	if (!response.ok) {
		throw new Error(body.message ?? "The authentication request failed.");
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
