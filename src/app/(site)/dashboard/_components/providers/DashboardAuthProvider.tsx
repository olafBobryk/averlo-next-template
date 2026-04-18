"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import {
	fetchSession,
	logout as clearSession,
	type SessionUser,
	updateStoredSessionUser,
} from "@/lib/api/auth";
import {
	DashboardBannedFallback,
	DashboardLoadingFallback,
	DashboardUnauthenticatedFallback,
} from "../pages/DashboardAuthFallbacks";
import { hrefFor } from "@/lib/routes";

export type DashboardAuthContextValue = {
	user: SessionUser | null;
	initializing: boolean;
	loading: boolean;
	error: Error | null;
	refresh: (options?: { silent?: boolean }) => Promise<void>;
	logout: () => Promise<void>;
	updateUser: (patch: Partial<SessionUser>) => void;
};

const DashboardAuthContext =
	React.createContext<DashboardAuthContextValue | null>(null);

function getError(error: unknown) {
	return error instanceof Error
		? error
		: new Error("Unable to resolve the dashboard session.");
}

export function DashboardAuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = React.useState<SessionUser | null>(null);
	const [initializing, setInitializing] = React.useState(true);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<Error | null>(null);

	const refresh = React.useCallback(
		async (options?: { silent?: boolean }) => {
			const silent = options?.silent ?? false;
			if (!silent) {
				setLoading(true);
			}
			setError(null);

			try {
				const response = await fetchSession();
				setUser(response.user);
			} catch (nextError) {
				setUser(null);
				setError(getError(nextError));
			} finally {
				if (!silent) {
					setLoading(false);
				}
			}
		},
		[],
	);

	const logout = React.useCallback(async () => {
		setLoading(true);
		try {
			await clearSession();
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	const updateUser = React.useCallback((patch: Partial<SessionUser>) => {
		setUser((current) => {
			if (!current) return current;
			const nextUser = { ...current, ...patch };
			updateStoredSessionUser(patch);
			return nextUser;
		});
	}, []);

	React.useEffect(() => {
		let active = true;

		void refresh({ silent: true }).finally(() => {
			if (!active) return;
			setInitializing(false);
		});

		return () => {
			active = false;
		};
	}, [refresh]);

	return (
		<DashboardAuthContext.Provider
			value={{
				user,
				initializing,
				loading,
				error,
				refresh,
				logout,
				updateUser,
			}}
		>
			{children}
		</DashboardAuthContext.Provider>
	);
}

export function useDashboardAuth() {
	const context = React.useContext(DashboardAuthContext);
	if (!context) {
		throw new Error(
			"useDashboardAuth must be used within DashboardAuthProvider.",
		);
	}
	return context;
}

export function DashboardAuthGate({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const { user, initializing } = useDashboardAuth();

	React.useEffect(() => {
		if (!initializing && !user) {
			router.replace(hrefFor("login"));
		}
	}, [initializing, router, user]);

	if (initializing) {
		return <DashboardLoadingFallback />;
	}

	if (!user) {
		return <DashboardUnauthenticatedFallback />;
	}

	if (user.isBanned) {
		return <DashboardBannedFallback />;
	}

	return <>{children}</>;
}
