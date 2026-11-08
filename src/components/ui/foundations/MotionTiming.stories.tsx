import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { catalogContract, MotionStepTable } from "./MotionTiming.catalog";
import { spring } from "./spring";

const meta = {
	id: "ui-foundations-motion-timing",
	excludeStories: ["catalogContract"],
	title: "UI/Foundations/Motion Timing and Spring",
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

export const StepScale: Story = {
	render: () => <MotionStepTable />,
	play: async ({ canvas }) => {
		const rows = canvas
			.getByTestId("step-table")
			.querySelectorAll<HTMLElement>("tbody tr");
		await expect(rows).toHaveLength(5);
		const durations = [...rows].map((row) =>
			Number(row.querySelector('[data-cell="duration"]')?.textContent),
		);
		await expect(durations).toEqual([...durations].sort((a, b) => a - b));
		const root = getComputedStyle(document.documentElement);
		await expect(root.getPropertyValue("--motion-gentle-duration").trim()).toBe(
			"360ms",
		);
	},
};

export const StepSprings: Story = {
	render: () => (
		<dl className="grid grid-cols-2 gap-2">
			<dt>Quick type</dt>
			<dd data-testid="spring-type">{String(spring.quick.type)}</dd>
			<dt>Gentle stiffness</dt>
			<dd data-testid="spring-stiffness">{String(spring.gentle.stiffness)}</dd>
		</dl>
	),
	play: async ({ canvas }) => {
		await expect(canvas.getByTestId("spring-type")).toHaveTextContent("spring");
		await expect(
			Number(canvas.getByTestId("spring-stiffness").textContent),
		).toBeLessThan(Number(spring.smooth.stiffness));
	},
};
