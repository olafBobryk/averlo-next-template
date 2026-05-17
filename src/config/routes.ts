export const appRoutes = {
	home: "/",
	contact: "/contact",
	demo: "/demo",
	playground: "/playground",
	settings: "/settings",
	login: "/login",
	dashboard: "/dashboard",
	dashboardPages: "/dashboard/pages",
	dashboardSettings: "/dashboard/settings",
	dictionary: "/dictionary",
	reference: "/reference",
	dictionaryRiveLogoReveal: "/dictionary/loading-screens/rive-logo-reveal",
	dictionarySpamProtectedForm: "/dictionary/forms/spam-protected-form",
} as const;

export type AppRouteId = keyof typeof appRoutes;
