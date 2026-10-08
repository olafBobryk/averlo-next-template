import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useRef } from "react";
import { expect, userEvent, waitFor } from "storybook/test";
import { useSettingsContext } from "@/components/ui/foundations/settingsContext";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { catalogContract, PresenceExample } from "./ContentPresence.catalog";
import { ContentPresence } from "./index";

const meta = {
	id: "ui-motion-content-presence",
	title: "UI/Motion/ContentPresence",
	component: ContentPresence,
	tags: ["autodocs"],
	args: { open: true, children: "Conditional content" },
	parameters: {
		catalogContract,
		layout: "padded",
		a11y: { test: "error" },
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
} satisfies Meta<typeof ContentPresence>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
	render: () => <PresenceExample />,
	play: async ({ canvas, canvasElement }) => {
		const region = canvasElement.querySelector(
			'[data-slot="content-presence"]',
		) as HTMLElement;
		await waitFor(() =>
			expect(getComputedStyle(region).overflow).toBe("visible"),
		);
		const height = region.getBoundingClientRect().height;
		await userEvent.click(
			canvas.getByRole("button", { name: "Change content" }),
		);
		await waitFor(() =>
			expect(region.getBoundingClientRect().height).toBeGreaterThan(height),
		);
		await userEvent.click(
			canvas.getByRole("button", { name: "Toggle content" }),
		);
		await expect(region).toHaveAttribute("inert");
		await expect(region).toHaveAttribute("aria-hidden", "true");
		await waitFor(() =>
			expect(canvas.queryByText("Additional options")).not.toBeInTheDocument(),
		);
		await waitFor(() => expect(region.getBoundingClientRect().height).toBe(0));
		await waitFor(() => expect(getComputedStyle(region).marginTop).toBe("0px"));
		await userEvent.click(
			canvas.getByRole("button", { name: "Toggle content" }),
		);
		await waitFor(() =>
			expect(
				canvas.getByRole("button", { name: "Apply option" }),
			).toBeVisible(),
		);
		await waitFor(() =>
			expect(getComputedStyle(region).overflow).toBe("visible"),
		);
	},
};
export const Horizontal: Story = {
	render: () => <PresenceExample axis="x" />,
	play: async ({ canvas, canvasElement }) => {
		const region = canvasElement.querySelector(
			'[data-slot="content-presence"]',
		) as HTMLElement;
		await waitFor(() =>
			expect(region.getBoundingClientRect().width).toBeGreaterThan(0),
		);
		await userEvent.click(
			canvas.getByRole("button", { name: "Toggle content" }),
		);
		await waitFor(() => expect(region.getBoundingClientRect().width).toBe(0));
		await userEvent.click(
			canvas.getByRole("button", { name: "Toggle content" }),
		);
		await waitFor(() =>
			expect(
				canvas.getByRole("button", { name: "Apply option" }),
			).toBeVisible(),
		);
	},
};
export const Interruption: Story = {
	render: () => <PresenceExample />,
	play: async ({ canvas, canvasElement }) => {
		const toggle = canvas.getByRole("button", { name: "Toggle content" });
		await userEvent.click(toggle);
		await userEvent.click(toggle);
		await userEvent.click(toggle);
		await userEvent.click(toggle);
		const region = canvasElement.querySelector(
			'[data-slot="content-presence"]',
		) as HTMLElement;
		await waitFor(() =>
			expect(
				canvas.getByRole("button", { name: "Apply option" }),
			).toBeVisible(),
		);
		await waitFor(() =>
			expect(getComputedStyle(region).overflow).toBe("visible"),
		);
		await expect(region).not.toHaveAttribute("inert");
	},
};
function MotionOffExample() {
	const settings = useSettingsContext();
	const original = useRef(settings?.motionDisabled ?? false);
	useEffect(() => {
		settings?.setMotionDisabled(true);
		return () => settings?.setMotionDisabled(original.current);
	}, [settings?.setMotionDisabled]);
	return <PresenceExample />;
}
export const MotionOff: Story = {
	render: () => <MotionOffExample />,
	play: async ({ canvas }) => {
		await userEvent.click(
			canvas.getByRole("button", { name: "Toggle content" }),
		);
		await expect(
			canvas.queryByText("Additional options"),
		).not.toBeInTheDocument();
		await userEvent.click(
			canvas.getByRole("button", { name: "Toggle content" }),
		);
		await expect(
			canvas.getByRole("button", { name: "Apply option" }),
		).toBeVisible();
	},
};

export const ReducedMotion: Story = {
	...MotionOff,
	render: () => <PresenceExample />,
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
};
