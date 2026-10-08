import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Button } from "./Button";
import { catalogContract } from "./Button.catalog";

const meta = {
	id: "ui-primitives-button",
	excludeStories: ["catalogContract"],
	title: "UI/Primitives/Button",
	component: Button,
	subcomponents: {
		"Button.Skeleton": Button.Skeleton,
	},
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		layout: "centered",
		a11y: { test: "error" },
		docs: {
			description: {
				component: formatCatalogOwnerContract(catalogContract),
			},
		},
	},
	argTypes: {
		shape: { control: "select", options: ["standard", "round", "square"] },
		variant: {
			control: "select",
			options: ["primary", "secondary", "ghost", "bare", "link", "inverse"],
		},
		tone: {
			control: "select",
			options: ["default", "danger", "warning"],
		},
		size: {
			control: "select",
			options: [
				"none",
				"xxs",
				"xs",
				"compact",
				"sm",
				"md",
				"lg",
				"xl",
				"chip",
				"icon",
				"icon-sm",
			],
		},
	},
	args: {
		children: "Continue",
		size: "md",
		variant: "secondary",
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ActionHierarchy: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Primary for the principal action, secondary for standard actions, ghost for low emphasis with a hover surface, bare for permanently transparent controls, and link for underlined navigation. Inverse remains a primary compatibility name.",
			},
		},
	},
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button variant="primary">Publish</Button>
			<Button variant="secondary">Save draft</Button>
			<Button variant="ghost">Cancel</Button>
			<Button variant="bare">Dismiss</Button>
			<Button variant="link" href="/dashboard">
				View details
			</Button>
		</div>
	),
};

export const DestructiveMeaning: Story = {
	parameters: {
		a11y: { test: "error" },
		docs: {
			description: {
				story:
					'Danger is semantic tone, not a separate hierarchy. Pair tone="danger" with the appropriate primary, secondary, or ghost variant.',
			},
		},
	},
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button tone="danger" variant="primary">
				Delete permanently
			</Button>
			<Button tone="danger" variant="secondary">
				Remove member
			</Button>
			<Button tone="danger" variant="ghost">
				Discard
			</Button>
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole("button", { name: "Delete permanently" }),
		).toBeVisible();
		await expect(
			canvas.getByRole("button", { name: "Remove member" }),
		).toBeVisible();
		await expect(canvas.getByRole("button", { name: "Discard" })).toBeVisible();
	},
};

export const SizesAndIcons: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Sizes own their shell and icon spacing. Use icon sizes for icon-only controls with an accessible name.",
			},
		},
	},
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button size="sm">Small</Button>
			<Button size="lg" leadingIcon="plus">
				Create
			</Button>
			<Button aria-label="Continue" leadingIcon="arrow-right" size="icon" />
		</div>
	),
};

export const AsyncStateParity: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"The loading state keeps live content in flow, while Button.Skeleton reserves the same component-owned dimensions during initial loading.",
			},
		},
	},
	render: () => (
		<div className="grid gap-4">
			<div className="flex items-center gap-3">
				<Button variant="primary">Save changes</Button>
				<Button loading variant="primary">
					Save changes
				</Button>
			</div>
			<div className="flex items-center gap-3">
				<Button.Skeleton variant="primary">Save changes</Button.Skeleton>
				<Button disabled variant="secondary">
					Unavailable
				</Button>
			</div>
		</div>
	),
};

export const ButtonLikeLink: Story = {
	args: {
		children: "Open dashboard",
		href: "/dashboard",
		variant: "primary",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Pass href when navigation should retain Button presentation; the primitive owns the Next.js link rendering.",
			},
		},
	},
};

export const InteractionContract: Story = {
	args: {
		children: "Save changes",
		onClick: fn(),
		variant: "primary",
	},
	play: async ({ args, canvas }) => {
		const button = canvas.getByRole("button", { name: "Save changes" });
		await userEvent.click(button);
		await expect(args.onClick).toHaveBeenCalledOnce();
		button.focus();
		await expect(button).toHaveFocus();
		await userEvent.keyboard("{Enter}");
		await expect(args.onClick).toHaveBeenCalledTimes(2);
	},
};

export const CompletePalette: Story = {
	render: () => (
		<div className="grid gap-5">
			{(["default", "danger", "warning"] as const).map((tone) => (
				<div key={tone} className="flex flex-wrap items-center gap-3">
					<span className="w-20 text-sm">{tone}</span>
					{(
						[
							"primary",
							"secondary",
							"ghost",
							"bare",
							"link",
							"inverse",
						] as const
					).map((variant) => (
						<Button key={variant} variant={variant} tone={tone}>
							{variant}
						</Button>
					))}
				</div>
			))}
		</div>
	),
	play: async ({ canvas }) => {
		const primary = canvas.getAllByRole("button", { name: "primary" })[0];
		const secondary = canvas.getAllByRole("button", { name: "secondary" })[0];
		await expect(
			getComputedStyle(primary).getPropertyValue("--button-primary").trim(),
		).not.toBe("");
		await expect(getComputedStyle(primary).backgroundColor).not.toBe(
			"rgba(0, 0, 0, 0)",
		);
		await expect(getComputedStyle(secondary).backgroundColor).not.toBe(
			getComputedStyle(primary).backgroundColor,
		);
		await expect(getComputedStyle(primary).borderRadius).toBe("7px");
	},
};

