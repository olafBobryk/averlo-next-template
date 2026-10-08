import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { FileInput, type FileInputItem } from "./FileInput";
import { catalogContract } from "./FileInput.catalog";

const onFilesRejected = fn();
function FileInputExample() {
	const [items, setItems] = useState<FileInputItem[]>([]);
	return (
		<div className="w-[560px] max-w-full">
			<FileInput
				accept="image/*"
				items={items}
				label="Assets"
				onFilesRejected={onFilesRejected}
				onItemsChange={setItems}
			/>
		</div>
	);
}
const meta = {
	id: "ui-input-file-input",
	excludeStories: ["catalogContract"],
	title: "UI/Input/Files/FileInput",
	component: FileInput,
	subcomponents: { "FileInput.Skeleton": FileInput.Skeleton },
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		layout: "padded",
		a11y: { test: "error" },
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
} satisfies Meta<typeof FileInput>;
export default meta;
type Story = StoryObj;

export const SelectionContract: Story = {
	parameters: { a11y: { test: "error" } },
	render: () => <FileInputExample />,
	play: async ({ canvas, canvasElement }) => {
		onFilesRejected.mockClear();
		const input = canvasElement.querySelector('input[type="file"]');
		if (!(input instanceof HTMLInputElement))
			throw new Error("File input missing");
		await userEvent.upload(
			input,
			new File(["image"], "cover.png", { type: "image/png" }),
		);
		await expect(
			canvas.getByRole("button", { name: "Remove cover.png" }),
		).toBeInTheDocument();
		await userEvent.upload(
			input,
			new File(["text"], "notes.txt", { type: "text/plain" }),
			{ applyAccept: false },
		);
		await expect(onFilesRejected).toHaveBeenCalledOnce();
		await expect(canvas.getByRole("alert")).toHaveTextContent(
			"notes.txt is not an accepted file type.",
		);
	},
};

export const ReadOnlyAndSkeleton: Story = {
	render: () => (
		<div className="grid gap-5">
			<FileInput
				items={[]}
				label="Files"
				mode="read"
				onItemsChange={() => {}}
			/>
			<FileInput.Skeleton label="Files" />
		</div>
	),
};

export const ExternalAddControlPresentation: Story = {
	parameters: { a11y: { test: "error" } },
	render: () => (
		<div className="w-[560px] max-w-full">
			<FileInput
				items={[
					{
						key: "portrait",
						name: "portrait.jpg",
						status: "uploaded",
						type: "image/jpeg",
						url: "/test/placeholder-portrait.jpg",
					},
					{
						key: "shapes",
						name: "shapes.jpg",
						status: "uploaded",
						type: "image/jpeg",
						url: "/test/placeholder-square.jpg",
					},
				]}
				label={null}
				onItemsChange={() => {}}
				showAddControl={false}
			/>
		</div>
	),
	play: async ({ canvas }) => {
		await expect(canvas.queryByText("Files")).not.toBeInTheDocument();
		await expect(
			canvas.queryByRole("button", { name: "Add file" }),
		).not.toBeInTheDocument();
		await expect(
			canvas.getByRole("button", { name: "Remove portrait.jpg" }),
		).toBeInTheDocument();
		await expect(
			canvas.getByRole("img", { name: "file-1" }).getAttribute("src"),
		).toContain("/test/placeholder-square.jpg");
	},
};

