"use client";

import * as React from "react";
import {
	buildSharedSettingsSections,
	type SettingsSection,
} from "@/app/(site)/_components/settings/sharedSettingsSections";
import { useSettingsContext } from "@/components/ui/foundations/settingsContext";

type MarketingSettingsContextValue = {
	sharedSections: SettingsSection[];
	marketingSections: SettingsSection[];
};

const MarketingSettingsContext =
	React.createContext<MarketingSettingsContextValue | null>(null);

export function MarketingSettingsProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const settings = useSettingsContext();

	if (!settings) {
		throw new Error(
			"MarketingSettingsProvider must be used within SettingsProvider.",
		);
	}

	const sharedSections = buildSharedSettingsSections(settings);
	const marketingSections: SettingsSection[] = [];

	return (
		<MarketingSettingsContext.Provider
			value={{ sharedSections, marketingSections }}
		>
			{children}
		</MarketingSettingsContext.Provider>
	);
}

export function useMarketingSettingsContext() {
	const context = React.useContext(MarketingSettingsContext);

	if (!context) {
		throw new Error(
			"useMarketingSettingsContext must be used within MarketingSettingsProvider.",
		);
	}

	return context;
}