export const GeometryAndSkeletons: Story = {
	render: () => (
		<div className="grid gap-3">
			{(
				[
					"xxs",
					"xs",
					"compact",
					"sm",
					"md",
					"lg",
					"xl",
					"chip",
					"none",
					"icon",
					"icon-sm",
				] as const
			).map((size) => (
				<div key={size} data-testid={size} className="flex items-center gap-3">
					<span className="w-16 text-sm">{size}</span>
					<Button size={size} aria-label={size}>
						{size.startsWith("icon") ? "+" : "Continue"}
					</Button>
					<Button.Skeleton size={size}>
						{size.startsWith("icon") ? undefined : "Continue"}
					</Button.Skeleton>
					<Button
						size={size}
						shape="round"
						aria-label={`${size} round`}
						leadingIcon="plus"
					/>
					<Button
						size={size}
						shape="square"
						aria-label={`${size} square`}
						leadingIcon="plus"
					/>
					<Button.Skeleton size={size} shape="square" />
				</div>
			))}
		</div>
	),
	play: async ({ canvas }) => {
		const heights = {
			xxs: 20,
			xs: 24,
			compact: 28,
			sm: 30,
			md: 34,
			lg: 38,
			xl: 44,
			icon: 34,
			"icon-sm": 32,
		};
		for (const [size, height] of Object.entries(heights)) {
			const row = canvas.getByTestId(size);
			const button = canvas.getByRole("button", { name: size });
			const skeleton = row.querySelector('[aria-hidden="true"]') as HTMLElement;
			await expect(button.getBoundingClientRect().height).toBe(height);
			await expect(skeleton.getBoundingClientRect().height).toBe(height);
			await expect(skeleton.getBoundingClientRect().width).toBe(
				button.getBoundingClientRect().width,
			);
			const square = canvas.getByRole("button", { name: `${size} square` });
			const round = canvas.getByRole("button", { name: `${size} round` });
			const expectedIconSize = size === "sm" ? 32 : size === "xl" ? 40 : height;
			await expect(square.getBoundingClientRect().height).toBe(
				expectedIconSize,
			);
			await expect(square.getBoundingClientRect().width).toBe(expectedIconSize);
			await expect(round.getBoundingClientRect().width).toBe(expectedIconSize);
			await expect(getComputedStyle(square).borderRadius).toBe("7px");
			await expect(getComputedStyle(round).borderRadius).not.toBe("7px");
			await expect(row.lastElementChild?.getBoundingClientRect().width).toBe(
				expectedIconSize,
			);
		}
	},
};

export const LightPalette: Story = {
	...CompletePalette,
	globals: { appearance: "light" },
};
export const DarkPalette: Story = {
	...CompletePalette,
	globals: { appearance: "dark" },
};

export const DisabledAndLoading: Story = {
	args: { onClick: fn() },
	render: (args) => (
		<div className="flex gap-3">
			<Button {...args} loading disabled={false}>
				Saving changes
			</Button>
			<Button {...args} disabled>
				Unavailable
			</Button>
			<Button
				onClick={() => args.onClick?.({} as never)}
				href="/dashboard"
				loading
				tabIndex={0}
			>
				Opening dashboard
			</Button>
		</div>
	),
	play: async ({ args, canvas }) => {
		const pending = canvas.getByRole("button", { name: "Saving changes" });
		await expect(pending).toBeDisabled();
		await expect(pending).toHaveAttribute("aria-busy", "true");
		const link = canvas.getByRole("link", { name: "Opening dashboard" });
		await expect(link).toHaveAttribute("tabindex", "-1");
		await expect(link).toHaveAttribute("aria-disabled", "true");
		link.dispatchEvent(
			new MouseEvent("click", { bubbles: true, cancelable: true }),
		);
		await expect(args.onClick).not.toHaveBeenCalled();
	},
};

export const TransparentSkeletons: Story = {
	render: () => (
		<div className="grid gap-4">
			{(["bare", "ghost", "link"] as const).map((variant) => (
				<div
					key={variant}
					data-testid={variant}
					className="flex items-center gap-4"
				>
					<Button variant={variant}>Rename conversation</Button>
					<Button.Skeleton variant={variant}>
						Rename conversation
					</Button.Skeleton>
					<Button
						variant={variant}
						size="icon-sm"
						leadingIcon="ellipsis"
						aria-label={`${variant} options`}
					/>
					<Button.Skeleton variant={variant} size="icon-sm" />
				</div>
			))}
		</div>
	),
	play: async ({ canvas }) => {
		for (const variant of ["bare", "ghost", "link"]) {
			const row = canvas.getByTestId(variant);
			const [live, skeleton, icon, iconSkeleton] = Array.from(
				row.children,
			) as HTMLElement[];
			await expect(skeleton.getBoundingClientRect().width).toBeCloseTo(
				live.getBoundingClientRect().width,
				0,
			);
			await expect(iconSkeleton.getBoundingClientRect().width).toBe(
				icon.getBoundingClientRect().width,
			);
			await expect(getComputedStyle(skeleton).backgroundColor).toBe(
				"rgba(0, 0, 0, 0)",
			);
			await expect(
				iconSkeleton.querySelector("span > span")?.getBoundingClientRect()
					.width,
			).toBe(16);
		}
	},
};
