import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fireEvent, fn, userEvent, waitFor } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { ScrollArea } from "./ScrollArea";
import { catalogContract } from "./ScrollArea.catalog";

const meta = {
	id: "ui-misc-scroll-area",
	title: "UI/Misc/ScrollArea",
	component: ScrollArea,
	excludeStories: ["catalogContract"],
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		a11y: { test: "error" },
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
} satisfies Meta;
export default meta;
type Story = StoryObj;

const rows = (count: number) =>
	Array.from({ length: count }, (_, index) => `Result ${index + 1}`);

function scrollTo(region: HTMLElement, top: number) {
	region.scrollTop = top;
	fireEvent.scroll(region);
}

const mask = (region: HTMLElement) => getComputedStyle(region).maskImage;

const onScroll = fn();
export const FadeEdges: Story = {
	render: () => (
		<div className="w-72 overflow-hidden rounded-xl border border-border bg-card">
			<ScrollArea
				className="h-40"
				data-testid="scroll-region"
				edge={12}
				onScroll={onScroll}
				tabIndex={0}
			>
				{rows(12).map((row) => (
					<div className="px-3 py-2 text-sm" key={row}>
						{row}
					</div>
				))}
			</ScrollArea>
		</div>
	),
	play: async ({ canvas }) => {
		const region = canvas.getByTestId("scroll-region");
		await expect(getComputedStyle(region).paddingTop).toBe("12px");
		await expect(getComputedStyle(region).paddingBottom).toBe("12px");
		await expect(getComputedStyle(region).overscrollBehaviorY).toBe("contain");
		await expect(region.scrollHeight).toBeGreaterThan(region.clientHeight);

		// At rest only the end fades: content at rest is never faded.
		await waitFor(() =>
			expect(region).toHaveAttribute("data-scroll-edge-end", "true"),
		);
		await expect(region).not.toHaveAttribute("data-scroll-edge-start");
		await expect(mask(region)).toContain("linear-gradient");
		await expect(mask(region)).toMatch(/0px/);

		scrollTo(region, 40);
		await expect(onScroll).toHaveBeenCalled();
		await waitFor(() =>
			expect(region).toHaveAttribute("data-scroll-edge-start", "true"),
		);
		await expect(region).toHaveAttribute("data-scroll-edge-end", "true");

		scrollTo(region, region.scrollHeight);
		await waitFor(() =>
			expect(region).not.toHaveAttribute("data-scroll-edge-end"),
		);
		await expect(region).toHaveAttribute("data-scroll-edge-start", "true");
	},
};

function GrowingList() {
	const [count, setCount] = useState(1);
	return (
		<div className="grid gap-3">
			<button
				className="w-fit rounded-md border border-border px-3 py-1 text-sm"
				onClick={() => setCount((value) => value + 10)}
				type="button"
			>
				Add rows
			</button>
			<div
				className="flex max-h-48 w-72 flex-col overflow-hidden rounded-xl border border-border bg-card"
				data-testid="surface"
			>
				<ScrollArea data-testid="scroll-region" edge={8} tabIndex={0}>
					{rows(count).map((row) => (
						<div className="px-3 py-2 text-sm" key={row}>
							{row}
						</div>
					))}
				</ScrollArea>
			</div>
		</div>
	);
}

export const EdgeToEdgeAtEveryHeight: Story = {
	render: () => <GrowingList />,
	play: async ({ canvas }) => {
		const surface = canvas.getByTestId("surface");
		const region = canvas.getByTestId("scroll-region");
		const expectEdgeToEdge = () => {
			const outer = surface.getBoundingClientRect();
			const inner = region.getBoundingClientRect();
			// The surface stroke is the edge: nothing sits between it and the
			// scroller on any side.
			expect(inner.top - outer.top).toBeCloseTo(1, 0);
			expect(outer.bottom - inner.bottom).toBeCloseTo(1, 0);
			expect(inner.left - outer.left).toBeCloseTo(1, 0);
		};

		// One item: no overflow, no mask, the padding is the gap.
		expectEdgeToEdge();
		await expect(region.scrollHeight).toBeLessThanOrEqual(region.clientHeight);
		await expect(mask(region)).toBe("none");
		const firstRow = canvas.getByText("Result 1");
		const restingTop = firstRow.getBoundingClientRect().top;

		// Max height: the scroller fills the capped surface and still runs to
		// its edge; the first row stays where it rested.
		await userEvent.click(canvas.getByRole("button", { name: "Add rows" }));
		await waitFor(() =>
			expect(region.scrollHeight).toBeGreaterThan(region.clientHeight),
		);
		expectEdgeToEdge();
		await expect(firstRow.getBoundingClientRect().top).toBeCloseTo(
			restingTop,
			0,
		);
		await waitFor(() =>
			expect(region).toHaveAttribute("data-scroll-edge-end", "true"),
		);
	},
};

