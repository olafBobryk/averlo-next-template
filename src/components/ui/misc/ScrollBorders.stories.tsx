import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fireEvent, fn } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { ScrollBorders } from "./ScrollBorders";
import { catalogContract } from "./ScrollBorders.catalog";

const meta = {
	id: "ui-misc-scroll-borders",
	title: "UI/Misc/ScrollBorders",
	component: ScrollBorders,
	excludeStories: ["catalogContract"],
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		a11y: { test: "error" },
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
} satisfies Meta<typeof ScrollBorders>;
export default meta;
type Story = StoryObj<typeof meta>;
const rows = Array.from({ length: 12 }, (_, index) => `Result ${index + 1}`);
const columns = Array.from({ length: 8 }, (_, index) => `Item ${index + 1}`);
export const OverflowContract: Story = {
	args: { onScroll: fn() },
	render: (args) => (
		<ScrollBorders
			{...args}
			data-testid="scroll-region"
			tabIndex={0}
			className="h-40 w-72 overflow-y-auto"
		>
			{rows.map((row) => (
				<div className="border-b border-border p-3" key={row}>
					{row}
				</div>
			))}
		</ScrollBorders>
	),
	play: async ({ args, canvas }) => {
		const region = canvas.getByTestId("scroll-region");
		await expect(region.scrollHeight).toBeGreaterThan(region.clientHeight);
		region.scrollTop = 40;
		fireEvent.scroll(region);
		await expect(args.onScroll).toHaveBeenCalledOnce();
		await expect(region).toHaveClass("border-t!");
	},
};
export const SkeletonContract: Story = {
	render: () => (
		<ScrollBorders.Skeleton className="h-40 w-72">
			<div className="h-80 bg-muted/40" />
		</ScrollBorders.Skeleton>
	),
	play: async ({ canvasElement }) => {
		await expect(
			canvasElement.querySelector(".overflow-hidden"),
		).toBeInTheDocument();
	},
};

function HorizontalRegion({ direction }: { direction: "ltr" | "rtl" }) {
	return (
		<div className="grid gap-2">
			<p className="text-sm font-medium">
				{direction === "ltr" ? "Left to right" : "Right to left"}
			</p>
			<ScrollBorders
				axis="horizontal"
				dir={direction}
				data-testid={`horizontal-${direction}`}
				className="w-80 overflow-x-auto"
				showBackToTop={false}
				tabIndex={0}
			>
				<div className="flex w-max gap-3 p-3">
					{columns.map((column) => (
						<div
							className="grid h-28 w-36 shrink-0 place-items-center rounded-lg border border-border bg-surface text-sm"
							key={column}
						>
							{column}
						</div>
					))}
				</div>
			</ScrollBorders>
		</div>
	);
}

function NoOverflowRegion() {
	return (
		<div className="grid gap-2 md:col-span-2">
			<p className="text-sm font-medium">Fits without overflow</p>
			<ScrollBorders
				axis="horizontal"
				data-testid="horizontal-no-overflow"
				className="w-80 overflow-x-auto"
				showBackToTop={false}
				tabIndex={0}
			>
				<div className="p-3 text-sm">
					All content fits inside the scroll port.
				</div>
			</ScrollBorders>
		</div>
	);
}

export const HorizontalRtlOverflow: Story = {
	render: () => (
		<div className="grid max-w-3xl gap-8 md:grid-cols-2">
			<HorizontalRegion direction="ltr" />
			<HorizontalRegion direction="rtl" />
			<NoOverflowRegion />
		</div>
	),
	play: async ({ canvas }) => {
		const ltrRegion = canvas.getByTestId("horizontal-ltr");
		const rtlRegion = canvas.getByTestId("horizontal-rtl");
		const noOverflowRegion = canvas.getByTestId("horizontal-no-overflow");

		await expect(ltrRegion.scrollWidth).toBeGreaterThan(ltrRegion.clientWidth);
		await expect(rtlRegion.scrollWidth).toBeGreaterThan(rtlRegion.clientWidth);
		await expect(noOverflowRegion.scrollWidth).toBeLessThanOrEqual(
			noOverflowRegion.clientWidth,
		);

		fireEvent.scroll(ltrRegion);
		fireEvent.scroll(rtlRegion);
		fireEvent.scroll(noOverflowRegion);

		await expect(ltrRegion).not.toHaveAttribute("data-scroll-border-start");
		await expect(ltrRegion).toHaveAttribute("data-scroll-border-end", "true");
		await expect(rtlRegion).toHaveAttribute("data-scroll-border-start", "true");
		await expect(rtlRegion).not.toHaveAttribute("data-scroll-border-end");
		await expect(noOverflowRegion).not.toHaveAttribute(
			"data-scroll-border-start",
		);
		await expect(noOverflowRegion).not.toHaveAttribute(
			"data-scroll-border-end",
		);
	},
};
