import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import Logo from "@/components/branding/Logo";
import { Button } from "@/components/ui/primitives/Button";
import { Card, ContentSection } from "@/components/ui/primitives/surfaces";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { DashboardContentShell } from "./DashboardContentShell";
import {
	DashboardShellProvider,
	DashboardToolbarOutlet,
} from "./DashboardShellContext";
import { DashboardSidebarItem } from "./DashboardSidebarBranch";
import { DashboardSidebarSection } from "./DashboardSidebarSection";
import {
	DashboardSidebarShell,
	getDashboardSidebarOffsetClassNames,
} from "./DashboardSidebarShell";
import { DashboardSidebarThreadActionsMenu } from "./DashboardSidebarThreadActionsMenu";
import { DashboardWorkspaceToolbar } from "./DashboardWorkspaceToolbar";
import { catalogContract } from "./DashboardWorkspaceToolbar.catalog";

const meta = {
	title: "Dashboard/Layout/Workspace Toolbar",
	component: DashboardWorkspaceToolbar,
	tags: ["autodocs"],
	parameters: {
		nextjs: { appDirectory: true },
		layout: "fullscreen",
		catalogContract,
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
	args: { title: "Organization settings" },
} satisfies Meta<typeof DashboardWorkspaceToolbar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const LongTitle: Story = {
	args: {
		title:
			"Organization settings and workspace preferences for an international product team",
		actions: <Button size="sm">Edit</Button>,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByRole("heading", { level: 1 })).toHaveAttribute("title");
		const title = canvas
			.getByRole("heading", { level: 1 })
			.getBoundingClientRect();
		const action = canvas
			.getByRole("button", { name: "Edit" })
			.getBoundingClientRect();
		expect(title.right).toBeLessThanOrEqual(action.left);
	},
};
export const Loading: Story = {
	render: () => (
		<DashboardWorkspaceToolbar.Skeleton title="Organization settings" />
	),
};
export const SecondaryControls: Story = {
	args: {
		title: "Records",
		secondaryControls: (
			<Button size="sm" variant="ghost">
				All records
			</Button>
		),
		actions: (
			<Button size="sm" variant="primary">
				Create record
			</Button>
		),
	},
};

function ShellExample() {
	const [collapsed, setCollapsed] = useState(false);
	const [open, setOpen] = useState(false);
	return (
		<DashboardShellProvider openNavigation={() => setOpen(true)}>
			<DashboardSidebarShell
				collapsed={collapsed}
				onCollapsedChange={setCollapsed}
				mobileOpen={open}
				onMobileOpenChange={setOpen}
				brand={
					<Logo
						variant="mark"
						size="sm"
						tone="dark"
						href="#"
						aria-label="Dashboard overview"
					/>
				}
				identity={<span className="truncate text-sm">Demo organization</span>}
				body={
					<nav aria-label="Dashboard navigation" className="grid gap-1 px-2">
						<Button size="sm" variant="ghost" leadingIcon="home">
							{!collapsed && "Overview"}
						</Button>
						<Button size="sm" variant="ghost" leadingIcon="database">
							{!collapsed && "Records"}
						</Button>
					</nav>
				}
				footer={
					<Button
						variant="bare"
						size="icon-sm"
						leadingIcon="user"
						aria-label="Open account menu"
					/>
				}
			/>
			<div className={getDashboardSidebarOffsetClassNames(collapsed).content}>
				<div
					className="flex h-full flex-col sm:pr-1 sm:pb-1 lg:pr-2 lg:pb-2"
					inert={open || undefined}
				>
					<DashboardToolbarOutlet />
					<div
						className="min-h-0 flex-1 overflow-hidden bg-background sm:rounded-lg lg:rounded-xl"
						data-dashboard-workspace
					>
						<DashboardContentShell layoutWidth="standard">
							<DashboardWorkspaceToolbar title="Organization settings" />
							<div className="dashboard-page-body mx-auto grid gap-6 px-3 py-5 sm:px-5">
								<ContentSection>
									<ContentSection.Heading
										title="Organization identity"
										description="Name and public identity used across your workspace."
									/>
									<Card padding="md">Demo organization</Card>
								</ContentSection>
								<ContentSection>
									<ContentSection.Heading
										title="People and access"
										description="Membership and access belong in one cohesive group."
									/>
									<Card padding="md">3 members · 1 invitation</Card>
								</ContentSection>
							</div>
						</DashboardContentShell>
					</div>
				</div>
			</div>
		</DashboardShellProvider>
	);
}
export const Shell: Story = {
	render: () => <ShellExample />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		if (window.innerWidth >= 1024) {
			await userEvent.click(
				canvas.getByRole("button", { name: "Collapse sidebar" }),
			);
			expect(
				canvas.getByRole("button", { name: "Expand sidebar" }),
			).toHaveAttribute("aria-expanded", "false");
			await userEvent.click(
				canvas.getByRole("button", { name: "Expand sidebar" }),
			);
		}
		expect(
			canvas.getByRole("heading", { name: "Organization settings" }),
		).toBeVisible();
	},
};

