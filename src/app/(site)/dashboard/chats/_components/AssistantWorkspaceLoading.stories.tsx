import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent } from "storybook/test";
import { IconProvider } from "@/components/ui/icons/iconRegistry";
import { openaiIconRegistry } from "@/components/ui/icons/openaiRegistry";
import {
	DashboardShellProvider,
	DashboardToolbarOutlet,
} from "../../_components/layout/DashboardShellContext";
import { AssistantWorkspaceLoading } from "./AssistantWorkspaceLoading";

function LoadingExample({ variant }: { variant: "new" | "thread" }) {
	const [draft, setDraft] = useState("");
	return (
		<IconProvider registry={openaiIconRegistry}>
			<DashboardShellProvider openNavigation={() => {}}>
				<div className="flex h-[700px] flex-col bg-paper">
					<DashboardToolbarOutlet />
					<AssistantWorkspaceLoading
						variant={variant}
						draft={draft}
						onDraftChange={setDraft}
					/>
				</div>
			</DashboardShellProvider>
		</IconProvider>
	);
}
const meta = {
	id: "dashboard-assistant-loading",
	title: "Dashboard/Assistant/Loading",
	tags: ["autodocs"],
	parameters: {
		nextjs: { appDirectory: true },
		layout: "fullscreen",
		a11y: { test: "error" },
		docs: {
			description: {
				component:
					"Route-owned loading gates. New chat preserves known title, welcome and empty state. Existing threads reserve unknown metadata and messages separately. Both keep the real input frame and editable draft; send, attachments and permission controls wait for required data. Session-local drafts survive the route loading boundary and new-thread handoff. Forced loading of a hydrated thread keeps the composer mounted, including attachments and selected context.",
			},
		},
	},
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const NewChat: Story = {
	render: () => <LoadingExample variant="new" />,
	play: async ({ canvas }) => {
		await expect(
			canvas.getByText("What would you like to work on?"),
		).toBeVisible();
		await expect(canvas.getByText("New conversation")).toBeVisible();
		await expect(
			canvas.queryByRole("region", { name: "Loading conversation messages" }),
		).toBeNull();
		const input = canvas.getByRole("textbox", { name: "Message Assistant" });
		await expect(input).toBeEnabled();
		await userEvent.type(input, "Draft while preparing{enter}");
		await expect(input).toHaveValue("Draft while preparing");
		await expect(
			canvas.getByRole("button", { name: "Send message" }),
		).toBeDisabled();
	},
};
export const ExistingThread: Story = {
	render: () => <LoadingExample variant="thread" />,
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole("region", { name: "Loading conversation messages" }),
		).toHaveAttribute("aria-busy", "true");
		await expect(
			canvas.queryByText("What would you like to work on?"),
		).toBeNull();
		const input = canvas.getByRole("textbox", { name: "Message Assistant" });
		await expect(input).toBeEnabled();
		await userEvent.type(input, "Keep drafting{enter}");
		await expect(input).toHaveValue("Keep drafting");
		await expect(
			canvas.getByRole("button", { name: "Send message" }),
		).toBeDisabled();
	},
};