function solidPreview(color: "black" | "white") {
	return `data:image/svg+xml,${encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" fill="${color}"/></svg>`,
	)}`;
}

export const AdaptivePreviewActions: Story = {
	parameters: { a11y: { test: "error" } },
	render: () => (
		<div className="w-[560px] max-w-full">
			<FileInput
				items={[
					{
						key: "bright-image",
						name: "bright.png",
						status: "uploaded",
						type: "image/svg+xml",
						unoptimized: true,
						url: solidPreview("white"),
					},
					{
						key: "dark-image",
						name: "dark.png",
						status: "uploaded",
						type: "image/svg+xml",
						unoptimized: true,
						url: solidPreview("black"),
					},
				]}
				label={null}
				onItemsChange={() => {}}
				showAddControl={false}
			/>
		</div>
	),
	play: async ({ canvas }) => {
		await waitFor(() =>
			expect(
				canvas.getByRole("button", { name: "Remove bright.png" }),
			).toHaveAttribute("data-preview-shade", "light"),
		);
		await waitFor(() =>
			expect(
				canvas.getByRole("button", { name: "Remove dark.png" }),
			).toHaveAttribute("data-preview-shade", "dark"),
		);
		const brightAction = canvas.getByRole("button", {
			name: "Remove bright.png",
		});
		const darkAction = canvas.getByRole("button", { name: "Remove dark.png" });
		await waitFor(() =>
			expect(getComputedStyle(brightAction).color).toBe("rgb(0, 0, 0)"),
		);
		await waitFor(() =>
			expect(getComputedStyle(darkAction).color).toBe("rgb(255, 255, 255)"),
		);
		for (const action of [brightAction, darkAction]) {
			await expect(getComputedStyle(action).backgroundColor).toBe(
				"rgba(0, 0, 0, 0)",
			);
		}
	},
};

export const PreviewDelegation: Story = {
	render: () => (
		<FileInput
			mode="read"
			label="Files"
			items={[
				{
					status: "uploaded",
					name: "Brief.pdf",
					type: "application/pdf",
					url: "/test/file-viewer.pdf",
				},
			]}
			onItemsChange={() => {}}
			onPreview={previewFile}
		/>
	),
	play: async ({ canvas }) => {
		previewFile.mockClear();
		await userEvent.click(
			canvas.getByRole("button", { name: "Open Brief.pdf" }),
		);
		await expect(previewFile).toHaveBeenCalledWith(
			expect.objectContaining({ name: "Brief.pdf", type: "application/pdf" }),
		);
	},
};
const previewFile = fn();

export const CompactChatAttachments: Story = {
	render: () => (
		<div className="grid w-80 max-w-full gap-4">
			<FileInput
				label={null}
				items={[
					{
						status: "uploaded",
						name: "project-bob-client-brief-2026-06-26.pdf",
						type: "application/pdf",
						url: "/test/file-viewer.pdf",
					},
				]}
				onItemsChange={() => {}}
				onPreview={previewFile}
				showAddControl={false}
			/>
			<FileInput.Skeleton count={1} label={null} mode="read" />
		</div>
	),
	play: async ({ canvas }) => {
		previewFile.mockClear();
		const name = "project-bob-client-brief-2026-06-26.pdf";
		const open = canvas.getByRole("button", { name: `Open ${name}` });
		const card = open.closest('[data-slot="card"]');
		if (!(card instanceof HTMLElement))
			throw new Error("Attachment card missing");
		const bounds = card.getBoundingClientRect();
		await expect(bounds.width).toBeLessThan(190);
		await expect(Math.abs(bounds.width / bounds.height - 16 / 9)).toBeLessThan(
			0.02,
		);
		const close = canvas.getByRole("button", { name: `Remove ${name}` });
		await expect(getComputedStyle(close).backgroundColor).toBe(
			"rgba(0, 0, 0, 0)",
		);
		await waitFor(
			() => expect(close).toHaveAttribute("data-preview-shade", "light"),
			{ timeout: 20000 },
		);
		await waitFor(() =>
			expect(getComputedStyle(close).color).toBe("rgb(0, 0, 0)"),
		);
		await userEvent.click(open);
		await expect(previewFile).toHaveBeenCalledWith(
			expect.objectContaining({ name }),
		);
	},
};

export const PdfCardPreview: Story = {
	render: () => (
		<FileInput
			label="Document"
			mode="read"
			items={[
				{
					key: "pdf",
					status: "uploaded",
					name: "Project brief.pdf",
					type: "application/pdf",
					url: "/test/file-viewer.pdf",
				},
			]}
			onItemsChange={() => {}}
		/>
	),
	play: async ({ canvas }) => {
		const preview = await canvas.findByRole(
			"img",
			{ name: "Project brief.pdf, first page" },
			{ timeout: 20000 },
		);
		await waitFor(() => expect(preview).toBeVisible(), { timeout: 20000 });
		await expect(preview.closest('[data-slot="card"]')).toHaveAttribute(
			"data-surface-role",
			"card",
		);
		await expect(canvas.getByText("Project brief.pdf")).toBeVisible();
	},
};
