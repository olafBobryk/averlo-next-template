"use client";
// Native specimen adapted from @/components/ui/misc/PaginationControls.catalog.
import { type ComponentType, createElement } from "react";
import { PaginationControls } from "@/components/ui/misc/PaginationControls";

function CatalogPreview1() {
	return createElement(
		PaginationControls as unknown as ComponentType<Record<string, unknown>>,
		{
			...{
				current: 2,
				total: 5,
				onPrev: () => undefined,
				onNext: () => undefined,
			},
			...{},
		},
	);
}
export default CatalogPreview1;
