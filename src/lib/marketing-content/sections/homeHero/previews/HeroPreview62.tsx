"use client";
// Native specimen adapted from @/components/ui/misc/InspectableImage.catalog.
import { type ComponentType, createElement } from "react";
import { InspectableImage } from "@/components/ui/misc/InspectableImage";
import heroImage0 from "../../../../../../public/test/placeholder-square.jpg";

function CatalogPreview1() {
	return createElement(
		InspectableImage as unknown as ComponentType<Record<string, unknown>>,
		{
			...{},
			...{
				src: heroImage0.src,
				blurDataURL: heroImage0.blurDataURL,
				alt: "Overlapping charcoal and coral shapes",
				width: 480,
				height: 320,
				className: "h-56 w-80 overflow-hidden rounded-xl",
			},
		},
	);
}
export default CatalogPreview1;