export const BorderWithoutLayoutShift: Story = {
	render: () => (
		<ScrollArea
			className="h-40 w-72"
			data-testid="scroll-region"
			edge={0}
			edgeStyle="border"
			showBackToTop
			tabIndex={0}
		>
			{rows(12).map((row) => (
				<div className="border-b border-border p-3 text-sm" key={row}>
					{row}
				</div>
			))}
		</ScrollArea>
	),
	play: async ({ canvas, canvasElement }) => {
		const region = canvas.getByTestId("scroll-region");
		const frame = region.parentElement as HTMLElement;
		const measure = () => ({
			client: region.clientHeight,
			frame: frame.getBoundingClientRect().height,
			rect: region.getBoundingClientRect().toJSON(),
			rowLeft: canvas.getByText("Result 1").getBoundingClientRect().left,
		});
		await waitFor(() =>
			expect(
				canvasElement.querySelector('[data-scroll-rule="end"]'),
			).not.toBeNull(),
		);
		const atRest = measure();
		await expect(
			canvasElement.querySelector('[data-scroll-rule="start"]'),
		).toBeNull();

		scrollTo(region, 40);
		await waitFor(() =>
			expect(
				canvasElement.querySelector('[data-scroll-rule="start"]'),
			).not.toBeNull(),
		);
		// The rules are overlays: the scroller box and its content box never move.
		await expect(measure()).toEqual(atRest);
		await expect(getComputedStyle(region).borderTopWidth).toBe("0px");

		scrollTo(region, region.scrollHeight);
		await waitFor(() =>
			expect(
				canvasElement.querySelector('[data-scroll-rule="end"]'),
			).toBeNull(),
		);
		await expect(measure()).toEqual(atRest);

		await userEvent.hover(region);
		const backToTop = await canvas.findByRole("button", {
			name: "Back to top",
		});
		await userEvent.click(backToTop);
		await waitFor(() => expect(region.scrollTop).toBe(0));
	},
};

function HorizontalRegion({ direction }: { direction: "ltr" | "rtl" }) {
	return (
		<div className="grid gap-2">
			<p className="text-sm font-medium">
				{direction === "ltr" ? "Left to right" : "Right to left"}
			</p>
			<div className="w-80 overflow-hidden rounded-xl border border-border bg-card">
				<ScrollArea
					axis="x"
					data-testid={`horizontal-${direction}`}
					dir={direction}
					edge={12}
					scrollbar="hidden"
					tabIndex={0}
				>
					<div className="flex w-max gap-3 py-3">
						{rows(8).map((column) => (
							<div
								className="grid h-28 w-36 shrink-0 place-items-center rounded-lg border border-border bg-surface text-sm"
								key={column}
							>
								{column}
							</div>
						))}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
}

export const HorizontalRtlEdges: Story = {
	render: () => (
		<div className="grid max-w-3xl gap-8 md:grid-cols-2">
			<HorizontalRegion direction="ltr" />
			<HorizontalRegion direction="rtl" />
		</div>
	),
	play: async ({ canvas }) => {
		for (const direction of ["ltr", "rtl"] as const) {
			const region = canvas.getByTestId(`horizontal-${direction}`);
			await expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
			await expect(getComputedStyle(region).scrollbarWidth).toBe("none");
			await expect(getComputedStyle(region).overscrollBehaviorX).toBe(
				"contain",
			);
			// Logical edges: at rest the inline end is hidden in both directions.
			await waitFor(() =>
				expect(region).toHaveAttribute("data-scroll-edge-end", "true"),
			);
			await expect(region).not.toHaveAttribute("data-scroll-edge-start");
			await expect(mask(region)).toContain(
				direction === "rtl" ? "to left" : "to right",
			);
		}
	},
};
