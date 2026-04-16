"use client";

import type * as React from "react";
import { useSettingsContext } from "@/components/ui/foundations/settingsContext";
import { ToggleInput } from "@/components/ui/input/ToggleInput";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";

const SETTINGS_OPTIONS: React.ComponentProps<typeof ToggleInput>["options"] = [
	{
		value: "reduce-motion",
		label: "Reduce motion",
		description:
			"Disables non-essential animations. Still respects system reduced-motion.",
	},
	{
		value: "large-text",
		label: "Increase text size",
		description: "Scales dashboard typography up by 10% for readability.",
	},
];

export default function SettingsPage() {
	const settings = useSettingsContext();

	if (!settings) {
		return null;
	}

	const selectedValues = [
		settings.motionDisabled ? "reduce-motion" : null,
		settings.smoothScrollAvailable && settings.smoothScrollDisabled
			? "disable-smooth-scroll"
			: null,
		settings.textScale > 1 ? "large-text" : null,
	].filter(Boolean) as string[];

	const options = settings.smoothScrollAvailable
		? [
				...SETTINGS_OPTIONS.slice(0, 1),
				{
					value: "disable-smooth-scroll",
					label: "Disable smooth scroll",
					description:
						"Uses immediate jumps for anchor links and desktop wheel scrolling.",
				},
				...SETTINGS_OPTIONS.slice(1),
			]
		: SETTINGS_OPTIONS;

	const handleSettingsChange = (values: string[]) => {
		settings.setMotionDisabled(values.includes("reduce-motion"));
		if (settings.smoothScrollAvailable) {
			settings.setSmoothScrollDisabled(
				values.includes("disable-smooth-scroll"),
			);
		}
		settings.setTextScale(values.includes("large-text") ? 1.1 : 1);
	};

	return (
		<Section
			padding="default"
			maxWidth="narrow"
			innerClassName="flex flex-col gap-6"
		>
			<header className="flex flex-col gap-2">
				<Text as="h1" variant="headingLg">
					Settings
				</Text>
				<Text variant="body" tone="muted">
					Accessibility preferences are stored locally and applied immediately.
				</Text>
			</header>

			<Panel display="flex" padding="md" gap="md" shadow="none">
				<ToggleInput
					label="Accessibility"
					options={options}
					value={selectedValues}
					onChange={handleSettingsChange}
				/>
			</Panel>
		</Section>
	);
}