export const SidebarSections: Story = {
	render: () => (
		<div className="w-60 bg-sidebar p-2">
			<DashboardSidebarSection
				label="Workspace"
				count={4}
				storageId="story-workspace"
				collapsed={false}
				mobileExpanded
			>
				{["Overview", "New chat", "Records", "Connections"].map((label) => (
					<DashboardSidebarItem
						key={label}
						active={label === "Records"}
						href={`/dashboard/${label.toLowerCase()}`}
						label={label}
						icon="database"
						onNavigate={() => {}}
					/>
				))}
			</DashboardSidebarSection>
			<DashboardSidebarSection
				label="Chats"
				count={4}
				storageId="story-assistant"
				collapsed={false}
				mobileExpanded
			>
				<div>Launch brief</div>
				<div>Customer review</div>
				<div>All conversations</div>
			</DashboardSidebarSection>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(
			canvas.queryByRole("button", { name: /Workspace section/ }),
		).toBeInTheDocument();
		const toggle = canvas.getByRole("button", { name: /Chats section/ });
		if (toggle.getAttribute("aria-expanded") === "false")
			await userEvent.click(toggle);
		await userEvent.click(
			canvas.getByRole("button", { name: "Collapse Chats section" }),
		);
		expect(
			canvas.getByRole("button", { name: "Expand Chats section" }),
		).toHaveAttribute("aria-expanded", "false");
		await userEvent.click(
			canvas.getByRole("button", { name: "Expand Chats section" }),
		);
		expect(canvas.getByRole("link", { name: "New chat" })).toBeVisible();
	},
};

export const ChatRowActions: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Only the explicit chat row ellipsis uses a subtle 102% hover scale. Ordinary menu ellipses retain their 15px size on hover. Reduced motion and motion-off settings disable the chat scale.",
			},
		},
	},
	render: () => (
		<div className="w-60 bg-sidebar p-2">
			<DashboardSidebarItem
				active={false}
				href="/dashboard/chats/story-thread"
				icon={null}
				label="Record review"
				onNavigate={() => {}}
				actions={
					<DashboardSidebarThreadActionsMenu
						active={false}
						onDelete={() => {}}
						onUpdate={() => {}}
						thread={{
							id: "story-thread",
							title: "Record review",
							pinned: false,
							createdAt: "2026-10-08T08:00:00Z",
							updatedAt: "2026-10-08T08:00:00Z",
							organizationId: "story-org",
							userId: "story-user",
							lastMessagePreview: "Review records",
						}}
					/>
				}
			/>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		canvas.getByRole("link", { name: "Record review" }).focus();
		await userEvent.tab();
		const trigger = canvas.getByRole("button", {
			name: "Manage Record review",
		});
		await expect(trigger).toHaveFocus();
		await userEvent.keyboard("{Enter}");
		await expect(trigger).toHaveAttribute("aria-expanded", "true");
		await userEvent.keyboard("{Escape}");
		await expect(trigger).toHaveAttribute("aria-expanded", "false");
		await expect(trigger).toHaveFocus();
	},
};
