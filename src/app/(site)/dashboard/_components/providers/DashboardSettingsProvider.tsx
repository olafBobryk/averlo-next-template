"use client";

import * as React from "react";
import {
	buildSharedSettingsSections,
	type SettingsSection,
} from "@/app/(site)/_components/settings/sharedSettingsSections";
import { useSettingsContext } from "@/components/ui/foundations/settingsContext";
import {
	AccountDetailsSettingsSection,
	SecuritySettingsSection,
} from "../../settings/_components/AccountSettingsSections";
import { ProfileSettingsSection } from "../../settings/_components/ProfileSettingsSection";
import type { DashboardSettingsSnapshot } from "../../settings/_components/settingsSnapshot";

type DashboardSettingsContextValue = {
	sharedSections: SettingsSection[];
	dashboardSections: SettingsSection[];
	settingsSnapshot: DashboardSettingsSnapshot;
};

const DashboardSettingsContext =
	React.createContext<DashboardSettingsContextValue | null>(null);

export function DashboardSettingsProvider({
	children,
	settingsSnapshot,
}: {
	children: React.ReactNode;
	settingsSnapshot: DashboardSettingsSnapshot;
}) {
	const settings = useSettingsContext();

	if (!settings) {
		throw new Error(
			"DashboardSettingsProvider must be used within SettingsProvider.",
		);
	}

	const sharedSections = buildSharedSettingsSections(settings);
	const dashboardSections: SettingsSection[] = [
		{
			id: "profile",
			content: <ProfileSettingsSection />,
		},
		{
			id: "account-details",
			content: (
				<AccountDetailsSettingsSection
					joinedAtLabel={settingsSnapshot.joinedAtLabel}
				/>
			),
		},
		{
			id: "security-sign-in",
			content: (
				<SecuritySettingsSection
					authMethods={settingsSnapshot.authMethods}
					identities={settingsSnapshot.identities}
				/>
			),
		},
	];

	return (
		<DashboardSettingsContext.Provider
			value={{ sharedSections, dashboardSections, settingsSnapshot }}
		>
			{children}
		</DashboardSettingsContext.Provider>
	);
}

export function useDashboardSettingsContext() {
	const context = React.useContext(DashboardSettingsContext);

	if (!context) {
		throw new Error(
			"useDashboardSettingsContext must be used within DashboardSettingsProvider.",
		);
	}

	return context;
}
