"use client";

import { defineCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { ScrollArea } from "./ScrollArea";

const rows = Array.from({ length: 12 }, (_, index) => `Result ${index + 1}`);

function FadePreview() {
	return (
		<div className="w-72 overflow-hidden rounded-xl border border-border bg-card">
			<ScrollArea className="h-40" edge={8} tabIndex={0}>
				{rows.map((row) => (
					<div className="px-3 py-2 text-sm" key={row}>
						{row}
					</div>
				))}
			</ScrollArea>
		</div>
	);
}

function BorderPreview() {
	return (
		<ScrollArea
			className="h-40 w-72"
			edge={0}
			edgeStyle="border"
			showBackToTop
			tabIndex={0}
		>
			{rows.map((row) => (
				<div className="border-b border-border p-3 text-sm" key={row}>
					{row}
				</div>
			))}
		</ScrollArea>
	);
}

function HorizontalPreview() {
	const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"];
	return (
		<div className="w-72 overflow-hidden rounded-xl border border-border bg-card">
			<ScrollArea axis="x" edge={12} tabIndex={0}>
				<div className="flex w-max gap-3 py-3">
					{items.map((item) => (
						<div
							className="grid h-24 w-32 place-items-center rounded-lg border border-border bg-surface"
							key={item}
						>
							{item}
						</div>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}

export const catalogContract = defineCatalogOwnerContract({
	id: "ui-misc-scroll-area",
	name: "ScrollArea",
	role: "The inner scroller owner: it runs to the surface edge, absorbs that gap as padding, contains overscroll and fades (or rules) content only while it is hidden past an edge.",
	importStatement: 'import { ScrollArea } from "@/components/ui/misc";',
	chooseWhen: [
		"Content scrolls inside a card, modal, menu, popover, listbox or overlay.",
		"A constrained region needs an overflow cue: a fade under the edge, or an inset rule with an optional back-to-top button.",
		"A tab row scrolls horizontally and hides its scrollbar.",
	],
	chooseInstead: [
		"Use ordinary document scrolling for page-level content; page carousels bleed to the viewport with their own snap classes and no fade.",
	],
	compounds: [],
	exclusions: [
		"Hand-written overflow-*-auto scrollers, scroll shadows and custom back-to-top overlays.",
	],
	guarantees: [
		{
			label: "Fade only while content is hidden past an edge",
			storyId: "ui-misc-scroll-area--fade-edges",
		},
		{
			label: "One item and max height both run edge to edge",
			storyId: "ui-misc-scroll-area--edge-to-edge-at-every-height",
		},
		{
			label: "Border rule never shifts layout",
			storyId: "ui-misc-scroll-area--border-without-layout-shift",
		},
		{
			label: "Horizontal LTR and RTL edges",
			storyId: "ui-misc-scroll-area--horizontal-rtl-edges",
		},
	],

	family: "UI",
	group: "Misc",
	previewTargets: [
		{
			id: "fade-edges",
			name: "Fade under the edge",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: FadePreview,
		},
		{
			id: "border-without-layout-shift",
			name: "Border rule",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: BorderPreview,
		},
		{
			id: "horizontal-rtl-edges",
			name: "Horizontal",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: HorizontalPreview,
		},
	],
});
