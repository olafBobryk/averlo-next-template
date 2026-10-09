"use client";
// Native specimen adapted from @/components/ui/misc/accordion/Accordion.catalog.
import { type ComponentType, createElement } from "react";
import { Accordion } from "@/components/ui/misc/accordion/Accordion";

function CatalogPreview1() {
	return createElement(
		Accordion as unknown as ComponentType<Record<string, unknown>>,
		{
			...{},
			...{
				title: "Billing details",
				description: "Invoice and tax information",
				onOpenChange: () => undefined,
				children: <p>Billing content</p>,
				forceReducedMotion: true,
			},
		},
	);
}
export default CatalogPreview1;
