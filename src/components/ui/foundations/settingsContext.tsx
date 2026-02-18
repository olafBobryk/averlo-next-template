"use client";

import * as React from "react";

type SettingsContextValue = {
	motionDisabled: boolean;
	setMotionDisabled: (value: boolean) => void;
};

type SettingsProviderProps = {
	children: React.ReactNode;
	defaultMotionDisabled?: boolean;
	storageKey?: string | null;
};

type StoredSettings = {
	motionDisabled?: boolean;
};

const DEFAULT_STORAGE_KEY = "webvizion-ui-settings";

const SettingsContext = React.createContext<SettingsContextValue | undefined>(
	undefined,
);

const readStoredSettings = (storageKey: string) => {
	try {
		const raw = localStorage.getItem(storageKey);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as StoredSettings;
		if (typeof parsed !== "object" || parsed === null) return null;
		return parsed;
	} catch {
		return null;
	}
};

const writeStoredSettings = (storageKey: string, settings: StoredSettings) => {
	try {
		localStorage.setItem(storageKey, JSON.stringify(settings));
	} catch {
		// Ignore storage failures (private mode, quota, etc.).
	}
};

export function SettingsProvider({
	children,
	defaultMotionDisabled = false,
	storageKey = DEFAULT_STORAGE_KEY,
}: SettingsProviderProps) {
	const [motionDisabled, setMotionDisabled] = React.useState(
		defaultMotionDisabled,
	);
	const hasHydrated = React.useRef(false);

	React.useEffect(() => {
		if (!storageKey || !hasHydrated.current) return;
		writeStoredSettings(storageKey, { motionDisabled });
	}, [motionDisabled, storageKey]);

	React.useEffect(() => {
		if (!storageKey) {
			hasHydrated.current = true;
			return;
		}
		const stored = readStoredSettings(storageKey);
		if (typeof stored?.motionDisabled === "boolean") {
			setMotionDisabled(stored.motionDisabled);
		}
		hasHydrated.current = true;
	}, [storageKey]);

	React.useEffect(() => {
		if (!storageKey) return;
		const handleStorage = (event: StorageEvent) => {
			if (event.key !== storageKey) return;
			const stored = readStoredSettings(storageKey);
			if (typeof stored?.motionDisabled === "boolean") {
				setMotionDisabled(stored.motionDisabled);
			}
		};

		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, [storageKey]);

	const value = React.useMemo(
		() => ({ motionDisabled, setMotionDisabled }),
		[motionDisabled],
	);

	return (
		<SettingsContext.Provider value={value}>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettingsContext() {
	return React.useContext(SettingsContext);
}
