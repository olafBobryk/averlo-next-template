import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, waitFor } from "storybook/test";
import { Panel } from "@/components/ui/primitives/surfaces";
import { Text } from "@/components/ui/primitives/Text";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Carousel } from "./Carousel";
import { catalogContract } from "./Carousel.catalog";

const items = ["Strategy", "Design", "Delivery", "Review"].map(
	(label, index) => ({
		content: (
			<Panel className="grid min-h-72 content-between" padding="md">
				<Text as="h3" variant="headingLg">
					{label}
				</Text>
				<Text tone="muted">Reusable slide content {index + 1}</Text>
			</Panel>
		),
		id: label.toLowerCase(),
		label,
	}),
);

const responsiveItems = [
	"Discover",
	"Frame",
	"Design",
	"Build",
	"Validate",
].map((label, index) => ({
	content: (
		<Panel className="grid min-h-64 content-between" padding="md">
			<Text as="h3" variant="headingMd">
				{label}
			</Text>
			<Text tone="muted">Reusable phase {index + 1}</Text>
		</Panel>
	),
	id: label.toLowerCase(),
	label,
}));

const meta = {
	id: "ui-misc-carousel",
	title: "UI/Misc/Carousel",
	component: Carousel,
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		layout: "padded",
		a11y: { test: "error" },
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LeftGutterAndPagination: Story = {
	args: {
		ariaLabel: "Delivery phases",
		items,
		onIndexChange: fn(),
		paginationLabel: "Choose a delivery phase",
	},
	play: async ({ args, canvas, userEvent }) => {
		await expect(
			canvas.getByRole("region", { name: "Delivery phases" }),
		).toHaveAttribute("data-carousel-gutter", "section");
		await expect(canvas.getAllByRole("group")).toHaveLength(items.length);
		const third = canvas.getByRole("button", {
			name: "Show slide 3: Delivery",
		});
		await userEvent.click(third);
		await waitFor(() => expect(third).toHaveAttribute("aria-current", "true"));
		await expect(args.onIndexChange).toHaveBeenCalledWith(2);
	},
};

export const WithoutSectionGutter: Story = {
	args: {
		ariaLabel: "Compact phases",
		gutter: "none",
		items: items.slice(0, 3),
	},
};

export const ResponsiveGridAtWide: Story = {
	args: {
		ariaLabel: "Project phases",
		items: responsiveItems,
		paginationLabel: "Choose a project phase",
		wideLayout: { columns: 5, from: "xl" },
	},
	decorators: [
		(Story) => (
			<div className="px-[var(--spacing-section-x)] py-4">
				<Story />
			</div>
		),
	],
	parameters: { layout: "fullscreen" },
	play: async ({ canvas }) => {
		const region = canvas.getByRole("region", { name: "Project phases" });
		await waitFor(() =>
			expect(region).toHaveAttribute(
				"data-carousel-presentation",
				window.matchMedia("(min-width: 1280px)").matches ? "grid" : "carousel",
			),
		);
		await expect(canvas.getAllByRole("group")).toHaveLength(
			responsiveItems.length,
		);
	},
};

export const RightToLeftKeyboardNavigation: Story = {
	args: {
		ariaLabel: "مراحل المشروع",
		gutter: "none",
		items: responsiveItems.slice(0, 3),
		onIndexChange: fn(),
		paginationLabel: "اختر مرحلة المشروع",
	},
	decorators: [
		(Story) => (
			<div dir="rtl">
				<Story />
			</div>
		),
	],
	play: async ({ args, canvas, userEvent }) => {
		const region = canvas.getByRole("region", { name: "مراحل المشروع" });
		region.focus();
		await userEvent.keyboard("{ArrowLeft}");
		await waitFor(() => expect(args.onIndexChange).toHaveBeenCalledWith(1));
		await waitFor(() =>
			expect(
				canvas.getByRole("button", { name: "Show slide 2: Frame" }),
			).toHaveAttribute("aria-current", "true"),
		);
	},
};
