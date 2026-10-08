import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent } from "storybook/test";
import { HELPER_COLOR_INDICES } from "@/components/ui/foundations/helperPalette";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Chip } from "./Chip";
import { catalogContract } from "./Chip.catalog";
import { ProfilePicture } from "./ProfilePicture";

const meta = {
	id: "ui-misc-chip",
	title: "UI/Misc/Chip",
	component: Chip,
	excludeStories: ["catalogContract"],
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		a11y: { test: "error" },
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SemanticModes: Story = {
	args: { children: "Static" },
	render: () => {
		const onClick = fn();
		return (
			<div className="flex gap-3">
				<Chip>Static</Chip>
				<Chip href="/docs">Documentation</Chip>
				<Chip onClick={onClick} data-testid="chip-action">
					Remove filter
				</Chip>
			</div>
		);
	},
	play: async ({ canvas }) => {
		await expect(
			canvas.getByText("Static").closest("span"),
		).toBeInTheDocument();
		await expect(
			canvas.getByRole("link", { name: "Documentation" }),
		).toHaveAttribute("href", "/docs");
		const action = canvas.getByRole("button", { name: "Remove filter" });
		action.focus();
		await expect(action).toHaveFocus();
		await userEvent.click(action);
	},
};
export const TonesAndSkeleton: Story = {
	args: { children: "Tone" },
	parameters: { a11y: { test: "error" } },
	render: () => (
		<div className="flex flex-wrap gap-2">
			{(
				[
					"neutral",
					"primary",
					"success",
					"warning",
					"danger",
					"helper",
				] as const
			).map((tone, index) => (
				<Chip key={tone} tone={tone} helperIndex={index}>
					{tone}
				</Chip>
			))}
			<Chip.Skeleton leadingIcon trailingIcon>
				Loading chip
			</Chip.Skeleton>
		</div>
	),
	play: async ({ canvas }) => {
		await expect(canvas.getByText("danger")).toBeVisible();
		const skeleton = canvas
			.getByText("Loading chip")
			.closest('[aria-hidden="true"]');
		await expect(skeleton).toHaveAttribute("aria-hidden", "true");
	},
};

export const IdentityContrast: Story = {
	args: { children: "Identity" },
	render: () => (
		<div className="grid gap-4">
			<Chip tone="neutral">Draft</Chip>
			{HELPER_COLOR_INDICES.map((index) => (
				<div
					key={index}
					className="flex items-center gap-3"
					data-testid={`helper-${index}`}
				>
					<Chip tone="helper" helperIndex={index}>
						Identity
					</Chip>
					<ProfilePicture fallback="AB" helperIndex={index} />
				</div>
			))}
		</div>
	),
	play: async ({ canvas }) => {
		for (const index of HELPER_COLOR_INDICES) {
			const row = canvas.getByTestId(`helper-${index}`);
			const pill = row.children[0];
			const avatar = row.querySelector('[role="img"]');
			if (!avatar?.parentElement) throw new Error("Missing identity avatar");
			await expect(
				getComputedStyle(avatar.parentElement).backgroundColor,
			).toBe(getComputedStyle(pill).backgroundColor);
		}
	},
};
