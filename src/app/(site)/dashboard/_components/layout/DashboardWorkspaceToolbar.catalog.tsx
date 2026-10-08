"use client";

import { defineCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { DashboardWorkspaceToolbar } from "./DashboardWorkspaceToolbar";

export const catalogContract = defineCatalogOwnerContract({
	id: "dashboard-layout-workspace-toolbar",
	name: "Workspace Toolbar",
	role: "Contextual page identity and actions above the inset dashboard workspace. Workspace navigation places New chat second; Chats lists existing conversations. Chat menus reveal with width motion on hover or focus, stay visible while open, and remain visible on touch devices.",
	importStatement:
		'import { DashboardWorkspaceToolbar } from "./DashboardWorkspaceToolbar";',
	chooseWhen: [
		"Compose dashboard page identity through DashboardSection, or use the toolbar directly for a full-height workspace such as Assistant.",
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
