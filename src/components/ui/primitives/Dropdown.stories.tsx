import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useRef, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Button } from "./Button";
import { catalogContract } from "./Dropdown.catalog";
import {
	Dropdown,
	type DropdownListboxProps,
	type DropdownMenuProps,
	type DropdownSurfaceProps,
} from "./dropdown";
import { InputFrame } from "./InputFrame";

function DropdownMenuContract(props: DropdownMenuProps) {
	return <Dropdown.Menu {...props} />;
}
DropdownMenuContract.displayName = "Dropdown.Menu";

function DropdownListboxContract(props: DropdownListboxProps<string>) {
	return <Dropdown.Listbox {...props} />;
}
DropdownListboxContract.displayName = "Dropdown.Listbox";

function DropdownPanelContract(props: DropdownSurfaceProps) {
	return <Dropdown.Panel {...props} />;
}
DropdownPanelContract.displayName = "Dropdown.Panel";

const meta = {
	id: "ui-primitives-dropdown",
	excludeStories: ["catalogContract"],
	title: "UI/Primitives/Dropdown",
	component: Dropdown,
	subcomponents: {
		"Dropdown.Menu": DropdownMenuContract,
		"Dropdown.Listbox": DropdownListboxContract,
		"Dropdown.Panel": DropdownPanelContract,
	},
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

export const DividerHierarchy: Story = {
	render: () => (
		<Dropdown.Menu
			ariaLabel="Divider hierarchy"
			openOnHover={false}
			menuWidth={300}
			options={[
				{
					id: "identity",
					label: "Demo organization",
					layout: "presentation",
					dividerAfter: "full",
				},
				...Array.from({ length: 10 }, (_, index) => ({
					id: `action-${index}`,
					label: `Action ${index + 1}`,
				})),
				{ id: "remove", label: "Remove access", tone: "danger" },
			]}
		/>
	),
	play: async ({ canvas, canvasElement }) => {
		await userEvent.click(
			canvas.getByRole("button", { name: "Divider hierarchy" }),
		);
		const body = within(canvasElement.ownerDocument.body);
		const menu = await body.findByRole("menu", { name: "Divider hierarchy" });
		const separators = within(menu).getAllByRole("separator");
		await expect(separators).toHaveLength(2);
		await expect(separators[0].getBoundingClientRect().width).toBeGreaterThan(
			separators[1].getBoundingClientRect().width,
		);
		const first = within(menu).getByRole("menuitem", { name: "Action 1" });
		const second = within(menu).getByRole("menuitem", { name: "Action 2" });
		await expect(getComputedStyle(first).borderRadius).toBe("7px");
		await expect(first.getBoundingClientRect().height).toBeCloseTo(34, 1);
		await expect(
			second.getBoundingClientRect().top - first.getBoundingClientRect().bottom,
		).toBeCloseTo(2, 1);
		for (const separator of separators) {
			const previous = separator.previousElementSibling!;
			const next = separator.nextElementSibling!;
			await expect(
				separator.getBoundingClientRect().top -
					previous.getBoundingClientRect().bottom,
			).toBeCloseTo(4, 1);
			await expect(
				next.getBoundingClientRect().top -
					separator.getBoundingClientRect().bottom,
			).toBeCloseTo(4, 1);
			await expect(separator.getBoundingClientRect().height).toBeCloseTo(1, 1);
		}
		const last = within(menu).getByRole("menuitem", { name: "Remove access" });
		await expect(getComputedStyle(last).borderTopWidth).toBe("0px");
		menu.focus();
		await userEvent.keyboard("{End}");
		await expect(menu).toHaveAttribute("aria-activedescendant", last.id);
		const scroller = menu;
		scroller.scrollTop = scroller.scrollHeight;
		await expect(
			scroller.getBoundingClientRect().bottom -
				last.getBoundingClientRect().bottom,
		).toBeCloseTo(4, 1);
	},
};
type Story = StoryObj;

const editProject = fn();
const archiveProject = fn();
const removeMemberAccess = fn();

export const ContextualDestructiveAction: Story = {
	tags: ["backport-canonical"],
	parameters: {
		backport: {
			schemaVersion: 1,
			target: "averlo-next-template",
			canonicalStoryId: "ui-primitives-dropdown--contextual-destructive-action",
			strategy: "adapt",
			rationale:
				"Keep secondary destructive row actions inside the contextual menu and prove keyboard access.",
			source: {
				repository: "synthetic:dropdown-backport-pilot",
				storyId: "ui-primitives-dropdown--contextual-destructive-action",
				fingerprint:
					"sha256:3df7fcb4d3aa9140b7f2ac7685585e8fe982377cab43ba4ace6e496dfec7d594",
			},
		},
		docs: {
			description: {
				story:
					"Keep destructive actions in the contextual More menu when destruction is not the primary goal of the entire page. A directly visible destructive Button is reserved for a surface whose primary task is destructive.",
			},
		},
	},
	render: () => (
		<div className="flex max-w-xl items-center justify-between rounded-xl border border-border bg-card p-4">
			<div className="grid gap-0.5">
				<strong>Avery Chen</strong>
				<span className="text-sm text-muted-foreground">
					Admin · Access active
				</span>
			</div>
			<Dropdown.Menu
				ariaLabel="Manage Avery Chen"
				openOnHover={false}
				options={[
					{ id: "view", label: "View member" },
					{
						id: "remove",
						label: "Remove access",
						onSelect: removeMemberAccess,
						tone: "danger",
					},
				]}
			/>
		</div>
	),
	play: async ({ canvas, canvasElement }) => {
		removeMemberAccess.mockClear();
		const body = within(canvasElement.ownerDocument.body);
		await expect(
			body.queryByRole("button", { name: "Remove access" }),
		).not.toBeInTheDocument();
		await expect(
			body.queryByRole("menuitem", { name: "Remove access" }),
		).not.toBeInTheDocument();
		const trigger = canvas.getByRole("button", { name: "Manage Avery Chen" });
		const icon = trigger.querySelector("svg");
		if (!icon) throw new Error("Menu ellipsis missing");
		const iconWidth = icon.getBoundingClientRect().width;
		await expect(iconWidth).toBeCloseTo(15, 1);
		await userEvent.hover(trigger);
		await expect(icon.getBoundingClientRect().width).toBeCloseTo(iconWidth, 1);
		await expect(getComputedStyle(trigger).backgroundColor).toBe(
			"rgba(0, 0, 0, 0)",
		);
		trigger.focus();
		await expect(trigger).toHaveFocus();
		await userEvent.keyboard("{Enter}");
		const items = await body.findAllByRole("menuitem");
		await expect(items.map((item) => item.textContent?.trim())).toEqual([
			"View member",
			"Remove access",
		]);
		const removeItem = body.getByRole("menuitem", { name: "Remove access" });
		await expect(removeItem).toHaveClass("!text-[var(--button-danger-text)]");
		await expect(getComputedStyle(removeItem).borderRadius).toBe("7px");
		await userEvent.click(removeItem);
		await expect(removeMemberAccess).toHaveBeenCalledOnce();
	},
};

export const MenuOrderingSelectionAndDismissal: Story = {
	render: () => (
		<Dropdown.Menu
			ariaLabel="Project actions"
			openOnHover={false}
			options={[
				{ id: "edit", label: "Edit", onSelect: editProject },
				{ id: "details", label: "Details", disabled: true },
				{
					id: "warning",
					label: "Archive",
					tone: "warning",
					onSelect: archiveProject,
				},
				Dropdown.menuOptions.delete({ label: "Delete project" }),
			]}
		/>
	),
	play: async ({ canvas, canvasElement }) => {
		editProject.mockClear();
		const trigger = canvas.getByRole("button", { name: "Project actions" });
		await userEvent.click(trigger);
		const body = within(canvasElement.ownerDocument.body);
		const menu = await body.findByRole("menu", { name: "Project actions" });
		await waitFor(() => expect(menu).toBeVisible());
		await expect(
			body.getAllByRole("menuitem").map((item) => item.textContent?.trim()),
		).toEqual(["Edit", "Details", "Archive", "Delete project"]);
		await expect(menu.closest(".absolute")).not.toBeNull();
		await userEvent.keyboard("{Escape}");
		await waitFor(() =>
			expect(
				body.queryByRole("menu", { name: "Project actions" }),
			).not.toBeInTheDocument(),
		);
		await expect(trigger).toHaveFocus();
		await userEvent.click(trigger);
		await userEvent.click(await body.findByRole("menuitem", { name: "Edit" }));
		await expect(editProject).toHaveBeenCalledOnce();
		await waitFor(() =>
			expect(
				body.queryByRole("menu", { name: "Project actions" }),
			).not.toBeInTheDocument(),
		);
	},
};

const factorySelection = fn();

export const MenuFactoriesSemanticOrderingAndComposition: Story = {
	render: () => (
		<div id="dropdown-menu-contract-target">
			<Dropdown.Menu
				ariaLabel="Factory actions"
				openOnHover={false}
				options={[
					{
						id: "default",
						label: "Default action",
						onSelect: factorySelection,
					},
					Dropdown.menuOptions.open({
						href: "#dropdown-menu-contract-target",
					}),
					Dropdown.menuOptions.edit({
						disabled: true,
						onSelect: factorySelection,
					}),
					{
						id: "presentation",
						label: (
							<span className="grid gap-0.5">
								<strong>Presentation layout</strong>
								<small>Multi-line React node label</small>
							</span>
						),
						layout: "presentation",
						leadingIcon: <span aria-hidden>←</span>,
						trailingIcon: <span aria-hidden>→</span>,
						className: "font-medium",
						textClassName: "uppercase",
						onSelect: factorySelection,
					},
					Dropdown.menuOptions.warning({
						label: "Review action",
						onSelect: factorySelection,
					}),
					Dropdown.menuOptions.delete({
						label: "Delete permanently",
						onSelect: factorySelection,
					}),
				]}
			/>
		</div>
	),
	play: async ({ canvas, canvasElement }) => {
		factorySelection.mockClear();
		await userEvent.click(
			canvas.getByRole("button", { name: "Factory actions" }),
		);
		const body = within(canvasElement.ownerDocument.body);
		const items = await body.findAllByRole("menuitem");
		await expect(items.map((item) => item.textContent?.trim())).toEqual([
			"Default action",
			"Open",
			"Edit",
			"←Presentation layoutMulti-line React node label→",
			"Review action",
			"Delete permanently",
		]);
		await expect(body.getByRole("menuitem", { name: "Open" })).toHaveAttribute(
			"href",
			"#dropdown-menu-contract-target",
		);
		await expect(body.getByRole("menuitem", { name: "Edit" })).toHaveAttribute(
			"aria-disabled",
			"true",
		);
		await expect(
			body.getByRole("menuitem", { name: /Presentation layout/ }),
		).toHaveClass("font-medium");
		await expect(
			body.getByRole("menuitem", { name: "Review action" }),
		).toHaveClass("!text-[var(--button-warning-text)]");
		await expect(
			body.getByRole("menuitem", { name: "Delete permanently" }),
		).toHaveClass("!text-[var(--button-danger-text)]");
		await userEvent.click(body.getByRole("menuitem", { name: "Edit" }));
		await expect(
			body.getByRole("menu", { name: "Factory actions" }),
		).toBeVisible();
		await userEvent.click(
			body.getByRole("menuitem", { name: "Review action" }),
		);
		await expect(factorySelection).toHaveBeenCalledOnce();
		await waitFor(() =>
			expect(
				body.queryByRole("menu", { name: "Factory actions" }),
			).not.toBeInTheDocument(),
		);
	},
};

const chooseWorkspace = fn();

export const SelectableListbox: Story = {
	render: () => (
		<Dropdown.Listbox
			ariaLabel="Workspace"
			onSelect={chooseWorkspace}
			openOnHover={false}
			options={[
				{ value: "personal", content: "Personal", selected: true },
				{ value: "studio", content: "Studio" },
				{ value: "archive", content: "Archive", disabled: true },
			]}
			triggerContent="Choose workspace"
		/>
	),
	play: async ({ canvas, canvasElement }) => {
		chooseWorkspace.mockClear();
		await userEvent.click(canvas.getByRole("button", { name: "Workspace" }));
		const body = within(canvasElement.ownerDocument.body);
		const listbox = await body.findByRole("listbox", { name: "Workspace" });
		const studio = await body.findByRole("option", { name: "Studio" });
		await expect(listbox).not.toHaveAttribute("aria-activedescendant");
		await userEvent.hover(studio);
		await waitFor(() =>
			expect(listbox).toHaveAttribute("aria-activedescendant", studio.id),
		);
		await userEvent.click(studio);
		await expect(chooseWorkspace).toHaveBeenCalledWith(
			"studio",
			expect.objectContaining({ value: "studio" }),
			expect.anything(),
		);
		await waitFor(() =>
			expect(
				body.queryByRole("listbox", { name: "Workspace" }),
			).not.toBeInTheDocument(),
		);
	},
};

function ControlledPanelExample() {
	const [open, setOpen] = useState(false);
	const anchorRef = useRef<HTMLElement | null>(null);
	return (
		<div className="relative min-h-64">
			<Button ref={anchorRef} onClick={() => setOpen(true)}>
				Choose color
			</Button>
			{open ? (
				<Dropdown.Panel
					anchorRef={anchorRef}
					aria-label="Color picker"
					padding="sm"
					positionStrategy="fixed"
					role="dialog"
				>
					<div className="grid gap-3">
						<fieldset className="flex gap-2">
							<legend className="sr-only">Available colors</legend>
							<Button aria-label="Blue" size="icon-sm">
								<span aria-hidden className="size-4 rounded-full bg-primary" />
							</Button>
							<Button aria-label="Red" size="icon-sm">
								<span aria-hidden className="size-4 rounded-full bg-danger" />
							</Button>
						</fieldset>
						<Button size="sm" onClick={() => setOpen(false)}>
							Close picker
						</Button>
					</div>
				</Dropdown.Panel>
			) : null}
		</div>
	);
}

export const IndependentlyControlledPanel: Story = {
	render: () => <ControlledPanelExample />,
	play: async ({ canvas, canvasElement }) => {
		await userEvent.click(canvas.getByRole("button", { name: "Choose color" }));
		const body = within(canvasElement.ownerDocument.body);
		const panel = await body.findByRole("dialog", { name: "Color picker" });
		await waitFor(() => expect(panel).toBeVisible());
		await userEvent.click(body.getByRole("button", { name: "Close picker" }));
		await waitFor(() =>
			expect(
				body.queryByRole("dialog", { name: "Color picker" }),
			).not.toBeInTheDocument(),
		);
	},
};

export const RecursiveMenu: Story = {
	render: () => (
		<Dropdown.Menu
			ariaLabel="Share actions"
			openOnHover={false}
			options={[
				{
					id: "share",
					label: "Share",
					children: [
						{
							id: "copy-link",
							label: "Copy link",
							children: [
								{ id: "public-link", label: "Public link" },
								{ id: "restricted-link", label: "Restricted link" },
							],
						},
						{ id: "invite", label: "Invite member" },
					],
				},
				{
					id: "disabled-branch",
					label: "Disabled branch",
					disabled: true,
					children: [{ id: "hidden-child", label: "Hidden child" }],
				},
				{ id: "duplicate", label: "Duplicate" },
			]}
		/>
	),
	play: async ({ canvas, canvasElement }) => {
		const trigger = canvas.getByRole("button", { name: "Share actions" });
		await userEvent.click(trigger);
		const body = within(canvasElement.ownerDocument.body);
		const rootMenu = await body.findByRole("menu", { name: "Share actions" });
		await expect(rootMenu.closest(".fixed")).not.toBeNull();
		await expect(body.getByRole("menuitem", { name: "Share" })).toHaveClass(
			"focus-visible:ring-inset",
			"!rounded-[7px]",
		);
		await expect(body.getByRole("menuitem", { name: "Duplicate" })).toHaveClass(
			"!rounded-[7px]",
		);
		for (const name of ["Share", "Disabled branch"]) {
			const row = body.getByRole("menuitem", { name });
			const caret = row.querySelector("[data-dropdown-cascade-trigger]");
			await expect(caret).not.toBeNull();
			await expect(
				Math.abs(
					row.getBoundingClientRect().right -
						caret!.getBoundingClientRect().right +
						Number.parseFloat(getComputedStyle(caret!).paddingRight) -
						Number.parseFloat(getComputedStyle(row).paddingRight),
				),
			).toBeLessThan(1);
		}
		rootMenu.focus();
		await userEvent.keyboard("{ArrowDown}{ArrowRight}");
		await waitFor(() => expect(body.getAllByRole("menu")).toHaveLength(2));
		await waitFor(() => expect(body.getByText("Copy link")).toBeVisible());
		await waitFor(() => {
			const parent = body.getByRole("menuitem", { name: "Share" });
			const child = body.getByRole("menuitem", { name: "Copy link" });
			expect(
				Math.abs(
					parent.getBoundingClientRect().top -
						child.getBoundingClientRect().top,
				),
			).toBeLessThan(1);
		});
		await userEvent.keyboard("{ArrowRight}");
		await waitFor(() => expect(body.getAllByRole("menu")).toHaveLength(3));
		await waitFor(() => expect(body.getByText("Public link")).toBeVisible());
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(body.getAllByRole("menu")).toHaveLength(2));
		await waitFor(() => expect(body.getAllByRole("menu")[1]).toHaveFocus());
		await userEvent.keyboard("{ArrowLeft}");
		await waitFor(() => expect(body.getAllByRole("menu")).toHaveLength(1));
		await waitFor(() => expect(rootMenu).toHaveFocus());
		await userEvent.keyboard("{Escape}");
		await waitFor(() =>
			expect(
				body.queryByRole("menu", { name: "Share actions" }),
			).not.toBeInTheDocument(),
		);
		await expect(trigger).toHaveFocus();
	},
};

