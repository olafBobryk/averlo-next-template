import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { AnimatePresence } from "motion/react";
import { InputFrame } from "@/components/ui/primitives/InputFrame";
import { Icon } from "@/components/ui/icons/Icon";
import { DashboardCommandOverlay } from "./DashboardCommandOverlay";
import type { DashboardContextualCommand } from "./DashboardCommandContracts";
import { DashboardCommandPalette } from "./DashboardCommandPalette";
import { catalogContract } from "./DashboardCommandPalette.catalog";
import {
	buildDashboardCommandTree,
	dashboardCommandMatches,
	getNextDashboardCommandId,
} from "./DashboardCommandTree";

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
		keywords: ["new", "add", "quick"],
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
		keywords: ["member", "invite", "quick"],
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
		if (event.key === "Enter") {
			const command = filteredCommands.find(
				(item) => item.id === effectiveActiveCommandId,
			);
			if (command) setExecutedCommand(command.label);
			event.preventDefault();
			return;
		}
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

function CommandPaletteHarness({
	initialQuery = "",
	textScale = 1,
	compact = false,
	initiallyOpen = true,
}: {
	initialQuery?: string;
	textScale?: number;
	compact?: boolean;
	initiallyOpen?: boolean;
}) {
	const anchor = React.useRef<HTMLDivElement>(null);
	const [open, setOpen] = React.useState(false);
	React.useEffect(() => setOpen(initiallyOpen), [initiallyOpen]);
	React.useEffect(() => {
		const toggle = (event: KeyboardEvent) => {
			if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setOpen((current) => !current);
			}
		};
		window.addEventListener("keydown", toggle);
		return () => window.removeEventListener("keydown", toggle);
	}, []);
	const resolveAnchor = React.useCallback(() => anchor.current, []);
	return (
		<div style={{ "--text-scale": textScale } as React.CSSProperties}>
			<div className="h-screen w-60 bg-panel p-3 pt-16">
				<InputFrame ref={anchor} className={compact ? "!w-10" : "w-full"}>
					<button
						type="button"
						aria-label="Open dashboard commands"
						className="flex h-full w-full items-center gap-2 px-3 text-sm text-muted-foreground"
						onClick={() => setOpen(true)}
					>
						<Icon className="!size-4 shrink-0" name="search" />
						{compact ? null : "Search"}
					</button>
				</InputFrame>
			</div>
			<AnimatePresence
				onExitComplete={() => anchor.current?.querySelector("button")?.focus()}
			>
				{open ? (
					<DashboardCommandOverlay
						resolveAnchor={resolveAnchor}
						onClose={() => setOpen(false)}
					>
						<div style={{ "--text-scale": textScale } as React.CSSProperties}>
							<CommandPaletteContent initialQuery={initialQuery} />
						</div>
					</DashboardCommandOverlay>
				) : null}
			</AnimatePresence>
		</div>
	);
}

async function expectHierarchyIndentation(dialog: HTMLElement) {
	await expect(
		dialog.querySelector(
			"[data-command-icon-well], [data-command-tree-elbow], [data-command-tree-continuation-rail], [data-command-tree-branch-rail]",
		),
	).toBeNull();
	const branches = Array.from(
		dialog.querySelectorAll<HTMLElement>("[data-command-tree-branch]"),
	);
	await expect(branches.length).toBeGreaterThan(0);
	for (const slot of dialog.querySelectorAll<HTMLElement>(
		"[data-command-icon-slot]",
	)) {
		const icon = slot.querySelector("svg")!;
		const a = slot.getBoundingClientRect();
		const b = icon.getBoundingClientRect();
		await expect(a.width).toBe(32);
		await expect(
			Math.abs(a.left + a.width / 2 - (b.left + b.width / 2)),
		).toBeLessThan(1);
		await expect(
			Math.abs(a.top + a.height / 2 - (b.top + b.height / 2)),
		).toBeLessThan(1);
	}

	for (const branch of branches) {
		await expect(getComputedStyle(branch).marginLeft).toBe("16px");
	}
}

const meta = {
	id: "dashboard-commands-command-palette",
	title: "Dashboard/Commands/Command Palette",
	component: DashboardCommandPalette,
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		docs: {
			description: {
				component:
					"Sidebar-anchored command search widens in place without dimming. Compact rails use the visible anchor; phones without an anchor use the top viewport inset. Command search uses plain 16px icons centered in unboxed 32px slots, two-line rows and 16px indentation per child level. Parent context remains unselectable when it does not match. Hierarchy uses spacing, never icon containers or connector lines.",
			},
		},
		a11y: { test: "error" },
		layout: "fullscreen",
	},
} satisfies Meta<typeof DashboardCommandPalette>;

