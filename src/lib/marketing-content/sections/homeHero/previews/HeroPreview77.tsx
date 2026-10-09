"use client";
// Native specimen adapted from @/components/ui/motion/effect/MotionEffect.catalog.
import { useState } from "react";
import * as MotionEffect from "@/components/ui/motion/effect/index";
import * as MotionSource from "@/components/ui/motion/source";
import { Button } from "@/components/ui/primitives/Button";
import { Panel } from "@/components/ui/primitives/surfaces";

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
export default EffectPreview;
