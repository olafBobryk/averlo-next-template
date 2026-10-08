"use client";

import { defineCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Button } from "../Button";
import { Text } from "../Text";
import { Card, ContentSection, Float, Panel } from ".";

function CatalogPreview1() {
	const render = () => (
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
	);
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}
function CatalogPreview2() {
	const render = () => (
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
	);
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}
function CatalogPreview3() {
	const render = () => (
		<Panel accent="warning" columns={3} gap="sm" padding="sm">
			<Text>First</Text>
			<Text>Second</Text>
			<Text>Third</Text>
		</Panel>
	);
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}
function CatalogPreview4() {
	const render = () => (
		<Card className="max-w-xl">
			<Card.Header>
				<Card.Title>Workspace access</Card.Title>
				<Card.Description>Manage who can open this project.</Card.Description>
				<Card.Action>
					<Button size="sm">Invite</Button>
				</Card.Action>
			</Card.Header>
			<Card.Content>Three members currently have access.</Card.Content>
			<Card.Footer>
				<Button variant="primary">Save changes</Button>
			</Card.Footer>
		</Card>
	);
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}
function CatalogPreview5() {
	const render = () => (
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
	);
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}
function CatalogPreview6() {
	const render = () => (
		<Float as="aside" aria-label="Static floating context" padding="sm">
			<div className="grid gap-1">
				<Text variant="bodyStrong">Pinned context</Text>
				<Text tone="muted" variant="support">
					Positioning, focus, and dismissal belong to the consuming overlay.
				</Text>
			</div>
		</Float>
	);
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}
function CatalogPreview7() {
	const render = () => (
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
	);
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}
function CatalogPreview8() {
	const render = () => (
		<Card className="max-w-xl">
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
	);
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}

function ContentHierarchyPreview() {
	return (
		<ContentSection>
			<ContentSection.Heading
				title="Organization identity"
				description="Keep the heading outside one card containing the related properties."
			/>
			<ContentSection.Content>
				<Card>
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
	);
}

export const catalogContract = defineCatalogOwnerContract({
	id: "ui-primitives-surfaces",
	name: "Surfaces",
	role: "Page hierarchy with unboxed ContentSection groups, persistent Panel chrome, self-contained Cards, and temporary Floats.",
	importStatement:
		'import { Card, ContentSection, Float, Panel, type CardHeadingProps, type CardProps, type FloatProps, type PanelProps, type SurfaceBackground, type SurfaceElevation, type SurfaceRadius } from "@/components/ui/primitives/surfaces";',
	chooseWhen: [
		"Paper aliases the soft page canvas. Panels use a quieter neutral fill; cards lift grouped content; floats have the brightest fill. Inputs and buttons share the same restrained neutral family. Default cards retain shadow-xs elevation and 14px corners.",
		"Use text-only ContentSection headings for page hierarchy, with descriptions, actions, and grouped content on the canvas. Do not add decorative heading icons. Place one Card beneath the heading for a cohesive property or control group; plain prose and layout remain unboxed.",
		"Use Panel for persistent application chrome, Card for related properties/controls or a self-contained record, result, or preview, and Float for temporary chrome with a distinct raised fill. Modals retain Card fill at overlay elevation. Neutral card headers and footers use a subtle shared chrome fill and matching card-border divider in light mode; table labels and page counts use dedicated readable chrome ink. Card.Header is optional: use it for item identity, never repeat the external section heading.",
		"Use SurfaceBackground, SurfaceRadius, and SurfaceElevation when another owner needs to forward the shared semantic chrome contract.",
	],
	chooseInstead: [
		"Use Section for page flow, a complete overlay owner for portal and interaction behavior, and existing controls or status components for their narrower semantics.",
	],
	compounds: [
		"ContentSection",
		"ContentSection.Heading",
		"ContentSection.Header",
		"ContentSection.Title",
		"ContentSection.Description",
		"ContentSection.Action",
		"ContentSection.Content",
		"ContentSection.Footer",
		"Panel",
		"Card",
		"Card.Header",
		"Card.Heading",
		"Card.Title",
		"Card.Description",
		"Card.Action",
		"Card.Content",
		"Card.Footer",
		"Float",
	],
	exclusions: [
		"A Page React component; Page is the application canvas.",
		"A card per property or nested cards used only for spacing; removing all property-group cards in the name of reducing card usage.",
		"Portal, focus, positioning, dismissal, or modal behavior inside Float.",
		"Generic numeric radius and shadow sizes outside the semantic surface vocabulary.",
	],
	guarantees: [
		{
			label: "External headings with cohesive property cards",
			storyId: "ui-primitives-surfaces--content-hierarchy",
		},
		{
			label: "Dark surface separation",
			storyId: "ui-primitives-surfaces--dark-elevation-ladder",
		},
		{
			label: "Elevation ladder",
			storyId: "ui-primitives-surfaces--elevation-ladder",
		},
		{
			label: "Structure and elevation",
			storyId: "ui-primitives-surfaces--structure-and-elevation",
		},
		{
			label: "Panel layout and semantic accent",
			storyId: "ui-primitives-surfaces--panel-layout-and-semantic-accent",
		},
		{
			label: "Structured Card slots and footer actions",
			storyId: "ui-primitives-surfaces--structured-card",
		},
		{
			label: "Card spacing topology",
			storyId: "ui-primitives-surfaces--card-spacing-topology",
		},
		{
			label: "Behavior-free Float",
			storyId: "ui-primitives-surfaces--behavior-free-float",
		},
		{
			label: "Persistent shell chrome",
			storyId: "ui-primitives-surfaces--persistent-shell-chrome",
		},
		{
			label: "Reusable Card heading",
			storyId: "ui-primitives-surfaces--reusable-card-heading",
		},
	],

	family: "UI",
	group: "Primitives",
	sweepSpan: "full",
	previewTargets: [
		{
			id: "content-hierarchy",
			name: "Content hierarchy",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: ContentHierarchyPreview,
		},
		{
			id: "elevation-ladder",
			name: "Elevation ladder",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview1,
		},
		{
			id: "structure-and-elevation",
			name: "Structure and elevation",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview2,
		},
		{
			id: "panel-layout-and-semantic-accent",
			name: "Panel layout and semantic accent",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview3,
		},
		{
			id: "structured-card",
			name: "Structured Card slots",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview4,
		},
		{
			id: "card-spacing-topology",
			name: "Card spacing topology",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview5,
		},
		{
			id: "behavior-free-float",
			name: "Behavior-free Float",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview6,
		},
		{
			id: "persistent-shell-chrome",
			name: "Persistent shell chrome",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview7,
		},
		{
			id: "reusable-card-heading",
			name: "Reusable Card heading",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview8,
		},
	],
});
