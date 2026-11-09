"use client";

import { useEffect } from "react";
import { defineCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Button } from "../primitives/Button";
import {
	useIntroDisableOverride,
	useMotionDisableOverride,
} from "./motionDisableOverride";

function OverrideEvidence() {
	const motionDisabled = useMotionDisableOverride();
	const introDisabled = useIntroDisableOverride();

	useEffect(
		() => () => {
			delete document.documentElement.dataset.motionOverride;
			delete document.documentElement.dataset.loadingOverride;
		},
		[],
	);

	return (
		<div className="grid gap-3">
			<output aria-live="polite">
				Motion {motionDisabled ? "disabled" : "enabled"}; intro{" "}
				{introDisabled ? "disabled" : "enabled"}
			</output>
			<Button
				onClick={() => {
					document.documentElement.dataset.motionOverride = "off";
					document.documentElement.dataset.loadingOverride = "off";
					window.dispatchEvent(new PopStateEvent("popstate"));
				}}
			>
				Apply automation overrides
			</Button>
		</div>
	);
}
function CatalogPreview1() {
	const render = () => <OverrideEvidence />;
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}

export const catalogContract = defineCatalogOwnerContract({
	id: "ui-foundations-motion-provider",
	name: "Motion Provider and Overrides",
	role: "Root owner of the motion driver and the one global scheduler, plus deterministic automation overrides.",
	importStatement:
		'import { MotionProvider } from "@/components/ui/foundations/MotionProvider";\nimport { useIntroDisableOverride, useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";',
	chooseWhen: [
		"The application root needs the motion driver and global scheduler, or code needs a test-friendly disable override.",
	],
	chooseInstead: [
		"Use spring or motionTiming from the foundations for a step's transition values.",
	],
	compounds: ["useMotionDisableOverride", "useIntroDisableOverride"],
	exclusions: ["GlobalMotionScheduler and other scheduler internals."],
	guarantees: [
		{
			label: "Automation override detection",
			storyId: "ui-foundations-motion-provider--automation-overrides",
		},
	],

	family: "UI",
	group: "Foundations",
	previewTargets: [
		{
			id: "automation-overrides",
			name: "Automation override detection",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview1,
		},
	],
});