export const RecursivePointerOwnership: Story = {
	parameters: { a11y: { test: "error" } },
	render: () => (
		<Dropdown.Menu
			ariaLabel="Pointer cascade"
			openOnHover={false}
			options={[
				{
					id: "projects",
					label: "Projects",
					children: [
						{
							id: "recent",
							label: "Recent",
							children: [{ id: "apollo", label: "Apollo" }],
						},
					],
				},
				{
					id: "disabled",
					label: "Disabled branch",
					disabled: true,
					children: [{ id: "never", label: "Never opens" }],
				},
				{ id: "other", label: "Other action" },
			]}
		/>
	),
	play: async ({ canvas, canvasElement }) => {
		await userEvent.click(
			canvas.getByRole("button", { name: "Pointer cascade" }),
		);
		const body = within(canvasElement.ownerDocument.body);
		const projects = await body.findByRole("menuitem", { name: "Projects" });
		await expect(projects).toHaveAttribute("aria-haspopup", "menu");
		await expect(projects).toHaveAttribute("aria-expanded", "false");
		await userEvent.hover(projects);
		await waitFor(() => expect(body.getAllByRole("menu")).toHaveLength(2));
		await userEvent.hover(body.getByRole("menuitem", { name: "Recent" }));
		await waitFor(() => expect(body.getAllByRole("menu")).toHaveLength(3));
		await userEvent.hover(body.getByRole("menuitem", { name: "Other action" }));
		await waitFor(() => expect(body.getAllByRole("menu")).toHaveLength(1));
		const disabled = body.getByRole("menuitem", { name: "Disabled branch" });
		await expect(disabled).toHaveAttribute("aria-disabled", "true");
		await userEvent.hover(disabled);
		await waitFor(() => expect(body.getAllByRole("menu")).toHaveLength(1));
		await userEvent.keyboard("{Escape}");
		await expect(
			canvas.getByRole("button", { name: "Pointer cascade" }),
		).toHaveFocus();
	},
};

