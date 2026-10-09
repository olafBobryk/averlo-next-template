"use client";
// Native specimen adapted from @/components/ui/misc/ImageSwitcher.catalog.
import { type ComponentType, createElement } from "react";
import { ImageSwitcher } from "@/components/ui/misc/ImageSwitcher";
import heroImage0 from "../../../../../../public/test/placeholder-portrait.jpg";
import heroImage1 from "../../../../../../public/test/placeholder-square.jpg";

const images = [
	{
		src: heroImage0.src,
		blurDataURL: heroImage0.blurDataURL,
		alt: "Abstract blue portrait composition",
	},
	{
		src: heroImage1.src,
		blurDataURL: heroImage1.blurDataURL,
		alt: "Overlapping charcoal and coral shapes",
	},
] as const;
function CatalogPreview1() {
	return createElement(
		ImageSwitcher as unknown as ComponentType<Record<string, unknown>>,
		{
			...{
				images,
				intervalMs: 0,
				onIndexChange: () => undefined,
				frameClassName: "h-72",
			},
			...{},
		},
	);
}
export default CatalogPreview1;
