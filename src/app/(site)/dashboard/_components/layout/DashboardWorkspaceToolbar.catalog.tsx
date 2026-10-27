"use client";

import { defineCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { DashboardWorkspaceToolbar } from "./DashboardWorkspaceToolbar";

export const catalogContract = defineCatalogOwnerContract({
	id: "dashboard-layout-workspace-toolbar",
	name: "Workspace Toolbar",
	role: "Contextual page identity and actions above the inset dashboard workspace. The Assistant section places New chat first; Chats lists existing conversations. Chat menus reveal with width motion on hover or focus, stay visible while open, and remain visible on touch devices.",
	importStatement:
		'import { DashboardWorkspaceToolbar } from "./DashboardWorkspaceToolbar";',
	chooseWhen: [
		"Compose dashboard page identity through DashboardSection, or use the toolbar directly for a full-height workspace such as Assistant.",
		"The compact identity, ancestry and actions sit above the workspace on shell chrome, aligned with its inner gutter. Ancestors and the current title share text size and weight; descriptions and subordinate ContentSection groups belong below the toolbar. Workspace pages scroll their page; Assistant scrolls its messages.",
		"The shell owns 8px desktop right/bottom inset with 12px corners, 4px tablet inset with 8px corners, and no phone inset. Desktop sidebar is 240px or a 64px rail; tablet uses rail plus drawer; phone uses drawer. Do not add route offsets or a second header to imitate this geometry.",
	],
	chooseInstead: [
		"Use ContentSection for subordinate headings outside cohesive property cards.",
	],
	compounds: [
		"DashboardWorkspaceToolbar.Skeleton",
		"DashboardSidebarShell",
		"DashboardContentShell",
		"DashboardSidebarSection",
	],
	exclusions: [
		"A second global header.",
		"Route-specific sidebar offsets or viewport padding.",
		"Duplicating the page title in the body.",
	],
	guarantees: [
		{
			label: "Chat menus support keyboard reveal and focus return",
			storyId: "dashboard-layout-workspace-toolbar--chat-row-actions",
		},
		{
			label: "Quiet section labels and optional disclosure",
			storyId: "dashboard-layout-workspace-toolbar--sidebar-sections",
		},
		{
			label: "Compact identity, actions, and long titles",
			storyId: "dashboard-layout-workspace-toolbar--long-title",
		},
		{
			label: "Matching loading geometry",
			storyId: "dashboard-layout-workspace-toolbar--loading",
		},
		{
			label: "Inset workspace with raised sidebar",
			storyId: "dashboard-layout-workspace-toolbar--shell",
		},
	],
	family: "Dashboard",
	group: "Layout",
	previewTargets: [
		{
			id: "default",
			name: "Default",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: () => <DashboardWorkspaceToolbar title="Organization settings" />,
		},
	],
});
