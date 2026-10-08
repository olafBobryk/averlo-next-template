"use client";

import { useState } from "react";
import { defineCatalogOwnerContract } from "@/lib/component-catalog/contract";
import { Button } from "./Button";
import { StatusMessage } from "./StatusMessage";

function ControlledPresenceExample() {
	const [open, setOpen] = useState(true);
	return (
		<div className="grid gap-3">
			<Button onClick={() => setOpen((current) => !current)}>
				{open ? "Hide notice" : "Show notice"}
			</Button>
			<div className="grid gap-0">
				<StatusMessage.Presence open={open} gap="sm" tone="info">
					A controlled contextual notice.
				</StatusMessage.Presence>
				<p>Content following the owned presence gap.</p>
			</div>
		</div>
	);
}
function CatalogPreview1() {
	const render = () => (
		<div className="grid gap-3">
			<StatusMessage tone="info" heading="Shared workspace">
				This workspace is visible to invited members.
			</StatusMessage>
			<StatusMessage
				tone="success"
				heading="Ready to continue"
				descriptionOnNewLine
			>
				Security settings are complete.
			</StatusMessage>
			<StatusMessage
				tone="warning"
				heading="Review required"
				onDismiss={() => undefined}
			>
				Billing details need review.
			</StatusMessage>
			<StatusMessage
				tone="danger"
				heading="Deletion scheduled"
				action={<Button size="sm">Review</Button>}
			>
				This environment is scheduled for deletion.
			</StatusMessage>
		</div>
	);
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}
function CatalogPreview2() {
	const render = () => <ControlledPresenceExample />;
	return (
		render as unknown as (
			args: Record<string, unknown>,
		) => ReturnType<typeof render>
	)({ ...{}, ...{} } as never);
}

export const catalogContract = defineCatalogOwnerContract({
	id: "ui-primitives-status-message",
	name: "StatusMessage",
	role: "Persistent context or an operational notice while surrounding content remains usable.",
	importStatement:
		'import { StatusMessage } from "@/components/ui/primitives/StatusMessage";',
	chooseWhen: [
		"Context remains relevant until its surrounding condition changes or the user proceeds.",
		"Use heading and decorative icon for recognition, action for local recovery, and onDismiss only when the notice can safely be dismissed.",
		"Descriptions share the heading line by default; descriptionOnNewLine places them below. Danger announces an alert, other tones a status; role can be explicitly overridden.",
	],
	chooseInstead: [
		"Use Field for validation, InlineError for a small local action failure, toast for transient action outcomes, and state components for whole-region failure or emptiness.",
	],
	compounds: ["StatusMessage.Presence"],
	exclusions: [
		"Submission-result banners chosen only for their color.",
		"A second parent gap around StatusMessage.Presence's owned spacing.",
	],
	guarantees: [
		{
			label: "Heading, action, dismissal, description layout and announcements",
			storyId: "ui-primitives-status-message--actionable-notices",
		},
		{
			label: "Long text and narrow layouts",
			storyId: "ui-primitives-status-message--narrow-notice",
		},
		{
			label: "Explicit announcement role override",
			storyId: "ui-primitives-status-message--explicit-role",
		},
		{
			label: "Semantic contextual tones",
			storyId: "ui-primitives-status-message--semantic-tones",
		},
		{
			label: "Controlled presence and removal",
			storyId: "ui-primitives-status-message--controlled-presence",
		},
	],

	family: "UI",
	group: "Primitives",
	previewTargets: [
		{
			id: "semantic-tones",
			name: "Semantic contextual tones",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview1,
		},
		{
			id: "controlled-presence",
			name: "Controlled presence and removal",
			baseline: {},
			axes: [],
			stage: "standard",
			Render: CatalogPreview2,
		},
	],
});
