import type { IconName } from "@/components/ui/icons/Icon";
import type { MembershipRole } from "@/lib/auth/contracts";

export type DashboardCapability =
	| "dashboard.view"
	| "records.read"
	| "records.write"
	| "organization.read"
	| "organization.manage"
	| "debug.use";

export type DashboardLayoutWidth = "standard" | "wide";
export type DashboardSidebarTier = "primary" | "secondary" | "utility";

export type DashboardCommandDefinition = {
	capability?: DashboardCapability;
	description: string;
	href: string;
	id: string;
	keywords: readonly string[];
	label: string;
};

export type DashboardSurface = {
	breadcrumb: boolean;
	capability?: DashboardCapability;
	commands: readonly DashboardCommandDefinition[];
	description: string;
	href: string;
	icon: IconName;
	id: DashboardSurfaceId;
	label: string;
	layoutWidth: DashboardLayoutWidth;
	match: "exact" | "member-detail" | "record-detail";
	parentId?: DashboardSurfaceId;
	sidebar: boolean;
	sidebarTier: DashboardSidebarTier;
};

export type DashboardSurfaceId =
	| "dashboard.overview"
	// prune:dashboard.reference-entities:start
	| "dashboard.records"
	| "dashboard.record"
	// prune:dashboard.reference-entities:end
	| "dashboard.settings"
	| "dashboard.organization"
	// prune:dashboard.reference-entities:start
	| "dashboard.organization.members"
	| "dashboard.organization.member"
	// prune:dashboard.reference-entities:end
	| "dashboard.organization.settings"
	// prune:dashboard.reference-entities:start
	| "dashboard.reference.entities"
	// prune:dashboard.reference-entities:end
	| never;

export type DashboardBreadcrumb = {
	href?: string;
	label: string;
};

export const dashboardSurfaceRegistry: readonly DashboardSurface[] = [
	{
		breadcrumb: true,
		commands: [],
		description: "Open the organization overview and recent product activity.",
		href: "/dashboard",
		icon: "home",
		id: "dashboard.overview",
		label: "Overview",
		layoutWidth: "standard",
		match: "exact",
		sidebar: true,
		sidebarTier: "primary",
	},
	// prune:dashboard.reference-entities:start
	{
		breadcrumb: true,
		capability: "records.read",
		commands: [
			{
				capability: "records.write",
				description: "Open the record collection with its create action ready.",
				href: "/dashboard/records?action=create",
				id: "records.create",
				keywords: ["new", "add", "entity"],
				label: "Create record",
			},
		],
		description: "Browse the organization-scoped reference record collection.",
		href: "/dashboard/records",
		icon: "database",
		id: "dashboard.records",
		label: "Records",
		layoutWidth: "wide",
		match: "exact",
		sidebar: true,
		sidebarTier: "primary",
	},
	{
		breadcrumb: true,
		capability: "records.read",
		commands: [],
		description: "Review one organization-scoped reference record.",
		href: "/dashboard/records/[recordId]",
		icon: "cards",
		id: "dashboard.record",
		label: "Record",
		layoutWidth: "standard",
		match: "record-detail",
		parentId: "dashboard.records",
		sidebar: false,
		sidebarTier: "primary",
	},
	// prune:dashboard.reference-entities:end
	{
		breadcrumb: true,
		commands: [],
		description: "Manage the current account and application preferences.",
		href: "/dashboard/settings",
		icon: "gear",
		id: "dashboard.settings",
		label: "Account settings",
		layoutWidth: "standard",
		match: "exact",
		sidebar: true,
		sidebarTier: "utility",
	},
	{
		breadcrumb: true,
		capability: "organization.read",
		commands: [],
		description: "Review the active organization and its product boundary.",
		href: "/dashboard/organization",
		icon: "building",
		id: "dashboard.organization",
		label: "Organization",
		layoutWidth: "standard",
		match: "exact",
		sidebar: true,
		sidebarTier: "secondary",
	},
	// prune:dashboard.reference-entities:start
	{
		breadcrumb: true,
		capability: "organization.read",
		commands: [],
		description: "Review one organization-scoped member presentation.",
		href: "/dashboard/organization/members/[memberId]",
		icon: "user",
		id: "dashboard.organization.member",
		label: "Member",
		layoutWidth: "standard",
		match: "member-detail",
		parentId: "dashboard.organization.members",
		sidebar: false,
		sidebarTier: "secondary",
	},
	{
		breadcrumb: true,
		capability: "organization.read",
		commands: [],
		description: "Review organization members and their current access.",
		href: "/dashboard/organization/members",
		icon: "users",
		id: "dashboard.organization.members",
		label: "Members",
		layoutWidth: "standard",
		match: "exact",
		parentId: "dashboard.organization",
		sidebar: true,
		sidebarTier: "secondary",
	},
	// prune:dashboard.reference-entities:end
	{
		breadcrumb: true,
		capability: "organization.manage",
		commands: [],
		description: "Manage organization identity and product defaults.",
		href: "/dashboard/organization/settings",
		icon: "sliders",
		id: "dashboard.organization.settings",
		label: "Organization settings",
		layoutWidth: "standard",
		match: "exact",
		parentId: "dashboard.organization",
		sidebar: true,
		sidebarTier: "secondary",
	},
	// prune:dashboard.reference-entities:start
	{
		breadcrumb: true,
		capability: "debug.use",
		commands: [],
		description: "Review live and skeleton entity presentation contracts.",
		href: "/dashboard/reference/entities",
		icon: "cards",
		id: "dashboard.reference.entities",
		label: "Entity reference",
		layoutWidth: "wide",
		match: "exact",
		parentId: "dashboard.overview",
		sidebar: false,
		sidebarTier: "utility",
	},
	// prune:dashboard.reference-entities:end
] as const;

