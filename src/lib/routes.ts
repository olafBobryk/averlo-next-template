import { type AppRouteId, appRoutes } from "@/config/routes";

export type { AppRouteId } from "@/config/routes";

export function hrefFor(routeId: AppRouteId) {
	return appRoutes[routeId];
}

export const routeBuilders = {
	dashboardSubpage: (...segments: string[]) =>
		`/dashboard/${segments.join("/")}`,
	dictionaryEntry: (...segments: string[]) =>
		`/dictionary/${segments.join("/")}`,
};