function CompactControlsExample() {
	const [page, setPage] = useState(1);
	return (
		<div className="flex items-center gap-4">
			<Button>Before controls</Button>
			<Dropdown.Menu
				ariaLabel="Preview controls"
				density="compact"
				menuWidth={240}
				options={[
					{
						kind: "control",
						id: "page",
						ariaLabel: "Page navigation",
						content: (
							<>
								<span>Page</span>
								<div className="flex items-center gap-1">
									<Button
										variant="ghost"
										size="xs"
										shape="square"
										leadingIcon="caret-left"
										aria-label="Previous page"
										disabled={page === 1}
										onClick={() => setPage(page - 1)}
									/>
									<InputFrame size="xxs" variant="muted" className="w-10">
										<input
											type="number"
											aria-label="Page"
											min={1}
											max={3}
											value={page}
											onChange={(e) =>
												setPage(
													Math.max(1, Math.min(3, Number(e.target.value))),
												)
											}
											className="h-full w-full min-w-0 bg-transparent text-center text-sm outline-none"
										/>
									</InputFrame>
									<Button
										variant="ghost"
										size="xs"
										shape="square"
										leadingIcon="caret-right"
										aria-label="Next page"
										disabled={page === 3}
										onClick={() => setPage(page + 1)}
									/>
								</div>
							</>
						),
						dividerAfter: "inset",
					},
					{
						id: "reset",
						label: "Reset page",
						closeOnSelect: false,
						onSelect: () => setPage(1),
					},
					{ id: "done", label: "Done", dividerBefore: "full" },
				]}
			/>
			<Button>After controls</Button>
		</div>
	);
}

