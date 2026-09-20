import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fireEvent, fn, userEvent, waitFor } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { ImageSwitcher } from "./ImageSwitcher";
import { catalogContract } from "./ImageSwitcher.catalog";

const images = [
	{
		src: "/test/placeholder-portrait.jpg",
		alt: "Abstract blue portrait composition",
	},
	{
		src: "/test/placeholder-square.jpg",
		alt: "Overlapping charcoal and coral shapes",
	},
] as const;
const meta = {
	id: "ui-misc-image-switcher",
	title: "UI/Misc/ImageSwitcher",
	component: ImageSwitcher,
	excludeStories: ["catalogContract", "images"],
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		a11y: { test: "error" },
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
	args: { images, intervalMs: 0, onIndexChange: fn(), frameClassName: "h-72" },
} satisfies Meta<typeof ImageSwitcher>;
export default meta;
type Story = StoryObj<typeof meta>;
export const NavigationContract: Story = {
	play: async ({ args, canvas }) => {
		await expect(canvas.getByText("1/2")).toBeVisible();
		await userEvent.click(canvas.getByRole("button", { name: "Next image" }));
		await expect(canvas.getByText("2/2")).toBeVisible();
		await expect(args.onIndexChange).toHaveBeenCalledWith(1);
		await userEvent.click(
			canvas.getByRole("button", { name: "Previous image" }),
		);
		await expect(args.onIndexChange).toHaveBeenCalledWith(0);
	},
};
export const SingleImageContract: Story = {
	args: { images: [images[0]], intervalMs: 0 },
	play: async ({ canvas }) => {
		await expect(
			canvas.getByAltText("Abstract blue portrait composition"),
		).toBeVisible();
		await expect(
			canvas.queryByRole("button", { name: "Next image" }),
		).not.toBeInTheDocument();
	},
};

function ControlledImageSwitcher({
	onIndexChange,
}: {
	onIndexChange?: (index: number) => void;
}) {
	const [selectedIndex, setSelectedIndex] = useState(0);

	return (
		<div className="grid max-w-2xl gap-4">
			<fieldset className="flex flex-wrap gap-2">
				<legend className="sr-only">Select image</legend>
				<button
					type="button"
					className="rounded-full border border-border bg-surface px-4 py-2 text-sm"
					onClick={() => setSelectedIndex(0)}
				>
					Portrait
				</button>
				<button
					type="button"
					className="rounded-full border border-border bg-surface px-4 py-2 text-sm"
					onClick={() => setSelectedIndex(1)}
				>
					Square
				</button>
			</fieldset>
			<ImageSwitcher
				images={images}
				intervalMs={0}
				selectedIndex={selectedIndex}
				showControls={false}
				onIndexChange={onIndexChange}
				frameClassName="h-80"
			/>
			<p className="text-sm text-muted-foreground">
				Selection is owned by the parent; rapid changes remain interrupt-safe.
			</p>
		</div>
	);
}

export const ControlledRapidSelection: Story = {
	render: (args) => (
		<ControlledImageSwitcher onIndexChange={args.onIndexChange} />
	),
	play: async ({ args, canvas, canvasElement }) => {
		const portrait = canvas.getByRole("button", { name: "Portrait" });
		const square = canvas.getByRole("button", { name: "Square" });
		const switcher = canvasElement.querySelector(
			"[data-image-switcher-active-index]",
		);
		if (!(switcher instanceof HTMLElement)) {
			throw new Error("ImageSwitcher story root was not rendered.");
		}

		fireEvent.click(square);
		fireEvent.click(portrait);
		fireEvent.click(square);

		await waitFor(() =>
			expect(switcher).toHaveAttribute("data-image-switcher-active-index", "1"),
		);
		await expect(args.onIndexChange).not.toHaveBeenCalled();
		await expect(
			canvas.queryByRole("button", { name: "Next image" }),
		).not.toBeInTheDocument();
	},
};
