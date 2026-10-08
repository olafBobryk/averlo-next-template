"use client";
import { useState } from "react";
import { defineCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Button } from "./Button";
import { InlineError } from "./InlineError";

export function RecoveryExample({
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
export const catalogContract = defineCatalogOwnerContract({
	id: "ui-primitives-inline-error",
	name: "InlineError",
	family: "UI",
	group: "Primitives",
	role: "A recoverable operational error beside its affected action. The default inline variant follows text flow; the card variant bounds an action-level failure in page content or beside a composer using shared Card chrome. Both retain one alert announcement and controlled presence.",
	importStatement:
		'import { InlineError } from "@/components/ui/primitives/InlineError";',
	chooseWhen: [
		"Message and recovery action share inline text flow, wrapping naturally only when the available width requires it.",
		"An action failed locally and the surrounding content remains usable.",
		"Supply a recovery action when retry can continue in place; preserve user input.",
		"Use card for standalone failures in page content or beside a composer, and inline within an already bounded surface.",
	],
	chooseInstead: [
		"Use Field for invalid input, StatusMessage for persistent context, region state for unavailable content, and toast for transient outcomes.",
	],
	compounds: [],
	exclusions: [
		"Duplicate announcements through a toast or status banner.",
		"Replacing a field’s accessible validation message.",
	],
	guarantees: [
		{
			label: "Card presentation, recovery and narrow wrapping",
			storyId: "ui-primitives-inline-error--card-recovery",
		},
		{
			label: "Recovery and controlled removal",
			storyId: "ui-primitives-inline-error--recovery",
		},
		{
			label: "Long message wrapping",
			storyId: "ui-primitives-inline-error--long-message",
		},
	],
	previewTargets: [
		{
			id: "recovery",
			name: "Local recovery",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: () => <RecoveryExample />,
		},
	],
});
