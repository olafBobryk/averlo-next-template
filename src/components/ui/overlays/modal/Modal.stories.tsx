import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Button } from "../../primitives/Button";
import { Text } from "../../primitives/Text";
import { catalogContract } from "./Modal.catalog";
import { ModalCard } from "./ModalCard";
import { ModalHost } from "./ModalHost";
import {
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalShell,
	ModalTitle,
	useModalSubmission,
} from "./ModalShell";
import { useModal } from "./useModal";

function StandardModalContent({ close }: { close: () => void }) {
	return (
		<>
			<ModalHeader>
				<ModalTitle>Account details</ModalTitle>
			</ModalHeader>
			<ModalContent>
				<Text>Hosted modal content.</Text>
			</ModalContent>
			<ModalFooter>
				<Button onClick={close}>Done</Button>
			</ModalFooter>
		</>
	);
}

function SubmissionContent() {
	const { beginSubmission, endSubmission, isSubmitting } = useModalSubmission();
	return (
		<>
			<ModalHeader>
				<ModalTitle>Submitting modal</ModalTitle>
			</ModalHeader>
			<ModalContent>
				<output aria-live="polite">
					{isSubmitting ? "Submission locked" : "Ready"}
				</output>
			</ModalContent>
			<ModalFooter>
				<Button onClick={beginSubmission}>Begin submission</Button>
				<Button onClick={endSubmission} variant="secondary">
					End submission
				</Button>
			</ModalFooter>
		</>
	);
}

function ModalHarness({ submission = false }: { submission?: boolean }) {
	const { openModal } = useModal();
	return (
		<>
			<div id="modal-root" />
			<ModalHost />
			<Button
				onClick={() =>
					openModal(
						({ close }) =>
							submission ? (
								<SubmissionContent />
							) : (
								<StandardModalContent close={close} />
							),
						{ ariaLabel: submission ? "Submitting modal" : "Account details" },
					)
				}
			>
				Open modal
			</Button>
		</>
	);
}

const meta = {
	id: "ui-overlays-modal",
	excludeStories: ["catalogContract"],
	title: "UI/Overlays/Modal",
	component: ModalShell,
	subcomponents: {
		ModalCard,
		ModalHost,
		ModalHeader,
		ModalContent,
		ModalFooter,
	},
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		layout: "fullscreen",
		a11y: { test: "error" },
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
} satisfies Meta<typeof ModalShell>;

export default meta;
type Story = StoryObj;

export const HostedFocusAndDismissal: Story = {
	render: () => (
		<div className="p-8">
			<ModalHarness />
		</div>
	),
	play: async ({ canvas }) => {
		const trigger = canvas.getByRole("button", { name: "Open modal" });
		await userEvent.click(trigger);
		const body = within(document.body);
		const dialog = await body.findByRole("dialog", { name: "Account details" });
		await expect(dialog).toBeInTheDocument();
		const closeButtons = body.getAllByRole("button", { name: "Close modal" });
		await expect(closeButtons.at(-1)).toHaveFocus();
		await userEvent.keyboard("{Escape}");
		await waitFor(() =>
			expect(
				body.queryByRole("dialog", { name: "Account details" }),
			).not.toBeInTheDocument(),
		);
		await expect(trigger).toHaveFocus();
	},
};

export const SubmissionCloseLock: Story = {
	render: () => (
		<div className="p-8">
			<ModalHarness submission />
		</div>
	),
	play: async ({ canvas }) => {
		await userEvent.click(canvas.getByRole("button", { name: "Open modal" }));
		const body = within(document.body);
		const dialog = await body.findByRole("dialog", {
			name: "Submitting modal",
		});
		await userEvent.click(
			body.getByRole("button", { name: "Begin submission" }),
		);
		await expect(body.getByText("Submission locked")).toBeInTheDocument();
		const closeButtons = body.getAllByRole("button", { name: "Close modal" });
		await expect(closeButtons.at(-1)).toBeDisabled();
		await userEvent.keyboard("{Escape}");
		await expect(dialog).toBeInTheDocument();
		await userEvent.click(body.getByRole("button", { name: "End submission" }));
		await userEvent.keyboard("{Escape}");
		await waitFor(() =>
			expect(
				body.queryByRole("dialog", { name: "Submitting modal" }),
			).not.toBeInTheDocument(),
		);
	},
};

function LeftDrawerHarness() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button onClick={() => setOpen(true)}>Open navigation</Button>
			{open && (
				<ModalShell
					ariaLabel="Navigation drawer"
					placement="left"
					panelDirection="left"
					onClose={() => setOpen(false)}
				>
					<ModalCard radius="none" className="h-full">
						<ModalHeader>
							<ModalTitle>Workspace</ModalTitle>
						</ModalHeader>
						<ModalContent>
							<Button onClick={() => setOpen(false)}>Go to overview</Button>
						</ModalContent>
					</ModalCard>
				</ModalShell>
			)}
		</>
	);
}
export const LeftDrawer: Story = {
	render: () => <LeftDrawerHarness />,
	play: async ({ canvas }) => {
		const trigger = canvas.getByRole("button", { name: "Open navigation" });
		await userEvent.click(trigger);
		const body = within(document.body);
		const dialog = await body.findByRole("dialog", {
			name: "Navigation drawer",
		});
		const first = within(dialog).getByRole("button", { name: "Close modal" });
		await expect(first).toHaveFocus();
		await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
		await expect(
			within(dialog).getByRole("button", { name: "Go to overview" }),
		).toHaveFocus();
		await userEvent.keyboard("{Tab}");
		await expect(first).toHaveFocus();
		await waitFor(() =>
			expect(Math.abs(dialog.getBoundingClientRect().left)).toBeLessThan(1),
		);
		await userEvent.keyboard("{Escape}");
		await waitFor(() =>
			expect(
				body.queryByRole("dialog", { name: "Navigation drawer" }),
			).not.toBeInTheDocument(),
		);
		await expect(trigger).toHaveFocus();
	},
};

function FullscreenExample() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button onClick={() => setOpen(true)}>Open full-screen viewer</Button>
			{open && (
				<ModalShell
					placement="fullscreen"
					ariaLabel="Full-screen viewer"
					onClose={() => setOpen(false)}
				>
					<ModalCard className="h-full max-w-none rounded-none">
						<ModalHeader onClose={() => setOpen(false)}>
							<ModalTitle>Full-screen viewer</ModalTitle>
						</ModalHeader>
						<ModalContent>Viewer content</ModalContent>
					</ModalCard>
				</ModalShell>
			)}
		</>
	);
}
export const Fullscreen: Story = {
	render: () => <FullscreenExample />,
	play: async ({ canvas }) => {
		await userEvent.click(
			canvas.getByRole("button", { name: "Open full-screen viewer" }),
		);
		const dialog = await within(document.body).findByRole("dialog", {
			name: "Full-screen viewer",
		});
		await waitFor(() => expect(dialog).toBeVisible());
		await expect(dialog.getBoundingClientRect().width).toBe(window.innerWidth);
		await expect(dialog.getBoundingClientRect().height).toBe(
			window.innerHeight,
		);
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(dialog).not.toBeInTheDocument());
	},
};
