"use client";

import * as React from "react";
import {
	buildSharedSettingsSections,
	type SettingsSection,
} from "@/app/(site)/_components/settings/sharedSettingsSections";
import { useSettingsContext } from "@/components/ui/foundations/settingsContext";
import { ToggleInput } from "@/components/ui/input/ToggleInput";
import type { AppRouteId } from "@/config/routes";
import { ProfileSettingsSection } from "../../settings/_components/ProfileSettingsSection";
import {
	defaultDashboardSidebarRouteIds,
	sanitizeDashboardSidebarRouteIds,
} from "../entities/pages/presentation";

type DashboardAppearance = "light" | "dark";

type StoredDashboardSettings = {
	dashboardAppearance?: DashboardAppearance;
	dashboardSidebarRouteIds?: AppRouteId[];
};

type DashboardSettingsContextValue = {
	dashboardAppearance: DashboardAppearance;
	setDashboardAppearance: (value: DashboardAppearance) => void;
	dashboardSidebarRouteIds: AppRouteId[];
	setDashboardSidebarRouteIds: (routeIds: AppRouteId[]) => void;
	toggleDashboardSidebarRoute: (routeId: AppRouteId) => void;
	sharedSections: SettingsSection[];
	dashboardSections: SettingsSection[];
};

const DASHBOARD_SETTINGS_STORAGE_KEY = "webvizion-dashboard-settings";
const DEFAULT_DASHBOARD_APPEARANCE: DashboardAppearance = "light";

const DashboardSettingsContext =
	React.createContext<DashboardSettingsContextValue | null>(null);

function isDashboardAppearance(value: unknown): value is DashboardAppearance {
	return value === "light" || value === "dark";
}

function readStoredDashboardSettings(storageKey: string) {
	try {
		const raw = localStorage.getItem(storageKey);
		if (!raw) return null;

		const parsed = JSON.parse(raw) as StoredDashboardSettings;
		if (typeof parsed !== "object" || parsed === null) return null;

		return parsed;
	} catch {
		return null;
	}
}

function writeStoredDashboardSettings(
	storageKey: string,
	settings: StoredDashboardSettings,
) {
	try {
		localStorage.setItem(storageKey, JSON.stringify(settings));
	} catch {
		// Ignore storage failures such as private browsing restrictions.
	}
}

function DashboardAppearanceSection({
	dashboardAppearance,
	setDashboardAppearance,
}: {
	dashboardAppearance: DashboardAppearance;
	setDashboardAppearance: (value: DashboardAppearance) => void;
}) {
	const selectedValues = dashboardAppearance === "dark" ? ["dark-theme"] : [];

	return (
		<ToggleInput
			label="Appearance"
			value={selectedValues}
			onChange={(values) =>
				setDashboardAppearance(values.includes("dark-theme") ? "dark" : "light")
			}
			options={[
				{
					value: "dark-theme",
					label: "Dark theme",
					description: "Applies a dark appearance to the dashboard only.",
				},
			]}
		/>
	);
}

export function DashboardSettingsProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const settings = useSettingsContext();
	const [dashboardAppearance, setDashboardAppearance] =
		React.useState<DashboardAppearance>(DEFAULT_DASHBOARD_APPEARANCE);
	const [dashboardSidebarRouteIds, setDashboardSidebarRouteIdsState] =
		React.useState<AppRouteId[]>(() =>
			sanitizeDashboardSidebarRouteIds(defaultDashboardSidebarRouteIds),
		);
	const hasHydrated = React.useRef(false);

	if (!settings) {
		throw new Error(
			"DashboardSettingsProvider must be used within SettingsProvider.",
		);
	}

	React.useEffect(() => {
		if (!hasHydrated.current) return;

		writeStoredDashboardSettings(DASHBOARD_SETTINGS_STORAGE_KEY, {
			dashboardAppearance,
			dashboardSidebarRouteIds,
		});
	}, [dashboardAppearance, dashboardSidebarRouteIds]);

	React.useEffect(() => {
		const stored = readStoredDashboardSettings(DASHBOARD_SETTINGS_STORAGE_KEY);
		if (isDashboardAppearance(stored?.dashboardAppearance)) {
			setDashboardAppearance(stored.dashboardAppearance);
		}
		if (Array.isArray(stored?.dashboardSidebarRouteIds)) {
			setDashboardSidebarRouteIdsState(
				sanitizeDashboardSidebarRouteIds(stored.dashboardSidebarRouteIds),
			);
		}
		hasHydrated.current = true;
	}, []);

	React.useEffect(() => {
		const handleStorage = (event: StorageEvent) => {
			if (event.key !== DASHBOARD_SETTINGS_STORAGE_KEY) return;

			const stored = readStoredDashboardSettings(
				DASHBOARD_SETTINGS_STORAGE_KEY,
			);
			if (isDashboardAppearance(stored?.dashboardAppearance)) {
				setDashboardAppearance(stored.dashboardAppearance);
			} else {
				setDashboardAppearance(DEFAULT_DASHBOARD_APPEARANCE);
			}

			if (Array.isArray(stored?.dashboardSidebarRouteIds)) {
				setDashboardSidebarRouteIdsState(
					sanitizeDashboardSidebarRouteIds(stored.dashboardSidebarRouteIds),
				);
			} else {
				setDashboardSidebarRouteIdsState(
					sanitizeDashboardSidebarRouteIds(defaultDashboardSidebarRouteIds),
				);
			}
		};

		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, []);

	function setDashboardSidebarRouteIds(routeIds: AppRouteId[]) {
		setDashboardSidebarRouteIdsState(
			sanitizeDashboardSidebarRouteIds(routeIds),
		);
	}

	function toggleDashboardSidebarRoute(routeId: AppRouteId) {
		setDashboardSidebarRouteIdsState((current) =>
			current.includes(routeId)
				? current.filter((currentRouteId) => currentRouteId !== routeId)
				: sanitizeDashboardSidebarRouteIds([...current, routeId]),
		);
	}

	const sharedSections = buildSharedSettingsSections(settings);
	const dashboardSections: SettingsSection[] = [
		{
			id: "profile",
			content: <ProfileSettingsSection />,
		},
		{
			id: "appearance",
			content: (
				<DashboardAppearanceSection
					dashboardAppearance={dashboardAppearance}
					setDashboardAppearance={setDashboardAppearance}
				/>
			),
		},
	];

	return (
		<DashboardSettingsContext.Provider
			value={{
				dashboardAppearance,
				setDashboardAppearance,
				dashboardSidebarRouteIds,
				setDashboardSidebarRouteIds,
				toggleDashboardSidebarRoute,
				sharedSections,
				dashboardSections,
			}}
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
