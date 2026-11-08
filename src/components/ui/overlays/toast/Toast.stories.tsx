import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { expect, userEvent, within } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { showToast } from "../../../../lib/feedback";
import { Button } from "../../primitives/Button";
import { catalogContract } from "./Toast.catalog";
import ToastHost from "./ToastHost";

const meta = {
	id: "ui-overlays-toast",
	excludeStories: ["catalogContract"],
	title: "UI/Overlays/Toast",
	component: ToastHost,
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		layout: "fullscreen",
		a11y: { test: "error" },
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
} satisfies Meta<typeof ToastHost>;

export default meta;
type Story = StoryObj;

export const SemanticFeedback: Story = {
	render: () => (
		<div className="flex gap-2 p-8">
			<ToastHost />
			<Button
				onClick={() =>
					showToast.success("Settings saved.", { title: "Success" })
				}
			>
				Show success
			</Button>
			<Button
				onClick={() => showToast.error("Upload failed.", { title: "Failed" })}
				variant="secondary"
			>
				Show error
			</Button>
		</div>
	),
	play: async ({ canvas }) => {
		await userEvent.click(canvas.getByRole("button", { name: "Show success" }));
		await expect(
			await within(document.body).findByText("Success: Settings saved."),
		).toBeInTheDocument();
		showToast.dismiss();
	},
};

export const PromiseLifecycle: Story = {
	render: () => (
		<div className="p-8">
			<ToastHost />
			<Button
				onClick={() =>
					showToast.promise(
						Promise.resolve("saved"),
						{
							loading: "Saving changes...",
							success: "Changes saved.",
							error: "Save failed.",
						},
						{ successTitle: "Success" },
					)
				}
			>
				Save with feedback
			</Button>
		</div>
	),
	play: async ({ canvas }) => {
		await userEvent.click(
			canvas.getByRole("button", { name: "Save with feedback" }),
		);
		await expect(
			await within(document.body).findByText("Success: Changes saved."),
		).toBeInTheDocument();
		showToast.dismiss();
	},
};

function startCancellableUpload(signal: AbortSignal) {
	return new Promise<void>((_, reject) => {
		signal.addEventListener("abort", () => reject(signal.reason), {
			once: true,
		});
	});
}

export const PromiseCancel: Story = {
	render: function Render() {
		const controllerRef = React.useRef<AbortController | null>(null);
		return (
			<div className="flex gap-2 p-8">
				<ToastHost />
				<Button
					onClick={() => {
						const controller = new AbortController();
						controllerRef.current = controller;
						showToast
							.promise(
								startCancellableUpload(controller.signal),
								{
									loading: "Uploading file...",
									success: "Upload finished.",
									error: "Upload failed.",
									cancelled: "Upload cancelled.",
								},
								{ signal: controller.signal },
							)
							.catch(() => undefined);
					}}
				>
					Start upload
				</Button>
				<Button
					onClick={() => controllerRef.current?.abort()}
					variant="secondary"
				>
					Cancel upload
				</Button>
			</div>
		);
	},
	play: async ({ canvas }) => {
		const body = within(document.body);
		await userEvent.click(canvas.getByRole("button", { name: "Start upload" }));
		await expect(
			await body.findByText("Uploading file..."),
		).toBeInTheDocument();
		await userEvent.click(
			canvas.getByRole("button", { name: "Cancel upload" }),
		);
		const note = await body.findByText("Upload cancelled.");
		await expect(note.closest("[data-type]")).toHaveAttribute(
			"data-type",
			"info",
		);
		await expect(body.queryByText("Upload failed.")).toBeNull();
		showToast.dismiss();
	},
};

export const StackedFeedback: Story = {
	render: () => (
		<div className="p-8">
			<ToastHost />
			<Button
				onClick={() => {
					showToast.info("Queued upload started.", { title: "Pipeline" });
					showToast.success("Upload finished.", { title: "Pipeline" });
				}}
			>
				Show pipeline feedback
			</Button>
		</div>
	),
	play: async ({ canvas }) => {
		await userEvent.click(
			canvas.getByRole("button", { name: "Show pipeline feedback" }),
		);
		const body = within(document.body);
		await expect(
			await body.findByText("Pipeline: Queued upload started."),
		).toBeInTheDocument();
		await expect(
			await body.findByText("Pipeline: Upload finished."),
		).toBeInTheDocument();
		showToast.dismiss();
	},
};
