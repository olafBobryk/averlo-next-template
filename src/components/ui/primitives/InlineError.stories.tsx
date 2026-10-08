import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Button } from "./Button";
import { InlineError } from "./InlineError";
import { catalogContract, RecoveryExample } from "./InlineError.catalog";

const meta = {
	id: "ui-primitives-inline-error",
	title: "UI/Primitives/InlineError",
	component: InlineError,
	args: { children: "Could not save your changes." },
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		layout: "padded",
		a11y: { test: "error" },
		docs: {
			description: { component: formatCatalogOwnerContract(catalogContract) },
		},
	},
} satisfies Meta<typeof InlineError>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Recovery: Story = {
	render: () => <RecoveryExample />,
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("alert")).toHaveTextContent(
			"Your changes are still here.",
		);
		const message = canvas.getByText(
			"Could not save this preference. Your changes are still here.",
		);
		const action = canvas.getByRole("button", { name: "Try again" });
		await expect(action.getBoundingClientRect().top).toBeLessThan(
			message.getBoundingClientRect().bottom,
		);
		await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
		await waitFor(() =>
			expect(canvas.queryByRole("alert")).not.toBeInTheDocument(),
		);
		await userEvent.click(
			canvas.getByRole("button", { name: "Save preference" }),
		);
		await waitFor(() => expect(canvas.getByRole("alert")).toBeVisible());
	},
};
export const LongMessage: Story = {
	render: () => (
		<div style={{ width: 240 }}>
			<InlineError
				action={
					<Button size="none" variant="bare">
						Try again
					</Button>
				}
			>
				Could not save the preference for
				workspace-with-an-unusually-long-unbroken-identifier. Your previous
				selection is preserved.
			</InlineError>
		</div>
	),
	play: async ({ canvas }) => {
		const alert = canvas.getByRole("alert");
		await expect(alert.scrollWidth).toBeLessThanOrEqual(alert.clientWidth);
	},
};

export const CardRecovery: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'variant="card" uses the shared Card surface for standalone action-level failures, in page content or beside a composer. It retains inline message/action flow, one alert and controlled presence. Use the default inline variant inside an existing bounded form. StatusMessage owns persistent context.',
			},
		},
	},
	render: () => (
		<div className="w-80 max-w-full">
			<RecoveryExample variant="card" />
		</div>
	),
	play: async ({ canvas }) => {
		const alert = canvas.getByRole("alert");
		await expect(alert).toHaveAttribute("data-slot", "card");
		await expect(alert.scrollWidth).toBeLessThanOrEqual(alert.clientWidth);
		await expect(canvas.getAllByRole("alert")).toHaveLength(1);
		await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
		await waitFor(() => expect(canvas.queryByRole("alert")).toBeNull());
		await userEvent.click(
			canvas.getByRole("button", { name: "Save preference" }),
		);
		await waitFor(() => expect(canvas.getByRole("alert")).toBeVisible());
	},
};
export const CardRecoveryDark: Story = {
	...CardRecovery,
	globals: { theme: "dark" },
};
