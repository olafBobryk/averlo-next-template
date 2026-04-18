export const appRoutes = {
	home: "/",
	contact: "/contact",
	demo: "/demo",
	settings: "/settings",
	login: "/login",
	dashboard: "/dashboard",
	dashboardSettings: "/dashboard/settings",
	dictionary: "/dictionary",
	dictionaryRiveLogoReveal: "/dictionary/loading-screens/rive-logo-reveal",
	dictionarySpamProtectedForm: "/dictionary/forms/spam-protected-form",
} as const;

export type AppRouteId = keyof typeof appRoutes;
