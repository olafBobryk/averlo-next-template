"use client";
// Native specimen adapted from @/components/ui/time/DateIndicator.catalog.
import { type ComponentType, createElement } from "react";
import { DateIndicator } from "@/components/ui/time/DateIndicator";

function CatalogPreview1() {
	return createElement(
		DateIndicator as unknown as ComponentType<Record<string, unknown>>,
		{
			...{},
			...{
				date: "2025-01-13T12:00:00Z",
				interactive: false,
				leadingText: "Published",
				tone: "muted",
				variant: "caption",
			},
		},
	);
}
export default CatalogPreview1;
