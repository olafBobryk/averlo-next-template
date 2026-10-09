"use client";
// Native specimen adapted from @/app/(site)/dashboard/_components/commands/DashboardCommandPalette.catalog.
import * as React from "react";
import type { DashboardContextualCommand } from "@/app/(site)/dashboard/_components/commands/DashboardCommandContracts";
import { DashboardCommandPalette } from "@/app/(site)/dashboard/_components/commands/DashboardCommandPalette";
import {
	buildDashboardCommandTree,
	dashboardCommandMatches,
	getNextDashboardCommandId,
} from "@/app/(site)/dashboard/_components/commands/DashboardCommandTree";

const commands: DashboardContextualCommand[] = [
	{
		description: "Open the organization overview and recent product activity.",
		href: "/dashboard",
		icon: "home",
		id: "navigate.dashboard.overview",
		keywords: ["home", "activity"],
		label: "Overview",
	},
	{
		description: "Browse the organization-scoped reference record collection.",
		href: "/dashboard/records",
		icon: "database",
		id: "navigate.dashboard.records",
		keywords: ["collection", "data"],
		label: "Records",
	},
	{
		description: "Open the record collection with its create action ready.",
		href: "/dashboard/records?action=create",
		icon: "database",
		id: "action.dashboard.records.create",
		keywords: ["new", "add"],
		label: "Create record",
		parentId: "navigate.dashboard.records",
	},
	{
		description: "Manage organization invitations, memberships, and ownership.",
		href: "/dashboard/administration",
		icon: "shield",
		id: "navigate.dashboard.administration",
		keywords: ["members", "roles"],
		label: "Administration",
	},
	{
		description:
			"Open Administration and create a local organization invitation.",
		href: "/dashboard/administration?action=invite",
		icon: "users",
		id: "action.dashboard.administration.invite",
		keywords: ["member", "invite"],
		label: "Invite member",
		parentId: "navigate.dashboard.administration",
	},
	{
		description: "Review one organization-scoped member presentation.",
		href: "/dashboard/organization/members/member-1",
		icon: "user",
		id: "navigate.dashboard.organization.member",
		keywords: ["person", "member"],
		label: "Member",
		parentId: "navigate.dashboard.administration",
	},
];
function CommandPaletteContent({
	initialQuery = "",
}: {
	initialQuery?: string;
}) {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [activeCommandId, setActiveCommandId] = React.useState<string>();
	const [executedCommand, setExecutedCommand] = React.useState("");
	const [query, setQuery] = React.useState(initialQuery);
	const filteredCommands = commands.filter((command) =>
		dashboardCommandMatches(command, query),
	);
	const resultIds = filteredCommands.map((command) => command.id);
	const effectiveActiveCommandId = resultIds.includes(activeCommandId ?? "")
		? activeCommandId
		: resultIds[0];
	const commandTree = buildDashboardCommandTree({
		commands,
		matchedCommands: filteredCommands,
	});

	function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
		event.preventDefault();
		setActiveCommandId((currentId) =>
			getNextDashboardCommandId({
				currentId: resultIds.includes(currentId ?? "")
					? currentId
					: effectiveActiveCommandId,
				direction: event.key === "ArrowDown" ? "next" : "previous",
				resultIds,
			}),
		);
	}

	return (
		<>
			<DashboardCommandPalette
				anchored
				activeCommandId={effectiveActiveCommandId}
				commandTree={commandTree}
				filteredCommandCount={filteredCommands.length}
				inputRef={inputRef}
				onActiveCommandChange={setActiveCommandId}
				onClearQuery={() => {
					setQuery("");
					setActiveCommandId(undefined);
					inputRef.current?.focus();
				}}
				onExecuteCommand={(command) => setExecutedCommand(command.label)}
				onInputKeyDown={handleInputKeyDown}
				onQueryChange={(nextQuery) => {
					setQuery(nextQuery);
					setActiveCommandId(undefined);
				}}
				organizationName="Product sandbox"
				query={query}
			/>
			<output className="sr-only" data-testid="executed-command">
				{executedCommand}
			</output>
		</>
	);
}
// Render the native palette presentation without the application's global
// overlay, focus trap, or viewport tracking in this inert background specimen.
export default function HeroCommandPalettePreview() {
	return (
		<div className="w-[560px]">
			<CommandPaletteContent />
		</div>
	);
}
