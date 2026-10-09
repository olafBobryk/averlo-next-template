"use client";
// Native specimen adapted from @/components/ui/misc/StepIndicator.catalog.
import { type ComponentType, createElement } from "react";
import { StepIndicator } from "@/components/ui/misc/StepIndicator";

const steps = [
	{ id: "details", label: "Details" },
	{ id: "review", label: "Review" },
	{ id: "publish", label: "Publish", disabled: true },
] as const;
function CatalogPreview1() {
	return createElement(
		StepIndicator as unknown as ComponentType<Record<string, unknown>>,
		{
			...{ currentStep: "review", steps, onStepChange: () => undefined },
			...{},
		},
	);
}
export default CatalogPreview1;
