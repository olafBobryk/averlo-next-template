export const appRoutes = {
	home: "/",
	contact: "/contact",
	demo: "/internal/demo",
	intelligence: "/internal/intelligence",
	playground: "/internal/playground",
	settings: "/settings",
	login: "/login",
	signInOptions: "/sign-in-options",
	forgotPassword: "/forgot-password",
	resetPassword: "/reset-password",
	setPassword: "/set-password",
	invitation: "/invitation",
	selectOrganization: "/select-organization",
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
