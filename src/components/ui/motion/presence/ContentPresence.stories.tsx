import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useRef, useState } from "react";
import { expect, userEvent, waitFor } from "storybook/test";
import { useSettingsContext } from "@/components/ui/foundations/settingsContext";
import { Accordion } from "@/components/ui/misc/accordion/Accordion";
import { Button } from "@/components/ui/primitives/Button";
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
		// The content stays opaque while the shared soft edge conceals it.
		await expect(canvas.getByText("Additional options")).toBeInTheDocument();
		await expect(getComputedStyle(region).maskImage).toContain("16px");
		await expect(getComputedStyle(region).maskImage).toContain(
			"rgba(0, 0, 0, 0)",
		);
		await expect(
			getComputedStyle(region.firstElementChild as HTMLElement).opacity,
		).toBe("1");
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
	play: async ({ canvas, canvasElement }) => {
		const region = canvasElement.querySelector(
			'[data-slot="content-presence"]',
		) as HTMLElement;
		await userEvent.click(
			canvas.getByRole("button", { name: "Toggle content" }),
		);
		await expect(
			canvas.queryByText("Additional options"),
		).not.toBeInTheDocument();
		await expect(getComputedStyle(region).maskImage).toBe("none");
		await userEvent.click(
			canvas.getByRole("button", { name: "Toggle content" }),
		);
		await expect(
			canvas.getByRole("button", { name: "Apply option" }),
		).toBeVisible();
		await expect(getComputedStyle(region).maskImage).toBe("none");
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

export const SlowerReveal: Story = {
	render: () => <PresenceExample durationMs={360} />,
	play: Vertical.play,
};

export const MaskFollowsHeightProgress: Story = {
	render: () => <PresenceExample durationMs={360} />,
	play: async ({ canvas, canvasElement }) => {
		const region = canvasElement.querySelector(
			'[data-slot="content-presence"]',
		) as HTMLElement;
		const toggle = canvas.getByRole("button", { name: "Toggle content" });
		await waitFor(() =>
			expect(getComputedStyle(region).overflow).toBe("visible"),
		);
		await userEvent.click(toggle);
		await waitFor(() => expect(region.firstElementChild).toBeNull());
		const samples: { remaining: number; progress: number; mask: string }[] = [];
		let frame = 0;
		const sample = () => {
			if (region.firstElementChild)
				samples.push({
					progress:
						region.getBoundingClientRect().height /
						region.firstElementChild.getBoundingClientRect().height,
					remaining:
						region.firstElementChild.getBoundingClientRect().height -
						region.getBoundingClientRect().height,
					mask: getComputedStyle(region).maskImage,
				});
			frame = requestAnimationFrame(sample);
		};
		frame = requestAnimationFrame(sample);
		try {
			await userEvent.click(toggle);
			await waitFor(() =>
				expect(getComputedStyle(region).overflow).toBe("visible"),
			);
		} finally {
			cancelAnimationFrame(frame);
		}
		const finalTravel = samples.filter(
			({ progress }) => progress > 0.8 && progress < 0.98,
		);
		expect(finalTravel.length).toBeGreaterThan(0);
		for (const { mask } of finalTravel)
			expect(mask).toContain("rgba(0, 0, 0, 0)");
		expect(
			samples.some(
				({ remaining, progress, mask }) =>
					remaining > 0 &&
					progress > 0.98 &&
					mask.includes("linear-gradient") &&
					!mask.includes("rgba(0, 0, 0, 0)"),
			),
		).toBe(true);
		expect(getComputedStyle(region).maskImage).toBe("none");
	},
};

function AccordionParityExample() {
	const [open, setOpen] = useState(false);
	return (
		<div className="grid max-w-lg gap-6">
			<button type="button" onClick={() => setOpen(!open)}>
				Toggle both reveals
			</button>
			<div>
				<p>Height reveal</p>
				<ContentPresence open={open}>
					<div className="h-40 rounded-lg bg-muted p-4">
						Continuous content reveal
					</div>
				</ContentPresence>
			</div>
			<Accordion title="Accordion" open={open} onOpenChange={setOpen}>
				<div className="h-40 rounded-lg bg-muted p-4">
					Continuous accordion reveal
				</div>
			</Accordion>
		</div>
	);
}
export const AccordionParity: Story = {
	render: () => <AccordionParityExample />,
	play: async ({ canvas, canvasElement }) => {
		const region = canvasElement.querySelector(
			'[data-slot="content-presence"]',
		) as HTMLElement;
		await userEvent.click(
			canvas.getByRole("button", { name: "Toggle both reveals" }),
		);
		await waitFor(() =>
			expect(getComputedStyle(region).overflow).toBe("visible"),
		);
		await expect(getComputedStyle(region).maskImage).toBe("none");
		await expect(canvas.getByText("Continuous accordion reveal")).toBeVisible();
		await userEvent.click(
			canvas.getByRole("button", { name: "Toggle both reveals" }),
		);
		await expect(region).toHaveAttribute("inert");
		await expect(getComputedStyle(region).maskImage).toContain("16px");
		await expect(getComputedStyle(region).maskImage).toContain(
			"rgba(0, 0, 0, 0)",
		);
		await expect(
			canvas.getByText("Continuous content reveal"),
		).toBeInTheDocument();
		await expect(
			canvas.getByText("Continuous accordion reveal"),
		).toBeInTheDocument();
		await waitFor(() =>
			expect(
				canvas.queryByText("Continuous content reveal"),
			).not.toBeInTheDocument(),
		);
		await waitFor(() =>
			expect(
				canvas.queryByText("Continuous accordion reveal"),
			).not.toBeInTheDocument(),
		);
	},
};

function ResizeExample() {
	const [compact, setCompact] = useState(false);
	const [open, setOpen] = useState(true);
	return (
		<div className="grid max-w-full gap-3">
			<div className="flex gap-3">
				<Button onClick={() => setCompact(!compact)}>Resize region</Button>
				<Button onClick={() => setOpen(!open)}>Toggle region</Button>
			</div>
			<div
				data-testid="resizing-region"
				style={{ width: compact ? 280 : 680, maxWidth: "100%" }}
			>
				<ContentPresence open={open}>
					<p>
						Useful conditional content wraps within its actual available space
						during a responsive layout change. The real action remains operable
						after interruption and settling.
					</p>
					<Button>Apply responsive option</Button>
				</ContentPresence>
			</div>
		</div>
	);
}
export const ResizeDuringInterruption: Story = {
	render: () => <ResizeExample />,
	play: async ({ canvas }) => {
		const region = canvas.getByTestId("resizing-region");
		const presence = region.querySelector<HTMLElement>(
			'[data-slot="content-presence"]',
		)!;
		await userEvent.click(
			canvas.getByRole("button", { name: "Toggle region" }),
		);
		await userEvent.click(
			canvas.getByRole("button", { name: "Resize region" }),
		);
		await userEvent.click(
			canvas.getByRole("button", { name: "Toggle region" }),
		);
		await waitFor(() =>
			expect(getComputedStyle(presence).overflow).toBe("visible"),
		);
		const action = canvas.getByRole("button", {
			name: "Apply responsive option",
		});
		await expect(action).toBeVisible();
		action.focus();
		await expect(action).toHaveFocus();
		await expect(presence).not.toHaveAttribute("inert");
		await expect(presence.getBoundingClientRect().width).toBeLessThanOrEqual(
			280,
		);
		await userEvent.keyboard("{Enter}");
	},
};
