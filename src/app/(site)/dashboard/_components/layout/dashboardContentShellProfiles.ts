import type { DashboardLayoutWidth } from "../../_registry/surfaceRegistry";

type DashboardContentShellProfile = {
	bodyClassName: string;
	contentClassName: string;
	gutterClassName: string;
	mainClassName: string;
};

const dashboardPageGutterClassName = "px-0";

export const dashboardContentShellProfiles = {
	standard: {
		bodyClassName: "",
		contentClassName: "min-h-full",
		gutterClassName: dashboardPageGutterClassName,
		mainClassName: "min-h-0 overflow-y-auto [&_.dashboard-page-body]:max-w-6xl",
	},
	wide: {
		bodyClassName: "",
		contentClassName: "min-h-full",
		gutterClassName: dashboardPageGutterClassName,
		mainClassName: "min-h-0 overflow-y-auto",
	},
	workspace: {
		bodyClassName: "h-full",
		contentClassName: "min-h-0 flex-1",
		gutterClassName: "px-0",
		mainClassName: "min-h-0 overflow-hidden",
	},
} as const satisfies Record<DashboardLayoutWidth, DashboardContentShellProfile>;
