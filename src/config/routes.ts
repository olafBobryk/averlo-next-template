export const appRoutes = {
	home: "/",
	contact: "/contact",
	demo: "/internal/demo",
	playground: "/internal/playground",
	settings: "/settings",
	login: "/login",
	dashboard: "/dashboard",
	dashboardPages: "/dashboard/pages",
	dashboardSettings: "/dashboard/settings",
	dictionary: "/internal/dictionary",
	reference: "/internal/reference",
	dictionaryRiveLogoReveal:
		"/internal/dictionary/loading-screens/rive-logo-reveal",
	dictionarySpamProtectedForm: "/internal/dictionary/forms/spam-protected-form",
} as const;

export type AppRouteId = keyof typeof appRoutes;
