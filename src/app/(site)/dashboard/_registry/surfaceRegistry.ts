import type { IconName } from "@/components/ui/icons/Icon";
import type { MembershipRole, PlatformRole } from "@/lib/auth/contracts";

export type DashboardCapability =
	| "dashboard.view"
	| "records.read"
	| "records.write"
	| "organization.read"
	| "organization.manage"
	| "platform.manage"
	| "debug.use";

export const dashboardCapabilityLabels = {
	"dashboard.view": "Dashboard",
	"debug.use": "Debug tools",
	"organization.manage": "Manage organization",
	"organization.read": "View organization",
	"platform.manage": "Manage platform",
	"records.read": "View records",
	"records.write": "Manage records",
} satisfies Record<DashboardCapability, string>;

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
	capability?: DashboardCapability;
	commands: readonly DashboardCommandDefinition[];
	description: string;
	href: string;
	icon: IconName;
	id: DashboardSurfaceId;
	label: string;
	layoutWidth: DashboardLayoutWidth;
	match:
		| "exact"
		| "member-detail"
		| "platform-inbox-detail"
		| "platform-report-detail"
		| "record-detail";
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
	| "dashboard.profile"
	| "dashboard.administration"
	| "dashboard.support"
	| "dashboard.platform"
	| "dashboard.platform.inbox"
	| "dashboard.platform.inbox.request"
	| "dashboard.platform.reports"
	| "dashboard.platform.report"
	| "dashboard.organization"
	| "dashboard.organization.switch"
	// prune:dashboard.reference-entities:start
	| "dashboard.organization.member"
	// prune:dashboard.reference-entities:end
	| "dashboard.organization.settings"
	// prune:dashboard.reference-entities:start
	| "dashboard.reference.entities"
	| "dashboard.reference.skeletons"
	// prune:dashboard.reference-entities:end
	| never;

type DashboardSurfaceTrailItem = {
	href: string;
	label: string;
};

