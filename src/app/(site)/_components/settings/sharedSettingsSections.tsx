"use client";

import type * as React from "react";
import type { useSettingsContext } from "@/components/ui/foundations/settingsContext";
import { ToggleInput } from "@/components/ui/input/ToggleInput";

export type SettingsSection = {
	id: string;
	content: React.ReactNode;
};

export type BaseSettingsContext = NonNullable<
	ReturnType<typeof useSettingsContext>
>;

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
		description: "Scales interface typography up by 10% for readability.",
	},
];

function AccessibilitySettingsSection({
	settings,
}: {
	settings: BaseSettingsContext;
}) {
	const selectedValues = [
		settings.motionDisabled ? "reduce-motion" : null,
		settings.smoothScrollAvailable && settings.smoothScrollDisabled
			? "disable-smooth-scroll"
			: null,
		settings.textScale > 1 ? "large-text" : null,
	].filter(Boolean) as string[];

	const options = settings.smoothScrollAvailable
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
		settings.setMotionDisabled(values.includes("reduce-motion"));
		if (settings.smoothScrollAvailable) {
			settings.setSmoothScrollDisabled(
				values.includes("disable-smooth-scroll"),
			);
		}
		settings.setTextScale(values.includes("large-text") ? 1.1 : 1);
	}

	return (
		<ToggleInput
			label="Accessibility"
			options={options}
			value={selectedValues}
			onChange={handleSettingsChange}
		/>
	);
}

export function buildSharedSettingsSections(
	settings: BaseSettingsContext,
): SettingsSection[] {
	return [
		{
			id: "accessibility",
			content: <AccessibilitySettingsSection settings={settings} />,
		},
	];
}
