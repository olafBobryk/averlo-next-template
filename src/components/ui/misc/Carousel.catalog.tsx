"use client";

import { Panel } from "@/components/ui/primitives/surfaces";
import { Text } from "@/components/ui/primitives/Text";
import { defineCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Carousel } from "./Carousel";

const items = ["Strategy", "Design", "Delivery"].map((label, index) => ({
	content: (
		<Panel className="grid min-h-64 content-between" padding="md">
			<Text as="h3" variant="headingMd">
				{label}
			</Text>
			<Text tone="muted">Slide {index + 1}</Text>
		</Panel>
	),
	id: label.toLowerCase(),
	label,
}));

function CarouselPreview() {
	return <Carousel ariaLabel="Delivery phases" items={items} />;
}

export const catalogContract = defineCatalogOwnerContract({
	id: "ui-misc-carousel",
	name: "Carousel",
	role: "Bounded horizontal item carousel with direction-aware snapping, pointer and keyboard navigation, dot pagination, and an optional wide-grid presentation.",
	importStatement: 'import { Carousel } from "@/components/ui/misc";',
	chooseWhen: [
		"A responsive surface needs caller-rendered items to snap against a stable left edge with direct pagination.",
		"One semantic item collection should become a static grid once the caller-selected wide breakpoint has enough room for every card.",
	],
	chooseInstead: [
		"Use ImageSwitcher for a single framed image carousel with preload and image-transition ownership.",
		"Use a grid or list when all items should remain simultaneously visible or directly scrollable.",
	],
	compounds: ["Carousel"],
	exclusions: [
		"Looping, autoplay, vertical tracks, centered-slide geometry, virtualized slides, or a general slider plugin API.",
		"Different compact and wide content, ordering, or motion treatments; callers own separate compositions when the same item tree cannot serve both presentations.",
	],
	guarantees: [
		{
			label: "Left-gutter alignment and direct pagination",
			storyId: "ui-misc-carousel--left-gutter-and-pagination",
		},
		{
			label: "Contained presentation without a section gutter",
			storyId: "ui-misc-carousel--without-section-gutter",
		},
		{
			label: "Responsive carousel-to-grid presentation",
			storyId: "ui-misc-carousel--responsive-grid-at-wide",
		},
		{
			label: "RTL snapping and directional keyboard navigation",
			storyId: "ui-misc-carousel--right-to-left-keyboard-navigation",
		},
	],
	family: "UI",
	group: "Misc",
	sweepSpan: "full",
	previewTargets: [
		{
			id: "left-gutter-pagination",
			name: "Left-gutter carousel",
			baseline: {},
			axes: [],
			stage: "wide",
			Render: CarouselPreview,
		},
	],
});