export default meta;
type Story = StoryObj;

export const AllCommands: Story = {
	render: () => <CommandPaletteHarness />,
	play: async () => {
		const body = within(document.body);
		const dialog = await body.findByRole("dialog", {
			name: "Dashboard commands",
		});
		const palette = within(dialog);
		if (palette.queryByRole("listbox"))
			await waitFor(() => expect(palette.getByRole("listbox")).toBeVisible());
		await waitFor(() => expect(dialog).toBeVisible());
		const search = palette.getByRole("combobox", {
			name: "Search dashboard commands",
		});
		await expect(search).toHaveAttribute("aria-autocomplete", "list");
		await expect(search).toHaveAttribute("aria-expanded", "true");
		await expect(search).toHaveAttribute(
			"aria-controls",
			"dashboard-command-results",
		);
		await expect(search).toHaveAttribute("placeholder", "Search");
		await expect(
			dialog.querySelector('[data-surface-role="float"]'),
		).toHaveAttribute("data-elevation", "float");
		await expect(palette.getByText("Create record")).toBeVisible();
		await expect(
			palette.getByText(
				"Open the record collection with its create action ready.",
			),
		).toBeVisible();
		await expect(
			dialog.querySelectorAll("[data-command-tree-branch]"),
		).toHaveLength(2);
		await expect(
			dialog.querySelectorAll('[data-command-depth="1"]'),
		).toHaveLength(3);
		await expectHierarchyIndentation(dialog);
		await userEvent.click(search);
		await userEvent.keyboard("{ArrowDown}");
		await waitFor(() =>
			expect(
				dialog.querySelector(
					"#dashboard-command-option-navigate-dashboard-records",
				),
			).toHaveAttribute("aria-selected", "true"),
		);
	},
};

export const FilteredHierarchy: Story = {
	render: () => <CommandPaletteHarness initialQuery="member" />,
	play: async () => {
		const body = within(document.body);
		const dialog = await body.findByRole("dialog", {
			name: "Dashboard commands",
		});
		const palette = within(dialog);
		if (palette.queryByRole("listbox"))
			await waitFor(() => expect(palette.getByRole("listbox")).toBeVisible());
		await expect(
			palette.getByRole("combobox", {
				name: "Search dashboard commands",
			}),
		).toHaveValue("member");
		await waitFor(() =>
			expect(
				palette.getByRole("button", { name: "Clear search" }),
			).toBeVisible(),
		);
		await expect(
			palette.getByRole("option", {
				name: "Administration Manage organization invitations, memberships, and ownership.",
			}),
		).toBeVisible();
		await expect(
			palette.getByRole("option", {
				name: "Invite member Open Administration and create a local organization invitation.",
			}),
		).toBeVisible();
		await expect(
			palette.getByRole("option", {
				name: "Member Review one organization-scoped member presentation.",
			}),
		).toBeVisible();
		await expect(
			dialog.querySelector("[data-command-tree-branch]"),
		).toBeVisible();
		await expect(
			dialog.querySelectorAll('[data-command-depth="1"]'),
		).toHaveLength(2);
	},
};

export const LargeTextHierarchy: Story = {
	render: () => <CommandPaletteHarness initialQuery="member" textScale={1.1} />,
	play: async () => {
		const dialog = await within(document.body).findByRole("dialog", {
			name: "Dashboard commands",
		});
		await expect(
			within(dialog).getByRole("combobox", {
				name: "Search dashboard commands",
			}),
		).toHaveValue("member");
		await expectHierarchyIndentation(dialog);
	},
};

export const EmptyResults: Story = {
	render: () => <CommandPaletteHarness initialQuery="no-such-command" />,
	play: async () => {
		const body = within(document.body);
		const dialog = await body.findByRole("dialog", {
			name: "Dashboard commands",
		});
		const palette = within(dialog);
		if (palette.queryByRole("listbox"))
			await waitFor(() => expect(palette.getByRole("listbox")).toBeVisible());
		await waitFor(() =>
			expect(palette.getByText("No matching commands.")).toBeVisible(),
		);
		await expect(
			palette.queryByRole("listbox", { name: "Dashboard commands" }),
		).not.toBeInTheDocument();
	},
};

