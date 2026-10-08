import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, waitFor } from "storybook/test";
import { measureRenderedContrast } from "@/components/ui/foundations/contrastEvidence";
import { Button } from "@/components/ui/primitives/Button";
import { DashboardTablePanel } from "./DashboardTablePanel";

const columns = [{ id: "name", header: "Name", render: (row: string) => row }];
const rows = [
	"Juliet",
	"India",
	"Hotel",
	"Golf",
	"Foxtrot",
	"Echo",
	"Delta",
	"Charlie",
	"Bravo",
	"Alpha",
	"Kilo",
];
const meta = {
	title: "Dashboard/Data/Card table",
	component: DashboardTablePanel<string>,
	args: { columns, rows, getRowKey: (row: string) => row },
	tags: ["autodocs"],
	parameters: {
		a11y: { test: "error" },
		docs: {
			description: {
				component:
					"Standard contained collection table. Set pageSize for a fully loaded collection: sorting covers all rows and returns to page one; removals clamp the current page. The footer shares the column-header surface, stays outside horizontal scrolling, and uses a compact previous / current of total / next pager. Mirror pageSize in Skeleton. Omit it for overview excerpts with View more. This client pagination does not fetch remote pages or infer provider totals.",
			},
		},
	},
} satisfies Meta<typeof DashboardTablePanel<string>>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Pagination: Story = {
	render: () => (
		<DashboardTablePanel
			columns={[...columns, { id: "actions", header: "Actions", kind: "action", render: () => "—" }]}
			rows={rows}
			getRowKey={(row) => row}
			pageSize={5}
		/>
	),
	play: async ({ canvas, canvasElement }) => {
		const header = canvasElement.querySelector("thead tr");
		const footer = canvasElement.querySelector(
			"[data-dashboard-table-pagination]",
		);
		if (!header || !footer)
			throw new Error("Expected table header and pagination footer");
		const stickyHeader = canvas.getByRole("columnheader", { name: "Actions" });
		const tableFrame = header.closest("table")?.parentElement?.parentElement;
		const footerDivider = footer.querySelector("hr");
		if (!tableFrame || !footerDivider) throw new Error("Missing table frame or divider");
		const outlineColor = getComputedStyle(tableFrame).borderTopColor;
		await expect(getComputedStyle(stickyHeader).borderBottomColor).toBe(outlineColor);
		await expect(getComputedStyle(footerDivider).backgroundColor).toBe(outlineColor);

		await expect(getComputedStyle(stickyHeader).backgroundColor)
			.toBe(getComputedStyle(header).backgroundColor);
		const headerLabel = canvas.getByRole("button", { name: "Name" });
		const pageCount = canvas.getByText("1 of 3");
		const footerFill = footer.lastElementChild as HTMLElement;
		await expect(measureRenderedContrast(headerLabel, header as HTMLElement).text).toBeGreaterThanOrEqual(4.5);
		await expect(measureRenderedContrast(pageCount, footerFill).text).toBeGreaterThanOrEqual(4.5);

		await expect(
			Math.abs(
				header.getBoundingClientRect().height -
					footer.getBoundingClientRect().height,
			),
		).toBeLessThanOrEqual(1);
		await expect(canvas.getByText("1 of 3")).toBeVisible();
		await expect(
			canvas.getByRole("button", { name: "Previous page" }),
		).toBeDisabled();
		await expect(canvas.getByText("Alpha")).not.toBeVisible();
		await userEvent.click(canvas.getByRole("button", { name: "Next page" }));
		await expect(canvas.getByText("2 of 3")).toBeVisible();
		await expect(canvas.getByText("Alpha")).toBeVisible();
		await userEvent.click(canvas.getByRole("button", { name: "Name" }));
		await waitFor(() => expect(canvas.getByText("1 of 3")).toBeVisible());
		await expect(canvas.getByText("Alpha")).toBeVisible();
		await expect(canvas.getByText("Juliet")).not.toBeVisible();
		await userEvent.click(canvas.getByRole("button", { name: "Next page" }));
		await userEvent.click(canvas.getByRole("button", { name: "Next page" }));
		await expect(canvas.getByText("Kilo")).toBeVisible();
		await expect(
			canvas.getByRole("button", { name: "Next page" }),
		).toBeDisabled();
		await userEvent.click(
			canvas.getByRole("button", { name: "Previous page" }),
		);
		await expect(canvas.getByText("2 of 3")).toBeVisible();
	},
};
function RemovalExample() {
	const [items, setItems] = useState(rows.slice(0, 6));
	return (
		<div className="grid gap-4">
			<Button onClick={() => setItems(items.slice(0, 5))}>
				Remove last item
			</Button>
			<DashboardTablePanel
				columns={columns}
				rows={items}
				getRowKey={(row) => row}
				pageSize={5}
			/>
		</div>
	);
}
export const LastPageRemoval: Story = {
	render: () => <RemovalExample />,
	play: async ({ canvas }) => {
		await userEvent.click(canvas.getByRole("button", { name: "Next page" }));
		await expect(canvas.getByText("2 of 2")).toBeVisible();
		await userEvent.click(
			canvas.getByRole("button", { name: "Remove last item" }),
		);
		await expect(canvas.getByText("1 of 1")).toBeVisible();
		await expect(canvas.getByText("Juliet")).toBeVisible();
		await expect(
			canvas.getByRole("button", { name: "Next page" }),
		).toBeDisabled();
	},
};
export const Empty: Story = {
	render: () => (
		<DashboardTablePanel
			columns={columns}
			rows={[]}
			getRowKey={(row) => row}
			pageSize={5}
			emptyState="No records yet."
		/>
	),
	play: async ({ canvas }) => {
		await expect(canvas.getByText("No records yet.")).toBeVisible();
		await expect(
			canvas.getByRole("button", { name: "Previous page" }),
		).toBeDisabled();
		await expect(
			canvas.getByRole("button", { name: "Next page" }),
		).toBeDisabled();
	},
};
export const Skeleton: Story = {
	render: () => (
		<DashboardTablePanel.Skeleton columns={columns} pageSize={5}>
			<tr>
				<td className="px-4 py-3">Loading records…</td>
			</tr>
		</DashboardTablePanel.Skeleton>
	),
};
