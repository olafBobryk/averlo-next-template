"use client";

import type * as React from "react";
import { useSettingsContext } from "@/components/ui/foundations/settingsContext";
import { ToggleInput } from "@/components/ui/input/ToggleInput";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";

const BASE_SETTINGS_OPTIONS: React.ComponentProps<
	typeof ToggleInput
>["options"] = [
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

export function SiteSettingsScreen() {
	const settings = useSettingsContext();

	if (!settings) {
		return null;
	}

	const resolvedSettings = settings;

	const selectedValues = [
		resolvedSettings.motionDisabled ? "reduce-motion" : null,
		resolvedSettings.smoothScrollAvailable &&
		resolvedSettings.smoothScrollDisabled
			? "disable-smooth-scroll"
			: null,
		resolvedSettings.textScale > 1 ? "large-text" : null,
	].filter(Boolean) as string[];

	const options = resolvedSettings.smoothScrollAvailable
		? [
				...BASE_SETTINGS_OPTIONS.slice(0, 1),
				{
					value: "disable-smooth-scroll",
					label: "Disable smooth scroll",
					description:
						"Uses immediate jumps for anchor links and desktop wheel scrolling.",
				},
				...BASE_SETTINGS_OPTIONS.slice(1),
			]
		: BASE_SETTINGS_OPTIONS;

	function handleSettingsChange(values: string[]) {
		resolvedSettings.setMotionDisabled(values.includes("reduce-motion"));
		if (resolvedSettings.smoothScrollAvailable) {
			resolvedSettings.setSmoothScrollDisabled(
				values.includes("disable-smooth-scroll"),
			);
		}
		resolvedSettings.setTextScale(values.includes("large-text") ? 1.1 : 1);
	}

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
