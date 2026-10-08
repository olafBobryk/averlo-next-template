import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { formatCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Button } from "../Button";
import { Text } from "../Text";
import { Card, ContentSection, Float, Panel } from ".";
import { catalogContract } from "./Surfaces.catalog";

const meta = {
	id: "ui-primitives-surfaces",
	excludeStories: ["catalogContract"],
	title: "UI/Primitives/Surfaces",
	component: Panel,
	subcomponents: {
		ContentSection,
		Panel,
		Card,
		"Card.Header": Card.Header,
		"Card.Heading": Card.Heading,
		"Card.Title": Card.Title,
		"Card.Description": Card.Description,
		"Card.Action": Card.Action,
		"Card.Content": Card.Content,
		"Card.Footer": Card.Footer,
		Float,
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
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContentHierarchy: Story = {
	render: () => (
		<div className="grid max-w-3xl gap-8">
			<ContentSection aria-label="Organization identity section">
				<ContentSection.Heading
					title="Organization identity"
					description="Name and identity shown across the workspace."
					action={<Button variant="bare">Edit organization</Button>}
				/>
				<ContentSection.Content>
					<Card aria-label="Organization properties">
						<Card.Content>
							<dl className="grid gap-4 sm:grid-cols-2">
								<div>
									<dt>Name</dt>
									<dd>Demo organization</dd>
								</div>
								<div>
									<dt>Slug</dt>
									<dd>demo</dd>
								</div>
							</dl>
						</Card.Content>
					</Card>
				</ContentSection.Content>
			</ContentSection>
			<ContentSection aria-label="People and access section">
				<ContentSection.Heading
					title="People and access"
					description="Membership and access for this workspace."
					action={<Button>Manage access</Button>}
				/>
				<ContentSection.Content>
					<Card aria-label="Access properties">
						<Card.Content>
							<dl className="grid gap-4 sm:grid-cols-3">
								<div>
									<dt>Active members</dt>
									<dd>3</dd>
								</div>
								<div>
									<dt>Pending invitations</dt>
									<dd>1</dd>
								</div>
								<div>
									<dt>Your role</dt>
									<dd>Owner</dd>
								</div>
							</dl>
						</Card.Content>
					</Card>
				</ContentSection.Content>
			</ContentSection>
			<Text tone="muted">
				Contact your workspace owner if you need a different role.
			</Text>
		</div>
	),
	play: async ({ canvas, canvasElement }) => {
		await expect(
			canvasElement.querySelectorAll('[data-slot="card"]'),
		).toHaveLength(2);
		for (const title of ["Organization identity", "People and access"]) {
			const section = canvas
				.getByRole("heading", { name: title })
				.closest('[data-slot="content-section"]');
			if (!section) throw new Error("Missing section");
			await expect(
				canvas
					.getByRole("heading", { name: title })
					.closest('[data-slot="card"]'),
			).toBeNull();
			await expect(section.querySelectorAll('[data-slot="card"]')).toHaveLength(
				1,
			);
			await expect(
				section.querySelector('[data-slot="card-header"]'),
			).toBeNull();
			for (const property of section.querySelectorAll<HTMLElement>("dt, dd")) {
				await expect(
					section.querySelector('[data-slot="card"]'),
				).toContainElement(property);
			}
		}
		await expect(
			canvasElement.querySelector('[data-slot="card"] [data-slot="card"]'),
		).toBeNull();
		await expect(
			canvas
				.getByText("Contact your workspace owner if you need a different role.")
				.closest('[data-slot="card"]'),
		).toBeNull();
	},
};

export const ElevationLadder: Story = {
	render: () => (
		<section
			aria-label="Surface elevation ladder"
			className="grid gap-8 bg-background p-6 sm:p-8"
			data-surface-role="page"
		>
			<div className="grid gap-2">
				<Text as="h2" variant="headingSm">
					Page, Panel, Card, and Float
				</Text>
				<Text tone="muted" variant="support">
					Quiet shell, soft page canvas, lifted cards, and brighter floating
					chrome.
				</Text>
			</div>
			<div className="grid items-stretch gap-4 lg:grid-cols-4">
				<section
					aria-label="Page level"
					className="grid min-h-40 content-start gap-1 border border-dashed border-border bg-background p-4"
					data-surface-role="page"
				>
					<Text variant="bodyStrong">Page</Text>
					<Text tone="muted" variant="support">
						Canvas · no radius · no shadow
					</Text>
				</section>
				<Panel aria-label="Panel level" padding="sm">
					<Text variant="bodyStrong">Panel</Text>
					<Text tone="muted" variant="support">
						Quiet shell / grouping · shadow-none
					</Text>
				</Panel>
				<Card aria-label="Card level">
					<Card.Header>
						<Card.Title>Card</Card.Title>
						<Card.Description>Structured unit · shadow-xs</Card.Description>
					</Card.Header>
					<Card.Content>
						Card elevation stays independent of slots.
					</Card.Content>
				</Card>
				<Float aria-label="Float level" padding="sm">
					<div className="grid gap-1">
						<Text variant="bodyStrong">Float</Text>
						<Text tone="muted" variant="support">
							Temporary chrome · shadow-md
						</Text>
					</div>
				</Float>
			</div>
			<Panel className="relative min-h-72" padding="lg">
				<Text tone="muted" variant="support">
					Staggered hierarchy
				</Text>
				<Card className="max-w-xl">
					<Card.Content className="grid gap-2">
						<Card.Title as="h3">Structured work</Card.Title>
						<Card.Description>
							A Card remains identifiable inside a Panel.
						</Card.Description>
					</Card.Content>
				</Card>
				<Float className="absolute top-16 right-8" padding="sm">
					<Text variant="support">Floating context</Text>
				</Float>
				<div className="absolute right-8 bottom-8 w-56">
					<Card aria-label="Overlay level" elevation="overlay" size="sm">
						<Card.Content className="grid gap-1">
							<Card.Title as="h3">Overlay context</Card.Title>
							<Card.Description>Card structure · shadow-lg</Card.Description>
						</Card.Content>
					</Card>
				</div>
			</Panel>
		</section>
	),
	play: async ({ canvas }) => {
		const ladder = canvas.getByLabelText("Surface elevation ladder");
		await expect(ladder).toHaveAttribute("data-surface-role", "page");
		const page = canvas.getByLabelText("Page level");
		await expect(page).toHaveAttribute("data-surface-role", "page");
		await expect(page).not.toHaveAttribute("data-elevation");
		const panel = canvas.getByLabelText("Panel level");
		await expect(panel).toHaveAttribute("data-elevation", "panel");
		await expect(panel).toHaveClass("shadow-none");
		const card = canvas.getByLabelText("Card level");
		await expect(card).toHaveAttribute("data-elevation", "card");
		await expect(card).toHaveClass("shadow-xs");
		await expect(getComputedStyle(card).borderRadius).toBe("14px");
		await expect(getComputedStyle(panel).backgroundColor).not.toBe(
			getComputedStyle(page).backgroundColor,
		);
		const dark = Boolean(page.closest(".dark"));
		await expect(getComputedStyle(card).backgroundColor).not.toBe(
			getComputedStyle(panel).backgroundColor,
		);
		const float = canvas.getByLabelText("Float level");
		await expect(float).toHaveAttribute("data-elevation", "float");
		await expect(float).toHaveClass("shadow-md");
		await expect(getComputedStyle(float).backgroundColor).not.toBe(
			getComputedStyle(card).backgroundColor,
		);
		// Fill hierarchy must survive theme changes without relying on shadows.
		const luminance = (element: HTMLElement) => {
			const channels =
				getComputedStyle(element).backgroundColor.match(/[\d.]+/g);
			if (!channels || channels.length < 3)
				throw new Error("Missing surface fill");
			const [r, g, b] = channels.slice(0, 3).map((value) => {
				const channel = Number(value) / 255;
				return channel <= 0.04045
					? channel / 12.92
					: ((channel + 0.055) / 1.055) ** 2.4;
			});
			return 0.2126 * r + 0.7152 * g + 0.0722 * b;
		};
		if (dark) {
			await expect(luminance(page)).toBeLessThan(luminance(card));
		} else {
			await expect(luminance(panel)).toBeLessThan(luminance(card));
			await expect(luminance(card)).toBeLessThan(luminance(page));
		}
		await expect(luminance(card)).toBeLessThan(luminance(float));
		const overlay = canvas.getByLabelText("Overlay level");
		await expect(overlay).toHaveAttribute("data-surface-role", "card");
		await expect(overlay).toHaveAttribute("data-elevation", "overlay");
		await expect(overlay).toHaveClass("shadow-lg");
		await expect(getComputedStyle(overlay).backgroundColor).toBe(
			getComputedStyle(card).backgroundColor,
		);
	},
};

export const DarkElevationLadder: Story = {
	...ElevationLadder,
	globals: { appearance: "dark" },
};

export const StructureAndElevation: Story = {
	render: () => (
		<div className="grid gap-4 lg:grid-cols-3">
			{(["card", "float", "overlay"] as const).map((elevation) => (
				<Card
					aria-label={`${elevation} elevation card`}
					elevation={elevation}
					key={elevation}
				>
					<Card.Header>
						<Card.Title className="capitalize">{elevation}</Card.Title>
						<Card.Description>
							Card structure at {elevation} elevation.
						</Card.Description>
					</Card.Header>
					<Card.Content>Slots and padding remain Card-owned.</Card.Content>
				</Card>
			))}
		</div>
	),
	play: async ({ canvas }) => {
		for (const elevation of ["card", "float", "overlay"] as const) {
			const card = canvas.getByLabelText(`${elevation} elevation card`);
			await expect(card).toHaveAttribute("data-surface-role", "card");
			await expect(card).toHaveAttribute("data-elevation", elevation);
		}
	},
};

export const PanelLayoutAndSemanticAccent: Story = {
	render: () => (
		<Panel accent="warning" columns={3} gap="sm" padding="sm">
			<Text>First</Text>
			<Text>Second</Text>
			<Text>Third</Text>
		</Panel>
	),
};

export const PolymorphicPanel: Story = {
	render: () => (
		<Panel as="aside" aria-label="Context panel">
			Supporting context
		</Panel>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole("complementary", { name: "Context panel" }),
		).toBeVisible();
	},
};

export const PersistentShellChrome: Story = {
	render: () => (
		<div className="grid overflow-hidden border border-border">
			<Panel
				as="header"
				aria-label="Surface-backed header chrome"
				background="panel"
				border="none"
				className="border-b border-border"
				display="flex"
				gap="none"
				padding="sm"
				radius="none"
			>
				<Text variant="bodyStrong">Persistent header</Text>
			</Panel>
			<div className="grid min-h-56 grid-cols-[12rem_1fr]">
				<Panel
					as="aside"
					aria-label="Panel-backed sidebar chrome"
					background="panel"
					border="none"
					className="border-r border-border"
					display="flex"
					gap="sm"
					padding="sm"
					radius="none"
				>
					<Text variant="bodyStrong">Sidebar</Text>
					<Text tone="muted" variant="support">
						Broad persistent grouping
					</Text>
				</Panel>
				<div className="bg-background p-4">
					<Text tone="muted" variant="support">
						Page content remains the canvas.
					</Text>
				</div>
			</div>
		</div>
	),
	play: async ({ canvas }) => {
		for (const name of [
			"Surface-backed header chrome",
			"Panel-backed sidebar chrome",
		]) {
			const surface = canvas.getByLabelText(name);
			await expect(surface).toHaveAttribute("data-surface-role", "panel");
			await expect(surface).toHaveAttribute("data-elevation", "panel");
			await expect(surface).toHaveClass("rounded-none", "shadow-none");
		}
	},
};

export const StructuredCard: Story = {
	render: () => (
		<Card aria-label="Workspace access card" className="max-w-xl">
			<Card.Header accent="neutral">
				<Card.Title>Workspace access</Card.Title>
				<Card.Description>Manage who can open this project.</Card.Description>
				<Card.Action>
					<Button size="sm">Invite</Button>
				</Card.Action>
			</Card.Header>
			<Card.Content>Three members currently have access.</Card.Content>
			<Card.Footer accent="neutral">
				<Button variant="primary">Save changes</Button>
			</Card.Footer>
		</Card>
	),
	play: async ({ canvas }) => {
		const card = canvas.getByLabelText("Workspace access card");
		const content = card.querySelector('[data-slot="card-content"]');
		const header = card.querySelector('[data-slot="card-header"]');
		const matchingFooter = card.querySelector('[data-slot="card-footer"]');
		if (!header || !matchingFooter) throw new Error("Missing card chrome");
		await expect(getComputedStyle(header).borderBottomColor).toBe(
			getComputedStyle(card).borderTopColor,
		);
		await expect(getComputedStyle(matchingFooter).borderTopColor).toBe(
			getComputedStyle(card).borderTopColor,
		);

		const footer = card.querySelector('[data-slot="card-footer"]');
		const headerAction = card.querySelector('[data-slot="card-action"]');
		const invite = canvas.getByRole("button", { name: "Invite" });
		const save = canvas.getByRole("button", { name: "Save changes" });

		await expect(headerAction).toContainElement(invite);
		await expect(footer).toContainElement(save);
		await expect(content).not.toContainElement(save);
	},
};

export const ReusableCardHeading: Story = {
	render: () => (
		<Card aria-label="Reusable heading card" className="max-w-xl">
			<Card.Heading
				action={
					<Button size="sm" variant="primary">
						Invite member
					</Button>
				}
				actionLayout="responsive"
				description="The identity and context of this self-contained item."
				title="People and access"
			/>
			<Card.Content>Three members currently have access.</Card.Content>
		</Card>
	),
	play: async ({ canvas }) => {
		const card = canvas.getByLabelText("Reusable heading card");
		const heading = card.querySelector("[data-card-heading]");
		await expect(heading).toHaveAttribute("data-slot", "card-header");
		await expect(heading).toHaveClass(
			"!grid-cols-1",
			"sm:!grid-cols-[1fr_auto]",
		);
		await expect(
			heading?.querySelector('[data-slot="card-title"]'),
		).toHaveTextContent("People and access");
		await expect(
			heading?.querySelector('[data-slot="card-description"]'),
		).toHaveTextContent("The identity and context");
		const action = heading?.querySelector('[data-slot="card-action"]');
		await expect(action).toContainElement(
			canvas.getByRole("button", { name: "Invite member" }),
		);
		await expect(action).toHaveClass(
			"!col-start-1",
			"sm:!col-start-2",
			"sm:justify-self-end",
		);
	},
};

export const CompactSemanticAccent: Story = {
	render: () => (
		<Card accent="warning" className="max-w-md" size="sm">
			<Card.Header accent="warning">
				<Card.Title as="h3">Review required</Card.Title>
				<Card.Description>
					Confirm the billing contact before renewal.
				</Card.Description>
			</Card.Header>
			<Card.Content>Renewal is scheduled for Friday.</Card.Content>
		</Card>
	),
};

export const CardSpacingTopology: Story = {
	render: () => (
		<div className="grid gap-4 md:grid-cols-2">
			<Card aria-label="Header and footer card">
				<Card.Header>
					<Card.Title>Ready to publish</Card.Title>
				</Card.Header>
				<Card.Footer>
					<Button variant="primary">Publish</Button>
				</Card.Footer>
			</Card>
			<Card aria-label="Custom spacing card" gap="sm" padding="sm">
				<Card.Header>
					<Card.Title>Custom outer spacing</Card.Title>
				</Card.Header>
				<Card.Content>Slot identity remains Card-owned.</Card.Content>
				<Card.Footer>Footer behavior still detects content.</Card.Footer>
			</Card>
		</div>
	),
	play: async ({ canvas }) => {
		const headerFooterCard = canvas.getByLabelText("Header and footer card");
		await expect(
			headerFooterCard.querySelector('[data-slot="card-content"]'),
		).toBeNull();
		const customCard = canvas.getByLabelText("Custom spacing card");
		await expect(customCard).toHaveAttribute("data-slot", "card");
		await expect(
			customCard.querySelector('[data-slot="card-header"]'),
		).toBeVisible();
		await expect(
			customCard.querySelector('[data-slot="card-content"]'),
		).toBeVisible();
		await expect(
			customCard.querySelector('[data-slot="card-footer"]'),
		).toBeVisible();
	},
};

export const BehaviorFreeFloat: Story = {
	render: () => (
		<Float as="aside" aria-label="Static floating context" padding="sm">
			<div className="grid gap-1">
				<Text variant="bodyStrong">Pinned context</Text>
				<Text tone="muted" variant="support">
					Positioning, focus, and dismissal belong to the consuming overlay.
				</Text>
			</div>
		</Float>
	),
	play: async ({ canvas }) => {
		const surface = canvas.getByRole("complementary", {
			name: "Static floating context",
		});
		await expect(surface).toHaveAttribute("data-slot", "float");
		await expect(surface).toHaveAttribute("data-surface-role", "float");
		await expect(surface).not.toHaveAttribute("role", "dialog");
	},
};
