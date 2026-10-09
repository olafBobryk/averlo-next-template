"use client";
// Native specimen adapted from @/components/ui/misc/CopyField.catalog.
import { type ComponentType, createElement } from "react";
import { CopyField } from "@/components/ui/misc/CopyField";

function CatalogPreview1() {
	return createElement(
		CopyField as unknown as ComponentType<Record<string, unknown>>,
		{
			...{},
			...{
				value: "averlo.example/invite",
				toastMessage: false,
				onCopy: () => undefined,
			},
		},
	);
}
export default CatalogPreview1;
