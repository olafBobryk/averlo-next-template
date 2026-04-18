import type { AppRouteId } from "@/config/routes";
import type { IconName } from "@/components/ui/icons/Icon";

export type DashboardSidebarItem = {
	label: string;
	icon: IconName;
	routeId?: AppRouteId;
	action?: "logout";
};

export type DashboardSidebarSection = {
	label: string;
	items: DashboardSidebarItem[];
};

export const dashboardNavigationSections: DashboardSidebarSection[] = [
	{
		label: "General",
		items: [
			{ label: "Dashboard", icon: "copy", routeId: "dashboard" },
			{ label: "Settings", icon: "notes", routeId: "dashboardSettings" },
		],
	},
	{
		label: "Account",
		items: [{ label: "Logout", icon: "close", action: "logout" }],
	},
];