export const ParentContext: Story = {
	render: () => <CommandPaletteHarness initialQuery="quick" />,
	play: async () => {
		const dialog = await within(document.body).findByRole("dialog", {
			name: "Dashboard commands",
		});
		const palette = within(dialog);
		if (palette.queryByRole("listbox"))
			await waitFor(() => expect(palette.getByRole("listbox")).toBeVisible());
		await waitFor(() => expect(dialog).toBeVisible());
		await expect(palette.getByText("Records", { exact: true })).toBeVisible();
		await expect(
			palette.queryByRole("option", { name: /^Records / }),
		).toBeNull();
		await expect(palette.getAllByRole("option")).toHaveLength(2);
		await expectHierarchyIndentation(dialog);
		const search = palette.getByRole("combobox");
		await userEvent.click(search);
		await userEvent.keyboard("{Enter}");
		await expect(palette.getByTestId("executed-command")).toHaveTextContent(
			"Create record",
		);
		await userEvent.click(
			palette.getByRole("button", { name: "Clear search" }),
		);
		await expect(search).toHaveValue("");
		await expect(search).toHaveFocus();
		await expect(palette.getAllByRole("option")).toHaveLength(6);
	},
};

export const AnchoredExpansion: Story = {
	render: () => <CommandPaletteHarness initiallyOpen={false} />,
	play: async () => {
		const body = within(document.body);
		const trigger = body.getByRole("button", {
			name: "Open dashboard commands",
		});
		const anchor = trigger.closest('[data-slot="input-frame"]')!;
		const before = anchor.getBoundingClientRect();
		await userEvent.click(trigger);
		const dialog = await body.findByRole("dialog", {
			name: "Dashboard commands",
		});
		const search = within(dialog).getByRole("combobox");
		await waitFor(() =>
			expect(dialog.getBoundingClientRect().width).toBeCloseTo(560, 0),
		);
		const after = search
			.closest('[data-slot="input-frame"]')!
			.getBoundingClientRect();
		await expect(Math.abs(after.left - before.left)).toBeLessThan(1);
		await expect(Math.abs(after.top - before.top)).toBeLessThan(1);
		await expect(after.height).toBe(before.height);
		await userEvent.click(search);
		await userEvent.type(search, "record");
		await expect(search).toHaveValue("record");
		await userEvent.keyboard("{Escape}");
		// The field's padding and outer offset collapse together before removal.
		await waitFor(() => {
			const padding = Number.parseFloat(
				getComputedStyle(
					search.closest('[data-slot="input-frame"]')!.parentElement!,
				).paddingTop,
			);
			expect(padding).toBeGreaterThan(0);
			expect(padding).toBeLessThan(8);
			expect(
				Math.abs(
					search.closest('[data-slot="input-frame"]')!.getBoundingClientRect()
						.top - before.top,
				),
			).toBeLessThan(1);
		});
		await waitFor(() =>
			expect(
				body.queryByRole("dialog", { name: "Dashboard commands" }),
			).toBeNull(),
		);
		await waitFor(() => expect(trigger).toHaveFocus());
	},
};
export const CollapsedAnchor: Story = {
	render: () => <CommandPaletteHarness compact />,
	play: async () => {
		const dialog = await within(document.body).findByRole("dialog", {
			name: "Dashboard commands",
		});
		await waitFor(() =>
			expect(dialog.getBoundingClientRect().width).toBeCloseTo(560, 0),
		);
		await expect(dialog.getBoundingClientRect().left).toBe(12);
		await expect(dialog.getBoundingClientRect().top).toBe(64);
	},
};

export const InterruptedExpansion: Story = {
	render: () => <CommandPaletteHarness initiallyOpen={false} />,
	play: async () => {
		const body = within(document.body);
		await userEvent.click(
			body.getByRole("button", { name: "Open dashboard commands" }),
		);
		const dialog = await body.findByRole("dialog", {
			name: "Dashboard commands",
		});
		const input = within(dialog).getByRole("combobox");
		await userEvent.click(input);
		await userEvent.type(input, "record");
		await userEvent.keyboard("{Control>}k{/Control}{Control>}k{/Control}");
		await waitFor(() =>
			expect(
				body.getByRole("combobox", { name: "Search dashboard commands" }),
			).toBe(input),
		);
		await expect(input).toHaveValue("record");
		await waitFor(() =>
			expect(dialog.getBoundingClientRect().width).toBeCloseTo(560, 0),
		);
	},
};
