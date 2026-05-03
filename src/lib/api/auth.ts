export type SessionUser = {
	id: string;
	name: string;
	email: string;
	role: "member" | "admin";
	isBanned: boolean;
	profilePictureUrl?: string;
};

type SessionResponse = {
	user: SessionUser | null;
};

type LoginOptions = {
	banned?: boolean;
};

type LogoutResponse = {
	message: string;
};

const STORAGE_KEY = "webvizion-dashboard-session";
const DEFAULT_DELAY_MS = 200;

const DEFAULT_USER: SessionUser = {
	id: "demo-user",
	name: "Template Operator",
	email: "operator@webvizion.local",
	role: "admin",
	isBanned: false,
};

function wait(ms = DEFAULT_DELAY_MS) {
	return new Promise<void>((resolve) => {
		setTimeout(resolve, ms);
	});
}

function readStoredUser(): SessionUser | null {
	if (typeof window === "undefined") return null;

	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		return JSON.parse(raw) as SessionUser;
	} catch {
		return null;
	}
}

function writeStoredUser(user: SessionUser | null) {
	if (typeof window === "undefined") return;

	try {
		if (!user) {
			window.localStorage.removeItem(STORAGE_KEY);
			return;
		}

		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
	} catch {
		// Ignore storage failures in mock auth mode.
	}
}

export async function fetchSession(): Promise<SessionResponse> {
	await wait();
	return { user: readStoredUser() };
}

export async function login(
	options?: LoginOptions,
): Promise<SessionResponse & { message: string }> {
	await wait(250);
	const user = {
		...DEFAULT_USER,
		isBanned: options?.banned ?? false,
		name: options?.banned ? "Restricted Operator" : DEFAULT_USER.name,
	};
	writeStoredUser(user);
	return {
		user,
		message: "Signed in to the dashboard template.",
	};
}

export async function logout(): Promise<LogoutResponse> {
	await wait();
	writeStoredUser(null);
	return { message: "Signed out of the dashboard template." };
}

export function updateStoredSessionUser(
	patch: Partial<SessionUser>,
): SessionUser | null {
	const current = readStoredUser();
	if (!current) return null;

	const nextUser = { ...current, ...patch };
	writeStoredUser(nextUser);
	return nextUser;
}