export const CompactControlRows: Story = {
	render: () => <CompactControlsExample />,
	parameters: {
		docs: {
			description: {
				story:
					'Dropdown.Menu accepts root-level kind: "control" entries with id, ariaLabel, content, and dividerBefore/dividerAfter. Mixed panels use dialog/group semantics and native Tab navigation. Actions retain their shared row styles; closeOnSelect: false keeps repeated adjustments open. density="compact" makes rows 28px; the default remains 34px. Compose muted xxs InputFrame and xs ghost buttons for 24px controls within the 28px rows for matching geometry. Controls are never nested in menuitems, and control panels accept only leaf actions, not submenus.',
			},
		},
	},
	play: async ({ canvas, canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		const trigger = canvas.getByRole("button", { name: "Preview controls" });
		trigger.focus();
		await userEvent.keyboard("{ArrowDown}");
		const panel = await body.findByRole("dialog", { name: "Preview controls" });
		const controls = within(panel);
		await expect(
			controls.getByRole("spinbutton", { name: "Page" }),
		).toHaveFocus();
		await expect(controls.queryByRole("menuitem")).not.toBeInTheDocument();
		for (const row of [
			...controls.getAllByRole("group"),
			...controls.getAllByRole("button"),
		]) {
			await expect(row.getBoundingClientRect().height).toBeCloseTo(
				row.closest("fieldset") && row.tagName !== "FIELDSET" ? 24 : 28,
				1,
			);
		}
		const dividers = controls.getAllByRole("separator");
		await expect(dividers).toHaveLength(2);
		for (const divider of dividers) {
			await expect(divider.getBoundingClientRect().height).toBeCloseTo(1, 1);
			await expect(getComputedStyle(divider).borderTopWidth).toBe("0px");
			await expect(
				divider.getBoundingClientRect().top -
					(divider.previousElementSibling?.getBoundingClientRect().bottom ?? 0),
			).toBeCloseTo(4, 1);
		}
		await expect(dividers[1].getBoundingClientRect().width).toBeGreaterThan(
			dividers[0].getBoundingClientRect().width,
		);
		await userEvent.tab();
		await expect(
			controls.getByRole("button", { name: "Next page" }),
		).toHaveFocus();
		await userEvent.keyboard("{Enter}");
		await expect(
			controls.getByRole("spinbutton", { name: "Page" }),
		).toHaveValue(2);
		await userEvent.click(controls.getByRole("button", { name: "Reset page" }));
		await expect(
			controls.getByRole("spinbutton", { name: "Page" }),
		).toHaveValue(1);
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(panel).not.toBeInTheDocument());
		await expect(trigger).toHaveFocus();
		await userEvent.keyboard("{Enter}");
		await body.findByRole("dialog", { name: "Preview controls" });
		await userEvent.tab({ shift: true });
		await expect(
			canvas.getByRole("button", { name: "Before controls" }),
		).toHaveFocus();
		trigger.focus();
		await userEvent.keyboard("{Enter}");
		const reopened = within(
			await body.findByRole("dialog", { name: "Preview controls" }),
		);
		reopened.getByRole("button", { name: "Done" }).focus();
		await userEvent.tab();
		await expect(
			canvas.getByRole("button", { name: "After controls" }),
		).toHaveFocus();
	},
};

