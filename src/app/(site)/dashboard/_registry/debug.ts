export const dashboardDebugEnabled =
	process.env.NODE_ENV !== "production" ||
	process.env.NEXT_PUBLIC_DASHBOARD_DEBUG === "enabled";

export const dashboardDebugStates = [
	"loading",
	"empty",
	"error",
	"unavailable",
	"not-found",
] as const;

export type DashboardDebugState = (typeof dashboardDebugStates)[number];

export function isDashboardDebugState(
	value: string | null,
): value is DashboardDebugState {
	return dashboardDebugStates.includes(value as DashboardDebugState);
}
