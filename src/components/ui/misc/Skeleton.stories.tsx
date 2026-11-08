import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Skeleton } from "./Skeleton";
import { catalogContract } from "./Skeleton.catalog";

const meta = {
	id: "ui-misc-skeleton",
	title: "UI/Misc/Skeleton",
	component: Skeleton,
	excludeStories: ["catalogContract"],
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		a11y: { test: "error" },
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const NonInteractiveContract: Story = {
	render: () => (
		<Skeleton data-testid="placeholder" className="w-64 p-3">
			Final content width
		</Skeleton>
	),
	play: async ({ canvas }) => {
		const placeholder = canvas.getByTestId("placeholder");
		await expect(placeholder).toHaveAttribute("aria-hidden", "true");
		await expect(placeholder.querySelector("span")).toHaveClass(
			"pointer-events-none",
		);
	},
};
export const RadiusScale: Story = {
	render: () => (
		<div className="flex gap-3">
			{(["none", "sm", "md", "lg", "xl", "2xl", "full"] as const).map(
				(radius) => (
					<Skeleton
						key={radius}
						radius={radius}
						className="size-14"
						data-testid={`radius-${radius}`}
					/>
				),
			)}
		</div>
	),
	play: async ({ canvas }) => {
		await expect(canvas.getByTestId("radius-full")).toHaveClass("rounded-full");
		await expect(canvas.getByTestId("radius-none")).toHaveClass("rounded-none");
	},
};
export const ShimmerBlock: Story = {
	render: () => (
		<Skeleton radius="lg" className="h-44 w-80" data-testid="shimmer-block" />
	),
	play: async ({ canvas }) => {
		const block = canvas.getByTestId("shimmer-block");
		await expect(block).toHaveAttribute("data-skeleton-variant", "shimmer");
		await expect(block.children).toHaveLength(0);
		// Every shimmer paints the same viewport-anchored band (one page-wide
		// sweep) and nothing animates on the root.
		const root = document.documentElement;
		const after = getComputedStyle(block, "::after");
		await expect(getComputedStyle(root).animationName).toBe("none");
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
			await expect(after.animationName).toBe("none");
			await expect(after.display).toBe("none");
		} else {
			await expect(after.animationName).not.toBe("none");
			await expect(after.display).not.toBe("none");
			await expect(after.backgroundAttachment).toBe("fixed");
		}
		// `?motion=off` stops the sweep and shows the static fill.
		const previousOverride = root.dataset.motionOverride;
		root.dataset.motionOverride = "off";
		try {
			const stopped = getComputedStyle(block, "::after");
			await expect(stopped.animationName).toBe("none");
			await expect(stopped.display).toBe("none");
		} finally {
			if (previousOverride === undefined) delete root.dataset.motionOverride;
			else root.dataset.motionOverride = previousOverride;
		}
	},
};
export const StaticOptOut: Story = {
	render: () => (
		<Skeleton
			animation="static"
			radius="lg"
			className="h-44 w-80"
			data-testid="static-block"
		/>
	),
	play: async ({ canvas }) => {
		const block = canvas.getByTestId("static-block");
		await expect(block).toHaveAttribute("data-skeleton-variant", "static");
		await expect(getComputedStyle(block, "::after").content).toBe("none");
	},
};