export const ControlRowsHoverAndDismissal: Story = {
	render: () => <CompactControlsExample />,
	play: async ({ canvas, canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		const trigger = canvas.getByRole("button", { name: "Preview controls" });
		await userEvent.hover(trigger);
		const panel = await body.findByRole("dialog", { name: "Preview controls" });
		await userEvent.hover(panel);
		const input = within(panel).getByRole("spinbutton", { name: "Page" });
		await userEvent.click(input);
		await userEvent.unhover(panel);
		// Exercise the existing 120ms hover-close timer while focus remains inside.
		await new Promise((resolve) => setTimeout(resolve, 180));
		await expect(panel).toBeVisible();
		await userEvent.click(
			canvas.getByRole("button", { name: "After controls" }),
		);
		await waitFor(() => expect(panel).not.toBeInTheDocument());
		await userEvent.hover(trigger);
		const hoverPanel = await body.findByRole("dialog", {
			name: "Preview controls",
		});
		await userEvent.unhover(trigger);
		await waitFor(() => expect(hoverPanel).not.toBeInTheDocument());
		await userEvent.click(trigger);
		const pinnedPanel = await body.findByRole("dialog", {
			name: "Preview controls",
		});
		await userEvent.unhover(trigger);
		await new Promise((resolve) => setTimeout(resolve, 180));
		await expect(pinnedPanel).toBeVisible();
		await userEvent.click(
			within(pinnedPanel).getByRole("button", { name: "Done" }),
		);
		await waitFor(() => expect(pinnedPanel).not.toBeInTheDocument());
		await expect(trigger).toHaveFocus();
	},
};

export const CompactControlRowsDark: Story = {
	...CompactControlRows,
	globals: { theme: "dark" },
};
export const CompactActions: Story = {
	render: () => (
		<Dropdown.Menu
			ariaLabel="Compact actions"
			density="compact"
			openOnHover={false}
			options={[{ label: "Fit", closeOnSelect: false }, { label: "Close" }]}
		/>
	),
	play: async ({ canvas, canvasElement }) => {
		const trigger = canvas.getByRole("button", { name: "Compact actions" });
		await userEvent.click(trigger);
		const menu = await within(canvasElement.ownerDocument.body).findByRole(
			"menu",
			{ name: "Compact actions" },
		);
		for (const item of within(menu).getAllByRole("menuitem"))
			await expect(item.getBoundingClientRect().height).toBeCloseTo(28, 1);
		await userEvent.click(within(menu).getByRole("menuitem", { name: "Fit" }));
		await expect(menu).toBeVisible();
		await userEvent.click(
			within(menu).getByRole("menuitem", { name: "Close" }),
		);
		await waitFor(() => expect(menu).not.toBeInTheDocument());
	},
};
