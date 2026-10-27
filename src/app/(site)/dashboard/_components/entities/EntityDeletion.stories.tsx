import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { getRouter } from "@storybook/nextjs-vite/navigation.mock";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ModalHost } from "@/components/ui/overlays/modal/ModalHost";
import { EntityDeletionDetailMenu } from "./EntityDeletion";

// A regression fixture for the private lifecycle adapter, not another public catalogue owner.
const meta = {
	title: "Dashboard/Entities/Deletion lifecycle",
	parameters: { nextjs: { appDirectory: true }, a11y: { test: "error" } },
} satisfies Meta;
export default meta;
type Story = StoryObj;
const request = {
	returnedFailure: () => {},
	thrownFailure: () => {},
	success: () => {},
};
function DeletionHarness() {
	const [visible, setVisible] = useState(true);
	const [requests, setRequests] = useState(0);
	return (
		<div className="p-8">
			<div id="modal-root" />
			<ModalHost />
			<output>
				{visible
					? "North star is available"
					: "North star removed optimistically"}
			</output>
			<output>Requests: {requests}</output>
			<EntityDeletionDetailMenu
				definition={{
					entityLabel: "North star",
					entityTypeLabel: "Record",
					impacts: [],
					warning: "",
				}}
				completion={{
					type: "navigate",
					href: "/dashboard/records",
					replace: true,
				}}
				onOptimisticDelete={() => setVisible(false)}
				onRollback={() => setVisible(true)}
				deleteEntity={() => {
					setRequests((count) => count + 1);
					return new Promise<{ ok: boolean; message: string }>(
						(resolve, reject) => {
							request.returnedFailure = () =>
								resolve({ ok: false, message: "Not removed. Try again." });
							request.thrownFailure = () =>
								reject(new Error("Controlled transport failure"));
							request.success = () =>
								resolve({ ok: true, message: "Record removed." });
						},
					);
				}}
			/>
		</div>
	);
}
export const ReturnedAndThrownRollback: Story = {
	render: () => <DeletionHarness />,
	beforeEach: () => {
		getRouter().replace.mockClear();
		getRouter().push.mockClear();
		getRouter().refresh.mockClear();
	},
	play: async ({ canvas }) => {
		const body = within(document.body);
		const open = async () => {
			await userEvent.click(
				canvas.getByRole("button", { name: "Open actions for North star" }),
			);
			await userEvent.click(
				await body.findByRole("menuitem", { name: "Delete" }),
			);
			return body.findByRole("dialog", { name: "Delete North star?" });
		};
		let dialog = await open();
		await userEvent.click(
			within(dialog).getByRole("button", { name: "Cancel" }),
		);
		await waitFor(() => expect(dialog).not.toBeInTheDocument());
		await expect(canvas.getByText("Requests: 0")).toBeInTheDocument();
		dialog = await open();
		const confirm = within(dialog).getByRole("button", { name: "Delete" });
		for (const [index, settle] of [
			() => request.returnedFailure(),
			() => request.thrownFailure(),
			() => request.success(),
		].entries()) {
			confirm.click();
			confirm.click();
			await waitFor(() =>
				expect(canvas.getByText(`Requests: ${index + 1}`)).toBeInTheDocument(),
			);
			await expect(
				canvas.getByText("North star removed optimistically"),
			).toBeInTheDocument();
			settle();
			if (index < 2) {
				await waitFor(() =>
					expect(
						canvas.getByText("North star is available"),
					).toBeInTheDocument(),
				);
				await expect(within(dialog).getAllByRole("alert")).toHaveLength(1);
				await expect(confirm).toBeEnabled();
				await expect(getRouter().replace).not.toHaveBeenCalled();
			}
		}
		await waitFor(() => expect(dialog).not.toBeInTheDocument());
		await expect(getRouter().replace).toHaveBeenCalledTimes(1);
		await expect(getRouter().replace).toHaveBeenCalledWith(
			"/dashboard/records",
		);
		await expect(getRouter().push).not.toHaveBeenCalled();
		await expect(getRouter().refresh).not.toHaveBeenCalled();
	},
};