export const dashboardFeatureConfig = {
	organizationSwitcher:
		process.env.NEXT_PUBLIC_DASHBOARD_ORGANIZATION_SWITCHER === "enabled",
} as const;

export function getDashboardCapabilities(role: MembershipRole) {
	const capabilities = new Set<DashboardCapability>([
		"dashboard.view",
		"records.read",
		"organization.read",
	]);
	if (role === "owner" || role === "admin") {
		capabilities.add("records.write");
		capabilities.add("organization.manage");
	}
	if (process.env.NODE_ENV !== "production") capabilities.add("debug.use");
	return capabilities;
}

export function hasDashboardCapability(
	capabilities: ReadonlySet<DashboardCapability>,
	capability?: DashboardCapability,
) {
	return !capability || capabilities.has(capability);
}

function matchesSurface(pathname: string, surface: DashboardSurface) {
	if (surface.match === "exact") return pathname === surface.href;
	// prune:dashboard.reference-entities:start
	if (surface.match === "record-detail") {
		return /^\/dashboard\/records\/[^/]+$/.test(pathname);
	}
	if (surface.match === "member-detail") {
		return /^\/dashboard\/organization\/members\/[^/]+$/.test(pathname);
	}
	// prune:dashboard.reference-entities:end
	return false;
}

export function getDashboardSurface(pathname: string) {
	return (
		dashboardSurfaceRegistry.find((surface) =>
			matchesSurface(pathname, surface),
		) ?? null
	);
}

export function getDashboardSurfaceById(id: DashboardSurfaceId) {
	return dashboardSurfaceRegistry.find((surface) => surface.id === id) ?? null;
}

export function getVisibleDashboardSurfaces(
	capabilities: ReadonlySet<DashboardCapability>,
) {
	return dashboardSurfaceRegistry.filter((surface) =>
		hasDashboardCapability(capabilities, surface.capability),
	);
}

export function getDashboardSidebarGroups(
	capabilities: ReadonlySet<DashboardCapability>,
) {
	const surfaces = getVisibleDashboardSurfaces(capabilities).filter(
		(surface) => surface.sidebar,
	);
	return (["primary", "secondary", "utility"] as const)
		.map((tier) => ({
			id: tier,
			tier,
			surfaces: surfaces.filter((surface) => surface.sidebarTier === tier),
		}))
		.filter((group) => group.surfaces.length > 0);
}

export function getDashboardBreadcrumbs(
	pathname: string,
	capabilities: ReadonlySet<DashboardCapability>,
	lastLabel?: string,
) {
	const surface = getDashboardSurface(pathname);
	if (!surface || !hasDashboardCapability(capabilities, surface.capability)) {
		return [];
	}
	const lineage: DashboardSurface[] = [];
	let current: DashboardSurface | null = surface;
	while (current) {
		if (current.breadcrumb) lineage.unshift(current);
		current = current.parentId
			? getDashboardSurfaceById(current.parentId)
			: null;
	}
	if (lineage[0]?.id !== "dashboard.overview") {
		const root = getDashboardSurfaceById("dashboard.overview");
		if (root) lineage.unshift(root);
	}
	return lineage.map((item, index) => ({
		href: index < lineage.length - 1 ? item.href : undefined,
		label: index === lineage.length - 1 && lastLabel ? lastLabel : item.label,
	})) satisfies DashboardBreadcrumb[];
}

export function getDashboardNavigationCommands(
	capabilities: ReadonlySet<DashboardCapability>,
) {
	return getVisibleDashboardSurfaces(capabilities).flatMap((surface) => {
		const parentHref = surface.parentId
			? getDashboardSurfaceById(surface.parentId)?.href
			: null;
		return [
			{
				description: surface.description,
				href: surface.href.includes("[")
					? (parentHref ?? "/dashboard")
					: surface.href,
				id: `navigate.${surface.id}`,
				keywords: [surface.label, "navigate", "open"],
				label: surface.label,
			},
			...surface.commands.filter((command) =>
				hasDashboardCapability(capabilities, command.capability),
			),
		];
	});
}
