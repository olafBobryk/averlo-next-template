"use client";

import { useState } from "react";
import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";
import type { LoadingScreenPhase } from "./_source/LoadingScreenMount";
import RiveLoadingAnimation from "./_source/RiveLoadingAnimation";

const phases: LoadingScreenPhase[] = [
	"loading",
	"revealing",
	"transitioning",
	"done",
];

export function LoadingScreenPreview() {
	const [phase, setPhase] = useState<LoadingScreenPhase>("revealing");

	return (
		<div className="flex flex-col gap-4">
			<div className="overflow-hidden rounded-2xl border border-border/15 bg-background px-6 py-10">
				<div className="flex min-h-48 items-center justify-center">
					{phase === "done" ? (
						<Text variant="body" tone="muted">
							Exit state reached. Use the controls below to replay a phase.
						</Text>
					) : (
						<RiveLoadingAnimation
							phase={phase}
							onLoadingComplete={() => {}}
							onRevealComplete={() => {}}
						/>
					)}
				</div>
			</div>
			<div className="flex flex-wrap gap-2">
				{phases.map((value) => (
					<Button
						key={value}
						size="sm"
						variant={phase === value ? "primary" : "secondary"}
						onClick={() => setPhase(value)}
					>
						{value}
					</Button>
				))}
			</div>
		</div>
	);
}
