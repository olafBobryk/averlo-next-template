"use client";
import { useState } from "react";
import { Button } from "@/components/ui/primitives/Button";
import { defineCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { ContentPresence } from "./index";

export function PresenceExample({ axis = "y" }: { axis?: "x" | "y" }) {
	const [open, setOpen] = useState(true);
	const [expanded, setExpanded] = useState(false);
	return (
		<div className="grid max-w-lg gap-3">
			<div className="flex gap-2">
				<Button
					aria-expanded={open}
					aria-controls={`presence-${axis}`}
					onClick={() => setOpen(!open)}
				>
					Toggle content
				</Button>
				<Button variant="ghost" onClick={() => setExpanded(!expanded)}>
					Change content
				</Button>
			</div>
			<div className={axis === "x" ? "flex items-center" : ""}>
				<ContentPresence
					id={`presence-${axis}`}
					open={open}
					axis={axis}
					gapBefore="0.75rem"
					gapAfter="0.75rem"
					offsetY={4}
				>
					<div className="rounded-lg bg-muted p-3">
						<p>Additional options</p>
						{expanded && <p>More details are now available.</p>}
						<Button size="sm">Apply option</Button>
					</div>
				</ContentPresence>
				<p>Following content</p>
			</div>
		</div>
	);
}

export const catalogContract = defineCatalogOwnerContract({
	id: "ui-motion-content-presence",
	name: "ContentPresence",
	family: "UI",
	group: "Motion",
	role: "Controlled conditional content and its occupied layout space.",
	importStatement:
		'import { ContentPresence } from "@/components/ui/motion/presence";',
	chooseWhen: [
		"A conditional region enters or leaves normal flow, vertically or horizontally.",
		"Use zero gaps by default; let this owner animate any requested before/after spacing.",
	],
	chooseInstead: [
		"Use Accordion for an interactive disclosure, MotionSource/Effect for viewport or scroll reveals.",
	],
	compounds: [],
	exclusions: [
		"Disclosure controls, focus management, and announcement semantics: these belong to the caller.",
		"Parent gaps that duplicate this component’s spacing.",
		"A second global motion scheduler or local timing system.",
	],
	guarantees: [
		{
			label: "Vertical presence, resize and removal",
			storyId: "ui-motion-content-presence--vertical",
		},
		{
			label: "Horizontal presence",
			storyId: "ui-motion-content-presence--horizontal",
		},
		{
			label: "Rapid reversal",
			storyId: "ui-motion-content-presence--interruption",
		},
		{
			label: "Motion-off content access",
			storyId: "ui-motion-content-presence--motion-off",
		},
	],
	previewTargets: [
		{
			id: "axes",
			name: "Layout axes",
			baseline: { axis: "y" },
			axes: [
				{
					id: "axis",
					label: "Axis",
					values: [
						{ id: "y", label: "Vertical", value: "y" },
						{ id: "x", label: "Horizontal", value: "x" },
					],
				},
			],
			stage: "standard",
			Render: ({ coordinate }) => (
				<PresenceExample axis={coordinate.axis as "x" | "y"} />
			),
		},
	],
});
