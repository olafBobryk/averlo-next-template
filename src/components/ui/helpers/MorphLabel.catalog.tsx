"use client";

import { useState } from "react";
import { defineCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { MorphLabel } from "./MorphLabel";

export const morphLabelPairs = [
	["Copy details", "Copied"],
	["Save", "Saved to drafts"],
	["Continue", "Book a call"],
] as const;

/** Plain buttons whose labels morph between two strings. */
export function MorphLabelExample() {
	const [swapped, setSwapped] = useState<Record<number, boolean>>({});
	return (
		<div className="flex flex-wrap gap-3">
			{morphLabelPairs.map((pair, index) => (
				<button
					key={pair[0]}
					type="button"
					data-testid={`morph-${index}`}
					className="inline-flex h-9 items-center rounded-full border border-border px-4 text-sm font-medium"
					onClick={() =>
						setSwapped((current) => ({ ...current, [index]: !current[index] }))
					}
				>
					<MorphLabel>{swapped[index] ? pair[1] : pair[0]}</MorphLabel>
				</button>
			))}
		</div>
	);
}

export const catalogContract = defineCatalogOwnerContract({
	id: "ui-helpers-morph-label",
	name: "MorphLabel",
	family: "UI",
	group: "Helpers",
	role: "Sequenced text swap for a control label whose box eases to the new text's width.",
	importStatement:
		'import { MorphLabel } from "@/components/ui/helpers/MorphLabel";',
	chooseWhen: [
		"A control's one-line string label changes in place (Copy → Copied, Save → Saving…).",
		"Button already uses it for string children; reach for it directly only in custom controls.",
	],
	chooseInstead: [
		"Use IconSwap for the icon, ContentPresence for content entering or leaving the flow.",
	],
	compounds: [],
	exclusions: [
		"Rich or multi-line content; children are one string.",
		"Simultaneous width-and-text swaps that cut visible glyphs at the moving edge.",
		"Caller-side motion gating; reduced motion and `?motion=off` snap internally.",
	],
	guarantees: [
		{
			label: "No visible glyph outside the box while growing or shrinking",
			storyId: "ui-helpers-morph-label--sequenced-swap",
		},
		{
			label: "Reduced motion snaps",
			storyId: "ui-helpers-morph-label--reduced-motion",
		},
	],
	previewTargets: [
		{
			id: "sequenced-swap",
			name: "Sequenced swap",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: MorphLabelExample,
		},
	],
});
