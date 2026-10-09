"use client";
// Native specimen adapted from @/components/ui/motion/presence/ContentPresence.catalog.
import { useState } from "react";
import { ContentPresence } from "@/components/ui/motion/presence/index";
import { Button } from "@/components/ui/primitives/Button";

function PresenceExample({
	axis = "y",
}: {
	axis?: "x" | "y";
}) {
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
const HeroSpecimenRender = ({
	coordinate,
}: {
	coordinate: Record<string, unknown>;
}) => <PresenceExample axis={coordinate.axis as "x" | "y"} />;
export default function HeroPreview78() {
	const HeroRender =
		HeroSpecimenRender as unknown as import("react").ComponentType<{
			coordinate: Record<string, unknown>;
		}>;
	return <HeroRender coordinate={{ axis: "y" }} />;
}
