import type { IconName } from "@/components/ui/icons/Icon";
import type { AppRouteId } from "@/config/routes";
import {
	type DashboardNavigationItem,
	dashboardNavigationItems,
	dashboardPagesNavigationItem,
	getDashboardNavigationItems,
} from "../entities/pages/presentation";

export type DashboardUserMenuItem = {
	id: string;
	label: string;
	icon?: IconName;
	routeId?: AppRouteId;
	action?: "logout" | "reportIssue";
};

export {
	type DashboardNavigationItem,
	dashboardNavigationItems,
	dashboardPagesNavigationItem,
	getDashboardNavigationItems,
};

export const dashboardUserMenuItems: DashboardUserMenuItem[] = [
	{
		id: "settings",
		label: "Settings",
		routeId: "dashboardSettings",
		icon: "gear",
	},
	{ id: "logout", label: "Logout", action: "logout", icon: "log-out" },
];
