"use client";
// Native specimen adapted from @/components/ui/primitives/InlineError.catalog.
import { useState } from "react";
import { Button } from "@/components/ui/primitives/Button";
import { InlineError } from "@/components/ui/primitives/InlineError";

function RecoveryExample({
	variant = "inline",
}: {
	variant?: "inline" | "card";
} = {}) {
	const [open, setOpen] = useState(true);
	return (
		<div className="max-w-2xl">
			<Button onClick={() => setOpen(true)}>Save preference</Button>
			<InlineError
				variant={variant}
				open={open}
				action={
					<Button size="sm" variant="bare" onClick={() => setOpen(false)}>
						Try again
					</Button>
				}
			>
				Could not save this preference. Your changes are still here.
			</InlineError>
		</div>
	);
}
const HeroSpecimenRender = () => <RecoveryExample />;
export default function HeroPreview91() {
	const HeroRender =
		HeroSpecimenRender as unknown as import("react").ComponentType<{
			coordinate: Record<string, unknown>;
		}>;
	return <HeroRender coordinate={{}} />;
}
