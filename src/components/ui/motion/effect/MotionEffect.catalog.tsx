"use client";

import { useState } from "react";
import { Button } from "@/components/ui/primitives/Button";
import { Panel } from "@/components/ui/primitives/surfaces";
import { defineCatalogOwnerContract } from "@/lib/component-catalog/contract";
import * as MotionSource from "../source";
import * as MotionEffect from "./index";

function EffectPreview() {
	const [active, setActive] = useState(true);
	return (
		<div className="grid max-w-3xl gap-5 p-6">
			<Button
				onClick={() => setActive((value) => !value)}
				size="sm"
				variant="secondary"
			>
				Toggle shared progress
			</Button>
			<MotionSource.Root
				className="grid gap-5"
				strategy={{ type: "boolean", active }}
			>
				<MotionEffect.TextStagger variant="headingMd">
					Text stagger
				</MotionEffect.TextStagger>
				<MotionEffect.TextHighlight className="text-xl">
					One source can drive every scalar effect.
				</MotionEffect.TextHighlight>
				<MotionEffect.Divider />
				<Panel padding="md">
					<MotionEffect.Number
						animation="countUp"
						className="text-4xl font-semibold"
						text="2048 builds"
					/>
				</Panel>
			</MotionSource.Root>
		</div>
	);
}

function StatRevealPreview() {
	return (
		<MotionSource.Root strategy={{ type: "boolean", active: true }}>
			<MotionEffect.TextStagger
				blurOffset="10px"
				className="font-medium"
				segments={[
					{ className: "text-2xl", text: "USD ", unit: "whole" },
					{
						className: "text-4xl",
						render: (text) => (
							<MotionEffect.Number range={[0.58, 1]} text={text} />
						),
						text: "250",
						unit: "whole",
					},
					{ className: "text-2xl", text: "k", unit: "whole" },
				]}
				treatment="blur"
			/>
		</MotionSource.Root>
	);
}

export const catalogContract = defineCatalogOwnerContract({
	id: "ui-motion-motion-effect",
	name: "MotionEffect.Entrance",
	role: "Scalar visual effect family that maps the nearest private MotionSource progress into presentation.",
	importStatement:
		'import * as MotionEffect from "@/components/ui/motion/effect";',
	chooseWhen: [
		"A reusable visual treatment should work with any supported scalar source strategy.",
	],
	chooseInstead: [
		"Use semantic primitives without motion when the treatment adds no hierarchy or interaction feedback.",
	],
	compounds: [
		"MotionEffect.Entrance",
		"MotionEffect.TextStagger",
		"MotionEffect.TextHighlight",
		"MotionEffect.Divider",
		"MotionEffect.TextShift",
		"MotionEffect.TextReplay",
		"MotionEffect.UnderlineText",
		"MotionEffect.Parallax",
		"MotionEffect.FrameWidth",
		"MotionEffect.Scramble",
		"MotionEffect.Number",
		"MotionEffect.Clip",
		"MotionEffect.CounterpartReveal",
		"MotionEffect.GridReveal",
		"MotionEffect.ScaleFade",
	],
	exclusions: [
		"Trigger listeners, scroll observers, reveal scheduling, public motion values, image loading, and semantic link/button ownership.",
		"Labeled dividers and essential-copy gating behind interaction-only sources.",
	],
	guarantees: [
		{
			label: "Complete scalar effect gallery",
			storyId: "ui-motion-motion-effect--effect-gallery",
		},
		{
			label: "Accessible deterministic text effects",
			storyId: "ui-motion-motion-effect--text-effects",
		},
		{
			label: "Grapheme, word, whole-segment, and styled text staggering",
			storyId: "ui-motion-motion-effect--text-stagger-modes",
		},
		{
			label: "Composed prefix, count-up value, and suffix reveal",
			storyId: "ui-motion-motion-effect--stat-reveal-composition",
		},
		{
			label: "Adaptive alternating image grid reveal",
			storyId: "ui-motion-motion-effect--grid-reveal-media",
		},
		{
			label: "Static-final image grid output",
			storyId: "ui-motion-motion-effect--grid-reveal-static-final",
		},
		{
			label: "Logical and radial media geometry",
			storyId: "ui-motion-motion-effect--geometric-media-effects",
		},
		{
			label: "Measured reversible counterpart layers",
			storyId: "ui-motion-motion-effect--counterpart-reveal",
		},
		{
			label: "Composable circle, swipe, and grid counterpart masks",
			storyId: "ui-motion-motion-effect--counterpart-reveal-strategies",
		},
		{
			label: "Counterpart reduced-motion final state",
			storyId: "ui-motion-motion-effect--counterpart-reveal-reduced-motion",
		},
		{
			label: "Hover and keyboard-focus text replay",
			storyId: "ui-motion-motion-effect--hover-text-replay",
		},
		{
			label: "Deterministic reversible progress",
			storyId: "ui-motion-motion-effect--deterministic-progress",
		},
		{
			label: "Measured multiline underline",
			storyId: "ui-motion-motion-effect--underline-owners",
		},
		{
			label: "Missing-source composition error",
			storyId: "ui-motion-motion-effect--requires-source",
		},
	],
	family: "UI",
	group: "Motion",
	sweepSpan: "full",
	previewTargets: [
		{
			id: "effect-gallery",
			name: "Shared scalar effect gallery",
			baseline: {},
			axes: [],
			stage: "wide",
			Render: EffectPreview,
		},
		{
			id: "stat-reveal-composition",
			name: "Statistic reveal composition",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: StatRevealPreview,
		},
	],
});
