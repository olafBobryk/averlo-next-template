import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, waitFor } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Icon } from "../icons/Icon";
import { Button } from "../primitives/Button";
import { IconSwap } from "./IconSwap";
import { catalogContract, KeyedIconSwapHarness } from "./IconSwap.catalog";

function IconSwapHarness() {
	const [activeIndex, setActiveIndex] = useState(0);
	return (
		<Button
			aria-label={activeIndex === 0 ? "Show password" : "Hide password"}
			onClick={() => setActiveIndex((current) => (current === 0 ? 1 : 0))}
			variant="secondary"
		>
			<span data-testid="swap">
				<IconSwap
					activeIndex={activeIndex}
					items={[
						{ icon: <Icon name="eye" /> },
						{ icon: <Icon name="eye-closed" /> },
					]}
				/>
			</span>
			Password
		</Button>
	);
}

const meta = {
	id: "ui-helpers-icon-swap",
	excludeStories: ["catalogContract"],
	title: "UI/Helpers/IconSwap",
	component: IconSwap,
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		a11y: { test: "error" },
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
} satisfies Meta<typeof IconSwap>;

export default meta;
type Story = StoryObj;

export const StatefulTransition: Story = {
	render: () => <IconSwapHarness />,
	play: async ({ canvas }) => {
		const button = canvas.getByRole("button", { name: "Show password" });
		const states = canvas
			.getByTestId("swap")
			.querySelectorAll(":scope > span > span");
		await expect(states[0]).toHaveClass("opacity-100");
		await userEvent.click(button);
		await expect(
			canvas.getByRole("button", { name: "Hide password" }),
		).toBeInTheDocument();
		await expect(states[1]).toHaveClass("opacity-100");
	},
};

export const SizeScale: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			{(["sm", "md", "lg"] as const).map((size) => (
				<div className="grid gap-1" key={size}>
					<span className="text-xs">{size}</span>
					<IconSwap
						activeIndex={0}
						items={[{ icon: <Icon name="check" /> }]}
						size={size}
					/>
				</div>
			))}
		</div>
	),
};

function swapLayers(root: HTMLElement) {
	return Array.from(
		root.querySelectorAll<HTMLElement>('[data-slot="icon-swap"] > span'),
	);
}

export const KeyedSwap: Story = {
	render: () => <KeyedIconSwapHarness />,
	play: async ({ canvas }) => {
		const root = canvas.getByTestId("keyed-swap");
		await expect(swapLayers(root)).toHaveLength(1);
		// Story setup switches the appearance atomically; let it settle.
		await waitFor(() =>
			expect(document.documentElement).not.toHaveAttribute(
				"data-theme-switching",
			),
		);
		await userEvent.click(canvas.getByRole("button", { name: "Copy" }));
		const [previous, next] = swapLayers(root);
		await expect(next).toHaveAttribute("data-state", "active");
		await expect(previous).toHaveAttribute("data-state", "inactive");
		await expect(previous).toHaveAttribute("aria-hidden", "true");
		// The swap animates rather than jumping.
		await expect(
			Number.parseFloat(getComputedStyle(next).transitionDuration),
		).toBeGreaterThan(0);
		await waitFor(() => expect(getComputedStyle(previous).opacity).toBe("0"));
		await waitFor(() => expect(getComputedStyle(next).opacity).toBe("1"));
		// Swapping back reuses the mounted icon instead of stacking a third.
		await userEvent.click(canvas.getByRole("button", { name: "Copied" }));
		await expect(swapLayers(root)).toHaveLength(2);
		await expect(previous).toHaveAttribute("data-state", "active");
	},
};

export const ReducedMotion: Story = {
	render: () => <KeyedIconSwapHarness />,
	beforeEach: () => {
		const native = window.matchMedia;
		window.matchMedia = (query) => {
			const media = native.call(window, query);
			if (query === "(prefers-reduced-motion: reduce)")
				Object.defineProperty(media, "matches", { value: true });
			return media;
		};
		return () => {
			window.matchMedia = native;
		};
	},
	play: async ({ canvas }) => {
		const root = canvas.getByTestId("keyed-swap");
		await userEvent.click(canvas.getByRole("button", { name: "Copy" }));
		const [previous, next] = swapLayers(root);
		await expect(
			Number.parseFloat(getComputedStyle(next).transitionDuration),
		).toBe(0);
		await expect(getComputedStyle(next).opacity).toBe("1");
		await expect(getComputedStyle(previous).opacity).toBe("0");
	},
};
