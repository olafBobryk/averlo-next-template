import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Button } from "../../primitives/Button";
import { ConfirmationModal } from "./ConfirmationModal";
import { catalogContract } from "./ConfirmationModal.catalog";
import { ModalHost } from "./ModalHost";
import { useConfirmationModal } from "./useConfirmationModal";
import { useModal } from "./useModal";

function ConfirmationHarness() {
	const [confirmations, setConfirmations] = useState(0);
	const { openConfirmation } = useConfirmationModal();
	return (
		<>
			<div id="modal-root" />
			<ModalHost />
			<Button
				onClick={() =>
					openConfirmation({
						title: "Delete report?",
						description: "Review the impact before continuing.",
						confirmLabel: "Delete report",
						details: [{ label: "Report", description: "Quarterly review" }],
						warning: "This cannot be undone.",
						onConfirm: () => {
							setConfirmations((count) => count + 1);
							return false;
						},
					})
				}
			>
				Open confirmation
			</Button>
			<output aria-live="polite">Confirmed {confirmations} times</output>
		</>
	);
}

const meta = {
	id: "ui-overlays-confirmation-modal",
	excludeStories: ["catalogContract"],
	title: "UI/Overlays/ConfirmationModal",
	component: ConfirmationModal,
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		layout: "fullscreen",
		a11y: { test: "error" },
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
} satisfies Meta<typeof ConfirmationModal>;

export default meta;
type Story = StoryObj;

export const ConfirmationContract: Story = {
	parameters: { a11y: { test: "error" } },
	render: () => (
		<div className="flex gap-4 p-8">
			<ConfirmationHarness />
		</div>
	),
	play: async ({ canvas }) => {
		await userEvent.click(
			canvas.getByRole("button", { name: "Open confirmation" }),
		);
		const body = within(document.body);
		const dialog = await body.findByRole("dialog", { name: "Delete report?" });
		await expect(body.getByText("Quarterly review")).toBeInTheDocument();
		await expect(body.getByText("This cannot be undone.")).toBeInTheDocument();
		await userEvent.click(body.getByRole("button", { name: "Delete report" }));
		await expect(canvas.getByText("Confirmed 1 times")).toBeInTheDocument();
		await expect(dialog).toBeInTheDocument();
	},
};

type AttemptResult = { ok: false; message: string } | true;
const attempt = {
	settle: (_result: AttemptResult) => {},
	dismissAll: () => {},
};
function RecoverableHarness() {
	const [calls, setCalls] = useState(0);
	const { openConfirmation } = useConfirmationModal();
	const { closeAll } = useModal();
	attempt.dismissAll = closeAll;
	return (
		<>
			<div id="modal-root" />
			<ModalHost />
			<Button
				onClick={() =>
					openConfirmation({
						title: "Remove draft?",
						description: "The draft stays available if removal fails.",
						confirmLabel: "Remove draft",
						onConfirm: () => {
							setCalls((count) => count + 1);
							return new Promise<AttemptResult>((resolve) => {
								attempt.settle = resolve;
							});
						},
					})
				}
			>
				Review removal
			</Button>
			<output>Requests: {calls}</output>
		</>
	);
}

export const RecoverableFailureAndRetry: Story = {
	render: () => (
		<div className="p-8">
			<RecoverableHarness />
		</div>
	),
	play: async ({ canvas }) => {
		const body = within(document.body);
		await userEvent.click(
			canvas.getByRole("button", { name: "Review removal" }),
		);
		const dialog = await body.findByRole("dialog", { name: "Remove draft?" });
		const confirm = within(dialog).getByRole("button", {
			name: "Remove draft",
		});
		const before = { width: confirm.offsetWidth, height: confirm.offsetHeight };
		// Both dispatches occur before React paints disabled state: the ref guard must win.
		confirm.click();
		confirm.click();
		await waitFor(() =>
			expect(canvas.getByText("Requests: 1")).toBeInTheDocument(),
		);
		await expect(confirm).toHaveAttribute("aria-busy", "true");
		await expect(confirm.offsetWidth).toBe(before.width);
		await expect(confirm.offsetHeight).toBe(before.height);
		await expect(
			within(dialog).getByRole("button", { name: "Cancel" }),
		).toBeDisabled();
		await expect(
			within(dialog).getByRole("button", { name: "Cancel" }),
		).not.toHaveAttribute("aria-busy");
		await expect(
			within(dialog).getByRole("button", { name: "Close modal" }),
		).toBeDisabled();
		await userEvent.keyboard("{Escape}");
		const backdrop = body
			.getAllByRole("button", { name: "Close modal" })
			.find((node) => !dialog.contains(node))!;
		await userEvent.click(backdrop);
		attempt.dismissAll();
		await expect(dialog).toBeInTheDocument();
		attempt.settle({
			ok: false,
			message: "Draft removal failed. Your draft is still available.",
		});
		await waitFor(() =>
			expect(within(dialog).getByRole("alert")).toHaveTextContent(
				"Your draft is still available",
			),
		);
		await expect(confirm).toBeEnabled();
		await expect(
			within(dialog).getByRole("button", { name: "Cancel" }),
		).toBeEnabled();
		await expect(
			within(dialog).getByRole("button", { name: "Close modal" }),
		).toBeEnabled();
		await userEvent.click(confirm);
		await waitFor(() =>
			expect(canvas.getByText("Requests: 2")).toBeInTheDocument(),
		);
		attempt.settle(true);
		await waitFor(() => expect(dialog).not.toBeInTheDocument());
	},
};
