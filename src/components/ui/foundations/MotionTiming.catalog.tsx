"use client";

import { defineCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { motionSteps, motionTiming } from "./motionTiming";
import { spring } from "./spring";

export function MotionStepTable() {
	return (
		<table className="text-left text-sm" data-testid="step-table">
			<thead>
				<tr>
					<th className="pr-4">Step</th>
					<th className="pr-4">Duration</th>
					<th className="pr-4">CSS token</th>
					<th>Spring k / c / m</th>
				</tr>
			</thead>
			<tbody>
				{motionSteps.map((step) => (
					<tr data-step={step} key={step}>
						<td className="pr-4">{step}</td>
						<td className="pr-4" data-cell="duration">
							{String(motionTiming[step].duration)}
						</td>
						<td className="pr-4">
							<code>{`--motion-${step}-duration`}</code>
						</td>
						<td data-cell="spring">
							{String(spring[step].stiffness)} / {String(spring[step].damping)}{" "}
							/ {String(spring[step].mass)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

function CatalogPreview2() {
	return (
		<dl className="grid grid-cols-2 gap-2">
			<dt>Quick type</dt>
			<dd data-testid="spring-type">{String(spring.quick.type)}</dd>
			<dt>Gentle stiffness</dt>
			<dd data-testid="spring-stiffness">{String(spring.gentle.stiffness)}</dd>
		</dl>
	);
}

export const catalogContract = defineCatalogOwnerContract({
	id: "ui-foundations-motion-timing",
	name: "Motion Timing and Spring",
	role: "Five character-named motion steps (snap, quick, smooth, gentle, slow): a spring for JS-driven motion and a matched duration and ease for CSS.",
	importStatement:
		'import { instantTransition, motionTiming } from "@/components/ui/foundations/motionTiming";\nimport { spring } from "@/components/ui/foundations/spring";',
	chooseWhen: [
		"A motion/react animation needs its step's spring, or a CSS interaction needs the step's motion-<step> class or --motion-<step>-* variables.",
	],
	chooseInstead: [
		"Use the owning component (ContentPresence, MorphLabel, IconSwap, Button) when it already animates the change.",
	],
	compounds: ["motionTiming", "spring", "instantTransition"],
	exclusions: ["Hard-coded page-local durations, easings and springs."],
	guarantees: [
		{
			label: "Step scale",
			storyId: "ui-foundations-motion-timing--step-scale",
		},
		{
			label: "Step springs",
			storyId: "ui-foundations-motion-timing--step-springs",
		},
	],

	family: "UI",
	group: "Foundations",
	previewTargets: [
		{
			id: "step-scale",
			name: "Step scale",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: MotionStepTable,
		},
		{
			id: "step-springs",
			name: "Step springs",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview2,
		},
	],
});
