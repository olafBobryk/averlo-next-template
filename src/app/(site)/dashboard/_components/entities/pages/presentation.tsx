"use client";

import type { IconName } from "@/components/ui/icons/Icon";
import type { AppRouteId } from "@/config/routes";
import { appRoutes } from "@/config/routes";

export type DashboardPageGroupId = "general" | "settings";

export type DashboardPageDefinition = {
	groupId: DashboardPageGroupId;
	label: string;
	routeId: AppRouteId;
	path: string;
	icon: IconName;
	description: string;
	keywords: string[];
	starEligible: boolean;
	defaultStarred: boolean;
};

export type DashboardNavigationItem = {
	label: string;
	icon: IconName;
	routeId: AppRouteId;
};

export type DashboardPageGroup = {
	id: DashboardPageGroupId;
	label: string;
	description: string;
	pages: DashboardPageDefinition[];
};

export const dashboardPageGroups: {
	id: DashboardPageGroupId;
	label: string;
	description: string;
}[] = [
	{
		id: "general",
		label: "General",
		description: "Core dashboard pages for daily template workflows.",
	},
	{
		id: "settings",
		label: "Settings",
		description: "Account, appearance, and navigation configuration.",
	},
];

export const dashboardPageRegistry = [
	{
		groupId: "general",
		label: "Dashboard",
		routeId: "dashboard",
		path: appRoutes.dashboard,
		icon: "copy",
		description: "Open the dashboard home surface.",
		keywords: ["home", "overview", "dashboard"],
		starEligible: true,
		defaultStarred: true,
	},
	{
		groupId: "settings",
		label: "Settings",
		routeId: "dashboardSettings",
		path: appRoutes.dashboardSettings,
		icon: "gear",
		description: "Manage profile, appearance, and accessibility settings.",
		keywords: ["settings", "profile", "appearance", "accessibility"],
		starEligible: true,
		defaultStarred: false,
	},
	{
		groupId: "settings",
		label: "All pages",
		routeId: "dashboardPages",
		path: appRoutes.dashboardPages,
		icon: "cards",
		description: "Choose which dashboard pages appear in the sidebar.",
		keywords: ["pages", "navigation", "sidebar", "starred"],
		starEligible: false,
		defaultStarred: false,
	},
] as const satisfies readonly DashboardPageDefinition[];

export const dashboardPagesNavigationItem = {
	label: "All pages",
	icon: "cards",
	routeId: "dashboardPages",
} as const;

export const defaultDashboardSidebarRouteIds = dashboardPageRegistry
	.filter((page) => page.defaultStarred)
	.map((page) => page.routeId);

export const dashboardStarEligibleRouteIds = new Set<string>(
	dashboardPageRegistry
		.filter((page) => page.starEligible)
		.map((page) => page.routeId),
);

export function getDashboardStarEligiblePages() {
	return dashboardPageRegistry.filter((page) => page.starEligible);
}

export function getDashboardPageByRouteId(routeId: AppRouteId) {
	return (
		dashboardPageRegistry.find((candidate) => candidate.routeId === routeId) ??
		null
	);
}

export function getDashboardPageByPath(path: string) {
	return (
		dashboardPageRegistry.find((candidate) => candidate.path === path) ?? null
	);
}

export function sanitizeDashboardSidebarRouteIds(
	routeIds: readonly unknown[],
): AppRouteId[] {
	const nextRouteIds: AppRouteId[] = [];
	const seen = new Set<string>();

	for (const routeId of routeIds) {
		if (typeof routeId !== "string") continue;
		if (seen.has(routeId)) continue;
		if (!dashboardStarEligibleRouteIds.has(routeId as AppRouteId)) continue;
		if (!getDashboardPageByRouteId(routeId as AppRouteId)) continue;

		seen.add(routeId);
		nextRouteIds.push(routeId as AppRouteId);
	}

	return nextRouteIds;
}

export function getDashboardNavigationItems(
	routeIds: readonly AppRouteId[],
): DashboardNavigationItem[] {
	const items: DashboardNavigationItem[] = [];

	for (const routeId of sanitizeDashboardSidebarRouteIds(routeIds)) {
		const page = getDashboardPageByRouteId(routeId);
		if (!page) continue;

		items.push({
			label: page.label,
			icon: page.icon,
			routeId: page.routeId,
		});
	}

	return items;
}

export const dashboardNavigationItems = getDashboardNavigationItems(
	defaultDashboardSidebarRouteIds,
);

export function groupDashboardPages(
	pages: readonly DashboardPageDefinition[],
): DashboardPageGroup[] {
	return dashboardPageGroups
		.map((group) => ({
			...group,
			pages: pages.filter((page) => page.groupId === group.id),
		}))
		.filter((group) => group.pages.length > 0);
}

export function reportDashboardPageMatchesQuery(
	page: DashboardPageDefinition,
	query: string,
) {
	const normalizedQuery = query.trim().toLowerCase();
	if (!normalizedQuery) return true;

	return [
		page.label,
		page.path,
		page.description,
		page.groupId,
		...page.keywords,
	].some((value) => value.toLowerCase().includes(normalizedQuery));
}

export function getDashboardPageStarPresentation(
	page: DashboardPageDefinition,
	starred: boolean,
) {
	return {
		ariaLabel: starred
			? `Remove ${page.label} from sidebar`
			: `Add ${page.label} to sidebar`,
		weight: starred ? ("fill" as const) : ("regular" as const),
		className: starred ? "text-[var(--color-warning)]!" : undefined,
	};
}
