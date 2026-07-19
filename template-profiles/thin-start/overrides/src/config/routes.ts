export const appRoutes = {
	home: "/",
	contact: "/contact",
	intelligence: "/internal/intelligence",
} as const;

export type AppRouteId = keyof typeof appRoutes;
