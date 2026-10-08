import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import clsx from "clsx";
import { expect, userEvent } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import {
	InputFrame,
	inputFrameChromeClassName,
	inputVariants,
} from "./InputFrame";
import { catalogContract } from "./InputFrame.catalog";

const meta = {
	id: "ui-primitives-input-frame",
	excludeStories: ["catalogContract"],
	title: "UI/Primitives/InputFrame",
	component: InputFrame,
	subcomponents: { "InputFrame.Skeleton": InputFrame.Skeleton },
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		layout: "padded",
		a11y: { test: "error" },
		docs: {
			description: {
				component: formatCatalogOwnerContract(catalogContract),
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const SizesAndAdornments: Story = {
	render: () => (
		<div className="grid gap-4">
			<InputFrame
				start={<span aria-hidden>€</span>}
				end={<span>EUR</span>}
				fullWidth
				size="sm"
			>
				<input
					aria-label="Small amount"
					className={inputVariants({
						size: "sm",
						hasStart: true,
						hasEnd: true,
					})}
				/>
			</InputFrame>
			<InputFrame fullWidth size="md">
				<input
					aria-label="Medium input"
					className={inputVariants({ size: "md" })}
				/>
			</InputFrame>
			<InputFrame fullWidth size="lg">
				<input
					aria-label="Large input"
					className={inputVariants({ size: "lg" })}
				/>
			</InputFrame>
		</div>
	),
};

export const FocusAndErrorState: Story = {
	render: () => (
		<InputFrame data-testid="error-frame" fullWidth tone="error">
			<input
				aria-label="Invalid value"
				aria-invalid="true"
				className={inputVariants()}
			/>
		</InputFrame>
	),
	play: async ({ canvas }) => {
		const input = canvas.getByRole("textbox", { name: "Invalid value" });
		await userEvent.click(input);
		await expect(input).toHaveFocus();
		await expect(canvas.getByTestId("error-frame")).toHaveAttribute(
			"aria-invalid",
			"true",
		);
	},
};

export const DisabledAndSkeletonParity: Story = {
	render: () => (
		<div className="grid gap-4">
			<InputFrame disabled fullWidth>
				<input
					aria-label="Disabled value"
					className={inputVariants({ disabled: true })}
					disabled
					defaultValue="Unavailable"
				/>
			</InputFrame>
			<InputFrame.Skeleton fullWidth>Loading value</InputFrame.Skeleton>
		</div>
	),
	play: async ({ canvasElement }) => {
		const live = canvasElement.querySelector('[data-slot="input-frame"]')!;
		const skeleton = canvasElement.querySelector(
			'[data-slot="input-frame-skeleton"]',
		)!;
		await expect(live.getBoundingClientRect().height).toBe(34);
		await expect(skeleton.getBoundingClientRect().height).toBe(
			live.getBoundingClientRect().height,
		);
		await expect(getComputedStyle(live).borderRadius).toBe("9px");
		await expect(getComputedStyle(skeleton).borderRadius).toBe(
			getComputedStyle(live).borderRadius,
		);
	},
};

export const StaticChromeReuse: Story = {
	render: () => (
		<div
			className={clsx(inputFrameChromeClassName, "min-h-9 px-3 py-2")}
			data-testid="static-framed-content"
		>
			Non-interactive content
		</div>
	),
	play: async ({ canvas }) => {
		const surface = canvas.getByTestId("static-framed-content");
		await expect(surface).toBeVisible();
		await expect(surface).not.toHaveAttribute("aria-invalid");
		await expect(canvas.queryByRole("textbox")).toBeNull();
	},
};

export const ComposerChromeParity: Story = {
	render: () => (
		<div className="grid max-w-lg gap-6">
			<InputFrame fullWidth data-testid="standard-frame">
				<input
					aria-label="Standard input"
					className={inputVariants()}
					placeholder="Standard input"
				/>
			</InputFrame>
			<InputFrame
				fullWidth
				presentation="composer"
				className="h-auto"
				data-testid="composer-frame"
			>
				<textarea
					aria-label="Composer input"
					className="w-full resize-none bg-transparent p-4 outline-none"
					placeholder="Composer input"
					rows={3}
				/>
			</InputFrame>
		</div>
	),
	play: async ({ canvas }) => {
		const standard = getComputedStyle(canvas.getByTestId("standard-frame"));
		const composer = getComputedStyle(canvas.getByTestId("composer-frame"));
		await expect(composer.backgroundColor).toBe(standard.backgroundColor);
		await expect(composer.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
		await expect(composer.boxShadow).toBe(standard.boxShadow);
		await expect(standard.borderRadius).toBe("9px");
		await expect(composer.borderRadius).toBe("25px");
	},
};
export const DarkComposerChromeParity: Story = {
	...ComposerChromeParity,
	globals: { appearance: "dark" },
};

/** Compact toolbar controls retain the same frame and focus treatment. */
export const CompactToolbar: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<InputFrame size="xs" className="w-10" data-testid="compact-frame">
				<input
					aria-label="Page number"
					defaultValue="1"
					className={clsx(inputVariants({ size: "xs" }), "text-center")}
				/>
			</InputFrame>
			<InputFrame.Skeleton
				size="xs"
				className="w-10"
				data-testid="compact-skeleton"
			>
				1
			</InputFrame.Skeleton>
		</div>
	),
	play: async ({ canvas }) => {
		const field = canvas.getByRole("textbox", { name: "Page number" });
		await userEvent.click(field);
		await expect(field).toHaveFocus();
		await expect(
			canvas.getByTestId("compact-frame").getBoundingClientRect().height,
		).toBe(28);
		await expect(
			canvas.getByTestId("compact-skeleton").getBoundingClientRect().height,
		).toBe(28);
	},
};

export const CompactRow: Story = {
	render: () => (
		<div className="flex h-7 items-center gap-3">
			<InputFrame size="xxs" className="w-10" data-testid="row-frame">
				<input
					aria-label="Compact page number"
					defaultValue="1"
					className={clsx(inputVariants({ size: "xxs" }), "text-center")}
				/>
			</InputFrame>
			<InputFrame.Skeleton
				size="xxs"
				className="w-10"
				data-testid="row-skeleton"
			>
				1
			</InputFrame.Skeleton>
		</div>
	),
	play: async ({ canvas }) => {
		await userEvent.click(
			canvas.getByRole("textbox", { name: "Compact page number" }),
		);
		await expect(
			canvas.getByRole("textbox", { name: "Compact page number" }),
		).toHaveFocus();
		await expect(
			canvas.getByTestId("row-frame").getBoundingClientRect().height,
		).toBeCloseTo(24, 1);
		await expect(
			canvas.getByTestId("row-skeleton").getBoundingClientRect().height,
		).toBeCloseTo(24, 1);
	},
};

export const Muted: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Use variant="muted" for secondary controls within toolbars or dropdowns: a soft neutral fill without resting shadow. It composes with every size and validation tone. The default variant remains unchanged.',
			},
		},
	},
	render: () => (
		<div className="grid max-w-xs gap-4 rounded-xl bg-float p-4">
			<InputFrame size="xxs" className="w-10" data-testid="default-frame">
				<input
					aria-label="Default page"
					defaultValue="1"
					className={inputVariants({ size: "xxs" })}
				/>
			</InputFrame>
			<InputFrame
				variant="muted"
				size="xxs"
				className="w-10"
				data-testid="muted-frame"
			>
				<input
					aria-label="Muted page"
					defaultValue="1"
					className={inputVariants({ size: "xxs" })}
				/>
			</InputFrame>
			<InputFrame variant="muted" tone="error" data-testid="muted-error">
				<input
					aria-label="Invalid muted value"
					aria-invalid="true"
					defaultValue="Invalid value"
					className={inputVariants()}
				/>
			</InputFrame>
			<InputFrame.Skeleton
				variant="muted"
				size="xxs"
				className="w-10"
				data-testid="muted-skeleton"
			>
				1
			</InputFrame.Skeleton>
		</div>
	),
	play: async ({ canvas }) => {
		const frame = canvas.getByTestId("muted-frame");
		const restShadow = getComputedStyle(frame).boxShadow;
		await expect(getComputedStyle(frame).backgroundColor).not.toBe(
			getComputedStyle(canvas.getByTestId("default-frame")).backgroundColor,
		);
		await expect(restShadow).not.toBe(
			getComputedStyle(canvas.getByTestId("default-frame")).boxShadow,
		);
		await expect(frame.getBoundingClientRect().height).toBe(24);
		await expect(
			canvas.getByTestId("muted-skeleton").getBoundingClientRect().height,
		).toBe(24);
		await expect(canvas.getByTestId("muted-skeleton")).not.toHaveAttribute(
			"variant",
		);
		await userEvent.click(canvas.getByRole("textbox", { name: "Muted page" }));
		await expect(
			canvas.getByRole("textbox", { name: "Muted page" }),
		).toHaveFocus();
		await expect(
			getComputedStyle(frame).getPropertyValue("--tw-ring-shadow"),
		).toContain("3px");
		await expect(canvas.getByTestId("muted-error")).toHaveAttribute(
			"aria-invalid",
			"true",
		);
		await expect(
			getComputedStyle(canvas.getByTestId("muted-error")).getPropertyValue(
				"--tw-ring-shadow",
			),
		).toContain("3px");
	},
};

export const MutedDark: Story = { ...Muted, globals: { theme: "dark" } };
