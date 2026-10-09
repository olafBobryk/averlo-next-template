"use client";
// Native specimen adapted from @/components/ui/misc/SegmentedControl.catalog.
import { type ComponentType, createElement } from "react";
import { SegmentedControl } from "@/components/ui/misc/SegmentedControl";

const options = [
	{ value: "day", label: "Day" },
	{ value: "week", label: "Week" },
	{ value: "month", label: "Month", disabled: true },
] as const;
function CatalogPreview1() {
	return createElement(
		SegmentedControl as unknown as ComponentType<Record<string, unknown>>,
		{
			...{
				options,
				defaultValue: "day",
				onChange: () => undefined,
				ariaLabel: "Report period",
			},
			...{},
		},
	);
}
export default CatalogPreview1;
