"use client";
// Native specimen adapted from @/components/ui/misc/Tooltip.catalog.
import { type ComponentType, createElement } from "react";
import { Tooltip } from "@/components/ui/misc/Tooltip";

function CatalogPreview1() {
	return createElement(
		Tooltip as unknown as ComponentType<Record<string, unknown>>,
		{
			...{},
			...{
				content: "Copies the public URL",
				children: <button type="button">Share</button>,
				width: 260,
			},
		},
	);
}
export default CatalogPreview1;
