"use client";
import { Carousel } from "@/components/ui/misc/Carousel";
// Native specimen adapted from @/components/ui/misc/Carousel.catalog.
import { Panel } from "@/components/ui/primitives/surfaces";
import { Text } from "@/components/ui/primitives/Text";

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
export default CarouselPreview;