export const dashboardSurfaceRegistry: readonly DashboardSurface[] = [
	{
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
		capability: "dashboard.view",
		commands: [],
		description: "Review the signed-in account and active organization access.",
		href: "/dashboard/profile",
		icon: "user",
		id: "dashboard.profile",
		label: "Profile",
		layoutWidth: "standard",
		match: "exact",
		sidebar: false,
		sidebarTier: "utility",
	},
	{
		capability: "organization.manage",
		commands: [
			{
				capability: "organization.manage",
				description:
					"Open Administration and create a local organization invitation.",
				href: "/dashboard/administration?action=invite",
				id: "administration.invite",
				keywords: ["invite", "member", "access", "organization"],
				label: "Invite member",
			},
		],
		description:
			"Manage organization invitations, memberships, roles, and ownership.",
		href: "/dashboard/administration",
		icon: "shield",
		id: "dashboard.administration",
		label: "Administration",
		layoutWidth: "wide",
		match: "exact",
		parentId: "dashboard.organization.settings",
		sidebar: false,
		sidebarTier: "secondary",
	},
	{
		capability: "dashboard.view",
		commands: [],
		description: "Email support or save a request to the demo Platform Inbox.",
		href: "/dashboard/support",
		icon: "question",
		id: "dashboard.support",
		label: "Support",
		layoutWidth: "standard",
		match: "exact",
		sidebar: false,
		sidebarTier: "utility",
	},
	{
		capability: "platform.manage",
		commands: [],
		description: "Open internal platform support and report operations.",
		href: "/dashboard/platform",
		icon: "shield",
		id: "dashboard.platform",
		label: "Platform",
		layoutWidth: "wide",
		match: "exact",
		sidebar: false,
		sidebarTier: "utility",
	},
	{
		capability: "platform.manage",
		commands: [],
		description: "Review support requests submitted from dashboard support.",
		href: "/dashboard/platform/inbox",
		icon: "mail",
		id: "dashboard.platform.inbox",
		label: "Inbox",
		layoutWidth: "wide",
		match: "exact",
		parentId: "dashboard.platform",
		sidebar: false,
		sidebarTier: "utility",
	},
	{
		capability: "platform.manage",
		commands: [],
		description: "Triage one dashboard support request.",
		href: "/dashboard/platform/inbox/[id]",
		icon: "mail",
		id: "dashboard.platform.inbox.request",
		label: "Support request",
		layoutWidth: "wide",
		match: "platform-inbox-detail",
		parentId: "dashboard.platform.inbox",
		sidebar: false,
		sidebarTier: "utility",
	},
	{
		capability: "platform.manage",
		commands: [],
		description: "Review product reports captured from dashboard routes.",
		href: "/dashboard/platform/reports",
		icon: "flag",
		id: "dashboard.platform.reports",
		label: "Reports",
		layoutWidth: "wide",
		match: "exact",
		parentId: "dashboard.platform",
		sidebar: false,
		sidebarTier: "utility",
	},
	{
		capability: "platform.manage",
		commands: [],
		description: "Triage one structured product report.",
		href: "/dashboard/platform/reports/[id]",
		icon: "flag",
		id: "dashboard.platform.report",
		label: "Product report",
		layoutWidth: "wide",
		match: "platform-report-detail",
		parentId: "dashboard.platform.reports",
		sidebar: false,
		sidebarTier: "utility",
	},
	{
		capability: "organization.read",
		commands: [],
		description: "Review the active organization and its product boundary.",
		href: "/dashboard/organization",
		icon: "building",
		id: "dashboard.organization",
		label: "Organization",
		layoutWidth: "standard",
		match: "exact",
		sidebar: false,
		sidebarTier: "secondary",
	},
	{
		capability: "organization.read",
		commands: [],
		description: "Choose the active organization for this dashboard session.",
		href: "/dashboard/organization/switch",
		icon: "users",
		id: "dashboard.organization.switch",
		label: "Switch organization",
		layoutWidth: "standard",
		match: "exact",
		parentId: "dashboard.organization",
		sidebar: false,
		sidebarTier: "secondary",
	},
	// prune:dashboard.reference-entities:start
	{
		capability: "organization.read",
		commands: [],
		description: "Review one organization-scoped member presentation.",
		href: "/dashboard/organization/members/[memberId]",
		icon: "user",
		id: "dashboard.organization.member",
		label: "Member",
		layoutWidth: "standard",
		match: "member-detail",
		parentId: "dashboard.administration",
		sidebar: false,
		sidebarTier: "secondary",
	},
	// prune:dashboard.reference-entities:end
	{
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
	{
		capability: "debug.use",
		commands: [],
		description: "Review component-owned loading geometry side by side.",
		href: "/dashboard/reference/skeletons",
		icon: "spinner",
		id: "dashboard.reference.skeletons",
		label: "Skeleton reference",
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

export function getDashboardCapabilities(
	role: MembershipRole,
	platformRole: PlatformRole | null = null,
) {
	const capabilities = new Set<DashboardCapability>([
		"dashboard.view",
		"records.read",
		"organization.read",
	]);
	if (role === "owner" || role === "admin") {
		capabilities.add("records.write");
		capabilities.add("organization.manage");
	}
	if (platformRole === "admin") capabilities.add("platform.manage");
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
	if (surface.match === "platform-inbox-detail") {
		return /^\/dashboard\/platform\/inbox\/[^/]+$/.test(pathname);
	}
	if (surface.match === "platform-report-detail") {
		return /^\/dashboard\/platform\/reports\/[^/]+$/.test(pathname);
	}
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
	return dashboardSurfaceRegistry.filter(
		(surface) =>
			hasDashboardCapability(capabilities, surface.capability) &&
			(surface.id !== "dashboard.organization.switch" ||
				dashboardFeatureConfig.organizationSwitcher),
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

export function getDashboardSurfaceTrail(
	pathname: string,
	capabilities: ReadonlySet<DashboardCapability>,
) {
	const surface = getDashboardSurface(pathname);
	if (!surface || !hasDashboardCapability(capabilities, surface.capability)) {
		return [];
	}
	const lineage: DashboardSurface[] = [];
	let current = surface.parentId
		? getDashboardSurfaceById(surface.parentId)
		: null;
	while (current) {
		if (hasDashboardCapability(capabilities, current.capability)) {
			lineage.unshift(current);
		}
		current = current.parentId
			? getDashboardSurfaceById(current.parentId)
			: null;
	}
	return lineage.map((item) => ({
		href: item.href,
		label: item.label,
	})) satisfies DashboardSurfaceTrailItem[];
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
				icon: surface.icon,
				id: `navigate.${surface.id}`,
				keywords: [surface.label, "navigate", "open"],
				label: surface.label,
				parentId: surface.parentId ? `navigate.${surface.parentId}` : undefined,
			},
			...surface.commands
				.filter((command) =>
					hasDashboardCapability(capabilities, command.capability),
				)
				.map((command) => ({
					...command,
					icon: surface.icon,
					parentId: `navigate.${surface.id}`,
				})),
		];
	});
}
