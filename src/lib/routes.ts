import { type AppRouteId, appRoutes } from "@/config/routes";

export type { AppRouteId } from "@/config/routes";

export function hrefFor(routeId: AppRouteId) {
	return appRoutes[routeId];
}
