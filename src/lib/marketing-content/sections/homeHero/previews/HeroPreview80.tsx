"use client";
// Native specimen adapted from @/components/ui/motion/source/MotionSource.catalog.
import Link from "next/link";
import { useState } from "react";
import { focusRing } from "@/components/ui/foundations/focus";
import * as MotionEffect from "@/components/ui/motion/effect";
import * as MotionSource from "@/components/ui/motion/source/index";
import { Button } from "@/components/ui/primitives/Button";
import { Panel } from "@/components/ui/primitives/surfaces";

function SourcePreview() {
	const [active, setActive] = useState(false);
	return (
		<div className="grid max-w-3xl gap-5 p-6 sm:grid-cols-2">
			<MotionSource.Root
				asChild
				strategy={{ type: "hover", timing: "component" }}
			>
				<Link
					className={`rounded-lg border border-subtle p-5 text-xl ${focusRing.visibleDefault}`}
					href="/motion-source"
				>
					<MotionEffect.UnderlineText>
						Direct hover source
					</MotionEffect.UnderlineText>
				</Link>
			</MotionSource.Root>
			<Panel padding="md">
				<Button
					onClick={() => setActive((value) => !value)}
					size="sm"
					variant="secondary"
				>
					Toggle progress
				</Button>
				<MotionSource.Root strategy={{ type: "boolean", active }}>
					<MotionEffect.TextHighlight className="mt-4 block">
						Boolean source drives a neutral effect.
					</MotionEffect.TextHighlight>
				</MotionSource.Root>
			</Panel>
		</div>
	);
}
export default SourcePreview;
